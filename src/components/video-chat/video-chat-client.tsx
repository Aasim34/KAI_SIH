"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Video, VideoOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { analyzeVideo, VideoAnalysisOutput } from '@/ai/flows/video-analysis-flow';

export function VideoChatClient() {
  const { toast } = useToast();

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<VideoAnalysisOutput | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        return;
      }
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    };
    getCameraPermission();
  }, []);

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
      
        <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-2xl space-y-4">
                    <div className="relative aspect-video bg-muted rounded-2xl overflow-hidden shadow-lg border border-white/20">
                        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                        <div className={cn("absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-4 text-center bg-black/50 transition-opacity",
                          { "opacity-0": isVideoEnabled }
                        )}>
                            <VideoOff className="w-16 h-16" />
                            <p className="mt-4 text-lg text-white">Video is off</p>
                            <p className="text-sm text-white/80">Start your video to begin visual sentiment analysis.</p>
                        </div>
                        {isRecording && (
                          <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                            <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
                            Recording... 5s
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

            <div className="w-80 border-l border-border p-4 space-y-4 hidden md:block shrink-0 overflow-y-auto">
                <h4 className="font-semibold font-headline">Analysis Report</h4>
                {isAnalyzing ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : analysisResult ? (
                  <div className="space-y-4">
                    <div className="glassmorphism p-3 rounded-xl">
                      <h5 className="font-semibold text-sm mb-2">Detected Mood</h5>
                      <p className="text-lg font-bold gradient-text">{analysisResult.mood}</p>
                    </div>
                    <div className="glassmorphism p-3 rounded-xl">
                      <h5 className="font-semibold text-sm mb-2">Stress Level</h5>
                      <p className="font-semibold">{analysisResult.stressLevel}</p>
                    </div>
                    <div className="glassmorphism p-3 rounded-xl">
                      <h5 className="font-semibold text-sm mb-2">Summary</h5>
                      <p className="text-sm text-foreground/80">{analysisResult.summary}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground h-full flex flex-col justify-center items-center">
                    <p className="text-sm">Your report will appear here after the analysis is complete.</p>
                  </div>
                )}
            </div>
        </div>
    </div>
  );
}
