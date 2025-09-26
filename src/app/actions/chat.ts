"use server";

import { getPersonalizedRecommendations } from "@/ai/flows/personalized-wellness-recommendations";
import { z } from "zod";

const chatSchema = z.object({
  message: z.string(),
  mood: z.string().optional(),
});

export async function getKaiResponse(input: { message: string; mood?: string }) {
  try {
    const { message } = chatSchema.parse(input);

    let detectedMood = input.mood || "neutral";
    if (!input.mood) {
      const lowerCaseMessage = message.toLowerCase();
      if (
        lowerCaseMessage.includes("stress") ||
        lowerCaseMessage.includes("anxious") ||
        lowerCaseMessage.includes("overwhelm")
      ) {
        detectedMood = "stressed";
      } else if (
        lowerCaseMessage.includes("sad") ||
        lowerCaseMessage.includes("down") ||
        lowerCaseMessage.includes("upset")
      ) {
        detectedMood = "sad";
      } else if (
        lowerCaseMessage.includes("happy") ||
        lowerCaseMessage.includes("great") ||
        lowerCaseMessage.includes("good")
      ) {
        detectedMood = "happy";
      }
    }

    const aiResponse = await getPersonalizedRecommendations({
      mood: detectedMood,
      recentActivity: message,
    });
    
    let responseText = aiResponse.responseText;

    if (aiResponse.recommendations && aiResponse.recommendations.length > 0) {
        responseText += `\n\nHere are a few things that might help:\n- ${aiResponse.recommendations.join('\n- ')}`;
    }

    return { success: true, response: responseText };
    
  } catch (error) {
    console.error("Error in getKaiResponse:", error);
    return {
      success: false,
      response: "I'm having a little trouble thinking right now. Could you please try again in a moment?",
    };
  }
}
