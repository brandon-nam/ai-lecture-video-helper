import Groq from 'groq-sdk';
import 'dotenv/config';

interface Caption {
    text: string;
    start?: number;
    end?: number;
}

interface Summary {
    id: string;
    title: string;
    timestamp: string;
    summary: string;
    details: string[];
}

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert lecture summarizer. Given lecture captions/transcript, identify the key topics discussed and create structured summaries.

For each major topic, provide:
- A clear, concise title
- An approximate timestamp (based on position in transcript)
- A 1-2 sentence summary
- 3-5 key bullet points

Respond ONLY with valid JSON in this exact format:
{
  "summaries": [
    {
      "id": "1",
      "title": "Topic Title",
      "timestamp": "MM:SS",
      "summary": "Brief summary of this topic.",
      "details": ["Key point 1", "Key point 2", "Key point 3"]
    }
  ]
}`;

export async function generateLectureSummary(captions: Caption[]): Promise<Summary[]> {
    if (!process.env.GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY is not set in environment variables');
    }

    // Combine captions into a single transcript
    const transcript = captions.map(c => c.text).join(' ');

    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: SYSTEM_PROMPT,
            },
            {
                role: 'user',
                content: `Lecture Transcript:\n${transcript}`,
            },
        ],
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' },
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
        throw new Error('No response from Groq');
    }

    const parsed = JSON.parse(response);
    return parsed.summaries;
}
