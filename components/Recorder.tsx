import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';

interface RecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  isProcessing: boolean;
}

const Recorder: React.FC<RecorderProps> = ({ onRecordingComplete, isProcessing }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(blob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);
      
      timerRef.current = window.setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (isProcessing) {
    return (
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
        <div className="bg-white text-indigo-600 px-6 py-3 rounded-full shadow-lg border border-indigo-100 flex items-center gap-3 animate-pulse">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-medium">Processing...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-4">
      {isRecording && (
        <div className="bg-red-50 text-red-600 px-4 py-1 rounded-full text-sm font-mono font-medium shadow-sm animate-fade-in border border-red-100">
          {formatDuration(duration)}
        </div>
      )}

      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`
          relative group flex items-center justify-center w-16 h-16 rounded-full shadow-xl transition-all duration-300
          ${isRecording 
            ? 'bg-white border-2 border-red-500 text-red-500 hover:scale-105' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-110 shadow-indigo-600/30'}
        `}
      >
        {isRecording ? (
          <>
            <span className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-20"></span>
            <Square className="w-6 h-6 fill-current" />
          </>
        ) : (
          <Mic className="w-8 h-8" />
        )}
      </button>
      
      {!isRecording && (
        <span className="text-xs text-gray-400 font-medium">Tap to Record</span>
      )}
    </div>
  );
};

export default Recorder;
