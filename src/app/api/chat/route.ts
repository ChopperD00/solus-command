import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { INTENT_CLASSIFICATION_PROMPT, routeToModel } from '@/lib/models';
import { IntentClassification, ModelId } from '@/types';

// Initialize clients
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

// Helper to create SSE response
function createSSEResponse() {
  const encoder = new TextEncoder();
  let controller: ReadableStreamDefaultController<Uint8Array>;
  
  const stream = new ReadableStream({
    start(c) {
      controller = c;
    },
  });

  const send = (event: string, data: unknown) => {
    const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    controller.enqueue(encoder.encode(message));
  };

  const close = () => {
    controller.close();
  };

  return { stream, send, close };
}

// Classify intent using Claude
async function classifyIntent(message: string): Promise<IntentClassification> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: `${INTENT_CLASSIFICATION_PROMPT}\n\nUser message: "${message}"`,
        },
      ],
    });

    const content = response.content[0];
    if (content.type === 'text') {
      const parsed = JSON.parse(content.text);
      return {
        primaryIntent: parsed.primaryIntent,
        confidence: parsed.confidence,
        suggestedModel: routeToModel(parsed.primaryIntent),
        reasoning: parsed.reasoning,
        keywords: parsed.keywords,
      };
    }
  } catch (error) {
    console.error('Intent classification error:', error);
  }

  // Default fallback
  return {
    primaryIntent: 'conversation',
    confidence: 0.5,
    suggestedModel: 'claude',
    reasoning: 'Fallback to default',
    keywords: [],
  };
}

// Stream from Claude
async function streamClaude(
  message: string,
  send: (event: string, data: unknown) => void
) {
  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [{ role: 'user', content: message }],
  });

  for await (const event of stream) {
    if (event.type === 'content_block_delta') {
      const delta = event.delta;
      if ('text' in delta) {
        send('content', delta.text);
      }
    }
  }
}

// Stream from Gemini
async function streamGemini(
  message: string,
  send: (event: string, data: unknown) => void
) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContentStream(message);

  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) {
      send('content', text);
    }
  }
}

// Perplexity API call (non-streaming for now)
async function callPerplexity(
  message: string,
  send: (event: string, data: unknown) => void
) {
  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-small-128k-online',
      messages: [{ role: 'user', content: message }],
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Perplexity API error: ${response.status}`);
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    throw new Error('No response body');
  }

  let citations: string[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') continue;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            send('content', content);
          }
          // Extract citations if available
          if (parsed.citations) {
            citations = parsed.citations;
          }
        } catch {
          // Skip invalid JSON
        }
      }
    }
  }

  if (citations.length > 0) {
    send('citations', citations);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, model: requestedModel, autoRoute = true } = await request.json();

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { stream, send, close } = createSSEResponse();

    // Process in background
    (async () => {
      try {
        let targetModel: ModelId = requestedModel || 'claude';

        // Auto-route if enabled
        if (autoRoute && !requestedModel) {
          const intent = await classifyIntent(message);
          send('intent', intent);
          targetModel = intent.suggestedModel;
        }

        // Route to appropriate model
        switch (targetModel) {
          case 'gemini':
            await streamGemini(message, send);
            break;
          case 'perplexity':
            await callPerplexity(message, send);
            break;
          case 'claude':
          default:
            await streamClaude(message, send);
            break;
        }

        send('done', {});
      } catch (error) {
        console.error('Stream error:', error);
        send('error', { message: 'An error occurred while processing your request' });
      } finally {
        close();
      }
    })();

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
