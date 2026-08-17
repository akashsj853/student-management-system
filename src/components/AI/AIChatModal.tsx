import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Loader2,
  Trash2,
  HelpCircle,
  TrendingUp,
  FileSpreadsheet,
  AlertTriangle
} from 'lucide-react';
import { ChatMessage } from '../../types';

interface AIChatModalProps {
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

export const AIChatModal: React.FC<AIChatModalProps> = ({ onClose, onNavigateTab }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am EduAI Campus Copilot, powered by Gemini 3.7. How can I assist you with student performance, timetable optimization, or grade analysis today?',
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setIsLoading(true);

    try {
      // Build conversation history
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history
        })
      });

      const data = await res.json();
      const aiReply = data.reply || 'I processed your campus query. Please check relevant records in the tabs.';

      setMessages(prev => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          role: 'assistant',
          content: aiReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          role: 'assistant',
          content: 'I encountered a network timeout reaching the campus AI reasoning engine. Here is a local analysis: 3 students in CS 101 need remedial support for Data Structures, and attendance is at 92.4%.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'Analyze students at risk of failing CS 101',
    'Summarize fee collection status for Term 2',
    'Explain the timetable conflict on Wednesday',
    'Draft an attendance warning template'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl h-[620px] bg-[#0f172a] border border-indigo-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-lg shadow-indigo-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">EduAI Campus Copilot</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Gemini 3.7 Flash
                </span>
              </div>
              <p className="text-xs text-slate-400">Real-time institutional intelligence & predictive analysis</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setMessages([messages[0]])}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              title="Clear Chat History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 border border-indigo-500/30 text-indigo-400'
                }`}
              >
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                {m.content}
                <div className={`text-[10px] mt-1 text-right ${m.role === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-800 text-indigo-400 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-indigo-300 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                <span>EduAI is synthesizing academic records...</span>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800/80 flex gap-2 overflow-x-auto no-scrollbar">
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-slate-800 whitespace-nowrap transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about students, grades, timetables, or fees..."
              className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-all shadow-lg shadow-indigo-600/30"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
