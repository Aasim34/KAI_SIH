"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
    const [isDark, setIsDark] = React.useState(false);

    React.useEffect(() => {
        const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
        setIsDark(isDarkMode);
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);
        if (newIsDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('darkMode', 'disabled');
        }
    };

    return (
        <Button onClick={toggleTheme} variant="ghost" size="icon" className="p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
            {isDark ? <span className="text-xl">☀️</span> : <span className="text-xl">🌙</span>}
            <span className="sr-only">Toggle Dark Mode</span>
        </Button>
    );
}
