import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MindGames } from "./mind-games";
import { MoodChart } from "./mood-chart";
import { KnowledgeHub } from "./knowledge-hub";
import { Form } from "../ui/form";

export function OverviewTab() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold mb-4 font-headline">Kai's Recommendations</h3>
        <div className="glassmorphism p-4 rounded-xl mb-4">
          <p className="text-foreground/80 dark:text-foreground/70 mb-3">
            💡 Based on your recent stress patterns, I recommend trying a 5-minute breathing exercise.
          </p>
          <form className="flex gap-2">
            <Input
              placeholder="Ask Kai anything..."
              className="flex-1 bg-background/50"
            />
            <Button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              Send
            </Button>
          </form>
        </div>
      </div>
      
      <MoodChart />
      <KnowledgeHub />
      <MindGames />
    </div>
  );
}
