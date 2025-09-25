"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getKaiResponse } from '@/app/actions/chat';
import type { Message } from '@/lib/types';
import { Mic, Send, Video, Volume2 } from 'lucide-react';
import { Progress } from '../ui/progress';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type QuickMessage = {
  text: string;
  mood: string;
  emoji: string;
  color: string;
}

const quickMessages: QuickMessage[] = [
  { text: 'Feeling stressed', mood: 'stressed', emoji: '😰', color: 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900/80' },
  { text: 'Need motivation', mood: 'unmotivated', emoji: '💪', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900/80' },
  { text: 'Try breathing exercise', mood: 'neutral', emoji: '🧘', color: 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900/80' },
];

export function ChatClient() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hi there! I'm Kai, your AI wellness companion. I'm here to support you through your student journey. How are you feeling today?", sender: 'kai' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleSendMessage = async (messageText: string, mood?: string) => {
    if (!messageText.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), text: messageText, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    const res = await getKaiResponse({ message: messageText, mood });
    
    if (res.success) {
      const kaiMessage: Message = { id: (Date.now() + 1).toString(), text: res.response, sender: 'kai' };
      setMessages(prev => [...prev, kaiMessage]);
    } else {
        toast({
            variant: "destructive",
            title: "Error",
            description: res.response,
        })
    }
    
    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
    setInput('');
  };

  const handleQuickMessage = (qm: QuickMessage) => {
    handleSendMessage(qm.text, qm.mood);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages, isLoading]);

  return (
    <div className="glassmorphism rounded-2xl overflow-hidden h-full flex flex-col">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <h3 className="font-semibold font-headline">Kai - Your AI Wellness Companion</h3>
            <p className="text-sm opacity-90">Online • Ready to help</p>
          </div>
        </div>
        <div className="flex gap-2">
            <Button size="icon" variant="ghost" className="bg-white/20 hover:bg-white/30"><Mic className="h-5 w-5"/></Button>
            <Button size="icon" variant="ghost" className="bg-white/20 hover:bg-white/30"><Video className="h-5 w-5"/></Button>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1" ref={scrollAreaRef}>
                 <div className="p-4 space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className={cn("flex items-end gap-2", msg.sender === 'user' ? 'justify-end' : 'justify-start')}>
                            {msg.sender === 'kai' && <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">K</div>}
                            <div className={cn("p-3 rounded-2xl max-w-sm md:max-w-md", msg.sender === 'user' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-tr-none' : 'glassmorphism rounded-tl-none')}>
                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            </div>
                            {msg.sender === 'user' && <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm shrink-0">👤</div>}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-end gap-2 justify-start">
                             <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">K</div>
                             <div className="glassmorphism p-3 rounded-2xl rounded-tl-none">
                                <div className="flex gap-1 items-center">
                                    <span className="typing-dot h-2 w-2 bg-muted-foreground rounded-full"></span>
                                    <span className="typing-dot h-2 w-2 bg-muted-foreground rounded-full"></span>
                                    <span className="typing-dot h-2 w-2 bg-muted-foreground rounded-full"></span>
                                </div>
                             </div>
                        </div>
                    )}
                 </div>
            </ScrollArea>
            <div className="p-4 border-t border-border">
                <div className="flex flex-wrap gap-2 mb-4">
                {quickMessages.map((qm) => (
                    <button key={qm.text} onClick={() => handleQuickMessage(qm)} className={cn('px-3 py-1 rounded-full text-sm transition-colors', qm.color)}>
                        {qm.emoji} {qm.text}
                    </button>
                ))}
                </div>
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Type your message..." className="flex-1 bg-background/50 h-11"/>
                    <Button type="submit" size="icon" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white w-11 h-11 shrink-0">
                        <Send className="w-5 h-5"/>
                    </Button>
                </form>
            </div>
        </div>

        <div className="w-80 border-l border-border p-4 space-y-4 hidden md:block shrink-0">
            <h4 className="font-semibold font-headline">Real-time Analysis</h4>
            <div className="glassmorphism p-3 rounded-xl">
                <h5 className="font-semibold text-sm mb-2">Current State</h5>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Mood</span><span className="text-green-600 dark:text-green-400">Positive</span></div>
                    <div className="flex justify-between"><span>Stress</span><span className="text-yellow-600 dark:text-yellow-400">Moderate</span></div>
                    <div className="flex justify-between"><span>Energy</span><span className="text-blue-600 dark:text-blue-400">High</span></div>
                </div>
            </div>
            <div className="glassmorphism p-3 rounded-xl">
                <h5 className="font-semibold text-sm mb-2">Voice Analysis</h5>
                <div className="space-y-3">
                    <div>
                        <div className="flex justify-between text-xs mb-1"><span>Volume</span><span>75%</span></div>
                        <Progress value={75} className="h-1"/>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs mb-1"><span>Clarity</span><span>90%</span></div>
                        <Progress value={90} className="h-1"/>
                    </div>
                </div>
            </div>
            <div className="glassmorphism p-3 rounded-xl text-center">
                <h5 className="font-semibold text-sm mb-2">Breathing Guide</h5>
                <div className="breathing-circle mx-auto mb-2" style={{ width: '60px', height: '60px' }}></div>
                <p className="text-xs text-muted-foreground">Follow the circle</p>
            </div>
        </div>
      </div>
    </div>
  );
}
