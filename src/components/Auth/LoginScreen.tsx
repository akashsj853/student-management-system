import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Sparkles,
  Lock,
  Mail,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Users,
  User,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { UserRole } from '../../types';

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [email, setEmail] = useState('admin@eduai.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const roleConfigs = [
    { role: 'student' as UserRole, label: 'Student', icon: User, defaultEmail: 'elena.rodriguez@eduai.edu' },
    { role: 'teacher' as UserRole, label: 'Teacher', icon: GraduationCap, defaultEmail: 's.jenkins@eduai.edu' },
    { role: 'parent' as UserRole, label: 'Parent', icon: Users, defaultEmail: 'carlos.r@gmail.com' },
    { role: 'admin' as UserRole, label: 'Admin', icon: Briefcase, defaultEmail: 'admin@eduai.edu' },
  ];

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    const config = roleConfigs.find(c => c.role === role);
    if (config) {
      setEmail(config.defaultEmail);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedRole);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#070d19] relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-[#0f172a]/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-black/60">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 text-white font-extrabold text-2xl shadow-xl shadow-indigo-500/30 mb-3">
              E
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">EduAI Portal</h2>
            <p className="text-xs text-slate-400 mt-1">
              AI-Powered Campus Management Platform
            </p>
          </div>

          {/* Role selection tabs */}
          <div className="grid grid-cols-4 gap-1.5 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 mb-6">
            {roleConfigs.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedRole === item.role;
              return (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => handleRoleSelect(item.role)}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                  <span className="text-[11px]">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email or Student / Staff ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@eduai.edu"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-800 text-indigo-600 focus:ring-0 focus:ring-offset-0"
                />
                Remember this workstation
              </label>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm transition-all shadow-xl shadow-indigo-600/30 hover:scale-[1.01]"
            >
              <span>Sign In to {roleConfigs.find(c => c.role === selectedRole)?.label} Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-400 mb-2 font-medium">Quick 1-Click Demo Profiles:</p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {roleConfigs.map(c => (
                <button
                  key={c.role}
                  onClick={() => {
                    setSelectedRole(c.role);
                    onLogin(c.role);
                  }}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
                >
                  {c.label} Demo
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Security watermark */}
        <div className="flex items-center justify-center gap-1.5 text-center mt-6 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>256-Bit Encrypted Campus Authentication System</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm bg-[#0f172a] border border-slate-700 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Reset Password</h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter your registered institute email or ID. We will send a secure verification code.
            </p>

            {resetSent ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-2">
                <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto" />
                <p className="text-xs font-semibold text-emerald-300">Reset instructions dispatched!</p>
                <p className="text-[11px] text-slate-400">Check your inbox for a one-time login link.</p>
                <button
                  onClick={() => {
                    setShowForgotModal(false);
                    setResetSent(false);
                  }}
                  className="mt-2 w-full py-2 bg-slate-800 text-white rounded-lg text-xs font-medium"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Enter your email..."
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setResetSent(true)}
                    className="flex-1 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                  >
                    Send Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
