import { Controller, Post, Body } from '@nestjs/common';
import { TraditionalMedicineMongoModel } from './traditional-medicine.mongo.schema';
import fetch from 'node-fetch';

@Controller('ai')
export class TraditionalMedicineAiController {
  @Post('recommend-traditional')
  async recommendTraditional(@Body() body: { symptoms: string }) {
    const remedies = await TraditionalMedicineMongoModel.find();
    const prompt = `
User symptoms: ${body.symptoms}
Traditional remedies: ${JSON.stringify(remedies)}
Which remedies are most relevant for these symptoms? Return a list with explanations in both English and Amharic if available.`;
    const geminiResponse = await this.geminiApiCall(prompt);
    return { recommendations: geminiResponse };
  }

  async geminiApiCall(prompt: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }
} 