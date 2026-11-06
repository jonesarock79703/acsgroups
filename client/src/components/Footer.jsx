import React, { useState } from 'react';
import { Shield, AlertTriangle, FileText, Lock, ExternalLink } from 'lucide-react';

export default function Footer({ onOpenLegal, onGoToAdmin }) {
  return (
    <footer className="glass-panel border-t border-white/10 text-xs text-slate-400 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
        {/* Compliance Warning Callout */}
        <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2 text-[11px] leading-relaxed shadow-lg">
          <div className="flex items-center gap-2 text-amber-400 font-black tracking-wide">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>STATUTORY REGULATORY RISK DISCLOSURE & PROTOTYPE NOTICE</span>
          </div>
          <p className="text-slate-300">
            ACS Groups operates as an educational and prototype co-investment & fractional asset reserve technology platform. Co-investing in private businesses, manufacturing operations, commodities (gold, silver), or real-estate fractional assets involves substantial risk of loss. Projected yields and returns are non-guaranteed estimates and subject to commercial performance and market volatility.
          </p>
          <p className="text-slate-400">
            This portal does not constitute a public offer of securities, collective investment scheme (CIS), or deposit scheme. All Indian securities, payment processing, KYC/AML, and taxation guidelines must be complied with prior to production commercial deployment.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-white text-sm mb-3">ACS Groups Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onOpenLegal('about')} className="hover:text-emerald-400 transition">About the Engine</button></li>
              <li><button onClick={() => onOpenLegal('business')} className="hover:text-emerald-400 transition">Business Lot System (₹10/lot)</button></li>
              <li><button onClick={() => onOpenLegal('bullion')} className="hover:text-emerald-400 transition">Bullion Vault Custody</button></li>
              <li><button onClick={() => onOpenLegal('security')} className="hover:text-emerald-400 transition">Bank UTR Verification</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">Investment Options</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="text-slate-300 font-medium">Option A:</span> Business Co-Funding</li>
              <li><span className="text-slate-300 font-medium">Option B:</span> Commodity Gold Reserves</li>
              <li><span className="text-slate-300 font-medium">Option B:</span> Pure Silver Reserves</li>
              <li><span className="text-slate-300 font-medium">Option B:</span> Commercial Land Fractions</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">Legal & Governance</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onOpenLegal('terms')} className="hover:text-emerald-400 transition">Terms & Conditions</button></li>
              <li><button onClick={() => onOpenLegal('privacy')} className="hover:text-emerald-400 transition">Privacy Policy</button></li>
              <li><button onClick={() => onOpenLegal('risk')} className="hover:text-emerald-400 transition">Risk Disclosure Notice</button></li>
              <li><button onClick={() => onOpenLegal('kyc')} className="hover:text-emerald-400 transition">KYC & Anti-Money Laundering</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">Verification Desk</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-2">
              For manual transaction verification or assistance with UPI payment references:
            </p>
            <p className="font-mono text-emerald-400 text-xs font-semibold">compliance@growcapital.in</p>
            <p className="text-[11px] text-slate-500 mt-1">+91 80 4910 8800 (Mon - Sat)</p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 ACS Groups Ltd. All rights reserved.</p>
          <div className="flex items-center gap-3 text-slate-500">
            <span>ISO 27001 Security Aligned</span>
            <span>•</span>
            <span>Bank Grade 256-bit Encryption</span>
            {onGoToAdmin && (
              <>
                <span>•</span>
                <button
                  type="button"
                  onClick={onGoToAdmin}
                  className="text-slate-600 hover:text-amber-400/80 transition cursor-pointer"
                  title="Restricted Staff Portal"
                >
                  Admin
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
