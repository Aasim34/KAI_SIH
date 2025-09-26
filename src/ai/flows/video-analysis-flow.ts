
'use server';

/**
 * @fileOverview A flow to analyze a short video for emotional state.
 *
 * - analyzeVideo - A function that takes a video and returns an analysis of the user's emotional state.
 * - VideoAnalysisInput - The input type for the analyzeVideo function.
 * - VideoAnalysisOutput - The return type for the analyzeVideo function.
 */

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

// Define a separate Genkit instance with the specific API key for video analysis.
const videoAi = genkit({
  plugins: [googleAI({apiKey: 'AIzaSyDcVSoRPwlWXukmFTSj2pZvwklmQi4yR8E'})],
});

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

const prompt = videoAi.definePrompt({
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

Follow this output format strictly:

{
  "primary_emotion": "Most dominant emotion",
  "secondary_emotions": ["Other possible emotions"],
  "confidence_scores": {
      "Happy": 0.00,
      "Sad": 0.00,
      "Angry": 0.00,
      "Fearful/Anxious": 0.00,
      "Stressed/Tense": 0.00,
      "Surprised": 0.00,
      "Disgusted": 0.00,
      "Neutral": 0.00,
      "Confused": 0.00,
      "Tired/Exhausted": 0.00
  },
  "explanation": "Brief reasoning based on facial features such as eyes, mouth, and expressions."
}

Video to analyze:
{{media url=videoDataUri}}`,
});

const videoAnalysisFlow = videoAi.defineFlow(
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
