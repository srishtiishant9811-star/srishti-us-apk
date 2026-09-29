import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Trash2,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { TulipIcon } from './TulipIcon';
import { Message, Memory } from '../types';
import { sendChatMessage } from '../services/api';
import { audioService } from '../services/audio';

interface ChatScreenProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  memories: Memory[];
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
  voiceReadoutEnabled: boolean;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  messages,
  setMessages,
  memories,
  initialPrompt,
  onClearInitialPrompt,
  voiceReadoutEnabled,
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Handle initial prompt from other screens (e.g. from Home or Favourites)
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt.trim());
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Setup Web Speech recognition if available
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN'; // Works for Indian English, Hinglish

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
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
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. You can type your message!');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      try {
        recognitionRef.current.start();
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || isLoading) return;

    setErrorMessage(null);
    setInput('');

    const userMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      role: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      // Build relevant memories context
      const activeMemories = memories
        .filter((m) => m.includeInContext)
        .map((m) => `[${m.category}: ${m.title} - ${m.description}]`)
        .join('; ');

      const historyPayload = newHistory.slice(-10).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const reply = await sendChatMessage({
        message: messageText,
        history: historyPayload,
        context: activeMemories,
      });

      const assistantMessage: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        role: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // If voice readout is enabled, speak Ishant's reply
      if (voiceReadoutEnabled) {
        setSpeakingMessageId(assistantMessage.id);
        audioService.speak(reply, () => setSpeakingMessageId(null));
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Ishant could not respond right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakMessage = (msg: Message) => {
    if (speakingMessageId === msg.id) {
      audioService.stopSpeaking();
      setSpeakingMessageId(null);
    } else {
      setSpeakingMessageId(msg.id);
      audioService.speak(msg.text, () => setSpeakingMessageId(null));
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear all conversation history with Ishant?')) {
      audioService.stopSpeaking();
      setMessages([]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-h-[820px] rounded-3xl bg-[#03130d] border border-emerald-800/40 overflow-hidden shadow-2xl">
      {/* Chat Header */}
      <div className="px-4 py-3 bg-[#051a13]/90 border-b border-emerald-800/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-800 to-teal-900 p-1.5 flex items-center justify-center border border-emerald-600/40">
              <TulipIcon variant="logo" size={20} />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#051a13]"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-semibold text-emerald-100 text-sm">Ishant</h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-700/50 text-emerald-400">
                AI Companion
              </span>
            </div>
            <p className="text-[11px] text-emerald-400/80 font-light">
              Hindi • Hinglish • English
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {messages.length > 0 && (
            <button
              onClick={handleClearHistory}
              title="Clear conversation"
              className="p-2 rounded-xl text-emerald-500 hover:text-rose-400 hover:bg-rose-950/30 transition-all text-xs flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-emerald-300/80">
            <div className="w-16 h-16 rounded-3xl bg-emerald-950/60 border border-emerald-700/40 flex items-center justify-center p-3 mb-4 shadow-inner">
              <TulipIcon variant="logo" size={36} />
            </div>
            <h3 className="font-serif-luxury text-xl text-emerald-100 font-medium">
              Hello Srishti, I’m Ishant.
            </h3>
            <p className="text-xs text-emerald-400/80 max-w-sm mt-1.5 leading-relaxed font-light">
              Main yahan hoon aapke saath. We can talk about your day, share a joke, chat about Boys
              Over Flowers or Chole Bhature, or just enjoy a quiet moment.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-md">
              {[
                'Kaisi ho Ishant?',
                'Chole bhature khane ka mann kar raha hai!',
                'Tell me something relaxing for tonight',
                'Suggest a romantic comedy movie',
              ].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(suggestion)}
                  className="text-xs px-3 py-1.5 rounded-xl bg-[#062016] border border-emerald-800/50 hover:border-emerald-500/60 text-emerald-200 hover:text-emerald-100 transition-all"
                >
                  "{suggestion}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === 'user';
            const isSpeaking = speakingMessageId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}
              >
                <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[75%]">
                  {!isUser && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-700/40 p-1 flex-shrink-0 flex items-center justify-center mb-1">
                      <TulipIcon variant="simple" size={14} className="text-emerald-400" />
                    </div>
                  )}

                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      isUser
                        ? 'bg-gradient-to-r from-emerald-700 to-teal-800 text-emerald-50 rounded-br-none shadow-md shadow-emerald-950/40'
                        : 'bg-[#062217] border border-emerald-700/40 text-emerald-100 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>

                {/* Message footer: time, audio speak, copy */}
                <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-emerald-500/70">
                  <span>{msg.timestamp}</span>

                  {!isUser && (
                    <>
                      <span>•</span>
                      <button
                        onClick={() => handleSpeakMessage(msg)}
                        className={`hover:text-emerald-300 transition-colors flex items-center gap-0.5 ${
                          isSpeaking ? 'text-emerald-300 font-semibold' : ''
                        }`}
                        title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
                      >
                        {isSpeaking ? (
                          <VolumeX className="w-3 h-3 text-emerald-400 animate-pulse" />
                        ) : (
                          <Volume2 className="w-3 h-3" />
                        )}
                        <span>{isSpeaking ? 'Pause' : 'Listen'}</span>
                      </button>

                      <span>•</span>
                      <button
                        onClick={() => handleCopy(msg.text, msg.id)}
                        className="hover:text-emerald-300 transition-colors flex items-center gap-0.5"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Loading state indicator */}
        {isLoading && (
          <div className="flex items-end gap-2 max-w-[80%]">
            <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-700/40 p-1 flex-shrink-0 flex items-center justify-center mb-1">
              <TulipIcon variant="simple" size={14} className="text-emerald-400 animate-bounce" />
            </div>
            <div className="rounded-2xl rounded-bl-none px-4 py-3 bg-[#062217] border border-emerald-700/40 text-emerald-300 text-xs flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Ishant is thinking...</span>
            </div>
          </div>
        )}

        {/* Error message card */}
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-rose-950/50 border border-rose-800/50 text-rose-200 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => handleSendMessage()}
              className="px-2.5 py-1 rounded-lg bg-rose-900/60 hover:bg-rose-800/80 text-rose-100 flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              Retry
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-3 bg-[#051a13] border-t border-emerald-800/30">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center gap-2"
        >
          {/* Speech-to-text mic button */}
          <button
            type="button"
            onClick={toggleListening}
            title={isListening ? 'Stop listening' : 'Speak to Ishant'}
            className={`p-3 rounded-2xl border transition-all ${
              isListening
                ? 'bg-rose-900/80 border-rose-500 text-rose-200 animate-pulse shadow-lg shadow-rose-900/40'
                : 'bg-emerald-950/60 border-emerald-800/50 text-emerald-400 hover:text-emerald-200 hover:border-emerald-600'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isListening ? 'Listening to Srishti... speak now' : 'Message Ishant (Hindi, Hinglish, English)...'
            }
            className="flex-1 bg-[#03130d] border border-emerald-700/40 rounded-2xl py-3 px-4 text-sm text-emerald-100 placeholder-emerald-600/70 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all shadow-inner"
          />

          {/* Send button */}
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white disabled:opacity-40 disabled:pointer-events-none transition-all shadow-md shadow-emerald-950/50"
            title="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
