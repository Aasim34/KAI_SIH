
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Video, VideoOff, Loader2, Info, Smile, Frown, Meh, Brain, HeartPulse, Download, Angry, FileQuestion, Sofa, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { analyzeVideo, VideoAnalysisOutput } from '@/ai/flows/video-analysis-flow';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Badge } from '../ui/badge';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useAuth } from '@/hooks/use-auth';
import { Progress } from '../ui/progress';

const emotionIcons: { [key: string]: React.ReactNode } = {
  'Happy': <Smile className="w-8 h-8 text-green-500" />,
  'Sad': <Frown className="w-8 h-8 text-blue-500" />,
  'Angry': <Angry className="w-8 h-8 text-red-500" />,
  'Fearful/Anxious': <HeartPulse className="w-8 h-8 text-purple-500" />,
  'Stressed/Tense': <Brain className="w-8 h-8 text-orange-500" />,
  'Surprised': <FileQuestion className="w-8 h-8 text-yellow-500" />,
  'Disgusted': <Frown className="w-8 h-8 text-lime-600" />,
  'Neutral': <Meh className="w-8 h-8 text-gray-500" />,
  'Confused': <HelpCircle className="w-8 h-8 text-indigo-500" />,
  'Tired/Exhausted': <Sofa className="w-8 h-8 text-gray-400" />,
};

