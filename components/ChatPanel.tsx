'use client';

import { useState } from 'react';
import { useLearningStore } from '@/store/learningStore';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPanel() {
  const { selectedModule, transcript, setVideoTimestamp } = useLearningStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !transcript) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: input,
          transcript: transcript.full_text,
          chat_history: messages,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        role: 'assistant',
        content: `Error: ${error.message}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimestampClick = (timeString: string) => {
    const match = timeString.match(/(\d{1,2}):(\d{2})/);
    if (match) {
      const [_, minutes, seconds] = match;
      const totalSeconds = parseInt(minutes) * 60 + parseInt(seconds);
      setVideoTimestamp(totalSeconds);
    }
  };

  if (!selectedModule) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 h-96">
        <h3 className="text-lg font-semibold mb-4">AI Tutor</h3>
        <p className="text-gray-500 text-sm">Select a module to start asking questions</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-96 flex flex-col">
      <h3 className="text-lg font-semibold mb-4">AI Tutor</h3>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.length === 0 && (
          <p className="text-gray-500 text-sm">
            Ask questions about the video content...
          </p>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              msg.role === 'user'
                ? 'bg-blue-50 ml-8'
                : 'bg-gray-50 mr-8'
            }`}
          >
            <p className="text-xs font-semibold mb-1 text-gray-600">
              {msg.role === 'user' ? 'You' : 'AI Tutor'}
            </p>
            <p
              className="text-sm text-gray-800 whitespace-pre-wrap"
              dangerouslySetInnerHTML={{
                __html: msg.content.replace(
                  /(\d{1,2}:\d{2})/g,
                  '<button class="text-blue-600 underline hover:text-blue-800" onclick="window.handleTimestampClick(\'$1\')">$1</button>'
                ),
              }}
            />
          </div>
        ))}
        {isLoading && (
          <div className="bg-gray-50 p-3 rounded-lg mr-8">
            <p className="text-sm text-gray-500">AI is thinking...</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about the video..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          disabled={isLoading || !transcript}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim() || !transcript}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
        >
          Send
        </button>
      </form>
    </div>
  );
}