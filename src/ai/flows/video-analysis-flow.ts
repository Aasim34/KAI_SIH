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
  overallMood: z.string().describe("The user's primary detected overall mood (e.g., Happy, Sad, Neutral, Anxious, Stressed)."),
  stress: z.object({
      level: z.enum(["Low", "Medium", "High", "None Detected"]).describe("The estimated level of stress."),
      indicators: z.array(z.string()).describe("Specific facial indicators of stress observed (e.g., 'furrowed brow', 'tense jaw').")
  }),
  anxiety: z.object({
      level: z.enum(["Low", "Medium", "High", "None Detected"]).describe("The estimated level of anxiety."),
      indicators: z.array(z.string()).describe("Specific facial indicators of anxiety observed (e.g., 'darting eyes', 'lip biting').")
  }),
  summary: z
    .string()
    .describe(
      "A brief, empathetic summary of the user's facial expressions and what they might indicate about their emotional state. Avoid making medical diagnoses. Frame it as observations."
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
  prompt: `You are an AI wellness assistant with expertise in reading facial expressions to understand emotional states from video. You are not a medical professional and must not provide a diagnosis.

  Analyze the entire 5-second video provided. Observe the user's facial expressions (eyes, eyebrows, mouth, jaw), head movements, and overall demeanor to assess their emotional state. Pay close attention to subtle signs that could indicate stress or anxiety.

  Based on your analysis, provide a structured report with:
  1.  The user's overall detected mood.
  2.  An estimated level of stress (Low, Medium, High, or None Detected) and the specific facial indicators you observed.
  3.  An estimated level of anxiety (Low, Medium, High, or None Detected) and the specific facial indicators you observed.
  4.  A short, empathetic summary of your observations and what they might suggest about the user's feelings. Your summary must be encouraging and supportive.

  Video to analyze:
  {{media url=videoDataUri}}`,
});

const videoAnalysisFlow = ai.defineFlow(
  {
    name: 'videoAnalysisFlow',
    inputSchema: VideoAnalysisInputSchema,
    outputSchema: VideoAnalysisOutputSchema,
    model: 'googleai/gemini-pro-vision',
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
