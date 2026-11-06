const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_FILE = path.join(__dirname, 'data', 'db.json');

// Default initial state
function getInitialData() {
  const salt = bcrypt.genSaltSync(10);
  const adminPasswordHash = bcrypt.hashSync('admin123', salt);
  const userPasswordHash = bcrypt.hashSync('investor123', salt);

  return {
    users: [
      {
        id: 'USR-ADMIN-01',
        name: 'Platform Administrator',
        email: 'admin@investment.com',
        mobile: '+91 98765 43210',
        passwordHash: adminPasswordHash,
        role: 'admin',
        kycStatus: 'verified',
        createdAt: '2026-09-01T10:00:00.000Z'
      },
      {
        id: 'USR-10025',
        name: 'Rahul Sharma',
        email: 'investor@demo.com',
        mobile: '+91 98123 45678',
        passwordHash: userPasswordHash,
        role: 'user',
        kycStatus: 'verified',
        createdAt: '2026-09-15T12:00:00.000Z'
      }
    ],
    investments: [
      {
        id: 'BIZ-101',
        title: 'ABC Jute Industries',
        type: 'business',
        category: 'Jute Business',
        image: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
        description: 'Eco-friendly biodegradable jute sack manufacturing plant modernising looms for export packaging supply. Established factory with 7-year profitable track record.',
        targetAmount: 500000,
        raisedAmount: 0,
        rate: 10, // ₹10 per lot
        minInvestment: 10,
        unitName: 'Lot',
        tenure: '12 Months',
        expectedReturn: '16.5% Annualized',
        riskLevel: 'Moderate',
        investorCount: 0,
        status: 'active',
        terms: 'Quarterly interest disbursement with principal redemption at maturity (12 months). Security held in industrial weaving equipment pledge.',
        createdAt: '2026-09-10T08:00:00.000Z'
      },
      {
        id: 'BIZ-102',
        title: 'Green Agro Hydroponics Hub',
        type: 'business',
        category: 'AgriTech',
        image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80',
        description: 'Smart climate-controlled hydroponic farming producing pesticide-free exotic vegetables for premier supermarket chains across Western India.',
        targetAmount: 1200000,
        raisedAmount: 0,
        rate: 10, // ₹10 per lot
        minInvestment: 10,
        unitName: 'Lot',
        tenure: '18 Months',
        expectedReturn: '18.0% Annualized',
        riskLevel: 'Moderate',
        investorCount: 0,
        status: 'active',
        terms: 'Bi-monthly profit share distribution. 100% of greenhouse assets and solar pumping units hypothecated as collateral.',
        createdAt: '2026-09-12T09:30:00.000Z'
      },
      {
        id: 'BIZ-103',
        title: 'VoltGrid Micro-Solar Stations',
        type: 'business',
        category: 'Clean Energy',
        image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
        description: 'Decentralized 50kW solar mini-grids powering rural commercial workshops and cold storage centers with 10-year PPA off-take agreements.',
        targetAmount: 1500000,
        raisedAmount: 0,
        rate: 10,
        minInvestment: 10,
        unitName: 'Lot',
        tenure: '24 Months',
        expectedReturn: '15.2% Annualized',
        riskLevel: 'Low',
        investorCount: 0,
        status: 'active',
        terms: 'Government-backed PPA contract assignment with quarterly scheduled yields and asset buyback guarantee.',
        createdAt: '2026-09-05T14:15:00.000Z'
      },
      {
        id: 'COMM-201',
        title: 'Digital 24K Physical Gold Vault',
        type: 'commodity',
        category: 'Gold',
        image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80',
        description: 'Securitized 99.9% fine LBMA-accredited gold bullion held in insured Brinks vaults. Admin updates real-time gram rate based on spot bullion market.',
        targetAmount: 1000000,
        raisedAmount: 0,
        rate: 15000, // Admin sets current rate
        minInvestment: 50,
        unitName: 'Unit (0.01g equivalent)',
        tenure: 'Flexible Liquidity',
        expectedReturn: 'Bullion Spot Appreciation + Physical Delivery Option',
        riskLevel: 'Low',
        investorCount: 0,
        status: 'active',
        terms: '100% physically backed by insured vaults. User may hold or request liquidity redemption based on active daily bullion rates.',
        createdAt: '2026-09-01T06:00:00.000Z'
      },
      {
        id: 'COMM-202',
        title: 'Pure 999 Silver Reserve',
        type: 'commodity',
        category: 'Silver',
        image: 'https://images.unsplash.com/photo-1624365168968-f283a546c1a8?auto=format&fit=crop&w=800&q=80',
        description: 'Institutional grade 99.9% fine silver bars stored in audited depository. Industrial green transition demands driving long-term value.',
        targetAmount: 600000,
        raisedAmount: 0,
        rate: 950, // Silver rate set by Admin
        minInvestment: 50,
        unitName: 'Unit (10g equivalent)',
        tenure: 'Flexible Liquidity',
        expectedReturn: 'Commodity Upside + Storage Verification',
        riskLevel: 'Moderate',
        investorCount: 0,
        status: 'active',
        terms: 'Audited monthly by independent chartered inspectors. Full custody certificates issued.',
        createdAt: '2026-09-08T11:20:00.000Z'
      },
      {
        id: 'COMM-203',
        title: 'Metro Highway Commercial Land Parcel',
        type: 'commodity',
        category: 'Land',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
        description: 'Prime fractional commercial land acquisition adjacent to Outer Ring Road logistics corridor. Clear title with DTCP approved boundary zoning.',
        targetAmount: 5000000,
        raisedAmount: 0,
        rate: 25000, // Rate per square yard fraction set by Admin
        minInvestment: 500,
        unitName: 'Sq. Yard Fraction',
        tenure: '36 Months',
        expectedReturn: 'Capital Appreciation 20-25% Target',
        riskLevel: 'Moderate',
        investorCount: 0,
        status: 'active',
        terms: 'Fractional undivided share of land registered through SPV custodial deed with exit upon commercial development lease.',
        createdAt: '2026-09-02T16:00:00.000Z'
      }
    ],
    payments: [],
    user_investments: [],
    notifications: [],
    withdrawals: [],
    settings: {
      upiId: 'growcapital@icici',
      payeeName: 'ACS Groups Ltd',
      supportEmail: 'compliance@growcapital.in',
      supportPhone: '+91 80 4910 8800',
      minLotSize: 10,
      disclaimerNotice: 'Investments are subject to market, commodity and business risk. Please read full risk disclosures before proceeding.',
      razorpayKeyId: 'rzp_test_1DP5mmOlF5G5ag',
      razorpayKeySecret: 's8Yd3p4lFj3n9Z1x7q2k5m0b',
      razorpayEnabled: true
    }
  };
}

