'use client';

import { Header, Sidebar, ChatArea } from '@/components';

export default function Home() {
  return (
    <main className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <ChatArea />
      </div>
    </main>
  );
}
