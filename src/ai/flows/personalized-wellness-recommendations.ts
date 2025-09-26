'use server';

/**
 * @fileOverview A flow to provide personalized wellness activity recommendations to the user.
 *
 * - getPersonalizedRecommendations - A function that takes the user's mood and recent activity and returns personalized wellness recommendations.
 * - PersonalizedRecommendationsInput - The input type for the getPersonalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The return type for the getPersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  mood: z
    .string()
    .describe('The current mood of the user (e.g., happy, sad, stressed).'),
  recentActivity: z
    .string()
    .describe(
      'A brief description of the user recent activities and feelings (e.g., had a stressful exam, feeling overwhelmed with coursework, feeling great after workout ).'
    ),
});
export type PersonalizedRecommendationsInput = z.infer<
  typeof PersonalizedRecommendationsInputSchema
>;

const PersonalizedRecommendationsOutputSchema = z.object({
  responseText: z.string().describe("Kai's friendly, conversational response to the user."),
  recommendations: z.array(
    z.string().describe('A list of personalized wellness recommendations.')
  ),
});
export type PersonalizedRecommendationsOutput = z.infer<
  typeof PersonalizedRecommendationsOutputSchema
>;

export async function getPersonalizedRecommendations(
  input: PersonalizedRecommendationsInput
): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `You are an AI wellness assistant named Kai. Your personality is empathetic, friendly, and supportive. You are designed to help students with their mental wellness. You are not a medical professional and must not provide a diagnosis.

  A student has shared their feelings with you. Your task is to:
  1.  Analyze their message for their mood, underlying emotions, and any mentioned behaviors or situations (like exams, social issues, or sleep patterns).
  2.  Write a warm, empathetic, and non-judgmental conversational response ("responseText"). Acknowledge their feelings and validate their experience. Make it sound like a real, caring friend is talking to them.
  3.  Based on your analysis, suggest a list of 3-4 specific, actionable, and personalized wellness activities ("recommendations"). Your suggestions should be directly relevant to what the user shared.
  4.  If the user's message contains signs of significant distress, self-harm, or severe mental health crises, your first recommendation MUST be "Talk to a professional counselor or a trusted person immediately."

  User's input:
  - Mood: {{{mood}}}
  - Message: {{{recentActivity}}}

  Examples of recommendations to consider:
  - For stress/anxiety: "Try a 5-minute box breathing exercise to calm your nervous system."
  - For sadness/low mood: "Practice a 10-minute gratitude journaling session. Write down three things you appreciate, no matter how small."
  - For feeling overwhelmed: "Use the 'Mindful Grove' to take a short break with a relaxing game."
  - For negative thoughts: "Let's try a 'Positive Reframe' exercise together. What's one worry we can look at from a different angle?"
  - For general wellness: "Listen to some calming music or an ambient soundscape."

  Remember to be gentle and encouraging. Frame your suggestions as invitations, not commands.
  `,
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
