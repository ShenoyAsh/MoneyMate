"use client";

import { useState, useEffect } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import { processVoiceCommand } from "@/actions/transaction";

export function VoiceScanner({ onScanComplete }) {
  const [isListening, setIsListening] = useState(false);
  
  const {
    loading: voiceLoading,
    fn: processVoiceFn,
    data: voiceData,
    error,
  } = useFetch(processVoiceCommand);

  useEffect(() => {
    if (voiceData && !voiceLoading) {
      onScanComplete(voiceData);
      toast.success("Voice command processed successfully");
    }
  }, [voiceLoading, voiceData, onScanComplete]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to process voice command");
    }
  }, [error]);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      toast.error("Your browser does not support voice recognition");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      toast.info("Listening... Speak now");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        toast.loading(`Processing: "${transcript}"`);
        await processVoiceFn(transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      toast.error("Error listening to voice command");
    };

    recognition.start();
  };

  return (
    <Button
      type="button"
      variant="outline"
      className={`w-full h-10 ${
        isListening ? "bg-red-50 border-red-500 text-red-600 animate-pulse" : "bg-blue-50 text-blue-600 hover:bg-blue-100"
      }`}
      onClick={startListening}
      disabled={voiceLoading}
    >
      {voiceLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Processing...</span>
        </>
      ) : isListening ? (
        <>
          <MicOff className="mr-2 h-4 w-4" />
          <span>Stop Listening</span>
        </>
      ) : (
        <>
          <Mic className="mr-2 h-4 w-4" />
          <span>Voice Command (Beta)</span>
        </>
      )}
    </Button>
  );
}