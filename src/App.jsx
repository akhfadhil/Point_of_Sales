// src/App.jsx
import React, { useState, useEffect } from 'react';
import { db } from './db';
import { formatRupiah } from './utils/formatters';
import ErrorBoundary from './components/common/ErrorBoundary';
import Toast from './components/common/Toast';
import ConfirmModal from './components/common/ConfirmModal';
import useResponsive from './hooks/useResponsive';
import useAuth from './hooks/useAuth';
import useCart from './hooks/useCart';
import CheckoutSuccessModal from './components/modals/CheckoutSuccessModal';
import DebtReceiptModal from './components/modals/DebtReceiptModal';
import FactoryInboundModal from './components/modals/FactoryInboundModal';
import AddProductVariantModal from './components/modals/AddProductVariantModal';
import RepayDebtModal from './components/modals/RepayDebtModal';
import Sidebar from './components/layout/Sidebar';
import HeaderBar from './components/layout/HeaderBar';
import BottomNav from './components/layout/BottomNav';
import LoginView from './components/views/LoginView';
import DbInspectorView from './components/views/DbInspectorView';
import StockCheckerView from './components/views/StockCheckerView';
import SalesHistoryView from './components/views/SalesHistoryView';
import DebtView from './components/views/DebtView';
import InventoryView from './components/views/InventoryView';
import DashboardView from './components/views/DashboardView';
import PosView from './components/views/PosView';
import { Menu, Sun, Moon, Database, X } from 'lucide-react';

