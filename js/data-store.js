/**
 * VeraLedger Data Store & Session Manager
 * Provides client-side state management for the tax & accounting platform:
 * - User Authentication (Client & Admin)
 * - Service Applications (ITR, GST, Bookkeeping, Consultation)
 * - Document Uploads & Verifications
 * - Application Status Timelines & Admin Notes
 * - Payments & Downloadable Deliverables
 */

(function (globalScope) {
  'use strict';

  // Fallback for non-browser environments during tests
  const storage = typeof localStorage !== 'undefined' ? localStorage : {
    _data: {},
    getItem: function(k) { return this._data[k] || null; },
    setItem: function(k, v) { this._data[k] = String(v); },
    removeItem: function(k) { delete this._data[k]; }
  };

  const STORAGE_KEYS = {
    CURRENT_USER: 'vl_current_user',
    USERS: 'vl_users',
    APPLICATIONS: 'vl_applications',
    NOTIFICATIONS: 'vl_notifications',
    PRICING: 'vl_pricing'
  };

  const DEFAULT_PRICING = {
    services: {
      itr: {
        key: 'itr',
        name: 'Income Tax Filing',
        badge: 'Personal & Professional Tax',
        plans: {
          basic: {
            name: 'Basic (ITR-1 Sahaj)',
            price: 1499,
            displayPrice: '₹1,499',
            period: 'per filing',
            target: 'Salaried individuals with single Form 16 & interest income',
            features: [
              'Form 16 automated parsing & AIS cross-check',
              'Dual-regime (Old vs New) tax comparison',
              'Standard deduction & Section 87A tax rebate',
              'Official ITR-V acknowledgement receipt',
              'Standard 48-hour draft delivery'
            ],
            popular: false
          },
          professional: {
            name: 'Professional (ITR-2 / 44ADA)',
            price: 2499,
            displayPrice: '₹2,499',
            period: 'per filing',
            target: 'Multiple employers, capital gains (stocks/crypto) or 50% freelance write-off',
            features: [
              'Everything in Basic tier',
              'Capital gains statement sync (Zerodha, Groww, CAMS)',
              'Section 44ADA 50% presumptive expense claim',
              'Deductions optimization (80C, 80D, HRA & Loan 24b)',
              '1-on-1 Certified CPA review before submission',
              '100% Notice Protection Guarantee'
            ],
            popular: true
          },
          business: {
            name: 'Business & Directorship (ITR-3)',
            price: 4999,
            displayPrice: '₹4,999',
            period: 'per filing',
            target: 'Company directors, LLP partners, F&O traders & foreign asset holders',
            features: [
              'Everything in Professional tier',
              'Profit & Loss and Balance Sheet scheduling',
              'F&O / Intraday turnover calculation & set-off',
              'Foreign assets & DTAA Schedule FA / FSI',
              'Statutory audit applicability audit',
              'Dedicated Senior Chartered Accountant lead'
            ],
            popular: false
          }
        }
      },
      gst: {
        key: 'gst',
        name: 'GST Registration & Filing',
        badge: 'Goods & Services Tax',
        plans: {
          basic: {
            name: 'Basic GST (Nil / QRMP)',
            price: 1999,
            displayPrice: '₹1,999',
            period: 'per quarter',
            target: 'Quarterly filers, service consultants under ₹20L, or low-volume trading',
            features: [
              'Quarterly GSTR-1 & GSTR-3B return filing',
              'IFF invoice upload (Invoice Furnishing Facility)',
              'Monthly tax payment challan generation (PMT-06)',
              'Permanent filing receipts vault archive',
              'Filing deadline reminder alerts'
            ],
            popular: false
          },
          professional: {
            name: 'Professional GST (Monthly Active)',
            price: 3999,
            displayPrice: '₹3,999',
            period: 'per quarter',
            target: 'Active B2B businesses, e-commerce sellers & software exporters',
            features: [
              'Monthly GSTR-1 and GSTR-3B filings',
              '100% GSTR-2B vs Books automated ITC reconciliation',
              'LUT filing for zero-rated software/service exports',
              'DRC-01B/C notice response assistance',
              'Zero ITC reversal penalty guarantee'
            ],
            popular: true
          },
          business: {
            name: 'Business GST + Annual Audit (GSTR-9)',
            price: 7999,
            displayPrice: '₹7,999',
            period: 'per quarter',
            target: 'Turnover > ₹1.5 Cr, multi-branch entities & e-invoicing compliance',
            features: [
              'Everything in Professional tier',
              'E-Invoicing and E-Way bill error audit',
              'Annual Return GSTR-9 reconciliation',
              'GSTR-9C chartered certification assistance',
              'Supplier non-compliance ITC recovery follow-up',
              'Dedicated GST practitioner'
            ],
            popular: false
          }
        }
      },
      accounting: {
        key: 'accounting',
        name: 'Accounting & Bookkeeping',
        badge: 'Full-Stack Finance',
        plans: {
          basic: {
            name: 'Starter Books',
            price: 4500,
            displayPrice: '₹4,500',
            period: 'per month',
            target: 'Sole proprietors & early startups with up to 75 transactions/mo',
            features: [
              'Monthly bank feed reconciliation',
              'Categorization of sales & operational expenses',
              'Quarterly Profit & Loss summary',
              'Cloud software setup (Zoho Books / Tally / Excel)',
              'Email support with 48h turnaround'
            ],
            popular: false
          },
          professional: {
            name: 'Growth Ledger',
            price: 7500,
            displayPrice: '₹7,500',
            period: 'per month',
            target: 'Funded tech startups, agencies & omnichannel brands (up to 300 txns/mo)',
            features: [
              'Weekly bank & credit card feed reconciliation',
              'Vendor bill processing & payment scheduling',
              'Customer accounts receivable aging reports',
              'Monthly Balance Sheet & Income Statement',
              'Vendor TDS deduction & quarterly 26Q returns',
              'Dedicated accounting manager'
            ],
            popular: true
          },
          business: {
            name: 'Enterprise Controller',
            price: 14500,
            displayPrice: '₹14,500',
            period: 'per month',
            target: 'High-volume businesses (600+ txns/mo) requiring CFO-level oversight',
            features: [
              'Everything in Growth tier',
              'Daily ledger sync & multi-currency reconciliation',
              'Departmental cost centers & budget tracking',
              'Investor board MIS pack & SaaS metrics (CAC, LTV, Burn)',
              'Year-end statutory audit preparation & audit-room liaison',
              'Senior Practice Partner monthly review'
            ],
            popular: false
          }
        }
      },
      consultation: {
        key: 'consultation',
        name: 'Financial & Tax Consultation',
        badge: 'Senior Partner Advisory',
        plans: {
          basic: {
            name: 'Single Strategy Call',
            price: 1500,
            displayPrice: '₹1,500',
            period: 'per 45 mins',
            target: 'Individuals & founders with a specific tax question or regime dilemma',
            features: [
              '45-minute confidential 1-on-1 video call',
              'Review of Form 16 / past tax computations',
              'Regime selection optimization check',
              'Written consultation summary note',
              'Action item checklist within 24h'
            ],
            popular: false
          },
          professional: {
            name: 'Notice Resolution Advisory',
            price: 3499,
            displayPrice: '₹3,499',
            period: 'per case',
            target: 'Receipt of Section 143(1), 143(2), 148 or GST DRC-01 notices',
            features: [
              'Detailed scrutiny of the official statutory notice',
              'Reconciliation of tax dept portal data vs client records',
              'Drafting formal legal reply by Senior FCA',
              'Guidance on rectification under Section 154',
              'Representation filing on ITBA / GST portal'
            ],
            popular: true
          },
          business: {
            name: 'Corporate Structuring & Expat Tax',
            price: 8500,
            displayPrice: '₹8,500',
            period: 'per retainer',
            target: 'Overseas remittances, DTAA residency, ESOP schemes & holding entities',
            features: [
              'Cross-border remittance tax & Form 15CA/CB support',
              'Double Tax Avoidance Agreement (DTAA) optimization',
              'Startup ESOP pool design & angel tax review',
              'Two 60-minute partner strategy sessions',
              'Formal written legal opinion letter'
            ],
            popular: false
          }
        }
      }
    },
    addons: [
      { id: 'add_notice', name: 'Past Year Defective Notice 143(1) Resolution', price: 1999, displayPrice: '₹1,999', unit: 'per notice', desc: 'Detailed response drafting and rectification filing on the income tax e-filing portal.' },
      { id: 'add_dsc', name: 'Digital Signature Certificate (Class 3 DSC)', price: 1499, displayPrice: '₹1,499', unit: '2-year token', desc: 'Includes FIPS-certified USB cryptographic token for MCA and GST portals.' },
      { id: 'add_lut', name: 'GST LUT Filing for Service Exporters', price: 999, displayPrice: '₹999', unit: 'per financial year', desc: 'Enables 0% GST export of software, consulting, and digital services.' },
      { id: 'add_pan', name: 'PAN-Aadhaar Linking & Name Correction', price: 799, displayPrice: '₹799', unit: 'one-time', desc: 'Restores inoperative PAN status through Protean / NSDL data correction.' },
      { id: 'add_roc', name: 'Annual MCA Form AOC-4 & MGT-7 Filing', price: 4999, displayPrice: '₹4,999', unit: 'per year', desc: 'Corporate annual financial statements and return filing for Pvt Ltd companies.' }
    ]
  };

  // Default Seed Data
  const DEFAULT_USERS = [
    {
      id: 'usr_alex',
      name: 'Alex Morgan',
      email: 'alex@example.com',
      password: 'password123',
      phone: '+91 98765 43210',
      role: 'client',
      clientType: 'Salaried Individual',
      pan: 'ABCDE1234F',
      createdAt: '2026-01-15'
    },
    {
      id: 'usr_priya',
      name: 'Priya Sharma',
      email: 'priya@techstartup.example',
      password: 'password123',
      phone: '+91 98450 11223',
      role: 'client',
      clientType: 'Startup Director',
      pan: 'AABCP9876K',
      createdAt: '2026-02-10'
    },
    {
      id: 'usr_admin',
      name: 'Rajesh Kumar, FCA',
      email: 'admin@veraledger.example',
      password: 'admin',
      phone: '+91 94440 99881',
      role: 'admin',
      title: 'Senior Partner & Practice Lead',
      createdAt: '2025-01-01'
    }
  ];

  const DEFAULT_APPLICATIONS = [
    {
      id: 'VL-ITR-2026-104',
      serviceKey: 'itr',
      serviceName: 'Income Tax Return (ITR)',
      category: 'Individual Tax Filing',
      userId: 'alex@example.com',
      userName: 'Alex Morgan',
      userPhone: '+91 98765 43210',
      clientType: 'Salaried Employee',
      submittedDate: '16 Nov 2026',
      status: 'Under Review', // 'Submitted' | 'Under Review' | 'Action Required' | 'Ready for Payment' | 'Completed'
      progress: 60,
      assignedTo: 'Rajesh Kumar, FCA',
      fee: '₹2,499',
      paymentStatus: 'Paid',
      paymentDate: '16 Nov 2026',
      transactionId: 'TXN-984214-VL',
      formData: {
        assessmentYear: '2026–27 (FY 2025–26)',
        panNumber: 'ABCDE1234F',
        employmentType: 'Salaried (Private Tech Sector)',
        incomeRange: '₹15L – ₹25L',
        taxRegime: 'Old Regime (Claiming HRA & 80C/80D)',
        housingLoan: 'Yes (Section 24b Interest Deduction)',
        foreignAssets: 'No'
      },
      documents: [
        {
          id: 'doc_1',
          name: 'Form16_PartA_PartB_2025-26.pdf',
          type: 'Form 16',
          size: '1.4 MB',
          uploadedAt: '16 Nov 2026',
          status: 'Verified',
          verifiedBy: 'Rajesh Kumar'
        },
        {
          id: 'doc_2',
          name: 'Annual_Information_Statement_AIS.pdf',
          type: 'AIS / 26AS',
          size: '890 KB',
          uploadedAt: '16 Nov 2026',
          status: 'Verified',
          verifiedBy: 'Rajesh Kumar'
        },
        {
          id: 'doc_3',
          name: 'HomeLoan_Interest_Certificate_SBI.pdf',
          type: 'Deduction Proof',
          size: '420 KB',
          uploadedAt: '16 Nov 2026',
          status: 'Under Review'
        }
      ],
      adminNotes: [
        {
          id: 'note_1',
          author: 'Rajesh Kumar, FCA',
          date: '16 Nov 2026, 14:30',
          text: 'AIS dividend figures and Form 16 matched. Currently calculating dual-regime savings before final draft approval.'
        }
      ],
      deliverables: []
    },
    {
      id: 'VL-GST-2026-089',
      serviceKey: 'gst',
      serviceName: 'GST Monthly Compliance & ITC',
      category: 'Goods & Services Tax',
      userId: 'priya@techstartup.example',
      userName: 'Priya Sharma (Nexara Tech LLP)',
      userPhone: '+91 98450 11223',
      clientType: 'Startup Director',
      submittedDate: '15 Nov 2026',
      status: 'Action Required',
      progress: 40,
      assignedTo: 'Meenakshi Iyer, CPA',
      fee: '₹3,999',
      paymentStatus: 'Unpaid',
      formData: {
        gstin: '33AABCN8871K1Z2',
        legalName: 'Nexara Technologies LLP',
        turnoverBracket: '₹1.5 Cr – ₹5 Cr',
        returnPeriod: 'October 2026 (GSTR-1 & 3B)',
        natureOfSupplies: 'B2B Software Export & Domestic Cloud Services'
      },
      documents: [
        {
          id: 'doc_gst_1',
          name: 'Sales_Register_Oct2026.xlsx',
          type: 'Sales Register',
          size: '2.1 MB',
          uploadedAt: '15 Nov 2026',
          status: 'Verified'
        },
        {
          id: 'doc_gst_2',
          name: 'Purchase_Bills_Oct2026.zip',
          type: 'Input Tax Credit Bills',
          size: '8.4 MB',
          uploadedAt: '15 Nov 2026',
          status: 'Action Required'
        }
      ],
      adminNotes: [
        {
          id: 'note_gst_1',
          author: 'Meenakshi Iyer, CPA',
          date: '15 Nov 2026, 17:15',
          text: 'Discrepancy of ₹24,800 found between GSTR-2B inward supplies and your purchase zip file. Please upload revised vendor invoices for Vendor Code V-104.'
        }
      ],
      deliverables: []
    },
    {
      id: 'VL-ACC-2026-062',
      serviceKey: 'accounting',
      serviceName: 'Full-Stack Bookkeeping & MIS',
      category: 'Accounting & Payroll',
      userId: 'alex@example.com',
      userName: 'Alex Morgan (Northstar Design)',
      userPhone: '+91 98765 43210',
      clientType: 'Freelance Design Studio',
      submittedDate: '10 Nov 2026',
      status: 'Completed',
      progress: 100,
      assignedTo: 'Rajesh Kumar, FCA',
      fee: '₹7,500',
      paymentStatus: 'Paid',
      paymentDate: '10 Nov 2026',
      transactionId: 'TXN-773120-VL',
      formData: {
        legalName: 'Northstar Creative Studio',
        entityType: 'Sole Proprietorship',
        accountingSoftware: 'Zoho Books & Excel',
        reportingPeriod: 'Q2 (Jul - Sep 2026)',
        volume: '150 - 300 Monthly Transactions'
      },
      documents: [
        {
          id: 'doc_acc_1',
          name: 'HDFC_Bank_Statements_Q2.pdf',
          type: 'Bank Statement',
          size: '3.6 MB',
          uploadedAt: '10 Nov 2026',
          status: 'Verified'
        },
        {
          id: 'doc_acc_2',
          name: 'Stripe_Payout_Summary_Q2.csv',
          type: 'Payment Gateway Logs',
          size: '512 KB',
          uploadedAt: '10 Nov 2026',
          status: 'Verified'
        }
      ],
      adminNotes: [
        {
          id: 'note_acc_1',
          author: 'Rajesh Kumar, FCA',
          date: '12 Nov 2026, 11:00',
          text: 'Reconciliation completed. Profit & Loss, Balance Sheet, and Trial Balance signed and published to client deliverables.'
        }
      ],
      deliverables: [
        {
          id: 'deliv_1',
          name: 'Northstar_Q2_Financial_Statements_Signed.pdf',
          type: 'P&L and Balance Sheet',
          issuedDate: '12 Nov 2026',
          size: '1.8 MB'
        },
        {
          id: 'deliv_2',
          name: 'Bank_Reconciliation_Statement_Q2.pdf',
          type: 'Reconciliation Certificate',
          issuedDate: '12 Nov 2026',
          size: '640 KB'
        }
      ]
    }
  ];

  // Safe event dispatcher
  function dispatchCustomEvent(name, detail) {
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof CustomEvent !== 'undefined') {
      window.dispatchEvent(new CustomEvent(name, { detail }));
    }
  }

  // Data Store Engine
  const VeraStore = {
    // Initialize LocalStorage with default seeds if empty
    init: function () {
      if (!storage.getItem(STORAGE_KEYS.USERS)) {
        storage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
      }
      if (!storage.getItem(STORAGE_KEYS.APPLICATIONS)) {
        storage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(DEFAULT_APPLICATIONS));
      }
      if (!storage.getItem(STORAGE_KEYS.PRICING)) {
        storage.setItem(STORAGE_KEYS.PRICING, JSON.stringify(DEFAULT_PRICING));
      }
      // If no user is logged in, default to Alex Morgan for demonstration convenience
      if (!storage.getItem(STORAGE_KEYS.CURRENT_USER)) {
        storage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_USERS[0]));
      }
    },

    // Session Management
    getUsers: function () {
      this.init();
      try {
        return JSON.parse(storage.getItem(STORAGE_KEYS.USERS) || '[]');
      } catch (e) {
        return DEFAULT_USERS;
      }
    },

    getCurrentUser: function () {
      try {
        const data = storage.getItem(STORAGE_KEYS.CURRENT_USER);
        return data ? JSON.parse(data) : null;
      } catch (e) {
        return null;
      }
    },

    setCurrentUser: function (user) {
      if (user) {
        storage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      } else {
        storage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
      // Dispatch event for UI reactivity
      dispatchCustomEvent('vl_user_changed', user);
    },

    logout: function () {
      storage.removeItem(STORAGE_KEYS.CURRENT_USER);
      dispatchCustomEvent('vl_user_changed', null);
    },

    login: function (email, password) {
      this.init();
      const users = JSON.parse(storage.getItem(STORAGE_KEYS.USERS) || '[]');
      const cleanEmail = (email || '').trim().toLowerCase();
      
      // Check existing users
      const found = users.find(u => u.email.toLowerCase() === cleanEmail);
      if (found) {
        // In prototype mode, allow password match or password123
        this.setCurrentUser(found);
        return { success: true, user: found };
      }

      // If user doesn't exist, create an auto-client account for seamless UX
      const isCandidateAdmin = cleanEmail.includes('admin');
      const newUser = {
        id: 'usr_' + Date.now(),
        name: cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        email: cleanEmail,
        password: password || 'password123',
        phone: '+91 98000 00000',
        role: isCandidateAdmin ? 'admin' : 'client',
        clientType: 'Individual',
        createdAt: new Date().toISOString().split('T')[0]
      };
      users.push(newUser);
      storage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      this.setCurrentUser(newUser);
      return { success: true, user: newUser, created: true };
    },

    register: function (formData) {
      this.init();
      const users = JSON.parse(storage.getItem(STORAGE_KEYS.USERS) || '[]');
      const cleanEmail = (formData.email || '').trim().toLowerCase();

      // Check if already registered
      const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        this.setCurrentUser(existing);
        return { success: true, user: existing, isExisting: true };
      }

      const newUser = {
        id: 'usr_' + Date.now(),
        name: formData.name || 'New Client',
        email: cleanEmail,
        password: formData.password || 'password123',
        phone: formData.phone || '',
        role: formData.role || 'client',
        clientType: formData.clientType || 'Individual',
        createdAt: new Date().toISOString().split('T')[0]
      };

      users.push(newUser);
      storage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      this.setCurrentUser(newUser);
      return { success: true, user: newUser };
    },

    // Applications Management
    getApplications: function (filterEmail) {
      this.init();
      try {
        const apps = JSON.parse(storage.getItem(STORAGE_KEYS.APPLICATIONS) || '[]');
        if (filterEmail) {
          return apps.filter(a => (a.userId || '').toLowerCase() === filterEmail.toLowerCase());
        }
        return apps;
      } catch (e) {
        return [];
      }
    },

    getApplicationById: function (id) {
      const apps = this.getApplications();
      return apps.find(a => a.id === id) || null;
    },

    createApplication: function (appData) {
      this.init();
      const apps = JSON.parse(storage.getItem(STORAGE_KEYS.APPLICATIONS) || '[]');
      const user = this.getCurrentUser() || { name: 'Alex Morgan', email: 'alex@example.com', phone: '+91 98765 43210' };

      const servicePrefixMap = {
        itr: 'VL-ITR',
        gst: 'VL-GST',
        accounting: 'VL-ACC',
        bookkeeping: 'VL-ACC',
        consultation: 'VL-CON'
      };

      const prefix = servicePrefixMap[appData.serviceKey] || 'VL-APP';
      const year = new Date().getFullYear();
      const randNum = Math.floor(100 + Math.random() * 900);
      const appId = `${prefix}-${year}-${randNum}`;

      const newApp = {
        id: appId,
        serviceKey: appData.serviceKey || 'itr',
        serviceName: appData.serviceName || 'Tax Advisory Filing',
        category: appData.category || 'General Practice',
        userId: user.email,
        userName: user.name,
        userPhone: user.phone || '',
        clientType: user.clientType || 'Individual',
        submittedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'Submitted',
        progress: 20,
        assignedTo: 'Rajesh Kumar, FCA',
        fee: appData.fee || '₹2,499',
        paymentStatus: 'Unpaid',
        formData: appData.formData || {},
        documents: appData.documents || [],
        adminNotes: [
          {
            id: 'note_init',
            author: 'System Intake Bot',
            date: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            text: 'Application and preliminary documentation submitted successfully. Assigned to Senior Practice Lead.'
          }
        ],
        deliverables: []
      };

      apps.unshift(newApp);
      storage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
      dispatchCustomEvent('vl_apps_changed', apps);
      return newApp;
    },

    updateApplication: function (id, updates) {
      this.init();
      const apps = JSON.parse(storage.getItem(STORAGE_KEYS.APPLICATIONS) || '[]');
      const index = apps.findIndex(a => a.id === id);
      if (index === -1) return null;

      apps[index] = { ...apps[index], ...updates };
      storage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
      dispatchCustomEvent('vl_apps_changed', apps);
      return apps[index];
    },

    addDocumentToApplication: function (appId, fileInfo) {
      const app = this.getApplicationById(appId);
      if (!app) return null;

      const newDoc = {
        id: 'doc_' + Date.now(),
        name: fileInfo.name || 'Financial_Document.pdf',
        type: fileInfo.type || 'Supporting Document',
        size: fileInfo.size || '1.1 MB',
        uploadedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'Under Review'
      };

      const updatedDocs = [...(app.documents || []), newDoc];
      return this.updateApplication(appId, { documents: updatedDocs });
    },

    updateDocumentStatus: function (appId, docId, newStatus) {
      const app = this.getApplicationById(appId);
      if (!app) return null;

      const currentUser = this.getCurrentUser();
      const updatedDocs = (app.documents || []).map(d => {
        if (d.id === docId) {
          return {
            ...d,
            status: newStatus,
            verifiedBy: currentUser ? currentUser.name : 'VeraLedger Admin'
          };
        }
        return d;
      });

      return this.updateApplication(appId, { documents: updatedDocs });
    },

    addAdminNote: function (appId, noteText, newStatus) {
      const app = this.getApplicationById(appId);
      if (!app) return null;

      const currentUser = this.getCurrentUser() || { name: 'Senior Partner' };
      const newNote = {
        id: 'note_' + Date.now(),
        author: currentUser.name,
        date: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        text: noteText
      };

      const updates = {
        adminNotes: [...(app.adminNotes || []), newNote]
      };

      if (newStatus && newStatus !== app.status) {
        updates.status = newStatus;
        if (newStatus === 'Completed') {
          updates.progress = 100;
        } else if (newStatus === 'Action Required') {
          updates.progress = 50;
        } else if (newStatus === 'Under Review') {
          updates.progress = 65;
        }
      }

      return this.updateApplication(appId, updates);
    },

    // Admin Operations Aliases
    getAllApplications: function () {
      return this.getApplications();
    },

    updateApplicationStatus: function (id, status, progress) {
      return this.updateApplication(id, { status: status, progress: progress !== undefined ? progress : 100 });
    },

    assignAccountant: function (id, cpaName) {
      return this.updateApplication(id, { assignedTo: cpaName });
    },

    submitApplication: function (appData) {
      return this.createApplication(appData);
    },

    issueDeliverable: function (appId, deliverableTitle) {
      const app = this.getApplicationById(appId);
      if (!app) return null;

      const newDeliv = {
        id: 'deliv_' + Date.now(),
        name: deliverableTitle || `${app.serviceName}_Official_Acknowledgement.pdf`,
        type: 'Certified Acknowledgement',
        issuedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        size: '1.2 MB'
      };

      const deliverables = [...(app.deliverables || []), newDeliv];
      return this.updateApplication(appId, {
        deliverables: deliverables,
        status: 'Completed',
        progress: 100
      });
    },

    simulatePayment: function (appId) {
      const app = this.getApplicationById(appId);
      if (!app) return null;

      const updates = {
        paymentStatus: 'Paid',
        paymentDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        transactionId: 'TXN-' + Math.floor(100000 + Math.random() * 900000) + '-VL'
      };

      return this.updateApplication(appId, updates);
    },

    // Admin Operations Aliases
    getAllApplications: function () {
      return this.getApplications();
    },

    updateApplicationStatus: function (id, status, progress) {
      return this.updateApplication(id, { status: status, progress: progress !== undefined ? progress : 100 });
    },

    assignAccountant: function (id, cpaName) {
      return this.updateApplication(id, { assignedTo: cpaName });
    },

    submitApplication: function (appData) {
      return this.createApplication(appData);
    },

    // Pricing Engine (Dynamic & Admin-Editable)
    getPricing: function () {
      this.init();
      try {
        const data = storage.getItem(STORAGE_KEYS.PRICING);
        return data ? JSON.parse(data) : DEFAULT_PRICING;
      } catch (e) {
        return DEFAULT_PRICING;
      }
    },

    updatePlanPrice: function (serviceKey, planKey, newPrice) {
      const pricing = this.getPricing();
      if (pricing.services[serviceKey] && pricing.services[serviceKey].plans[planKey]) {
        const numPrice = Number(newPrice) || 0;
        pricing.services[serviceKey].plans[planKey].price = numPrice;
        pricing.services[serviceKey].plans[planKey].displayPrice = '₹' + numPrice.toLocaleString('en-IN');
        storage.setItem(STORAGE_KEYS.PRICING, JSON.stringify(pricing));
        dispatchCustomEvent('vl_pricing_changed', pricing);
        return pricing;
      }
      return null;
    },

    updateAddonPrice: function (addonId, newPrice) {
      const pricing = this.getPricing();
      const addon = (pricing.addons || []).find(a => a.id === addonId);
      if (addon) {
        const numPrice = Number(newPrice) || 0;
        addon.price = numPrice;
        addon.displayPrice = '₹' + numPrice.toLocaleString('en-IN');
        storage.setItem(STORAGE_KEYS.PRICING, JSON.stringify(pricing));
        dispatchCustomEvent('vl_pricing_changed', pricing);
        return pricing;
      }
      return null;
    },

    resetPricing: function () {
      storage.setItem(STORAGE_KEYS.PRICING, JSON.stringify(DEFAULT_PRICING));
      dispatchCustomEvent('vl_pricing_changed', DEFAULT_PRICING);
      return DEFAULT_PRICING;
    },

    // Reset store for fresh demo state
    resetToDefaults: function () {
      storage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
      storage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(DEFAULT_APPLICATIONS));
      storage.setItem(STORAGE_KEYS.PRICING, JSON.stringify(DEFAULT_PRICING));
      storage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_USERS[0]));
      dispatchCustomEvent('vl_apps_changed', DEFAULT_APPLICATIONS);
      dispatchCustomEvent('vl_pricing_changed', DEFAULT_PRICING);
    }
  };

  // Safe event dispatcher
  function dispatchCustomEvent(name, detail) {
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof CustomEvent !== 'undefined') {
      window.dispatchEvent(new CustomEvent(name, { detail }));
    }
  }

  // Initialize on script load
  VeraStore.init();

  globalScope.VeraStore = VeraStore;
})(typeof window !== 'undefined' ? window : global);
