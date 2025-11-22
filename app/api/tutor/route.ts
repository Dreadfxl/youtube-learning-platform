import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/tutor
 * AI tutoring using Google Gemini 1.5 Flash
 */
export async function POST(request: NextRequest) {
  try {
    const { question, transcript, chat_history } = await request.json();

    if (!question || !transcript) {
      return NextResponse.json(
        { error: 'question and transcript are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    // Construct prompt with context
    const systemPrompt = `You are an AI tutor helping students understand video content. Use the provided video transcript to answer questions accurately. When referencing specific parts of the video, cite the timestamp (e.g., "At 5:30..."). Be concise and educational.`;

    const contextPrompt = `Video Transcript:\n${transcript}\n\nStudent Question: ${question}`;

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemPrompt}\n\n${contextPrompt}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates[0]?.content?.parts[0]?.text || 'Unable to generate response.';

    // Extract timestamp references (e.g., "5:30", "12:45")
    const timestampRegex = /(\d{1,2}:\d{2})/g;
    const timestampMatches = aiResponse.match(timestampRegex) || [];
    const timestampReferences = timestampMatches.map((ts: string) => {
      const [minutes, seconds] = ts.split(':').map(Number);
      return {
        text: `At ${ts}`,
        seconds: minutes * 60 + seconds,
      };
    });

    return NextResponse.json({
      response: aiResponse,
      timestamp_references: timestampReferences,
    });
  } catch (error: any) {
    console.error('Error calling tutor API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get tutor response' },
      { status: 500 }
    );
  }
}