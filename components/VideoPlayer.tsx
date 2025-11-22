'use client';

import { useEffect, useRef } from 'react';
import { useLearningStore } from '@/store/learningStore';

export default function VideoPlayer() {
  const { selectedModule, videoTimestamp } = useLearningStore();
  const playerRef = useRef<any>(null);

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  useEffect(() => {
    if (playerRef.current && videoTimestamp !== null) {
      playerRef.current.seekTo(videoTimestamp, true);
    }
  }, [videoTimestamp]);

  if (!selectedModule) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 h-96 flex items-center justify-center">
        <p className="text-gray-500">Select a module to start learning</p>
      </div>
    );
  }

  const videoId = selectedModule.video_url?.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
  )?.[1];

  if (!videoId) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 h-96 flex items-center justify-center">
        <p className="text-red-500">Invalid video URL</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="aspect-video">
        <iframe
          ref={(iframe) => {
            if (iframe && window.YT) {
              playerRef.current = new window.YT.Player(iframe, {
                videoId,
                playerVars: {
                  autoplay: 0,
                  modestbranding: 1,
                },
              });
            }
          }}
          src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{selectedModule.title}</h3>
        <p className="text-sm text-gray-600 mt-1">{selectedModule.description}</p>
      </div>
    </div>
  );
}