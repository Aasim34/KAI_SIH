"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const hubCategories = [
    { icon: '👨‍🎓', title: 'Students', description: 'Peer experiences and tips' },
    { icon: '🔬', title: 'Researchers', description: 'Evidence-based insights' },
    { icon: '🌍', title: 'Public Users', description: 'Community wellness stories' },
];

const articles = {
    'exam-anxiety': {
        title: "Managing Exam Anxiety: A Student's Guide",
        content: `
            <h4 class="font-bold text-lg mb-2">Understanding Exam Anxiety</h4>
            <p class="mb-4">Exam anxiety is a common experience that affects many students. It's characterized by feelings of worry, fear, and physical symptoms before or during exams.</p>
            <h4 class="font-bold text-lg mb-2">Key Strategies:</h4>
            <ul class="list-disc list-inside space-y-1 mb-4">
                <li><strong>Preparation:</strong> Create a study schedule and stick to it</li>
                <li><strong>Breathing:</strong> Practice deep breathing exercises</li>
                <li><strong>Positive Self-talk:</strong> Replace negative thoughts with encouraging ones</li>
                <li><strong>Sleep:</strong> Ensure adequate rest before exams</li>
            </ul>`
    },
    'breathing-science': {
        title: "The Science of Breathing Exercises",
        content: `
            <h4 class="font-bold text-lg mb-2">How Breathing Affects Your Brain</h4>
            <p class="mb-4">Deep breathing activates the parasympathetic nervous system, which promotes relaxation and reduces stress hormones like cortisol.</p>
            <h4 class="font-bold text-lg mb-2">Research Findings:</h4>
            <ul class="list-disc list-inside space-y-1 mb-4">
                <li>4-7-8 breathing reduces anxiety by 23% in studies</li>
                <li>Box breathing improves focus and concentration</li>
                <li>Diaphragmatic breathing lowers heart rate and blood pressure</li>
            </ul>`
    }
};

type ArticleId = keyof typeof articles;

export function KnowledgeHub() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentArticle, setCurrentArticle] = useState<ArticleId | null>(null);

    const showArticle = (articleId: ArticleId) => {
        setCurrentArticle(articleId);
        setIsDialogOpen(true);
    };
    
    return (
        <div>
            <h3 className="text-xl font-bold mb-4 font-headline">Journals & Knowledge Hub</h3>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
                {hubCategories.map(cat => (
                    <div key={cat.title} className="glassmorphism p-4 rounded-xl text-center">
                        <div className="text-2xl mb-2">{cat.icon}</div>
                        <h4 className="font-semibold mb-2 font-headline">{cat.title}</h4>
                        <p className="text-sm text-foreground/70 dark:text-foreground/60">{cat.description}</p>
                    </div>
                ))}
            </div>
            <div className="space-y-3">
                <div className="glassmorphism p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                        <h4 className="font-semibold font-headline">Managing Exam Anxiety: A Student's Guide</h4>
                        <p className="text-sm text-foreground/70 dark:text-foreground/60">Learn practical techniques to stay calm during exams</p>
                    </div>
                    <Button onClick={() => showArticle('exam-anxiety')} className="bg-blue-500 text-white text-sm shrink-0">Read</Button>
                </div>
                <div className="glassmorphism p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                        <h4 className="font-semibold font-headline">The Science of Breathing Exercises</h4>
                        <p className="text-sm text-foreground/70 dark:text-foreground/60">Research-backed benefits of mindful breathing</p>
                    </div>
                    <Button onClick={() => showArticle('breathing-science')} className="bg-blue-500 text-white text-sm shrink-0">Read</Button>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="glassmorphism max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold font-headline">{currentArticle && articles[currentArticle].title}</DialogTitle>
                    </DialogHeader>
                    <div
                        className="prose prose-sm dark:prose-invert max-w-none text-foreground/80 dark:text-foreground/70"
                        dangerouslySetInnerHTML={{ __html: currentArticle ? articles[currentArticle].content : '' }}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
