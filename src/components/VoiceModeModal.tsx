import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Volume2, VolumeX, Sparkles, MessageCircle } from 'lucide-react';
import { TulipIcon } from './TulipIcon';
import { sendChatMessage } from '../services/api';
import { audioService } from '../services/audio';

interface VoiceModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendToChatHistory?: (userText: string, assistantReply: string) => void;
}

export const VoiceModeModal: React.FC<VoiceModeModalProps> = ({
  isOpen,
  onClose,
  onSendToChatHistory,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [ishantReply, setIshantReply] = useState<string>('Srishti, main sun raha hoon. Kahiye...');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) {
      audioService.stopSpeaking();
      setIsSpeaking(false);
      setIsListening(false);
      return;
    }

    // Set up speech recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onresult = async (event: any) => {
        const spoken = event.results[0][0].transcript;
        if (spoken) {
          setTranscript(spoken);
          setIsListening(false);
          await processVoiceInput(spoken);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [isOpen]);

  const processVoiceInput = async (spokenText: string) => {
    setIsProcessing(true);
    try {
      const reply = await sendChatMessage({
        message: spokenText,
      });

      setIshantReply(reply);
      setIsSpeaking(true);
      audioService.speak(reply, () => setIsSpeaking(false));

      if (onSendToChatHistory) {
        onSendToChatHistory(spokenText, reply);
      }
    } catch {
      setIshantReply('Srishti, ek chhota sa network pause aa gaya. Phir se boliye.');
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      audioService.stopSpeaking();
      setIsSpeaking(false);
      setIsListening(true);
      setTranscript('Listening to you, Srishti...');
      try {
        recognitionRef.current?.start();
      } catch {
        setIsListening(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#08291f] via-[#051c14] to-[#02110c] border border-emerald-500/50 p-6 md:p-8 shadow-2xl flex flex-col items-center text-center">
        {/* Close Button */}
        <button
          onClick={() => {
            audioService.stopSpeaking();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 hover:text-emerald-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand & Companion info */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-700/50 text-emerald-300 text-xs mb-3">
          <TulipIcon variant="simple" size={14} className="text-emerald-400" />
          <span className="font-semibold tracking-wider uppercase text-[10px]">Only us</span>
          <span>•</span>
          <span>Voice Mode</span>
        </div>

        <h2 className="font-serif-luxury text-2xl font-bold text-emerald-100">
          Speaking with Ishant
        </h2>
        <p className="text-xs text-emerald-400/80 font-light mt-0.5">
          Speak in Hindi, Hinglish, or English. Ishant will listen & answer.
        </p>

        {/* Ambient Pulsing Orb & Tulip Center */}
        <div className="relative my-8 flex items-center justify-center">
          {/* Waveform rings */}
          <div
            className={`absolute w-44 h-44 rounded-full border border-emerald-400/20 transition-all duration-700 ${
              isListening || isSpeaking ? 'scale-125 opacity-60 animate-ping' : 'scale-100 opacity-20'
            }`}
          />
          <div
            className={`absolute w-36 h-36 rounded-full bg-emerald-500/10 transition-all duration-500 ${
              isListening || isSpeaking ? 'scale-110 opacity-70' : 'scale-90 opacity-20'
            }`}
          />

          <div
            onClick={toggleListening}
            className={`w-28 h-28 rounded-full border-2 cursor-pointer flex flex-col items-center justify-center shadow-2xl transition-all duration-300 ${
              isListening
                ? 'bg-rose-950/80 border-rose-500 shadow-rose-900/50 scale-105'
                : isSpeaking
                ? 'bg-emerald-900/60 border-emerald-400 shadow-emerald-500/40 scale-105'
                : 'bg-[#041911] border-emerald-600 hover:border-emerald-400 hover:scale-102'
            }`}
          >
            {isListening ? (
              <MicOff className="w-8 h-8 text-rose-300 animate-pulse" />
            ) : isSpeaking ? (
              <Volume2 className="w-8 h-8 text-emerald-300 animate-pulse" />
            ) : (
              <TulipIcon variant="logo" size={40} />
            )}
          </div>
        </div>

        {/* Status prompt */}
        <div className="w-full space-y-3">
          <div className="min-h-[50px] p-3 rounded-2xl bg-[#03130d] border border-emerald-800/40 text-xs text-emerald-200">
            {isListening ? (
              <span className="text-emerald-400 animate-pulse">Listening to Srishti...</span>
            ) : isProcessing ? (
              <span className="text-teal-400 animate-pulse">Ishant is thinking...</span>
            ) : transcript ? (
              <span className="italic">"{transcript}"</span>
            ) : (
              <span className="text-emerald-600">Tap the mic button and speak freely</span>
            )}
          </div>

          {/* Ishant's Voice Reply Bubble */}
          <div className="p-4 rounded-2xl bg-[#06241a] border border-emerald-700/50 text-xs text-emerald-100 leading-relaxed text-left">
            <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ishant’s Voice:</span>
            </div>
            <p className="italic">"{ishantReply}"</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={toggleListening}
            className={`px-5 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-md active:scale-95 flex items-center gap-2 ${
              isListening
                ? 'bg-rose-600 text-white hover:bg-rose-500'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>{isListening ? 'Stop Listening' : 'Tap to Speak'}</span>
          </button>

          {isSpeaking && (
            <button
              onClick={() => {
                audioService.stopSpeaking();
                setIsSpeaking(false);
              }}
              className="px-4 py-2.5 rounded-xl border border-emerald-800 text-emerald-400 hover:text-emerald-200 text-xs flex items-center gap-1.5"
            >
              <VolumeX className="w-4 h-4" />
              <span>Mute Voice</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
