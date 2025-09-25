import { Progress } from "@/components/ui/progress";

const weeklyActivities = [
    { name: "Breathing Exercises", count: 12 },
    { name: "Mood Check-ins", count: 7 },
    { name: "Journal Entries", count: 5 },
];

const wellnessScores = [
    { name: "Stress Level", value: 25, label: "Low", color: "bg-green-500" },
    { name: "Energy Level", value: 85, label: "High", color: "bg-blue-500" },
    { name: "Focus Level", value: 60, label: "Medium", color: "bg-purple-500" },
];

export function ActivitiesTab() {
  return (
    <div className="space-y-8">
        <h3 className="text-xl font-bold font-headline">Activity Statistics</h3>
        <div className="grid md:grid-cols-2 gap-6">
            <div className="glassmorphism p-6 rounded-xl">
                <h4 className="font-semibold mb-4 font-headline">This Week's Activities</h4>
                <div className="space-y-3">
                    {weeklyActivities.map(activity => (
                        <div key={activity.name} className="flex justify-between items-center text-sm">
                            <span className="text-foreground/80 dark:text-foreground/70">{activity.name}</span>
                            <span className="font-semibold">{activity.count}</span>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="glassmorphism p-6 rounded-xl">
                <h4 className="font-semibold mb-4 font-headline">Live Wellness Scores</h4>
                <div className="space-y-4">
                    {wellnessScores.map(score => (
                        <div key={score.name}>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm">{score.name}</span>
                                <span className="text-sm font-medium">{score.label}</span>
                            </div>
                            <Progress value={score.value} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-blue-500" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
}
