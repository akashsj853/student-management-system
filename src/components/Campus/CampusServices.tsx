import React, { useState } from 'react';
import {
  Building2,
  Bus,
  BookOpen,
  Users,
  MapPin,
  CheckCircle2,
  Clock,
  Search,
  Phone,
  Compass,
  AlertCircle,
  Plus,
  QrCode,
  Shield,
  Wrench,
  ChevronRight,
  Filter,
  Check,
  AlertTriangle,
  X,
  Radio,
  Navigation,
  KeyRound,
  DollarSign,
  Ticket,
  UserCheck,
  ArrowRight
} from 'lucide-react';
import { HostelRoom, BusRoute, LibraryBook, HostelComplaint, TransitPass, UserRole } from '../../types';
import { INITIAL_HOSTEL_COMPLAINTS, INITIAL_TRANSIT_PASSES, INITIAL_STUDENTS } from '../../data/mockData';

interface CampusServicesProps {
  hostelRooms: HostelRoom[];
  setHostelRooms?: React.Dispatch<React.SetStateAction<HostelRoom[]>>;
  busRoutes: BusRoute[];
  setBusRoutes?: React.Dispatch<React.SetStateAction<BusRoute[]>>;
  libraryBooks: LibraryBook[];
  setLibraryBooks: React.Dispatch<React.SetStateAction<LibraryBook[]>>;
  currentRole?: UserRole;
  onNavigate?: (tab: string) => void;
}

