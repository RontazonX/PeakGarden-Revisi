import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const { message, sensorData } = await req.json();

    // Use GEMINI_API_KEY for standard hosting, fallback to NEXT_PUBLIC_GEMINI_API_KEY for AI Studio preview
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is not configured. Please set GEMINI_API_KEY in your environment variables.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are an advanced AI Assistant for a Smart Garden dashboard.
The current real-time sensor data is:
- Temperature: ${sensorData.temp}°C
- Soil Moisture: ${sensorData.moisture}%
- Pump Status: ${sensorData.pump === 1 ? 'ON' : 'OFF'}

The user is asking: "${message}"

Provide a helpful, concise, and insightful response in markdown format. Use your advanced reasoning to give gardening tips or system diagnostics based on the sensor data if relevant.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro', // Using the latest advanced model for better reasoning
      contents: prompt,
    });

    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate response' },
      { status: 500 }
    );
  }
}
