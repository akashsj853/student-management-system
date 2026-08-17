import React, { useState } from 'react';
import {
  KeyRound,
  FileCheck,
  ShieldCheck,
  AlertTriangle,
  Clock,
  DollarSign,
  Users,
  Search,
  Filter,
  Plus,
  Copy,
  Check,
  Eye,
  EyeOff,
  ExternalLink,
  Download,
  Building2,
  RefreshCw,
  Sparkles,
  Trash2,
  UserPlus,
  UserCheck,
  X,
  FileText,
  HelpCircle,
  Laptop
} from 'lucide-react';
import { CampusLicense, UserRole } from '../../types';

interface LicenseManagementProps {
  licenses: CampusLicense[];
  setLicenses: React.Dispatch<React.SetStateAction<CampusLicense[]>>;
  currentRole: UserRole;
  onOpenAIChat?: () => void;
}

export const LicenseManagement: React.FC<LicenseManagementProps> = ({
  licenses,
  setLicenses,
  currentRole,
  onOpenAIChat
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // Keys visibility state: map of license.id -> boolean
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLicenseForRoster, setSelectedLicenseForRoster] = useState<CampusLicense | null>(null);
  const [selectedLicenseForAssign, setSelectedLicenseForAssign] = useState<CampusLicense | null>(null);
  const [selectedLicenseForRenewal, setSelectedLicenseForRenewal] = useState<CampusLicense | null>(null);

  // Add License Form State
  const [newSoftwareName, setNewSoftwareName] = useState('');
  const [newVendor, setNewVendor] = useState('');
  const [newCategory, setNewCategory] = useState<CampusLicense['category']>('Engineering & Math');
  const [newLicenseType, setNewLicenseType] = useState<CampusLicense['licenseType']>('Campus-wide Unlimited');
  const [newTotalSeats, setNewTotalSeats] = useState(500);
  const [newLicenseKey, setNewLicenseKey] = useState('');
  const [newCost, setNewCost] = useState(15000);
  const [newExpiryDate, setNewExpiryDate] = useState('2027-06-30');
  const [newDepartment, setNewDepartment] = useState('Computer Science & Engineering');
  const [newAdminContact, setNewAdminContact] = useState('IT Admin (admin@eduai.edu)');
  const [newPO, setNewPO] = useState('PO-2026-IT-0991');
  const [newComplianceNotes, setNewComplianceNotes] = useState('Authorized for faculty and enrolled student educational use only.');

  // Assign User Form State
  const [assigneeName, setAssigneeName] = useState('');
  const [assigneeEmail, setAssigneeEmail] = useState('');
  const [assigneeRole, setAssigneeRole] = useState<'student' | 'faculty' | 'staff'>('student');

  // Renewal Form State
  const [renewalYears, setRenewalYears] = useState(1);
  const [renewalNotes, setRenewalNotes] = useState('');
  const [renewalSuccessMsg, setRenewalSuccessMsg] = useState('');

  // Toggle key masking
  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Copy key to clipboard
  const handleCopyKey = (id: string, key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  // Filter licenses
  const filteredLicenses = licenses.filter(lic => {
    const matchesSearch =
      lic.softwareName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lic.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lic.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lic.purchaseOrderNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lic.licenseKey.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || lic.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || lic.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // KPI Calculations
  const totalCost = licenses.reduce((sum, lic) => sum + lic.costPerYear, 0);
  const totalSeats = licenses.reduce((sum, lic) => sum + lic.totalSeats, 0);
  const totalAssignedSeats = licenses.reduce((sum, lic) => sum + lic.assignedSeats, 0);
  const expiringSoonCount = licenses.filter(lic => lic.status === 'Expiring Soon').length;
  const activeCount = licenses.filter(lic => lic.status === 'Active').length;

  // Handle Add License Submit
  const handleAddLicense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSoftwareName || !newVendor || !newLicenseKey) return;

    const newLic: CampusLicense = {
      id: `lic-${Date.now()}`,
      softwareName: newSoftwareName,
      vendor: newVendor,
      category: newCategory,
      licenseType: newLicenseType,
      totalSeats: Number(newTotalSeats),
      assignedSeats: 0,
      licenseKey: newLicenseKey,
      costPerYear: Number(newCost),
      expiryDate: newExpiryDate,
      status: 'Active',
      department: newDepartment,
      adminContact: newAdminContact,
      purchaseOrderNo: newPO,
      assignedUsers: [],
      complianceNotes: newComplianceNotes,
      downloadUrl: 'https://campus-software.eduai.edu'
    };

    setLicenses(prev => [newLic, ...prev]);
    setShowAddModal(false);
    // Reset fields
    setNewSoftwareName('');
    setNewVendor('');
    setNewLicenseKey('');
  };

  // Handle Assign Seat
  const handleAssignSeat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLicenseForAssign || !assigneeName || !assigneeEmail) return;

    const targetLicenseId = selectedLicenseForAssign.id;
    const newUser = {
      id: `u-${Date.now()}`,
      name: assigneeName,
      email: assigneeEmail,
      role: assigneeRole,
      assignedDate: new Date().toISOString().split('T')[0],
      seatStatus: 'Active' as const
    };

    setLicenses(prev =>
      prev.map(lic => {
        if (lic.id === targetLicenseId) {
          const updatedUsers = [newUser, ...(lic.assignedUsers || [])];
          return {
            ...lic,
            assignedSeats: Math.min(lic.totalSeats, lic.assignedSeats + 1),
            assignedUsers: updatedUsers
          };
        }
        return lic;
      })
    );

    setSelectedLicenseForAssign(null);
    setAssigneeName('');
    setAssigneeEmail('');
  };

  // Handle Revoke Seat
  const handleRevokeSeat = (licenseId: string, userId: string) => {
    setLicenses(prev =>
      prev.map(lic => {
        if (lic.id === licenseId) {
          const updatedUsers = (lic.assignedUsers || []).filter(u => u.id !== userId);
          return {
            ...lic,
            assignedSeats: Math.max(0, lic.assignedSeats - 1),
            assignedUsers: updatedUsers
          };
        }
        return lic;
      })
    );

    if (selectedLicenseForRoster && selectedLicenseForRoster.id === licenseId) {
      setSelectedLicenseForRoster(prev => {
        if (!prev) return null;
        return {
          ...prev,
          assignedSeats: Math.max(0, prev.assignedSeats - 1),
          assignedUsers: (prev.assignedUsers || []).filter(u => u.id !== userId)
        };
      });
    }
  };

  // Handle Renewal Submission
  const handleRenewalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLicenseForRenewal) return;

    const currentYear = new Date(selectedLicenseForRenewal.expiryDate).getFullYear();
    const newYear = currentYear + renewalYears;
    const newExpiry = selectedLicenseForRenewal.expiryDate.replace(String(currentYear), String(newYear));

    setLicenses(prev =>
      prev.map(lic => {
        if (lic.id === selectedLicenseForRenewal.id) {
          return {
            ...lic,
            expiryDate: newExpiry,
            status: 'Active',
            purchaseOrderNo: `PO-${new Date().getFullYear()}-RNW-${Math.floor(1000 + Math.random() * 9000)}`
          };
        }
        return lic;
      })
    );

    setRenewalSuccessMsg(`License renewed until ${newExpiry}! Generated Purchase Order.`);
    setTimeout(() => {
      setRenewalSuccessMsg('');
      setSelectedLicenseForRenewal(null);
    }, 1800);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Software Name', 'Vendor', 'Category', 'License Type', 'Total Seats', 'Assigned Seats', 'License Key', 'Annual Cost (USD)', 'Expiry Date', 'Status', 'Department', 'PO Number'];
    const rows = licenses.map(l => [
      `"${l.softwareName}"`,
      `"${l.vendor}"`,
      `"${l.category}"`,
      `"${l.licenseType}"`,
      l.totalSeats,
      l.assignedSeats,
      `"${l.licenseKey}"`,
      l.costPerYear,
      l.expiryDate,
      l.status,
      `"${l.department}"`,
      `"${l.purchaseOrderNo}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Campus_Software_Licenses_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const categories = [
    'All',
    'Engineering & Math',
    'Productivity & Office',
    'Design & Media',
    'Development & Cloud',
    'Research & Analytics',
    'Security & LMS'
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Overview Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0f172a] to-[#0b1120] border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
                Institutional Software & Licenses Hub
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Enterprise campus agreements, seat allocation rosters, license key security, and renewal governance
              </p>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Export Audit (CSV)</span>
          </button>

          {currentRole !== 'student' && currentRole !== 'parent' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Software License</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Campus Licenses</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Laptop className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">{licenses.length}</span>
            <span className="text-xs font-bold text-emerald-400">{activeCount} Verified Active</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across 6 academic faculties</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Annual Software Budget</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">${(totalCost / 1000).toFixed(0)}k</span>
            <span className="text-xs text-slate-400">/ academic year</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">100% Institutional purchase orders</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500" />
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Deployed Seat Capacity</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">{totalAssignedSeats.toLocaleString()}</span>
            <span className="text-xs font-bold text-blue-400">/ {totalSeats.toLocaleString()}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full"
              style={{ width: `${Math.round((totalAssignedSeats / totalSeats) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {Math.round((totalAssignedSeats / totalSeats) * 100)}% campus seat utilization
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500" />
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Compliance & Expiry</span>
            <div className={`p-2 rounded-xl ${expiringSoonCount > 0 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
              {expiringSoonCount > 0 ? <AlertTriangle className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-black ${expiringSoonCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {expiringSoonCount}
            </span>
            <span className="text-xs font-bold text-slate-300">Renewals Due &lt;30d</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            ISO/IEC 19770 SAM Standard Compliant
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by software name, vendor, PO number, department, or license key..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Status and View Mode Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Expiring Soon">Expiring Soon</option>
              <option value="Expired">Expired</option>
              <option value="Pending Renewal">Pending Renewal</option>
            </select>

            <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'table'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Table
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mr-1 shrink-0">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all text-xs ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main License Items View */}
      {filteredLicenses.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
          <KeyRound className="w-12 h-12 text-slate-400 mx-auto" />
          <h4 className="text-base font-bold text-white">No software licenses found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search keywords or switching category filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedStatus('All');
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all inline-block mt-2"
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredLicenses.map((lic) => {
            const isKeyVisible = !!visibleKeys[lic.id];
            const isCopied = copiedKeyId === lic.id;
            const utilizationPct = Math.round((lic.assignedSeats / lic.totalSeats) * 100);
            const isExpiring = lic.status === 'Expiring Soon';

            return (
              <div
                key={lic.id}
                className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl hover:border-purple-500/40 transition-all flex flex-col justify-between gap-5 relative group"
              >
                {/* Header */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                          {lic.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono text-slate-400 bg-slate-950 border border-slate-800">
                          {lic.licenseType}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-white group-hover:text-purple-300 transition-colors">
                        {lic.softwareName}
                      </h3>
                      <p className="text-xs font-semibold text-slate-400 mt-0.5">
                        Vendor: <span className="text-slate-200">{lic.vendor}</span> • Dept: <span className="text-slate-200">{lic.department}</span>
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border ${
                          lic.status === 'Active'
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : lic.status === 'Expiring Soon'
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 animate-pulse'
                            : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        {lic.status === 'Active' && <Check className="w-3.5 h-3.5" />}
                        {lic.status === 'Expiring Soon' && <Clock className="w-3.5 h-3.5" />}
                        {lic.status}
                      </span>
                    </div>
                  </div>

                  {/* Seat Utilization Bar */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-indigo-400" />
                        Seat Utilization:
                      </span>
                      <span className="font-mono text-white">
                        <strong>{lic.assignedSeats.toLocaleString()}</strong> / {lic.totalSeats.toLocaleString()} Seats ({utilizationPct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          utilizationPct > 90
                            ? 'bg-rose-500'
                            : utilizationPct > 70
                            ? 'bg-purple-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, utilizationPct)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{lic.totalSeats - lic.assignedSeats} Available Seats</span>
                      <span>Annual Cost: <strong className="text-emerald-400 font-mono">${lic.costPerYear.toLocaleString()}</strong></span>
                    </div>
                  </div>

                  {/* License Key Box */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                      <span>Enterprise License Key / Serial</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleKeyVisibility(lic.id)}
                          className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                          title={isKeyVisible ? 'Mask Key' : 'Reveal Key'}
                        >
                          {isKeyVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleCopyKey(lic.id, lic.licenseKey)}
                          className="text-purple-400 hover:text-purple-300 p-1 rounded transition-colors flex items-center gap-1 text-[11px]"
                          title="Copy Key"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div className="font-mono text-xs text-indigo-300 truncate bg-slate-900/90 px-2.5 py-1.5 rounded border border-slate-800 select-all">
                      {isKeyVisible ? lic.licenseKey : '••••-••••-••••-' + lic.licenseKey.slice(-6)}
                    </div>
                  </div>

                  {/* PO, Expiry, and Notes */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 pt-1">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Purchase Order:</span>
                      <span className="font-mono text-slate-300 font-semibold">{lic.purchaseOrderNo}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Valid Until:</span>
                      <span className={`font-semibold font-mono ${isExpiring ? 'text-amber-400' : 'text-slate-300'}`}>
                        {lic.expiryDate}
                      </span>
                    </div>
                  </div>

                  {lic.complianceNotes && (
                    <p className="text-[11px] text-slate-400 italic bg-slate-950/40 p-2 rounded-lg border border-slate-800/40">
                      💡 {lic.complianceNotes}
                    </p>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedLicenseForRoster(lic)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <Users className="w-3.5 h-3.5 text-purple-400" />
                      <span>Roster ({lic.assignedUsers?.length || 0})</span>
                    </button>

                    {currentRole !== 'student' && currentRole !== 'parent' && (
                      <button
                        onClick={() => setSelectedLicenseForAssign(lic)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Assign Seat</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {lic.downloadUrl && (
                      <a
                        href={lic.downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs"
                        title="Open Portal / Download Installer"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}

                    {currentRole !== 'student' && currentRole !== 'parent' && (
                      <button
                        onClick={() => setSelectedLicenseForRenewal(lic)}
                        className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/20 flex items-center gap-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Renew</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950/60">
              <tr>
                <th className="p-3">Software & Vendor</th>
                <th className="p-3">Category</th>
                <th className="p-3">Seats (Assigned/Total)</th>
                <th className="p-3">Annual Cost</th>
                <th className="p-3">PO Number</th>
                <th className="p-3">Expiry Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLicenses.map((lic) => (
                <tr key={lic.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-white text-sm">{lic.softwareName}</div>
                    <div className="text-slate-400 text-[11px]">{lic.vendor} • {lic.department}</div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                      {lic.category}
                    </span>
                  </td>
                  <td className="p-3 font-mono">
                    <span className="text-white font-bold">{lic.assignedSeats}</span> / {lic.totalSeats} ({Math.round((lic.assignedSeats / lic.totalSeats) * 100)}%)
                  </td>
                  <td className="p-3 font-mono text-emerald-400 font-bold">
                    ${lic.costPerYear.toLocaleString()}
                  </td>
                  <td className="p-3 font-mono text-slate-400">
                    {lic.purchaseOrderNo}
                  </td>
                  <td className="p-3 font-mono font-semibold">
                    {lic.expiryDate}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        lic.status === 'Active'
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : lic.status === 'Expiring Soon'
                          ? 'bg-amber-500/15 text-amber-300'
                          : 'bg-rose-500/15 text-rose-300'
                      }`}
                    >
                      {lic.status}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => setSelectedLicenseForRoster(lic)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
                    >
                      Roster
                    </button>
                    {currentRole !== 'student' && currentRole !== 'parent' && (
                      <button
                        onClick={() => setSelectedLicenseForAssign(lic)}
                        className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                      >
                        Assign
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL 1: ADD SOFTWARE LICENSE */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Register Campus Software License</h3>
                  <p className="text-xs text-slate-400">Add institutional software subscription or site license</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLicense} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Software Title *</label>
                  <input
                    type="text"
                    required
                    value={newSoftwareName}
                    onChange={(e) => setNewSoftwareName(e.target.value)}
                    placeholder="e.g. MATLAB R2026b"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Vendor / Developer *</label>
                  <input
                    type="text"
                    required
                    value={newVendor}
                    onChange={(e) => setNewVendor(e.target.value)}
                    placeholder="e.g. MathWorks Inc."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as CampusLicense['category'])}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Engineering & Math">Engineering & Math</option>
                    <option value="Productivity & Office">Productivity & Office</option>
                    <option value="Design & Media">Design & Media</option>
                    <option value="Development & Cloud">Development & Cloud</option>
                    <option value="Research & Analytics">Research & Analytics</option>
                    <option value="Security & LMS">Security & LMS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">License Tier</label>
                  <select
                    value={newLicenseType}
                    onChange={(e) => setNewLicenseType(e.target.value as CampusLicense['licenseType'])}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Campus-wide Unlimited">Campus-wide Unlimited</option>
                    <option value="Per-Seat Volume">Per-Seat Volume</option>
                    <option value="Named User">Named User</option>
                    <option value="Site Enterprise">Site Enterprise</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Total Seat Count</label>
                  <input
                    type="number"
                    min="1"
                    value={newTotalSeats}
                    onChange={(e) => setNewTotalSeats(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Annual Cost ($ USD)</label>
                  <input
                    type="number"
                    min="0"
                    value={newCost}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={newExpiryDate}
                    onChange={(e) => setNewExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Enterprise Master License Key *</label>
                <input
                  type="text"
                  required
                  value={newLicenseKey}
                  onChange={(e) => setNewLicenseKey(e.target.value)}
                  placeholder="e.g. MTLB-2026-UNL-EDUAI-XXXX-XXXX"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Managing Department</label>
                  <input
                    type="text"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    placeholder="e.g. Computer Science & AI"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Purchase Order (PO #)</label>
                  <input
                    type="text"
                    value={newPO}
                    onChange={(e) => setNewPO(e.target.value)}
                    placeholder="PO-2026-IT-XXXX"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Compliance & Authorization Notes</label>
                <textarea
                  rows={2}
                  value={newComplianceNotes}
                  onChange={(e) => setNewComplianceNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-600/30"
                >
                  Register License
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ASSIGN SEAT TO STUDENT/FACULTY */}
      {selectedLicenseForAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">Assign Software License Seat</h3>
                <p className="text-xs text-purple-300 mt-0.5">{selectedLicenseForAssign.softwareName}</p>
              </div>
              <button
                onClick={() => setSelectedLicenseForAssign(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignSeat} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300 font-medium">Available Seats:</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {selectedLicenseForAssign.totalSeats - selectedLicenseForAssign.assignedSeats} Remaining
                </span>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">User Full Name *</label>
                <input
                  type="text"
                  required
                  value={assigneeName}
                  onChange={(e) => setAssigneeName(e.target.value)}
                  placeholder="e.g. Elena Rodriguez or Dr. Jenkins"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Institutional Email *</label>
                <input
                  type="email"
                  required
                  value={assigneeEmail}
                  onChange={(e) => setAssigneeEmail(e.target.value)}
                  placeholder="user@eduai.edu"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Role Type</label>
                <select
                  value={assigneeRole}
                  onChange={(e) => setAssigneeRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty Member</option>
                  <option value="staff">Staff / Researcher</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedLicenseForAssign(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-600/30"
                >
                  Grant License Seat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ASSIGNED USERS ROSTER */}
      {selectedLicenseForRoster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 space-y-5 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">License Seat Allocation Roster</h3>
                <p className="text-xs text-purple-300 mt-0.5">{selectedLicenseForRoster.softwareName}</p>
              </div>
              <button
                onClick={() => setSelectedLicenseForRoster(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              {(!selectedLicenseForRoster.assignedUsers || selectedLicenseForRoster.assignedUsers.length === 0) ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No individual users assigned yet. All institutional accounts may access via SSO or campus portal.
                </div>
              ) : (
                <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                  {selectedLicenseForRoster.assignedUsers.map((user) => (
                    <div key={user.id} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{user.name}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                            {user.role}
                          </span>
                        </div>
                        <div className="text-slate-400 text-[11px] font-mono mt-0.5">
                          {user.email} • Assigned: {user.assignedDate}
                        </div>
                      </div>

                      {currentRole !== 'student' && currentRole !== 'parent' && (
                        <button
                          onClick={() => handleRevokeSeat(selectedLicenseForRoster.id, user.id)}
                          className="px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-1"
                          title="Revoke Seat"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Revoke</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">
                Total Deployed: <strong className="text-white">{selectedLicenseForRoster.assignedSeats}</strong> / {selectedLicenseForRoster.totalSeats} seats
              </span>
              <button
                onClick={() => setSelectedLicenseForRoster(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: RENEW LICENSE & GENERATE PO */}
      {selectedLicenseForRenewal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">Renew Campus Agreement</h3>
                <p className="text-xs text-purple-300 mt-0.5">{selectedLicenseForRenewal.softwareName}</p>
              </div>
              <button
                onClick={() => setSelectedLicenseForRenewal(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {renewalSuccessMsg ? (
              <div className="p-5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-center space-y-2">
                <Check className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Renewal Authorized!</h4>
                <p className="text-xs text-emerald-300">{renewalSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleRenewalSubmit} className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Current Expiration:</span>
                    <span className="font-mono text-white font-bold">{selectedLicenseForRenewal.expiryDate}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Vendor:</span>
                    <span className="text-slate-200">{selectedLicenseForRenewal.vendor}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Annual Rate:</span>
                    <span className="font-mono text-emerald-400 font-bold">${selectedLicenseForRenewal.costPerYear.toLocaleString()} / yr</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Renewal Extension Duration</label>
                  <select
                    value={renewalYears}
                    onChange={(e) => setRenewalYears(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value={1}>+1 Academic Year (${(selectedLicenseForRenewal.costPerYear * 1).toLocaleString()})</option>
                    <option value={2}>+2 Academic Years (${(selectedLicenseForRenewal.costPerYear * 2).toLocaleString()})</option>
                    <option value={3}>+3 Academic Years Multi-year Agreement (${(selectedLicenseForRenewal.costPerYear * 3).toLocaleString()})</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Dean / Procurement Authorization Memo</label>
                  <textarea
                    rows={2}
                    value={renewalNotes}
                    onChange={(e) => setRenewalNotes(e.target.value)}
                    placeholder="e.g. Approved under FY26 IT Academic Infrastructure budget line item #891."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedLicenseForRenewal(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-600/30 flex items-center gap-1.5"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Authorize PO & Renew</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
