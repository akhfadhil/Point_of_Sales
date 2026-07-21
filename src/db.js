// src/db.js

const INITIAL_DATA = {
  users: [
    { id: 'u-1', name: 'Bu Oliviana (Owner)', email: 'owner@oliviana.com', role: 'OWNER' },
    { id: 'u-2', name: 'Ani (Kasir)', email: 'kasir@oliviana.com', role: 'CASHIER' }
  ],
  categories: [
    { id: 'c-1', name: 'Atasan' },
    { id: 'c-2', name: 'Bawahan' },
    { id: 'c-3', name: 'Aksesoris' }
  ],
  products: [
    { id: 'p-1', category_id: 'c-1', name: 'Hem Putih Pendek SD', description: 'Baju seragam putih SD lengan pendek bahan katun TC.' },
    { id: 'p-2', category_id: 'c-2', name: 'Celana Merah Pendek SD', description: 'Celana seragam SD pendek warna merah bahan drill.' },
    { id: 'p-3', category_id: 'c-2', name: 'Rok Wiru Merah SD', description: 'Rok wiru panjang SD warna merah bahan drill.' },
    { id: 'p-4', category_id: 'c-3', name: 'Sabuk SD Logo', description: 'Sabuk hitam berlogo SD sekolah umum.' }
  ],
  product_variants: [
    // Hem Putih Pendek SD (p-1)
    { id: 'v-1', product_id: 'p-1', sku: 'HEM-P-SD-S', size: 'S', color: 'Putih', cost_price: 30000, selling_price: 45000, stock_quantity: 25 },
    { id: 'v-2', product_id: 'p-1', sku: 'HEM-P-SD-M', size: 'M', color: 'Putih', cost_price: 32000, selling_price: 48000, stock_quantity: 30 },
    { id: 'v-3', product_id: 'p-1', sku: 'HEM-P-SD-L', size: 'L', color: 'Putih', cost_price: 34000, selling_price: 50000, stock_quantity: 20 },
    { id: 'v-4', product_id: 'p-1', sku: 'HEM-P-SD-XL', size: 'XL', color: 'Putih', cost_price: 36000, selling_price: 52000, stock_quantity: 15 },

    // Celana Merah Pendek SD (p-2)
    { id: 'v-5', product_id: 'p-2', sku: 'CEL-M-SD-3', size: '3', color: 'Merah', cost_price: 40000, selling_price: 58000, stock_quantity: 10 },
    { id: 'v-6', product_id: 'p-2', sku: 'CEL-M-SD-4', size: '4', color: 'Merah', cost_price: 40000, selling_price: 58000, stock_quantity: 12 },
    { id: 'v-7', product_id: 'p-2', sku: 'CEL-M-SD-5', size: '5', color: 'Merah', cost_price: 42000, selling_price: 60000, stock_quantity: 15 },
    { id: 'v-8', product_id: 'p-2', sku: 'CEL-M-SD-S', size: 'S', color: 'Merah', cost_price: 45000, selling_price: 65000, stock_quantity: 8 },

    // Rok Wiru Merah SD (p-3)
    { id: 'v-9', product_id: 'p-3', sku: 'ROK-W-SD-S', size: 'S', color: 'Merah', cost_price: 45000, selling_price: 65000, stock_quantity: 18 },
    { id: 'v-10', product_id: 'p-3', sku: 'ROK-W-SD-M', size: 'M', color: 'Merah', cost_price: 47000, selling_price: 68000, stock_quantity: 14 },

    // Sabuk SD Logo (p-4)
    { id: 'v-11', product_id: 'p-4', sku: 'SABUK-SD-STD', size: 'All Size', color: 'Hitam', cost_price: 8000, selling_price: 15000, stock_quantity: 50 }
  ],
  stock_movements: [
    { id: 'm-1', variant_id: 'v-1', type: 'FACTORY_IN', quantity: 25, notes: 'Terimaan awal dari Pabrik', created_by: 'u-1', created_at: '2026-07-20T08:00:00Z' },
    { id: 'm-2', variant_id: 'v-2', type: 'FACTORY_IN', quantity: 30, notes: 'Terimaan awal dari Pabrik', created_by: 'u-1', created_at: '2026-07-20T08:00:00Z' },
    { id: 'm-3', variant_id: 'v-3', type: 'FACTORY_IN', quantity: 20, notes: 'Terimaan awal dari Pabrik', created_by: 'u-1', created_at: '2026-07-20T08:00:00Z' },
    { id: 'm-4', variant_id: 'v-4', type: 'FACTORY_IN', quantity: 15, notes: 'Terimaan awal dari Pabrik', created_by: 'u-1', created_at: '2026-07-20T08:00:00Z' },
    { id: 'm-5', variant_id: 'v-5', type: 'FACTORY_IN', quantity: 10, notes: 'Terimaan awal dari Pabrik', created_by: 'u-1', created_at: '2026-07-20T08:05:00Z' }
  ],
  customers: [
    { id: 'cst-1', name: 'Pak Rahmad (Guru SD 1)', phone_number: '081234567890', total_debt: 120000, created_at: '2026-07-19T09:00:00Z' },
    { id: 'cst-2', name: 'Bu Siti Khotimah', phone_number: '089876543210', total_debt: 0, created_at: '2026-07-20T10:00:00Z' },
    { id: 'cst-3', name: 'Koperasi Sekolah Sukodono', phone_number: '085223344556', total_debt: 450000, created_at: '2026-07-21T07:30:00Z' }
  ],
  sales: [
    {
      id: 's-1',
      invoice_number: 'INV-20260720-001',
      cashier_id: 'u-2',
      customer_id: 'cst-1',
      total_amount: 148000,
      payment_method: 'DEBT',
      payment_status: 'PARTIAL',
      paid_amount: 28000,
      change_amount: 0,
      created_at: '2026-07-20T11:00:00Z'
    },
    {
      id: 's-2',
      invoice_number: 'INV-20260721-001',
      cashier_id: 'u-2',
      customer_id: 'cst-2',
      total_amount: 90000,
      payment_method: 'CASH',
      payment_status: 'PAID',
      paid_amount: 100000,
      change_amount: 10000,
      created_at: '2026-07-21T09:15:00Z'
    }
  ],
  sale_items: [
    // s-1 (INV-20260720-001)
    { id: 'si-1', sale_id: 's-1', variant_id: 'v-2', quantity: 1, price_per_unit: 48000, subtotal: 48000 },
    { id: 'si-2', sale_id: 's-1', variant_id: 'v-6', quantity: 1, price_per_unit: 58000, subtotal: 58000 },
    { id: 'si-3', sale_id: 's-1', variant_id: 'v-11', quantity: 2, price_per_unit: 15000, subtotal: 30000 },

    // s-2 (INV-20260721-001)
    { id: 'si-4', sale_id: 's-2', variant_id: 'v-1', quantity: 2, price_per_unit: 45000, subtotal: 90000 }
  ],
  debt_payments: [
    {
      id: 'dp-1',
      customer_id: 'cst-1',
      amount_paid: 50000,
      payment_method: 'CASH',
      cashier_id: 'u-2',
      created_at: '2026-07-20T16:00:00Z'
    }
  ]
};

