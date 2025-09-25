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
  prompt: `You are an AI wellness assistant named Kai, specializing in providing personalized wellness recommendations to students.

  Based on the student's current mood and recent activities, suggest a list of wellness activities that would be most helpful.

  mood: {{{mood}}}
  recentActivity: {{{recentActivity}}}

  Consider activities like:
  - Breathing exercises
  - Mindfulness meditation
  - Journaling
  - Mind relaxing games
  - Reframe thinking
  - Gratitude practice
  - Listen to music
  - Mindful Grove gamified wellness activities
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
