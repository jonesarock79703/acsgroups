import React, { useState, useEffect } from 'react';
import {
  Shield, Users, DollarSign, Clock, CheckCircle2, XCircle,
  Building, Coins, Plus, Edit2, Trash2, Power, RefreshCw,
  AlertTriangle, Check, X, Eye, Settings, FileText, ArrowRight,
  Package, Tag, Search, Filter, Image as ImageIcon, Sparkles,
  Trophy, Upload, FileCheck, ExternalLink, Gift, Shuffle,
  ArrowDownCircle, Landmark, Smartphone, RotateCcw, QrCode
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const IMAGE_PRESETS = [
  { label: 'Gold Bullion', url: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80' },
  { label: 'Silver Bars', url: 'https://images.unsplash.com/photo-1624365168968-f283a546c1a8?auto=format&fit=crop&w=800&q=80' },
  { label: 'Prime Land', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80' },
  { label: 'Jute Factory', url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80' },
  { label: 'Agri Hydroponics', url: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80' },
  { label: 'Solar Power Grid', url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80' },
  { label: 'Modern Factory', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80' },
  { label: 'Logistics Hub', url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80' }
];

export default function AdminDashboardView({ onInvestmentUpdated, onExitToSite }) {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'draws' | 'withdrawals' | 'payments' | 'businesses' | 'assets' | 'users' | 'settings'
  const [stats, setStats] = useState(null);
  const [payments, setPayments] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [settings, setSettings] = useState({ upiId: '', payeeName: '' });
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState({ text: '', type: '' });

  // Withdrawals State
  const [withdrawals, setWithdrawals] = useState([]);
  const [wdrFilter, setWdrFilter] = useState('all');
  const [wdrSearch, setWdrSearch] = useState('');
  const [wdrApproveModalOpen, setWdrApproveModalOpen] = useState(false);
  const [selectedWdr, setSelectedWdr] = useState(null);
  const [wdrProofFile, setWdrProofFile] = useState(null);
  const [wdrProofPreview, setWdrProofPreview] = useState('');
  const [wdrProofTxnId, setWdrProofTxnId] = useState('');
  const [wdrProofNotes, setWdrProofNotes] = useState('');
  const [wdrApproving, setWdrApproving] = useState(false);
  const [wdrRejectModalOpen, setWdrRejectModalOpen] = useState(false);
  const [wdrRejectReason, setWdrRejectReason] = useState('Bank account details mismatch');
  const [viewProofModalOpen, setViewProofModalOpen] = useState(false);
  const [viewProofData, setViewProofData] = useState(null);

  // Catalog search & filter
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogTypeFilter, setCatalogTypeFilter] = useState('all');

  // --- Quick Edit Price Modal State ---
  const [quickPriceModalOpen, setQuickPriceModalOpen] = useState(false);
  const [quickPriceItem, setQuickPriceItem] = useState(null);
  const [quickPriceValue, setQuickPriceValue] = useState('');

  // --- Add / Edit Product Unified Modal State ---
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '',
    type: 'business', // 'business' | 'community'
    category: 'Jute Business',
    targetAmount: 500000,
    rate: 10,
    minInvestment: 10,
    unitName: 'Lot',
    tenure: '12 Months',
    expectedReturn: '16.5% Annualized',
    riskLevel: 'Moderate',
    image: IMAGE_PRESETS[3].url,
    description: '',
    terms: 'Standard quarterly disbursement terms apply.'
  });

  // --- Lucky Draw Modal State ---
  const [drawModalOpen, setDrawModalOpen] = useState(false);
  const [drawInvestment, setDrawInvestment] = useState(null);
  const [drawInvestors, setDrawInvestors] = useState([]);
  const [drawingAnimation, setDrawingAnimation] = useState(false);

  // --- Upload Payout Proof Modal State (Lucky Draw) ---
  const [proofModalOpen, setProofModalOpen] = useState(false);
  const [proofInvestment, setProofInvestment] = useState(null);
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState('');
  const [proofTxnId, setProofTxnId] = useState('');
  const [proofNotes, setProofNotes] = useState('');
  const [proofUploading, setProofUploading] = useState(false);

  // --- Upload Payment Verification Proof Modal State (Direct User Investments) ---
  const [paymentProofModalOpen, setPaymentProofModalOpen] = useState(false);
  const [selectedPaymentForProof, setSelectedPaymentForProof] = useState(null);
  const [paymentProofFile, setPaymentProofFile] = useState(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState('');
  const [paymentProofNotes, setPaymentProofNotes] = useState('');
  const [paymentProofUploading, setPaymentProofUploading] = useState(false);

  // Rejection modal
  const [rejectModalPayment, setRejectModalPayment] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('Payment not found in bank statement');

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // 1. Stats
      const statsRes = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (statsRes.ok) setStats(await statsRes.json());

      // 2. Payments
      const payRes = await fetch('/api/payments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (payRes.ok) {
        const payData = await payRes.json();
        setPayments(payData.payments || []);
      }

      // 3. Investments
      const invRes = await fetch('/api/investments?status=all');
      if (invRes.ok) {
        const invData = await invRes.json();
        setInvestments(invData.investments || []);
      }

      // 4. Users
      const userRes = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (userRes.ok) {
        const userData = await userRes.json();
        setUsersList(userData.users || []);
      }

      // 5. Settings
      const setRes = await fetch('/api/admin/settings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (setRes.ok) {
        const sData = await setRes.json();
        setSettings(sData.settings || {});
      }

      // 6. Withdrawals
      const wdrRes = await fetch('/api/admin/withdrawals', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (wdrRes.ok) {
        const wData = await wdrRes.json();
        setWithdrawals(wData.withdrawals || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const showToast = (text, type = 'success') => {
    setActionMessage({ text, type });
    setTimeout(() => setActionMessage({ text: '', type: '' }), 4500);
  };

  // --- Quick Edit Price Handler ---
  const handleOpenQuickPrice = (item) => {
    setQuickPriceItem(item);
    setQuickPriceValue(String(item.rate));
    setQuickPriceModalOpen(true);
  };

  const handleSaveQuickPrice = async (e) => {
    e.preventDefault();
    if (!quickPriceItem) return;
    const num = Number(quickPriceValue);
    if (isNaN(num) || num <= 0) {
      showToast('Please enter a valid positive price', 'error');
      return;
    }

    try {
      const res = await fetch(`/api/investments/${quickPriceItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ rate: num })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      showToast(`Price for "${quickPriceItem.title}" updated to ₹${num.toLocaleString('en-IN')}. New rate is live on investor portal!`);
      setQuickPriceModalOpen(false);
      setQuickPriceItem(null);
      fetchData();
      if (onInvestmentUpdated) onInvestmentUpdated();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // --- Add / Edit Product Handlers ---
  const handleOpenAddProduct = (type = 'business') => {
    setEditingProduct(null);
    setProductForm({
      title: '',
      type: type,
      category: type === 'business' ? 'Manufacturing' : 'Gold',
      targetAmount: type === 'business' ? 500000 : 1000000,
      rate: type === 'business' ? 10 : 15000,
      minInvestment: type === 'business' ? 10 : 150,
      unitName: type === 'business' ? 'Lot' : 'Unit',
      tenure: type === 'business' ? '12 Months' : 'Flexible Liquidity',
      expectedReturn: type === 'business' ? '16.5% Annualized' : 'Bullion Spot Appreciation',
      riskLevel: type === 'business' ? 'Moderate' : 'Low',
      image: type === 'business' ? IMAGE_PRESETS[3].url : IMAGE_PRESETS[0].url,
      description: '',
      terms: type === 'business'
        ? 'Quarterly interest disbursement with principal redemption at maturity.'
        : '100% physically backed by audited and insured vaults.'
    });
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (item) => {
    setEditingProduct(item);
    setProductForm({
      title: item.title,
      type: item.type,
      category: item.category,
      targetAmount: item.targetAmount,
      rate: item.rate,
      minInvestment: item.minInvestment,
      unitName: item.unitName || (item.type === 'business' ? 'Lot' : 'Unit'),
      tenure: item.tenure,
      expectedReturn: item.expectedReturn,
      riskLevel: item.riskLevel,
      image: item.image,
      description: item.description,
      terms: item.terms || 'Standard terms apply.'
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.title.trim()) {
      showToast('Product title is required', 'error');
      return;
    }

    try {
      const url = editingProduct ? `/api/investments/${editingProduct.id}` : '/api/investments';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(productForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      showToast(
        editingProduct
          ? `Product "${productForm.title}" updated successfully!`
          : `New product "${productForm.title}" added to the platform!`
      );
      setProductModalOpen(false);
      setEditingProduct(null);
      fetchData();
      if (onInvestmentUpdated) onInvestmentUpdated();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // --- Lucky Draw Handlers ---
  const handleOpenDrawModal = async (inv) => {
    setDrawInvestment(inv);
    setDrawModalOpen(true);
    setDrawingAnimation(false);
    try {
      const res = await fetch(`/api/investments/${inv.id}/investors`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDrawInvestors(data.investors || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExecuteDraw = async () => {
    if (!drawInvestment) return;
    setDrawingAnimation(true);
    try {
      // Simulate suspenseful draw
      await new Promise(r => setTimeout(r, 1200));

      const res = await fetch(`/api/investments/${drawInvestment.id}/draw-winner`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      showToast(`🏆 Random Winner Chosen: ${data.winner.userName} won full pool of ₹${Number(data.winner.amountWon).toLocaleString('en-IN')}!`);
      setDrawModalOpen(false);
      setDrawInvestment(null);
      fetchData();
      if (onInvestmentUpdated) onInvestmentUpdated();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setDrawingAnimation(false);
    }
  };

  // --- Payout Proof Modal Handlers ---
  const handleOpenProofModal = (inv) => {
    setProofInvestment(inv);
    setProofTxnId(inv.winner?.payoutTxnId || `UTR-PAYOUT-${Date.now().toString().slice(-6)}`);
    setProofNotes(inv.winner?.payoutNotes || 'Full target jackpot transferred to verified bank account.');
    setProofPreview(inv.winner?.payoutProofUrl || '');
    setProofFile(null);
    setProofModalOpen(true);
  };

  const handleProofFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProofFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setProofPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSavePayoutProof = async (e) => {
    e.preventDefault();
    if (!proofInvestment) return;
    setProofUploading(true);

    try {
      let finalProofUrl = proofPreview;

      // If local file selected, upload via /api/upload
      if (proofFile) {
        const formData = new FormData();
        formData.append('file', proofFile);
        const upRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        if (upRes.ok) {
          const upData = await upRes.json();
          finalProofUrl = upData.url;
        }
      }

      if (!finalProofUrl && !proofTxnId) {
        showToast('Please provide a proof image or a transaction reference ID', 'error');
        setProofUploading(false);
        return;
      }

      const res = await fetch(`/api/investments/${proofInvestment.id}/winner-payout-proof`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          proofUrl: finalProofUrl,
          txnId: proofTxnId,
          notes: proofNotes
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      showToast(`Payout proof published! Investor portal now displays the verified proof receipt.`);
      setProofModalOpen(false);
      setProofInvestment(null);
      fetchData();
      if (onInvestmentUpdated) onInvestmentUpdated();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setProofUploading(false);
    }
  };

  // Toggle Active/Inactive
  const handleToggleStatus = async (investment) => {
    try {
      const newStatus = investment.status === 'active' ? 'inactive' : 'active';
      const res = await fetch(`/api/investments/${investment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      showToast(`Product status updated to ${newStatus}`);
      fetchData();
      if (onInvestmentUpdated) onInvestmentUpdated();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Delete Investment
  const handleDeleteInvestment = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/investments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      showToast('Product removed successfully');
      fetchData();
      if (onInvestmentUpdated) onInvestmentUpdated();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Payment Verification Actions
  const handleOpenPaymentProofModal = (payment) => {
    setSelectedPaymentForProof(payment);
    setPaymentProofPreview(payment.adminProofUrl || '');
    setPaymentProofNotes(payment.adminNotes || 'Bank receipt verified & approved by Administrator.');
    setPaymentProofFile(null);
    setPaymentProofModalOpen(true);
  };

  const handlePaymentProofFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPaymentProofFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPaymentProofPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSavePaymentProof = async (e) => {
    e.preventDefault();
    if (!selectedPaymentForProof) return;
    setPaymentProofUploading(true);

    try {
      let finalProofUrl = paymentProofPreview;

      if (paymentProofFile) {
        const formData = new FormData();
        formData.append('file', paymentProofFile);
        const upRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        if (upRes.ok) {
          const upData = await upRes.json();
          finalProofUrl = upData.url;
        }
      }

      if (!finalProofUrl) {
        showToast('Please attach or enter a receipt proof image', 'error');
        setPaymentProofUploading(false);
        return;
      }

      // If payment is pending, confirm with proof; if already confirmed, update proof
      const isPending = selectedPaymentForProof.status === 'pending';
      const endpoint = isPending
        ? `/api/payments/${selectedPaymentForProof.id}/confirm`
        : `/api/payments/${selectedPaymentForProof.id}/proof`;

      const payload = isPending
        ? { notes: paymentProofNotes, adminProofUrl: finalProofUrl }
        : { adminNotes: paymentProofNotes, adminProofUrl: finalProofUrl };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      showToast('Payment verification receipt uploaded & visible to investor!');
      setPaymentProofModalOpen(false);
      setSelectedPaymentForProof(null);
      fetchData();
      if (onInvestmentUpdated) onInvestmentUpdated();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setPaymentProofUploading(false);
    }
  };

  const handleConfirmPayment = async (paymentId) => {
    try {
      const res = await fetch(`/api/payments/${paymentId}/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ notes: 'Verified against bank credit ledger' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      showToast(`Payment ${paymentId} confirmed! User portfolio credited and progress updated.`);
      fetchData();
      if (onInvestmentUpdated) onInvestmentUpdated();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleOpenRejectModal = (payment) => {
    setRejectModalPayment(payment);
    setRejectionReason('UTR not reflected in company bank account');
  };

  const handleConfirmReject = async () => {
    if (!rejectModalPayment) return;
    try {
      const res = await fetch(`/api/payments/${rejectModalPayment.id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reason: rejectionReason })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      showToast(`Payment ${rejectModalPayment.id} rejected.`);
      setRejectModalPayment(null);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Save Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      showToast('Platform UPI settings saved.');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const [uploadingQr, setUploadingQr] = useState(false);

  const handleQrImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showToast('QR Image size should be under 10MB.', 'error');
      return;
    }

    setUploadingQr(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        try {
          // Compress and resize image to sharp 480x480 max
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 480;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Get optimized base64
          const optimizedDataUrl = canvas.toDataURL('image/png');

          // Immediately save to server
          const res = await fetch('/api/admin/payment-qr', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ paymentQrUrl: optimizedDataUrl })
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'Failed to save QR code');

          setSettings(prev => ({ ...prev, paymentQrUrl: data.paymentQrUrl || optimizedDataUrl }));
          showToast('Official Payment QR uploaded & saved successfully! Investors can now see it.');
        } catch (err) {
          console.error('QR upload error:', err);
          showToast(err.message || 'Failed to upload QR code', 'error');
        } finally {
          setUploadingQr(false);
        }
      };
      img.onerror = () => {
        setUploadingQr(false);
        showToast('Invalid image file.', 'error');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveQr = async () => {
    try {
      setUploadingQr(true);
      const res = await fetch('/api/admin/payment-qr', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to remove QR');

      setSettings(prev => ({ ...prev, paymentQrUrl: '' }));
      showToast('Custom QR removed. System reverted to auto UPI QR.');
    } catch (err) {
      showToast(err.message || 'Failed to remove QR', 'error');
    } finally {
      setUploadingQr(false);
    }
  };

  const [resettingData, setResettingData] = useState(false);

  const handleResetAllData = async () => {
    if (!window.confirm('⚠️ ARE YOU SURE YOU WANT TO CLEAR ALL DATA?\n\nThis action will:\n• Reset all campaign raised amounts to ₹0\n• Reset all investor counts to 0\n• Clear all payment history and transaction records\n• Purge all user portfolios and holdings\n• Delete all withdrawal requests\n\nUser logins and catalog listings will remain intact.')) {
      return;
    }
    setResettingData(true);
    try {
      const res = await fetch('/api/admin/reset-data', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Reset failed');
      showToast(data.message || 'All platform data has been cleared and reset to 0.');
      fetchAllData();
      if (onInvestmentUpdated) onInvestmentUpdated();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setResettingData(false);
    }
  };

  // --- Withdrawal Handlers ---
  const handleOpenApproveWdrModal = (wdr) => {
    setSelectedWdr(wdr);
    setWdrProofTxnId(`UTR-WDR-${Date.now().toString().slice(-6)}`);
    setWdrProofNotes(`Withdrawal of ₹${Number(wdr.payoutAmount).toLocaleString('en-IN')} disbursed via ${wdr.payoutMethod.toUpperCase()}`);
    setWdrProofPreview('');
    setWdrProofFile(null);
    setWdrApproveModalOpen(true);
  };

  const handleWdrProofFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setWdrProofFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setWdrProofPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmApproveWdr = async (e) => {
    e.preventDefault();
    if (!selectedWdr) return;
    setWdrApproving(true);

    try {
      let finalProofUrl = wdrProofPreview;
      if (wdrProofFile) {
        const formData = new FormData();
        formData.append('file', wdrProofFile);
        const upRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        if (upRes.ok) {
          const upData = await upRes.json();
          finalProofUrl = upData.url;
        }
      }

      const res = await fetch(`/api/admin/withdrawals/${selectedWdr.id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          payoutTxnId: wdrProofTxnId,
          payoutProofUrl: finalProofUrl,
          adminNotes: wdrProofNotes
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      showToast(`Withdrawal ${selectedWdr.id} approved and disbursed! Payout proof uploaded.`);
      setWdrApproveModalOpen(false);
      setSelectedWdr(null);
      fetchData();
      if (onInvestmentUpdated) onInvestmentUpdated();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setWdrApproving(false);
    }
  };

  const handleOpenRejectWdrModal = (wdr) => {
    setSelectedWdr(wdr);
    setWdrRejectReason('Bank account or UPI ID verification failed');
    setWdrRejectModalOpen(true);
  };

  const handleConfirmRejectWdr = async () => {
    if (!selectedWdr) return;
    try {
      const res = await fetch(`/api/admin/withdrawals/${selectedWdr.id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reason: wdrRejectReason })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      showToast(`Withdrawal ${selectedWdr.id} rejected.`);
      setWdrRejectModalOpen(false);
      setSelectedWdr(null);
      fetchData();
      if (onInvestmentUpdated) onInvestmentUpdated();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const pendingPayments = payments.filter(p => p.status === 'pending');
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');
  const fullyFundedCampaigns = investments.filter(
    i => (i.type === 'commodity' || i.type === 'community') &&
         (i.status === 'fully_funded' || (i.raisedAmount && i.raisedAmount >= i.targetAmount))
  );

  const filteredCatalog = investments.filter(item => {
    if (catalogTypeFilter !== 'all') {
      if (catalogTypeFilter === 'commodity') {
        if (item.type !== 'commodity' && item.type !== 'community') return false;
      } else if (item.type !== catalogTypeFilter) {
        return false;
      }
    }
    if (catalogSearch.trim()) {
      const q = catalogSearch.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Alert */}
      {actionMessage.text && (
        <div className={`p-4 rounded-xl border text-xs font-semibold flex items-center justify-between shadow-lg ${
          actionMessage.type === 'error'
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
        }`}>
          <div className="flex items-center gap-2">
            {actionMessage.type === 'error' ? <AlertTriangle className="w-4 h-4 text-rose-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            <span>{actionMessage.text}</span>
          </div>
          <button onClick={() => setActionMessage({ text: '', type: '' })}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Admin Header with Quick Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-7 rounded-3xl glass-panel border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10 shrink-0">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Admin Governance & Operations Control
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5 tracking-tight">
              Platform Master Dashboard
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto relative z-10">
          {/* Quick Add Product Button */}
          <button
            onClick={() => handleOpenAddProduct('business')}
            className="px-5 py-2.5 btn-primary-emerald text-xs font-black flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/25"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add New Product</span>
          </button>

          <button
            onClick={fetchData}
            className="px-4 py-2.5 btn-secondary-glass text-xs font-bold flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {onExitToSite && (
            <button
              onClick={onExitToSite}
              className="px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 cursor-pointer transition border border-slate-700 shadow-md"
            >
              <span>Exit to Investor Site</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          )}
        </div>
      </div>

      {/* 8 Metric Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="p-5 rounded-2xl glass-panel card-hover-glow border-white/10">
            <span className="text-[11px] text-slate-400 font-semibold">Total Products</span>
            <p className="text-2xl font-black text-white mt-1">{stats.totalOpportunities}</p>
            <span className="text-[10px] text-slate-400 font-mono mt-1 block">{stats.activeOpportunities} Active in store</span>
          </div>

          <div className="p-5 rounded-2xl glass-panel card-hover-glow border-emerald-500/30">
            <span className="text-[11px] text-emerald-400 font-semibold">Total Investment</span>
            <p className="text-2xl font-black text-emerald-400 mt-1">₹{stats.totalInvestment.toLocaleString('en-IN')}</p>
            <span className="text-[10px] text-emerald-400 font-mono mt-1 block">{stats.confirmedPaymentsCount} Confirmed</span>
          </div>

          <div className="p-5 rounded-2xl glass-panel-amber card-hover-glow border-amber-500/40">
            <span className="text-[11px] text-amber-300 font-bold">Pending Payments</span>
            <p className="text-2xl font-black text-amber-300 mt-1">{stats.pendingPaymentsCount}</p>
            <span className="text-[10px] text-amber-300 font-mono mt-1 block">₹{stats.pendingPaymentsAmount.toLocaleString('en-IN')} to verify</span>
          </div>

          <div className="p-5 rounded-2xl glass-panel-amber card-hover-glow border-amber-500/40">
            <span className="text-[11px] text-amber-300 font-bold flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              Target Reached Draws
            </span>
            <p className="text-2xl font-black text-amber-400 mt-1">{fullyFundedCampaigns.length}</p>
            <span className="text-[10px] text-amber-300/80 font-mono mt-1 block">Jackpot Pool Eligible</span>
          </div>

          <div className="p-5 rounded-2xl glass-panel card-hover-glow border-white/10">
            <span className="text-[11px] text-slate-400 font-semibold">Business Funding</span>
            <p className="text-2xl font-black text-white mt-1">₹{stats.businessFunding.toLocaleString('en-IN')}</p>
            <span className="text-[10px] text-slate-400 font-mono mt-1 block">Option A Total Raised</span>
          </div>

          <div className="p-5 rounded-2xl glass-panel card-hover-glow border-amber-500/30">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-semibold">Commodity Assets</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-bold">
                🔒 Future Option
              </span>
            </div>
            <p className="text-2xl font-black text-amber-300 mt-1">₹{(stats.commodityFunding || stats.communityFunding || 0).toLocaleString('en-IN')}</p>
            <span className="text-[10px] text-slate-400 font-mono mt-1 block">Option B (Locked Preview)</span>
          </div>

          <div className="p-5 rounded-2xl glass-panel card-hover-glow border-emerald-500/30">
            <span className="text-[11px] text-slate-400 font-semibold">Confirmed Payments</span>
            <p className="text-2xl font-black text-emerald-400 mt-1">{stats.confirmedPaymentsCount}</p>
            <span className="text-[10px] text-emerald-400 font-mono mt-1 block">Bank verified & credited</span>
          </div>

          <div className="p-5 rounded-2xl glass-panel card-hover-glow border-white/10">
            <span className="text-[11px] text-slate-400 font-semibold">Registered Users</span>
            <p className="text-2xl font-black text-white mt-1">{stats.totalUsers}</p>
            <span className="text-[10px] text-slate-400 font-mono mt-1 block">{stats.totalInvestors} Active Investors</span>
          </div>

          <div className="p-5 rounded-2xl glass-panel-amber card-hover-glow border-amber-500/40">
            <span className="text-[11px] text-amber-300 font-bold flex items-center gap-1">
              <ArrowDownCircle className="w-3.5 h-3.5 text-amber-400" />
              Withdrawal Requests
            </span>
            <p className="text-2xl font-black text-amber-400 mt-1">{pendingWithdrawals.length}</p>
            <span className="text-[10px] text-amber-300/80 font-mono mt-1 block">
              {withdrawals.filter(w => w.status === 'approved').length} Disbursed & Paid
            </span>
          </div>
        </div>
      )}

      {/* Main Admin Sub-Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'products'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>📦 Products & Pricing Catalog ({investments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('draws')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'draws'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-900 text-amber-400 hover:text-white border border-amber-500/30'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>🏆 Target Reached & Lucky Draws ({fullyFundedCampaigns.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('withdrawals')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'withdrawals'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-900 text-amber-300 hover:text-white border border-amber-500/30'
          }`}
        >
          <ArrowDownCircle className="w-4 h-4" />
          <span>Withdrawal Requests</span>
          {pendingWithdrawals.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold animate-pulse">
              {pendingWithdrawals.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'payments'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Payment Verification</span>
          {pendingPayments.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
              {pendingPayments.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('businesses')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'businesses'
              ? 'bg-blue-500 text-slate-950 shadow-md shadow-blue-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Business Deals</span>
        </button>

        <button
          onClick={() => setActiveTab('assets')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'assets'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>Bullion & Land Reserves</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-slate-800 text-white'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'bg-slate-800 text-white'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>

      {/* ================= TAB 1: MASTER PRODUCTS & PRICING CATALOG ================= */}
      {activeTab === 'products' && (
        <div className="space-y-5">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-slate-900/90 border border-slate-800 rounded-2xl backdrop-blur-sm">
            <div className="flex-1 flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  placeholder="Search products by title, category, ID..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Type Filter */}
              <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setCatalogTypeFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    catalogTypeFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All ({investments.length})
                </button>
                <button
                  onClick={() => setCatalogTypeFilter('business')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    catalogTypeFilter === 'business' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Businesses
                </button>
                <button
                  onClick={() => setCatalogTypeFilter('commodity')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                    catalogTypeFilter === 'commodity' || catalogTypeFilter === 'community' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Commodities</span>
                  <span className="text-[9px] px-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    🔒 Future Option
                  </span>
                </button>
              </div>
            </div>

            {/* Add Product CTAs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenAddProduct('business')}
                className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add Business</span>
              </button>
              <button
                onClick={() => handleOpenAddProduct('commodity')}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add Commodity Reserve</span>
              </button>
            </div>
          </div>

          {/* Master Products Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                    <th className="py-3 px-4">Product / Investment</th>
                    <th className="py-3 px-4">Type & Category</th>
                    <th className="py-3 px-4 text-emerald-400">Current Price / Rate</th>
                    <th className="py-3 px-4">Target / Raised</th>
                    <th className="py-3 px-4">Min Entry</th>
                    <th className="py-3 px-4">Expected Return</th>
                    <th className="py-3 px-4">Status & Lucky Draw</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredCatalog.map((item) => {
                    const isTargetReached = item.status === 'fully_funded' || (item.raisedAmount && item.raisedAmount >= item.targetAmount);

                    return (
                      <tr key={item.id} className="hover:bg-slate-800/30 transition">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover bg-slate-950 shrink-0 border border-slate-800"
                            />
                            <div>
                              <span className="font-bold text-white text-sm block leading-tight">{item.title}</span>
                              <span className="font-mono text-[10px] text-slate-500">ID: {item.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold block w-fit ${
                            item.type === 'business' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {item.type === 'business' ? 'Business Co-Funding' : 'Commodity Asset'}
                          </span>
                          <span className="text-[11px] text-slate-400 mt-0.5 block">{item.category}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div>
                              <span className="font-black text-white text-base block">
                                ₹{Number(item.rate).toLocaleString('en-IN')}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                per {item.unitName || (item.type === 'business' ? 'Lot' : 'Unit')}
                              </span>
                            </div>
                            <button
                              onClick={() => handleOpenQuickPrice(item)}
                              className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 transition"
                              title="Edit Price"
                            >
                              <Tag className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-white block">
                            ₹{Number(item.raisedAmount).toLocaleString('en-IN')} / ₹{Number(item.targetAmount).toLocaleString('en-IN')}
                          </span>
                          <div className="w-28 h-1.5 bg-slate-950 rounded-full overflow-hidden mt-1 border border-slate-800">
                            <div
                              className={`h-full rounded-full ${isTargetReached ? 'bg-amber-400' : 'bg-emerald-500'}`}
                              style={{ width: `${Math.min(100, item.progressPercentage)}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 mt-0.5 block">{item.progressPercentage}% funded</span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-300">
                          ₹{item.minInvestment}
                        </td>
                        <td className="py-3.5 px-4 text-emerald-400 font-semibold text-xs">
                          {item.expectedReturn}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold block w-fit ${
                              isTargetReached
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : item.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-slate-800 text-slate-400'
                            }`}>
                              {isTargetReached ? 'TARGET REACHED (CLOSED)' : item.status.toUpperCase()}
                            </span>

                            {/* Lucky Draw Button if Target Reached (Commodities Only) */}
                            {isTargetReached && (item.type === 'commodity' || item.type === 'community') && (
                              item.winner ? (
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-500/30">
                                    🏆 {item.winner.userName}
                                  </span>
                                  <button
                                    onClick={() => handleOpenProofModal(item)}
                                    className="p-1 rounded bg-amber-500/20 text-amber-300 hover:text-white"
                                    title="Upload/View Payout Proof"
                                  >
                                    <FileCheck className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleOpenDrawModal(item)}
                                  className="px-2 py-0.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] flex items-center gap-1 shadow-sm transition"
                                >
                                  <Trophy className="w-3 h-3" />
                                  <span>Draw Winner</span>
                                </button>
                              )
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenQuickPrice(item)}
                              className="px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 flex items-center gap-1"
                              title="Quick Edit Price"
                            >
                              <Tag className="w-3 h-3" />
                              <span>Price</span>
                            </button>
                            <button
                              onClick={() => handleOpenEditProduct(item)}
                              className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800"
                              title="Edit Full Details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteInvestment(item.id, item.title)}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: TARGET REACHED & LUCKY DRAWS ================= */}
      {activeTab === 'draws' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Trophy className="w-4 h-4" />
                <span>Commodity Asset Reserves • Full Amount Jackpot Payout</span>
              </div>
              <h2 className="text-xl font-black text-white">
                Commodity Lucky Draw Management & Payout Proofs
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                When a commodity asset reserve campaign reaches 100% of its target funding amount, new investments are closed. Conduct the random draw among confirmed investors to award the full target pool, and upload the bank transfer proof receipt for complete investor transparency. (Business investments do not have draw pools).
              </p>
            </div>
          </div>

          {fullyFundedCampaigns.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-400">
              <Trophy className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <h4 className="font-bold text-white text-sm">No Campaigns Fully Funded Yet</h4>
              <p className="text-xs text-slate-500 mt-1">When an investment reaches 100% target, it will automatically appear here for random winner selection.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {fullyFundedCampaigns.map((camp) => {
                const winner = camp.winner;

                return (
                  <div
                    key={camp.id}
                    className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-4 shadow-xl relative overflow-hidden backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                        {camp.id}
                      </span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950">
                        100% TARGET REACHED
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <img
                        src={camp.image}
                        alt=""
                        className="w-14 h-14 rounded-xl object-cover border border-slate-800 shrink-0"
                      />
                      <div>
                        <h3 className="font-bold text-white text-base leading-tight">{camp.title}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{camp.category} • {camp.investorCount || 0} Investors</p>
                        <p className="text-sm font-black text-amber-300 mt-1">
                          Full Pool Amount: ₹{Number(camp.targetAmount).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    {/* Winner Status Box */}
                    {winner ? (
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-[11px]">Selected Winner:</span>
                          <span className="font-bold text-white text-sm">{winner.userName}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">Winner ID & Contact:</span>
                          <span className="font-mono text-slate-300">{winner.userId} • {winner.userMobile || winner.userEmail}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">Payout Status:</span>
                          <span className={`font-bold ${winner.payoutStatus === 'disbursed' ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {winner.payoutStatus === 'disbursed' ? '✓ Disbursed & Proof Uploaded' : '⏳ Pending Bank Transfer'}
                          </span>
                        </div>
                        {winner.payoutTxnId && (
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-400">Transfer UTR:</span>
                            <span className="font-mono text-amber-300 font-bold">{winner.payoutTxnId}</span>
                          </div>
                        )}

                        <div className="pt-2 border-t border-slate-800 flex gap-2">
                          <button
                            onClick={() => handleOpenProofModal(camp)}
                            className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>{winner.payoutProofUrl ? 'Update / View Payout Proof' : 'Upload Payout Proof'}</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-slate-950 border border-dashed border-amber-500/30 text-center space-y-3">
                        <Trophy className="w-8 h-8 text-amber-400 mx-auto animate-bounce" />
                        <div>
                          <p className="font-bold text-white text-xs">Ready for Lucky Winner Draw</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Target funding completed. Choose a random investor from the participant pool to receive ₹{Number(camp.targetAmount).toLocaleString('en-IN')}.
                          </p>
                        </div>
                        <button
                          onClick={() => handleOpenDrawModal(camp)}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20"
                        >
                          <Shuffle className="w-4 h-4" />
                          <span>Draw Random Winner Now</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB: WITHDRAWAL REQUESTS ================= */}
      {activeTab === 'withdrawals' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-0.5">
                <ArrowDownCircle className="w-4 h-4" />
                <span>Investor Liquidity & Tenure Redemptions</span>
              </div>
              <h2 className="text-lg font-bold text-white">Withdrawal Requests Center</h2>
              <p className="text-xs text-slate-400">
                Review investor capital and return withdrawal requests after tenure completion or flexible redemption. Approve with bank transfer UTR and receipt proof, or reject with reason.
              </p>
            </div>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 w-fit">
              {pendingWithdrawals.length} Pending Approval
            </span>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl">
            <div className="flex items-center gap-2">
              <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setWdrFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    wdrFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All ({withdrawals.length})
                </button>
                <button
                  onClick={() => setWdrFilter('pending')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                    wdrFilter === 'pending' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-amber-400 hover:text-white'
                  }`}
                >
                  <span>Pending</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-950/40">{pendingWithdrawals.length}</span>
                </button>
                <button
                  onClick={() => setWdrFilter('approved')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    wdrFilter === 'approved' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Approved ({withdrawals.filter(w => w.status === 'approved').length})
                </button>
                <button
                  onClick={() => setWdrFilter('rejected')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    wdrFilter === 'rejected' ? 'bg-rose-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Rejected ({withdrawals.filter(w => w.status === 'rejected').length})
                </button>
              </div>
            </div>

            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={wdrSearch}
                onChange={(e) => setWdrSearch(e.target.value)}
                placeholder="Search by name, email, ID, or opportunity..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Requests Table */}
          {withdrawals.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400">
              <ArrowDownCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">No Withdrawal Requests Found</p>
              <p className="text-xs text-slate-500 mt-1">When investors submit withdrawal requests from their portfolio, they will appear here for admin review.</p>
            </div>
          ) : (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                      <th className="py-3 px-4">Request ID & Date</th>
                      <th className="py-3 px-4">Investor</th>
                      <th className="py-3 px-4">Opportunity & Tenure</th>
                      <th className="py-3 px-4">Principal vs Payout</th>
                      <th className="py-3 px-4">Payout Destination</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {withdrawals
                      .filter(w => {
                        if (wdrFilter !== 'all' && w.status !== wdrFilter) return false;
                        if (wdrSearch.trim()) {
                          const q = wdrSearch.toLowerCase();
                          return (
                            w.id.toLowerCase().includes(q) ||
                            w.userName.toLowerCase().includes(q) ||
                            w.userEmail.toLowerCase().includes(q) ||
                            w.investmentTitle.toLowerCase().includes(q) ||
                            w.userId.toLowerCase().includes(q)
                          );
                        }
                        return true;
                      })
                      .map((wdr) => (
                        <tr key={wdr.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-3.5 px-4">
                            <span className="font-mono font-bold text-amber-300 block">{wdr.id}</span>
                            <span className="text-[10px] text-slate-500">
                              {new Date(wdr.requestedAt).toLocaleDateString()} {new Date(wdr.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-white block">{wdr.userName}</span>
                            <span className="text-[10px] font-mono text-slate-400 block">{wdr.userId} • {wdr.userEmail}</span>
                            {wdr.userMobile && <span className="text-[10px] text-slate-500 block">{wdr.userMobile}</span>}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-white block">{wdr.investmentTitle}</span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <span className="capitalize">{wdr.investmentType}</span> • ⏱ {wdr.tenure || 'Flexible'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-slate-400 text-[11px] block">Capital: ₹{Number(wdr.amountInvested).toLocaleString('en-IN')}</span>
                            <span className="text-sm font-black text-amber-300 block">
                              Payout: ₹{Number(wdr.payoutAmount).toLocaleString('en-IN')}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            {wdr.payoutMethod === 'upi' ? (
                              <div className="flex items-start gap-1.5">
                                <Smartphone className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                <div>
                                  <span className="text-[10px] font-bold text-amber-400 uppercase">UPI VPA</span>
                                  <p className="font-mono text-white font-semibold text-[11px]">{wdr.bankDetails?.upiId}</p>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-start gap-1.5">
                                <Landmark className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                                <div>
                                  <span className="text-[10px] font-bold text-blue-400">{wdr.bankDetails?.bankName || 'Bank Transfer'}</span>
                                  <p className="font-mono text-white text-[11px]">A/C: {wdr.bankDetails?.accountNumber}</p>
                                  <p className="font-mono text-slate-400 text-[10px]">IFSC: {wdr.bankDetails?.ifsc} ({wdr.bankDetails?.accountHolder})</p>
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            {wdr.status === 'approved' ? (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] flex items-center gap-1 w-fit">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Disbursed & Paid
                              </span>
                            ) : wdr.status === 'pending' ? (
                              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] flex items-center gap-1 w-fit animate-pulse">
                                <Clock className="w-3.5 h-3.5" />
                                Pending Review
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 font-bold text-[10px] flex items-center gap-1 w-fit">
                                <XCircle className="w-3.5 h-3.5" />
                                Rejected
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {wdr.status === 'pending' ? (
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleOpenApproveWdrModal(wdr)}
                                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 flex items-center gap-1"
                                >
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  <span>Approve & Payout</span>
                                </button>
                                <button
                                  onClick={() => handleOpenRejectWdrModal(wdr)}
                                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 text-xs font-semibold border border-slate-700"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : wdr.status === 'approved' ? (
                              <div className="space-y-1">
                                <span className="font-mono text-[10px] text-amber-400 block font-bold">{wdr.payoutTxnId}</span>
                                {wdr.payoutProofUrl ? (
                                  <button
                                    onClick={() => {
                                      setViewProofData({
                                        title: `Withdrawal Payout Receipt - ${wdr.id}`,
                                        url: wdr.payoutProofUrl,
                                        txnId: wdr.payoutTxnId,
                                        notes: wdr.adminNotes,
                                        amount: wdr.payoutAmount,
                                        user: wdr.userName
                                      });
                                      setViewProofModalOpen(true);
                                    }}
                                    className="text-[11px] text-emerald-400 hover:underline font-semibold flex items-center justify-center gap-1 mx-auto"
                                  >
                                    <FileCheck className="w-3 h-3" />
                                    <span>View Receipt</span>
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-slate-500 italic">Disbursed</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-[10px] text-rose-400 italic">Reason: {wdr.rejectionReason}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: PAYMENT VERIFICATION ================= */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Payment Verification Center</h2>
              <p className="text-xs text-slate-400">
                Confirming a payment automatically credits the user portfolio, updates investment progress, and increments the investor count.
              </p>
            </div>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
              {pendingPayments.length} Pending Actions
            </span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                    <th className="py-3 px-4">Investor</th>
                    <th className="py-3 px-4">Investment Opportunity</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Allocated Lots/Units</th>
                    <th className="py-3 px-4">Transaction UTR</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Verification Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {payments.map((p) => (
                    <tr key={p.id} className={`hover:bg-slate-800/40 ${p.status === 'pending' ? 'bg-amber-950/10' : ''}`}>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-white block">{p.userName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{p.userEmail} ({p.userId})</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-white block">{p.investmentTitle}</span>
                        <span className={`text-[10px] font-semibold ${p.investmentType === 'business' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {p.investmentType === 'business' ? 'Business Funding' : 'Commodity Asset'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-black text-white text-sm">
                        ₹{p.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {p.lots} {p.investmentType === 'business' ? 'Lots' : 'Units'}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-300 text-xs">
                        {p.transactionId}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {p.paymentDate}
                      </td>
                      <td className="py-3.5 px-4">
                        {p.status === 'confirmed' ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold text-[10px] flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3" /> Confirmed
                          </span>
                        ) : p.status === 'rejected' ? (
                          <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 font-semibold text-[10px] flex items-center gap-1 w-fit">
                            <XCircle className="w-3 h-3" /> Rejected
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[10px] flex items-center gap-1 w-fit animate-pulse">
                            <Clock className="w-3 h-3" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {p.status === 'pending' ? (
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            <button
                              onClick={() => handleOpenPaymentProofModal(p)}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] transition shadow-md shadow-amber-500/20 flex items-center gap-1"
                              title="Upload proof receipt and confirm payment"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>Upload Proof</span>
                            </button>
                            <button
                              onClick={() => handleConfirmPayment(p.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] transition shadow-md shadow-emerald-500/20 flex items-center gap-1"
                              title="Quick confirm without proof"
                            >
                              <Check className="w-3.5 h-3.5" />
                              CONFIRM
                            </button>
                            <button
                              onClick={() => handleOpenRejectModal(p)}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 font-bold text-[11px] transition border border-rose-500/40 flex items-center gap-1"
                              title="Reject payment and provide reason"
                            >
                              <X className="w-3.5 h-3.5" />
                              REJECT
                            </button>
                          </div>
                        ) : p.status === 'confirmed' ? (
                          <div className="flex items-center justify-center gap-2">
                            {p.adminProofUrl ? (
                              <a
                                href={p.adminProofUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold flex items-center gap-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Proof Attached</span>
                              </a>
                            ) : null}
                            <button
                              onClick={() => handleOpenPaymentProofModal(p)}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-[10px] font-semibold flex items-center gap-1"
                              title="Upload or update bank transfer proof"
                            >
                              <Upload className="w-3 h-3" />
                              <span>{p.adminProofUrl ? 'Update Proof' : 'Upload Proof'}</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500">
                            Rejected: {p.rejectionReason}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: BUSINESS DEALS ================= */}
      {activeTab === 'businesses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Business Investment Campaigns</h2>
              <p className="text-xs text-slate-400">Co-funding deals raising capital from retail investors.</p>
            </div>
            <button
              onClick={() => handleOpenAddProduct('business')}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Business</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {investments.filter(i => i.type === 'business').map((item) => (
              <div key={item.id} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                    {item.id}
                  </span>
                  <button
                    onClick={() => handleToggleStatus(item)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      item.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.status.toUpperCase()}
                  </button>
                </div>

                <div>
                  <h3 className="font-bold text-white text-sm">{item.title}</h3>
                  <span className="text-xs text-emerald-400 font-medium">{item.category}</span>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500">Price / Lot</span>
                    <p className="font-bold text-emerald-400 text-sm">₹{item.rate} / lot</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Target</span>
                    <p className="font-bold text-white">₹{item.targetAmount.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Raised</span>
                    <p className="font-bold text-white">₹{item.raisedAmount.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Progress</span>
                    <p className="font-bold text-teal-300">{item.progressPercentage}%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => handleOpenQuickPrice(item)}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center justify-center gap-1"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>Edit Price (₹{item.rate})</span>
                  </button>
                  <button
                    onClick={() => handleOpenEditProduct(item)}
                    className="p-1.5 text-slate-400 hover:text-white bg-slate-950 rounded-lg border border-slate-800"
                    title="Edit Full Details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteInvestment(item.id, item.title)}
                    className="p-1.5 text-rose-400 hover:text-rose-300 bg-slate-950 rounded-lg border border-slate-800"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 5: COMMODITY & BULLION RESERVES ================= */}
      {activeTab === 'assets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Commodity & Bullion Asset Reserves</h2>
              <p className="text-xs text-slate-400">Admin controls the live spot rate for Gold, Silver, Land, etc. Changes instantly reprice active investor portfolios.</p>
            </div>
            <button
              onClick={() => handleOpenAddProduct('commodity')}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Commodity Reserve</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {investments.filter(i => i.type === 'commodity' || i.type === 'community').map((asset) => (
              <div key={asset.id} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                    {asset.id}
                  </span>
                  <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                    {asset.category}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-sm">{asset.title}</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xs text-slate-400">Spot Rate / Price:</span>
                    <span className="text-lg font-black text-amber-300">
                      ₹{asset.rate.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400">/{asset.unitName || 'unit'}</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500">Target</span>
                    <p className="font-bold text-white">₹{asset.targetAmount.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Raised</span>
                    <p className="font-bold text-emerald-400">
                      ₹{asset.raisedAmount.toLocaleString('en-IN')} ({asset.progressPercentage}%)
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => handleOpenQuickPrice(asset)}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center justify-center gap-1"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>Edit Price (₹{asset.rate.toLocaleString('en-IN')})</span>
                  </button>
                  <button
                    onClick={() => handleOpenEditProduct(asset)}
                    className="p-1.5 text-slate-400 hover:text-white bg-slate-950 rounded-lg border border-slate-800"
                    title="Edit Full Details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteInvestment(asset.id, asset.title)}
                    className="p-1.5 text-rose-400 hover:text-rose-300 bg-slate-950 rounded-lg border border-slate-800"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 6: USERS MANAGEMENT ================= */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Registered Users & Portfolios</h2>
              <p className="text-xs text-slate-400">Audit investor accounts, confirmed capital, and pending submissions.</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">{usersList.length} Accounts</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                    <th className="py-3 px-4">User ID</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Mobile</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Total Invested</th>
                    <th className="py-3 px-4">Confirmed Holdings</th>
                    <th className="py-3 px-4">Pending Submissions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/30">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-300">{u.id}</td>
                      <td className="py-3.5 px-4 font-semibold text-white">{u.name}</td>
                      <td className="py-3.5 px-4 text-slate-400">{u.email}</td>
                      <td className="py-3.5 px-4 text-slate-400">{u.mobile}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          u.role === 'admin' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-400">
                        ₹{(u.totalInvested || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 font-mono">{u.investmentsCount || 0}</td>
                      <td className="py-3.5 px-4 font-mono text-amber-400">{u.pendingPaymentsCount || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 7: PLATFORM SETTINGS ================= */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 backdrop-blur-sm">
          <div>
            <h2 className="text-lg font-bold text-white">Platform Payment Details Settings</h2>
            <p className="text-xs text-slate-400">
              Configure the company UPI ID, Payee Name, and Bank Account details shown to investors when making payment.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5" />
                <span>UPI Payment Configuration</span>
              </h3>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Company Admin UPI ID (VPA)
                </label>
                <input
                  type="text"
                  required
                  value={settings.upiId || ''}
                  onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                  placeholder="growcapital@icici"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Payee Legal Name
                </label>
                <input
                  type="text"
                  required
                  value={settings.payeeName || ''}
                  onChange={(e) => setSettings({ ...settings, payeeName: e.target.value })}
                  placeholder="ACS Groups Ltd"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5" />
                <span>Company Bank Account Details</span>
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={settings.companyBankName || ''}
                    onChange={(e) => setSettings({ ...settings, companyBankName: e.target.value })}
                    placeholder="HDFC Bank Ltd"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    value={settings.companyIfsc || ''}
                    onChange={(e) => setSettings({ ...settings, companyIfsc: e.target.value })}
                    placeholder="HDFC0001234"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  value={settings.companyAccountNumber || ''}
                  onChange={(e) => setSettings({ ...settings, companyAccountNumber: e.target.value })}
                  placeholder="50200088991122"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Official Payment QR Code Section */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Official Payment QR Code</span>
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono font-bold">
                  Investor Facing
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                {/* QR Preview Box */}
                <div className="w-44 h-44 bg-white p-2.5 rounded-2xl shadow-xl flex flex-col items-center justify-center shrink-0 border-2 border-slate-700 relative overflow-hidden group">
                  {uploadingQr ? (
                    <div className="text-center p-3">
                      <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <span className="text-[11px] font-bold text-slate-800 block">Uploading & Saving...</span>
                      <span className="text-[9px] text-slate-500">Publishing for investors</span>
                    </div>
                  ) : settings.paymentQrUrl ? (
                    <>
                      <img
                        src={settings.paymentQrUrl}
                        alt="Company Payment QR"
                        className="w-full h-full object-contain rounded-xl"
                      />
                      <span className="absolute bottom-1.5 px-2 py-0.5 rounded-full bg-emerald-600/90 text-white font-bold text-[9px] tracking-wide shadow">
                        ✓ Active Custom QR
                      </span>
                    </>
                  ) : (
                    <div className="text-center text-slate-500 text-xs p-2">
                      <QrCode className="w-12 h-12 mx-auto text-slate-400 mb-1" />
                      <span className="font-bold text-slate-800 block">Auto UPI QR</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Generates from UPI ID</span>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold text-[9px]">
                        Default Active
                      </span>
                    </div>
                  )}
                </div>

                {/* Upload & Controls */}
                <div className="space-y-3 flex-1 w-full text-xs">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>Upload Custom Payment QR Image (PhonePe / GPay / Paytm / Bank QR)</span>
                      <span className="text-[10px] text-amber-400 font-normal">Auto-saves on select</span>
                    </label>
                    <label className={`flex items-center justify-center gap-2 p-3.5 border-2 border-dashed ${uploadingQr ? 'opacity-50 pointer-events-none' : 'border-slate-700 hover:border-amber-500/60 cursor-pointer'} rounded-xl bg-slate-950 transition text-slate-300 hover:text-white`}>
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span className="font-semibold">
                        {uploadingQr ? 'Uploading & Optimizing QR...' : settings.paymentQrUrl ? 'Replace Custom QR Image' : 'Select QR Image to Upload (PNG/JPG)'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingQr}
                        onChange={handleQrImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {settings.paymentQrUrl && (
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        disabled={uploadingQr}
                        onClick={handleRemoveQr}
                        className="text-[11px] text-rose-400 hover:text-rose-300 underline cursor-pointer disabled:opacity-50"
                      >
                        Remove custom QR (Revert to auto-generated UPI QR)
                      </button>
                    </div>
                  )}

                  <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1">
                    <p className="font-bold text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Live Investor Display:</span>
                    </p>
                    <p className="leading-relaxed text-slate-400">
                      When investors click <strong>"Invest Now"</strong> or <strong>"Buy Lots"</strong>, this exact QR code is prominently displayed in <strong>Step 1</strong> for them to scan using PhonePe, Google Pay, Paytm, or any UPI app.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="py-2.5 px-5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20"
            >
              Save Payment Settings
            </button>
          </form>

          {/* Danger Zone: Reset All Platform Data */}
          <div className="mt-8 p-6 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Danger Zone: Reset Platform Data to 0</span>
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Clears all payment submissions, empties user investment portfolios, resets all business & commodity campaign raised amounts to ₹0 (0 investors), and purges all withdrawal requests. User accounts and login credentials remain safe.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetAllData}
              disabled={resettingData}
              className="px-5 py-2.5 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40 text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{resettingData ? 'Resetting All Data to 0...' : 'Clear All Amounts & Payment History (Reset to 0)'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL 1: QUICK EDIT PRICE ================= */}
      {quickPriceModalOpen && quickPriceItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <Tag className="w-5 h-5" />
                <h3 className="font-bold text-sm text-white">Edit Product Price</h3>
              </div>
              <button onClick={() => setQuickPriceModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Product</span>
              <p className="font-bold text-white text-sm mt-0.5">{quickPriceItem.title}</p>
              <span className="text-xs text-slate-400">
                Current: <strong className="text-emerald-400">₹{Number(quickPriceItem.rate).toLocaleString('en-IN')}</strong> per {quickPriceItem.unitName || 'unit'}
              </span>
            </div>

            <form onSubmit={handleSaveQuickPrice} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Enter New Price / Rate (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base">₹</span>
                  <input
                    type="number"
                    step="any"
                    required
                    autoFocus
                    value={quickPriceValue}
                    onChange={(e) => setQuickPriceValue(e.target.value)}
                    placeholder="Enter new price"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-white font-black text-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Quick Preset Adjusters */}
              <div className="flex flex-wrap gap-1.5">
                {[10, 50, 100, 500, 1000, 5000].map(addVal => (
                  <button
                    key={addVal}
                    type="button"
                    onClick={() => setQuickPriceValue(String((Number(quickPriceValue) || 0) + addVal))}
                    className="px-2 py-1 rounded bg-slate-950 border border-slate-800 hover:bg-slate-800 text-[10px] text-slate-300 font-semibold"
                  >
                    +₹{addVal}
                  </button>
                ))}
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                ⚡ Updating this price takes effect <strong>immediately</strong> across the investor marketplace and re-evaluates active portfolios holding this product.
              </p>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setQuickPriceModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20"
                >
                  Save New Price
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: ADD / EDIT PRODUCT FULL ================= */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">
                    {editingProduct ? `Edit Product: ${editingProduct.title}` : 'Add New Investment Product'}
                  </h3>
                  <p className="text-xs text-slate-400">Fill in the product details, pricing, and campaign terms.</p>
                </div>
              </div>
              <button onClick={() => setProductModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>
            </div>

            {/* Type Switcher */}
            {!editingProduct && (
              <div className="grid grid-cols-2 gap-3 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setProductForm({
                    ...productForm,
                    type: 'business',
                    category: 'Manufacturing',
                    rate: 10,
                    unitName: 'Lot',
                    image: IMAGE_PRESETS[3].url
                  })}
                  className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-2 transition ${
                    productForm.type === 'business'
                      ? 'bg-emerald-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span>Option A: Business Co-Funding</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProductForm({
                    ...productForm,
                    type: 'commodity',
                    category: 'Gold',
                    rate: 15000,
                    unitName: 'Unit',
                    image: IMAGE_PRESETS[0].url
                  })}
                  className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-2 transition ${
                    productForm.type === 'commodity' || productForm.type === 'community'
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Coins className="w-4 h-4" />
                  <span>Option B: Commodity / Asset Reserve</span>
                </button>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-300 mb-1">
                    Product Title / Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    placeholder={productForm.type === 'business' ? 'e.g. Paramount Textiles & Weaving' : 'e.g. 24K Swiss Physical Gold Vault'}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    placeholder="e.g. Jute, AgriTech, Gold, Silver, Land..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>

                {/* PRODUCT PRICE / RATE */}
                <div className="bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-500/30">
                  <label className="block font-bold text-emerald-400 mb-1">
                    ⚡ Product Price / Rate (₹) <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      step="any"
                      required
                      value={productForm.rate}
                      onChange={(e) => setProductForm({ ...productForm, rate: Number(e.target.value) })}
                      placeholder="e.g. 10 or 15000"
                      className="w-full bg-slate-950 border border-emerald-500/50 rounded-lg pl-7 pr-3 py-1.5 text-white font-black text-sm"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {productForm.type === 'business' ? 'Standard ₹10/lot or custom lot rate' : 'Current live spot valuation rate'}
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Unit Display Name</label>
                  <input
                    type="text"
                    required
                    value={productForm.unitName}
                    onChange={(e) => setProductForm({ ...productForm, unitName: e.target.value })}
                    placeholder="Lot, Unit, Gram, Sq. Yard..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Total Target Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={productForm.targetAmount}
                    onChange={(e) => setProductForm({ ...productForm, targetAmount: Number(e.target.value) })}
                    placeholder="500000"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Minimum Investment (₹)</label>
                  <input
                    type="number"
                    required
                    value={productForm.minInvestment}
                    onChange={(e) => setProductForm({ ...productForm, minInvestment: Number(e.target.value) })}
                    placeholder="10"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Tenure / Period</label>
                  <input
                    type="text"
                    required
                    value={productForm.tenure}
                    onChange={(e) => setProductForm({ ...productForm, tenure: e.target.value })}
                    placeholder="12 Months, Flexible Liquidity..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Expected Return / Yield</label>
                  <input
                    type="text"
                    required
                    value={productForm.expectedReturn}
                    onChange={(e) => setProductForm({ ...productForm, expectedReturn: e.target.value })}
                    placeholder="16.5% Annualized"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Risk Profile</label>
                  <select
                    value={productForm.riskLevel}
                    onChange={(e) => setProductForm({ ...productForm, riskLevel: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                  >
                    <option value="Low">Low Risk</option>
                    <option value="Moderate">Moderate Risk</option>
                    <option value="High">High Risk</option>
                  </select>
                </div>

                {/* Image URL & Quick Presets */}
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-300">Product Image URL</label>
                    <span className="text-[10px] text-slate-500">Pick a preset or paste custom URL:</span>
                  </div>
                  <input
                    type="url"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                  />
                  {/* Preset chips */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {IMAGE_PRESETS.map(p => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => setProductForm({ ...productForm, image: p.url })}
                        className={`text-[10px] px-2 py-0.5 rounded border transition ${
                          productForm.image === p.url
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-300 mb-1">Product Description</label>
                  <textarea
                    rows={2}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Brief description of business operations, factory setup, or bullion vault custody..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20"
                >
                  {editingProduct ? 'Update Product' : 'Add Product to Platform'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: CONDUCT LUCKY DRAW ================= */}
      {drawModalOpen && drawInvestment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-amber-500/50 rounded-3xl shadow-2xl p-6 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400">
                <Trophy className="w-6 h-6 stroke-[2.5]" />
                <div>
                  <h3 className="font-bold text-base text-white">Target Reached • Lucky Winner Draw</h3>
                  <p className="text-xs text-slate-400">{drawInvestment.title}</p>
                </div>
              </div>
              <button onClick={() => setDrawModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 border border-amber-500/30 text-center space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Total Winner Prize Pool</span>
              <p className="text-3xl font-black text-amber-300">
                ₹{Number(drawInvestment.targetAmount).toLocaleString('en-IN')}
              </p>
              <span className="text-[11px] text-slate-300 block">
                100% of the target amount will be awarded to 1 randomly chosen investor
              </span>
            </div>

            {/* Eligible Participants List */}
            <div>
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-400" />
                  Eligible Unique Investors ({drawInvestors.length})
                </span>
                <span className="text-[11px] text-amber-400 font-semibold">
                  Aggregated draw pool (1 entry per user)
                </span>
              </div>

              <div className="max-h-52 overflow-y-auto space-y-1.5 bg-slate-950 p-2.5 rounded-xl border border-slate-800 divide-y divide-slate-800/40">
                {drawInvestors.length === 0 ? (
                  <p className="p-4 text-center text-slate-500 text-xs">Loading confirmed participants...</p>
                ) : (
                  drawInvestors.map((investor, idx) => (
                    <div key={investor.userId || idx} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                      <div className="flex items-start gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold shrink-0 mt-0.5">
                          #{idx + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white">{investor.name}</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-semibold">
                              {investor.investmentCount > 1 ? `${investor.investmentCount} Purchases (${investor.investmentCount} Draw Tickets)` : '1 Purchase'}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 block">
                            User ID: <strong className="text-amber-400">{investor.userId}</strong> • {investor.email}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-emerald-400">
                          ₹{(investor.totalInvested || 0).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          {(investor.totalLots || 0).toLocaleString()} {drawInvestment.unitName || 'lots'} aggregate
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 italic">
                * Repeat buyers appear only once with aggregated total amounts. Their winning chance is proportionally weighted by their purchases ({drawInvestors.reduce((acc, u) => acc + (u.investmentCount || 1), 0)} total tickets in pool).
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDrawModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={drawingAnimation || drawInvestors.length === 0}
                onClick={handleExecuteDraw}
                className="flex-2 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition"
              >
                {drawingAnimation ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Drawing Winner Randomly...</span>
                  </>
                ) : (
                  <>
                    <Shuffle className="w-4 h-4" />
                    <span>Pick Random Winner Now!</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: UPLOAD PAYOUT PROOF ================= */}
      {proofModalOpen && proofInvestment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400">
                <FileCheck className="w-6 h-6 stroke-[2.5]" />
                <div>
                  <h3 className="font-bold text-base text-white">Upload Payout Proof</h3>
                  <p className="text-xs text-slate-400">
                    Winner: {proofInvestment.winner?.userName} (₹{Number(proofInvestment.winner?.amountWon).toLocaleString('en-IN')})
                  </p>
                </div>
              </div>
              <button onClick={() => setProofModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>
            </div>

            <form onSubmit={handleSavePayoutProof} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Bank Transfer / IMPS / NEFT Reference (UTR) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={proofTxnId}
                  onChange={(e) => setProofTxnId(e.target.value)}
                  placeholder="e.g. UTR198273645019"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Upload Proof File */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Bank Transfer Screenshot / Receipt Image <span className="text-rose-400">*</span>
                </label>
                <div className="border-2 border-dashed border-slate-700 hover:border-amber-500/50 rounded-2xl p-4 text-center bg-slate-950/60 relative cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProofFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {proofPreview ? (
                    <div className="space-y-2">
                      <img
                        src={proofPreview}
                        alt="Proof preview"
                        className="max-h-48 mx-auto rounded-xl border border-slate-800 object-contain"
                      />
                      <p className="text-emerald-400 font-semibold text-[11px] flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Screenshot attached. Click to change.</span>
                      </p>
                    </div>
                  ) : (
                    <div className="py-4 space-y-1.5 text-slate-400">
                      <Upload className="w-8 h-8 mx-auto text-amber-400" />
                      <p className="font-semibold text-white">Click or drag & drop bank transfer receipt</p>
                      <p className="text-[10px] text-slate-500">Supports PNG, JPG, JPEG (Max 10MB)</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Payout Remarks / Bank Account Note
                </label>
                <textarea
                  rows={2}
                  value={proofNotes}
                  onChange={(e) => setProofNotes(e.target.value)}
                  placeholder="e.g. Full target pool ₹5,00,000 disbursed to HDFC Bank A/c ending 4821"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-300 leading-relaxed">
                📢 Once submitted, this transfer receipt proof will be published publicly on the investment card so all investors can verify transparency.
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setProofModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={proofUploading}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1"
                >
                  {proofUploading ? 'Uploading...' : 'Publish Payout Proof'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 5: REJECTION REASON ================= */}
      {rejectModalPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-rose-400">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold text-sm text-white">Reject Payment Submission</h3>
              </div>
              <button onClick={() => setRejectModalPayment(null)}>
                <X className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Rejecting payment of <strong>₹{rejectModalPayment.amount.toLocaleString('en-IN')}</strong> from <strong>{rejectModalPayment.userName}</strong> (UTR: {rejectModalPayment.transactionId}).
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Reason for Rejection (User will see this):
              </label>
              <textarea
                rows={3}
                required
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. UTR reference not found in bank ledger, invalid amount..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalPayment(null)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="flex-1 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 text-xs font-bold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 6: PAYMENT PROOF UPLOAD FOR INVESTOR ================= */}
      {paymentProofModalOpen && selectedPaymentForProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-7 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Upload Payment Verification Proof</h3>
                  <p className="text-xs text-slate-400">Proof receipt will be visible to investor in their portfolio</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setPaymentProofModalOpen(false);
                  setSelectedPaymentForProof(null);
                }}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Investor:</span>
                <span className="font-bold text-white">{selectedPaymentForProof.userName} ({selectedPaymentForProof.userEmail})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Opportunity:</span>
                <span className="font-semibold text-white">{selectedPaymentForProof.investmentTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount & Lots:</span>
                <span className="font-bold text-emerald-400">₹{selectedPaymentForProof.amount.toLocaleString('en-IN')} ({selectedPaymentForProof.lots} Lots/Units)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Transaction ID (UTR):</span>
                <span className="font-mono text-amber-300 font-bold">{selectedPaymentForProof.transactionId}</span>
              </div>
            </div>

            <form onSubmit={handleSavePaymentProof} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Bank Transfer Screenshot / Credit Slip Image <span className="text-rose-400">*</span>
                </label>
                <div className="border-2 border-dashed border-slate-700 hover:border-amber-500/50 rounded-2xl p-4 text-center bg-slate-950/60 relative cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePaymentProofFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {paymentProofPreview ? (
                    <div className="space-y-2">
                      <img
                        src={paymentProofPreview}
                        alt="Proof preview"
                        className="max-h-48 mx-auto rounded-xl border border-slate-800 object-contain"
                      />
                      <p className="text-emerald-400 font-semibold text-[11px] flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Receipt attached. Click to change file.</span>
                      </p>
                    </div>
                  ) : (
                    <div className="py-4 space-y-1.5 text-slate-400">
                      <Upload className="w-8 h-8 mx-auto text-amber-400" />
                      <p className="font-semibold text-white">Click or drag & drop bank transfer receipt</p>
                      <p className="text-[10px] text-slate-500">Supports PNG, JPG, JPEG (Max 10MB)</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Or Direct Image URL
                </label>
                <input
                  type="url"
                  value={paymentProofPreview}
                  onChange={(e) => setPaymentProofPreview(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Verification Remarks / Bank Note
                </label>
                <textarea
                  rows={2}
                  value={paymentProofNotes}
                  onChange={(e) => setPaymentProofNotes(e.target.value)}
                  placeholder="e.g. Bank IMPS reference confirmed, funds received in ICICI account."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-300 leading-relaxed">
                📢 When published, this proof receipt will immediately show in the investor's <strong>"My Investments"</strong> and <strong>"Transactions"</strong> portals with a verified badge.
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentProofModalOpen(false);
                    setSelectedPaymentForProof(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={paymentProofUploading}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1"
                >
                  {paymentProofUploading ? 'Uploading...' : 'Save & Make Visible to Investor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 7: APPROVE WITHDRAWAL & UPLOAD PAYOUT PROOF ================= */}
      {wdrApproveModalOpen && selectedWdr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-amber-500/50 rounded-3xl shadow-2xl p-6 sm:p-7 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <ArrowDownCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Approve Withdrawal & Upload Proof</h3>
                  <p className="text-xs text-slate-400">Request ID: {selectedWdr.id}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setWdrApproveModalOpen(false);
                  setSelectedWdr(null);
                }}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Payout Summary Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Investor:</span>
                <span className="font-bold text-white">{selectedWdr.userName} ({selectedWdr.userId})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Opportunity:</span>
                <span className="font-semibold text-white">{selectedWdr.investmentTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Original Investment:</span>
                <span className="font-mono text-slate-300">₹{Number(selectedWdr.amountInvested).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-800">
                <span className="text-amber-300 font-bold">Total Payout to Transfer:</span>
                <span className="text-base font-black text-amber-300">₹{Number(selectedWdr.payoutAmount).toLocaleString('en-IN')}</span>
              </div>

              {/* Destination Account */}
              <div className="pt-2 border-t border-slate-800 text-[11px] bg-slate-900/60 p-2.5 rounded-xl">
                <span className="text-slate-400 font-semibold block mb-1">Payout Destination:</span>
                {selectedWdr.payoutMethod === 'upi' ? (
                  <p className="font-mono text-amber-300 font-bold">UPI ID: {selectedWdr.bankDetails?.upiId}</p>
                ) : (
                  <div>
                    <p className="font-semibold text-white">{selectedWdr.bankDetails?.bankName || 'Bank Account'}</p>
                    <p className="font-mono text-slate-300">A/C: {selectedWdr.bankDetails?.accountNumber}</p>
                    <p className="font-mono text-slate-400">IFSC: {selectedWdr.bankDetails?.ifsc} • Name: {selectedWdr.bankDetails?.accountHolder}</p>
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleConfirmApproveWdr} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Bank Transfer Reference / UTR Number <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={wdrProofTxnId}
                  onChange={(e) => setWdrProofTxnId(e.target.value)}
                  placeholder="e.g. UTR928172635481"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Bank Transfer Receipt Screenshot Image (Recommended)
                </label>
                <div className="border-2 border-dashed border-slate-700 hover:border-amber-500/50 rounded-2xl p-4 text-center bg-slate-950/60 relative cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleWdrProofFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {wdrProofPreview ? (
                    <div className="space-y-2">
                      <img
                        src={wdrProofPreview}
                        alt="Proof preview"
                        className="max-h-44 mx-auto rounded-xl border border-slate-800 object-contain"
                      />
                      <p className="text-emerald-400 font-semibold text-[11px] flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Screenshot attached. Click to change.</span>
                      </p>
                    </div>
                  ) : (
                    <div className="py-4 space-y-1.5 text-slate-400">
                      <Upload className="w-8 h-8 mx-auto text-amber-400" />
                      <p className="font-semibold text-white">Click or drag & drop transfer receipt</p>
                      <p className="text-[10px] text-slate-500">Supports PNG, JPG, JPEG (Max 10MB)</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Payout Remarks
                </label>
                <textarea
                  rows={2}
                  value={wdrProofNotes}
                  onChange={(e) => setWdrProofNotes(e.target.value)}
                  placeholder="e.g. Funds transferred from ICICI corporate account."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-300 leading-relaxed">
                📢 Approving will mark this withdrawal request as <strong>Paid & Disbursed</strong> and display the official payout receipt and UTR reference directly in the investor's portfolio.
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setWdrApproveModalOpen(false);
                    setSelectedWdr(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={wdrApproving}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1"
                >
                  {wdrApproving ? 'Processing...' : 'Confirm & Disburse Payout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 8: REJECT WITHDRAWAL REQUEST ================= */}
      {wdrRejectModalOpen && selectedWdr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-rose-400">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold text-sm text-white">Reject Withdrawal Request</h3>
              </div>
              <button onClick={() => {
                setWdrRejectModalOpen(false);
                setSelectedWdr(null);
              }}>
                <X className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Rejecting withdrawal request of <strong>₹{Number(selectedWdr.payoutAmount).toLocaleString('en-IN')}</strong> from <strong>{selectedWdr.userName}</strong> for <strong>{selectedWdr.investmentTitle}</strong>.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Reason for Rejection (Investor will see this):
              </label>
              <textarea
                rows={3}
                required
                value={wdrRejectReason}
                onChange={(e) => setWdrRejectReason(e.target.value)}
                placeholder="e.g. Bank account IFSC mismatch, invalid UPI handle, or tenure not yet completed..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setWdrRejectModalOpen(false);
                  setSelectedWdr(null);
                }}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRejectWdr}
                className="flex-1 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 text-xs font-bold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 9: VIEW PROOF RECEIPT ================= */}
      {viewProofModalOpen && viewProofData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <FileCheck className="w-5 h-5" />
                <h3 className="font-bold text-sm text-white">{viewProofData.title}</h3>
              </div>
              <button onClick={() => {
                setViewProofModalOpen(false);
                setViewProofData(null);
              }}>
                <X className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <p>Investor: <strong className="text-white">{viewProofData.user}</strong></p>
              <p>Amount: <strong className="text-emerald-400">₹{Number(viewProofData.amount).toLocaleString('en-IN')}</strong></p>
              <p>UTR Reference: <strong className="text-amber-300 font-mono">{viewProofData.txnId}</strong></p>
              {viewProofData.notes && <p className="italic text-slate-400">Notes: "{viewProofData.notes}"</p>}
            </div>

            {viewProofData.url && (
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-2">
                <img
                  src={viewProofData.url}
                  alt="Receipt Proof"
                  className="w-full max-h-72 object-contain mx-auto"
                />
              </div>
            )}

            <button
              onClick={() => {
                setViewProofModalOpen(false);
                setViewProofData(null);
              }}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
