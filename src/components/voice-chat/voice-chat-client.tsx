
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Loader2, Play, Square, Brain, HeartPulse, Info, Smile, Frown, Meh } from 'lucide-react';
import { Progress } from '../ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { analyzeVoice, VoiceAnalysisOutput } from '@/ai/flows/voice-analysis-flow';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

const moodIcons: { [key: string]: React.ReactNode } = {
  happy: <Smile className="w-6 h-6 text-green-500" />,
  sad: <Frown className="w-6 h-6 text-blue-500" />,
  neutral: <Meh className="w-6 h-6 text-yellow-500" />,
  stressed: <Brain className="w-6 h-6 text-red-500" />,
  anxious: <HeartPulse className="w-6 h-6 text-orange-500" />,
};

const levelColors: { [key: string]: string } = {
    "Low": "text-green-500",
    "Medium": "text-yellow-500",
    "High": "text-red-500",
    "None Detected": "text-green-500"
};

export function VoiceChatClient() {
  const { toast } = useToast();
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(isAnalyzing);
  const [analysisResult, setAnalysisResult] = useState<VoiceAnalysisOutput | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    const getMicPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasMicPermission(false);
        toast({
          variant: 'destructive',
          title: 'Microphone Not Supported',
          description: 'Your browser does not support microphone access.',
        });
        return;
      }
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasMicPermission(true);
      } catch (error: any) {
        console.error('Error accessing microphone:', error);
        setHasMicPermission(false);
        if (error.name === "NotAllowedError") {
             toast({
                variant: 'destructive',
                title: 'Microphone Access Denied',
                description: 'Please enable microphone permissions in your browser settings to use this feature.',
                duration: 9000,
             });
        }
      }
    };
    getMicPermission();
  }, [toast]);
  
  useEffect(() => {
    if (analysisResult?.audioResponse && audioRef.current) {
      audioRef.current.src = analysisResult.audioResponse;
      audioRef.current.play().catch(e => console.error("Audio play failed", e));
    }
  }, [analysisResult]);


  const startRecording = async () => {
    if (isRecording || hasMicPermission === false) return;

    setAnalysisResult(null);
    setIsRecording(true);
    setRecordingTime(0);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    recordedChunksRef.current = [];
    const mimeType = 'audio/webm';
    mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = async () => {
      setIsAnalyzing(true);
      setIsRecording(false);
      stream.getTracks().forEach(track => track.stop());
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);

      const blob = new Blob(recordedChunksRef.current, { type: mimeType });
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        try {
          const result = await analyzeVoice({ audioDataUri: base64data });
          setAnalysisResult(result);
        } catch (error) {
          console.error("Analysis failed:", error);
          toast({
            variant: "destructive",
            title: "Analysis Failed",
            description: "There was an error analyzing your voice. Please try again."
          });
        } finally {
          setIsAnalyzing(false);
        }
      };
    };

    mediaRecorderRef.current.start();
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime(prev => {
        const newTime = prev + 1;
        if (newTime >= 10) {
          stopRecording();
        }
        return newTime;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleMicButtonClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const playAudioResponse = () => {
    if (audioRef.current) {
        audioRef.current.play().catch(e => console.error("Audio play failed", e));
    }
  }

  return (
    <div className="glassmorphism rounded-2xl overflow-hidden h-full flex flex-col">
        <audio ref={audioRef} className="hidden" />
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-xl">🎙️</span>
              </div>
              <div>
                  <h3 className="font-semibold font-headline">Voice Check-in</h3>
                  <p className="text-sm opacity-90">Share your feelings through voice</p>
              </div>
            </div>
        </div>
      
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-6">
                <div className="relative w-48 h-48 mx-auto">
                    <div className={cn("absolute inset-0 rounded-full bg-primary/10", isRecording && "animate-pulse")}></div>
                    <div className={cn("absolute inset-2 rounded-full bg-primary/20", isRecording && "animate-pulse")} style={{ animationDelay: '0.2s' }}></div>
                    <div className="absolute inset-4 flex items-center justify-center">
                        <Button size="lg" onClick={handleMicButtonClick} disabled={hasMicPermission === false || isAnalyzing} className="gap-2 h-24 w-24 rounded-full text-white bg-gradient-to-r from-purple-600 to-blue-600">
                           {isRecording ? <Square className="h-10 w-10" /> : <Mic className="h-10 w-10"/>}
                        </Button>
                    </div>
                </div>
                <div>
                  <p className="text-muted-foreground text-center">
                    {isAnalyzing ? "Analyzing your voice..." : isRecording ? "Press button to stop (max 10s)" : "Press the button and start speaking"}
                  </p>
                   {hasMicPermission === false && (
                      <Alert variant="destructive" className="mt-4">
                          <AlertTitle>Microphone Access Required</AlertTitle>
                          <AlertDescription>
                              Please allow microphone access to use this feature.
                          </AlertDescription>
                      </Alert>
                    )}
                </div>
                {isRecording && (
                    <div className="w-full max-w-xs">
                        <Progress value={recordingTime * 10} className="h-2" />
                        <p className="text-sm text-center mt-2">{recordingTime}s / 10s</p>
                    </div>
                )}
            </div>

            <div className="w-full md:w-96 border-l border-border p-4 space-y-4 shrink-0 overflow-y-auto">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold font-headline">Analysis Report</h4>
                  <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Info className="w-4 h-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="max-w-xs text-xs">This is not a medical diagnosis. It's an AI-powered observation to help you understand your emotional state.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                {isAnalyzing ? (
                  <div className="flex items-center justify-center h-full">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : analysisResult ? (
                  <div className="space-y-4">
                    <div className="glassmorphism p-4 rounded-xl text-center">
                        <h5 className="font-semibold text-sm mb-2 text-foreground/80">OVERALL MOOD</h5>
                        <div className="flex justify-center items-center gap-3">
                            {moodIcons[analysisResult.analysis.overallMood.toLowerCase()] || <Meh className="w-8 h-8 text-gray-500" />}
                            <p className="text-2xl font-bold gradient-text">{analysisResult.analysis.overallMood}</p>
                        </div>
                    </div>
                    <div className="glassmorphism p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <Brain className="w-5 h-5 text-red-500" />
                        <h5 className="font-semibold text-sm">Stress Analysis</h5>
                      </div>
                      <div className="flex justify-between items-baseline mb-2">
                        <span className="text-sm text-foreground/80">Detected Level:</span>
                        <p className={cn("text-lg font-bold", levelColors[analysisResult.analysis.stress.level] || 'text-foreground')}>{analysisResult.analysis.stress.level}</p>
                      </div>
                      {analysisResult.analysis.stress.indicators.length > 0 && (
                          <div>
                            <h6 className="text-xs font-semibold text-foreground/70 mb-1">Indicators:</h6>
                            <div className="flex flex-wrap gap-1.5">
                                {analysisResult.analysis.stress.indicators.map((indicator, i) => <Badge key={i} variant="outline" className="text-xs border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-300">{indicator}</Badge>)}
                            </div>
                          </div>
                      )}
                    </div>
                     <div className="glassmorphism p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <HeartPulse className="w-5 h-5 text-orange-500" />
                        <h5 className="font-semibold text-sm">Anxiety Analysis</h5>
                      </div>
                      <div className="flex justify-between items-baseline mb-2">
                        <span className="text-sm text-foreground/80">Detected Level:</span>
                        <p className={cn("text-lg font-bold", levelColors[analysisResult.analysis.anxiety.level] || 'text-foreground')}>{analysisResult.analysis.anxiety.level}</p>
                      </div>
                      {analysisResult.analysis.anxiety.indicators.length > 0 && (
                        <div>
                            <h6 className="text-xs font-semibold text-foreground/70 mb-1">Indicators:</h6>
                            <div className="flex flex-wrap gap-1.5">
                                {analysisResult.analysis.anxiety.indicators.map((indicator, i) => <Badge key={i} variant="outline" className="text-xs border-orange-500/50 bg-orange-500/10 text-orange-700 dark:text-orange-300">{indicator}</Badge>)}
                            </div>
                        </div>
                      )}
                    </div>
                     <div className="glassmorphism p-4 rounded-xl bg-primary/5">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-semibold text-sm text-primary">Kai's Empathetic Summary</h5>
                          <Button size="icon" variant="ghost" onClick={playAudioResponse} className="text-primary h-8 w-8" disabled={!analysisResult.audioResponse}>
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-foreground/80 italic">"{analysisResult.analysis.summary}"</p>
                      </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground h-full flex flex-col justify-center items-center p-6 border-2 border-dashed rounded-2xl">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Brain className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">Your report will appear here</p>
                    <p className="text-xs text-muted-foreground/80">Press the mic and record up to 10 seconds of audio.</p>
                  </div>
                )}
            </div>
        </div>
    </div>
  );
}

    