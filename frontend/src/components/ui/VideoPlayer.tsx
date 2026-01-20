"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface VideoPlayerProps {
    url: string;
    title: string;
    onProgress?: (progress: number) => void;
    onComplete?: () => void;
    initialProgress?: number;
}

export default function VideoPlayer({
    url,
    title,
    onProgress,
    onComplete,
    initialProgress = 0
}: VideoPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(initialProgress);
    const [duration, setDuration] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Extract YouTube ID if it's a YouTube URL
    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const youtubeId = getYoutubeId(url);

    // If it's a YouTube video, use iframe
    if (youtubeId) {
        return (
            <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 group">
                <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
                    title={title}
                    className="absolute top-0 left-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
                {/* Overlay for "Mark as Complete" if needed manually, though API usually handles this */}
                {/* For now, we'll keep it simple. Real YouTube API integration for progress tracking requires loading the YT Script. */}
                <div className="absolute top-4 right-4 z-10">
                    <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/10">
                        YouTube Video
                    </div>
                </div>
            </div>
        );
    }

    // Fallback for direct video files (mp4 etc)
    return (
        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 group">
            <video
                ref={videoRef}
                src={url}
                className="w-full h-full object-contain"
                onTimeUpdate={(e) => {
                    const v = e.currentTarget;
                    const p = (v.currentTime / v.duration) * 100;
                    setProgress(p);
                    if (onProgress) onProgress(p);
                    if (p >= 90 && !isCompleted) {
                        setIsCompleted(true);
                        if (onComplete) onComplete();
                    }
                }}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onEnded={() => setIsPlaying(false)}
            />

            {/* Custom Controls Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => {
                            if (videoRef.current) {
                                if (isPlaying) videoRef.current.pause();
                                else videoRef.current.play();
                                setIsPlaying(!isPlaying);
                            }
                        }}
                        className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:scale-110 transition-transform"
                    >
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-1" />}
                    </button>

                    <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden cursor-pointer">
                        <div
                            className="h-full bg-primary relative"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform" />
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            if (videoRef.current) {
                                videoRef.current.currentTime = 0;
                                videoRef.current.play();
                                setIsPlaying(true);
                            }
                        }}
                        className="text-white hover:text-primary transition-colors"
                    >
                        <RotateCcw className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
