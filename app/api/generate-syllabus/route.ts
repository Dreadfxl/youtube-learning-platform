import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/generate-syllabus
 * Generates a learning syllabus using Perplexity API (sonar-pro model)
 */
export async function POST(request: NextRequest) {
  try {
    const { topic } = await request.json();

    if (!topic || topic.trim() === '') {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Perplexity API key not configured' },
        { status: 500 }
      );
    }

    // Call Perplexity API
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [
          {
            role: 'system',
            content: 'You are a curriculum designer. Generate a structured 5-module learning syllabus with curated YouTube video recommendations. Return ONLY valid JSON with this structure: {"topic": "...", "modules": [{"id": 1, "title": "...", "description": "...", "video_url": "https://www.youtube.com/watch?v=...", "channel": "...", "duration": "..."}]}',
          },
          {
            role: 'user',
            content: `Create a 5-module learning syllabus for: ${topic}. Include specific YouTube video URLs for each module.`,
          },
        ],
        temperature: 0.2,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.statusText}`);
    }

    const data = await response.json();
    const syllabusText = data.choices[0]?.message?.content || '{}';
    
    // Parse JSON from response
    let syllabus;
    try {
      syllabus = JSON.parse(syllabusText);
    } catch (e) {
      // Fallback: try to extract JSON from markdown code blocks
      const jsonMatch = syllabusText.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        syllabus = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error('Failed to parse syllabus JSON');
      }
    }

    // Add timestamp
    syllabus.generated_at = new Date().toISOString();

    return NextResponse.json(syllabus);
  } catch (error: any) {
    console.error('Error generating syllabus:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate syllabus' },
      { status: 500 }
    );
  }
}