export const CampusServices: React.FC<CampusServicesProps> = ({
  hostelRooms,
  setHostelRooms,
  busRoutes,
  setBusRoutes,
  libraryBooks,
  setLibraryBooks,
  currentRole = 'admin',
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'hostel' | 'transport' | 'library'>('hostel');

  // Local state for complaints and transit passes
  const [complaints, setComplaints] = useState<HostelComplaint[]>(INITIAL_HOSTEL_COMPLAINTS);
  const [transitPasses, setTransitPasses] = useState<TransitPass[]>(INITIAL_TRANSIT_PASSES);

  // Filters
  const [hostelBlockFilter, setHostelBlockFilter] = useState<string>('All');
  const [hostelTypeFilter, setHostelTypeFilter] = useState<string>('All');
  const [selectedRouteId, setSelectedRouteId] = useState<string>(busRoutes[0]?.routeNo || 'R-01');
  const [librarySearch, setLibrarySearch] = useState('');
  const [libraryCategory, setLibraryCategory] = useState('All');

  // Modals
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [showTransitPassModal, setShowTransitPassModal] = useState(false);
  const [selectedPassForQR, setSelectedPassForQR] = useState<TransitPass | null>(null);
  const [selectedRoomDetails, setSelectedRoomDetails] = useState<HostelRoom | null>(null);
  const [dispatchAlertMsg, setDispatchAlertMsg] = useState('');

  // Allocation Form State
  const [allocateStudentName, setAllocateStudentName] = useState('Elena Rodriguez');
  const [allocateBlock, setAllocateBlock] = useState('Block B (Girls)');
  const [allocateRoomNo, setAllocateRoomNo] = useState('B-105');

  // Complaint Form State
  const [complaintStudentName, setComplaintStudentName] = useState('Marcus Chen');
  const [complaintRoomNo, setComplaintRoomNo] = useState('A-201');
  const [complaintBlock, setComplaintBlock] = useState('Block A (Boys)');
  const [complaintCategory, setComplaintCategory] = useState<HostelComplaint['category']>('Plumbing');
  const [complaintPriority, setComplaintPriority] = useState<HostelComplaint['priority']>('Medium');
  const [complaintDescription, setComplaintDescription] = useState('');

  // Transit Pass Form State
  const [passStudentName, setPassStudentName] = useState('Elena Rodriguez');
  const [passRouteNo, setPassRouteNo] = useState('R-01');
  const [passStopName, setPassStopName] = useState('Highland Square Station');

  // Filtered Hostel Rooms
  const filteredHostelRooms = hostelRooms.filter(room => {
    const matchesBlock = hostelBlockFilter === 'All' || room.block.toLowerCase().includes(hostelBlockFilter.toLowerCase());
    const matchesType = hostelTypeFilter === 'All' || room.type === hostelTypeFilter;
    return matchesBlock && matchesType;
  });

  // Filtered Library Books
  const filteredBooks = libraryBooks.filter(b => {
    const matchesSearch =
      b.title.toLowerCase().includes(librarySearch.toLowerCase()) ||
      b.author.toLowerCase().includes(librarySearch.toLowerCase()) ||
      b.isbn.toLowerCase().includes(librarySearch.toLowerCase());
    const matchesCat = libraryCategory === 'All' || b.category === libraryCategory;
    return matchesSearch && matchesCat;
  });

  // Handle Allocate Student Submit
  const handleAllocateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocateStudentName || !allocateRoomNo) return;

    if (setHostelRooms) {
      setHostelRooms(prev =>
        prev.map(r => {
          const rNum = r.roomNo || r.roomNumber;
          if (rNum === allocateRoomNo && r.occupied < r.capacity) {
            const currentStudents = r.students || r.occupants || [];
            return {
              ...r,
              occupied: r.occupied + 1,
              students: [...currentStudents, allocateStudentName],
              occupants: [...currentStudents, allocateStudentName]
            };
          }
          return r;
        })
      );
    }
    setShowAllocateModal(false);
  };

  // Handle Submit Complaint
  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintDescription) return;

    const newTicket: HostelComplaint = {
      id: `cmp-${Date.now()}`,
      roomNo: complaintRoomNo,
      block: complaintBlock,
      studentName: complaintStudentName,
      category: complaintCategory,
      priority: complaintPriority,
      status: 'Pending',
      description: complaintDescription,
      reportedAt: new Date().toLocaleString()
    };

    setComplaints(prev => [newTicket, ...prev]);
    setShowComplaintModal(false);
    setComplaintDescription('');
  };

  // Handle Update Complaint Status
  const handleUpdateComplaintStatus = (ticketId: string, newStatus: HostelComplaint['status']) => {
    setComplaints(prev =>
      prev.map(c => (c.id === ticketId ? { ...c, status: newStatus, resolvedAt: newStatus === 'Resolved' ? new Date().toLocaleString() : undefined } : c))
    );
  };

  // Handle Issue Transit Pass
  const handleIssueTransitPass = (e: React.FormEvent) => {
    e.preventDefault();
    const routeObj = busRoutes.find(r => (r.routeNo || r.routeNumber) === passRouteNo);
    const newPass: TransitPass = {
      id: `tpass-${Date.now()}`,
      studentId: `STU-${Math.floor(1000 + Math.random() * 9000)}`,
      studentName: passStudentName,
      routeNo: passRouteNo,
      routeName: routeObj?.name || routeObj?.routeName || 'Campus Transit Express',
      stopName: passStopName,
      validUntil: '2026-12-31',
      status: 'Active',
      qrCodeToken: `QR-PASS-${passStudentName.replace(/\s+/g, '-').toUpperCase()}-${passRouteNo}-2026`,
      paidAmount: 350
    };

    setTransitPasses(prev => [newPass, ...prev]);
    setShowTransitPassModal(false);
  };

  // Handle Dispatch Broadcast simulation
  const handleDispatchBroadcast = (busName: string) => {
    setDispatchAlertMsg(`Radio dispatch broadcast sent to driver of ${busName}: "Verify passenger manifest & route schedule".`);
    setTimeout(() => setDispatchAlertMsg(''), 3000);
  };

  // Handle Book Checkout Toggle
  const handleToggleBookCheckout = (bookId: string) => {
    setLibraryBooks(prev =>
      prev.map(book => {
        if (book.id === bookId) {
          const isReturning = book.availableCopies < book.totalCopies;
          return {
            ...book,
            availableCopies: isReturning ? book.availableCopies + 1 : Math.max(0, book.availableCopies - 1)
          };
        }
        return book;
      })
    );
  };

  const selectedRoute = busRoutes.find(r => (r.routeNo || r.routeNumber) === selectedRouteId) || busRoutes[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Navigation Sub-Tabs */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0f172a] to-[#0b1120] border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                Hostel, Transit & Campus Facilities
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Residential accommodations, live GPS fleet dispatch, transit passes, and catalog circulation
              </p>
            </div>
          </div>
        </div>

        {/* 3 Nav Sub-Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('hostel')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'hostel'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Hostel & Rooms</span>
          </button>
          <button
            onClick={() => setActiveTab('transport')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'transport'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bus className="w-4 h-4" />
            <span>Transit & Fleet GPS</span>
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'library'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Digital Library</span>
          </button>
        </div>
      </div>

      {/* 1. HOSTEL TAB */}
      {activeTab === 'hostel' && (
        <div className="space-y-6">
          {/* Hostel KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg relative overflow-hidden">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Bed Capacity</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">450</span>
                <span className="text-xs font-bold text-emerald-400">396 Occupied</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '88%' }} />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">88% current campus occupancy</p>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500" />
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg relative overflow-hidden">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Block A (Boys Dorm)</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-amber-400">190</span>
                <span className="text-xs text-slate-400">/ 200 Beds</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">Warden: Dr. Paul Vance • Ext #401</p>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500" />
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg relative overflow-hidden">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Block B (Girls Dorm)</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-indigo-400">206</span>
                <span className="text-xs text-slate-400">/ 250 Beds</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">Warden: Prof. Elena Rostova • Ext #402</p>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500" />
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg relative overflow-hidden">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Curfew & Gate Status</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-400">Open</span>
                <span className="text-xs text-slate-400">Curfew at 22:00 PM</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">Biometric Turnstile Active</p>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500" />
            </div>
          </div>

          {/* Room Allocation Controls & Grid */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  Room Allocation Roster & Capacity Grid
                </h3>
                <p className="text-xs text-slate-400">Manage room configurations, resident assignments, and vacancies</p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Block Filter */}
                <select
                  value={hostelBlockFilter}
                  onChange={(e) => setHostelBlockFilter(e.target.value)}
                  className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
                >
                  <option value="All">All Blocks</option>
                  <option value="Block A">Block A (Boys)</option>
                  <option value="Block B">Block B (Girls)</option>
                </select>

                {/* Type Filter */}
                <select
                  value={hostelTypeFilter}
                  onChange={(e) => setHostelTypeFilter(e.target.value)}
                  className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
                >
                  <option value="All">All Room Types</option>
                  <option value="Single">Single Room</option>
                  <option value="Double">Double Shared</option>
                  <option value="Triple">Triple Shared</option>
                </select>

                {currentRole !== 'student' && currentRole !== 'parent' && (
                  <button
                    onClick={() => setShowAllocateModal(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-600/30 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Allocate Student</span>
                  </button>
                )}
              </div>
            </div>

            {/* Rooms Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredHostelRooms.map((room, idx) => {
                const roomNumber = room.roomNo || room.roomNumber || `Room-${idx + 1}`;
                const occupantsList = room.students || room.occupants || [];
                const isFull = room.occupied >= room.capacity || room.status === 'Full';
                const hasVacancies = room.occupied < room.capacity;

                return (
                  <div
                    key={room.id || room.roomNo || idx}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/30 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white text-sm">{room.block} - Room {roomNumber}</span>
                        <span className="block text-[10px] text-slate-400">{room.type || 'Standard'} Suite</span>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isFull
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {room.occupied}/{room.capacity} Beds ({isFull ? 'Full' : `${room.capacity - room.occupied} Free`})
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 space-y-1 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                      <p className="text-slate-300 font-semibold text-[11px] uppercase tracking-wider">Residents:</p>
                      {occupantsList.length > 0 ? (
                        <div className="space-y-0.5">
                          {occupantsList.map((stu, sIdx) => (
                            <div key={sIdx} className="flex items-center gap-1.5 text-slate-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                              <span className="truncate">{stu}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-400 italic">No assigned occupants (Vacant)</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-slate-400 font-mono">AC • Wi-Fi • Study Desk</span>
                      {hasVacancies && currentRole !== 'student' && currentRole !== 'parent' && (
                        <button
                          onClick={() => {
                            setAllocateRoomNo(roomNumber);
                            setAllocateBlock(room.block);
                            setShowAllocateModal(true);
                          }}
                          className="text-amber-400 hover:text-amber-300 font-bold"
                        >
                          + Assign Bed
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Maintenance & Complaints Helpdesk Section */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Hostel Maintenance & Helpdesk Tickets</h3>
                  <p className="text-xs text-slate-400">Track plumbing, electrical, WiFi, and furniture service requests</p>
                </div>
              </div>

              <button
                onClick={() => setShowComplaintModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all self-start sm:self-auto"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Submit Service Request</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {complaints.map((c) => (
                <div key={c.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{c.category} Issue</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.priority === 'Urgent' || c.priority === 'High'
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {c.priority} Priority
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Room: <strong className="text-slate-200">{c.roomNo} ({c.block})</strong> • Reported by: <span className="text-slate-300">{c.studentName}</span>
                      </p>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        c.status === 'Resolved'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : c.status === 'In Progress'
                          ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                    "{c.description}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Reported: {c.reportedAt}</span>
                    {currentRole !== 'student' && currentRole !== 'parent' && c.status !== 'Resolved' && (
                      <div className="flex items-center gap-1.5">
                        {c.status === 'Pending' && (
                          <button
                            onClick={() => handleUpdateComplaintStatus(c.id, 'In Progress')}
                            className="text-indigo-400 hover:text-indigo-300 font-bold"
                          >
                            Mark In Progress →
                          </button>
                        )}
                        <button
                          onClick={() => handleUpdateComplaintStatus(c.id, 'Resolved')}
                          className="text-emerald-400 hover:text-emerald-300 font-bold"
                        >
                          ✓ Resolve
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. TRANSIT & FLEET GPS TAB */}
      {activeTab === 'transport' && (
        <div className="space-y-6">
          {/* Dispatch Banner */}
          {dispatchAlertMsg && (
            <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2 animate-fadeIn">
              <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>{dispatchAlertMsg}</span>
            </div>
          )}

          {/* Transit KPI Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Fleet in Operation</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">{busRoutes.length} Buses</span>
                <span className="text-xs font-bold text-emerald-400">100% On-time</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Satellite GPS Uplink Active</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Registered Passengers</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-amber-400">165</span>
                <span className="text-xs text-slate-400">/ 180 Capacity</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Digital QR passes issued</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Average Transit Delay</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-400">0.8 min</span>
                <span className="text-xs text-slate-400">Minimal congestion</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Optimal morning route flow</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Semester Transit Fare</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">$350</span>
                <span className="text-xs text-emerald-400">All routes pass</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Includes real-time GPS tracking</p>
            </div>
          </div>

          {/* Active Bus Fleet Cards */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bus className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Live Campus Bus Fleet & Telemetry</h3>
                  <p className="text-xs text-slate-400">Real-time GPS positions, driver contacts, and route capacity</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowTransitPassModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-600/30 transition-all"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Issue Transit Pass</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {busRoutes.map((bus, idx) => {
                const routeNumber = bus.routeNo || bus.routeNumber || `R-${idx + 1}`;
                const routeName = bus.name || bus.routeName || 'Campus Transit Express';
                const vehicleStatus = bus.status || 'En Route (On Schedule)';
                const location = bus.currentLocation || (bus.stops && bus.stops.length > 0 ? bus.stops[1] || bus.stops[0] : 'Main Campus Gate');
                const etaTime = bus.eta || '12 mins';

                return (
                  <div key={bus.id || bus.routeNo || idx} className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white">{routeNumber} - {routeName}</h4>
                        <p className="text-xs text-slate-400">{bus.driverName} • {bus.driverPhone} • Vehicle: {bus.vehicleNo}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {vehicleStatus}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Current GPS: <strong>{location}</strong></span>
                      </div>
                      <span className="font-mono text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded">
                        ETA: {etaTime}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400">
                      <span className="block font-semibold text-slate-300 mb-1">
                        Route Stops ({bus.registeredStudents || 0}/{bus.capacity} seats reserved):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(bus.stops || []).map((stop, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] flex items-center gap-1">
                            <span>{i + 1}.</span> {stop}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <button
                        onClick={() => handleDispatchBroadcast(routeName)}
                        className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 text-[11px]"
                      >
                        <Radio className="w-3.5 h-3.5" />
                        <span>Ping Driver Radio</span>
                      </button>
                      <a
                        href={`tel:${bus.driverPhone}`}
                        className="text-slate-300 hover:text-white flex items-center gap-1 text-[11px]"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Dispatch</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Student Transit Passes Roster */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Issued Student Transit Passes & QR Verification</h3>
                  <p className="text-xs text-slate-400">Valid digital boarding tokens for semester riders</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {transitPasses.map((pass) => (
                <div key={pass.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 relative group">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{pass.studentName}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">{pass.studentId}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        pass.status === 'Active'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {pass.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 bg-slate-900/70 p-2 rounded-lg border border-slate-800/60 space-y-1">
                    <p className="font-semibold text-amber-300">{pass.routeNo} • {pass.routeName}</p>
                    <p className="text-slate-400 text-[11px]">Stop: {pass.stopName}</p>
                    <p className="text-slate-400 text-[10px]">Valid Until: {pass.validUntil}</p>
                  </div>

                  <button
                    onClick={() => setSelectedPassForQR(pass)}
                    className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <QrCode className="w-3.5 h-3.5 text-amber-400" />
                    <span>View QR Pass</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. DIGITAL LIBRARY TAB */}
      {activeTab === 'library' && (
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Digital Library & Physical Circulation</h3>
                  <p className="text-xs text-slate-400">Search textbook catalog, check shelf location, and reserve copies</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={librarySearch}
                    onChange={(e) => setLibrarySearch(e.target.value)}
                    placeholder="Search title, author, ISBN..."
                    className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <select
                  value={libraryCategory}
                  onChange={(e) => setLibraryCategory(e.target.value)}
                  className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
                >
                  <option value="All">All Categories</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBooks.map((book) => {
                const isAvailable = book.availableCopies > 0;
                return (
                  <div key={book.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold text-white">{book.title}</h4>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                            isAvailable
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {book.availableCopies}/{book.totalCopies} Available
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">By {book.author}</p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                        <span className="font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{book.isbn}</span>
                        <span>Rack: <strong className="text-slate-300">{book.rackLocation}</strong></span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] text-indigo-300">{book.category}</span>
                      <button
                        onClick={() => handleToggleBookCheckout(book.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          isAvailable
                            ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        {isAvailable ? 'Check Out Copy' : 'Return Copy'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ALLOCATE STUDENT MODAL */}
      {showAllocateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Allocate Student to Hostel Room</h3>
              <button onClick={() => setShowAllocateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAllocateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Select Student</label>
                <select
                  value={allocateStudentName}
                  onChange={(e) => setAllocateStudentName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                >
                  {INITIAL_STUDENTS.map(s => (
                    <option key={s.id} value={s.name}>{s.name} ({s.studentId})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Hostel Block</label>
                <select
                  value={allocateBlock}
                  onChange={(e) => setAllocateBlock(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Block A (Boys)">Block A (Boys Dorm)</option>
                  <option value="Block B (Girls)">Block B (Girls Dorm)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Target Room Number</label>
                <input
                  type="text"
                  value={allocateRoomNo}
                  onChange={(e) => setAllocateRoomNo(e.target.value)}
                  placeholder="e.g. B-105 or A-102"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAllocateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-md shadow-amber-600/30"
                >
                  Assign Bed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COMPLAINT SUBMIT MODAL */}
      {showComplaintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Log Hostel Maintenance Request</h3>
              <button onClick={() => setShowComplaintModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleComplaintSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Student Name</label>
                  <input
                    type="text"
                    value={complaintStudentName}
                    onChange={(e) => setComplaintStudentName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Room #</label>
                  <input
                    type="text"
                    value={complaintRoomNo}
                    onChange={(e) => setComplaintRoomNo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category</label>
                  <select
                    value={complaintCategory}
                    onChange={(e) => setComplaintCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="WiFi / Network">WiFi / Network</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Cleanliness">Cleanliness</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Priority</label>
                  <select
                    value={complaintPriority}
                    onChange={(e) => setComplaintPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Issue Description *</label>
                <textarea
                  rows={3}
                  required
                  value={complaintDescription}
                  onChange={(e) => setComplaintDescription(e.target.value)}
                  placeholder="Describe the defect or problem..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowComplaintModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-md shadow-amber-600/30"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ISSUE TRANSIT PASS MODAL */}
      {showTransitPassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Issue Student Transit Pass</h3>
              <button onClick={() => setShowTransitPassModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssueTransitPass} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Select Student</label>
                <select
                  value={passStudentName}
                  onChange={(e) => setPassStudentName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                >
                  {INITIAL_STUDENTS.map(s => (
                    <option key={s.id} value={s.name}>{s.name} ({s.studentId})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Transit Route</label>
                <select
                  value={passRouteNo}
                  onChange={(e) => setPassRouteNo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                >
                  {busRoutes.map(r => (
                    <option key={r.routeNo} value={r.routeNo}>{r.routeNo} - {r.name || r.routeName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Designated Pickup Stop</label>
                <input
                  type="text"
                  value={passStopName}
                  onChange={(e) => setPassStopName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Semester Transit Fee:</span>
                <span className="font-mono text-emerald-400 font-bold">$350.00 (Includes QR Access)</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowTransitPassModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-md shadow-amber-600/30"
                >
                  Generate Pass & QR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR PASS VIEWER MODAL */}
      {selectedPassForQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl text-center">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Campus Transit Pass</span>
              <button onClick={() => setSelectedPassForQR(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-white">{selectedPassForQR.studentName}</h3>
              <p className="text-xs text-slate-400 font-mono">{selectedPassForQR.studentId}</p>
            </div>

            {/* QR Visual */}
            <div className="p-4 bg-white rounded-2xl inline-block shadow-lg mx-auto">
              <div className="w-40 h-40 bg-slate-950 p-2 rounded-xl flex items-center justify-center relative overflow-hidden">
                <QrCode className="w-32 h-32 text-amber-400" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-400/10 to-transparent animate-pulse" />
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl text-xs text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Route:</span>
                <span className="font-bold text-white">{selectedPassForQR.routeNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Stop:</span>
                <span className="text-slate-200">{selectedPassForQR.stopName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="text-emerald-400 font-bold">{selectedPassForQR.status} (Valid 2026)</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 font-mono select-all">
              Token: {selectedPassForQR.qrCodeToken}
            </p>

            <button
              onClick={() => setSelectedPassForQR(null)}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