export function VideoChatClient() {
  const { toast } = useToast();
  const { user } = useAuth();

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<VideoAnalysisOutput | null>(null);
  const [analysisDate, setAnalysisDate] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState(5);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Not Supported',
          description: 'Your browser does not support camera access.',
        });
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        stream.getTracks().forEach(track => track.stop());
      } catch (error: any) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        if (error.name === "NotAllowedError") {
             toast({
                variant: 'destructive',
                title: 'Camera Access Denied',
                description: 'Please enable camera permissions in your browser settings to use this feature.',
                duration: 9000,
             });
        } else {
            toast({
                variant: 'destructive',
                title: 'Camera Error',
                description: 'Could not access the camera. Please ensure it is not in use by another application.',
                duration: 9000,
            });
        }
      }
    };
    getCameraPermission();
  }, [toast]);

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;
    if (isRecording) {
      setCountdown(5);
      countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countdownInterval);
  }, [isRecording]);

  const startVideo = async (): Promise<MediaStream | null> => {
    if (hasCameraPermission === false) {
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings to use this feature.',
      });
      return null;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.error("Video play failed", e));
      }
      setIsVideoEnabled(true);
      return stream;
    } catch (error) {
      console.error("Failed to get camera stream:", error);
      toast({
        variant: 'destructive',
        title: 'Could not start video',
        description: 'Failed to access the camera. Please check permissions.',
      });
      return null;
    }
  }

  const stopVideo = () => {
     if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsVideoEnabled(false);
  }

  const handleStartAnalysis = async () => {
    if (isRecording || isAnalyzing) return;

    const stream = await startVideo();
    if (!stream) return;

    setAnalysisResult(null);
    setAnalysisDate(null);
    setIsRecording(true);

    recordedChunksRef.current = [];
    const mimeType = 'video/webm';
    mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = async () => {
      setIsRecording(false);
      setIsAnalyzing(true);
      stopVideo();

      const blob = new Blob(recordedChunksRef.current, { type: mimeType });
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        try {
          const result = await analyzeVideo({ videoDataUri: base64data });
          setAnalysisResult(result);
          setAnalysisDate(new Date());
        } catch (error) {
          console.error("Analysis failed:", error);
          toast({
            variant: "destructive",
            title: "Analysis Failed",
            description: "There was an error analyzing the video. Please try again."
          });
        } finally {
          setIsAnalyzing(false);
        }
      };
    };

    mediaRecorderRef.current.start();

    setTimeout(() => {
      mediaRecorderRef.current?.stop();
    }, 5000);
  };
  
  const handleExportPdf = async () => {
    if (!reportRef.current || !analysisResult) {
        toast({
            variant: "destructive",
            title: "Export Failed",
            description: "No analysis report to export."
        });
        return;
    }

    try {
        const canvas = await html2canvas(reportRef.current, { 
            scale: 2, 
            useCORS: true,
            backgroundColor: document.documentElement.classList.contains('dark') ? '#0f172a' : '#F0F2FF'
        });
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;
        const imgWidth = pdfWidth - 40; // with margin
        const imgHeight = imgWidth / ratio;

        let yPos = 20;

        pdf.setFontSize(22);
        pdf.setTextColor(79, 70, 229);
        if (document.documentElement.classList.contains('dark')) {
            pdf.setTextColor(165, 180, 252);
        }
        pdf.text("Kai Wellness Report", pdfWidth / 2, yPos, { align: 'center' });
        yPos += 20;

        pdf.setDrawColor(224, 224, 224);
        pdf.line(20, yPos, pdfWidth - 20, yPos);
        yPos += 15;
        
        pdf.addImage(imgData, 'PNG', 20, yPos, imgWidth, imgHeight);

        pdf.save(`kai-video-report-${new Date().toISOString().split('T')[0]}.pdf`);

        toast({
            title: "Report Exported",
            description: "Your video analysis report has been saved as a PDF."
        });

    } catch (error) {
        console.error("PDF export failed:", error);
        toast({
            variant: "destructive",
            title: "Export Error",
            description: "An unexpected error occurred while exporting the PDF."
        });
    }
  };

  return (
    <div className="glassmorphism rounded-2xl overflow-hidden h-full flex flex-col">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-xl">📹</span>
            </div>
            <div>
                <h3 className="font-semibold font-headline">Video Check-in</h3>
                <p className="text-sm opacity-90">Share your feelings, visually</p>
            </div>
            </div>
        </div>
      
        <div className="flex-1 flex flex-col overflow-y-auto">
            <div className="flex-1 flex flex-col items-center justify-start p-4">
                <div className="w-full max-w-2xl space-y-4">
                    <div className="relative aspect-video bg-muted rounded-2xl overflow-hidden shadow-lg border border-white/20">
                        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                        <div className={cn("absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-4 text-center bg-black/50 transition-opacity", isVideoEnabled ? "opacity-0" : "opacity-100")}>
                            <VideoOff className="w-16 h-16" />
                            <p className="mt-4 text-lg text-white">Video is off</p>
                            <p className="text-sm text-white/80">Start your video to begin visual sentiment analysis.</p>
                        </div>
                        {isRecording && (
                          <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                            <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
                            Recording... {countdown > 0 ? `${countdown}s` : 'Processing...'}
                          </div>
                        )}
                    </div>

                    {hasCameraPermission === false && (
                        <Alert variant="destructive">
                            <AlertTitle>Camera Access Required</AlertTitle>
                            <AlertDescription>
                                Please allow camera access in your browser settings to use this feature.
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="flex gap-4 justify-center">
                        <Button size="lg" className="gap-2 h-12 px-6 text-base bg-gradient-to-r from-purple-600 to-blue-600 text-white" onClick={handleStartAnalysis} disabled={hasCameraPermission === false || isAnalyzing || isRecording}>
                            {isAnalyzing ? (
                              <><Loader2 className="h-5 w-5 animate-spin"/> Analyzing...</>
                            ) : isRecording ? (
                              <><Loader2 className="h-5 w-5 animate-spin"/> Recording...</>
                            ) : (
                              <><Video className="h-5 w-5"/> Start 5s Video Analysis</>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-4">
                <div className="flex justify-between items-center max-w-4xl mx-auto w-full">
                    <h4 className="font-semibold font-headline">Analysis Report</h4>
                    <div className='flex items-center gap-2'>
                        {analysisResult && (
                             <Button size="sm" variant="outline" onClick={handleExportPdf} className="gap-2">
                                <Download className="w-4 h-4" /> Export PDF
                             </Button>
                        )}
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
                </div>
                <div className="max-w-4xl mx-auto w-full">
                    {isAnalyzing ? (
                        <div className="flex items-center justify-center h-48">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : analysisResult ? (
                      <div ref={reportRef} className="bg-gradient-to-br from-white/20 to-transparent dark:from-white/10 dark:to-transparent p-6 rounded-2xl border border-white/30 dark:border-white/20">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4 mb-6 pb-4 border-b border-white/30 dark:border-white/50">
                            <div>
                                <p className="text-xs font-semibold text-foreground/70 dark:text-foreground/60">Name</p>
                                <p className="font-bold">{user?.name || 'User'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-foreground/70 dark:text-foreground/60">Analysis Date</p>
                                <p className="font-bold">{analysisDate?.toLocaleDateString() || 'N/A'}</p>
                            </div>
                             <div>
                                <p className="text-xs font-semibold text-foreground/70 dark:text-foreground/60">Analysis Time</p>
                                <p className="font-bold">{analysisDate?.toLocaleTimeString() || 'N/A'}</p>
                            </div>
                          </div>
                          
                          <div className="grid md:grid-cols-2 lg:grid-cols-[1fr_2fr] gap-6">
                            <div className="space-y-4">
                                <div className="glassmorphism p-4 rounded-xl text-center">
                                  <h5 className="font-semibold text-sm mb-2 text-foreground/80">Primary Emotion</h5>
                                  <div className="flex justify-center items-center gap-3">
                                      {emotionIcons[analysisResult.primary_emotion] || <Meh className="w-8 h-8 text-gray-500" />}
                                      <p className="text-2xl font-bold gradient-text">{analysisResult.primary_emotion}</p>
                                  </div>
                                </div>
                                
                                {analysisResult.secondary_emotions.length > 0 && (
                                    <div className="glassmorphism p-4 rounded-xl">
                                        <h5 className="font-semibold text-sm mb-2 text-foreground/80">Secondary Emotions</h5>
                                        <div className="flex flex-wrap gap-2">
                                            {analysisResult.secondary_emotions.map((emotion, i) => (
                                                <Badge key={i} variant="outline" className="text-sm">{emotion}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="glassmorphism p-4 rounded-xl">
                                <h5 className="font-semibold text-sm mb-3 text-foreground/80">Confidence Scores</h5>
                                <div className="space-y-2">
                                    {Object.entries(analysisResult.confidence_scores)
                                      .sort(([, a], [, b]) => b - a)
                                      .map(([emotion, score]) => (
                                        <div key={emotion}>
                                            <div className="flex justify-between items-center text-xs mb-1">
                                                <span className="font-medium text-foreground/80">{emotion}</span>
                                                <span className="text-foreground/70">{(score * 100).toFixed(1)}%</span>
                                            </div>
                                            <Progress value={score * 100} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-blue-500" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="glassmorphism p-4 rounded-xl bg-primary/5 md:col-span-2 lg:col-span-full">
                              <h5 className="font-semibold text-sm mb-2 text-primary">AI Explanation</h5>
                              <p className="text-sm text-foreground/80 italic">"{analysisResult.explanation}"</p>
                            </div>
                          </div>
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground h-48 flex flex-col justify-center items-center p-6 border-2 border-dashed rounded-2xl">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                            <Brain className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium">Your report will appear here</p>
                        <p className="text-xs text-muted-foreground/80">Start a 5-second video analysis to see your emotional insights.</p>
                      </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}

    
    