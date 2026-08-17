import React from 'react';
import { X, Printer, Download, Sparkles, Award, QrCode } from 'lucide-react';
import { Student } from '../../types';

interface IDCardModalProps {
  student: Student;
  onClose: () => void;
}

export const IDCardModal: React.FC<IDCardModalProps> = ({ student, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0f172a] border border-slate-700/60 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-semibold text-white">Digital Student Identity Card</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Physical ID Card Mockup */}
        <div className="my-6 p-6 rounded-2xl bg-gradient-to-br from-indigo-950/80 via-[#131d36] to-slate-900 border-2 border-indigo-500/30 relative overflow-hidden shadow-2xl">
          {/* Decorative badges */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Institution Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
                E
              </div>
              <div>
                <h4 className="text-xs font-bold tracking-wider text-white uppercase">EduAI Institute of Tech</h4>
                <p className="text-[10px] text-indigo-300">Official Student Identity</p>
              </div>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
              ACTIVE
            </span>
          </div>

          {/* Student Info Body */}
          <div className="flex gap-4 mt-4 items-center">
            <div className="relative">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-20 h-20 rounded-xl object-cover border-2 border-indigo-400/50 shadow-md"
              />
              <div className="absolute -bottom-1.5 -right-1.5 p-1 bg-indigo-600 rounded-full text-white text-[9px]">
                <Sparkles className="w-3 h-3" />
              </div>
            </div>

            <div className="flex-1 space-y-1">
              <h5 className="text-base font-bold text-white leading-tight">{student.name}</h5>
              <p className="text-xs font-medium text-indigo-400 font-mono">{student.studentId}</p>
              <div className="text-[11px] text-slate-300">
                <p><span className="text-slate-400">Dept:</span> {student.department}</p>
                <p><span className="text-slate-400">Batch:</span> {student.year} ({student.semester})</p>
              </div>
            </div>
          </div>

          {/* Secondary Details Grid */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/10 text-[11px]">
            <div>
              <span className="text-slate-400 block text-[10px]">Blood Group</span>
              <span className="font-semibold text-slate-200">{student.bloodGroup}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Valid Thru</span>
              <span className="font-semibold text-slate-200">June 2027</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Emergency Contact</span>
              <span className="font-semibold text-slate-200">{student.parentPhone}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Campus Transit</span>
              <span className="font-semibold text-emerald-400">Route 01 Verified</span>
            </div>
          </div>

          {/* Barcode & QR Code simulation */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex gap-0.5 h-6 items-center">
                {[4, 2, 6, 1, 3, 5, 2, 7, 2, 4, 1, 5, 3, 6, 2, 4, 2, 5, 1, 4].map((w, idx) => (
                  <div key={idx} className="bg-slate-300 h-full" style={{ width: `${w}px` }} />
                ))}
              </div>
              <p className="text-[8px] font-mono text-slate-400 tracking-widest">{student.studentId} • VERIFIED</p>
            </div>
            <div className="p-1.5 bg-white rounded-lg shadow">
              <QrCode className="w-8 h-8 text-slate-900" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-colors border border-slate-700"
          >
            <Printer className="w-4 h-4" />
            Print ID Card
          </button>
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors shadow-lg shadow-indigo-500/25"
          >
            <Download className="w-4 h-4" />
            Save as Pass
          </button>
        </div>
      </div>
    </div>
  );
};