function App() {
  // App Layout State
  const [activeTab, setActiveTab] = useState('pos'); // 'pos' | 'dashboard' | 'inventory' | 'debt' | 'history' | 'check-stock'

  // Authentication State & Handlers via useAuth Hook
  const {
    currentUser,
    setCurrentUser,
    emailInput,
    setEmailInput,
    selectedRole,
    setSelectedRole,
    loginError,
    setLoginError,
    handleLogin,
    handleLogout
  } = useAuth(setActiveTab, (cartValue) => setCart && setCart(cartValue));

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




  // Search & Filter State
  const [posSearchQuery, setPosSearchQuery] = useState('');
  const [inventorySearchQuery, setInventorySearchQuery] = useState('');
  const [inventoryProductFilter, setInventoryProductFilter] = useState('');
  const [inventorySizeFilter, setInventorySizeFilter] = useState('');
  const [inventoryColorFilter, setInventoryColorFilter] = useState('');
  const [expandedProductIds, setExpandedProductIds] = useState([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
  const [stockSearchQuery, setStockSearchQuery] = useState('');
  const [stockProductFilter, setStockProductFilter] = useState('');
  const [stockSizeFilter, setStockSizeFilter] = useState('');
  const [stockColorFilter, setStockColorFilter] = useState('');
  const [stockPage, setStockPage] = useState(1);
  const [debtSearchQuery, setDebtSearchQuery] = useState('');
  const [debtActivePage, setDebtActivePage] = useState(1);
  const [debtSettledPage, setDebtSettledPage] = useState(1);
  const [debtHistoryPage, setDebtHistoryPage] = useState(1);
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [historyPage, setHistoryPage] = useState(1);
  const [selectedDbTable, setSelectedDbTable] = useState('users');
  const [mobilePosActiveView, setMobilePosActiveView] = useState('products'); // 'products' | 'cart'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useResponsive(768);

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'checkout-success' | 'factory-inbound' | 'repay-debt' | 'add-product' | 'add-variant'
  const [currentSaleInvoice, setCurrentSaleInvoice] = useState(null);

  // Cart State & POS Operations via useCart Hook
  const {
    cart,
    setCart,
    selectedCustomerId,
    setSelectedCustomerId,
    paymentMethod,
    setPaymentMethod,
    paidAmount,
    setPaidAmount,
    newCustomerName,
    setNewCustomerName,
    newCustomerPhone,
    setNewCustomerPhone,
    isAddingCustomer,
    setIsAddingCustomer,
    customerSearchQuery,
    setCustomerSearchQuery,
    customerType,
    setCustomerType,
    posSelectedProduct,
    setPosSelectedProduct,
    posModalVariantId,
    setPosModalVariantId,
    posModalSize,
    setPosModalSize,
    posModalColor,
    setPosModalColor,
    posModalQty,
    setPosModalQty,
    getAdjustedPrice,
    addToCart,
    updateCartQty,
    removeFromCart,
    getCartTotal,
    handleAddCustomer,
    handleCheckout
  } = useCart({
    showToast,
    setRefreshKey,
    setActiveModal,
    setCurrentSaleInvoice,
    currentUser
  });

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
      if (currentUser.role === 'CASHIER' && ['dashboard', 'db-viewer'].includes(activeTab)) {
        setActiveTab('pos');
      }
    }
  }, [currentUser, activeTab]);




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
      <LoginView
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        emailInput={emailInput}
        setEmailInput={setEmailInput}
        loginError={loginError}
        onSubmit={handleLogin}
      />
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

  return (
    <div className="app-container">
      {/* SIDEBAR NAVIGATION */}
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        handleLogout={handleLogout}
        handleResetDB={handleResetDB}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

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
            title="Ganti Tema"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {currentUser.role === 'OWNER' && (
            <button
              type="button"
              className={`btn btn-sm btn-icon ${activeTab === 'db-viewer' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('db-viewer')}
              title="Inspektor Database"
            >
              <Database size={16} />
            </button>
          )}
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <main className="main-content">
        {/* HEADER BAR */}
        <HeaderBar
          activeTab={activeTab}
          currentUser={currentUser}
        />

        {/* --- DYNAMIC TAB CONTENTS --- */}

        {/* 1. OWNER DASHBOARD */}
        <DashboardView
          isOpen={activeTab === 'dashboard' && currentUser?.role === 'OWNER'}
          dashboardMetrics={dashboardMetrics}
          allSales={allSales}
          allCustomers={allCustomers}
          allMovements={allMovements}
          allVariants={allVariants}
          allProducts={allProducts}
          isMobile={isMobile}
        />

        {/* 2. KASIR POS VIEW */}
        <PosView
          isOpen={activeTab === 'pos'}
          mobilePosActiveView={mobilePosActiveView}
          setMobilePosActiveView={setMobilePosActiveView}
          posSearchQuery={posSearchQuery}
          setPosSearchQuery={setPosSearchQuery}
          selectedCategoryFilter={selectedCategoryFilter}
          setSelectedCategoryFilter={setSelectedCategoryFilter}
          allProducts={allProducts}
          allCategories={allCategories}
          allVariants={allVariants}
          allCustomers={allCustomers}
          getAdjustedPrice={getAdjustedPrice}
          setPosSelectedProduct={setPosSelectedProduct}
          setPosModalVariantId={setPosModalVariantId}
          setPosModalSize={setPosModalSize}
          setPosModalColor={setPosModalColor}
          setPosModalQty={setPosModalQty}
          setActiveModal={setActiveModal}
          cart={cart}
          setCart={setCart}
          updateCartQty={updateCartQty}
          removeFromCart={removeFromCart}
          customerType={customerType}
          setCustomerType={setCustomerType}
          selectedCustomerId={selectedCustomerId}
          setSelectedCustomerId={setSelectedCustomerId}
          customerSearchQuery={customerSearchQuery}
          setCustomerSearchQuery={setCustomerSearchQuery}
          isAddingCustomer={isAddingCustomer}
          setIsAddingCustomer={setIsAddingCustomer}
          newCustomerName={newCustomerName}
          setNewCustomerName={setNewCustomerName}
          newCustomerPhone={newCustomerPhone}
          setNewCustomerPhone={setNewCustomerPhone}
          handleAddCustomer={handleAddCustomer}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          paidAmount={paidAmount}
          setPaidAmount={setPaidAmount}
          getCartTotal={getCartTotal}
          handleCheckout={handleCheckout}
          isMobile={isMobile}
        />

        {/* 3. MANAGE PRODUCTS & VARIANTS (INVENTORY) */}
        <InventoryView
          isOpen={activeTab === 'inventory'}
          allProducts={allProducts}
          allCategories={allCategories}
          allVariants={allVariants}
          inventoryProductFilter={inventoryProductFilter}
          setInventoryProductFilter={setInventoryProductFilter}
          inventorySizeFilter={inventorySizeFilter}
          setInventorySizeFilter={setInventorySizeFilter}
          inventoryColorFilter={inventoryColorFilter}
          setInventoryColorFilter={setInventoryColorFilter}
          inventorySearchQuery={inventorySearchQuery}
          setInventorySearchQuery={setInventorySearchQuery}
          expandedProductIds={expandedProductIds}
          setExpandedProductIds={setExpandedProductIds}
          setRestockProductId={setRestockProductId}
          setRestockSize={setRestockSize}
          setRestockColor={setRestockColor}
          setFactoryInQty={setFactoryInQty}
          setFactoryInNotes={setFactoryInNotes}
          setNewProductName={setNewProductName}
          setNewProductDesc={setNewProductDesc}
          setNewProductCategory={setNewProductCategory}
          setNewVariantProductId={setNewVariantProductId}
          setNewVariantSize={setNewVariantSize}
          setNewVariantColor={setNewVariantColor}
          setNewVariantSellingPrice={setNewVariantSellingPrice}
          setNewVariantStock={setNewVariantStock}
          setActiveModal={setActiveModal}
          askConfirmation={askConfirmation}
          showToast={showToast}
          db={db}
          setRefreshKey={setRefreshKey}
          isMobile={isMobile}
        />

        {/* 4. MANAGE DEBT / KASBON */}
        <DebtView
          isOpen={activeTab === 'debt'}
          allCustomers={allCustomers}
          allDebtPayments={allDebtPayments}
          db={db}
          debtSearchQuery={debtSearchQuery}
          setDebtSearchQuery={setDebtSearchQuery}
          debtActivePage={debtActivePage}
          setDebtActivePage={setDebtActivePage}
          debtSettledPage={debtSettledPage}
          setDebtSettledPage={setDebtSettledPage}
          debtHistoryPage={debtHistoryPage}
          setDebtHistoryPage={setDebtHistoryPage}
          setSelectedCustomer={setSelectedCustomer}
          setDebtRepayAmount={setDebtRepayAmount}
          setDebtRepayMethod={setDebtRepayMethod}
          setActiveModal={setActiveModal}
          setSelectedDebtPayment={setSelectedDebtPayment}
          isMobile={isMobile}
        />

        {/* 5. SALES HISTORY */}
        <SalesHistoryView
          isOpen={activeTab === 'history'}
          allSales={allSales}
          allCustomers={allCustomers}
          db={db}
          historySearchQuery={historySearchQuery}
          setHistorySearchQuery={setHistorySearchQuery}
          historyPage={historyPage}
          setHistoryPage={setHistoryPage}
          setCurrentSaleInvoice={setCurrentSaleInvoice}
          setActiveModal={setActiveModal}
          isMobile={isMobile}
        />

        {/* 6. GENERAL: CHECK STOCK (SHARED) */}
        <StockCheckerView
          isOpen={activeTab === 'check-stock'}
          allVariants={allVariants}
          allProducts={allProducts}
          allCategories={allCategories}
          stockProductFilter={stockProductFilter}
          setStockProductFilter={setStockProductFilter}
          stockSizeFilter={stockSizeFilter}
          setStockSizeFilter={setStockSizeFilter}
          stockColorFilter={stockColorFilter}
          setStockColorFilter={setStockColorFilter}
          stockSearchQuery={stockSearchQuery}
          setStockSearchQuery={setStockSearchQuery}
          stockPage={stockPage}
          setStockPage={setStockPage}
          currentUser={currentUser}
          isMobile={isMobile}
        />

        {/* 7. GENERAL: DATABASE VIEWER (DEVELOPMENT HELPER) */}
        <DbInspectorView
          isOpen={activeTab === 'db-viewer'}
          selectedDbTable={selectedDbTable}
          setSelectedDbTable={setSelectedDbTable}
          db={db}
          isMobile={isMobile}
        />

      </main>

      {/* --- MODAL DIALOGS --- */}

      {/* A. CHECKOUT SUCCESS & DOT MATRIX INVOICE SIMULATOR */}
      <CheckoutSuccessModal
        isOpen={activeModal === 'checkout-success'}
        invoice={currentSaleInvoice}
        db={db}
        showToast={showToast}
        onClose={() => setActiveModal(null)}
      />

      {/* A3. DEBT PAYMENT RECEIPT MODAL (DOT MATRIX FORMAT WITH ALIGNED COLONS & SIGNATURES) */}
      <DebtReceiptModal
        isOpen={activeModal === 'debt-receipt'}
        payment={selectedDebtPayment}
        db={db}
        showToast={showToast}
        onClose={() => setActiveModal(null)}
      />

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
                    isMobile ? (
                      /* Mobile Dropdown Select for Sizes */
                      <select
                        className="form-control"
                        value={currentSize}
                        onChange={(e) => {
                          const sz = e.target.value;
                          setPosModalSize(sz);
                          const colors = Array.from(new Set(prodVariants.filter(v => v.size === sz).map(v => v.color)));
                          if (colors.length > 0) setPosModalColor(colors[0]);
                        }}
                        style={{ fontSize: '14px', padding: '10px 14px', fontWeight: 'bold' }}
                      >
                        {uniqueSizes.map(sz => {
                          const hasStock = prodVariants.some(v => v.size === sz && v.stock_quantity > 0);
                          return (
                            <option key={sz} value={sz}>
                              Ukuran {sz} {hasStock ? '' : '(Stok Habis)'}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      /* Desktop & iPad Button Chips for Sizes */
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
                    )
                  ) : (
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Belum ada ukuran tersedia.</div>
                  )}
                </div>

                {/* 2. Pilih Warna */}
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ fontWeight: 'bold' }}>2. Pilih Warna</label>
                  {uniqueColorsForSize.length > 0 ? (
                    isMobile ? (
                      /* Mobile Dropdown Select for Colors */
                      <select
                        className="form-control"
                        value={currentColor}
                        onChange={(e) => setPosModalColor(e.target.value)}
                        style={{ fontSize: '14px', padding: '10px 14px' }}
                      >
                        {uniqueColorsForSize.map(col => {
                          const matchingVariant = prodVariants.find(v => v.size === currentSize && v.color === col);
                          const isOut = !matchingVariant || matchingVariant.stock_quantity <= 0;
                          return (
                            <option key={col} value={col} disabled={isOut}>
                              {col} {matchingVariant ? `(Stok: ${matchingVariant.stock_quantity} Pcs)` : ''} {isOut ? '- Stok Habis' : ''}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      /* Desktop & iPad Button Chips for Colors */
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
                    )
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
      <FactoryInboundModal
        isOpen={activeModal === 'factory-inbound-unified'}
        allProducts={allProducts}
        allVariants={allVariants}
        restockProductId={restockProductId}
        setRestockProductId={setRestockProductId}
        restockSize={restockSize}
        setRestockSize={setRestockSize}
        restockColor={restockColor}
        setRestockColor={setRestockColor}
        factoryInQty={factoryInQty}
        setFactoryInQty={setFactoryInQty}
        factoryInNotes={factoryInNotes}
        setFactoryInNotes={setFactoryInNotes}
        db={db}
        currentUser={currentUser}
        setRefreshKey={setRefreshKey}
        showToast={showToast}
        onClose={() => setActiveModal(null)}
      />

      {/* C. DEBT REPAYMENT */}
      <RepayDebtModal
        isOpen={activeModal === 'repay-debt'}
        customer={selectedCustomer}
        debtRepayAmount={debtRepayAmount}
        setDebtRepayAmount={setDebtRepayAmount}
        debtRepayMethod={debtRepayMethod}
        setDebtRepayMethod={setDebtRepayMethod}
        onSubmit={handleDebtRepayment}
        onClose={() => { setActiveModal(null); setSelectedCustomer(null); }}
      />

      {/* D. ADD NEW PRODUCT & VARIANT (UNIFIED) */}
      <AddProductVariantModal
        isOpen={activeModal === 'add-product-variant'}
        allProducts={allProducts}
        allCategories={allCategories}
        newVariantProductId={newVariantProductId}
        setNewVariantProductId={setNewVariantProductId}
        newProductName={newProductName}
        setNewProductName={setNewProductName}
        newProductCategory={newProductCategory}
        setNewProductCategory={setNewProductCategory}
        newProductDesc={newProductDesc}
        setNewProductDesc={setNewProductDesc}
        newVariantSize={newVariantSize}
        setNewVariantSize={setNewVariantSize}
        newVariantColor={newVariantColor}
        setNewVariantColor={setNewVariantColor}
        newVariantSellingPrice={newVariantSellingPrice}
        setNewVariantSellingPrice={setNewVariantSellingPrice}
        newVariantStock={newVariantStock}
        setNewVariantStock={setNewVariantStock}
        onSubmit={handleUnifiedAddProductVariant}
        onClose={() => setActiveModal(null)}
      />

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* GLOBAL TOAST NOTIFICATION */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* GLOBAL CUSTOM CONFIRMATION MODAL */}
      <ConfirmModal config={confirmConfig} onClose={() => setConfirmConfig(null)} />

    </div>
  );
}


export default function AppWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
