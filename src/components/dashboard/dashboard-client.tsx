
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "./overview-tab";
import { GroveTab } from "./grove-tab";
import { InsightsTab } from "./insights-tab";
import { ActivitiesTab } from "./activities-tab";
import { useAuth } from "@/hooks/use-auth";

const quickStats = [
    { label: "Streak Days", value: "7" },
    { label: "Grove Level", value: "3" },
    { label: "Activities", value: "24" },
    { label: "Avg Mood", value: "8.2" },
];

export function DashboardClient() {
    const router = useRouter();
    const { user, logout } = useAuth();

    return (
        <div>
            <div className="glassmorphism rounded-2xl p-6 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h1 className="gradient-text text-3xl font-bold mb-2 font-headline">Welcome back, {user?.name || 'friend'}! 👋</h1>
                        <p className="text-foreground/70 dark:text-foreground/60">Ready to continue your wellness journey?</p>
                    </div>
                    <div className="flex gap-2 sm:gap-3 mt-4 md:mt-0 flex-wrap">
                        <Button onClick={() => router.push('/chat')} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg transition-all">
                            Chat with Kai
                        </Button>
                        <Button variant="outline" onClick={logout} className="bg-background/50">
                            Sign Out
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickStats.map(stat => (
                        <div key={stat.label} className="glassmorphism p-4 rounded-xl text-center">
                            <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                            <div className="text-sm text-foreground/70 dark:text-foreground/60">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="glassmorphism rounded-2xl p-4 sm:p-6">
                <Tabs defaultValue="overview">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6 h-auto bg-transparent p-0 gap-2">
                        <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md">Overview</TabsTrigger>
                        <TabsTrigger value="grove" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md">Grove</TabsTrigger>
                        <TabsTrigger value="insights" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md">Insights</TabsTrigger>
                        <TabsTrigger value="activities" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md">Activities</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview">
                        <OverviewTab />
                    </TabsContent>
                    <TabsContent value="grove">
                        <GroveTab />
                    </TabsContent>
                    <TabsContent value="insights">
                        <InsightsTab />
                    </TabsContent>
                    <TabsContent value="activities">
                        <ActivitiesTab />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
