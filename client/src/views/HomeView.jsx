import React from 'react';
import {
  TrendingUp, Shield, ArrowRight, CheckCircle2, Sparkles,
  Building, Coins, Clock, Lock, Award, Users, ChevronRight
} from 'lucide-react';
import InvestmentCard from '../components/InvestmentCard';

export default function HomeView({ investments, onInvest, onNavigate }) {
  const businessItems = investments.filter(i => i.type === 'business');
  const commodityItems = investments.filter(i => i.type === 'commodity' || i.type === 'community');

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 sm:pt-20 sm:pb-24">
        {/* Ambient atmospheric aura */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-amber-500/15 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center px-4">
          {/* Top Elite Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border-emerald-500/30 text-emerald-300 text-xs font-bold mb-8 shadow-xl shimmer-badge">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="tracking-wide">NEXT-GENERATION INSTITUTIONAL CO-INVESTMENT & BULLION VAULTS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08]">
            Wealth Generation Through Real Assets at{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-200 to-amber-300 bg-clip-text text-transparent underline decoration-emerald-500/30 decoration-wavy decoration-from-font">
              ₹10 per Lot
            </span>
          </h1>

          <p className="mt-6 text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Co-own vetted Indian manufacturing powerhouses or protect your wealth with insured vault reserves in <strong>24K Gold</strong>, <strong>Pure 999 Silver</strong>, and <strong>Commercial Land Parcels</strong>.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('business')}
              className="px-8 py-4 btn-primary-emerald text-xs sm:text-sm flex items-center gap-3 shadow-2xl cursor-pointer group"
            >
              <span>Explore Businesses (₹10/Lot)</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5 stroke-[2.5]" />
            </button>
            <button
              onClick={() => onNavigate('community')}
              className="px-6 py-4 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs sm:text-sm flex items-center gap-2.5 backdrop-blur-md opacity-85 hover:opacity-100 transition cursor-pointer group shadow-xl"
            >
              <Lock className="w-4 h-4 text-amber-400 stroke-[2.5]" />
              <span>Explore Bullion & Land Vaults</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30 font-bold uppercase tracking-wider">
                Future Option
              </span>
            </button>
          </div>

          {/* Institutional Metric Strip */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-2xl glass-panel card-hover-glow border-white/10">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Entry Standard</span>
              <p className="text-2xl font-black text-white mt-1">₹10 <span className="text-xs font-semibold text-emerald-400">/ Lot</span></p>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Accessible to all</span>
            </div>
            <div className="p-4 rounded-2xl glass-panel card-hover-glow border-emerald-500/30">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Disbursed</span>
              <p className="text-2xl font-black text-emerald-400 mt-1">₹87.50L+</p>
              <span className="text-[10px] text-emerald-400/80 mt-0.5 block">100% Ledger Audited</span>
            </div>
            <div className="p-4 rounded-2xl glass-panel card-hover-glow border-amber-500/30">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Target Yield</span>
              <p className="text-2xl font-black text-amber-300 mt-1">14 - 18% <span className="text-xs font-semibold text-slate-400">p.a.</span></p>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Quarterly Payouts</span>
            </div>
            <div className="p-4 rounded-2xl glass-panel card-hover-glow border-white/10">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Verification</span>
              <p className="text-2xl font-black text-white mt-1">100% Bank UTR</p>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Direct Admin Audit</span>
            </div>
          </div>
        </div>
      </section>

      {/* Two Investment Options Spotlight Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Option A Banner */}
          <div className="p-7 rounded-3xl glass-panel-emerald card-hover-glow flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-500" />
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
                <Building className="w-3.5 h-3.5" />
                <span>OPTION A – Business Investment</span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">Co-Fund Scalable Operating Businesses</h2>
              <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                Empower profitable manufacturing plants, agritech ventures, and solar grids. Start with as little as <strong className="text-emerald-300 font-bold">₹10 per lot</strong>. Automated lot calculation and quarterly profit disbursements.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-emerald-500/20">
              <span className="text-xs font-mono font-semibold text-emerald-300 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">₹10 = 1 Lot | ₹1,000 = 100 Lots</span>
              <button
                onClick={() => onNavigate('business')}
                className="btn-primary-emerald px-4 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <span>View Businesses</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Option B Banner (Locked - Transparent Future Option) */}
          <div className="p-7 rounded-3xl glass-panel-amber border border-amber-500/40 border-dashed opacity-75 hover:opacity-90 backdrop-blur-md flex flex-col justify-between relative overflow-hidden group transition-all">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/20 transition-all duration-500" />
            <div>
              <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <Coins className="w-3.5 h-3.5" />
                  <span>OPTION B – Commodity & Asset Reserves</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/40 text-[10px] font-mono font-bold tracking-wider">
                  <Lock className="w-3 h-3 text-amber-300" />
                  FUTURE OPTION • LOCKED
                </span>
              </div>
              <h2 className="text-2xl font-black text-white/95 tracking-tight">Physical Gold, Silver & Commercial Land</h2>
              <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                Physical asset reserves with admin-managed live spot pricing. <strong className="text-amber-300 font-bold">This option is locked as an upcoming future release.</strong> Vaults and pricing are presented in transparent preview mode.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-amber-500/20">
              <span className="text-xs font-mono font-semibold text-amber-300/90 bg-amber-950/70 px-2.5 py-1 rounded-lg border border-amber-500/30">
                🔒 Transparent Preview Mode
              </span>
              <button
                onClick={() => onNavigate('community')}
                className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-md"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>View Future Option Vaults</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Dedicated Portal Section - Business vs Commodity Separate Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Dedicated Investment Channels
          </span>
          <h2 className="text-3xl font-black text-white mt-1">
            Choose Your Preferred Asset Class
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Business co-funding and commodity asset vaults are operated independently. Select a channel below to browse active opportunities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Business Funding Channel Portal */}
          <div className="p-8 rounded-3xl glass-panel-emerald border border-emerald-500/30 flex flex-col justify-between relative overflow-hidden group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center gap-1.5 border border-emerald-500/30">
                  <Building className="w-3.5 h-3.5" />
                  <span>Business Co-Funding Portal</span>
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                  {businessItems.length} Active Deals
                </span>
              </div>
              <h3 className="text-2xl font-black text-white">
                Manufacturing, Agritech & Energy Ventures
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Co-own productive operating facilities with a fixed entry of <strong>₹10 per lot</strong>. Earn quarterly commercial yield payouts. (No lucky draw pools).
              </p>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">Unit Basis:</span>
                  <span className="font-semibold text-white">₹10 = 1 Lot Allocation</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">Payout Model:</span>
                  <span className="font-semibold text-emerald-400">Quarterly Commercial Returns</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">Draw Pool:</span>
                  <span className="font-semibold text-slate-400">None (Pure Equity/Revenue Co-Funding)</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-emerald-500/20">
              <button
                onClick={() => onNavigate('business')}
                className="w-full py-3.5 btn-primary-emerald font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <span>Enter Business Funding Portal ({businessItems.length} Products)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Commodity Asset Reserves Channel Portal (Locked - Transparent Future Option) */}
          <div className="p-8 rounded-3xl glass-panel-amber border border-amber-500/40 border-dashed opacity-75 hover:opacity-90 backdrop-blur-md flex flex-col justify-between relative overflow-hidden group transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center gap-1.5 border border-amber-500/30">
                  <Coins className="w-3.5 h-3.5" />
                  <span>Commodity Asset Reserves Portal</span>
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-500/40 shadow-sm">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  FUTURE OPTION (LOCKED)
                </span>
              </div>
              <h3 className="text-2xl font-black text-white/95">
                Physical Gold, Silver & Land Depository
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Fractional physical bullion and prime land backed by insured custody. Features Admin live spot rate repricing and 100% Target Lucky Draw Pools. <span className="text-amber-300 font-bold">This module is locked as an upcoming future option.</span>
              </p>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/20 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-semibold text-amber-300 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Locked • Future Option
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">Spot Pricing:</span>
                  <span className="font-semibold text-amber-300">Admin Managed Live Gram/Sq.Ft Rate</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">Depository:</span>
                  <span className="font-semibold text-white">Insured Vault Custody & Liquidity</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">Draw Pool:</span>
                  <span className="font-semibold text-amber-400">Exclusive 100% Target Lucky Draw</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-amber-500/20">
              <button
                onClick={() => onNavigate('community')}
                className="w-full py-3.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/10 text-amber-300 transition"
              >
                <Lock className="w-4 h-4" />
                <span>Preview Future Commodity Vaults ({commodityItems.length} Products)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Visual Flow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl glass-panel text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-emerald-500/10 blur-3xl pointer-events-none" />
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            Transparent Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-2 mb-8">
            How The Investment Process Works
          </h2>

          <div className="grid md:grid-cols-4 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 card-hover-glow relative">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 font-black flex items-center justify-center text-sm mb-4 shadow-lg shadow-emerald-500/20">
                1
              </span>
              <h4 className="text-sm font-bold text-white">Select Opportunity</h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Pick a business or asset. Enter your investment amount and see lots/units automatically calculated.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 card-hover-glow relative">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 font-black flex items-center justify-center text-sm mb-4 shadow-lg shadow-emerald-500/20">
                2
              </span>
              <h4 className="text-sm font-bold text-white">Scan UPI QR Code</h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Scan the dynamic company UPI QR code using GPay, PhonePe, or Paytm with the exact payment amount.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 card-hover-glow relative">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 font-black flex items-center justify-center text-sm mb-4 shadow-lg shadow-amber-500/20">
                3
              </span>
              <h4 className="text-sm font-bold text-white">Submit UTR Reference</h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Provide your 12-digit transaction ID. Your investment status becomes <em className="text-amber-300">Payment Verification Pending</em>.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 card-hover-glow relative">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 font-black flex items-center justify-center text-sm mb-4 shadow-lg shadow-emerald-500/20">
                4
              </span>
              <h4 className="text-sm font-bold text-white">Admin Verification</h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Admin verifies the payment against the bank ledger. Once confirmed, your portfolio credits and progress updates!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Notice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-3xl glass-panel border-white/10 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
            <h4 className="font-bold text-white text-sm">Regulatory Notice & Investment Disclaimer</h4>
            <p>
              ACS Groups is a technology co-investment and asset-tracking platform. Investments in early-stage businesses, manufacturing facilities, and commodities carry capital risk. Returns are targeted based on commercial performance and are not guaranteed fixed returns. All transactions require verified banking/UPI references.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
