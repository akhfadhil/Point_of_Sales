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
  Menu,
  AlertTriangle,
  ChevronDown,
  ChevronUp
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

  // Toast Notification & Custom Confirmation Modal State
  const [toast, setToast] = useState(null); // { message, type, id }
  const [confirmConfig, setConfirmConfig] = useState(null); // { title, message, confirmText, cancelText, confirmVariant, onConfirm }

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const askConfirmation = ({ title, message, confirmText = 'Ya, Lanjutkan', cancelText = 'Batal', confirmVariant = 'danger', onConfirm }) => {
    setConfirmConfig({
      title,
      message,
      confirmText,
      cancelText,
      confirmVariant,
      onConfirm: () => {
        onConfirm();
        setConfirmConfig(null);
      }
    });
  };

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
  const [posSelectedProduct, setPosSelectedProduct] = useState(null);
  const [posModalVariantId, setPosModalVariantId] = useState('');
  const [posModalSize, setPosModalSize] = useState('');
  const [posModalColor, setPosModalColor] = useState('');
  const [posModalQty, setPosModalQty] = useState(1);

  // Perhitungan Harga Jual Berdasarkan Tipe Pelanggan
  const getAdjustedPrice = (basePrice, type = customerType) => {
    const p = Number(basePrice || 0);
    if (type === 'GURU') return p + 5000;
    if (type === 'GROSIR') return p;
    return p + 15000; // Default UMUM
  };

  // Helper Size & Color Sorting (Prioritas Angka -> S/M/L/XL -> Warna)
  const SIZE_HIERARCHY = {
    'XS': 99, 'S': 100, 'M': 101, 'L': 102, 'XL': 103, 'XXL': 104, '2XL': 104, '3XL': 105, '4XL': 106, '5XL': 107, 'ALL SIZE': 200, 'STANDARD': 201
  };

  const parseSizeWeight = (size) => {
    const s = String(size || '').trim().toUpperCase();
    if (SIZE_HIERARCHY[s] !== undefined) return SIZE_HIERARCHY[s];
    const num = parseFloat(s);
    if (!isNaN(num)) return num;
    return 300;
  };

  const compareVariants = (a, b) => {
    if (!a && !b) return 0;
    if (!a) return 1;
    if (!b) return -1;
    const weightA = parseSizeWeight(a.size);
    const weightB = parseSizeWeight(b.size);
    if (weightA !== weightB) return weightA - weightB;

    const sizeCmp = String(a.size || '').localeCompare(String(b.size || ''), 'id', { numeric: true });
    if (sizeCmp !== 0) return sizeCmp;

    return String(a.color || '').localeCompare(String(b.color || ''), 'id', { sensitivity: 'base' });
  };

  const sortSizes = (sizes) => {
    if (!Array.isArray(sizes)) return [];
    return sizes.slice().sort((a, b) => {
      const wA = parseSizeWeight(a);
      const wB = parseSizeWeight(b);
      if (wA !== wB) return wA - wB;
      return String(a || '').localeCompare(String(b || ''), 'id', { numeric: true });
    });
  };

  // Search & Filter State
  const [posSearchQuery, setPosSearchQuery] = useState('');
  const [inventorySearchQuery, setInventorySearchQuery] = useState('');
  const [inventoryProductFilter, setInventoryProductFilter] = useState('');
  const [inventorySizeFilter, setInventorySizeFilter] = useState('');
  const [inventoryColorFilter, setInventoryColorFilter] = useState('');
  const [expandedProductIds, setExpandedProductIds] = useState([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
  const [stockSearchQuery, setStockSearchQuery] = useState('');
  const [debtSearchQuery, setDebtSearchQuery] = useState('');
  const [debtActivePage, setDebtActivePage] = useState(1);
  const [debtSettledPage, setDebtSettledPage] = useState(1);
  const [debtHistoryPage, setDebtHistoryPage] = useState(1);
  const [selectedDbTable, setSelectedDbTable] = useState('users');
  const [mobilePosActiveView, setMobilePosActiveView] = useState('products'); // 'products' | 'cart'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'checkout-success' | 'factory-inbound' | 'repay-debt' | 'add-product' | 'add-variant'
  const [currentSaleInvoice, setCurrentSaleInvoice] = useState(null);

  // Selected variant for Factory Inbound
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [restockProductId, setRestockProductId] = useState('');
  const [restockSize, setRestockSize] = useState('');
  const [restockColor, setRestockColor] = useState('');
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
    askConfirmation({
      title: 'Reset Database Simulasi',
      message: 'Apakah Anda yakin ingin me-reset database simulasi ke kondisi awal? Semua transaksi dan data baru akan terhapus.',
      confirmText: 'Reset Database',
      confirmVariant: 'danger',
      onConfirm: () => {
        db.reset();
        setRefreshKey(prev => prev + 1);
        setCart([]);
        showToast('Database berhasil di-reset ke kondisi awal.', 'success');
      }
    });
  };

  // Cart operations
  const addToCart = (variant, qtyToAdd = 1) => {
    const existing = cart.find(item => item.id === variant.id);
    const product = db.find('products', p => p.id === variant.product_id);

    if (existing) {
      if (existing.quantity + qtyToAdd > variant.stock_quantity) {
        showToast('Stok tidak mencukupi untuk menambah item.', 'error');
        return;
      }
      setCart(cart.map(item =>
        item.id === variant.id ? { ...item, quantity: item.quantity + qtyToAdd } : item
      ));
    } else {
      if (variant.stock_quantity < qtyToAdd) {
        showToast('Stok tidak mencukupi.', 'error');
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
    showToast(`${product ? product.name : 'Barang'} (${variant.size}) ditambahkan ke keranjang`, 'success');
  };

  const updateCartQty = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        if (newQty <= 0) return null;
        if (newQty > item.maxStock) {
          showToast('Stok maksimum tercapai.', 'warning');
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
        showToast('Pelanggan wajib dipilih untuk metode pembayaran Kasbon/Utang.', 'warning');
        return;
      }
      if (paid === 0) {
        status = 'UNPAID';
      } else if (paid < total) {
        status = 'PARTIAL';
      } else {
        showToast('Pembayaran tunai penuh tidak bisa bermetode Kasbon.', 'warning');
        return;
      }
    } else {
      // Pembayaran cash/transfer/qris non-hutang
      if (paid < total) {
        showToast('Jumlah pembayaran kurang dari total belanja.', 'error');
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
      showToast('Transaksi penjualan berhasil diproses!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Terjadi kesalahan saat memproses transaksi.', 'error');
    }
  };

  // Factory Inbound stok
  const handleFactoryInbound = (e) => {
    e.preventDefault();
    if (!selectedVariant || !factoryInQty) return;
    const qty = Number(factoryInQty);
    if (qty <= 0) {
      showToast('Jumlah harus lebih dari 0.', 'warning');
      return;
    }

    db.addStockFromFactory(selectedVariant.id, qty, factoryInNotes, currentUser.id);
    setSelectedVariant(null);
    setFactoryInQty('');
    setFactoryInNotes('');
    setActiveModal(null);
    setRefreshKey(prev => prev + 1);
    showToast(`Stok ${qty} Pcs dari pabrik berhasil ditambahkan.`, 'success');
  };

  // Debt payment
  const handleDebtRepayment = (e) => {
    e.preventDefault();
    if (!selectedCustomer || !debtRepayAmount) return;
    const amount = Number(debtRepayAmount);
    if (amount <= 0) {
      showToast('Jumlah pembayaran harus lebih dari 0.', 'warning');
      return;
    }
    if (amount > selectedCustomer.total_debt) {
      showToast('Jumlah pembayaran melebihi utang yang dimiliki.', 'warning');
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
    showToast('Pembayaran cicilan utang berhasil dicatat.', 'success');
  };

  // Unified Add Product & Variant
  const handleUnifiedAddProductVariant = (e) => {
    e.preventDefault();
    if (!newVariantSize || !newVariantSellingPrice) return;

    let targetProductId = newVariantProductId;

    // A. Buat Produk Baru jika dipilih
    if (newVariantProductId === 'NEW_PRODUCT') {
      if (!newProductName || !newProductCategory) {
        showToast('Nama produk dan kategori wajib diisi.', 'warning');
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
      showToast('Pilih produk atau buat produk baru.', 'warning');
      return;
    }

    const product = db.find('products', p => p.id === targetProductId);
    if (!product) {
      showToast('Produk tidak ditemukan.', 'error');
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
    showToast('Produk dan Varian berhasil disimpan.', 'success');
  };

  // Calculate Owner Dashboard metrics
  const getDashboardData = () => {
    const sales = db.get('sales');
    const saleItems = db.get('sale_items');
    const customers = db.get('customers');

    let totalGrossSales = 0;
    sales.forEach(sale => {
      totalGrossSales += sale.total_amount;
    });

    let totalItemsSold = 0;
    saleItems.forEach(item => {
      totalItemsSold += item.quantity;
    });

    let totalOutstandingDebt = 0;
    customers.forEach(c => {
      totalOutstandingDebt += c.total_debt;
    });

    return {
      grossSales: totalGrossSales,
      totalTransactions: sales.length,
      totalItemsSold: totalItemsSold,
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
                  <ShoppingCart size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Total Transaksi</span>
                  <span className="stat-value">{dashboardMetrics.totalTransactions} Transaksi</span>
                </div>
              </div>

              <div className="card stat-card">
                <div className="stat-icon-wrapper warning">
                  <Package size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Total Barang Terjual</span>
                  <span className="stat-value">{dashboardMetrics.totalItemsSold} Pcs</span>
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

                {/* Filter Chips Kategori */}
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '16px' }}>
                  <button
                    type="button"
                    className={`btn btn-sm ${selectedCategoryFilter === '' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setSelectedCategoryFilter('')}
                    style={{ borderRadius: '20px', whiteSpace: 'nowrap' }}
                  >
                    Semua Kategori ({allProducts.length})
                  </button>
                  {allCategories.map(cat => {
                    const count = allProducts.filter(p => p.category_id === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        className={`btn btn-sm ${selectedCategoryFilter === cat.id ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setSelectedCategoryFilter(cat.id)}
                        style={{ borderRadius: '20px', whiteSpace: 'nowrap' }}
                      >
                        {cat.name} ({count})
                      </button>
                    );
                  })}
                </div>

                {/* Grid of Product Cards (Jenis Produk) */}
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px', color: 'var(--text-secondary)' }}>
                  Pilih Jenis Produk Seragam:
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                  {(() => {
                    const displayedProds = allProducts.filter(prod => {
                      if (selectedCategoryFilter && prod.category_id !== selectedCategoryFilter) return false;
                      if (posSearchQuery) {
                        const q = posSearchQuery.toLowerCase();
                        const prodVariants = allVariants.filter(v => v.product_id === prod.id);
                        const matchName = prod.name.toLowerCase().includes(q);
                        const matchCategory = (allCategories.find(c => c.id === prod.category_id)?.name || '').toLowerCase().includes(q);
                        const matchVariant = prodVariants.some(v => 
                          v.sku.toLowerCase().includes(q) || 
                          v.size.toLowerCase().includes(q) || 
                          v.color.toLowerCase().includes(q)
                        );
                        return matchName || matchCategory || matchVariant;
                      }
                      return true;
                    });

                    return (
                      <>
                        {displayedProds.map(prod => {
                          const category = allCategories.find(c => c.id === prod.category_id);
                          const prodVariants = allVariants.filter(v => v.product_id === prod.id);
                          const totalStock = prodVariants.reduce((sum, v) => sum + v.stock_quantity, 0);
                          const prices = prodVariants.map(v => getAdjustedPrice(v.selling_price));
                          const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
                          const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
                          const priceRangeStr = prices.length === 0 
                            ? '-' 
                            : (minPrice === maxPrice ? formatRupiah(minPrice) : `${formatRupiah(minPrice)} - ${formatRupiah(maxPrice)}`);

                          return (
                            <div
                              key={prod.id}
                              className="card"
                              onClick={() => {
                                setPosSelectedProduct(prod);
                                if (prodVariants.length > 0) {
                                  setPosModalVariantId(prodVariants[0].id);
                                  setPosModalSize(prodVariants[0].size);
                                  setPosModalColor(prodVariants[0].color);
                                } else {
                                  setPosModalVariantId('');
                                  setPosModalSize('');
                                  setPosModalColor('');
                                }
                                setPosModalQty(1);
                                setActiveModal('pos-select-item');
                              }}
                              style={{
                                cursor: 'pointer',
                                border: '1px solid var(--card-border)',
                                transition: 'transform 0.15s, box-shadow 0.15s',
                                padding: '16px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                backgroundColor: 'var(--card-bg)'
                              }}
                            >
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                  <span className="badge info" style={{ fontSize: '11px' }}>{category ? category.name : 'Umum'}</span>
                                  <span className={`badge ${totalStock > 0 ? 'success' : 'danger'}`} style={{ fontSize: '11px' }}>
                                    Stok: {totalStock} Pcs
                                  </span>
                                </div>
                                <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '6px', color: 'var(--text-primary)' }}>
                                  {prod.name}
                                </h4>
                                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 12px 0' }}>
                                  {prodVariants.length > 0 ? `${prodVariants.length} Ukuran (${prodVariants.map(v => v.size).join(', ')})` : 'Belum ada varian'}
                                </p>
                              </div>

                              <div style={{ borderTop: '1px dashed var(--card-border)', paddingTop: '10px', marginTop: '4px' }}>
                                <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '8px' }}>
                                  {priceRangeStr}
                                </div>
                                <button type="button" className="btn btn-primary btn-sm" style={{ width: '100%', fontSize: '12px' }}>
                                  + Pilih Size & Jumlah
                                </button>
                              </div>
                            </div>
                          );
                        })}

                        {displayedProds.length === 0 && (
                          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                            Tidak ada produk seragam yang ditemukan.
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Cart Panel (Right) */}
              <form onSubmit={handleCheckout} className="pos-cart-panel">
                <header className="cart-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShoppingCart size={18} style={{ color: 'var(--primary)' }} />
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>Keranjang Belanja</h3>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge info" style={{ padding: '4px 10px', fontSize: '12px' }}>
                      {cart.reduce((s, i) => s + i.quantity, 0)} Item
                    </span>
                    {cart.length > 0 && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '3px 8px', fontSize: '11px', color: 'var(--danger)' }}
                        onClick={() => setCart([])}
                        title="Kosongkan Keranjang"
                      >
                        Kosongkan
                      </button>
                    )}
                  </div>
                </header>

                <div className="cart-items-list">
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-info">
                        <span className="cart-item-title">{item.name}</span>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', margin: '2px 0 6px' }}>
                          <span className="cart-item-sku">{item.sku}</span>
                          {item.color && item.color !== 'Standard' && (
                            <span className="badge info" style={{ fontSize: '10px', padding: '1px 6px' }}>{item.color}</span>
                          )}
                        </div>
                        <div className="cart-item-qty-control">
                          <button type="button" className="qty-btn" onClick={() => updateCartQty(item.id, -1)}>-</button>
                          <span className="qty-val">{item.quantity}</span>
                          <button type="button" className="qty-btn" onClick={() => updateCartQty(item.id, 1)}>+</button>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginLeft: '6px' }}>
                            @ {formatRupiah(getAdjustedPrice(item.base_selling_price))}
                          </span>
                        </div>
                      </div>

                      <div className="cart-item-price-info">
                        <button type="button" className="cart-item-delete" title="Hapus Item" onClick={() => removeFromCart(item.id)}>
                          <Trash2 size={16} />
                        </button>
                        <span className="cart-item-subtotal">{formatRupiah(getAdjustedPrice(item.base_selling_price) * item.quantity)}</span>
                      </div>
                    </div>
                  ))}

                  {cart.length === 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', minHeight: '200px', color: 'var(--text-muted)' }}>
                      <ShoppingCart size={44} style={{ marginBottom: '12px', opacity: 0.4 }} />
                      <p style={{ fontWeight: '600', fontSize: '14px' }}>Keranjang masih kosong</p>
                      <p style={{ fontSize: '12px', marginTop: '4px', textAlign: 'center' }}>Klik produk di sebelah kiri untuk memasukkan barang ke keranjang.</p>
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
        {activeTab === 'inventory' && currentUser.role === 'OWNER' && (() => {
          // List options for filter selects
          const inventoryProductsList = allProducts.slice().sort((a, b) => String(a?.name || '').localeCompare(String(b?.name || ''), 'id', { sensitivity: 'base' }));
          const inventorySizesList = sortSizes(Array.from(new Set(allVariants.map(v => v.size))));
          const inventoryColorsList = Array.from(new Set(allVariants.map(v => v.color))).sort((a, b) => String(a || '').localeCompare(String(b || ''), 'id', { sensitivity: 'base' }));

          const isAnyFilterActive = Boolean(inventoryProductFilter || inventorySizeFilter || inventoryColorFilter || inventorySearchQuery.trim());

          // Filter Inventory products based on multi-filters
          const filteredInventoryProducts = allProducts.filter(product => {
            // Filter product dropdown
            if (inventoryProductFilter && product.id !== inventoryProductFilter) return false;

            // Get product variants
            let pVariants = allVariants.filter(v => v.product_id === product.id);

            // Filter size dropdown
            if (inventorySizeFilter) {
              pVariants = pVariants.filter(v => v.size === inventorySizeFilter);
            }

            // Filter color dropdown
            if (inventoryColorFilter) {
              pVariants = pVariants.filter(v => v.color === inventoryColorFilter);
            }

            // Filter text search query
            if (inventorySearchQuery.trim()) {
              const q = inventorySearchQuery.toLowerCase().trim();
              const category = allCategories.find(c => c.id === product.category_id);
              const catName = category ? category.name.toLowerCase() : '';
              const prodName = product.name.toLowerCase();
              const hasMatchingVariant = pVariants.some(v =>
                `${v.sku} ${v.size} ${v.color}`.toLowerCase().includes(q)
              );
              if (!prodName.includes(q) && !catName.includes(q) && !hasMatchingVariant) return false;
            }

            // If size or color filter is active, only include products that have matching variants
            if ((inventorySizeFilter || inventoryColorFilter) && pVariants.length === 0) {
              return false;
            }

            return true;
          });

          const toggleExpand = (productId) => {
            setExpandedProductIds(prev =>
              prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
            );
          };

          return (
            <section>
              {/* Header section action buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Manajemen Stok & Produk</h2>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>Kelola daftar baju, varian ukuran/warna, dan pasokan pabrik.</p>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => {
                      if (allProducts.length > 0) {
                        const firstProd = allProducts[0];
                        setRestockProductId(firstProd.id);
                        const pVars = allVariants.filter(v => v.product_id === firstProd.id);
                        if (pVars.length > 0) {
                          setRestockSize(pVars[0].size);
                          setRestockColor(pVars[0].color);
                        } else {
                          setRestockSize('');
                          setRestockColor('');
                        }
                      }
                      setFactoryInQty('');
                      setFactoryInNotes('Terima pasokan dari pabrik');
                      setActiveModal('factory-inbound-unified');
                    }}
                  >
                    <Plus size={16} /> Terima Barang Pabrik
                  </button>

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
                      setNewVariantSellingPrice('');
                      setNewVariantStock('0');
                      setActiveModal('add-product-variant');
                    }}
                  >
                    <Plus size={16} /> Tambah Produk Baru
                  </button>
                </div>
              </div>

              {/* Multi-Filter Card Bar */}
              <div className="card" style={{ marginBottom: '24px', padding: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', alignItems: 'end' }}>
                  {/* 1. Filter Produk */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="inv-filter-prod" className="form-label" style={{ fontSize: '12px', fontWeight: 'bold' }}>Pilih Produk</label>
                    <select
                      id="inv-filter-prod"
                      className="form-control"
                      style={{ fontSize: '13px', padding: '8px 12px' }}
                      value={inventoryProductFilter}
                      onChange={(e) => setInventoryProductFilter(e.target.value)}
                    >
                      <option value="">-- Semua Produk --</option>
                      {inventoryProductsList.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* 2. Filter Ukuran */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="inv-filter-size" className="form-label" style={{ fontSize: '12px', fontWeight: 'bold' }}>Pilih Ukuran</label>
                    <select
                      id="inv-filter-size"
                      className="form-control"
                      style={{ fontSize: '13px', padding: '8px 12px' }}
                      value={inventorySizeFilter}
                      onChange={(e) => setInventorySizeFilter(e.target.value)}
                    >
                      <option value="">-- Semua Ukuran --</option>
                      {inventorySizesList.map(sz => (
                        <option key={sz} value={sz}>Ukuran {sz}</option>
                      ))}
                    </select>
                  </div>

                  {/* 3. Filter Warna */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="inv-filter-color" className="form-label" style={{ fontSize: '12px', fontWeight: 'bold' }}>Pilih Warna</label>
                    <select
                      id="inv-filter-color"
                      className="form-control"
                      style={{ fontSize: '13px', padding: '8px 12px' }}
                      value={inventoryColorFilter}
                      onChange={(e) => setInventoryColorFilter(e.target.value)}
                    >
                      <option value="">-- Semua Warna --</option>
                      {inventoryColorsList.map(col => (
                        <option key={col} value={col}>{col}</option>
                      ))}
                    </select>
                  </div>

                  {/* 4. Keyword / SKU Search */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="inv-filter-search" className="form-label" style={{ fontSize: '12px', fontWeight: 'bold' }}>Kata Kunci / SKU</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        id="inv-filter-search"
                        type="text"
                        className="form-control"
                        style={{ fontSize: '13px', padding: '8px 12px' }}
                        placeholder="Cari SKU / nama..."
                        value={inventorySearchQuery}
                        onChange={(e) => setInventorySearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Reset Filter Button */}
                  {isAnyFilterActive && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ fontSize: '12px', padding: '8px 14px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      onClick={() => {
                        setInventoryProductFilter('');
                        setInventorySizeFilter('');
                        setInventoryColorFilter('');
                        setInventorySearchQuery('');
                      }}
                    >
                      <X size={14} /> Reset Filter
                    </button>
                  )}
                </div>
              </div>

              {/* List Products and their variants */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredInventoryProducts.map(product => {
                  const category = allCategories.find(c => c.id === product.category_id);
                  let variants = allVariants.filter(v => v.product_id === product.id);
                  if (inventorySizeFilter) variants = variants.filter(v => v.size === inventorySizeFilter);
                  if (inventoryColorFilter) variants = variants.filter(v => v.color === inventoryColorFilter);
                  variants.sort(compareVariants);

                  const totalStock = variants.reduce((sum, v) => sum + v.stock_quantity, 0);
                  const uniqueSizes = sortSizes(Array.from(new Set(variants.map(v => v.size))));
                  const uniqueColors = Array.from(new Set(variants.map(v => v.color))).sort((a, b) => String(a || '').localeCompare(String(b || ''), 'id', { sensitivity: 'base' }));

                  // Expanded if explicitly toggled OR when any filter is active
                  const isExpanded = expandedProductIds.includes(product.id) || isAnyFilterActive;

                  return (
                    <div key={product.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                      {/* Product Accordion Header */}
                      <header
                        onClick={() => toggleExpand(product.id)}
                        style={{
                          display: 'flex',
                          justify: 'space-between',
                          alignItems: 'center',
                          padding: '16px 20px',
                          cursor: 'pointer',
                          backgroundColor: isExpanded ? 'var(--bg-tertiary)' : 'var(--card-bg)',
                          borderBottom: isExpanded ? '1px solid var(--card-border)' : 'none',
                          transition: 'background-color 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                          <span className="badge info" style={{ fontSize: '11px' }}>{category ? category.name : 'Umum'}</span>
                          <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{product.name}</h2>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <span className="badge secondary" style={{ fontSize: '11px' }}>{variants.length} Varian</span>
                            <span className="badge secondary" style={{ fontSize: '11px' }}>{uniqueSizes.length} Ukuran</span>
                            <span className="badge secondary" style={{ fontSize: '11px' }}>{uniqueColors.length} Warna</span>
                            <span className={`badge ${totalStock > 0 ? 'success' : 'danger'}`} style={{ fontSize: '11px' }}>
                              Total Stok: {totalStock} Pcs
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => toggleExpand(product.id)}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
                          >
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            {isExpanded ? 'Sembunyikan Varian' : `Tampilkan Varian (${variants.length})`}
                          </button>

                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => {
                              askConfirmation({
                                title: `Hapus Produk "${product.name}"`,
                                message: `Apakah Anda yakin ingin menghapus produk "${product.name}" beserta seluruh varian ukurannya? Tindakan ini tidak dapat dibatalkan.`,
                                confirmText: 'Hapus Produk',
                                confirmVariant: 'danger',
                                onConfirm: () => {
                                  db.delete('products', product.id);
                                  variants.forEach(v => db.delete('product_variants', v.id));
                                  setRefreshKey(prev => prev + 1);
                                  showToast(`Produk "${product.name}" berhasil dihapus.`, 'info');
                                }
                              });
                            }}
                          >
                            Hapus
                          </button>
                        </div>
                      </header>

                      {/* Dropdown Body: Variants (Hidden by Default) */}
                      {isExpanded && (
                        <div style={{ padding: '16px' }}>
                          {product.description && (
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                              {product.description}
                            </p>
                          )}

                          {/* Desktop View Table */}
                          <div className="table-wrapper desktop-only">
                            <table className="table">
                              <thead>
                                <tr>
                                  <th>SKU</th>
                                  <th>Ukuran</th>
                                  <th>Warna</th>
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
                                    <td>{formatRupiah(variant.selling_price)}</td>
                                    <td>
                                      <span className={`badge ${variant.stock_quantity < 5 ? 'danger' : 'success'}`}>
                                        {variant.stock_quantity} Pcs
                                      </span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                       <button
                                         type="button"
                                         className="btn btn-danger btn-sm btn-icon"
                                         title="Hapus Varian"
                                         onClick={() => {
                                           askConfirmation({
                                             title: `Hapus Varian SKU ${variant.sku}`,
                                             message: `Apakah Anda yakin ingin menghapus varian ukuran ${variant.size} (${variant.color}) ini?`,
                                             confirmText: 'Hapus Varian',
                                             confirmVariant: 'danger',
                                             onConfirm: () => {
                                               db.delete('product_variants', variant.id);
                                               setRefreshKey(prev => prev + 1);
                                               showToast(`Varian SKU ${variant.sku} berhasil dihapus.`, 'info');
                                             }
                                           });
                                         }}
                                       >
                                         <Trash2 size={14} />
                                       </button>
                                     </td>
                                  </tr>
                                ))}
                                {variants.length === 0 && (
                                  <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '16px' }}>
                                      Belum ada varian ukuran/warna untuk produk ini.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>

                          {/* Mobile View Card Grid (No horizontal scrolling on phones) */}
                          <div className="mobile-only">
                            {variants.map(variant => (
                              <div
                                key={variant.id}
                                style={{
                                  padding: '12px 14px',
                                  borderRadius: '8px',
                                  border: '1px solid var(--card-border)',
                                  backgroundColor: 'var(--card-bg)',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '8px'
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <code style={{ fontSize: '12px', fontWeight: 'bold' }}>{variant.sku}</code>
                                  <span className={`badge ${variant.stock_quantity < 5 ? 'danger' : 'success'}`} style={{ fontSize: '11px' }}>
                                    Stok: {variant.stock_quantity} Pcs
                                  </span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                                  <div>
                                    <span style={{ fontWeight: 'bold' }}>Ukuran: {variant.size}</span>
                                    <span style={{ color: 'var(--text-muted)', margin: '0 6px' }}>•</span>
                                    <span>Warna: {variant.color}</span>
                                  </div>
                                  <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                                    {formatRupiah(variant.selling_price)}
                                  </span>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '6px', borderTop: '1px dashed var(--card-border)' }}>
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    style={{ fontSize: '11px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                    onClick={() => {
                                      askConfirmation({
                                        title: `Hapus Varian SKU ${variant.sku}`,
                                        message: `Apakah Anda yakin ingin menghapus varian ukuran ${variant.size} (${variant.color}) ini?`,
                                        confirmText: 'Hapus Varian',
                                        confirmVariant: 'danger',
                                        onConfirm: () => {
                                          db.delete('product_variants', variant.id);
                                          setRefreshKey(prev => prev + 1);
                                          showToast(`Varian SKU ${variant.sku} berhasil dihapus.`, 'info');
                                        }
                                      });
                                    }}
                                  >
                                    <Trash2 size={12} /> Hapus Varian
                                  </button>
                                </div>
                              </div>
                            ))}

                            {variants.length === 0 && (
                              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '16px', fontSize: '13px' }}>
                                Belum ada varian ukuran/warna untuk produk ini.
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {filteredInventoryProducts.length === 0 && (
                  <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    {inventorySearchQuery ? `Tidak ada produk yang cocok dengan "${inventorySearchQuery}".` : 'Belum ada produk terdaftar. Klik "Tambah Produk Baru" untuk memulai.'}
                  </div>
                )}
              </div>
            </section>
          );
        })()}

        {/* 4. OWNER: MANAGE DEBT / KASBON */}
        {activeTab === 'debt' && currentUser.role === 'OWNER' && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header Title & Search Bar */}
            <div className="card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Manajemen Utang & Kasbon Pelanggan</h2>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>Kelola saldo piutang aktif, penerimaan cicilan, dan daftar riwayat lunas.</p>
                </div>

                {/* Search Bar Pelanggan */}
                <div style={{ position: 'relative', minWidth: '260px', flex: 1, maxWidth: '400px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Cari nama / HP pelanggan..."
                    value={debtSearchQuery}
                    onChange={(e) => {
                      setDebtSearchQuery(e.target.value);
                      setDebtActivePage(1);
                      setDebtSettledPage(1);
                      setDebtHistoryPage(1);
                    }}
                    style={{ paddingLeft: '36px', paddingRight: '32px', fontSize: '13px' }}
                  />
                  {debtSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setDebtSearchQuery('')}
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {(() => {
              // Filter Customers by search query
              const filteredCustomers = allCustomers.filter(c => {
                if (!debtSearchQuery.trim()) return true;
                const q = debtSearchQuery.toLowerCase().trim();
                return c.name.toLowerCase().includes(q) || c.phone_number.toLowerCase().includes(q);
              });

              const activeDebtCustomers = filteredCustomers.filter(c => c.total_debt > 0);
              const settledCustomers = filteredCustomers.filter(c => c.total_debt === 0);

              // Pagination params for Active Debt
              const activeLimit = 5;
              const activeTotalPages = Math.ceil(activeDebtCustomers.length / activeLimit) || 1;
              const currentActivePage = Math.min(debtActivePage, activeTotalPages);
              const paginatedActiveDebt = activeDebtCustomers.slice((currentActivePage - 1) * activeLimit, currentActivePage * activeLimit);

              // Pagination params for Settled Debt
              const settledLimit = 5;
              const settledTotalPages = Math.ceil(settledCustomers.length / settledLimit) || 1;
              const currentSettledPage = Math.min(debtSettledPage, settledTotalPages);
              const paginatedSettled = settledCustomers.slice((currentSettledPage - 1) * settledLimit, currentSettledPage * settledLimit);

              return (
                <>
                  {/* List Customers with outstanding debt */}
                  <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                      <h2 className="card-title" style={{ margin: 0 }}>Daftar Piutang & Kasbon Aktif</h2>
                      <span className="badge warning">{activeDebtCustomers.length} Piutang Aktif</span>
                    </div>

                    {/* Desktop View Table */}
                    <div className="table-wrapper desktop-only">
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
                          {paginatedActiveDebt.map(cust => (
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
                                {debtSearchQuery ? `Tidak ada piutang aktif atas nama "${debtSearchQuery}".` : 'Tidak ada piutang/kasbon aktif. Semua pelanggan dalam kondisi lunas! 🎉'}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile View Card Grid */}
                    <div className="mobile-only">
                      {paginatedActiveDebt.map(cust => (
                        <div
                          key={cust.id}
                          style={{
                            padding: '14px',
                            borderRadius: '10px',
                            border: '1px solid var(--card-border)',
                            backgroundColor: 'var(--card-bg)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                            <div>
                              <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: 0 }}>{cust.name}</h3>
                              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>📱 {cust.phone_number}</span>
                            </div>
                            <span className="badge warning" style={{ fontSize: '10px' }}>Piutang Aktif</span>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-tertiary)', padding: '10px 12px', borderRadius: '8px' }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Sisa Utang Aktif:</span>
                            <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--danger)' }}>
                              {formatRupiah(cust.total_debt)}
                            </span>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
                            <span>Tgl Terdaftar: {new Date(cust.created_at).toLocaleDateString('id-ID')}</span>
                          </div>

                          <button
                            type="button"
                            className="btn btn-success"
                            style={{ width: '100%', padding: '10px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '2px' }}
                            onClick={() => {
                              setSelectedCustomer(cust);
                              setDebtRepayAmount('');
                              setDebtRepayMethod('CASH');
                              setActiveModal('repay-debt');
                            }}
                          >
                            <CreditCard size={16} /> Catat Pembayaran Cicilan
                          </button>
                        </div>
                      ))}

                      {activeDebtCustomers.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '13px' }}>
                          {debtSearchQuery ? `Tidak ada piutang aktif atas nama "${debtSearchQuery}".` : 'Tidak ada piutang/kasbon aktif. Semua pelanggan dalam kondisi lunas! 🎉'}
                        </div>
                      )}
                    </div>

                    {/* Pagination Active Debt */}
                    {activeTotalPages > 1 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--card-border)', flexWrap: 'wrap', gap: '8px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          Halaman {currentActivePage} dari {activeTotalPages} ({activeDebtCustomers.length} Data)
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            disabled={currentActivePage === 1}
                            onClick={() => setDebtActivePage(prev => Math.max(1, prev - 1))}
                          >
                            ‹ Sebelumnya
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            disabled={currentActivePage === activeTotalPages}
                            onClick={() => setDebtActivePage(prev => Math.min(activeTotalPages, prev + 1))}
                          >
                            Selanjutnya ›
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* List Settled Customers */}
                  <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                      <h2 className="card-title" style={{ margin: 0 }}>Daftar Pelanggan Bebas Utang</h2>
                      <span className="badge success">{settledCustomers.length} Bebas Utang</span>
                    </div>

                    {/* Desktop View Table */}
                    <div className="table-wrapper desktop-only">
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
                          {paginatedSettled.map(cust => (
                            <tr key={cust.id}>
                              <td><strong>{cust.name}</strong></td>
                              <td>{cust.phone_number}</td>
                              <td>
                                <span className="badge success">Bebas Utang (Rp 0)</span>
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

                    {/* Mobile View Card Grid */}
                    <div className="mobile-only">
                      {paginatedSettled.map(cust => (
                        <div
                          key={cust.id}
                          style={{
                            padding: '12px 14px',
                            borderRadius: '8px',
                            border: '1px solid var(--card-border)',
                            backgroundColor: 'var(--card-bg)',
                            display: 'flex',
                            justify: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div>
                            <h4 style={{ fontSize: '14px', fontWeight: 'bold', margin: 0 }}>{cust.name}</h4>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>📱 {cust.phone_number}</span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span className="badge success" style={{ fontSize: '10px' }}>Bebas Utang</span>
                          </div>
                        </div>
                      ))}

                      {settledCustomers.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: '13px' }}>
                          Belum ada pelanggan lunas.
                        </div>
                      )}
                    </div>

                    {/* Pagination Settled Debt */}
                    {settledTotalPages > 1 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--card-border)', flexWrap: 'wrap', gap: '8px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          Halaman {currentSettledPage} dari {settledTotalPages} ({settledCustomers.length} Data)
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            disabled={currentSettledPage === 1}
                            onClick={() => setDebtSettledPage(prev => Math.max(1, prev - 1))}
                          >
                            ‹ Sebelumnya
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            disabled={currentSettledPage === settledTotalPages}
                            onClick={() => setDebtSettledPage(prev => Math.min(settledTotalPages, prev + 1))}
                          >
                            Selanjutnya ›
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              );
            })()}

            {/* Debt Payments History */}
            {(() => {
              // Filter Debt Payments by search query
              const filteredDebtPayments = allDebtPayments.slice().reverse().filter(payment => {
                if (!debtSearchQuery.trim()) return true;
                const q = debtSearchQuery.toLowerCase().trim();
                const cust = allCustomers.find(c => c.id === payment.customer_id);
                const custName = cust ? cust.name.toLowerCase() : '';
                const custPhone = cust ? cust.phone_number.toLowerCase() : '';
                return custName.includes(q) || custPhone.includes(q);
              });

              const historyLimit = 5;
              const historyTotalPages = Math.ceil(filteredDebtPayments.length / historyLimit) || 1;
              const currentHistoryPage = Math.min(debtHistoryPage, historyTotalPages);
              const paginatedHistory = filteredDebtPayments.slice((currentHistoryPage - 1) * historyLimit, currentHistoryPage * historyLimit);

              return (
                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                    <h2 className="card-title" style={{ margin: 0 }}>Riwayat Pembayaran Cicilan</h2>
                    <span className="badge info">{filteredDebtPayments.length} Transaksi Cicilan</span>
                  </div>

                  {/* Desktop View Table */}
                  <div className="table-wrapper desktop-only">
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
                        {paginatedHistory.map(payment => {
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
                        {filteredDebtPayments.length === 0 && (
                          <tr>
                            <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Belum ada riwayat cicilan.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile View Card Grid */}
                  <div className="mobile-only">
                    {paginatedHistory.map(payment => {
                      const cust = allCustomers.find(c => c.id === payment.customer_id);
                      const cashier = db.find('users', u => u.id === payment.cashier_id);
                      return (
                        <div
                          key={payment.id}
                          style={{
                            padding: '12px 14px',
                            borderRadius: '8px',
                            border: '1px solid var(--card-border)',
                            backgroundColor: 'var(--card-bg)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <strong style={{ fontSize: '14px' }}>{cust ? cust.name : 'Unknown'}</strong>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                {new Date(payment.created_at).toLocaleString('id-ID')}
                              </div>
                            </div>
                            <span style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--success)' }}>
                              + {formatRupiah(payment.amount_paid)}
                            </span>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px dashed var(--card-border)', fontSize: '12px' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>
                              Via: <span className="badge info" style={{ fontSize: '10px' }}>{payment.payment_method}</span> | Kasir: {cashier ? cashier.name : 'Kasir'}
                            </span>

                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '11px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                              onClick={() => {
                                setSelectedDebtPayment(payment);
                                setActiveModal('debt-receipt');
                              }}
                            >
                              <Printer size={12} /> Struk
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {filteredDebtPayments.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: '13px' }}>
                        Belum ada riwayat cicilan.
                      </div>
                    )}
                  </div>

                  {/* Pagination Debt History */}
                  {historyTotalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--card-border)', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        Halaman {currentHistoryPage} dari {historyTotalPages} ({filteredDebtPayments.length} Data)
                      </span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          disabled={currentHistoryPage === 1}
                          onClick={() => setDebtHistoryPage(prev => Math.max(1, prev - 1))}
                        >
                          ‹ Sebelumnya
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          disabled={currentHistoryPage === historyTotalPages}
                          onClick={() => setDebtHistoryPage(prev => Math.min(historyTotalPages, prev + 1))}
                        >
                          Selanjutnya ›
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

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

      {/* A2. POS ITEM SELECTION MODAL (PRODUCT BASED WITH 2-STEP VARIANT SELECTOR) */}
      {activeModal === 'pos-select-item' && posSelectedProduct && (() => {
        const prodVariants = allVariants.filter(v => v.product_id === posSelectedProduct.id);
        const category = allCategories.find(c => c.id === posSelectedProduct.category_id);

        // Extract unique sizes & colors
        const uniqueSizes = Array.from(new Set(prodVariants.map(v => v.size)));
        const currentSize = posModalSize || (uniqueSizes[0] || '');

        const variantsForSize = prodVariants.filter(v => v.size === currentSize);
        const uniqueColorsForSize = Array.from(new Set(variantsForSize.map(v => v.color)));
        const currentColor = posModalColor || (uniqueColorsForSize[0] || '');

        // Find exact target variant
        const currentVariant = prodVariants.find(v => v.size === currentSize && v.color === currentColor)
          || variantsForSize[0]
          || prodVariants[0]
          || null;

        const currentUnitPrice = currentVariant ? getAdjustedPrice(currentVariant.selling_price) : 0;
        const currentSubtotal = currentUnitPrice * (posModalQty || 1);

        return (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '520px' }}>
              <header className="modal-header">
                <div>
                  <span className="badge info" style={{ fontSize: '11px', marginBottom: '4px' }}>{category ? category.name : 'Umum'}</span>
                  <h2 className="modal-title" style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>{posSelectedProduct.name}</h2>
                </div>
                <button type="button" className="modal-close" onClick={() => setActiveModal(null)}><X size={20} /></button>
              </header>

              <form onSubmit={(e) => {
                e.preventDefault();
                if (!currentVariant) {
                  showToast('Silakan pilih ukuran & warna varian.', 'warning');
                  return;
                }
                if (currentVariant.stock_quantity < posModalQty) {
                  showToast('Stok tidak mencukupi.', 'error');
                  return;
                }
                addToCart(currentVariant, Number(posModalQty));
                setActiveModal(null);
              }}>
                {/* 1. Pilih Ukuran */}
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ fontWeight: 'bold' }}>1. Pilih Ukuran</label>
                  {uniqueSizes.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {uniqueSizes.map(sz => {
                        const isSelected = currentSize === sz;
                        const hasStock = prodVariants.some(v => v.size === sz && v.stock_quantity > 0);

                        return (
                          <button
                            type="button"
                            key={sz}
                            onClick={() => {
                              setPosModalSize(sz);
                              const colors = Array.from(new Set(prodVariants.filter(v => v.size === sz).map(v => v.color)));
                              if (colors.length > 0) setPosModalColor(colors[0]);
                            }}
                            className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                            style={{
                              padding: '8px 16px',
                              fontSize: '14px',
                              fontWeight: 'bold',
                              borderRadius: '8px',
                              opacity: hasStock ? 1 : 0.5
                            }}
                          >
                            Ukuran {sz}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Belum ada ukuran tersedia.</div>
                  )}
                </div>

                {/* 2. Pilih Warna */}
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ fontWeight: 'bold' }}>2. Pilih Warna</label>
                  {uniqueColorsForSize.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {uniqueColorsForSize.map(col => {
                        const isSelected = currentColor === col;
                        const matchingVariant = prodVariants.find(v => v.size === currentSize && v.color === col);
                        const isOut = !matchingVariant || matchingVariant.stock_quantity <= 0;

                        return (
                          <button
                            type="button"
                            key={col}
                            onClick={() => !isOut && setPosModalColor(col)}
                            disabled={isOut}
                            className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                            style={{
                              padding: '6px 14px',
                              fontSize: '13px',
                              borderRadius: '20px',
                              border: isSelected ? '2px solid var(--primary)' : '1px solid var(--card-border)',
                              opacity: isOut ? 0.4 : 1,
                              cursor: isOut ? 'not-allowed' : 'pointer'
                            }}
                          >
                            {col} {matchingVariant ? `(${matchingVariant.stock_quantity} Pcs)` : ''}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Silakan pilih ukuran terlebih dahulu.</div>
                  )}
                </div>

                {/* Detail Varian Terpilih */}
                {currentVariant && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-tertiary)', padding: '8px 12px', borderRadius: '8px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      SKU: <code>{currentVariant.sku}</code>
                    </span>
                    <span className={`badge ${currentVariant.stock_quantity > 0 ? 'success' : 'danger'}`}>
                      Stok: {currentVariant.stock_quantity} Pcs
                    </span>
                  </div>
                )}

                {/* 3. Select Quantity */}
                <div className="form-group">
                  <label htmlFor="pos-modal-qty" className="form-label" style={{ fontWeight: 'bold' }}>3. Jumlah Pembelian (Pcs)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      style={{ width: '40px', height: '40px', fontSize: '18px', padding: 0, fontWeight: 'bold' }}
                      onClick={() => setPosModalQty(Math.max(1, posModalQty - 1))}
                    >
                      -
                    </button>
                    <input 
                      id="pos-modal-qty"
                      type="number"
                      min="1"
                      max={currentVariant ? currentVariant.stock_quantity : 1}
                      className="form-control"
                      style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}
                      value={posModalQty}
                      onChange={(e) => setPosModalQty(Math.max(1, Number(e.target.value)))}
                      required
                    />
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      style={{ width: '40px', height: '40px', fontSize: '18px', padding: 0, fontWeight: 'bold' }}
                      onClick={() => {
                        if (currentVariant && posModalQty < currentVariant.stock_quantity) {
                          setPosModalQty(posModalQty + 1);
                        }
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Price Summary Calculation */}
                {currentVariant && (
                  <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '12px 16px', borderRadius: '12px', marginBottom: '16px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Harga Pricelist Base:</span>
                      <span>{formatRupiah(currentVariant.selling_price)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Skema Harga ({customerType}):</span>
                      <span style={{ color: customerType === 'GROSIR' ? 'var(--text-primary)' : 'var(--primary)', fontWeight: 'bold' }}>
                        {customerType === 'GURU' ? '+ Rp 5.000' : customerType === 'GROSIR' ? '+ Rp 0 (Base)' : '+ Rp 15.000'}
                      </span>
                    </div>
                    <div style={{ borderTop: '1px dashed var(--card-border)', paddingTop: '6px', marginTop: '6px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '14px' }}>
                      <span>Harga per Unit ({customerType}):</span>
                      <span style={{ color: 'var(--primary)' }}>{formatRupiah(currentUnitPrice)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '16px', marginTop: '6px' }}>
                      <span>Subtotal ({posModalQty} Pcs):</span>
                      <span style={{ color: 'var(--success)' }}>{formatRupiah(currentSubtotal)}</span>
                    </div>
                  </div>
                )}

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Batal</button>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={!currentVariant || currentVariant.stock_quantity <= 0}
                  >
                    + Tambah ke Keranjang
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* B. UNIFIED FACTORY INBOUND (RESTOCK) */}
      {activeModal === 'factory-inbound-unified' && (() => {
        const prod = allProducts.find(p => p.id === restockProductId) || (allProducts[0] || null);
        const prodVariants = prod ? allVariants.filter(v => v.product_id === prod.id) : [];

        const uniqueSizes = Array.from(new Set(prodVariants.map(v => v.size)));
        const currentSize = restockSize || (uniqueSizes[0] || '');

        const variantsForSize = prodVariants.filter(v => v.size === currentSize);
        const uniqueColors = Array.from(new Set(variantsForSize.map(v => v.color)));
        const currentColor = restockColor || (uniqueColors[0] || '');

        const targetVariant = prodVariants.find(v => v.size === currentSize && v.color === currentColor)
          || variantsForSize[0]
          || prodVariants[0]
          || null;

        return (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '520px' }}>
              <header className="modal-header">
                <div>
                  <h2 className="modal-title" style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Terima Barang dari Pabrik (Restock)</h2>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>Tambah pasokan stok masuk dari konveksi pabrik.</p>
                </div>
                <button type="button" className="modal-close" onClick={() => setActiveModal(null)}><X size={20} /></button>
              </header>

              <form onSubmit={(e) => {
                e.preventDefault();
                if (!targetVariant) {
                  showToast('Silakan pilih varian produk.', 'warning');
                  return;
                }
                const qty = Number(factoryInQty);
                if (qty <= 0) {
                  showToast('Jumlah barang masuk harus lebih dari 0.', 'warning');
                  return;
                }
                db.addStockFromFactory(targetVariant.id, qty, factoryInNotes, currentUser.id);
                setActiveModal(null);
                setRefreshKey(prev => prev + 1);
                showToast(`Stok ${qty} Pcs untuk ${prod ? prod.name : ''} (${targetVariant.size} - ${targetVariant.color}) berhasil ditambahkan!`, 'success');
              }}>

                {/* 1. Pilih Produk Utama */}
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label htmlFor="restock-product-select" className="form-label" style={{ fontWeight: 'bold' }}>1. Pilih Produk Utama</label>
                  <select
                    id="restock-product-select"
                    className="form-control"
                    value={prod ? prod.id : ''}
                    onChange={(e) => {
                      setRestockProductId(e.target.value);
                      const pVars = allVariants.filter(v => v.product_id === e.target.value);
                      if (pVars.length > 0) {
                        setRestockSize(pVars[0].size);
                        setRestockColor(pVars[0].color);
                      } else {
                        setRestockSize('');
                        setRestockColor('');
                      }
                    }}
                    required
                  >
                    {allProducts.slice().sort((a, b) => a.name.localeCompare(b.name, 'id', { sensitivity: 'base' })).map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* 2. Pilih Ukuran */}
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ fontWeight: 'bold' }}>2. Pilih Ukuran</label>
                  {uniqueSizes.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {uniqueSizes.map(sz => {
                        const isSelected = currentSize === sz;
                        return (
                          <button
                            type="button"
                            key={sz}
                            onClick={() => {
                              setRestockSize(sz);
                              const colors = Array.from(new Set(prodVariants.filter(v => v.size === sz).map(v => v.color)));
                              if (colors.length > 0) setRestockColor(colors[0]);
                            }}
                            className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ padding: '6px 14px', fontSize: '13px', fontWeight: 'bold', borderRadius: '8px' }}
                          >
                            Ukuran {sz}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Tidak ada varian ukuran untuk produk ini.</div>
                  )}
                </div>

                {/* 3. Pilih Warna */}
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ fontWeight: 'bold' }}>3. Pilih Warna</label>
                  {uniqueColors.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {uniqueColors.map(col => {
                        const isSelected = currentColor === col;
                        const v = prodVariants.find(x => x.size === currentSize && x.color === col);
                        return (
                          <button
                            type="button"
                            key={col}
                            onClick={() => setRestockColor(col)}
                            className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                            style={{
                              padding: '6px 14px',
                              fontSize: '13px',
                              borderRadius: '20px',
                              border: isSelected ? '2px solid var(--primary)' : '1px solid var(--card-border)'
                            }}
                          >
                            {col} {v ? `(Stok: ${v.stock_quantity} Pcs)` : ''}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Pilih ukuran terlebih dahulu.</div>
                  )}
                </div>

                {/* Target Variant Info Box */}
                {targetVariant && (
                  <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>SKU Terpilih:</span>
                      <code>{targetVariant.sku}</code>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                      <span>Stok Toko Saat Ini:</span>
                      <span className="badge success">{targetVariant.stock_quantity} Pcs</span>
                    </div>
                  </div>
                )}

                {/* 4. Input Jumlah Masuk */}
                <div className="form-group">
                  <label htmlFor="unified-factory-qty" className="form-label" style={{ fontWeight: 'bold' }}>4. Jumlah Barang Masuk (Pcs)</label>
                  <input
                    id="unified-factory-qty"
                    type="number"
                    min="1"
                    className="form-control"
                    placeholder="Masukkan jumlah pasokan pcs..."
                    value={factoryInQty}
                    onChange={(e) => setFactoryInQty(e.target.value)}
                    required
                  />
                </div>

                {/* 5. Catatan */}
                <div className="form-group">
                  <label htmlFor="unified-factory-notes" className="form-label">Catatan Tambahan (Opsional)</label>
                  <input
                    id="unified-factory-notes"
                    type="text"
                    className="form-control"
                    placeholder="Misal: Surat Jalan No. 102, Pabrik Mas Joko..."
                    value={factoryInNotes}
                    onChange={(e) => setFactoryInNotes(e.target.value)}
                  />
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Batal</button>
                  <button type="submit" className="btn btn-primary" disabled={!targetVariant}>Simpan Stok Masuk</button>
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
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <header className="modal-header">
              <div>
                <h2 className="modal-title" style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Tambah Produk & Varian Baru</h2>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>Buat produk baru atau tambahkan varian ukuran/warna baru.</p>
              </div>
              <button type="button" className="modal-close" onClick={() => setActiveModal(null)}><X size={20} /></button>
            </header>

            <form onSubmit={handleUnifiedAddProductVariant}>
              {/* Product Selection / Creation Mode */}
              <div className="form-group">
                <label htmlFor="variant-prod" className="form-label" style={{ fontWeight: 'bold' }}>1. Pilih Produk Utama</label>
                <select
                  id="variant-prod"
                  className="form-control"
                  value={newVariantProductId}
                  onChange={(e) => setNewVariantProductId(e.target.value)}
                  required
                >
                  <option value="NEW_PRODUCT">+ Buat Produk Induk Baru</option>
                  {allProducts.slice().sort((a, b) => a.name.localeCompare(b.name, 'id', { sensitivity: 'base' })).map(p => (
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
                      placeholder="Misal: Hem Putih Panjang, Rok Span, Sabuk..."
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      required={newVariantProductId === 'NEW_PRODUCT'}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="prod-desc" className="form-label">Deskripsi (Opsional)</label>
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
              <h3 style={{ fontSize: '14px', margin: '16px 0 12px', fontWeight: 'bold' }}>2. Detail Varian (Ukuran & Warna)</h3>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="variant-size" className="form-label">Ukuran Varian</label>
                  <input
                    id="variant-size"
                    type="text"
                    className="form-control"
                    placeholder="Misal: 2, 3, S, M, L, XL"
                    value={newVariantSize}
                    onChange={(e) => setNewVariantSize(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="variant-color" className="form-label">Warna Varian</label>
                  <input
                    id="variant-color"
                    type="text"
                    className="form-control"
                    placeholder="Misal: Merah, Putih, Pramuka"
                    value={newVariantColor}
                    onChange={(e) => setNewVariantColor(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="variant-selling" className="form-label">Harga Jual Toko (Rp)</label>
                <input
                  id="variant-selling"
                  type="number"
                  className="form-control"
                  placeholder="Masukkan harga jual..."
                  value={newVariantSellingPrice}
                  onChange={(e) => setNewVariantSellingPrice(e.target.value)}
                  required
                />
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
      )}

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

      {/* GLOBAL TOAST NOTIFICATION */}
      {toast && (
        <div className={`toast-notification toast-${toast.type}`}>
          <div className="toast-content">
            {toast.type === 'success' && <CheckCircle size={18} className="toast-icon success" />}
            {toast.type === 'error' && <X size={18} className="toast-icon danger" />}
            {toast.type === 'warning' && <AlertTriangle size={18} className="toast-icon warning" />}
            {toast.type === 'info' && <CheckCircle size={18} className="toast-icon info" />}
            <span>{toast.message}</span>
          </div>
          <button type="button" className="toast-close" onClick={() => setToast(null)}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* GLOBAL CUSTOM CONFIRMATION MODAL */}
      {confirmConfig && (
        <div className="modal-overlay" style={{ zIndex: 10000 }}>
          <div className="modal-content" style={{ maxWidth: '420px', textAlign: 'center', padding: '28px 24px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: confirmConfig.confirmVariant === 'danger' ? 'var(--danger-light)' : 'var(--primary-light)',
              color: confirmConfig.confirmVariant === 'danger' ? 'var(--danger)' : 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              {confirmConfig.confirmVariant === 'danger' ? <Trash2 size={24} /> : <AlertTriangle size={24} />}
            </div>
            
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>{confirmConfig.title}</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.5' }}>
              {confirmConfig.message}
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                style={{ flex: 1 }}
                onClick={() => setConfirmConfig(null)}
              >
                {confirmConfig.cancelText}
              </button>
              <button 
                type="button" 
                className={`btn btn-${confirmConfig.confirmVariant}`}
                style={{ flex: 1 }}
                onClick={confirmConfig.onConfirm}
              >
                {confirmConfig.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px 20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h2 style={{ color: '#ef4444', marginBottom: '12px' }}>Terjadi Kendala Tampilan</h2>
          <p style={{ color: '#64748b', marginBottom: '20px' }}>
            {this.state.error ? this.state.error.toString() : 'Terjadi kendala sistem.'}
          </p>
          <button
            onClick={() => {
              localStorage.removeItem('oliviana_db_version');
              window.location.reload();
            }}
            style={{ padding: '10px 20px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Muat Ulang Aplikasi (Reset Database & Cache)
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function AppWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
