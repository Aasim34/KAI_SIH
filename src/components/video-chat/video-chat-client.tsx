"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Video, VideoOff } from 'lucide-react';
import { Progress } from '../ui/progress';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

export function VideoChatClient() {
  const { toast } = useToast();

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        // We have permission, but keep the stream in videoRef to use later.
        // The video element is not trying to play it yet.
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        // Stop tracks immediately to prevent the camera light from turning on.
        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    };
    getCameraPermission();
  }, []);

  const enableVideo = async () => {
    if (hasCameraPermission === false) {
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings to use this feature.',
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.error("Video play failed", e));
      }
      setIsVideoEnabled(true);
    } catch (error) {
      console.error("Failed to get camera stream:", error);
      toast({
        variant: 'destructive',
        title: 'Could not start video',
        description: 'Failed to access the camera. Please check permissions.',
      });
    }
  }

  const disableVideo = () => {
     if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsVideoEnabled(false);
  }

  const toggleVideo = () => {
    if (isVideoEnabled) {
      disableVideo();
    } else {
      enableVideo();
    }
  }

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
                        <video ref={videoRef} className={cn("w-full h-full object-cover")} autoPlay muted playsInline />
                        {!isVideoEnabled && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
                            <VideoOff className="w-16 h-16" />
                            <p className="mt-4 text-lg">Video is off</p>
                            <p className="text-sm">Start your video to begin visual sentiment analysis.</p>
                        </div>
                        )}
                    </div>

                    {hasCameraPermission === false && !isVideoEnabled && (
                        <Alert variant="destructive">
                            <AlertTitle>Camera Access Required</AlertTitle>
                            <AlertDescription>
                                Please allow camera access in your browser settings to use this feature.
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="flex gap-4 justify-center">
                        <Button size="lg" className="gap-2 h-12 px-6 text-base bg-gradient-to-r from-purple-600 to-blue-600 text-white" onClick={toggleVideo}>
                            <Video className="h-5 w-5"/>
                            {isVideoEnabled ? 'Stop Video Analysis' : 'Start Video Analysis'}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="w-80 border-l border-border p-4 space-y-4 hidden md:block shrink-0 overflow-y-auto">
                <h4 className="font-semibold font-headline">Real-time Analysis</h4>
                <div className="glassmorphism p-3 rounded-xl">
                    <h5 className="font-semibold text-sm mb-2">Current State</h5>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Mood</span><span className="text-muted-foreground">--</span></div>
                        <div className="flex justify-between"><span>Stress</span><span className="text-muted-foreground">--</span></div>
                        <div className="flex justify-between"><span>Energy</span><span className="text-muted-foreground">--</span></div>
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
