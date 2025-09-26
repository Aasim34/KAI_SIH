
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
  primary_emotion: z.string().describe('Most dominant emotion'),
  secondary_emotions: z
    .array(z.string())
    .describe('Other possible emotions'),
  confidence_scores: z.object({
    Happy: z.number(),
    Sad: z.number(),
    Angry: z.number(),
    'Fearful/Anxious': z.number(),
    'Stressed/Tense': z.number(),
    Surprised: z.number(),
    Disgusted: z.number(),
    Neutral: z.number(),
    Confused: z.number(),
    'Tired/Exhausted': z.number(),
  }),
  explanation: z
    .string()
    .describe(
      'Brief reasoning based on facial features such as eyes, mouth, and expressions.'
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
  prompt: `You are a professional facial emotion recognition system.  
Your task is to analyze the provided human face and detect the emotional state with accuracy.  
Classify the emotions into the following categories:  
- Happy  
- Sad  
- Angry  
- Fearful/Anxious  
- Stressed/Tense  
- Surprised  
- Disgusted  
- Neutral  
- Confused  
- Tired/Exhausted  

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
