import { NextRequest, NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';

/**
 * POST /api/get-transcript
 * Fetches YouTube video transcript
 */
export async function POST(request: NextRequest) {
  try {
    const { video_url } = await request.json();

    if (!video_url) {
      return NextResponse.json(
        { error: 'video_url is required' },
        { status: 400 }
      );
    }

    // Extract video ID from URL
    const videoIdMatch = video_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (!videoIdMatch) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    const videoId = videoIdMatch[1];

    // Fetch transcript
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);

    if (!transcript || transcript.length === 0) {
      return NextResponse.json(
        { error: 'Transcript not available for this video' },
        { status: 404 }
      );
    }

    // Format transcript
    const formattedTranscript = transcript.map((item: any) => ({
      text: item.text,
      start: item.offset / 1000, // Convert to seconds
      duration: item.duration / 1000,
    }));

    const fullText = formattedTranscript.map((item: any) => item.text).join(' ');

    return NextResponse.json({
      transcript: formattedTranscript,
      full_text: fullText,
    });
  } catch (error: any) {
    console.error('Error fetching transcript:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch transcript' },
      { status: 500 }
    );
  }
}