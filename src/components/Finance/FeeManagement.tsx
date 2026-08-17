import React, { useState } from 'react';
import {
  DollarSign,
  CreditCard,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Download,
  Receipt,
  Search,
  CheckCircle2,
  Clock,
  Send,
  X,
  Printer,
  ChevronRight,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FeeLedgerItem } from '../../types';

interface FeeManagementProps {
  ledger: FeeLedgerItem[];
  setLedger: React.Dispatch<React.SetStateAction<FeeLedgerItem[]>>;
  onOpenParentAlert: (studentName: string, details: string) => void;
}

export const FeeManagement: React.FC<FeeManagementProps> = ({
  ledger,
  setLedger,
  onOpenParentAlert
}) => {
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedItemForPayment, setSelectedItemForPayment] = useState<FeeLedgerItem | null>(null);
  const [paymentSuccessReceipt, setPaymentSuccessReceipt] = useState<FeeLedgerItem | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'wallet'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [exportFeedback, setExportFeedback] = useState(false);

  // Filtered Ledger Items
  const filteredLedger = ledger.filter((item) => {
    const matchSearch =
      item.studentName.toLowerCase().includes(search.toLowerCase()) ||
      item.studentId.toLowerCase().includes(search.toLowerCase()) ||
      item.invoiceNo.toLowerCase().includes(search.toLowerCase());
    const matchDept = selectedDept === 'All' || item.department === selectedDept;
    const matchStatus = selectedStatus === 'All' || item.status === selectedStatus;
    return matchSearch && matchDept && matchStatus;
  });

  const totalCollected = ledger.filter(i => i.status === 'Paid').reduce((acc, i) => acc + i.amount, 0);
  const totalPending = ledger.filter(i => i.status !== 'Paid').reduce((acc, i) => acc + i.amount, 0);

  const handleExportFeeSummaryCSV = () => {
    const paidItems = ledger.filter(i => i.status === 'Paid');
    const pendingItems = ledger.filter(i => i.status === 'Pending');
    const overdueItems = ledger.filter(i => i.status === 'Overdue');
    const collectionEfficiency = ((totalCollected / ((totalCollected + totalPending) || 1)) * 100).toFixed(1);

    const lines: string[] = [
      '=== INSTITUTIONAL FEE MANAGEMENT & FINANCIAL SUMMARY ===',
      `Export Timestamp,"${new Date().toLocaleString()}"`,
      `Total Collected Revenue ($),${totalCollected}`,
      `Total Pending Receivables ($),${totalPending}`,
      `Total Projected Revenue ($),${totalCollected + totalPending}`,
      `Collection Efficiency (%),${collectionEfficiency}%`,
      `Total Paid Accounts,${paidItems.length}`,
      `Total Pending Accounts,${pendingItems.length}`,
      `Total Overdue Flagged Accounts,${overdueItems.length}`,
      '',
      '=== DEPARTMENTAL FEE BREAKDOWN ===',
      'Department,Total Invoiced ($),Collected ($),Pending ($),Collection Rate (%)'
    ];

    const departments = ['Computer Science', 'Electrical Eng.', 'Mechanical Eng.'];
    departments.forEach(dept => {
      const deptItems = ledger.filter(i => i.department === dept);
      const collected = deptItems.filter(i => i.status === 'Paid').reduce((acc, i) => acc + i.amount, 0);
      const pending = deptItems.filter(i => i.status !== 'Paid').reduce((acc, i) => acc + i.amount, 0);
      const total = collected + pending;
      const rate = total > 0 ? ((collected / total) * 100).toFixed(1) : '0';
      lines.push(`"${dept}",${total},${collected},${pending},${rate}%`);
    });

    lines.push('');
    lines.push('=== STUDENT ACCOUNT LEDGER & INVOICE RECORDS ===');
    lines.push('Invoice No,Student ID,Student Name,Department,Category,Amount ($),Due Date,Status,Paid Date,Transaction ID');

    filteredLedger.forEach(item => {
      const sanitizedName = item.studentName.replace(/"/g, '""');
      lines.push(
        `"${item.invoiceNo}","${item.studentId}","${sanitizedName}","${item.department}","${item.category}",${item.amount},"${item.dueDate}","${item.status}","${item.paidDate || 'N/A'}","${item.transactionId || 'N/A'}"`
      );
    });

    const csvContent = lines.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fee_management_summary_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExportFeedback(true);
    setTimeout(() => setExportFeedback(false), 3000);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForPayment) return;

    setIsProcessing(true);
    setTimeout(() => {
      const updatedItem: FeeLedgerItem = {
        ...selectedItemForPayment,
        status: 'Paid',
        paidDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        transactionId: `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`
      };

      setLedger(prev => prev.map(i => (i.id === selectedItemForPayment.id ? updatedItem : i)));
      setIsProcessing(false);
      setSelectedItemForPayment(null);
      setPaymentSuccessReceipt(updatedItem);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore if iframe blocks
      }
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 4 Stat Cards matching Image 14.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Collected</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-white">${totalCollected.toLocaleString()}</h3>
            <p className="text-xs text-emerald-400 font-medium mt-1">Annual Forecast: $1.24M</p>
          </div>
        </div>

        {/* Pending Receivables */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Pending Receivables</span>
            <div className="p-2 rounded-xl bg-rose-500/15 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-white">${totalPending.toLocaleString()}</h3>
            <p className="text-xs text-rose-400 font-medium mt-1">4 overdue accounts flagged</p>
          </div>
        </div>

        {/* Collection Efficiency */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Collection Efficiency</span>
            <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black text-white">94.0%</h3>
              <p className="text-xs text-emerald-400 font-medium mt-1">+3.5% vs Q1</p>
            </div>
            <div className="w-10 h-10 rounded-full border-4 border-indigo-500 border-t-transparent flex items-center justify-center text-[10px] font-bold text-indigo-400">
              94%
            </div>
          </div>
        </div>

        {/* AI Predictive Analysis Card matching Image 14.png */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/70 to-slate-900/90 border border-indigo-500/40 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-300">AI Payment Plan</span>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-xs text-slate-300 mt-1 leading-snug">
            3 overdue accounts eligible for zero-interest 3-month installment plans.
          </p>
          <button
            onClick={() => onOpenParentAlert('David Kim & Aisha Patel', 'Installment Fee Assistance Proposal')}
            className="mt-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 text-left flex items-center gap-1"
          >
            <span>Generate Payment Plans</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Student Ledger Section matching Image 14.png */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Student Account Ledger & Invoicing</h3>
            <p className="text-xs text-slate-400">Tuition fees, hostel, transportation, and lab payments</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportFeeSummaryCSV}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                exportFeedback
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
              }`}
              title="Export Financial Summary & Student Ledger as CSV file"
            >
              {exportFeedback ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-white animate-pulse" />
                  <span>CSV Exported</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Export Summary CSV</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student, ID, or invoice..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400"
            />
          </div>

          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            >
              <option value="All">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Electrical Eng.">Electrical Eng.</option>
              <option value="Mechanical Eng.">Mechanical Eng.</option>
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            >
              <option value="All">All Payment Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-300 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Student ID</th>
                <th className="py-3 px-3">Fee Category</th>
                <th className="py-3 px-3">Invoice No</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Due Date</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredLedger.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors group">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.avatar}
                        alt={item.studentName}
                        className="w-7 h-7 rounded-lg object-cover border border-slate-700"
                      />
                      <span className="font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {item.studentName}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-3 font-mono text-slate-300">{item.studentId}</td>

                  <td className="py-3 px-3 text-slate-300 font-medium">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 text-[11px]">
                      {item.category}
                    </span>
                  </td>

                  <td className="py-3 px-3 font-mono text-slate-400">{item.invoiceNo}</td>

                  <td className="py-3 px-3 font-bold text-white">${item.amount.toLocaleString()}</td>

                  <td className="py-3 px-3 text-slate-300">{item.dueDate}</td>

                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      item.status === 'Paid'
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : item.status === 'Pending'
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                    }`}>
                      {item.status === 'Paid' ? <CheckCircle2 className="w-3 h-3" /> :
                       item.status === 'Pending' ? <Clock className="w-3 h-3" /> :
                       <AlertTriangle className="w-3 h-3" />}
                      {item.status}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right">
                    {item.status === 'Paid' ? (
                      <button
                        onClick={() => setPaymentSuccessReceipt(item)}
                        className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 ml-auto"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>
                    ) : (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedItemForPayment(item)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20"
                        >
                          Collect Fee
                        </button>
                        <button
                          onClick={() => onOpenParentAlert(item.studentName, `Fee reminder for ${item.category} ($${item.amount}) due ${item.dueDate}`)}
                          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                          title="Remind Parent"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Fee Payment Modal */}
      {selectedItemForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#0f172a] border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-400" />
                Collect Student Fee
              </h3>
              <button
                onClick={() => setSelectedItemForPayment(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProcessPayment} className="my-5 space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Student:</span>
                  <span className="font-bold text-white">{selectedItemForPayment.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Category:</span>
                  <span className="text-slate-200">{selectedItemForPayment.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Invoice Ref:</span>
                  <span className="font-mono text-indigo-300">{selectedItemForPayment.invoiceNo}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800 text-sm">
                  <span className="font-bold text-white">Amount Due:</span>
                  <span className="font-black text-emerald-400">${selectedItemForPayment.amount.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-slate-300 font-semibold mb-2">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 ${
                      paymentMethod === 'card' ? 'bg-indigo-600/30 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Card / POS</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 ${
                      paymentMethod === 'bank' ? 'bg-indigo-600/30 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>ACH / Bank</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wallet')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 ${
                      paymentMethod === 'wallet' ? 'bg-indigo-600/30 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Receipt className="w-4 h-4" />
                    <span>Cash / Desk</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedItemForPayment(null)}
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/25 disabled:opacity-50"
                >
                  {isProcessing ? 'Confirming...' : 'Record Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Receipt Modal */}
      {paymentSuccessReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-sm bg-[#0f172a] border border-slate-700 rounded-3xl p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Payment Receipt Confirmed</h3>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">{paymentSuccessReceipt.transactionId || 'TXN-9842109'}</p>

            <div className="my-5 p-4 rounded-xl bg-slate-900 border border-slate-800 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Paid By:</span>
                <span className="font-bold text-white">{paymentSuccessReceipt.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Category:</span>
                <span className="text-slate-200">{paymentSuccessReceipt.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount:</span>
                <span className="font-black text-emerald-400">${paymentSuccessReceipt.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date:</span>
                <span className="text-slate-200">{paymentSuccessReceipt.paidDate || 'Today'}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 flex items-center justify-center gap-1 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
              >
                <Printer className="w-3.5 h-3.5" />
                Print
              </button>
              <button
                onClick={() => setPaymentSuccessReceipt(null)}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
