import React, { useState, useEffect } from 'react';
import { Shield, ArrowRight, LogOut } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import InvestModal from './components/InvestModal';
import LegalModal from './components/LegalModal';

import HomeView from './views/HomeView';
import InvestmentsView from './views/InvestmentsView';
import BusinessFundingView from './views/BusinessFundingView';
import CommunityInvestmentsView from './views/CommunityInvestmentsView';
import DashboardView from './views/DashboardView';
import MyInvestmentsView from './views/MyInvestmentsView';
import TransactionsView from './views/TransactionsView';
import ProfileView from './views/ProfileView';
import AdminDashboardView from './views/AdminDashboardView';
import AdminLoginView from './views/AdminLoginView';

function MainApp() {
  const { user, isAdmin, openAuthModal, logout } = useAuth();

  // Separate Admin route tracking (/admin or #admin)
  const [isAdminRoute, setIsAdminRoute] = useState(() => {
    return window.location.pathname.startsWith('/admin') || window.location.hash === '#admin';
  });

  const [activeTab, setActiveTab] = useState('home');
  const [investments, setInvestments] = useState([]);
  const [loadingInvestments, setLoadingInvestments] = useState(true);

  // Investment flow modal
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [investModalOpen, setInvestModalOpen] = useState(false);

  // Legal modal
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState('risk');

  // URL state listener for /admin vs /
  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdminRoute(window.location.pathname.startsWith('/admin') || window.location.hash === '#admin');
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setIsAdminRoute(true);
  };

  const navigateToSite = () => {
    window.history.pushState({}, '', '/');
    setIsAdminRoute(false);
    setActiveTab('home');
  };

  const fetchInvestments = async () => {
    try {
      const res = await fetch('/api/investments?status=all');
      if (res.ok) {
        const data = await res.json();
        setInvestments(data.investments || []);
      }
    } catch (err) {
      console.error('Failed to load investments:', err);
    } finally {
      setLoadingInvestments(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
    const interval = setInterval(fetchInvestments, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenInvest = (investment) => {
    if (investment?.type === 'commodity' || investment?.type === 'community') {
      return; // Locked future option
    }
    if (!user) {
      openAuthModal('login', 'user');
      return;
    }
    setSelectedInvestment(investment);
    setInvestModalOpen(true);
  };

  const handleInvestmentSuccess = () => {
    fetchInvestments();
  };

  const handleOpenLegal = (type) => {
    setLegalModalType(type);
    setLegalModalOpen(true);
  };

  // ==========================================
  // DEDICATED STANDALONE ADMIN ROUTE (/admin)
  // ==========================================
  if (isAdminRoute) {
    if (!isAdmin) {
      return (
        <AdminLoginView
          onLoginSuccess={() => setIsAdminRoute(true)}
          onBackToSite={navigateToSite}
        />
      );
    }

    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        {/* Isolated Admin Navigation Header */}
        <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-amber-500/25 shadow-2xl px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold border border-amber-500/30 shadow-md shadow-amber-500/10">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-white">
                  ACS<span className="text-amber-400">Groups</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold tracking-wider">
                  MASTER CONSOLE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5">Administrative Governance & Control Desk</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={navigateToSite}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 cursor-pointer shadow-sm"
            >
              <span>Investor Site</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
            <button
              onClick={() => {
                logout();
                navigateToSite();
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-white hover:bg-rose-500/20 border border-rose-500/30 transition cursor-pointer flex items-center gap-1.5"
              title="Admin Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        <main className="flex-1">
          <AdminDashboardView
            onInvestmentUpdated={fetchInvestments}
            onExitToSite={navigateToSite}
          />
        </main>
      </div>
    );
  }

  // ==========================================
  // PUBLIC INVESTOR SITE
  // ==========================================
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-100">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={(mode) => openAuthModal(mode, 'user')}
        onGoToAdmin={navigateToAdmin}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeView
            investments={investments}
            onInvest={handleOpenInvest}
            onNavigate={(tab) => {
              if (tab === 'admin') navigateToAdmin();
              else setActiveTab(tab);
            }}
          />
        )}

        {activeTab === 'investments' && (
          <InvestmentsView
            investments={investments}
            onInvest={handleOpenInvest}
            onRefresh={fetchInvestments}
          />
        )}

        {activeTab === 'business' && (
          <BusinessFundingView
            investments={investments}
            onInvest={handleOpenInvest}
          />
        )}

        {activeTab === 'community' && (
          <CommunityInvestmentsView
            investments={investments}
            onInvest={handleOpenInvest}
          />
        )}

        {activeTab === 'portfolio' && (
          user ? (
            <MyInvestmentsView
              onNavigate={(tab) => {
                if (tab === 'admin') navigateToAdmin();
                else setActiveTab(tab);
              }}
            />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4">
              <h3 className="text-lg font-bold text-white">Sign In Required</h3>
              <p className="text-xs text-slate-400">Please sign in to view your confirmed investments and portfolio metrics.</p>
              <button
                onClick={() => openAuthModal('login', 'user')}
                className="w-full py-2.5 bg-emerald-500 font-bold text-slate-950 text-xs rounded-xl"
              >
                Sign In Now
              </button>
            </div>
          )
        )}

        {activeTab === 'transactions' && (
          user ? (
            <TransactionsView />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4">
              <h3 className="text-lg font-bold text-white">Sign In Required</h3>
              <p className="text-xs text-slate-400">Please sign in to view your transaction audit history.</p>
              <button
                onClick={() => openAuthModal('login', 'user')}
                className="w-full py-2.5 bg-emerald-500 font-bold text-slate-950 text-xs rounded-xl"
              >
                Sign In Now
              </button>
            </div>
          )
        )}

        {activeTab === 'profile' && (
          user ? (
            <ProfileView />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4">
              <h3 className="text-lg font-bold text-white">Sign In Required</h3>
              <button
                onClick={() => openAuthModal('login', 'user')}
                className="w-full py-2.5 bg-emerald-500 font-bold text-slate-950 text-xs rounded-xl"
              >
                Sign In
              </button>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <Footer onOpenLegal={handleOpenLegal} onGoToAdmin={navigateToAdmin} />

      {/* Global Modals */}
      <AuthModal />

      <InvestModal
        investment={selectedInvestment}
        isOpen={investModalOpen}
        onClose={() => setInvestModalOpen(false)}
        onSuccess={handleInvestmentSuccess}
      />

      <LegalModal
        type={legalModalType}
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