class Database {
  constructor() {
    this.init();
  }

  init() {
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialData();
      this.write(initial);
      console.log('Initialized database with rich seed data.');
    }
  }

  read() {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const data = JSON.parse(raw);
      if (!data.withdrawals) data.withdrawals = [];
      return data;
    } catch (err) {
      console.error('Error reading DB, restoring initial state', err);
      const initial = getInitialData();
      this.write(initial);
      return initial;
    }
  }

  write(data) {
    const tmpFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tmpFile, DB_FILE);
  }

  // --- Users ---
  getUsers() {
    return this.read().users;
  }

  getUserById(id) {
    return this.getUsers().find(u => u.id === id);
  }

  getUserByEmail(email) {
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(userData) {
    const data = this.read();
    const newUser = {
      id: `USR-${Date.now().toString().slice(-5)}`,
      kycStatus: 'verified',
      role: 'user',
      createdAt: new Date().toISOString(),
      ...userData
    };
    data.users.push(newUser);
    this.write(data);
    return newUser;
  }

  updateUser(id, updates) {
    const data = this.read();
    const idx = data.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    data.users[idx] = { ...data.users[idx], ...updates };
    this.write(data);
    return data.users[idx];
  }

  // --- Investments ---
  getInvestments() {
    return this.read().investments;
  }

  getInvestmentById(id) {
    return this.getInvestments().find(i => i.id === id);
  }

  createInvestment(item) {
    const data = this.read();
    const prefix = item.type === 'business' ? 'BIZ' : 'COMM';
    const newInv = {
      id: `${prefix}-${Date.now().toString().slice(-4)}`,
      raisedAmount: 0,
      investorCount: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      ...item
    };
    data.investments.push(newInv);
    this.write(data);
    return newInv;
  }

  updateInvestment(id, updates) {
    const data = this.read();
    const idx = data.investments.findIndex(i => i.id === id);
    if (idx === -1) return null;

    // Check if target reached -> auto mark fully_funded
    const updated = { ...data.investments[idx], ...updates };
    if (updated.raisedAmount >= updated.targetAmount && updated.status === 'active') {
      updated.status = 'fully_funded';
    }

    data.investments[idx] = updated;

    // If rate changed for commodity / community asset, update current value for active user investments!
    if (updates.rate && (updated.type === 'commodity' || updated.type === 'community')) {
      data.user_investments = data.user_investments.map(ui => {
        if (ui.investmentId === id) {
          return {
            ...ui,
            currentRate: updates.rate,
            currentValue: Number((ui.lots * updates.rate).toFixed(2))
          };
        }
        return ui;
      });
    }

    this.write(data);
    return updated;
  }

  deleteInvestment(id) {
    const data = this.read();
    const idx = data.investments.findIndex(i => i.id === id);
    if (idx === -1) return false;
    data.investments.splice(idx, 1);
    this.write(data);
    return true;
  }

  // --- Lucky Draw & Winner Management ---
  getInvestmentInvestors(investmentId) {
    const data = this.read();
    // Confirmed user investments for this campaign
    const records = data.user_investments.filter(ui => ui.investmentId === investmentId);
    
    // Group by unique user: show aggregate at final draw pool and show ONLY ONE entry per user
    const userMap = new Map();
    records.forEach(r => {
      const u = data.users.find(user => user.id === r.userId);
      if (!userMap.has(r.userId)) {
        userMap.set(r.userId, {
          userId: r.userId,
          name: u?.name || 'Investor',
          email: u?.email || '',
          mobile: u?.mobile || '',
          totalInvested: 0,
          totalLots: 0,
          investmentCount: 0,
          purchases: []
        });
      }
      const existing = userMap.get(r.userId);
      existing.totalInvested += Number(r.amount);
      existing.totalLots += Number(r.lots);
      existing.investmentCount += 1;
      existing.purchases.push({
        id: r.id,
        amount: Number(r.amount),
        lots: Number(r.lots),
        transactionId: r.transactionId,
        date: r.purchaseDate
      });
    });

    return Array.from(userMap.values());
  }

  drawInvestmentWinner(investmentId, adminId) {
    const data = this.read();
    const inv = data.investments.find(i => i.id === investmentId);
    if (!inv) throw new Error('Investment not found');

    if (inv.type === 'business') {
      throw new Error('Lucky draw pools are exclusive to Commodity Asset investments. Business investments do not have draw pools.');
    }

    if (inv.status !== 'fully_funded' && inv.raisedAmount < inv.targetAmount) {
      throw new Error('Lucky draw can only be conducted once the target amount is reached (100% funded).');
    }

    const uniqueInvestors = this.getInvestmentInvestors(investmentId);
    if (uniqueInvestors.length === 0) {
      throw new Error('No confirmed investors found for this investment.');
    }

    // Weighted random pool: each purchase adds 1 chance for that investor
    const weightedPool = [];
    uniqueInvestors.forEach(investor => {
      const tickets = Math.max(1, investor.investmentCount || 1);
      for (let i = 0; i < tickets; i++) {
        weightedPool.push(investor);
      }
    });

    const randomIndex = Math.floor(Math.random() * weightedPool.length);
    const winnerInvestor = weightedPool[randomIndex];
    const amountWon = Number(inv.targetAmount || inv.raisedAmount);

    inv.winner = {
      userId: winnerInvestor.userId,
      userName: winnerInvestor.name,
      userEmail: winnerInvestor.email,
      userMobile: winnerInvestor.mobile,
      totalLots: winnerInvestor.totalLots,
      totalInvested: winnerInvestor.totalInvested,
      investmentCount: winnerInvestor.investmentCount,
      amountWon: amountWon,
      selectedAt: new Date().toISOString(),
      selectedBy: adminId,
      payoutStatus: 'pending',
      payoutProofUrl: null,
      payoutTxnId: null,
      payoutNotes: '',
      payoutDisbursedAt: null
    };

    // User notification for winner
    data.notifications.unshift({
      id: `NOTIF-WIN-${Date.now()}`,
      userId: winnerInvestor.userId,
      title: '🏆 You Have Won the Full Target Jackpot!',
      message: `Congratulations ${winnerInvestor.name}! You were randomly selected as the lucky winner for "${inv.title}"! Full payout of ₹${amountWon.toLocaleString('en-IN')} will be transferred to you. Check status in your dashboard.`,
      type: 'success',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    // Notify other investors (each unique user once)
    uniqueInvestors.forEach(invUser => {
      if (invUser.userId !== winnerInvestor.userId) {
        data.notifications.unshift({
          id: `NOTIF-DRAW-${Date.now()}-${invUser.userId}`,
          userId: invUser.userId,
          title: `Lucky Draw Winner Announced: ${inv.title}`,
          message: `The random winner for ${inv.title} has been drawn: ${winnerInvestor.name}. Payout proof will be published by Admin.`,
          type: 'info',
          isRead: false,
          createdAt: new Date().toISOString()
        });
      }
    });

    this.write(data);
    return { investment: inv, winner: inv.winner };
  }

  updateWinnerPayoutProof(investmentId, { proofUrl, txnId, notes }, adminId) {
    const data = this.read();
    const inv = data.investments.find(i => i.id === investmentId);
    if (!inv) throw new Error('Investment not found');
    if (!inv.winner) throw new Error('No winner has been selected for this investment yet.');

    inv.winner.payoutProofUrl = proofUrl || inv.winner.payoutProofUrl;
    inv.winner.payoutTxnId = txnId || inv.winner.payoutTxnId || `UTR-PAYOUT-${Date.now().toString().slice(-6)}`;
    inv.winner.payoutNotes = notes || 'Payout transferred to winner account.';
    inv.winner.payoutStatus = 'disbursed';
    inv.winner.payoutDisbursedAt = new Date().toISOString();
    inv.winner.verifiedByAdmin = adminId;

    // Winner notification
    data.notifications.unshift({
      id: `NOTIF-PROOF-${Date.now()}`,
      userId: inv.winner.userId,
      title: '💸 Payout Proof Published!',
      message: `Your lucky draw prize of ₹${inv.winner.amountWon.toLocaleString('en-IN')} for "${inv.title}" has been disbursed! Reference: ${inv.winner.payoutTxnId}. The transfer proof receipt is now viewable.`,
      type: 'success',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    this.write(data);
    return inv.winner;
  }

  // --- Payments ---
  getPayments() {
    return this.read().payments;
  }

  getPaymentById(id) {
    return this.getPayments().find(p => p.id === id);
  }

  createPayment(paymentData) {
    const data = this.read();
    const newPayment = {
      id: `PAY-${Date.now().toString().slice(-5)}`,
      status: 'pending',
      adminNotes: '',
      rejectionReason: '',
      createdAt: new Date().toISOString(),
      verifiedAt: null,
      verifiedBy: null,
      ...paymentData
    };
    data.payments.unshift(newPayment);

    // Notify admin
    data.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      userId: 'admin',
      title: 'New Payment Submitted',
      message: `${newPayment.userName} submitted ₹${newPayment.amount.toLocaleString('en-IN')} for ${newPayment.investmentTitle} (Ref: ${newPayment.transactionId}).`,
      type: 'alert',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    // Notify user
    data.notifications.unshift({
      id: `NOTIF-U-${Date.now()}`,
      userId: newPayment.userId,
      title: 'Payment Submitted',
      message: `Your payment of ₹${newPayment.amount.toLocaleString('en-IN')} has been submitted and is pending verification.`,
      type: 'info',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    this.write(data);
    return newPayment;
  }

  confirmPayment(paymentId, adminId, adminNotes = '', adminProofUrl = null) {
    const data = this.read();
    const payment = data.payments.find(p => p.id === paymentId);
    if (!payment) throw new Error('Payment not found');
    if (payment.status !== 'pending') throw new Error(`Payment is already ${payment.status}`);

    payment.status = 'confirmed';
    payment.verifiedAt = new Date().toISOString();
    payment.verifiedBy = adminId;
    payment.adminNotes = adminNotes || 'Approved by Administrator';
    if (adminProofUrl) {
      payment.adminProofUrl = adminProofUrl;
    }

    // 1. Update investment raisedAmount and investorCount
    const investment = data.investments.find(i => i.id === payment.investmentId);
    if (investment) {
      investment.raisedAmount = Math.min(
        Number(investment.targetAmount),
        (Number(investment.raisedAmount) || 0) + Number(payment.amount)
      );
      investment.investorCount = (investment.investorCount || 0) + 1;
      if (investment.raisedAmount >= investment.targetAmount) {
        investment.status = 'fully_funded';
      }
    }

    // 2. Create confirmed User Investment Record
    const userInvestmentId = `INV-${Date.now().toString().slice(-5)}`;
    const currentRate = investment ? investment.rate : payment.rateAtInvestment;
    const lots = payment.lots || (payment.amount / currentRate);

    const newUserInvestment = {
      id: userInvestmentId,
      userId: payment.userId,
      investmentId: payment.investmentId,
      investmentTitle: payment.investmentTitle,
      investmentType: payment.investmentType,
      paymentId: payment.id,
      transactionId: payment.transactionId,
      amount: Number(payment.amount),
      lots: Number(lots),
      rateAtInvestment: payment.rateAtInvestment,
      purchaseDate: new Date().toISOString(),
      currentRate: currentRate,
      currentValue: Number((lots * currentRate).toFixed(2)),
      adminProofUrl: payment.adminProofUrl || null,
      adminNotes: payment.adminNotes || null,
      status: 'confirmed'
    };
    data.user_investments.unshift(newUserInvestment);

    // 3. User notification
    data.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      userId: payment.userId,
      title: 'Payment Confirmed 🎉',
      message: `Your investment of ₹${payment.amount.toLocaleString('en-IN')} in ${payment.investmentTitle} is now confirmed! (ID: ${userInvestmentId})`,
      type: 'success',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    this.write(data);
    return { payment, userInvestment: newUserInvestment, investment };
  }

  rejectPayment(paymentId, adminId, reason = 'Transaction verification failed') {
    const data = this.read();
    const payment = data.payments.find(p => p.id === paymentId);
    if (!payment) throw new Error('Payment not found');
    if (payment.status !== 'pending') throw new Error(`Payment is already ${payment.status}`);

    payment.status = 'rejected';
    payment.verifiedAt = new Date().toISOString();
    payment.verifiedBy = adminId;
    payment.rejectionReason = reason;

    // User notification
    data.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      userId: payment.userId,
      title: 'Payment Verification Rejected',
      message: `Your payment of ₹${payment.amount.toLocaleString('en-IN')} for ${payment.investmentTitle} was rejected. Reason: ${reason}`,
      type: 'warning',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    this.write(data);
    return payment;
  }

  updatePaymentProof(paymentId, { adminProofUrl, adminNotes }) {
    const data = this.read();
    const payment = data.payments.find(p => p.id === paymentId);
    if (!payment) throw new Error('Payment not found');

    if (adminProofUrl) payment.adminProofUrl = adminProofUrl;
    if (adminNotes !== undefined) payment.adminNotes = adminNotes;

    // Sync to user_investments if exists
    const userInv = data.user_investments.find(ui => ui.paymentId === paymentId);
    if (userInv) {
      if (adminProofUrl) userInv.adminProofUrl = adminProofUrl;
      if (adminNotes !== undefined) userInv.adminNotes = adminNotes;
    }

    // Notify user
    data.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      userId: payment.userId,
      title: 'Payment Verification Receipt Updated',
      message: `Administrator uploaded verified payment confirmation receipt for ${payment.investmentTitle} (Ref: ${payment.transactionId}).`,
      type: 'info',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    this.write(data);
    return payment;
  }

  // --- User Investments ---
  getUserInvestments(userId) {
    const data = this.read();
    if (!userId) return data.user_investments;
    return data.user_investments.filter(ui => ui.userId === userId);
  }

  // --- Notifications ---
  getNotifications(userId) {
    const data = this.read();
    return data.notifications.filter(n => n.userId === userId || (userId === 'admin' && n.userId === 'admin'));
  }

  markNotificationRead(id) {
    const data = this.read();
    const notif = data.notifications.find(n => n.id === id);
    if (notif) {
      notif.isRead = true;
      this.write(data);
    }
  }

  // --- Settings ---
  getSettings() {
    return this.read().settings;
  }

  updateSettings(newSettings) {
    const data = this.read();
    data.settings = { ...data.settings, ...newSettings };
    this.write(data);
    return data.settings;
  }

  // --- Withdrawal Requests ---
  getWithdrawals() {
    const data = this.read();
    return data.withdrawals || [];
  }

  getWithdrawalById(id) {
    return this.getWithdrawals().find(w => w.id === id);
  }

  createWithdrawalRequest({
    userId,
    userInvestmentId,
    payoutMethod, // 'bank' | 'upi'
    accountHolder,
    accountNumber,
    ifsc,
    bankName,
    upiId,
    userNotes
  }) {
    const data = this.read();
    if (!data.withdrawals) data.withdrawals = [];

    const userInv = data.user_investments.find(ui => ui.id === userInvestmentId && ui.userId === userId);
    if (!userInv) throw new Error('Investment holding not found.');

    const liveInvestments = data.investments;
    const liveItem = liveInvestments.find(i => i.id === userInv.investmentId);

    if (liveItem && (liveItem.type === 'commodity' || liveItem.type === 'community')) {
      throw new Error('Withdrawal requests are only available for Business investments after tenure completion. Commodity Asset Reserves participate in 100% Target Lucky Draw Pools.');
    }

    if (userInv.withdrawalStatus === 'pending') {
      throw new Error('A withdrawal request is already pending for this investment.');
    }
    if (userInv.withdrawalStatus === 'approved') {
      throw new Error('Funds for this investment have already been withdrawn and disbursed.');
    }

    const currentRate = liveItem ? liveItem.rate : userInv.currentRate;
    const currentValue = Number(userInv.currentValue || userInv.amount);

    const user = data.users.find(u => u.id === userId);

    const withdrawalId = `WDR-${Date.now().toString().slice(-6)}`;
    const newWithdrawal = {
      id: withdrawalId,
      userId: userId,
      userName: user ? user.name : 'Investor',
      userEmail: user ? user.email : '',
      userMobile: user ? user.mobile : '',
      userInvestmentId: userInvestmentId,
      investmentId: userInv.investmentId,
      investmentTitle: userInv.investmentTitle,
      investmentType: userInv.investmentType,
      tenure: liveItem?.tenure || 'Flexible Liquidity',
      amountInvested: Number(userInv.amount),
      lots: Number(userInv.lots),
      payoutAmount: currentValue,
      payoutMethod: payoutMethod || 'bank',
      bankDetails: {
        accountHolder: accountHolder || user?.name || '',
        accountNumber: accountNumber || '',
        ifsc: ifsc || '',
        bankName: bankName || '',
        upiId: upiId || ''
      },
      status: 'pending', // 'pending' | 'approved' | 'rejected'
      requestedAt: new Date().toISOString(),
      processedAt: null,
      processedBy: null,
      payoutTxnId: null,
      payoutProofUrl: null,
      adminNotes: '',
      rejectionReason: '',
      userNotes: userNotes || ''
    };

    data.withdrawals.unshift(newWithdrawal);

    // Update investment status in user_investments
    userInv.withdrawalStatus = 'pending';
    userInv.withdrawalId = withdrawalId;

    // Dispatches notification to admin
    data.notifications.unshift({
      id: `NOTIF-WDR-ADMIN-${Date.now()}`,
      userId: 'admin',
      title: 'New Withdrawal Request',
      message: `${newWithdrawal.userName} requested withdrawal of ₹${currentValue.toLocaleString('en-IN')} for "${newWithdrawal.investmentTitle}".`,
      type: 'alert',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    // Dispatches notification to user
    data.notifications.unshift({
      id: `NOTIF-WDR-USER-${Date.now()}`,
      userId: userId,
      title: 'Withdrawal Request Submitted',
      message: `Your withdrawal request of ₹${currentValue.toLocaleString('en-IN')} for "${newWithdrawal.investmentTitle}" has been received and is being processed by Admin.`,
      type: 'info',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    this.write(data);
    return newWithdrawal;
  }

  approveWithdrawal(withdrawalId, adminId, { payoutTxnId, payoutProofUrl, adminNotes }) {
    const data = this.read();
    if (!data.withdrawals) data.withdrawals = [];

    const wdr = data.withdrawals.find(w => w.id === withdrawalId);
    if (!wdr) throw new Error('Withdrawal request not found.');
    if (wdr.status !== 'pending') throw new Error(`Withdrawal request is already ${wdr.status}.`);

    wdr.status = 'approved';
    wdr.processedAt = new Date().toISOString();
    wdr.processedBy = adminId;
    wdr.payoutTxnId = payoutTxnId || `UTR-WDR-${Date.now().toString().slice(-6)}`;
    wdr.payoutProofUrl = payoutProofUrl || null;
    wdr.adminNotes = adminNotes || 'Withdrawal payout disbursed successfully.';

    // Update user_investments
    const userInv = data.user_investments.find(ui => ui.id === wdr.userInvestmentId);
    if (userInv) {
      userInv.withdrawalStatus = 'approved';
      userInv.withdrawnAt = wdr.processedAt;
      userInv.payoutTxnId = wdr.payoutTxnId;
      userInv.payoutProofUrl = wdr.payoutProofUrl;
      userInv.payoutAmount = wdr.payoutAmount;
    }

    // User notification
    data.notifications.unshift({
      id: `NOTIF-WDR-APP-${Date.now()}`,
      userId: wdr.userId,
      title: 'Withdrawal Disbursed Successfully! 💸',
      message: `Your withdrawal of ₹${Number(wdr.payoutAmount).toLocaleString('en-IN')} for "${wdr.investmentTitle}" has been processed! Reference: ${wdr.payoutTxnId}. Receipt proof has been uploaded.`,
      type: 'success',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    this.write(data);
    return wdr;
  }

  rejectWithdrawal(withdrawalId, adminId, reason = 'Withdrawal criteria not met') {
    const data = this.read();
    if (!data.withdrawals) data.withdrawals = [];

    const wdr = data.withdrawals.find(w => w.id === withdrawalId);
    if (!wdr) throw new Error('Withdrawal request not found.');
    if (wdr.status !== 'pending') throw new Error(`Withdrawal request is already ${wdr.status}.`);

    wdr.status = 'rejected';
    wdr.processedAt = new Date().toISOString();
    wdr.processedBy = adminId;
    wdr.rejectionReason = reason;

    // Reset or update user_investments
    const userInv = data.user_investments.find(ui => ui.id === wdr.userInvestmentId);
    if (userInv) {
      userInv.withdrawalStatus = 'rejected';
      userInv.rejectionReason = reason;
    }

    // User notification
    data.notifications.unshift({
      id: `NOTIF-WDR-REJ-${Date.now()}`,
      userId: wdr.userId,
      title: 'Withdrawal Request Rejected',
      message: `Your withdrawal request of ₹${Number(wdr.payoutAmount).toLocaleString('en-IN')} for "${wdr.investmentTitle}" was rejected. Reason: ${reason}`,
      type: 'warning',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    this.write(data);
    return wdr;
  }

  // --- Razorpay Payment Capture ---
  recordRazorpayInvestment({
    userId,
    userName,
    userEmail,
    investmentId,
    amount,
    razorpayPaymentId,
    razorpayOrderId
  }) {
    const data = this.read();
    const investment = data.investments.find(i => i.id === investmentId);
    if (!investment) throw new Error('Investment opportunity not found');

    const numAmount = Number(amount);
    const lots = investment.type === 'business'
      ? Math.floor(numAmount / investment.rate)
      : Number((numAmount / investment.rate).toFixed(4));

    // 1. Create confirmed payment record
    const paymentId = `PAY-RZP-${Date.now().toString().slice(-5)}`;
    const newPayment = {
      id: paymentId,
      userId,
      userName,
      userEmail,
      investmentId: investment.id,
      investmentTitle: investment.title,
      investmentType: investment.type,
      amount: numAmount,
      lots,
      rateAtInvestment: investment.rate,
      transactionId: razorpayPaymentId,
      orderId: razorpayOrderId || null,
      paymentMethod: 'razorpay',
      paymentDate: new Date().toISOString().split('T')[0],
      screenshotUrl: null,
      status: 'confirmed',
      adminNotes: 'Auto-verified & captured via Razorpay Payment Gateway',
      createdAt: new Date().toISOString(),
      verifiedAt: new Date().toISOString(),
      verifiedBy: 'RAZORPAY_GATEWAY'
    };
    data.payments.unshift(newPayment);

    // 2. Update investment raisedAmount and investorCount
    investment.raisedAmount = Math.min(
      Number(investment.targetAmount),
      (Number(investment.raisedAmount) || 0) + numAmount
    );
    investment.investorCount = (investment.investorCount || 0) + 1;
    if (investment.raisedAmount >= investment.targetAmount) {
      investment.status = 'fully_funded';
    }

    // 3. Create confirmed User Investment Record
    const userInvestmentId = `INV-${Date.now().toString().slice(-5)}`;
    const currentRate = investment.rate;
    const newUserInvestment = {
      id: userInvestmentId,
      userId,
      investmentId: investment.id,
      investmentTitle: investment.title,
      investmentType: investment.type,
      paymentId: newPayment.id,
      transactionId: razorpayPaymentId,
      amount: numAmount,
      lots,
      rateAtInvestment: currentRate,
      purchaseDate: new Date().toISOString(),
      currentRate,
      currentValue: Number((lots * currentRate).toFixed(2)),
      paymentMethod: 'razorpay',
      adminProofUrl: null,
      adminNotes: 'Payment verified & captured via Razorpay Gateway',
      status: 'confirmed'
    };
    data.user_investments.unshift(newUserInvestment);

    // 4. Notifications
    data.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      userId,
      title: 'Investment Confirmed via Razorpay 🎉',
      message: `Your investment of ₹${numAmount.toLocaleString('en-IN')} in ${investment.title} was successfully captured via Razorpay! (Ref: ${razorpayPaymentId})`,
      type: 'success',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    data.notifications.unshift({
      id: `NOTIF-ADMIN-${Date.now()}`,
      userId: 'admin',
      title: 'New Razorpay Investment Captured',
      message: `${userName} invested ₹${numAmount.toLocaleString('en-IN')} in ${investment.title} via Razorpay (Ref: ${razorpayPaymentId}).`,
      type: 'info',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    this.write(data);
    return { payment: newPayment, userInvestment: newUserInvestment, investment };
  }

  resetAllData() {
    const data = this.read();
    data.payments = [];
    data.user_investments = [];
    data.withdrawals = [];
    data.notifications = [];

    const initial = getInitialData();
    const existingById = new Map((data.investments || []).map(i => [i.id, i]));

    // Standard investments with clean 0 state
    const allInvestments = initial.investments.map(initInv => {
      const existing = existingById.get(initInv.id);
      return {
        ...initInv,
        rate: existing ? existing.rate : initInv.rate, // keep custom live rates
        raisedAmount: 0,
        investorCount: 0,
        status: 'active',
        winner: null
      };
    });

    // Keep any custom investments added by admin, also reset to 0
    for (const inv of (data.investments || [])) {
      if (!allInvestments.some(i => i.id === inv.id)) {
        allInvestments.push({
          ...inv,
          raisedAmount: 0,
          investorCount: 0,
          status: 'active',
          winner: null
        });
      }
    }

    data.investments = allInvestments;
    this.write(data);
    return data;
  }
}

module.exports = new Database();
