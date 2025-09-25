'use server';

/**
 * @fileOverview A flow to analyze a short voice recording for emotional state.
 *
 * - analyzeVoice - A function that takes a voice recording and returns an analysis of the user's emotional state and an audio response.
 * - VoiceAnalysisInput - The input type for the analyzeVoice function.
 * - VoiceAnalysisOutput - The return type for the analyzeVoice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const VoiceAnalysisInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "A 10-second voice recording of the user, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type VoiceAnalysisInput = z.infer<typeof VoiceAnalysisInputSchema>;

const VoiceAnalysisOutputSchema = z.object({
  analysis: z.object({
    overallMood: z.string().describe("The user's primary detected overall mood (e.g., Happy, Sad, Neutral, Anxious, Stressed)."),
    stress: z.object({
        level: z.enum(["Low", "Medium", "High", "None Detected"]).describe("The estimated level of stress based on vocal biomarkers."),
        indicators: z.array(z.string()).describe("Specific vocal indicators of stress observed (e.g., 'high pitch', 'fast pace', 'strained tone').")
    }),
    anxiety: z.object({
        level: z.enum(["Low", "Medium", "High", "None Detected"]).describe("The estimated level of anxiety based on vocal biomarkers."),
        indicators: z.array(z.string()).describe("Specific vocal indicators of anxiety observed (e.g., 'trembling voice', 'hesitations').")
    }),
    summary: z
      .string()
      .describe(
        "A brief, empathetic summary of the user's voice and what it might indicate about their emotional state. Avoid making medical diagnoses. Frame it as observations."
      ),
  }),
  audioResponse: z.string().describe('A data URI of the generated audio response from Kai in WAV format.'),
});
export type VoiceAnalysisOutput = z.infer<typeof VoiceAnalysisOutputSchema>;

export async function analyzeVoice(
  input: VoiceAnalysisInput
): Promise<VoiceAnalysisOutput> {
  return voiceAnalysisFlow(input);
}

const analysisPrompt = ai.definePrompt({
  name: 'voiceAnalysisPrompt',
  input: {schema: VoiceAnalysisInputSchema},
  output: {schema: z.object({ analysis: VoiceAnalysisOutputSchema.shape.analysis })},
  model: 'googleai/gemini-2.5-flash',
  prompt: `You are an AI wellness assistant named Kai with expertise in analyzing vocal biomarkers to understand emotional states from audio. You are not a medical professional and must not provide a diagnosis.

  Analyze the provided 10-second audio recording. Listen to the user's tone, pitch, pace, volume, and clarity to assess their emotional state. Pay close attention to subtle cues that could indicate stress or anxiety.

  Based on your analysis, provide a structured report with:
  1.  The user's overall detected mood from their voice.
  2.  An estimated level of stress (Low, Medium, High, or None Detected) and the specific vocal indicators you observed.
  3.  An estimated level of anxiety (Low, Medium, High, or None Detected) and the specific vocal indicators you observed.
  4.  A short, empathetic summary of your observations and what they might suggest about the user's feelings. Your summary must be encouraging and supportive.

  Audio to analyze:
  {{media url=audioDataUri}}`,
});

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const voiceAnalysisFlow = ai.defineFlow(
  {
    name: 'voiceAnalysisFlow',
    inputSchema: VoiceAnalysisInputSchema,
    outputSchema: VoiceAnalysisOutputSchema,
  },
  async input => {
    const { output: analysisOutput } = await analysisPrompt(input);
    if (!analysisOutput?.analysis) {
        throw new Error("Voice analysis failed to produce an output.");
    }
    
    const { media } = await ai.generate({
        model: 'googleai/gemini-2.5-flash-preview-tts',
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Algenib' },
            },
          },
        },
        prompt: analysisOutput.analysis.summary,
      });

      if (!media) {
        throw new Error('TTS media generation failed.');
      }
      
      const audioBuffer = Buffer.from(
        media.url.substring(media.url.indexOf(',') + 1),
        'base64'
      );
      
      const wavBase64 = await toWav(audioBuffer);

    return {
        analysis: analysisOutput.analysis,
        audioResponse: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);
