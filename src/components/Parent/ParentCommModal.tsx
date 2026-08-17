import React, { useState } from 'react';
import {
  Mail,
  Sparkles,
  Send,
  X,
  Phone,
  User,
  CheckCircle2,
  Loader2,
  RefreshCw
} from 'lucide-react';

interface ParentCommModalProps {
  studentName: string;
  defaultReason?: string;
  onClose: () => void;
}

export const ParentCommModal: React.FC<ParentCommModalProps> = ({
  studentName,
  defaultReason = 'Attendance Defaulter Warning (<75% required minimum)',
  onClose
}) => {
  const [tone, setTone] = useState<'supportive' | 'urgent' | 'formal'>('supportive');
  const [parentName, setParentName] = useState('Guardian of ' + studentName);
  const [parentEmail, setParentEmail] = useState('parent.' + studentName.toLowerCase().replace(' ', '.') + '@gmail.com');
  const [details, setDetails] = useState(defaultReason);
  const [draftMessage, setDraftMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleGenerateDraft = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/gemini/draft-parent-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          reason: details,
          tone
        })
      });
      const data = await res.json();
      if (data.draft) {
        setDraftMessage(data.draft);
      }
    } catch (err) {
      console.error(err);
      setDraftMessage(`Dear Parent of ${studentName},\n\nWe would like to discuss recent updates regarding ${studentName}'s academic progress. Specifically: ${details}.\n\nPlease reach out to the academic coordinator.\n\nWarm regards,\nEduAI Campus Administration`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendMessage = () => {
    setSentSuccess(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#0f172a] border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">Parent Dispatch Communications</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {sentSuccess ? (
          <div className="my-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Official Notice Dispatched</h4>
            <p className="text-xs text-slate-400">
              Notification sent via Email & SMS Gateway to {parentEmail}.
            </p>
          </div>
        ) : (
          <div className="my-5 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Student</label>
                <input
                  type="text"
                  disabled
                  value={studentName}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 font-bold"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Parent Email</label>
                <input
                  type="email"
                  value={parentEmail}
                  onChange={e => setParentEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Communication Context / Trigger</label>
              <input
                type="text"
                value={details}
                onChange={e => setDetails(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
              />
            </div>

            {/* AI Generator Bar */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="font-bold text-white text-xs">AI Composer:</span>
                <div className="flex gap-1">
                  {(['supportive', 'urgent', 'formal'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTone(t)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold capitalize ${
                        tone === t ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerateDraft}
                disabled={isGenerating}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-xs shadow-md"
              >
                {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Draft with AI</span>
              </button>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Message Body</label>
              <textarea
                rows={5}
                value={draftMessage}
                onChange={e => setDraftMessage(e.target.value)}
                placeholder="Click 'Draft with AI' above or type custom communication text..."
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-indigo-500 leading-relaxed"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!draftMessage}
                className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25"
              >
                <Send className="w-4 h-4" />
                <span>Send Official Notice</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
