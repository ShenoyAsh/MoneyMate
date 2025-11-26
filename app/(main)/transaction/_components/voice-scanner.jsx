"use client";

import { useState, useEffect, useCallback } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { processVoiceCommand } from "@/actions/transaction";

export function VoiceScanner({ onScanComplete }) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleVoiceProcess = async (transcript) => {
    if (!transcript) return;

    // 1. Create a loading toast and SAVE THE ID
    const toastId = toast.loading(`Processing: "${transcript}"`);
    setIsProcessing(true);

    try {
      // 2. Call the Server Action directly
      const data = await processVoiceCommand(transcript);
      
      // 3. Force the SAME toast ID to become Success
      toast.success("Voice command processed successfully", {
        id: toastId,
      });

      // 4. Update the form
      onScanComplete(data);

    } catch (error) {
      console.error("Voice command error:", error);
      
      // 5. Force the SAME toast ID to become Error
      toast.error(error.message || "Failed to process voice command", {
        id: toastId,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const startListening = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

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

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        // Call our manual handler instead of useFetch
        handleVoiceProcess(transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      toast.error("Error listening to voice command");
    };

    recognition.start();
  }, [onScanComplete]); // Dependency for useCallback

  return (
    <Button
      type="button"
      variant="outline"
      className={`w-full h-10 ${
        isListening
          ? "bg-red-50 border-red-500 text-red-600 animate-pulse"
          : "bg-blue-50 text-blue-600 hover:bg-blue-100"
      }`}
      onClick={startListening}
      disabled={isProcessing}
    >
      {isProcessing ? (
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