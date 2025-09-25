'use server';

/**
 * @fileOverview A flow to analyze a short video for emotional state.
 *
 * - analyzeVideo - A function that takes a video and returns an analysis of the user's emotional state.
 * - VideoAnalysisInput - The input type for the analyzeVideo function.
 * - VideoAnalysisOutput - The return type for the analyzeVideo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VideoAnalysisInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A 5-second video of the user, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type VideoAnalysisInput = z.infer<typeof VideoAnalysisInputSchema>;

const VideoAnalysisOutputSchema = z.object({
  mood: z.string().describe("The user's primary detected mood (e.g., Happy, Sad, Neutral, Stressed)."),
  stressLevel: z.string().describe("The estimated stress level (e.g., Low, Medium, High)."),
  summary: z
    .string()
    .describe(
      "A brief, empathetic summary of the user's facial expressions and what they might indicate about their emotional state."
    ),
});
export type VideoAnalysisOutput = z.infer<typeof VideoAnalysisOutputSchema>;

export async function analyzeVideo(
  input: VideoAnalysisInput
): Promise<VideoAnalysisOutput> {
  return videoAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'videoAnalysisPrompt',
  input: {schema: VideoAnalysisInputSchema},
  output: {schema: VideoAnalysisOutputSchema},
  prompt: `You are an AI wellness assistant with expertise in reading facial expressions to understand emotional states.

  Analyze the entire 5-second video provided. Observe the user's facial expressions, eye contact, and overall demeanor to assess their emotional state. Pay close attention to subtle signs of stress, anxiety, or happiness.

  Based on your analysis, provide a report with their primary mood, an estimated stress level, and a short, encouraging summary of your observations. Be empathetic and supportive in your summary.

  Video to analyze:
  {{media url=videoDataUri}}`,
});

const videoAnalysisFlow = ai.defineFlow(
  {
    name: 'videoAnalysisFlow',
    inputSchema: VideoAnalysisInputSchema,
    outputSchema: VideoAnalysisOutputSchema,
    model: 'googleai/gemini-2.5-flash-image-preview', // Using a model with video understanding
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
