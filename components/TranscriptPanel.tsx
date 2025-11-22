'use client';

import { useState, useEffect } from 'react';
import { useLearningStore } from '@/store/learningStore';

export default function TranscriptPanel() {
  const { selectedModule, transcript, setTranscript, setVideoTimestamp } = useLearningStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedModule?.video_url) {
      loadTranscript();
    }
  }, [selectedModule]);

  const loadTranscript = async () => {
    if (!selectedModule) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/get-transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_url: selectedModule.video_url }),
      });

      if (!response.ok) {
        throw new Error('Failed to load transcript');
      }

      const data = await response.json();
      setTranscript(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedModule) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 h-96">
        <h3 className="text-lg font-semibold mb-4">Transcript</h3>
        <p className="text-gray-500 text-sm">Select a module to view transcript</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 h-96 flex items-center justify-center">
        <p className="text-gray-500">Loading transcript...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 h-96">
        <h3 className="text-lg font-semibold mb-4">Transcript</h3>
        <div className="bg-red-50 border border-red-200 rounded p-3">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-96 flex flex-col">
      <h3 className="text-lg font-semibold mb-4">Transcript</h3>
      <div className="flex-1 overflow-y-auto space-y-2">
        {transcript?.transcript?.map((item: any, index: number) => (
          <button
            key={index}
            onClick={() => setVideoTimestamp(item.start)}
            className="w-full text-left p-2 rounded hover:bg-gray-50 transition-colors group"
          >
            <span className="text-xs text-blue-600 font-mono group-hover:underline">
              {formatTime(item.start)}
            </span>
            <p className="text-sm text-gray-700 mt-1">{item.text}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}