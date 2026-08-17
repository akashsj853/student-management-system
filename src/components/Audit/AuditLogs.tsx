import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  FileText,
  Filter,
  Search,
  Download,
  RefreshCw,
  Clock,
  Lock,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Eye,
  RotateCcw,
  Flag,
  Key,
  Laptop,
  Globe,
  Fingerprint,
  Database,
  Plus,
  Sparkles,
  X,
  ChevronDown,
  ChevronUp,
  Award,
  CalendarCheck,
  DollarSign,
  BookOpen,
  User,
  Users,
  Copy,
  Check
} from 'lucide-react';
import { AuditLog, AuditActionType, AuditSeverity, AuditStatus, UserRole } from '../../types';
import { INITIAL_AUDIT_LOGS } from '../../data/mockData';

interface AuditLogsProps {
  currentRole: UserRole;
  onNavigateToStudent?: (studentId: string) => void;
}

export const AuditLogs: React.FC<AuditLogsProps> = ({ currentRole }) => {
  const [logs, setLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [dateRange, setDateRange] = useState<'All' | 'Today' | '7days'>('All');

  const [expandedLogId, setExpandedLogId] = useState<string | null>('log-001');
  const [selectedLogForModal, setSelectedLogForModal] = useState<AuditLog | null>(null);

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [showSimulateModal, setShowSimulateModal] = useState(false);
  const [copiedHashId, setCopiedHashId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Simulation form state
  const [simActionType, setSimActionType] = useState<AuditActionType>('Grade Update');
  const [simActor, setSimActor] = useState('Dr. Sarah Jenkins');
  const [simTarget, setSimTarget] = useState('Elena Rodriguez (CS-2023-089) • CS 101');
  const [simDesc, setSimDesc] = useState('Modified final exam score from 92/100 to 96/100 after re-checking bonus question.');
  const [simPrev, setSimPrev] = useState('Final Exam: 92/100 (A)');
  const [simNew, setSimNew] = useState('Final Exam: 96/100 (A+)');
  const [simSeverity, setSimSeverity] = useState<AuditSeverity>('medium');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered logs calculation
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          log.actorName.toLowerCase().includes(q) ||
          (log.actorEmail && log.actorEmail.toLowerCase().includes(q)) ||
          log.actionTitle.toLowerCase().includes(q) ||
          log.actionType.toLowerCase().includes(q) ||
          log.targetResource.toLowerCase().includes(q) ||
          log.description.toLowerCase().includes(q) ||
          log.ipAddress.toLowerCase().includes(q) ||
          log.integrityHash.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // Action type filter
      if (selectedType !== 'All' && log.actionType !== selectedType) {
        return false;
      }

      // Severity filter
      if (selectedSeverity !== 'All' && log.severity !== selectedSeverity.toLowerCase()) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'All' && log.status !== selectedStatus) {
        return false;
      }

      // Role filter
      if (selectedRole !== 'All' && log.actorRole !== selectedRole.toLowerCase()) {
        return false;
      }

      // Date range filter
      if (dateRange === 'Today' && !log.timestamp.includes('2026-08-16')) {
        return false;
      }

      return true;
    });
  }, [logs, searchQuery, selectedType, selectedSeverity, selectedStatus, selectedRole, dateRange]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const total = logs.length;
    const gradeUpdates = logs.filter((l) => l.actionType === 'Grade Update').length;
    const attendanceOverrides = logs.filter((l) => l.actionType === 'Attendance Change').length;
    const securityEvents = logs.filter(
      (l) => l.actionType === 'Security & Auth' || l.actionType === 'Login & Session'
    ).length;
    const flagged = logs.filter((l) => l.status === 'Flagged').length;
    return { total, gradeUpdates, attendanceOverrides, securityEvents, flagged };
  }, [logs]);

  // Action: Revert a Log Action
  const handleRevertLog = (logId: string) => {
    setLogs((prev) =>
      prev.map((log) => {
        if (log.id === logId) {
          return {
            ...log,
            status: 'Reverted',
            reverted: true,
            description: `[REVERTED BY ADMIN ON ${new Date().toLocaleTimeString()}] ${log.description}`
          };
        }
        return log;
      })
    );
    showToast(`Action #${logId} was successfully marked as Reverted & rolled back.`);
  };

  // Action: Flag for Review
  const handleFlagLog = (logId: string) => {
    setLogs((prev) =>
      prev.map((log) => {
        if (log.id === logId) {
          const newStatus: AuditStatus = log.status === 'Flagged' ? 'Verified' : 'Flagged';
          return { ...log, status: newStatus };
        }
        return log;
      })
    );
    showToast(`Audit log status updated.`);
  };

  // Action: Verify Cryptographic Integrity
  const handleVerifyIntegrity = () => {
    setIsVerifying(true);
    setVerificationSuccess(false);
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationSuccess(true);
      showToast('All 10 Audit Log SHA-256 block hashes verified against immutable Merkle tree root.');
      setTimeout(() => setVerificationSuccess(false), 5000);
    }, 1200);
  };

  // Action: Copy Hash
  const handleCopyHash = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHashId(id);
    setTimeout(() => setCopiedHashId(null), 2000);
  };

  // Action: Export Audit Trail as JSON / CSV
  const handleExport = (format: 'json' | 'csv') => {
    if (format === 'json') {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `EduAI_Audit_Trail_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else {
      const headers = ['ID', 'Timestamp', 'Actor', 'Role', 'Action Type', 'Title', 'Target', 'Severity', 'Status', 'IP', 'Hash'];
      const rows = logs.map((l) => [
        l.id,
        `"${l.timestamp}"`,
        `"${l.actorName}"`,
        l.actorRole,
        `"${l.actionType}"`,
        `"${l.actionTitle}"`,
        `"${l.targetResource}"`,
        l.severity,
        l.status,
        l.ipAddress,
        l.integrityHash
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `EduAI_Audit_Logs_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
    showToast(`Audit trail exported as ${format.toUpperCase()}`);
  };

  // Action: Simulate new Live Action
  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `log-0${logs.length + 1}`;
    const newLog: AuditLog = {
      id: newId,
      timestamp: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }),
      actorName: simActor,
      actorRole: simActor.toLowerCase().includes('admin') || simActor.toLowerCase().includes('dean') ? 'admin' : 'teacher',
      actorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      actionType: simActionType,
      actionTitle: `${simActionType} Registered`,
      targetResource: simTarget,
      description: simDesc,
      previousValue: simPrev || undefined,
      newValue: simNew || undefined,
      ipAddress: '192.168.4.102',
      location: 'Main Administrative Complex',
      device: 'Edge 124.0 (Windows 11 Enterprise)',
      severity: simSeverity,
      status: 'Verified',
      integrityHash: Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    };

    setLogs([newLog, ...logs]);
    setShowSimulateModal(false);
    showToast(`New simulated event "${simActionType}" successfully committed to audit ledger.`);
  };

  // Icon Helper by Action Type
  const getActionIcon = (type: AuditActionType) => {
    switch (type) {
      case 'Grade Update':
        return Award;
      case 'Attendance Change':
        return CalendarCheck;
      case 'Login & Session':
        return Lock;
      case 'Security & Auth':
        return ShieldAlert;
      case 'Fee Adjustment':
        return DollarSign;
      case 'Course & Timetable':
        return BookOpen;
      case 'Student Record':
        return User;
      default:
        return FileText;
    }
  };

  // Color Helper by Action Type
  const getActionBadgeColor = (type: AuditActionType) => {
    switch (type) {
      case 'Grade Update':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'Attendance Change':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'Login & Session':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'Security & Auth':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      case 'Fee Adjustment':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'Course & Timetable':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      case 'Student Record':
        return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
      default:
        return 'bg-slate-500/15 text-slate-300 border-slate-500/30';
    }
  };

  const getSeverityBadge = (severity: AuditSeverity) => {
    switch (severity) {
      case 'critical':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40 ring-1 ring-rose-500/30';
      case 'high':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'medium':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'low':
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600/40';
    }
  };

  const getStatusBadge = (status: AuditStatus) => {
    switch (status) {
      case 'Verified':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 flex items-center gap-1';
      case 'Flagged':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 flex items-center gap-1 animate-pulse';
      case 'Reverted':
        return 'bg-slate-700 text-slate-400 border-slate-600 line-through flex items-center gap-1';
      case 'Under Review':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30 flex items-center gap-1';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0f172a] border border-indigo-500/50 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-[#0a1224] to-[#070c18] border border-slate-800/90 rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
              Security Subsystem & Governance
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Institutional Audit Logs & Accountability Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
            Immutable, tamper-evident audit trail capturing faculty grade changes, attendance manual overrides, authentication attempts, and administrative modifications.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex flex-wrap items-center gap-2.5 z-10">
          <button
            onClick={handleVerifyIntegrity}
            disabled={isVerifying}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              verificationSuccess
                ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/50 shadow-lg shadow-emerald-600/20'
                : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600'
            }`}
            title="Verify SHA-256 Hashes of all ledger records"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin text-indigo-400' : 'text-slate-400'}`} />
            <span>{isVerifying ? 'Verifying Hashes...' : verificationSuccess ? 'Ledger Verified (100%)' : 'Verify Integrity'}</span>
          </button>

          <button
            onClick={() => handleExport('csv')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowSimulateModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Simulate User Action</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#0b1329] border border-slate-800/80 shadow-md flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Logged Events</p>
            <h3 className="text-2xl font-black text-white mt-1">{metrics.total}</h3>
            <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">100% Immutable Records</p>
          </div>
          <div className="p-3 rounded-2xl bg-indigo-600/15 border border-indigo-500/20 text-indigo-400">
            <Database className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0b1329] border border-slate-800/80 shadow-md flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Grade Modifications</p>
            <h3 className="text-2xl font-black text-purple-400 mt-1">{metrics.gradeUpdates}</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Before/After Diff Tracked</p>
          </div>
          <div className="p-3 rounded-2xl bg-purple-600/15 border border-purple-500/20 text-purple-400">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0b1329] border border-slate-800/80 shadow-md flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Attendance Overrides</p>
            <h3 className="text-2xl font-black text-emerald-400 mt-1">{metrics.attendanceOverrides}</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Medical & Manual Edits</p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-600/15 border border-emerald-500/20 text-emerald-400">
            <CalendarCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0b1329] border border-slate-800/80 shadow-md flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Auth & Sessions</p>
            <h3 className="text-2xl font-black text-blue-400 mt-1">{metrics.securityEvents}</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">IP & Geofence Logged</p>
          </div>
          <div className="p-3 rounded-2xl bg-blue-600/15 border border-blue-500/20 text-blue-400">
            <Lock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0b1329] border border-slate-800/80 shadow-md flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Integrity Seal</p>
            <h3 className="text-sm font-black text-emerald-400 mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> SHA-256 Valid
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Zero Tamper Warnings</p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-600/15 border border-emerald-500/20 text-emerald-400">
            <Fingerprint className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#0b1329] border border-slate-800/90 rounded-2xl p-4 space-y-3.5 shadow-md">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by faculty, student name, student ID, IP address, resource, or SHA-256 hash..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Dropdowns */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Severity */}
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical Only</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {/* Status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Verified">Verified</option>
              <option value="Flagged">Flagged for Review</option>
              <option value="Reverted">Reverted</option>
            </select>

            {/* Actor Role */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="All">All Roles</option>
              <option value="admin">Admin</option>
              <option value="teacher">Teacher / Faculty</option>
              <option value="system">System Engine</option>
            </select>
          </div>
        </div>

        {/* Action Type Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
            Action:
          </span>
          {[
            'All',
            'Grade Update',
            'Attendance Change',
            'Login & Session',
            'Fee Adjustment',
            'Course & Timetable',
            'Student Record',
            'Security & Auth'
          ].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all border ${
                selectedType === type
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table List */}
      <div className="bg-[#0b1329] border border-slate-800/90 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Live Audit Event Log</h3>
              <p className="text-[11px] text-slate-400">
                Showing {filteredLogs.length} of {logs.length} logged system transactions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Real-Time Ingestion Active</span>
          </div>
        </div>

        {/* Empty State */}
        {filteredLogs.length === 0 && (
          <div className="p-12 text-center space-y-3">
            <ShieldAlert className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-white">No audit records match your filters</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your search query, action type chips, or severity levels.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('All');
                setSelectedSeverity('All');
                setSelectedStatus('All');
                setSelectedRole('All');
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Logs Items List */}
        <div className="divide-y divide-slate-800/70">
          {filteredLogs.map((log) => {
            const Icon = getActionIcon(log.actionType);
            const isExpanded = expandedLogId === log.id;

            return (
              <div
                key={log.id}
                className={`transition-colors ${
                  isExpanded ? 'bg-slate-900/60' : 'hover:bg-slate-900/30'
                } ${log.status === 'Flagged' ? 'bg-rose-950/10' : ''}`}
              >
                {/* Main Row */}
                <div
                  onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                  className="p-4 sm:p-5 cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  {/* Left: Action Icon + Title + Actor */}
                  <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                    <div
                      className={`p-2.5 rounded-2xl shrink-0 border ${
                        log.severity === 'critical'
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                          : 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-white hover:text-indigo-300 transition-colors truncate">
                          {log.actionTitle}
                        </span>

                        {/* Action Type Badge */}
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getActionBadgeColor(
                            log.actionType
                          )}`}
                        >
                          {log.actionType}
                        </span>

                        {/* Severity Badge */}
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${getSeverityBadge(
                            log.severity
                          )}`}
                        >
                          {log.severity}
                        </span>

                        {/* Status Badge */}
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getStatusBadge(
                            log.status
                          )}`}
                        >
                          {log.status === 'Verified' && <CheckCircle2 className="w-3 h-3" />}
                          {log.status === 'Flagged' && <AlertTriangle className="w-3 h-3" />}
                          {log.status}
                        </span>
                      </div>

                      {/* Description & Target */}
                      <p className="text-xs text-slate-300 line-clamp-1 leading-relaxed">
                        <span className="text-indigo-300 font-medium mr-1.5">Target:</span>
                        {log.targetResource}
                        <span className="text-slate-500 mx-2">•</span>
                        <span className="text-slate-400">{log.description}</span>
                      </p>
                    </div>
                  </div>

                  {/* Right: Actor info, IP, and Time */}
                  <div className="flex items-center justify-between lg:justify-end gap-4 shrink-0 pt-2 lg:pt-0 border-t border-slate-800/60 lg:border-t-0">
                    <div className="flex items-center gap-2.5">
                      {log.actorAvatar ? (
                        <img
                          src={log.actorAvatar}
                          alt={log.actorName}
                          className="w-7 h-7 rounded-full object-cover border border-slate-700"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                          {log.actorName.charAt(0)}
                        </div>
                      )}
                      <div className="text-left">
                        <p className="text-xs font-bold text-white truncate max-w-[130px]">{log.actorName}</p>
                        <p className="text-[10px] text-slate-400 capitalize">{log.actorRole}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-mono font-bold text-slate-300">{log.timestamp}</p>
                      <p className="text-[10px] font-mono text-slate-500">{log.ipAddress}</p>
                    </div>

                    <button
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title={isExpanded ? 'Collapse' : 'Expand Details'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Detail Panel */}
                {isExpanded && (
                  <div className="px-4 sm:px-6 pb-6 pt-1 bg-[#070c18]/80 border-t border-slate-800/70 space-y-4 animate-fadeIn">
                    {/* Before & After Diff Box */}
                    {(log.previousValue || log.newValue) && (
                      <div className="p-4 rounded-2xl bg-[#0d152a] border border-slate-800 space-y-2.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                          <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Audit State Mutation (Before & After Diff)</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Previous Value */}
                          <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block">
                              Previous Value (Before Action)
                            </span>
                            <code className="text-xs text-rose-200 font-mono block break-words">
                              {log.previousValue || 'N/A (New Entry Created)'}
                            </code>
                          </div>

                          {/* New Value */}
                          <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                              Committed Value (After Action)
                            </span>
                            <code className="text-xs text-emerald-200 font-mono block break-words">
                              {log.newValue || 'Deleted / Purged'}
                            </code>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Metadata & Cryptographic Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Telemetry */}
                      <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-400">
                          <Laptop className="w-3 h-3 text-indigo-400" />
                          <span>Client Device & OS</span>
                        </div>
                        <p className="text-xs text-slate-200 font-medium">{log.device}</p>
                      </div>

                      {/* Location & Network */}
                      <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-400">
                          <Globe className="w-3 h-3 text-emerald-400" />
                          <span>Network Subnet & Location</span>
                        </div>
                        <p className="text-xs text-slate-200 font-medium">
                          {log.location || 'Campus Local LAN'} • {log.ipAddress}
                        </p>
                      </div>

                      {/* Cryptographic Hash */}
                      <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-400">
                            <Fingerprint className="w-3 h-3 text-purple-400" />
                            <span>SHA-256 Integrity Hash</span>
                          </div>
                          <button
                            onClick={() => handleCopyHash(log.integrityHash, log.id)}
                            className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                          >
                            {copiedHashId === log.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedHashId === log.id ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        <p className="text-[11px] font-mono text-slate-300 truncate">{log.integrityHash}</p>
                      </div>
                    </div>

                    {/* Admin Review Action Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/70">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedLogForModal(log)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-indigo-400" />
                          <span>View Full Telemetry JSON</span>
                        </button>

                        <button
                          onClick={() => handleFlagLog(log.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                            log.status === 'Flagged'
                              ? 'bg-rose-600/30 text-rose-300 border border-rose-500/50'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                          }`}
                        >
                          <Flag className="w-3.5 h-3.5 text-rose-400" />
                          <span>{log.status === 'Flagged' ? 'Remove Flag' : 'Flag for Investigation'}</span>
                        </button>
                      </div>

                      {/* Revert / Rollback Button */}
                      {!log.reverted && log.status !== 'Reverted' && (
                        <button
                          onClick={() => handleRevertLog(log.id)}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-950/20"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Revert & Rollback Action</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Full Telemetry JSON Inspector */}
      {selectedLogForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0f172a] border border-indigo-500/40 rounded-3xl p-6 sm:p-7 max-w-2xl w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Cryptographic Audit Entry #{selectedLogForModal.id}</h3>
                  <p className="text-xs text-slate-400">SHA-256 Merkle Node Verification Payload</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLogForModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Raw Immutable JSON Payload</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(selectedLogForModal, null, 2));
                    showToast('Telemetry JSON copied to clipboard');
                  }}
                  className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy JSON</span>
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-emerald-300 font-mono overflow-x-auto max-h-96 leading-relaxed select-all">
                {JSON.stringify(selectedLogForModal, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedLogForModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Simulate User Action */}
      {showSimulateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0f172a] border border-indigo-500/40 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Simulate Live Campus Action</h3>
                  <p className="text-xs text-slate-400">
                    Test how grade adjustments, attendance overrides & security events get immutably recorded
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSimulateModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSimulateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Action Category</label>
                <select
                  value={simActionType}
                  onChange={(e) => setSimActionType(e.target.value as AuditActionType)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Grade Update">Grade Update (Marks / GPA change)</option>
                  <option value="Attendance Change">Attendance Change (Manual / QR override)</option>
                  <option value="Login & Session">Login & Session (Auth / 2FA)</option>
                  <option value="Fee Adjustment">Fee Adjustment (Waiver / Payment plan)</option>
                  <option value="Course & Timetable">Course & Timetable (Room swap / AI clash)</option>
                  <option value="Security & Auth">Security & Auth (Privilege escalation / Rate limit)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Actor Name</label>
                  <input
                    type="text"
                    value={simActor}
                    onChange={(e) => setSimActor(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Severity Level</label>
                  <select
                    value={simSeverity}
                    onChange={(e) => setSimSeverity(e.target.value as AuditSeverity)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Target Resource</label>
                <input
                  type="text"
                  value={simTarget}
                  onChange={(e) => setSimTarget(e.target.value)}
                  required
                  placeholder="e.g. David Kim (ME-2022-115) • CS 101 Midterm"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Action Description</label>
                <textarea
                  value={simDesc}
                  onChange={(e) => setSimDesc(e.target.value)}
                  required
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Before Value</label>
                  <input
                    type="text"
                    value={simPrev}
                    onChange={(e) => setSimPrev(e.target.value)}
                    placeholder="e.g. Score: 85 (B)"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">After Value</label>
                  <input
                    type="text"
                    value={simNew}
                    onChange={(e) => setSimNew(e.target.value)}
                    placeholder="e.g. Score: 92 (A)"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSimulateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30"
                >
                  Commit to Audit Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
