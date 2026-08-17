export type UserRole = 'admin' | 'teacher' | 'student' | 'parent' | 'superadmin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department?: string;
  studentId?: string;
  phone?: string;
}

export type PerformanceStatus = 'Excelling' | 'Improving' | 'At Risk' | 'Average';

export interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string; // e.g. CS-2023-089
  department: string;
  semester: string;
  year: string;
  section: string;
  avatar: string;
  performanceStatus: PerformanceStatus;
  attendanceRate: number; // e.g. 96
  gpa: number; // e.g. 3.9
  totalMarks?: number; // e.g. 982
  rank?: number;
  phone: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  bloodGroup: string;
  address: string;
  enrollmentDate: string;
  dob: string;
  feesPending: number;
  feesStatus: 'Paid' | 'Pending' | 'Overdue';
  courses: string[];
}

export type TeacherPerformance = 'Excellent' | 'Good' | 'Satisfactory' | 'Needs Review';
export type TeacherStatus = 'Active' | 'On Leave' | 'Sabbatical';

export interface Teacher {
  id: string;
  name: string;
  email: string;
  teacherId: string;
  department: string;
  subjects: string[];
  status: TeacherStatus;
  performance: TeacherPerformance;
  avatar: string;
  rating: number; // 4.8
  salary: number; // e.g. 8500
  phone: string;
  officeRoom: string;
  joinDate: string;
  classesCount: number;
}

export interface Course {
  id: string;
  code: string; // CS 101, MTH 204
  name: string;
  department: string;
  credits: number;
  instructorId?: string;
  instructorName?: string;
  room?: string;
  color?: string;
  schedule?: {
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
    time: string; // '09:00', '10:00'
    durationHours: number;
    room: string;
  }[];
  isAssigned?: boolean;
}

export interface TimetableEntry {
  id: string;
  courseCode: string;
  courseName: string;
  instructor: string;
  room: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  timeSlot: string; // "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"
  duration: number; // in hours
  color: 'emerald' | 'rose' | 'cyan' | 'indigo' | 'amber' | 'purple';
  hasConflict?: boolean;
  conflictMessage?: string;
}

export interface AttendanceDayRecord {
  date: string;
  day: number; // 1 - 31
  month: string; // "November 2023"
  attendancePercent: number;
  status: 'high' | 'low' | 'normal' | 'weekend' | 'holiday';
}

export interface DefaulterStudent {
  id: string;
  name: string;
  studentId: string;
  department: string;
  attendance: number;
  status: 'Critical' | 'High Risk' | 'Declining';
  avatar: string;
  parentPhone: string;
  parentEmail: string;
  lastAbsence: string;
}

export interface ExamRecord {
  id: string;
  subject: string;
  cohort: string;
  dateTime: string;
  invigilator: string;
  invigilatorAvatar?: string;
  status: 'Ready' | 'Drafting' | 'Action Needed';
  room: string;
  durationMinutes: number;
  totalMarks: number;
}

export interface ExamResultItem {
  rank: number;
  studentName: string;
  studentId: string;
  avatar: string;
  totalMarks: number;
  maxMarks: number;
  cgpa: number;
  status: 'Pass' | 'Fail';
  department: string;
  breakdown: {
    subject: string;
    marks: number;
    grade: string;
  }[];
}

export interface FeeLedgerItem {
  id: string;
  studentName: string;
  studentId: string;
  department: string;
  category: 'Tuition Fee (Term 2)' | 'Hostel & Mess' | 'Transport Fee' | 'Lab & Library Fee' | 'Exam Fee';
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Overdue' | 'Pending';
  avatar: string;
  paidDate?: string;
  transactionId?: string;
  invoiceNo: string;
}

export interface Assignment {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  instructor: string;
  dueDate: string;
  maxPoints: number;
  submissionsCount: number;
  totalStudents: number;
  description: string;
  status: 'Active' | 'Graded' | 'Closed';
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  availableCopies: number;
  totalCopies: number;
  rackLocation: string;
}

export interface HostelRoom {
  id?: string;
  roomNo: string;
  roomNumber?: string;
  block: string;
  type: 'Single' | 'Double' | 'Triple';
  capacity: number;
  occupied: number;
  students: string[];
  occupants?: string[];
  status?: string;
}

export interface BusRoute {
  id?: string;
  routeNo: string;
  routeNumber?: string;
  name: string;
  routeName?: string;
  driverName: string;
  driverPhone: string;
  stops: string[];
  vehicleNo: string;
  capacity: number;
  registeredStudents: number;
  status?: string;
  currentLocation?: string;
  eta?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'alert' | 'info' | 'success' | 'warning';
  read: boolean;
}

export interface AIInsight {
  id: string;
  title: string;
  category: 'attendance' | 'workload' | 'performance' | 'revenue';
  summary: string;
  severity: 'info' | 'warning' | 'critical';
  suggestedActions: string[];
  actionLinkText?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  dataSnippet?: any;
}

export type AuditActionType =
  | 'Attendance Change'
  | 'Grade Update'
  | 'Login & Session'
  | 'Fee Adjustment'
  | 'Course & Timetable'
  | 'Student Record'
  | 'Security & Auth';

export interface CampusLicense {
  id: string;
  softwareName: string;
  vendor: string;
  logoIcon?: string;
  category: 'Engineering & Math' | 'Productivity & Office' | 'Design & Media' | 'Development & Cloud' | 'Research & Analytics' | 'Security & LMS';
  licenseType: 'Campus-wide Unlimited' | 'Per-Seat Volume' | 'Named User' | 'Site Enterprise';
  totalSeats: number;
  assignedSeats: number;
  licenseKey: string;
  costPerYear: number;
  expiryDate: string;
  status: 'Active' | 'Expiring Soon' | 'Expired' | 'Pending Renewal';
  department: string;
  adminContact: string;
  purchaseOrderNo: string;
  assignedUsers: {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'faculty' | 'staff';
    assignedDate: string;
    seatStatus: 'Active' | 'Revoked';
  }[];
  downloadUrl?: string;
  complianceNotes?: string;
  renewalAlertDays?: number;
}

export interface HostelComplaint {
  id: string;
  roomNo: string;
  block: string;
  studentName: string;
  category: 'Plumbing' | 'Electrical' | 'WiFi / Network' | 'Furniture' | 'Cleanliness';
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Pending' | 'In Progress' | 'Resolved';
  reportedAt: string;
  resolvedAt?: string;
}

export interface TransitPass {
  id: string;
  studentId: string;
  studentName: string;
  routeNo: string;
  routeName: string;
  stopName: string;
  validUntil: string;
  status: 'Active' | 'Expired' | 'Suspended';
  qrCodeToken: string;
  paidAmount: number;
}


export type AuditSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AuditStatus = 'Verified' | 'Flagged' | 'Reverted' | 'Under Review';

export interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole | 'system';
  actorAvatar?: string;
  actorEmail?: string;
  actionType: AuditActionType;
  actionTitle: string;
  targetResource: string;
  targetId?: string;
  description: string;
  previousValue?: string;
  newValue?: string;
  ipAddress: string;
  location?: string;
  device: string;
  severity: AuditSeverity;
  status: AuditStatus;
  integrityHash: string; // Tamper-evident hash
  reverted?: boolean;
}