// Pastikan DB ada di LocalStorage
if (!localStorage.getItem('oliviana_db')) {
  localStorage.setItem('oliviana_db', JSON.stringify(INITIAL_DATA));
}

const getDB = () => {
  return JSON.parse(localStorage.getItem('oliviana_db'));
};

const saveDB = (db) => {
  localStorage.setItem('oliviana_db', JSON.stringify(db));
};

export const db = {
  // Ambil semua data di tabel tertentu
  get: (table) => {
    return getDB()[table] || [];
  },

  // Cari item spesifik
  find: (table, predicate) => {
    return getDB()[table]?.find(predicate);
  },

  // Tambah item ke tabel
  insert: (table, item) => {
    const current = getDB();
    if (!current[table]) current[table] = [];

    const newItem = {
      id: `${table.substring(0, 3)}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      created_at: new Date().toISOString(),
      ...item
    };

    current[table].push(newItem);
    saveDB(current);
    return newItem;
  },

  // Update item di tabel
  update: (table, id, updates) => {
    const current = getDB();
    if (!current[table]) return null;

    const idx = current[table].findIndex(x => x.id === id);
    if (idx === -1) return null;

    current[table][idx] = {
      ...current[table][idx],
      ...updates
    };

    saveDB(current);
    return current[table][idx];
  },

  // Hapus item
  delete: (table, id) => {
    const current = getDB();
    if (!current[table]) return false;

    const filtered = current[table].filter(x => x.id !== id);
    current[table] = filtered;
    saveDB(current);
    return true;
  },

  // Reset database ke kondisi awal
  reset: () => {
    saveDB(INITIAL_DATA);
    return INITIAL_DATA;
  },

  // Login simulasi
  login: (email, role) => {
    const users = db.get('users');
    const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === role);
    return matched || null;
  },

  // Tambah stok dari pabrik (Inbound)
  addStockFromFactory: (variantId, quantity, notes, userId) => {
    const current = getDB();
    const variantIdx = current.product_variants.findIndex(v => v.id === variantId);
    if (variantIdx === -1) return null;

    // Update stock quantity
    current.product_variants[variantIdx].stock_quantity = Number(current.product_variants[variantIdx].stock_quantity) + Number(quantity);

    // Log stock movement
    const movementId = `m-${Date.now()}`;
    const newMovement = {
      id: movementId,
      variant_id: variantId,
      type: 'FACTORY_IN',
      quantity: Number(quantity),
      notes: notes || 'Terima barang dari Pabrik',
      created_by: userId,
      created_at: new Date().toISOString()
    };
    current.stock_movements.push(newMovement);

    saveDB(current);
    return current.product_variants[variantIdx];
  },

  // Buat transaksi penjualan baru
  createSale: (saleData, items, userId) => {
    const current = getDB();
    const invoiceNumber = `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(Date.now()).slice(-4)}`;

    const newSale = {
      id: `s-${Date.now()}`,
      invoice_number: invoiceNumber,
      cashier_id: userId,
      customer_id: saleData.customer_id || null,
      total_amount: Number(saleData.total_amount),
      payment_method: saleData.payment_method, // 'CASH' | 'QRIS' | 'TRANSFER' | 'DEBT'
      payment_status: saleData.payment_status, // 'PAID' | 'UNPAID' | 'PARTIAL'
      paid_amount: Number(saleData.paid_amount || 0),
      change_amount: Number(saleData.change_amount || 0),
      created_at: new Date().toISOString()
    };

    // Tambahkan item transaksi
    items.forEach((item, idx) => {
      const newItem = {
        id: `si-${Date.now()}-${idx}`,
        sale_id: newSale.id,
        variant_id: item.variant_id,
        quantity: Number(item.quantity),
        price_per_unit: Number(item.price_per_unit),
        subtotal: Number(item.quantity) * Number(item.price_per_unit)
      };
      current.sale_items.push(newItem);

      // Potong stok varian
      const variantIdx = current.product_variants.findIndex(v => v.id === item.variant_id);
      if (variantIdx !== -1) {
        current.product_variants[variantIdx].stock_quantity = Number(current.product_variants[variantIdx].stock_quantity) - Number(item.quantity);
      }

      // Catat pergerakan stok
      current.stock_movements.push({
        id: `m-${Date.now()}-${idx}`,
        variant_id: item.variant_id,
        type: 'SALE',
        quantity: -Number(item.quantity),
        notes: `Penjualan ${invoiceNumber}`,
        created_by: userId,
        created_at: new Date().toISOString()
      });
    });

    // Urus Piutang Pelanggan jika pembayaran cicil / kasbon
    if (newSale.customer_id) {
      const customerIdx = current.customers.findIndex(c => c.id === newSale.customer_id);
      if (customerIdx !== -1) {
        let addedDebt = 0;
        if (newSale.payment_method === 'DEBT') {
          // Seluruh total_amount berutang minus uang muka
          addedDebt = newSale.total_amount - newSale.paid_amount;
        }

        current.customers[customerIdx].total_debt = Number(current.customers[customerIdx].total_debt) + Number(addedDebt);
      }
    }

    current.sales.push(newSale);
    saveDB(current);
    return newSale;
  },

  // Tambah pembayaran cicilan utang
  addDebtPayment: (customerId, amountPaid, paymentMethod, cashierId) => {
    const current = getDB();
    const customerIdx = current.customers.findIndex(c => c.id === customerId);
    if (customerIdx === -1) return null;

    // Pastikan tidak membayar melebihi utang
    const customer = current.customers[customerIdx];
    const actualPaid = Math.min(Number(amountPaid), Number(customer.total_debt));

    // Potong utang
    customer.total_debt = Number(customer.total_debt) - Number(actualPaid);

    // Catat riwayat cicilan
    const newPayment = {
      id: `dp-${Date.now()}`,
      customer_id: customerId,
      amount_paid: Number(actualPaid),
      payment_method: paymentMethod, // 'CASH' | 'QRIS' | 'TRANSFER'
      cashier_id: cashierId,
      created_at: new Date().toISOString()
    };
    current.debt_payments.push(newPayment);

    saveDB(current);
    return { customer, payment: newPayment };
  }
};
