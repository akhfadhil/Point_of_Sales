// src/hooks/useCart.js
import { useState } from 'react';
import { db } from '../db';

/**
 * Custom Hook untuk mengelola state keranjang belanja, penyesuaian harga tipe pelanggan, & checkout POS
 * @param {Object} options
 * @param {Function} options.showToast - Fungsi notifikasi toast
 * @param {Function} options.setRefreshKey - Setter refresh key data
 * @param {Function} options.setActiveModal - Setter modal aktif
 * @param {Function} options.setCurrentSaleInvoice - Setter invoice penjualan aktif
 * @param {Object} options.currentUser - User login saat ini
 */
export default function useCart({
  showToast,
  setRefreshKey,
  setActiveModal,
  setCurrentSaleInvoice,
  currentUser
}) {
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

  // Cart operations
  const addToCart = (variant, qtyToAdd = 1) => {
    const existing = cart.find(item => item.id === variant.id);
    const product = db.find('products', p => p.id === variant.product_id);

    if (existing) {
      if (existing.quantity + qtyToAdd > variant.stock_quantity) {
        if (showToast) showToast('Stok tidak mencukupi untuk menambah item.', 'error');
        return;
      }
      setCart(cart.map(item =>
        item.id === variant.id ? { ...item, quantity: item.quantity + qtyToAdd } : item
      ));
    } else {
      if (variant.stock_quantity < qtyToAdd) {
        if (showToast) showToast('Stok tidak mencukupi.', 'error');
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
    if (showToast) showToast(`${product ? product.name : 'Barang'} (${variant.size}) ditambahkan ke keranjang`, 'success');
  };

  const updateCartQty = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        if (newQty <= 0) return null;
        if (newQty > item.maxStock) {
          if (showToast) showToast('Stok maksimum tercapai.', 'warning');
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
    if (e && e.preventDefault) e.preventDefault();
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
    if (setRefreshKey) setRefreshKey(prev => prev + 1);
  };

  // Complete POS Sale
  const handleCheckout = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const total = getCartTotal();
    if (total <= 0) return;

    // Validasi pembayaran
    const paid = Number(paidAmount || 0);
    let status = 'PAID';

    if (paymentMethod === 'DEBT') {
      if (!selectedCustomerId) {
        if (showToast) showToast('Pelanggan wajib dipilih untuk metode pembayaran Kasbon/Utang.', 'warning');
        return;
      }
      if (paid === 0) {
        status = 'UNPAID';
      } else if (paid < total) {
        status = 'PARTIAL';
      } else {
        if (showToast) showToast('Pembayaran tunai penuh tidak bisa bermetode Kasbon.', 'warning');
        return;
      }
    } else {
      // Pembayaran cash/transfer/qris non-hutang
      if (paid < total) {
        if (showToast) showToast('Jumlah pembayaran kurang dari total belanja.', 'error');
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
      const sale = db.createSale(saleData, items, currentUser?.id || null);
      if (setCurrentSaleInvoice) setCurrentSaleInvoice(sale);
      setCart([]);
      setSelectedCustomerId('');
      setPaymentMethod('CASH');
      setPaidAmount('');
      if (setRefreshKey) setRefreshKey(prev => prev + 1);
      if (setActiveModal) setActiveModal('checkout-success');
      if (showToast) showToast('Transaksi penjualan berhasil diproses!', 'success');
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Terjadi kesalahan saat memproses transaksi.', 'error');
    }
  };

  return {
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
  };
}
