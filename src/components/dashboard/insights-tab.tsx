import { Progress } from "@/components/ui/progress";
import { CheckCircle2 } from "lucide-react";

const progressHighlights = [
    { icon: <CheckCircle2 className="text-green-500" />, text: "7-day wellness streak achieved!" },
    { icon: <CheckCircle2 className="text-blue-500" />, text: "Mood improved by 15% this week" },
    { icon: <CheckCircle2 className="text-purple-500" />, text: "Completed 12 breathing exercises" },
];

const upcomingGoals = [
    { name: "Daily Check-ins", progress: 71, current: 5, target: 7 },
    { name: "Grove Level 4", progress: 60, current: 180, target: 300 },
];

export function InsightsTab() {
  return (
    <div className="space-y-8">
        <h3 className="text-xl font-bold font-headline">Progress Insights</h3>
        <div className="grid md:grid-cols-2 gap-6">
            <div className="glassmorphism p-6 rounded-xl">
                <h4 className="font-semibold mb-4 font-headline">Progress Highlights</h4>
                <div className="space-y-3">
                    {progressHighlights.map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                            {item.icon}
                            <span className="text-sm">{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="glassmorphism p-6 rounded-xl">
                <h4 className="font-semibold mb-4 font-headline">Upcoming Goals</h4>
                <div className="space-y-4">
                    {upcomingGoals.map(goal => (
                        <div key={goal.name}>
                            <div className="flex justify-between mb-1 text-sm">
                                <span>{goal.name} ({goal.current}/{goal.target})</span>
                                <span>{goal.progress}%</span>
                            </div>
                            <Progress value={goal.progress} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-purple-600 [&>div]:to-blue-500" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
}
