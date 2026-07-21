// src/App.jsx
import React, { useState, useEffect } from 'react';
import { db } from './db';
import {
  TrendingUp,
  ShoppingCart,
  User,
  Users,
  LogOut,
  Plus,
  Search,
  Trash2,
  Printer,
  Moon,
  Sun,
  History,
  Package,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  CheckCircle,
  Eye,
  RefreshCw,
  PlusCircle,
  X,
  Database,
  Menu
} from 'lucide-react';

function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('oliviana_current_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [emailInput, setEmailInput] = useState('owner@oliviana.com');
  const [selectedRole, setSelectedRole] = useState('OWNER'); // 'OWNER' | 'CASHIER'
  const [loginError, setLoginError] = useState('');

  // App Layout State
  const [activeTab, setActiveTab] = useState('pos'); // 'pos' | 'dashboard' | 'inventory' | 'debt' | 'history' | 'check-stock'
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('oliviana_dark_mode');
    return saved === 'true';
  });

  // Data Refresh State
  const [refreshKey, setRefreshKey] = useState(0);

  // Cart State (POS)
  const [cart, setCart] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH'); // 'CASH' | 'QRIS' | 'TRANSFER' | 'DEBT'
  const [paidAmount, setPaidAmount] = useState('');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');

  // Tipe Pelanggan & Skema Harga (UMUM: +15rb, GURU: +5rb, GROSIR: Base)
  const [customerType, setCustomerType] = useState('UMUM'); // 'UMUM' | 'GURU' | 'GROSIR'

  // Modal Pilihan Varian POS
  const [posSelectedCategory, setPosSelectedCategory] = useState(null);
  const [posModalProductId, setPosModalProductId] = useState('');
  const [posModalVariantId, setPosModalVariantId] = useState('');
  const [posModalQty, setPosModalQty] = useState(1);

  // Perhitungan Harga Jual Berdasarkan Tipe Pelanggan
  const getAdjustedPrice = (basePrice, type = customerType) => {
    const p = Number(basePrice || 0);
    if (type === 'GURU') return p + 5000;
    if (type === 'GROSIR') return p;
    return p + 15000; // Default UMUM
  };

  // Search & Filter State
  const [posSearchQuery, setPosSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
  const [stockSearchQuery, setStockSearchQuery] = useState('');
  const [selectedDbTable, setSelectedDbTable] = useState('users');
  const [mobilePosActiveView, setMobilePosActiveView] = useState('products'); // 'products' | 'cart'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'checkout-success' | 'factory-inbound' | 'repay-debt' | 'add-product' | 'add-variant'
  const [currentSaleInvoice, setCurrentSaleInvoice] = useState(null);

  // Selected variant for Factory Inbound
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [factoryInQty, setFactoryInQty] = useState('');
  const [factoryInNotes, setFactoryInNotes] = useState('');

  // Selected customer for Debt Repayment
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [debtRepayAmount, setDebtRepayAmount] = useState('');
  const [debtRepayMethod, setDebtRepayMethod] = useState('CASH');
  const [selectedDebtPayment, setSelectedDebtPayment] = useState(null);

  // Form states (Add Product & Variant)
  const [newProductCategory, setNewProductCategory] = useState('');
  const [newProductName, setNewProductName] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');

  const [newVariantProductId, setNewVariantProductId] = useState('');
  const [newVariantSize, setNewVariantSize] = useState('');
  const [newVariantColor, setNewVariantColor] = useState('Standard');
  const [newVariantCostPrice, setNewVariantCostPrice] = useState('');
  const [newVariantSellingPrice, setNewVariantSellingPrice] = useState('');
  const [newVariantStock, setNewVariantStock] = useState('0');

  // Trigger dark mode class in body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('oliviana_dark_mode', darkMode);
  }, [darkMode]);

  // Adjust active tab if user role restricts it
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'CASHIER' && ['dashboard', 'inventory', 'debt', 'history'].includes(activeTab)) {
        setActiveTab('pos');
      }
    }
  }, [currentUser, activeTab]);

  // Helper formatting rupiah
  const formatRupiah = (num) => {
    return 'Rp ' + Number(num).toLocaleString('id-ID');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    const user = db.login(emailInput, selectedRole);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('oliviana_current_user', JSON.stringify(user));
      // Default views based on roles
      if (user.role === 'OWNER') {
        setActiveTab('dashboard');
      } else {
        setActiveTab('pos');
      }
    } else {
      setLoginError('Email atau role tidak cocok. Silakan cek detail akun simulasi.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('oliviana_current_user');
    setCart([]);
  };

  const handleResetDB = () => {
    if (window.confirm('Apakah Anda yakin ingin me-reset database simulasi ke kondisi awal? Semua transaksi baru akan terhapus.')) {
      db.reset();
      setRefreshKey(prev => prev + 1);
      setCart([]);
      alert('Database berhasil di-reset.');
    }
  };

  // Cart operations
  const addToCart = (variant, qtyToAdd = 1) => {
    const existing = cart.find(item => item.id === variant.id);
    const product = db.find('products', p => p.id === variant.product_id);

    if (existing) {
      if (existing.quantity + qtyToAdd > variant.stock_quantity) {
        alert('Stok tidak mencukupi untuk menambah item.');
        return;
      }
      setCart(cart.map(item =>
        item.id === variant.id ? { ...item, quantity: item.quantity + qtyToAdd } : item
      ));
    } else {
      if (variant.stock_quantity < qtyToAdd) {
        alert('Stok tidak mencukupi.');
        return;
      }
      setCart([...cart, {
        id: variant.id,
        sku: variant.sku,
        name: product ? `${product.name} (${variant.size})` : variant.sku,
        size: variant.size,
        color: variant.color,
        base_selling_price: variant.selling_price,
        quantity: qtyToAdd,
        maxStock: variant.stock_quantity
      }]);
    }
  };

  const updateCartQty = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        if (newQty <= 0) return null;
        if (newQty > item.maxStock) {
          alert('Stok maksimum tercapai.');
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (getAdjustedPrice(item.base_selling_price) * item.quantity), 0);
  };

  // Add Customer (Quick in POS)
  const handleAddCustomer = (e) => {
    e.preventDefault();
    if (!newCustomerName) return;
    const added = db.insert('customers', {
      name: newCustomerName,
      phone_number: newCustomerPhone || '-',
      total_debt: 0
    });
    setSelectedCustomerId(added.id);
    setNewCustomerName('');
    setNewCustomerPhone('');
    setIsAddingCustomer(false);
    setRefreshKey(prev => prev + 1);
  };

  // Complete POS Sale
  const handleCheckout = (e) => {
    e.preventDefault();
    const total = getCartTotal();
    if (total <= 0) return;

    // Validasi pembayaran
    const paid = Number(paidAmount || 0);
    let status = 'PAID';

    if (paymentMethod === 'DEBT') {
      if (!selectedCustomerId) {
        alert('Pelanggan wajib dipilih untuk metode pembayaran Kasbon/Utang.');
        return;
      }
      if (paid === 0) {
        status = 'UNPAID';
      } else if (paid < total) {
        status = 'PARTIAL';
      } else {
        alert('Pembayaran tunai penuh tidak bisa bermetode Kasbon.');
        return;
      }
    } else {
      // Pembayaran cash/transfer/qris non-hutang
      if (paid < total) {
        alert('Jumlah pembayaran kurang dari total belanja.');
        return;
      }
    }

    const change = (paymentMethod !== 'DEBT') ? (paid - total) : 0;

    const saleData = {
      customer_id: selectedCustomerId || null,
      total_amount: total,
      payment_method: paymentMethod,
      payment_status: status,
      paid_amount: paid,
      change_amount: change
    };

    const items = cart.map(item => ({
      variant_id: item.id,
      quantity: item.quantity,
      price_per_unit: getAdjustedPrice(item.base_selling_price)
    }));

    try {
      const sale = db.createSale(saleData, items, currentUser.id);
      setCurrentSaleInvoice(sale);
      setCart([]);
      setSelectedCustomerId('');
      setPaymentMethod('CASH');
      setPaidAmount('');
      setRefreshKey(prev => prev + 1);
      setActiveModal('checkout-success');
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat memproses transaksi.');
    }
  };

  // Factory Inbound stok
  const handleFactoryInbound = (e) => {
    e.preventDefault();
    if (!selectedVariant || !factoryInQty) return;
    const qty = Number(factoryInQty);
    if (qty <= 0) {
      alert('Jumlah harus lebih dari 0.');
      return;
    }

    db.addStockFromFactory(selectedVariant.id, qty, factoryInNotes, currentUser.id);
    setSelectedVariant(null);
    setFactoryInQty('');
    setFactoryInNotes('');
    setActiveModal(null);
    setRefreshKey(prev => prev + 1);
    alert('Stok dari pabrik berhasil ditambahkan.');
  };

  // Debt payment
  const handleDebtRepayment = (e) => {
    e.preventDefault();
    if (!selectedCustomer || !debtRepayAmount) return;
    const amount = Number(debtRepayAmount);
    if (amount <= 0) {
      alert('Jumlah pembayaran harus lebih dari 0.');
      return;
    }
    if (amount > selectedCustomer.total_debt) {
      alert('Jumlah pembayaran melebihi utang yang dimiliki.');
      return;
    }

    const res = db.addDebtPayment(selectedCustomer.id, amount, debtRepayMethod, currentUser.id);
    setSelectedCustomer(null);
    setDebtRepayAmount('');
    setDebtRepayMethod('CASH');
    if (res && res.payment) {
      setSelectedDebtPayment(res.payment);
      setActiveModal('debt-receipt');
    } else {
      setActiveModal(null);
    }
    setRefreshKey(prev => prev + 1);
  };

  // Unified Add Product & Variant
  const handleUnifiedAddProductVariant = (e) => {
    e.preventDefault();
    if (!newVariantSize || !newVariantSellingPrice) return;

    let targetProductId = newVariantProductId;

    // A. Buat Produk Baru jika dipilih
    if (newVariantProductId === 'NEW_PRODUCT') {
      if (!newProductName || !newProductCategory) {
        alert('Nama produk dan kategori wajib diisi.');
        return;
      }

      const newProd = db.insert('products', {
        category_id: newProductCategory,
        name: newProductName,
        description: newProductDesc || ''
      });
      targetProductId = newProd.id;
    }

    if (!targetProductId) {
      alert('Pilih produk atau buat produk baru.');
      return;
    }

    const product = db.find('products', p => p.id === targetProductId);
    if (!product) {
      alert('Produk tidak ditemukan.');
      return;
    }

    // B. Buat SKU otomatis
    const prodSlug = product.name
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, '')
      .split(' ')
      .slice(0, 3)
      .join('-');

    const rawSku = `${prodSlug}-${newVariantSize.toUpperCase()}-${newVariantColor.toUpperCase()}`
      .replace(/\s+/g, '-');

    // Validasi SKU unik
    const existingVariants = db.get('product_variants');
    let finalSku = rawSku;
    let counter = 1;
    while (existingVariants.some(v => v.sku === finalSku)) {
      finalSku = `${rawSku}-${counter}`;
      counter++;
    }

    const newVar = {
      product_id: targetProductId,
      sku: finalSku,
      size: newVariantSize,
      color: newVariantColor || 'Standard',
      cost_price: Number(newVariantCostPrice || 0),
      selling_price: Number(newVariantSellingPrice),
      stock_quantity: Number(newVariantStock || 0)
    };

    const inserted = db.insert('product_variants', newVar);

    // C. Jika stock awal > 0, catat sebagai stock movement
    if (newVar.stock_quantity > 0) {
      db.insert('stock_movements', {
        variant_id: inserted.id,
        type: 'FACTORY_IN',
        quantity: newVar.stock_quantity,
        notes: 'Penerimaan/Stok Awal Varian',
        created_by: currentUser.id
      });
    }

    // Reset Form
    setNewProductName('');
    setNewProductDesc('');
    setNewProductCategory('');
    setNewVariantProductId('');
    setNewVariantSize('');
    setNewVariantColor('Standard');
    setNewVariantCostPrice('');
    setNewVariantSellingPrice('');
    setNewVariantStock('0');

    setActiveModal(null);
    setRefreshKey(prev => prev + 1);
    alert('Produk dan Varian berhasil disimpan.');
  };

  // Calculate Owner Dashboard metrics
  const getDashboardData = () => {
    const sales = db.get('sales');
    const saleItems = db.get('sale_items');
    const variants = db.get('product_variants');
    const customers = db.get('customers');

    let totalGrossSales = 0;
    let totalCostOfGoodsSold = 0;

    sales.forEach(sale => {
      totalGrossSales += sale.total_amount;
    });

    saleItems.forEach(item => {
      const variant = variants.find(v => v.id === item.variant_id);
      const cost = variant ? variant.cost_price : 0;
      totalCostOfGoodsSold += (cost * item.quantity);
    });

    const netProfit = totalGrossSales - totalCostOfGoodsSold;

    let totalStockValuation = 0;
    variants.forEach(v => {
      totalStockValuation += (v.cost_price * v.stock_quantity);
    });

    let totalOutstandingDebt = 0;
    customers.forEach(c => {
      totalOutstandingDebt += c.total_debt;
    });

    return {
      grossSales: totalGrossSales,
      netProfit: netProfit,
      stockValuation: totalStockValuation,
      outstandingDebt: totalOutstandingDebt
    };
  };

  // Print Thermal simulator logic
  const triggerPrintSim = () => {
    window.print();
  };

  // --- RENDERS ---

  // LOGIN SCREEN
  if (!currentUser) {
    return (
      <div className="login-container">
        <main className="card login-card">
          <header>
            <div className="login-logo">Oliviana POS</div>
            <p className="login-subtitle">Manajemen Stok & Kasir Terintegrasi</p>
          </header>

          <div className="login-role-selector">
            <button
              type="button"
              className={`login-role-btn ${selectedRole === 'OWNER' ? 'active' : ''}`}
              onClick={() => {
                setSelectedRole('OWNER');
                setEmailInput('owner@oliviana.com');
              }}
            >
              Owner
            </button>
            <button
              type="button"
              className={`login-role-btn ${selectedRole === 'CASHIER' ? 'active' : ''}`}
              onClick={() => {
                setSelectedRole('CASHIER');
                setEmailInput('kasir@oliviana.com');
              }}
            >
              Kasir
            </button>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="login-email" className="form-label">Email Pengguna</label>
              <input
                id="login-email"
                type="email"
                className="form-control"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="login-pass" className="form-label">Password</label>
              <input
                id="login-pass"
                type="password"
                className="form-control"
                placeholder="•••••••• (Bebas untuk simulasi)"
                defaultValue="123456"
              />
            </div>

            {loginError && <p style={{ color: 'var(--danger)', fontSize: '13px', margin: '8px 0 16px', textAlign: 'left' }}>{loginError}</p>}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
              Masuk ke Aplikasi
            </button>
          </form>

          <div className="login-help-info">
            <strong>Akun Simulasi Default:</strong>
            <ul style={{ paddingLeft: '20px', marginTop: '6px', listStyleType: 'disc' }}>
              <li>Owner: <code>owner@oliviana.com</code></li>
              <li>Kasir: <code>kasir@oliviana.com</code></li>
            </ul>
          </div>
        </main>
      </div>
    );
  }

  const dashboardMetrics = getDashboardData();
  const allVariants = db.get('product_variants');
  const allProducts = db.get('products');
  const allCustomers = db.get('customers');
  const allCategories = db.get('categories');
  const allSales = db.get('sales');
  const allMovements = db.get('stock_movements');
  const allDebtPayments = db.get('debt_payments');

  // Filter POS products
  const filteredPOSProducts = allVariants.filter(variant => {
    const product = allProducts.find(p => p.id === variant.product_id);
    if (!product) return false;

    // Filter kategori
    if (selectedCategoryFilter && product.category_id !== selectedCategoryFilter) return false;

    // Filter search query (nama, SKU, size)
    const searchString = `${product.name} ${variant.sku} ${variant.size} ${variant.color}`.toLowerCase();
    return searchString.includes(posSearchQuery.toLowerCase());
  });

  return (
    <div className="app-container">
      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div className="mobile-sidebar-overlay" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div>
          <div className="sidebar-brand">
            <span className="sidebar-logo">Oliviana POS</span>
          </div>

          <nav className="sidebar-menu">
            {currentUser.role === 'OWNER' && (
              <>
                <button
                  type="button"
                  className={`sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
                >
                  <TrendingUp size={18} />
                  Ringkasan Keuangan
                </button>
                <button
                  type="button"
                  className={`sidebar-item ${activeTab === 'inventory' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('inventory'); setIsMobileMenuOpen(false); }}
                >
                  <Package size={18} />
                  Kelola Stok & Produk
                </button>
                <button
                  type="button"
                  className={`sidebar-item ${activeTab === 'debt' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('debt'); setIsMobileMenuOpen(false); }}
                >
                  <Users size={18} />
                  Utang & Kasbon
                </button>
                <button
                  type="button"
                  className={`sidebar-item ${activeTab === 'history' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('history'); setIsMobileMenuOpen(false); }}
                >
                  <History size={18} />
                  Riwayat Transaksi
                </button>
                <button
                  type="button"
                  className={`sidebar-item ${activeTab === 'db-viewer' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('db-viewer'); setIsMobileMenuOpen(false); }}
                >
                  <Database size={18} />
                  Inspektor Database
                </button>
              </>
            )}

            <button
              type="button"
              className={`sidebar-item ${activeTab === 'pos' ? 'active' : ''}`}
              onClick={() => { setActiveTab('pos'); setIsMobileMenuOpen(false); }}
            >
              <ShoppingCart size={18} />
              Kasir POS
            </button>

            <button
              type="button"
              className={`sidebar-item ${activeTab === 'check-stock' ? 'active' : ''}`}
              onClick={() => { setActiveTab('check-stock'); setIsMobileMenuOpen(false); }}
            >
              <Eye size={18} />
              Cek Stok Barang
            </button>
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              {currentUser.name.charAt(0)}
            </div>
            <div className="user-info">
              <span className="user-name">{currentUser.name}</span>
              <span className="user-role">{currentUser.role === 'OWNER' ? 'Owner Toko' : 'Kasir'}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm btn-icon"
              style={{ flex: 1 }}
              onClick={() => setDarkMode(!darkMode)}
              title="Ganti Tema"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button
              type="button"
              className="btn btn-danger btn-sm btn-icon"
              style={{ flex: 1 }}
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '11px', padding: '4px' }}
            onClick={handleResetDB}
          >
            <RefreshCw size={10} /> Reset DB Simulasi
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="main-content">
        {/* MOBILE TOP HEADER BAR */}
        <div className="mobile-header" style={{ display: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm btn-icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              title="Menu Navigasi"
            >
              <Menu size={20} />
            </button>
            <span style={{ fontWeight: 'bold', fontSize: '18px', background: 'linear-gradient(135deg, var(--primary), var(--info))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              OLIVIANA
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm btn-icon"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>

        {/* HEADER BAR */}
        <header className="header-bar">
          <div className="header-title">
            {activeTab === 'dashboard' && (
              <>
                <h1>Ringkasan Keuangan</h1>
                <p>Pantau performa penjualan, laba bersih, dan utang toko.</p>
              </>
            )}
            {activeTab === 'inventory' && (
              <>
                <h1>Manajemen Produk & Stok</h1>
                <p>Tambah varian baju, atur harga jual, dan terima barang dari pabrik konveksi.</p>
              </>
            )}
            {activeTab === 'debt' && (
              <>
                <h1>Buku Kasbon & Utang</h1>
                <p>Catat dan kelola piutang pelanggan beserta pembayaran cicilan.</p>
              </>
            )}
            {activeTab === 'history' && (
              <>
                <h1>Riwayat Transaksi Penjualan</h1>
                <p>Laporan detail invoice penjualan toko Oliviana.</p>
              </>
            )}
            {activeTab === 'pos' && (
              <>
                <h1>Kasir Point of Sale (POS)</h1>
                <p>Pencatatan penjualan cepat tanpa barcode scanner.</p>
              </>
            )}
            {activeTab === 'check-stock' && (
              <>
                <h1>Cek Stok Barang</h1>
                <p>Cari sisa stok produk secara real-time berdasarkan ukuran & nama.</p>
              </>
            )}
            {activeTab === 'db-viewer' && (
              <>
                <h1>Inspektor Database</h1>
                <p>Lihat data tabel database lokal (LocalStorage) secara visual.</p>
              </>
            )}
          </div>
          <div className="header-actions">
            <span className="badge info" style={{ padding: '8px 12px', fontSize: '12px' }}>
              Mode Aktif: {currentUser.role === 'OWNER' ? 'Akses Owner (Penuh)' : 'Akses Kasir (Terbatas)'}
            </span>
          </div>
        </header>

        {/* --- DYNAMIC TAB CONTENTS --- */}

        {/* 1. OWNER DASHBOARD */}
        {activeTab === 'dashboard' && currentUser.role === 'OWNER' && (
          <section>
            {/* Cards Grid */}
            <div className="stats-grid">
              <div className="card stat-card">
                <div className="stat-icon-wrapper success">
                  <TrendingUp size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Omset Penjualan (Gross)</span>
                  <span className="stat-value">{formatRupiah(dashboardMetrics.grossSales)}</span>
                </div>
              </div>

              <div className="card stat-card">
                <div className="stat-icon-wrapper primary">
                  <TrendingUp size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Keuntungan Bersih (Profit)</span>
                  <span className="stat-value">{formatRupiah(dashboardMetrics.netProfit)}</span>
                </div>
              </div>

              <div className="card stat-card">
                <div className="stat-icon-wrapper warning">
                  <Package size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Valuasi Stok Toko (Modal)</span>
                  <span className="stat-value">{formatRupiah(dashboardMetrics.stockValuation)}</span>
                </div>
              </div>

              <div className="card stat-card">
                <div className="stat-icon-wrapper danger">
                  <Users size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Piutang Kasbon Pelanggan</span>
                  <span className="stat-value">{formatRupiah(dashboardMetrics.outstandingDebt)}</span>
                </div>
              </div>
            </div>

            {/* Dashboard Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px' }}>

              {/* Recent Transactions */}
              <div className="card">
                <h2 className="card-title">Penjualan Terbaru</h2>
                <div className="table-wrapper">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Invoice</th>
                        <th>Pelanggan</th>
                        <th>Total</th>
                        <th>Metode</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allSales.slice(-5).reverse().map(sale => {
                        const cust = allCustomers.find(c => c.id === sale.customer_id);
                        return (
                          <tr key={sale.id}>
                            <td><strong>{sale.invoice_number}</strong></td>
                            <td>{cust ? cust.name : 'Umum (Walk-in)'}</td>
                            <td>{formatRupiah(sale.total_amount)}</td>
                            <td>
                              <span className={`badge ${sale.payment_method === 'CASH' ? 'success' :
                                  sale.payment_method === 'DEBT' ? 'danger' : 'info'
                                }`}>
                                {sale.payment_method}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                      {allSales.length === 0 && (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center' }}>Belum ada data penjualan.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Stock Movements Log */}
              <div className="card">
                <h2 className="card-title">Log Mutasi Stok (Pabrik & Penjualan)</h2>
                <div className="table-wrapper">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Tanggal</th>
                        <th>Barang</th>
                        <th>Mutasi</th>
                        <th>Keterangan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allMovements.slice(-5).reverse().map(mov => {
                        const variant = allVariants.find(v => v.id === mov.variant_id);
                        const prod = variant ? allProducts.find(p => p.id === variant.product_id) : null;
                        return (
                          <tr key={mov.id}>
                            <td>{new Date(mov.created_at).toLocaleDateString('id-ID')}</td>
                            <td>
                              {prod ? prod.name : 'Unknown'} ({variant ? variant.size : '-'})
                            </td>
                            <td>
                              <span style={{
                                fontWeight: 'bold',
                                color: mov.quantity > 0 ? 'var(--success)' : 'var(--danger)'
                              }}>
                                {mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity}
                              </span>
                            </td>
                            <td style={{ fontSize: '12px' }}>{mov.notes}</td>
                          </tr>
                        );
                      })}
                      {allMovements.length === 0 && (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center' }}>Belum ada mutasi stok.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </section>
        )}

        {/* 2. KASIR POS VIEW */}
        {activeTab === 'pos' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

            {/* Segmented Control untuk Mobile View POS */}
            <div className="pos-mobile-toggle segmented-control">
              <button
                type="button"
                className={`segmented-option ${mobilePosActiveView === 'products' ? 'active' : ''}`}
                onClick={() => setMobilePosActiveView('products')}
              >
                Katalog Produk ({filteredPOSProducts.length})
              </button>
              <button
                type="button"
                className={`segmented-option ${mobilePosActiveView === 'cart' ? 'active' : ''}`}
                onClick={() => setMobilePosActiveView('cart')}
              >
                Keranjang ({cart.reduce((s, i) => s + i.quantity, 0)})
              </button>
            </div>

            <section className={`pos-layout ${mobilePosActiveView === 'products' ? 'show-products' : 'show-cart'}`}>

              {/* Products Panel (Left) */}
              <div className="pos-products-panel">
                <div className="search-filter-bar">
                  <div className="search-input-wrapper">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Cari cepat nama seragam, SKU, atau ukuran... (misal: S, M, Hem)"
                      value={posSearchQuery}
                      onChange={(e) => setPosSearchQuery(e.target.value)}
                      style={{ paddingLeft: '40px' }}
                    />
                    <Search size={18} style={{ position: 'absolute', left: '14px', top: '12px', color: 'var(--text-muted)' }} />
                  </div>
                </div>

                {/* Grid of Category Cards */}
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px', color: 'var(--text-secondary)' }}>Pilih Kategori Seragam:</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                  {allCategories.map(cat => {
                    const catProducts = allProducts.filter(p => p.category_id === cat.id);
                    const catVariantsCount = allVariants.filter(v => catProducts.some(p => p.id === v.product_id)).length;

                    return (
                      <div 
                        key={cat.id} 
                        className="card"
                        onClick={() => {
                          setPosSelectedCategory(cat);
                          if (catProducts.length > 0) {
                            setPosModalProductId(catProducts[0].id);
                            const vars = allVariants.filter(v => v.product_id === catProducts[0].id);
                            if (vars.length > 0) setPosModalVariantId(vars[0].id);
                            else setPosModalVariantId('');
                          } else {
                            setPosModalProductId('');
                            setPosModalVariantId('');
                          }
                          setPosModalQty(1);
                          setActiveModal('pos-select-item');
                        }}
                        style={{ cursor: 'pointer', border: '1px solid var(--card-border)', transition: 'transform 0.15s, box-shadow 0.15s', padding: '16px' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Package size={20} />
                          </div>
                          <span className="badge info">{catProducts.length} Baju</span>
                        </div>
                        <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>{cat.name}</h4>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                          {catVariantsCount} Varian Ukuran/Warna
                        </p>
                        <div style={{ marginTop: '12px', fontSize: '12px', fontWeight: 'bold', color: 'var(--primary)' }}>
                          + Pilih Barang & Ukuran &rarr;
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Instant Search Results if posSearchQuery typed */}
                {posSearchQuery && (
                  <>
                    <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px', color: 'var(--text-secondary)' }}>Hasil Pencarian:</h3>
                    <div className="products-grid">
                      {filteredPOSProducts.map(variant => {
                        const product = allProducts.find(p => p.id === variant.product_id);
                        const isLowStock = variant.stock_quantity < 5;

                        return (
                          <div
                            key={variant.id}
                            className={`product-item-card ${variant.stock_quantity === 0 ? 'disabled' : ''}`}
                            onClick={() => variant.stock_quantity > 0 && addToCart(variant)}
                            style={{ opacity: variant.stock_quantity === 0 ? 0.6 : 1 }}
                          >
                            <div>
                              <div className="product-item-name">{product ? product.name : 'Unknown'}</div>
                              <div className="product-item-sku">{variant.sku}</div>

                              <div className="product-item-details">
                                <span className="product-item-size">{variant.size} - {variant.color}</span>
                                <span className={`product-item-stock ${isLowStock ? 'low' : 'ok'}`}>
                                  Stok: {variant.stock_quantity}
                                </span>
                              </div>
                            </div>

                            <div>
                              <div className="product-item-price">{formatRupiah(getAdjustedPrice(variant.selling_price))}</div>
                            </div>
                          </div>
                        );
                      })}

                      {filteredPOSProducts.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                          Produk tidak ditemukan.
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Cart Panel (Right) */}
              <form onSubmit={handleCheckout} className="pos-cart-panel">
                <header className="cart-header">
                  <h3>Keranjang Belanja</h3>
                  <span className="badge info">{cart.reduce((s, i) => s + i.quantity, 0)} Barang</span>
                </header>

                <div className="cart-items-list">
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-info">
                        <span className="cart-item-title">{item.name}</span>
                        <span className="cart-item-sku">{item.sku} - {item.color}</span>
                        <div className="cart-item-qty-control">
                          <button type="button" className="qty-btn" onClick={() => updateCartQty(item.id, -1)}>-</button>
                          <span className="qty-val">{item.quantity}</span>
                          <button type="button" className="qty-btn" onClick={() => updateCartQty(item.id, 1)}>+</button>
                        </div>
                      </div>

                      <div className="cart-item-price-info">
                        <button type="button" className="cart-item-delete" onClick={() => removeFromCart(item.id)}>
                          <Trash2 size={16} />
                        </button>
                        <span className="cart-item-subtotal">{formatRupiah(getAdjustedPrice(item.base_selling_price) * item.quantity)}</span>
                      </div>
                    </div>
                  ))}

                  {cart.length === 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                      <ShoppingCart size={40} style={{ marginBottom: '12px', opacity: 0.5 }} />
                      <p>Keranjang kosong. Klik kategori di sebelah kiri untuk memilih barang.</p>
                    </div>
                  )}
                </div>

                {/* Checkout Form Actions */}
                {cart.length > 0 && (
                  <div className="cart-summary">

                    {/* Tipe Pelanggan & Skema Harga Selector */}
                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-label">Tipe Pelanggan & Skema Harga</label>
                      <div className="segmented-control">
                        <button
                          type="button"
                          className={`segmented-option ${customerType === 'UMUM' ? 'active' : ''}`}
                          onClick={() => setCustomerType('UMUM')}
                        >
                          Umum (+15rb)
                        </button>
                        <button
                          type="button"
                          className={`segmented-option ${customerType === 'GURU' ? 'active' : ''}`}
                          onClick={() => setCustomerType('GURU')}
                        >
                          Guru (+5rb)
                        </button>
                        <button
                          type="button"
                          className={`segmented-option ${customerType === 'GROSIR' ? 'active' : ''}`}
                          onClick={() => setCustomerType('GROSIR')}
                        >
                          Grosir (Base)
                        </button>
                      </div>
                    </div>

                    {/* Select Customer */}
                    <div className="form-group" style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label htmlFor="select-customer" className="form-label">Pelanggan</label>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '2px 8px', fontSize: '11px' }}
                          onClick={() => setIsAddingCustomer(!isAddingCustomer)}
                        >
                          {isAddingCustomer ? 'Batal' : '+ Pelanggan Baru'}
                        </button>
                      </div>

                      {isAddingCustomer ? (
                        <div className="card" style={{ padding: '12px', marginTop: '6px' }}>
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Nama Pelanggan"
                              value={newCustomerName}
                              onChange={(e) => setNewCustomerName(e.target.value)}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="No HP"
                              value={newCustomerPhone}
                              onChange={(e) => setNewCustomerPhone(e.target.value)}
                            />
                          </div>
                          <button type="button" className="btn btn-primary btn-sm" onClick={handleAddCustomer}>Simpan</button>
                        </div>
                      ) : (
                        <div style={{ position: 'relative' }}>
                          {selectedCustomerId ? (
                            // Tampilan pelanggan terpilih
                            (() => {
                              const selCustomer = allCustomers.find(c => c.id === selectedCustomerId);
                              return (
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '10px 14px',
                                  borderRadius: 'var(--border-radius-md)',
                                  border: '1px solid var(--primary)',
                                  backgroundColor: 'var(--primary-light)',
                                  color: 'var(--primary)',
                                  fontWeight: '600'
                                }}>
                                  <span>{selCustomer ? `${selCustomer.name} ${selCustomer.total_debt > 0 ? `(Utang: ${formatRupiah(selCustomer.total_debt)})` : ''}` : 'Umum (Walk-in)'}</span>
                                  <button
                                    type="button"
                                    onClick={() => { setSelectedCustomerId(''); setCustomerSearchQuery(''); }}
                                    style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              );
                            })()
                          ) : (
                            // Kolom input pencarian pelanggan
                            <>
                              <div style={{ position: 'relative' }}>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Ketik nama / HP pelanggan..."
                                  value={customerSearchQuery}
                                  onChange={(e) => setCustomerSearchQuery(e.target.value)}
                                  style={{ paddingRight: '32px' }}
                                />
                                {customerSearchQuery && (
                                  <button
                                    type="button"
                                    onClick={() => setCustomerSearchQuery('')}
                                    style={{ position: 'absolute', right: '10px', top: '12px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                                  >
                                    <X size={14} />
                                  </button>
                                )}
                              </div>

                              {/* Rekomendasi Hasil Pencarian Pelanggan */}
                              {customerSearchQuery && (
                                <div style={{
                                  position: 'absolute',
                                  top: '100%',
                                  left: 0,
                                  right: 0,
                                  backgroundColor: 'var(--card-bg)',
                                  border: '1px solid var(--card-border)',
                                  borderRadius: 'var(--border-radius-md)',
                                  marginTop: '4px',
                                  zIndex: 100,
                                  maxHeight: '200px',
                                  overflowY: 'auto',
                                  boxShadow: 'var(--card-shadow)'
                                }}>
                                  {allCustomers.filter(c => c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) || (c.phone_number && c.phone_number.includes(customerSearchQuery))).length > 0 ? (
                                    allCustomers
                                      .filter(c => c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) || (c.phone_number && c.phone_number.includes(customerSearchQuery)))
                                      .map(c => (
                                        <div
                                          key={c.id}
                                          onClick={() => {
                                            setSelectedCustomerId(c.id);
                                            setCustomerSearchQuery('');
                                          }}
                                          style={{
                                            padding: '10px 14px',
                                            cursor: 'pointer',
                                            borderBottom: '1px solid var(--card-border)',
                                            fontSize: '13px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                          }}
                                          className="customer-search-item"
                                        >
                                          <div>
                                            <strong>{c.name}</strong>
                                            {c.phone_number && <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{c.phone_number}</div>}
                                          </div>
                                          {c.total_debt > 0 && <span style={{ color: 'var(--danger)', fontWeight: '600' }}>Utang: {formatRupiah(c.total_debt)}</span>}
                                        </div>
                                      ))
                                  ) : (
                                    <div style={{ padding: '12px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
                                      Pelanggan tidak ditemukan.
                                    </div>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Payment Method */}
                    <div className="form-group" style={{ marginBottom: '8px' }}>
                      <label className="form-label">Metode Pembayaran</label>
                      <div className="segmented-control">
                        <button
                          type="button"
                          className={`segmented-option ${paymentMethod === 'CASH' ? 'active' : ''}`}
                          onClick={() => { setPaymentMethod('CASH'); setPaidAmount(''); }}
                        >
                          Tunai
                        </button>
                        <button
                          type="button"
                          className={`segmented-option ${paymentMethod === 'QRIS' ? 'active' : ''}`}
                          onClick={() => { setPaymentMethod('QRIS'); setPaidAmount(getCartTotal()); }}
                        >
                          QRIS
                        </button>
                        <button
                          type="button"
                          className={`segmented-option ${paymentMethod === 'TRANSFER' ? 'active' : ''}`}
                          onClick={() => { setPaymentMethod('TRANSFER'); setPaidAmount(getCartTotal()); }}
                        >
                          Transfer
                        </button>
                        <button
                          type="button"
                          className={`segmented-option ${paymentMethod === 'DEBT' ? 'active' : ''}`}
                          onClick={() => { setPaymentMethod('DEBT'); setPaidAmount('0'); }}
                        >
                          Utang/Kasbon
                        </button>
                      </div>
                    </div>

                    {/* Numeric Inputs */}
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="paid-amount" className="form-label">Uang Dibayar</label>
                        <input
                          id="paid-amount"
                          type="number"
                          className="form-control"
                          placeholder="Masukkan nominal..."
                          value={paidAmount}
                          onChange={(e) => setPaidAmount(e.target.value)}
                          required={paymentMethod !== 'DEBT'}
                        />
                      </div>
                      {paymentMethod !== 'DEBT' && paidAmount && (
                        <div className="form-group">
                          <label className="form-label">Kembalian</label>
                          <div style={{ fontSize: '18px', fontWeight: 'bold', paddingTop: '8px', color: 'var(--success)' }}>
                            {formatRupiah(Math.max(0, Number(paidAmount) - getCartTotal()))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="cart-summary-row total">
                      <span>Total Belanja</span>
                      <span>{formatRupiah(getCartTotal())}</span>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                      Proses Transaksi
                    </button>
                  </div>
                )}
              </form>
            </section>
          </div>
        )}

        {/* 3. OWNER: MANAGE PRODUCTS & INVENTORY */}
        {activeTab === 'inventory' && currentUser.role === 'OWNER' && (
          <section>

            {/* Header section action buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '24px' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setNewProductName('');
                  setNewProductDesc('');
                  if (allCategories.length > 0) setNewProductCategory(allCategories[0].id);
                  if (allProducts.length > 0) {
                    setNewVariantProductId(allProducts[0].id);
                  } else {
                    setNewVariantProductId('NEW_PRODUCT');
                  }
                  setNewVariantSize('S');
                  setNewVariantColor('Standard');
                  setNewVariantCostPrice('');
                  setNewVariantSellingPrice('');
                  setNewVariantStock('0');
                  setActiveModal('add-product-variant');
                }}
              >
                <Plus size={16} /> Tambah Produk / Varian Baru
              </button>
            </div>

            {/* List Products and their variants */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {allProducts.map(product => {
                const category = allCategories.find(c => c.id === product.category_id);
                const variants = allVariants.filter(v => v.product_id === product.id).sort((a, b) => a.sku.localeCompare(b.sku));

                return (
                  <div key={product.id} className="card">
                    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--card-border)', paddingBottom: '12px', marginBottom: '16px' }}>
                      <div>
                        <span className="badge info" style={{ marginBottom: '6px' }}>{category ? category.name : 'Umum'}</span>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>{product.name}</h2>
                        {product.description && <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{product.description}</p>}
                      </div>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          if (window.confirm(`Yakin ingin menghapus produk "${product.name}" beserta semua variannya?`)) {
                            db.delete('products', product.id);
                            // Hapus varian-varian produk ini
                            variants.forEach(v => db.delete('product_variants', v.id));
                            setRefreshKey(prev => prev + 1);
                          }
                        }}
                      >
                        Hapus Produk
                      </button>
                    </header>

                    {/* Variants Table */}
                    <div className="table-wrapper">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>SKU</th>
                            <th>Ukuran</th>
                            <th>Warna</th>
                            <th>Harga Modal (Pabrik)</th>
                            <th>Harga Jual (Toko)</th>
                            <th>Sisa Stok</th>
                            <th style={{ textAlign: 'right' }}>Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {variants.map(variant => (
                            <tr key={variant.id}>
                              <td><code style={{ fontSize: '13px' }}>{variant.sku}</code></td>
                              <td><strong>{variant.size}</strong></td>
                              <td>{variant.color}</td>
                              <td>{formatRupiah(variant.cost_price)}</td>
                              <td>{formatRupiah(variant.selling_price)}</td>
                              <td>
                                <span className={`badge ${variant.stock_quantity < 5 ? 'danger' : 'success'}`}>
                                  {variant.stock_quantity} Pcs
                                </span>
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <div style={{ display: 'inline-flex', gap: '6px' }}>
                                  <button
                                    type="button"
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => {
                                      setSelectedVariant(variant);
                                      setFactoryInQty('');
                                      setFactoryInNotes(`Penerimaan barang pabrik SKU: ${variant.sku}`);
                                      setActiveModal('factory-inbound');
                                    }}
                                  >
                                    <Plus size={12} /> Terima Barang Pabrik
                                  </button>

                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm btn-icon"
                                    onClick={() => {
                                      if (window.confirm(`Hapus varian SKU: ${variant.sku}?`)) {
                                        db.delete('product_variants', variant.id);
                                        setRefreshKey(prev => prev + 1);
                                      }
                                    }}
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {variants.length === 0 && (
                            <tr>
                              <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '16px' }}>
                                Belum ada varian ukuran/warna untuk produk ini.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}

              {allProducts.length === 0 && (
                <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  Belum ada produk terdaftar. Klik "Tambah Produk Baru" untuk memulai.
                </div>
              )}
            </div>
          </section>
        )}

        {/* 4. OWNER: MANAGE DEBT / KASBON */}
        {activeTab === 'debt' && currentUser.role === 'OWNER' && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {(() => {
              const activeDebtCustomers = allCustomers.filter(c => c.total_debt > 0);
              const settledCustomers = allCustomers.filter(c => c.total_debt === 0);

              return (
                <>
                  {/* List Customers with outstanding debt */}
                  <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h2 className="card-title" style={{ margin: 0 }}>Daftar Piutang & Kasbon Aktif</h2>
                      <span className="badge warning">{activeDebtCustomers.length} Pelanggan Belum Lunas</span>
                    </div>
                    <div className="table-wrapper">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Nama Pelanggan</th>
                            <th>Nomor HP</th>
                            <th>Total Utang Aktif</th>
                            <th>Tanggal Terdaftar</th>
                            <th style={{ textAlign: 'right' }}>Tindakan</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeDebtCustomers.map(cust => (
                            <tr key={cust.id}>
                              <td><strong>{cust.name}</strong></td>
                              <td>{cust.phone_number}</td>
                              <td>
                                <span style={{
                                  fontWeight: 'bold',
                                  color: 'var(--danger)',
                                  fontSize: '15px'
                                }}>
                                  {formatRupiah(cust.total_debt)}
                                </span>
                              </td>
                              <td>{new Date(cust.created_at).toLocaleDateString('id-ID')}</td>
                              <td style={{ textAlign: 'right' }}>
                                <button
                                  type="button"
                                  className="btn btn-success btn-sm"
                                  onClick={() => {
                                    setSelectedCustomer(cust);
                                    setDebtRepayAmount('');
                                    setDebtRepayMethod('CASH');
                                    setActiveModal('repay-debt');
                                  }}
                                >
                                  <CreditCard size={14} /> Catat Pembayaran Cicilan
                                </button>
                              </td>
                            </tr>
                          ))}
                          {activeDebtCustomers.length === 0 && (
                            <tr>
                              <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                                Tidak ada piutang/kasbon aktif. Semua pelanggan dalam kondisi lunas! 🎉
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* List Settled Customers */}
                  <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h2 className="card-title" style={{ margin: 0 }}>Daftar Pelanggan Lunas (Bebas Utang)</h2>
                      <span className="badge success">{settledCustomers.length} Pelanggan Lunas</span>
                    </div>
                    <div className="table-wrapper">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Nama Pelanggan</th>
                            <th>Nomor HP</th>
                            <th>Status Utang</th>
                            <th>Tanggal Terdaftar</th>
                          </tr>
                        </thead>
                        <tbody>
                          {settledCustomers.map(cust => (
                            <tr key={cust.id}>
                              <td><strong>{cust.name}</strong></td>
                              <td>{cust.phone_number}</td>
                              <td>
                                <span className="badge success">LUNAS (Rp 0)</span>
                              </td>
                              <td>{new Date(cust.created_at).toLocaleDateString('id-ID')}</td>
                            </tr>
                          ))}
                          {settledCustomers.length === 0 && (
                            <tr>
                              <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Belum ada pelanggan lunas.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              );
            })()}

            {/* Debt Payments History */}
            <div className="card">
              <h2 className="card-title">Riwayat Pembayaran Cicilan</h2>
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Tanggal</th>
                      <th>Nama Pelanggan</th>
                      <th>Jumlah Bayar</th>
                      <th>Metode</th>
                      <th>Kasir Penerima</th>
                      <th style={{ textAlign: 'right' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allDebtPayments.slice().reverse().map(payment => {
                      const cust = allCustomers.find(c => c.id === payment.customer_id);
                      const cashier = db.find('users', u => u.id === payment.cashier_id);
                      return (
                        <tr key={payment.id}>
                          <td>{new Date(payment.created_at).toLocaleString('id-ID')}</td>
                          <td><strong>{cust ? cust.name : 'Unknown'}</strong></td>
                          <td style={{ color: 'var(--success)', fontWeight: 'bold' }}>
                            {formatRupiah(payment.amount_paid)}
                          </td>
                          <td>
                            <span className="badge info">{payment.payment_method}</span>
                          </td>
                          <td>{cashier ? cashier.name : 'Kasir'}</td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => {
                                setSelectedDebtPayment(payment);
                                setActiveModal('debt-receipt');
                              }}
                            >
                              <Printer size={12} /> Struk
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {allDebtPayments.length === 0 && (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Belum ada riwayat cicilan.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </section>
        )}

        {/* 5. OWNER: SALES HISTORY */}
        {activeTab === 'history' && currentUser.role === 'OWNER' && (
          <section className="card">
            <h2 className="card-title">Semua Laporan Invoice Penjualan</h2>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nomor Invoice</th>
                    <th>Waktu/Tanggal</th>
                    <th>Nama Kasir</th>
                    <th>Pelanggan</th>
                    <th>Total Transaksi</th>
                    <th>Metode Pembayaran</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {allSales.slice().reverse().map(sale => {
                    const cashier = db.find('users', u => u.id === sale.cashier_id);
                    const cust = allCustomers.find(c => c.id === sale.customer_id);

                    return (
                      <tr key={sale.id}>
                        <td><strong>{sale.invoice_number}</strong></td>
                        <td>{new Date(sale.created_at).toLocaleString('id-ID')}</td>
                        <td>{cashier ? cashier.name : 'Unknown'}</td>
                        <td>{cust ? cust.name : 'Umum (Walk-in)'}</td>
                        <td><strong>{formatRupiah(sale.total_amount)}</strong></td>
                        <td><span className="badge info">{sale.payment_method}</span></td>
                        <td>
                          <span className={`badge ${sale.payment_status === 'PAID' ? 'success' :
                              sale.payment_status === 'PARTIAL' ? 'warning' : 'danger'
                            }`}>
                            {sale.payment_status}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              setCurrentSaleInvoice(sale);
                              setActiveModal('checkout-success');
                            }}
                          >
                            <Printer size={12} /> Struk
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {allSales.length === 0 && (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '16px' }}>Belum ada riwayat penjualan.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* 6. GENERAL: CHECK STOCK (SHARED) */}
        {activeTab === 'check-stock' && (
          <section className="card">
            <div className="search-filter-bar" style={{ marginBottom: '20px' }}>
              <div className="search-input-wrapper">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cari produk seragam/atribut berdasarkan nama atau ukuran..."
                  value={stockSearchQuery}
                  onChange={(e) => setStockSearchQuery(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                />
                <Search size={18} style={{ position: 'absolute', left: '14px', top: '12px', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Nama Produk</th>
                    <th>Ukuran</th>
                    <th>Warna</th>
                    {currentUser.role === 'OWNER' && <th>Harga Modal</th>}
                    <th>Harga Jual</th>
                    <th>Jumlah Stok</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allVariants
                    .filter(v => {
                      const p = allProducts.find(prod => prod.id === v.product_id);
                      if (!p) return false;
                      const searchStr = `${p.name} ${v.sku} ${v.size} ${v.color}`.toLowerCase();
                      return searchStr.includes(stockSearchQuery.toLowerCase());
                    })
                    .sort((a, b) => a.sku.localeCompare(b.sku))
                    .map(variant => {
                      const product = allProducts.find(p => p.id === variant.product_id);
                      const isLow = variant.stock_quantity < 5;

                      return (
                        <tr key={variant.id}>
                          <td><code>{variant.sku}</code></td>
                          <td><strong>{product ? product.name : 'Unknown'}</strong></td>
                          <td><span className="product-item-size">{variant.size}</span></td>
                          <td>{variant.color}</td>
                          {currentUser.role === 'OWNER' && <td>{formatRupiah(variant.cost_price)}</td>}
                          <td><strong>{formatRupiah(variant.selling_price)}</strong></td>
                          <td><strong>{variant.stock_quantity} Pcs</strong></td>
                          <td>
                            {variant.stock_quantity === 0 ? (
                              <span className="badge danger">Kosong</span>
                            ) : isLow ? (
                              <span className="badge warning">Kritis (&lt; 5)</span>
                            ) : (
                              <span className="badge success">Tersedia</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* 7. GENERAL: DATABASE VIEWER (DEVELOPMENT HELPER) */}
        {activeTab === 'db-viewer' && (
          <section className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 className="card-title">Inspektor Database Lokal</h2>
              <select
                className="form-control"
                style={{ width: '250px' }}
                value={selectedDbTable}
                onChange={(e) => setSelectedDbTable(e.target.value)}
              >
                <option value="users">Tabel: users (Pengguna)</option>
                <option value="categories">Tabel: categories (Kategori)</option>
                <option value="products">Tabel: products (Produk Induk)</option>
                <option value="product_variants">Tabel: product_variants (Varian & Harga)</option>
                <option value="stock_movements">Tabel: stock_movements (Mutasi Stok)</option>
                <option value="customers">Tabel: customers (Pelanggan & Utang)</option>
                <option value="sales">Tabel: sales (Header Transaksi)</option>
                <option value="sale_items">Tabel: sale_items (Detail Transaksi)</option>
                <option value="debt_payments">Tabel: debt_payments (Cicilan Kasbon)</option>
              </select>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Berikut adalah data mentah yang tersimpan secara persisten di <code>localStorage.getItem('oliviana_db')</code>.
            </p>

            <div className="table-wrapper">
              <table className="table" style={{ fontSize: '13px' }}>
                <thead>
                  {selectedDbTable === 'users' && (
                    <tr>
                      <th>ID</th>
                      <th>Nama</th>
                      <th>Email</th>
                      <th>Role</th>
                    </tr>
                  )}
                  {selectedDbTable === 'categories' && (
                    <tr>
                      <th>ID</th>
                      <th>Nama Kategori</th>
                    </tr>
                  )}
                  {selectedDbTable === 'products' && (
                    <tr>
                      <th>ID</th>
                      <th>Kategori ID</th>
                      <th>Nama Produk</th>
                      <th>Deskripsi</th>
                    </tr>
                  )}
                  {selectedDbTable === 'product_variants' && (
                    <tr>
                      <th>ID</th>
                      <th>Product ID</th>
                      <th>SKU</th>
                      <th>Ukuran</th>
                      <th>Warna</th>
                      <th>Harga Modal</th>
                      <th>Harga Jual</th>
                      <th>Stok</th>
                    </tr>
                  )}
                  {selectedDbTable === 'stock_movements' && (
                    <tr>
                      <th>ID</th>
                      <th>Variant ID</th>
                      <th>Tipe</th>
                      <th>Jumlah</th>
                      <th>Catatan</th>
                      <th>User ID</th>
                      <th>Waktu</th>
                    </tr>
                  )}
                  {selectedDbTable === 'customers' && (
                    <tr>
                      <th>ID</th>
                      <th>Nama</th>
                      <th>No HP</th>
                      <th>Total Utang</th>
                      <th>Terdaftar</th>
                    </tr>
                  )}
                  {selectedDbTable === 'sales' && (
                    <tr>
                      <th>ID</th>
                      <th>Invoice No</th>
                      <th>Kasir ID</th>
                      <th>Customer ID</th>
                      <th>Total</th>
                      <th>Metode</th>
                      <th>Status</th>
                      <th>Dibayar</th>
                      <th>Kembalian</th>
                      <th>Waktu</th>
                    </tr>
                  )}
                  {selectedDbTable === 'sale_items' && (
                    <tr>
                      <th>ID</th>
                      <th>Sale ID</th>
                      <th>Variant ID</th>
                      <th>Qty</th>
                      <th>Harga Unit</th>
                      <th>Subtotal</th>
                    </tr>
                  )}
                  {selectedDbTable === 'debt_payments' && (
                    <tr>
                      <th>ID</th>
                      <th>Customer ID</th>
                      <th>Jumlah Bayar</th>
                      <th>Metode</th>
                      <th>Kasir ID</th>
                      <th>Waktu</th>
                    </tr>
                  )}
                </thead>
                <tbody>
                  {db.get(selectedDbTable).map((row, idx) => (
                    <tr key={row.id || idx}>
                      {selectedDbTable === 'users' && (
                        <>
                          <td><code>{row.id}</code></td>
                          <td><strong>{row.name}</strong></td>
                          <td>{row.email}</td>
                          <td><span className="badge info">{row.role}</span></td>
                        </>
                      )}
                      {selectedDbTable === 'categories' && (
                        <>
                          <td><code>{row.id}</code></td>
                          <td><strong>{row.name}</strong></td>
                        </>
                      )}
                      {selectedDbTable === 'products' && (
                        <>
                          <td><code>{row.id}</code></td>
                          <td><code>{row.category_id}</code></td>
                          <td><strong>{row.name}</strong></td>
                          <td>{row.description}</td>
                        </>
                      )}
                      {selectedDbTable === 'product_variants' && (
                        <>
                          <td><code>{row.id}</code></td>
                          <td><code>{row.product_id}</code></td>
                          <td><code>{row.sku}</code></td>
                          <td><strong>{row.size}</strong></td>
                          <td>{row.color}</td>
                          <td>{formatRupiah(row.cost_price)}</td>
                          <td>{formatRupiah(row.selling_price)}</td>
                          <td>{row.stock_quantity} Pcs</td>
                        </>
                      )}
                      {selectedDbTable === 'stock_movements' && (
                        <>
                          <td><code>{row.id}</code></td>
                          <td><code>{row.variant_id}</code></td>
                          <td>
                            <span className={`badge ${row.type.includes('IN') || row.type.includes('RETURN') ? 'success' : 'danger'}`}>
                              {row.type}
                            </span>
                          </td>
                          <td><strong>{row.quantity}</strong></td>
                          <td>{row.notes}</td>
                          <td><code>{row.created_by}</code></td>
                          <td>{new Date(row.created_at).toLocaleString('id-ID')}</td>
                        </>
                      )}
                      {selectedDbTable === 'customers' && (
                        <>
                          <td><code>{row.id}</code></td>
                          <td><strong>{row.name}</strong></td>
                          <td>{row.phone_number}</td>
                          <td style={{ color: row.total_debt > 0 ? 'red' : 'green', fontWeight: 'bold' }}>{formatRupiah(row.total_debt)}</td>
                          <td>{new Date(row.created_at).toLocaleDateString('id-ID')}</td>
                        </>
                      )}
                      {selectedDbTable === 'sales' && (
                        <>
                          <td><code>{row.id}</code></td>
                          <td><strong>{row.invoice_number}</strong></td>
                          <td><code>{row.cashier_id}</code></td>
                          <td><code>{row.customer_id || '-'}</code></td>
                          <td>{formatRupiah(row.total_amount)}</td>
                          <td><span className="badge info">{row.payment_method}</span></td>
                          <td>
                            <span className={`badge ${row.payment_status === 'PAID' ? 'success' : 'danger'}`}>
                              {row.payment_status}
                            </span>
                          </td>
                          <td>{formatRupiah(row.paid_amount)}</td>
                          <td>{formatRupiah(row.change_amount)}</td>
                          <td>{new Date(row.created_at).toLocaleString('id-ID')}</td>
                        </>
                      )}
                      {selectedDbTable === 'sale_items' && (
                        <>
                          <td><code>{row.id}</code></td>
                          <td><code>{row.sale_id}</code></td>
                          <td><code>{row.variant_id}</code></td>
                          <td><strong>{row.quantity}</strong></td>
                          <td>{formatRupiah(row.price_per_unit)}</td>
                          <td><strong>{formatRupiah(row.subtotal)}</strong></td>
                        </>
                      )}
                      {selectedDbTable === 'debt_payments' && (
                        <>
                          <td><code>{row.id}</code></td>
                          <td><code>{row.customer_id}</code></td>
                          <td style={{ color: 'green', fontWeight: 'bold' }}>{formatRupiah(row.amount_paid)}</td>
                          <td><span className="badge info">{row.payment_method}</span></td>
                          <td><code>{row.cashier_id}</code></td>
                          <td>{new Date(row.created_at).toLocaleString('id-ID')}</td>
                        </>
                      )}
                    </tr>
                  ))}
                  {db.get(selectedDbTable).length === 0 && (
                    <tr>
                      <td colSpan="10" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                        Data kosong di tabel "{selectedDbTable}".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

      </main>

      {/* --- MODAL DIALOGS --- */}

      {/* A. CHECKOUT SUCCESS & THERMAL RECEIPT SIMULATOR */}
      {activeModal === 'checkout-success' && currentSaleInvoice && (() => {
        const cashier = db.find('users', u => u.id === currentSaleInvoice.cashier_id);
        const customer = db.find('customers', c => c.id === currentSaleInvoice.customer_id);
        const saleItems = db.get('sale_items').filter(item => item.sale_id === currentSaleInvoice.id);

        return (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '400px' }}>
              <header className="modal-header">
                <h2 className="modal-title">Simulasi Struk Belanja</h2>
                <button type="button" className="modal-close" onClick={() => setActiveModal(null)}><X size={20} /></button>
              </header>

              <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '16px', borderRadius: '12px', overflow: 'hidden' }}>

                {/* Simulated Thermal Paper */}
                <div className="receipt-paper" id="thermal-receipt">
                  <div className="receipt-text-center">
                    <span className="receipt-title">OLIVIANA</span><br />
                    <span>Jl. Semeru No. 81, Sukodono<br />Lumajang</span><br />
                    <span>HP: 0812-XXXX-XXXX</span>
                  </div>

                  <div className="receipt-divider"></div>

                  <div className="receipt-flex">
                    <span>Invoice:</span>
                    <span>{currentSaleInvoice.invoice_number}</span>
                  </div>
                  <div className="receipt-flex">
                    <span>Tanggal:</span>
                    <span>{new Date(currentSaleInvoice.created_at).toLocaleDateString('id-ID')}</span>
                  </div>
                  <div className="receipt-flex">
                    <span>Kasir:</span>
                    <span>{cashier ? cashier.name : 'Kasir'}</span>
                  </div>
                  {customer && (
                    <div className="receipt-flex">
                      <span>Pelanggan:</span>
                      <span>{customer.name}</span>
                    </div>
                  )}

                  <div className="receipt-divider"></div>

                  {/* Items */}
                  {saleItems.map((item, idx) => {
                    const variant = allVariants.find(v => v.id === item.variant_id);
                    const prod = variant ? allProducts.find(p => p.id === variant.product_id) : null;
                    const displayName = prod ? `${prod.name} (${variant.size})` : 'Barang';

                    return (
                      <div key={idx} style={{ marginBottom: '6px' }}>
                        <div>{displayName}</div>
                        <div className="receipt-flex" style={{ paddingLeft: '8px', color: '#555' }}>
                          <span>{item.quantity} x {Number(item.price_per_unit).toLocaleString('id-ID')}</span>
                          <span>{Number(item.subtotal).toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                    );
                  })}

                  <div className="receipt-divider"></div>

                  <div className="receipt-flex" style={{ fontWeight: 'bold' }}>
                    <span>TOTAL:</span>
                    <span>Rp {Number(currentSaleInvoice.total_amount).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="receipt-flex">
                    <span>Metode:</span>
                    <span>{currentSaleInvoice.payment_method} ({currentSaleInvoice.payment_status})</span>
                  </div>
                  <div className="receipt-flex">
                    <span>Bayar:</span>
                    <span>Rp {Number(currentSaleInvoice.paid_amount).toLocaleString('id-ID')}</span>
                  </div>
                  {currentSaleInvoice.change_amount > 0 && (
                    <div className="receipt-flex">
                      <span>Kembalian:</span>
                      <span>Rp {Number(currentSaleInvoice.change_amount).toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  {customer && customer.total_debt > 0 && (
                    <div className="receipt-flex" style={{ color: 'red' }}>
                      <span>Sisa Utang Pelanggan:</span>
                      <span>Rp {Number(customer.total_debt).toLocaleString('id-ID')}</span>
                    </div>
                  )}

                  <div className="receipt-divider"></div>

                  <div className="receipt-text-center" style={{ fontSize: '10px', marginTop: '12px' }}>
                    Terima kasih telah berbelanja di Oliviana.<br />
                    Barang yang sudah dibeli tidak dapat ditukar/dikembalikan.
                  </div>
                </div>

              </div>

              <div className="modal-footer" style={{ justifyContent: 'center' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={triggerPrintSim}>
                  <Printer size={14} /> Print Struk (Browser)
                </button>
                <button type="button" className="btn btn-success btn-sm" onClick={() => {
                  alert('WhatsApp Terkirim! (Simulasi API)');
                  setActiveModal(null);
                }}>
                  Kirim WhatsApp
                </button>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => setActiveModal(null)}>
                  Tutup
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* A3. DEBT PAYMENT RECEIPT MODAL */}
      {activeModal === 'debt-receipt' && selectedDebtPayment && (() => {
        const cashier = db.find('users', u => u.id === selectedDebtPayment.cashier_id);
        const customer = db.find('customers', c => c.id === selectedDebtPayment.customer_id);
        const remainingDebt = customer ? customer.total_debt : 0;

        return (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '400px' }}>
              <header className="modal-header">
                <h2 className="modal-title">Struk Pembayaran Cicilan / Utang</h2>
                <button type="button" className="modal-close" onClick={() => setActiveModal(null)}><X size={20} /></button>
              </header>

              <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '16px', borderRadius: '12px', overflow: 'hidden' }}>
                <div className="receipt-paper" id="thermal-receipt">
                  <div className="receipt-text-center">
                    <span className="receipt-title">OLIVIANA</span><br />
                    <span>Jl. Semeru No. 81, Sukodono<br />Lumajang</span><br />
                    <span>HP: 0812-XXXX-XXXX</span>
                  </div>

                  <div className="receipt-divider"></div>

                  <div className="receipt-text-center" style={{ fontWeight: 'bold', fontSize: '11px', marginBottom: '8px' }}>
                    BUKTI PEMBAYARAN KASBON / UTANG
                  </div>

                  <div className="receipt-flex">
                    <span>No Bukti:</span>
                    <span>{selectedDebtPayment.id}</span>
                  </div>
                  <div className="receipt-flex">
                    <span>Tanggal:</span>
                    <span>{new Date(selectedDebtPayment.created_at).toLocaleDateString('id-ID')} {new Date(selectedDebtPayment.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="receipt-flex">
                    <span>Kasir Penerima:</span>
                    <span>{cashier ? cashier.name : 'Kasir'}</span>
                  </div>
                  {customer && (
                    <div className="receipt-flex">
                      <span>Pelanggan:</span>
                      <span>{customer.name}</span>
                    </div>
                  )}

                  <div className="receipt-divider"></div>

                  <div className="receipt-flex" style={{ fontSize: '13px', fontWeight: 'bold' }}>
                    <span>NOMINAL DIBAYAR:</span>
                    <span style={{ color: '#008000' }}>Rp {Number(selectedDebtPayment.amount_paid).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="receipt-flex">
                    <span>Metode Pembayaran:</span>
                    <span>{selectedDebtPayment.payment_method}</span>
                  </div>

                  <div className="receipt-divider"></div>

                  <div className="receipt-flex" style={{ fontWeight: 'bold' }}>
                    <span>SISA UTANG SEKARANG:</span>
                    <span style={{ color: remainingDebt > 0 ? '#d9534f' : '#28a745' }}>
                      {remainingDebt > 0 ? `Rp ${Number(remainingDebt).toLocaleString('id-ID')}` : 'LUNAS (Rp 0) 🎉'}
                    </span>
                  </div>

                  <div className="receipt-divider"></div>

                  <div className="receipt-text-center" style={{ fontSize: '10px', marginTop: '12px' }}>
                    Terima kasih atas pembayaran Anda.<br />
                    Simpan struk ini sebagai bukti pembayaran yang sah.
                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ justifyContent: 'center' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={triggerPrintSim}>
                  <Printer size={14} /> Print Struk (Browser)
                </button>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => setActiveModal(null)}>
                  Tutup
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* A2. POS ITEM SELECTION MODAL (CATEGORY BASED) */}
      {activeModal === 'pos-select-item' && posSelectedCategory && (() => {
        const catProducts = allProducts.filter(p => p.category_id === posSelectedCategory.id);
        const currentProd = allProducts.find(p => p.id === posModalProductId) || (catProducts[0] || null);
        const prodVariants = currentProd ? allVariants.filter(v => v.product_id === currentProd.id) : [];
        const currentVariant = prodVariants.find(v => v.id === posModalVariantId) || (prodVariants[0] || null);

        const currentUnitPrice = currentVariant ? getAdjustedPrice(currentVariant.selling_price) : 0;
        const currentSubtotal = currentUnitPrice * (posModalQty || 1);

        return (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '480px' }}>
              <header className="modal-header">
                <h2 className="modal-title">Pilih Barang - {posSelectedCategory.name}</h2>
                <button type="button" className="modal-close" onClick={() => setActiveModal(null)}><X size={20} /></button>
              </header>

              <form onSubmit={(e) => {
                e.preventDefault();
                if (!currentVariant) {
                  alert('Silakan pilih varian produk.');
                  return;
                }
                addToCart(currentVariant, Number(posModalQty));
                setActiveModal(null);
              }}>
                {/* 1. Select Product */}
                <div className="form-group">
                  <label htmlFor="pos-select-prod" className="form-label">1. Pilih Jenis Seragam / Baju</label>
                  <select 
                    id="pos-select-prod"
                    className="form-control"
                    value={currentProd ? currentProd.id : ''}
                    onChange={(e) => {
                      const pId = e.target.value;
                      setPosModalProductId(pId);
                      const vars = allVariants.filter(v => v.product_id === pId);
                      if (vars.length > 0) setPosModalVariantId(vars[0].id);
                      else setPosModalVariantId('');
                    }}
                    required
                  >
                    {catProducts.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                    {catProducts.length === 0 && <option value="">(Belum ada produk di kategori ini)</option>}
                  </select>
                </div>

                {/* 2. Select Variant (Size & Color) */}
                <div className="form-group">
                  <label className="form-label">2. Pilih Ukuran & Warna Varian</label>
                  {prodVariants.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px', maxHeight: '160px', overflowY: 'auto', padding: '4px' }}>
                      {prodVariants.map(v => {
                        const isSelected = currentVariant && currentVariant.id === v.id;
                        const isOut = v.stock_quantity <= 0;

                        return (
                          <div 
                            key={v.id}
                            onClick={() => !isOut && setPosModalVariantId(v.id)}
                            style={{
                              padding: '10px',
                              borderRadius: '8px',
                              border: isSelected ? '2px solid var(--primary)' : '1px solid var(--card-border)',
                              backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--card-bg)',
                              opacity: isOut ? 0.5 : 1,
                              cursor: isOut ? 'not-allowed' : 'pointer',
                              textAlign: 'center'
                            }}
                          >
                            <div style={{ fontWeight: 'bold', fontSize: '14px', color: isSelected ? 'var(--primary)' : 'inherit' }}>
                              Ukuran {v.size}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                              Warna: {v.color}
                            </div>
                            <div style={{ fontSize: '11px', marginTop: '4px', fontWeight: '600', color: isOut ? 'var(--danger)' : 'var(--success)' }}>
                              {isOut ? 'Habis' : `Stok: ${v.stock_quantity}`}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', padding: '8px 0' }}>
                      Belum ada varian ukuran/warna untuk produk ini.
                    </div>
                  )}
                </div>

                {/* 3. Select Quantity */}
                <div className="form-group">
                  <label htmlFor="pos-modal-qty" className="form-label">3. Jumlah Pembelian (Pcs)</label>
                  <input 
                    id="pos-modal-qty"
                    type="number"
                    min="1"
                    max={currentVariant ? currentVariant.stock_quantity : 1}
                    className="form-control"
                    value={posModalQty}
                    onChange={(e) => setPosModalQty(Math.max(1, Number(e.target.value)))}
                    required
                  />
                </div>

                {/* Price Summary Calculation */}
                {currentVariant && (
                  <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '12px 16px', borderRadius: '12px', marginBottom: '16px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Harga Pricelist Base:</span>
                      <span>{formatRupiah(currentVariant.selling_price)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Penyesuaian Tipe Pelanggan ({customerType}):</span>
                      <span style={{ color: customerType === 'GROSIR' ? 'var(--text-primary)' : 'var(--primary)', fontWeight: 'bold' }}>
                        {customerType === 'GURU' ? '+ Rp 5.000' : customerType === 'GROSIR' ? '+ Rp 0 (Base)' : '+ Rp 15.000'}
                      </span>
                    </div>
                    <div style={{ borderTop: '1px dashed var(--card-border)', paddingTop: '6px', marginTop: '6px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '14px' }}>
                      <span>Harga per Unit ({customerType}):</span>
                      <span style={{ color: 'var(--primary)' }}>{formatRupiah(currentUnitPrice)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '15px', marginTop: '4px' }}>
                      <span>Subtotal ({posModalQty} Pcs):</span>
                      <span style={{ color: 'var(--success)' }}>{formatRupiah(currentSubtotal)}</span>
                    </div>
                  </div>
                )}

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Batal</button>
                  <button type="submit" className="btn btn-primary" disabled={!currentVariant || currentVariant.stock_quantity <= 0}>
                    + Tambah ke Keranjang
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* B. FACTORY INBOUND (RESTOCK) */}
      {activeModal === 'factory-inbound' && selectedVariant && (() => {
        const prod = allProducts.find(p => p.id === selectedVariant.product_id);
        return (
          <div className="modal-overlay">
            <div className="modal-content">
              <header className="modal-header">
                <h2 className="modal-title">Terima Barang dari Pabrik</h2>
                <button type="button" className="modal-close" onClick={() => { setActiveModal(null); setSelectedVariant(null); }}><X size={20} /></button>
              </header>

              <form onSubmit={handleFactoryInbound}>
                <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                  <strong>Produk:</strong> {prod ? prod.name : 'Unknown'}<br />
                  <strong>SKU:</strong> <code>{selectedVariant.sku}</code> | <strong>Ukuran:</strong> {selectedVariant.size} | <strong>Stok Saat Ini:</strong> {selectedVariant.stock_quantity}
                </div>

                <div className="form-group">
                  <label htmlFor="factory-qty" className="form-label">Jumlah Barang Masuk (Pcs)</label>
                  <input
                    id="factory-qty"
                    type="number"
                    className="form-control"
                    placeholder="Masukkan jumlah masuk..."
                    value={factoryInQty}
                    onChange={(e) => setFactoryInQty(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="factory-notes" className="form-label">Catatan Tambahan</label>
                  <textarea
                    id="factory-notes"
                    className="form-control"
                    placeholder="Catatan pengerjaan atau nomor bundel..."
                    value={factoryInNotes}
                    onChange={(e) => setFactoryInNotes(e.target.value)}
                    rows="3"
                  />
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => { setActiveModal(null); setSelectedVariant(null); }}>Batal</button>
                  <button type="submit" className="btn btn-primary">Simpan Stok Masuk</button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* C. DEBT REPAYMENT */}
      {activeModal === 'repay-debt' && selectedCustomer && (
        <div className="modal-overlay">
          <div className="modal-content">
            <header className="modal-header">
              <h2 className="modal-title">Catat Pembayaran Cicilan</h2>
              <button type="button" className="modal-close" onClick={() => { setActiveModal(null); setSelectedCustomer(null); }}><X size={20} /></button>
            </header>

            <form onSubmit={handleDebtRepayment}>
              <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                <strong>Pelanggan:</strong> {selectedCustomer.name}<br />
                <strong>No HP:</strong> {selectedCustomer.phone_number}<br />
                <strong>Total Utang Saat Ini:</strong> <span style={{ color: 'red', fontWeight: 'bold' }}>{formatRupiah(selectedCustomer.total_debt)}</span>
              </div>

              <div className="form-group">
                <label htmlFor="repay-amount" className="form-label">Nominal Pembayaran Cicilan (Rp)</label>
                <input
                  id="repay-amount"
                  type="number"
                  className="form-control"
                  placeholder="Masukkan jumlah yang dicicil..."
                  value={debtRepayAmount}
                  onChange={(e) => setDebtRepayAmount(e.target.value)}
                  max={selectedCustomer.total_debt}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Metode Pembayaran Cicilan</label>
                <div className="segmented-control">
                  <button
                    type="button"
                    className={`segmented-option ${debtRepayMethod === 'CASH' ? 'active' : ''}`}
                    onClick={() => setDebtRepayMethod('CASH')}
                  >
                    Tunai
                  </button>
                  <button
                    type="button"
                    className={`segmented-option ${debtRepayMethod === 'QRIS' ? 'active' : ''}`}
                    onClick={() => setDebtRepayMethod('QRIS')}
                  >
                    QRIS
                  </button>
                  <button
                    type="button"
                    className={`segmented-option ${debtRepayMethod === 'TRANSFER' ? 'active' : ''}`}
                    onClick={() => setDebtRepayMethod('TRANSFER')}
                  >
                    Transfer
                  </button>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => { setActiveModal(null); setSelectedCustomer(null); }}>Batal</button>
                <button type="submit" className="btn btn-success">Simpan Cicilan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* D. ADD NEW PRODUCT & VARIANT (UNIFIED) */}
      {activeModal === 'add-product-variant' && (
        <div className="modal-overlay">
          <div className="modal-content">
            <header className="modal-header">
              <h2 className="modal-title">Tambah Baju / Varian</h2>
              <button type="button" className="modal-close" onClick={() => setActiveModal(null)}><X size={20} /></button>
            </header>

            <form onSubmit={handleUnifiedAddProductVariant}>
              {/* Product Selection / Creation Mode */}
              <div className="form-group">
                <label htmlFor="variant-prod" className="form-label">Pilih Produk Utama</label>
                <select
                  id="variant-prod"
                  className="form-control"
                  value={newVariantProductId}
                  onChange={(e) => setNewVariantProductId(e.target.value)}
                  required
                >
                  <option value="NEW_PRODUCT">+ Buat Produk Induk Baru</option>
                  {allProducts.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* If NEW_PRODUCT is selected, show Product creation fields */}
              {newVariantProductId === 'NEW_PRODUCT' && (
                <div style={{ border: '1px dashed var(--primary)', padding: '16px', borderRadius: '12px', marginBottom: '16px', backgroundColor: 'var(--bg-tertiary)' }}>
                  <h3 style={{ fontSize: '13px', marginBottom: '12px', color: 'var(--primary)', fontWeight: 'bold' }}>Detail Produk Induk Baru</h3>

                  <div className="form-group">
                    <label htmlFor="prod-category" className="form-label">Kategori</label>
                    <select
                      id="prod-category"
                      className="form-control"
                      value={newProductCategory}
                      onChange={(e) => setNewProductCategory(e.target.value)}
                      required={newVariantProductId === 'NEW_PRODUCT'}
                    >
                      <option value="">Pilih Kategori...</option>
                      {allCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="prod-name" className="form-label">Nama Produk Utama</label>
                    <input
                      id="prod-name"
                      type="text"
                      className="form-control"
                      placeholder="Misal: Hem Putih Panjang, Rok Span, Atribut..."
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      required={newVariantProductId === 'NEW_PRODUCT'}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="prod-desc" className="form-label">Deskripsi / Catatan Bahan</label>
                    <textarea
                      id="prod-desc"
                      className="form-control"
                      placeholder="Catatan opsional..."
                      value={newProductDesc}
                      onChange={(e) => setNewProductDesc(e.target.value)}
                      rows="2"
                    />
                  </div>
                </div>
              )}

              {/* Varian details section */}
              <h3 style={{ fontSize: '14px', margin: '16px 0 12px', fontWeight: 'bold' }}>Detail Ukuran & Harga</h3>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="variant-size" className="form-label">Ukuran</label>
                  <input
                    id="variant-size"
                    type="text"
                    className="form-control"
                    placeholder="S, M, L, XL, 3, 4, All Size, dll"
                    value={newVariantSize}
                    onChange={(e) => setNewVariantSize(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="variant-color" className="form-label">Warna / Varian Tambahan</label>
                  <input
                    id="variant-color"
                    type="text"
                    className="form-control"
                    placeholder="Standard, Merah, Putih, dll"
                    value={newVariantColor}
                    onChange={(e) => setNewVariantColor(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="variant-cost" className="form-label">Harga Modal Pabrik (Rp)</label>
                  <input
                    id="variant-cost"
                    type="number"
                    className="form-control"
                    placeholder="Harga modal..."
                    value={newVariantCostPrice}
                    onChange={(e) => setNewVariantCostPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="variant-selling" className="form-label">Harga Jual Toko (Rp)</label>
                  <input
                    id="variant-selling"
                    type="number"
                    className="form-control"
                    placeholder="Harga jual..."
                    value={newVariantSellingPrice}
                    onChange={(e) => setNewVariantSellingPrice(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="variant-stock" className="form-label">Stok Awal (Pcs)</label>
                <input
                  id="variant-stock"
                  type="number"
                  className="form-control"
                  value={newVariantStock}
                  onChange={(e) => setNewVariantStock(e.target.value)}
                  required
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan Produk & Varian</button>
              </div>
            </form>
          </div>
        </div>
      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="bottom-nav">
        {currentUser.role === 'OWNER' && (
          <button
            type="button"
            className={`bottom-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
          >
            <TrendingUp size={20} />
            <span>Ringkasan</span>
          </button>
        )}

        {currentUser.role === 'OWNER' && (
          <button
            type="button"
            className={`bottom-nav-item ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => { setActiveTab('inventory'); setIsMobileMenuOpen(false); }}
          >
            <Package size={20} />
            <span>Stok</span>
          </button>
        )}

        <button
          type="button"
          className={`bottom-nav-item ${activeTab === 'pos' ? 'active' : ''}`}
          onClick={() => { setActiveTab('pos'); setIsMobileMenuOpen(false); }}
        >
          <ShoppingCart size={20} />
          <span>Kasir POS</span>
        </button>

        {currentUser.role === 'OWNER' && (
          <button
            type="button"
            className={`bottom-nav-item ${activeTab === 'debt' ? 'active' : ''}`}
            onClick={() => { setActiveTab('debt'); setIsMobileMenuOpen(false); }}
          >
            <CreditCard size={20} />
            <span>Kasbon</span>
          </button>
        )}

        <button
          type="button"
          className={`bottom-nav-item ${activeTab === 'check-stock' ? 'active' : ''}`}
          onClick={() => { setActiveTab('check-stock'); setIsMobileMenuOpen(false); }}
        >
          <Search size={20} />
          <span>Cek Stok</span>
        </button>
      </nav>

    </div>
  );
}

export default App;
