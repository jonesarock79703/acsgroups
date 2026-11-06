import React, { useState, useEffect } from 'react';
import {
  X, CheckCircle, ArrowRight, ShieldCheck, Copy,
  Check, AlertTriangle, Clock, Upload, Building, Coins,
  Lock, Landmark, Image as ImageIcon, Sparkles, QrCode
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';

export default function InvestModal({ investment, isOpen, onClose, onSuccess }) {
  const { user, token, openAuthModal } = useAuth();

  const [amount, setAmount] = useState('100');
  const [lots, setLots] = useState(10);
  const [transactionId, setTransactionId] = useState('');
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [screenshotName, setScreenshotName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Platform company payment details
  const [companyDetails, setCompanyDetails] = useState({
    upiId: 'growcapital@icici',
    payeeName: 'ACS Groups Ltd',
    companyBankName: 'HDFC Bank Ltd',
    companyAccountNumber: '50200088991122',
    companyIfsc: 'HDFC0001234',
    paymentQrUrl: ''
  });
  const [qrImageError, setQrImageError] = useState(false);

  // Fetch company payment details
  const fetchCompanyDetails = async () => {
    try {
      const res = await fetch(`/api/payments/company-details?t=${Date.now()}`, {
        cache: 'no-store'
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.upiId) {
          setCompanyDetails(data);
          setQrImageError(false);
        }
      }
    } catch (err) {
      console.error('Error fetching company details:', err);
    }
  };

  useEffect(() => {
    fetchCompanyDetails();
  }, []);

  // Reset state and re-fetch company details whenever modal is opened
  useEffect(() => {
    if (investment && isOpen) {
      fetchCompanyDetails();
      setError('');
      setSubmittedSuccess(false);
      setSubmittedData(null);
      setTransactionId('');
      setScreenshotPreview(null);
      setScreenshotName('');
      const defaultAmount = investment.type === 'business' ? 100 : Math.max(500, investment.minInvestment || 10);
      setAmount(String(defaultAmount));
    }
  }, [investment, isOpen]);

  // Recalculate lots whenever amount or investment changes
  useEffect(() => {
    if (!investment || !amount) {
      setLots(0);
      return;
    }
    const num = Number(amount);
    if (isNaN(num) || num <= 0) {
      setLots(0);
      return;
    }
    const calculatedLots = Math.floor(num / (investment.rate || 10));
    setLots(calculatedLots);
  }, [amount, investment]);

  if (!isOpen || !investment) return null;

  // Guard: Commodity investments are locked as a Future Option
  if (investment.type === 'commodity' || investment.type === 'community') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
        <div className="glass-panel p-8 rounded-3xl max-w-md w-full text-center border border-amber-500/40 border-dashed shadow-2xl relative space-y-5 bg-slate-900/60 backdrop-blur-xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Lock className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Future Option • Locked
            </span>
            <h3 className="text-xl font-black text-white mt-3">{investment.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed mt-2">
              Commodity & Bullion Reserve investments are reserved as an upcoming <strong>Future Option</strong>. Orders are currently locked while live rates are shown in preview mode.
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-amber-500/20 text-xs text-amber-300 font-mono">
            Live Spot Valuation: ₹{Number(investment.rate).toLocaleString('en-IN')}/{investment.unitName || 'unit'}
          </div>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs transition cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    );
  }

  const handleCopyUpi = () => {
    if (!companyDetails?.upiId) return;
    navigator.clipboard.writeText(companyDetails.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Screenshot size should be less than 5MB.');
        return;
      }
      setScreenshotName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount < (investment.minInvestment || 10)) {
      setError(`Minimum investment is ₹${(investment.minInvestment || 10).toLocaleString('en-IN')}`);
      return;
    }

    if (!transactionId.trim()) {
      setError('Please enter the 12-digit UPI Transaction ID (UTR) or Bank Reference Number.');
      return;
    }

    if (!screenshotPreview) {
      setError('Please upload the payment confirmation screenshot.');
      return;
    }

    if (!user) {
      openAuthModal('login');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/payments/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          investmentId: investment.id,
          amount: numAmount,
          transactionId: transactionId.trim(),
          paymentDate,
          screenshotUrl: screenshotPreview
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Payment submission failed.');

      setSubmittedData({
        amount: numAmount,
        lots,
        transactionId: transactionId.trim(),
        paymentDate,
        investmentTitle: investment.title
      });

      setSubmittedSuccess(true);
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 }
      });

      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Error recording payment.');
    } finally {
      setLoading(false);
    }
  };

  const isBusiness = investment.type === 'business';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block truncate">
                Business Co-Funding Portal
              </span>
              <h3 className="text-base font-bold text-white leading-tight truncate">
                {investment.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition shrink-0 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-5">
          {/* POPUP / SUCCESS SCREEN */}
          {submittedSuccess && submittedData ? (
            <div className="text-center space-y-5 py-4 animate-scale-in">
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 ring-8 ring-emerald-500/10 shadow-lg shadow-emerald-500/20">
                <CheckCircle className="w-9 h-9" />
              </div>

              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Request Submitted Successfully!
                </span>
                <h4 className="text-xl font-black text-white mt-3">
                  Payment Verification in Progress
                </h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto mt-1 leading-relaxed">
                  Your payment details and screenshot proof have been successfully received and forwarded to our bank verification desk.
                </p>
              </div>

              {/* Summary Receipt Box */}
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-left space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Opportunity:</span>
                  <span className="font-bold text-white">{submittedData.investmentTitle}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Amount Paid:</span>
                  <span className="font-extrabold text-emerald-400 text-sm">₹{submittedData.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Lots Requested:</span>
                  <span className="font-bold text-white">{submittedData.lots.toLocaleString()} Lots</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Transaction ID (UTR):</span>
                  <span className="font-mono font-bold text-amber-300">{submittedData.transactionId}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Verification Status:</span>
                  <span className="px-2 py-0.5 rounded-full font-bold text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    Pending Admin Confirmation
                  </span>
                </div>
              </div>

              {/* Rule Explanation Banner */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-200/90 text-left flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="text-white block font-semibold">When will lots appear in "My Investments"?</strong>
                  <p className="leading-relaxed text-[11px] text-slate-300">
                    As per compliance guidelines, your lots will be officially allocated to <strong>"My Investments"</strong> once the platform Administrator verifies the transaction with the bank credit ledger.
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3.5 btn-primary-emerald font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 rounded-xl"
              >
                <span>Done</span>
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Alert */}
              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Opportunity Snapshot */}
              <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Entry Lot Rate</span>
                  <span className="text-sm font-black text-white mt-0.5 block">₹{investment.rate}/lot</span>
                </div>
                <div className="border-x border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Target Yield</span>
                  <span className="text-sm font-black text-emerald-400 mt-0.5 block">{investment.expectedReturn}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Tenure</span>
                  <span className="text-sm font-bold text-slate-200 mt-0.5 block truncate">{investment.tenure}</span>
                </div>
              </div>

              {/* Step 1 Box: Official Company Payment Transfer Info */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Landmark className="w-3.5 h-3.5" />
                    Step 1: Transfer Funds to Company Account
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                    Official UPI
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                  {/* Official Payment QR Box - Always visible */}
                  <div className="flex flex-col items-center shrink-0 p-2.5 bg-white rounded-2xl shadow-lg border-2 border-amber-500/30 w-32 relative group">
                    <img
                      src={
                        qrImageError
                          ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(companyDetails.upiUri || `upi://pay?pa=${companyDetails.upiId}&pn=${encodeURIComponent(companyDetails.payeeName)}&cu=INR`)}`
                          : (companyDetails.paymentQrUrl || `/api/payments/qr-image?t=${Date.now()}`)
                      }
                      alt="Official Payment QR"
                      onError={() => setQrImageError(true)}
                      className="w-28 h-28 object-contain rounded-lg"
                    />
                    <span className="text-[9px] text-slate-900 font-extrabold uppercase tracking-wider mt-1.5 flex items-center gap-1 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300 shadow-xs">
                      <QrCode className="w-3 h-3 text-amber-700" />
                      Scan to Pay
                    </span>
                  </div>

                  {/* UPI Details & Quick Copy */}
                  <div className="flex-1 w-full space-y-2.5">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Company UPI ID (VPA)</span>
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <span className="font-mono text-sm font-bold text-amber-300 select-all break-all">
                          {companyDetails.upiId}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/40 flex items-center gap-1.5 transition cursor-pointer shrink-0"
                        >
                          {copiedUpi ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400 text-[11px]">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span className="text-[11px]">Copy UPI</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 text-[11px] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Payee Name:</span>
                        <span className="font-semibold text-white">{companyDetails.payeeName}</span>
                      </div>
                      {companyDetails.companyBankName && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Bank:</span>
                          <span className="text-slate-300 font-mono text-[10px]">{companyDetails.companyBankName} • {companyDetails.companyAccountNumber}</span>
                        </div>
                      )}
                    </div>

                    {/* Mobile Quick UPI Intent Link */}
                    <a
                      href={companyDetails.upiUri || `upi://pay?pa=${companyDetails.upiId}&pn=${encodeURIComponent(companyDetails.payeeName)}&cu=INR&tn=${encodeURIComponent('ACS Groups Investment')}`}
                      className="inline-flex sm:hidden items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-bold transition"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Tap to Pay with UPI App</span>
                    </a>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Open Google Pay, PhonePe, Paytm, or BHIM. Scan the QR code above or transfer to the UPI ID, then fill out the submission form below.
                </p>
              </div>

              {/* Step 2 Box: Form Details */}
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                  Step 2: Enter Payment Details & Attach Proof
                </span>

                {/* Amount Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Investment Amount (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      required
                      min={investment.minInvestment || 10}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder={`Min ₹${investment.minInvestment || 10}`}
                      className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl pl-9 pr-4 py-2.5 text-white text-base font-bold focus:outline-none transition shadow-inner"
                    />
                  </div>

                  {/* Quick Chips */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {[100, 500, 1000, 5000, 10000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setAmount(String(preset))}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                          amount === String(preset)
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        +₹{preset.toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calculated Lots Pill */}
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-emerald-400 uppercase font-bold block">Calculated Units</span>
                    <p className="text-lg font-black text-white mt-0.5">
                      {lots.toLocaleString()} <span className="text-xs font-semibold text-emerald-400">Lots</span>
                    </p>
                  </div>
                  <div className="text-right text-[11px] text-slate-400 font-mono">
                    ₹10 = 1 Lot
                  </div>
                </div>

                {/* Transaction ID / UTR */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Transaction ID / UPI UTR Number</span>
                    <span className="text-[10px] text-amber-400 font-normal">Required for bank match</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="e.g. 12-digit UTR (423512345678) or IMPS reference"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono focus:outline-none transition"
                  />
                </div>

                {/* Payment Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    required
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none transition"
                  />
                </div>

                {/* Screenshot Upload with Preview */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Payment Proof Screenshot</span>
                    <span className="text-[10px] text-slate-400">JPG, PNG, WebP (Max 5MB)</span>
                  </label>

                  {screenshotPreview ? (
                    <div className="relative p-3 rounded-xl bg-slate-950 border border-emerald-500/40 flex items-center gap-3">
                      <img
                        src={screenshotPreview}
                        alt="Payment screenshot"
                        className="w-16 h-16 object-cover rounded-lg border border-slate-700 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-white truncate">{screenshotName || 'Screenshot attached'}</p>
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                          <Check className="w-3 h-3" /> Ready for verification
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setScreenshotPreview(null);
                          setScreenshotName('');
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                        title="Remove screenshot"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-xl cursor-pointer bg-slate-950/60 transition group">
                      <Upload className="w-6 h-6 text-slate-400 group-hover:text-emerald-400 transition" />
                      <span className="text-xs font-semibold text-slate-300 mt-2 group-hover:text-white">
                        Click to upload payment screenshot
                      </span>
                      <span className="text-[10px] text-slate-500 mt-0.5">
                        Screenshot showing UTR and amount paid
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 btn-primary-emerald font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 disabled:opacity-50 rounded-xl"
                >
                  {loading ? (
                    <span>Submitting Payment...</span>
                  ) : (
                    <>
                      <span>Submit Payment Verification</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-2">
                  🔒 Bank UTR audited • Lots allocated to "My Investments" after Admin confirmation
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
