"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  { name: "Mon", total: 70 },
  { name: "Tue", total: 85 },
  { name: "Wed", total: 60 },
  { name: "Thu", total: 90 },
  { name: "Fri", total: 75 },
  { name: "Sat", total: 95 },
  { name: "Sun", total: 80 },
];

export function MoodChart() {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4 font-headline">Mood Trends</h3>
      <div className="glassmorphism p-4 sm:p-6 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-foreground/70 dark:text-foreground/60">This Week</span>
          <span className="text-sm font-semibold">Average: 8.2/10</span>
        </div>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
             <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
              domain={[0, 100]}
              allowDataOverflow
            />
            <Bar dataKey="total" radius={[4, 4, 0, 0]} >
                {data.map((_entry, index) => (
                    <rect key={`cell-${index}`} fill="url(#colorUv)" />
                ))}
            </Bar>
             <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
