'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Calendar,
  Phone,
  MessageCircle,
  HelpCircle,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { ClinicSettings } from '@/lib/clinicData';

interface AIReceptionistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
  settings: ClinicSettings;
}

interface Message {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  timestamp: string;
}

const formatCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const AIReceptionistModal: React.FC<AIReceptionistModalProps> = ({
  isOpen,
  onClose,
  onOpenBooking,
  settings,
}) => {
  const msgCounterRef = useRef(100);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      text: `Bonjour et bienvenue chez GH Clinic ! Je suis l’assistante virtuelle du Dr. Ghaouat Sarra à Khemis Miliana. Que souhaitez-vous savoir sur nos protocoles lasers, nos injections ou nos disponibilités de consultation ?`,
      timestamp: '09:00',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const quickQuestions = [
    'Quels sont les tarifs du Laser à Khemis ?',
    'Comment fonctionne le Botox naturel ?',
    'Avantages du soin Hydrafacial MD ?',
    'Où se trouve le cabinet et quels sont les horaires ?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim() || isLoading) return;

    msgCounterRef.current += 1;
    const userMsgId = `usr-${msgCounterRef.current}`;
    const currentTime = formatCurrentTime();

    const userMsg: Message = {
      id: userMsgId,
      role: 'user',
      text: query,
      timestamp: currentTime,
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-receptionist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          conversationHistory: newHistory.map((m) => ({
            role: m.role,
            text: m.text,
          })),
        }),
      });

      const data = await response.json();
      
      msgCounterRef.current += 1;
      const assistantMsg: Message = {
        id: `ast-${msgCounterRef.current}`,
        role: 'assistant',
        text: data.reply || "Je suis à votre disposition. Souhaitez-vous planifier une consultation avec Dr. Ghaouat Sarra ?",
        timestamp: formatCurrentTime(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      msgCounterRef.current += 1;
      const fallbackMsg: Message = {
        id: `ast-err-${msgCounterRef.current}`,
        role: 'assistant',
        text: `Pour toute information directe ou prise de rendez-vous avec Dr. Ghaouat Sarra, vous pouvez nous joindre au ${settings.phone} ou directement sur WhatsApp.`,
        timestamp: formatCurrentTime(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-[#E5D4CB] h-[85vh] sm:h-[650px] flex flex-col animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#1C1917] via-[#292524] to-[#1C1917] text-white flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#DFBA9D] via-[#C5A089] to-[#9E6B55] flex items-center justify-center text-white shadow-md font-serif font-bold text-sm">
                GH
              </div>
              <span className="w-3 h-3 rounded-full bg-emerald-400 absolute -bottom-0.5 -right-0.5 border-2 border-[#1C1917]" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif font-bold text-base text-white">Assistante GH Clinic</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#DFBA9D]/20 text-[#DFBA9D] border border-[#DFBA9D]/30 font-medium">
                  IA Médicale
                </span>
              </div>
              <p className="text-[11px] text-stone-400 font-light">
                Dr. Ghaouat Sarra • Khemis Miliana
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Informative Banner */}
        <div className="px-4 py-2 bg-[#FAF8F5] border-b border-[#E5D4CB] text-[11px] text-stone-600 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#9E6B55]" />
            <span>Réponses médicales basées sur les protocoles officiels du cabinet</span>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FAF8F5]">
          {messages.map((msg) => {
            const isBot = msg.role === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#DFBA9D] to-[#9E6B55] text-white flex items-center justify-center shrink-0 text-xs shadow-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                    isBot
                      ? 'bg-white text-stone-800 border border-[#E5D4CB] rounded-bl-xs'
                      : 'bg-gradient-to-r from-[#DFBA9D] via-[#C5A089] to-[#9E6B55] text-white rounded-br-xs font-medium'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span
                    className={`block text-[9px] mt-1.5 text-right ${
                      isBot ? 'text-stone-400' : 'text-white/80'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {!isBot && (
                  <div className="w-7 h-7 rounded-full bg-stone-800 text-white flex items-center justify-center shrink-0 text-xs">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-end gap-2.5 justify-start">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#DFBA9D] to-[#9E6B55] text-white flex items-center justify-center shrink-0 text-xs shadow-xs">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-[#E5D4CB] rounded-bl-xs shadow-2xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#9E6B55] animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 rounded-full bg-[#9E6B55] animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 rounded-full bg-[#9E6B55] animate-bounce" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Questions */}
        <div className="px-4 py-2 bg-white border-t border-stone-100 flex gap-1.5 overflow-x-auto scrollbar-none">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="shrink-0 px-3 py-1.5 rounded-full bg-[#FAF8F5] hover:bg-[#F4DCD6]/60 border border-[#E5D4CB] text-[11px] text-stone-700 hover:text-[#9E6B55] transition-colors whitespace-nowrap"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Bottom Actions and Chat Input */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#E5D4CB] space-y-2">
          
          {/* Quick RDV & WhatsApp Shortcut Buttons */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenBooking();
              }}
              className="flex-1 py-1.5 px-3 rounded-xl bg-[#F4DCD6] hover:bg-[#ebd0c9] text-[#9E6B55] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Prendre RDV</span>
            </button>

            <a
              href={`https://wa.me/${settings.whatsappPhone}?text=${encodeURIComponent("Bonjour Dr. Ghaouat, je souhaite me renseigner sur vos consultations.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Direct</span>
            </a>
          </div>

          {/* Text Input & Send */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Posez votre question sur les soins, tarifs, laser..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-full border border-stone-200 focus:border-[#9E6B55] focus:outline-hidden text-xs sm:text-sm text-stone-800 bg-[#FAF8F5]"
            />

            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-[#DFBA9D] via-[#C5A089] to-[#9E6B55] text-white flex items-center justify-center shadow-md disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 transition-all shrink-0"
              aria-label="Envoyer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
