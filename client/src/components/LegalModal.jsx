import React from 'react';
import { X, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

export default function LegalModal({ type, isOpen, onClose }) {
  if (!isOpen) return null;

  const contentMap = {
    terms: {
      title: 'Terms & Conditions of Service',
      body: (
        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          <p>
            Welcome to ACS Groups. By accessing this platform, creating an account, or participating in business co-funding or commodity asset allocations, you agree to these Terms.
          </p>
          <h4 className="font-bold text-white text-sm">1. Co-Investment Nature</h4>
          <p>
            Business investments operate on a fractional lot allocation model (minimum ₹10 per lot). Capital is channeled directly to designated business operators under equipment and revenue pledge agreements.
          </p>
          <h4 className="font-bold text-white text-sm">2. Admin Verification Workflow</h4>
          <p>
            No user investment is confirmed upon UPI payment submission. All payments must be validated by the platform Administrator against banking credits. Once verified, the investment record is generated and total project progress is incremented.
          </p>
          <h4 className="font-bold text-white text-sm">3. Asset Valuation</h4>
          <p>
            Commodity asset valuations (Gold, Silver, Land) are determined by published Administrator reference spot rates. Current portfolio values reflect these published spot rates.
          </p>
        </div>
      )
    },
    risk: {
      title: 'Risk Disclosure & Disclaimer Notice',
      body: (
        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300">
            <strong>Key Warning:</strong> Do not invest capital that you cannot afford to lose.
          </div>
          <p>
            1. <strong>Business Risk:</strong> Manufacturing, agriculture, and small business operations may encounter operational, supply chain, or macroeconomic disruptions affecting expected yields.
          </p>
          <p>
            2. <strong>Commodity Price Risk:</strong> Gold and Silver bullion prices are subject to global commodity market price movements.
          </p>
          <p>
            3. <strong>Regulatory Disclaimer:</strong> This software represents an application prototype. In production, offerings must comply with SEBI, RBI, MCA, and Indian financial regulations.
          </p>
        </div>
      )
    },
    privacy: {
      title: 'Privacy Policy & Data Security',
      body: (
        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          <p>
            ACS Groups is committed to protecting your personal information. We store your full name, email, phone number, and transaction UTR records securely.
          </p>
          <p>
            All passwords are encrypted using one-way salted cryptographic hashing (bcrypt). We never store or transmit plain-text credentials.
          </p>
          <p>
            Transaction UTR details are preserved exclusively for reconciliation with commercial banking partners.
          </p>
        </div>
      )
    }
  };

  const item = contentMap[type] || contentMap.risk;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-5 sm:p-6 space-y-4 my-auto max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <FileText className="w-5 h-5" />
            <h3 className="font-bold text-sm text-white">{item.title}</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto pr-2">
          {item.body}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition"
        >
          Acknowledge & Close
        </button>
      </div>
    </div>
  );
}
