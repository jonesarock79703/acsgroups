import React, { useState } from 'react';
import {
  TrendingUp, Shield, User, LogOut, Menu, X,
  Building, Coins, PieChart, Receipt, Settings,
  AlertCircle, ChevronDown, CheckCircle, ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationsDropdown from './NotificationsDropdown';

export default function Navbar({ activeTab, setActiveTab, onOpenAuth }) {
  const { user, isAdmin, logout, loginAsDemoInvestor, loginAsAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'business', label: 'Business Funding (₹10/Lot)' },
    { id: 'community', label: 'Commodity Reserves', isLockedFuture: true },
    ...(user ? [
      { id: 'portfolio', label: 'My Investments' },
      { id: 'transactions', label: 'Transactions' },
      { id: 'profile', label: 'Profile' }
    ] : []),
    ...(isAdmin ? [
      { id: 'admin', label: 'Admin Portal', highlight: true }
    ] : [])
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/70 backdrop-blur-xl border-b border-white/10 shadow-2xl">
      {/* Top micro disclaimer notice bar */}
      <div className="bg-slate-950/90 border-b border-white/5 px-4 py-1.5 text-center text-[11px] text-slate-300 flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
        <span>Co-investment & fractional asset reserve prototype • Min business entry: <strong className="text-emerald-400">₹10/lot</strong> • Instant Admin verified UPI rails</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 flex items-center justify-center text-slate-950 shadow-xl shadow-emerald-500/30 group-hover:scale-105 transition-transform duration-300 ring-2 ring-emerald-400/40">
              <TrendingUp className="w-5 h-5 font-black stroke-[3]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white group-hover:text-emerald-300 transition">
                  ACS<span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Groups</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5 tracking-wide hidden sm:block font-medium">
                Business Funding & Bullion Reserves
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/60 border border-white/5 backdrop-blur-md">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === item.id
                    ? item.highlight
                      ? 'btn-primary-amber shadow-md shadow-amber-500/25'
                      : item.isLockedFuture
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-md shadow-amber-500/20'
                      : 'btn-primary-emerald shadow-md shadow-emerald-500/25'
                    : item.highlight
                    ? 'text-amber-400 hover:bg-amber-500/10'
                    : item.isLockedFuture
                    ? 'text-amber-300/80 hover:text-amber-200 hover:bg-amber-500/10 opacity-80 hover:opacity-100'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.isLockedFuture && <span className="text-[11px]">🔒</span>}
                <span>{item.label}</span>
                {item.isLockedFuture && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase font-mono tracking-wider font-extrabold">
                    Future Option
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2.5">
            {/* Quick Demo Switcher (When not logged in) */}
            {!user && (
              <div className="hidden sm:flex items-center gap-1.5 glass-panel p-1 rounded-2xl border-white/10 shadow-lg">
                <button
                  onClick={() => loginAsDemoInvestor()}
                  className="px-3 py-1.5 text-[11px] font-bold text-slate-200 hover:text-emerald-300 hover:bg-emerald-500/15 rounded-xl transition cursor-pointer"
                  title="Instant login with pre-configured investor profile"
                >
                  ⚡ Demo User
                </button>
                <span className="text-slate-600">|</span>
                <button
                  onClick={() => loginAsAdmin()}
                  className="px-3 py-1.5 text-[11px] font-bold text-amber-300 hover:text-amber-200 hover:bg-amber-500/15 rounded-xl transition cursor-pointer"
                  title="Instant login as platform admin"
                >
                  🛡️ Admin
                </button>
              </div>
            )}

            {/* Notifications */}
            {user && <NotificationsDropdown />}

            {/* User Profile / Auth State */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs transition"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="font-semibold text-white leading-none text-xs truncate max-w-[100px]">
                      {user.name}
                    </p>
                    <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50">
                    <div className="p-2 border-b border-slate-800 mb-1">
                      <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {user.id}
                      </span>
                    </div>

                    <button
                      onClick={() => handleNavClick('portfolio')}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                    >
                      <PieChart className="w-3.5 h-3.5 text-emerald-400" />
                      My Investments
                    </button>
                    <button
                      onClick={() => handleNavClick('transactions')}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Receipt className="w-3.5 h-3.5 text-blue-400" />
                      Payment History
                    </button>
                    <button
                      onClick={() => handleNavClick('profile')}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5 text-teal-400" />
                      Profile & KYC
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => handleNavClick('admin')}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-amber-400 hover:bg-amber-500/10 flex items-center gap-2 mt-1 border-t border-slate-800 pt-2 font-semibold"
                      >
                        <Shield className="w-3.5 h-3.5 text-amber-400" />
                        Admin Dashboard
                      </button>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 mt-1 border-t border-slate-800 pt-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login', 'user')}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 transition"
                >
                  Log In
                </button>
                <button
                  onClick={() => onOpenAuth('register', 'user')}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-lg shadow-emerald-500/20"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between ${
                activeTab === item.id
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-1.5">
                {item.isLockedFuture && <span>🔒</span>}
                <span>{item.label}</span>
              </div>
              {item.isLockedFuture && (
                <span className="text-[9px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase font-mono font-bold">
                  Future Option
                </span>
              )}
            </button>
          ))}
          {!user && (
            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => loginAsDemoInvestor()}
                className="w-full py-2 text-xs font-semibold bg-slate-900 text-emerald-400 rounded-lg text-center border border-slate-800"
              >
                Instant Login as Demo Investor
              </button>
              <button
                onClick={() => loginAsAdmin()}
                className="w-full py-2 text-xs font-semibold bg-amber-500/10 text-amber-400 rounded-lg text-center border border-amber-500/30"
              >
                Instant Login as Platform Admin
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
