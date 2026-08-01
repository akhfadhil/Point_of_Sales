import { INITIAL_DATA } from './initialData';
// src/db.js
import { supabase, isSupabaseConfigured, getSupabaseConfigStatus } from './supabaseClient';

// Helper Supabase Sync
const syncSupabaseUpsert = async (table, data) => {
  if (!isSupabaseConfigured() || !supabase || !table || !data) return;
  try {
    const { error } = await supabase.from(table).upsert(data);
    if (error) {
      if (table === 'users' && (error.message?.includes('password') || error.message?.includes('username'))) {
        console.warn('⚠️ Supabase users schema lacks password/username columns. Retrying with basic fields...');
        const sanitized = Array.isArray(data)
          ? data.map(({ password, username, ...rest }) => rest)
          : (() => { const { password, username, ...rest } = data; return rest; })();
        const { error: fallbackErr } = await supabase.from(table).upsert(sanitized);
        if (!fallbackErr) return;
      }

      if (table === 'worker_daily_logs' && (error.message?.includes('status') || error.message?.includes('total_daily_amount'))) {
        console.warn('⚠️ Supabase worker_daily_logs schema lacks status/total_daily_amount. Retrying with basic fields...');
        const sanitized = Array.isArray(data)
          ? data.map(({ status, total_daily_amount, ...rest }) => ({ ...rest, total_amount: total_daily_amount || rest.total_amount || 0 }))
          : (() => { const { status, total_daily_amount, ...rest } = data; return { ...rest, total_amount: total_daily_amount || rest.total_amount || 0 }; })();
        const { error: fallbackErr } = await supabase.from(table).upsert(sanitized);
        if (!fallbackErr) return;
      }

      if (table === 'orders' && (error.message?.includes('customer_id') || error.message?.includes('paid_amount') || error.message?.includes('change_amount'))) {
        console.warn('⚠️ Supabase orders schema lacks customer_id/paid_amount/change_amount. Retrying with basic fields...');
        const sanitized = Array.isArray(data)
          ? data.map(({ customer_id, paid_amount, change_amount, ...rest }) => rest)
          : (() => { const { customer_id, paid_amount, change_amount, ...rest } = data; return rest; })();
        const { error: fallbackErr } = await supabase.from(table).upsert(sanitized);
        if (!fallbackErr) return;
      }

      const errMsg = `[Supabase Error ${table}] ${error.message || JSON.stringify(error)}`;
      console.error(errMsg);
      if (typeof window !== 'undefined') window.__lastSupabaseError = errMsg;
    } else {
      if (typeof window !== 'undefined') window.__lastSupabaseError = null;
    }
  } catch (err) {
    const errMsg = `[Supabase Exception ${table}] ${err.message || JSON.stringify(err)}`;
    console.error(errMsg);
    if (typeof window !== 'undefined') window.__lastSupabaseError = errMsg;
  }
};

const syncSupabaseDelete = async (table, id) => {
  if (!isSupabaseConfigured() || !supabase || !table || !id) return;
  try {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) {
      const errMsg = `[Supabase Delete Error ${table}] ${error.message || JSON.stringify(error)}`;
      console.error(errMsg);
      if (typeof window !== 'undefined') window.__lastSupabaseError = errMsg;
    }
  } catch (err) {
    const errMsg = `[Supabase Delete Exception ${table}] ${err.message || JSON.stringify(err)}`;
    console.error(errMsg);
    if (typeof window !== 'undefined') window.__lastSupabaseError = errMsg;
  }
};

const CURRENT_DB_VERSION = 'v22_restore_piece_rate_garment_types';

// Selalu pastikan LocalStorage diperbarui dan data simulasi lama dibersihkan jika versi berubah
if (localStorage.getItem('oliviana_db_version') !== CURRENT_DB_VERSION) {
  const existingDb = JSON.parse(localStorage.getItem('oliviana_db'));
  if (existingDb) {
    existingDb.products = INITIAL_DATA.products;
    existingDb.categories = INITIAL_DATA.categories;
    existingDb.product_variants = INITIAL_DATA.product_variants;
    existingDb.piece_rate_items = INITIAL_DATA.piece_rate_items;
    existingDb.sales = (existingDb.sales || []).filter(s => !s.id.startsWith('sl-'));
    existingDb.orders = (existingDb.orders || []).filter(o => !o.id.startsWith('sl-') && !o.id.startsWith('ord-1'));
    existingDb.sale_items = (existingDb.sale_items || []).filter(i => !i.id.startsWith('sli-'));
    existingDb.order_items = (existingDb.order_items || []).filter(i => !i.id.startsWith('sli-'));
    existingDb.customers = (existingDb.customers || []).filter(c => !c.id.startsWith('cst-'));
    existingDb.debt_payments = (existingDb.debt_payments || []).filter(p => !p.id.startsWith('dp-'));
    existingDb.worker_daily_logs = (existingDb.worker_daily_logs || []).filter(l => !l.id.startsWith('wdl-'));
    existingDb.worker_daily_log_items = (existingDb.worker_daily_log_items || []).filter(i => !i.id.startsWith('wdli-'));
    existingDb.payroll_disbursements = (existingDb.payroll_disbursements || []).filter(p => !p.id.startsWith('pay-1'));
    existingDb.cash_expenses = (existingDb.cash_expenses || []).filter(e => !e.id.startsWith('exp-1'));
    localStorage.setItem('oliviana_db', JSON.stringify(existingDb));
  } else {
    localStorage.setItem('oliviana_db', JSON.stringify(INITIAL_DATA));
  }
  localStorage.setItem('oliviana_db_version', CURRENT_DB_VERSION);
}

const getDB = () => {
  const data = JSON.parse(localStorage.getItem('oliviana_db')) || INITIAL_DATA;
  if (!data.users || data.users.length === 0) data.users = INITIAL_DATA.users;
  if (!data.categories || data.categories.length === 0) data.categories = INITIAL_DATA.categories;
  if (!data.products || data.products.length === 0) data.products = INITIAL_DATA.products;
  if (!data.product_variants || data.product_variants.length === 0) data.product_variants = INITIAL_DATA.product_variants;
  if (!data.piece_rate_items || data.piece_rate_items.length === 0) data.piece_rate_items = INITIAL_DATA.piece_rate_items;
  if (!data.customers) data.customers = [];
  if (!data.sales) data.sales = [];
  if (!data.orders) data.orders = [];
  if (!data.sale_items) data.sale_items = [];
  if (!data.order_items) data.order_items = [];
  if (!data.debt_payments) data.debt_payments = [];
  if (!data.worker_daily_logs) data.worker_daily_logs = [];
  if (!data.worker_daily_log_items) data.worker_daily_log_items = [];
  if (!data.payroll_disbursements) data.payroll_disbursements = [];
  if (!data.cash_expenses) data.cash_expenses = [];
  return data;
};

const saveDB = (db) => {
  localStorage.setItem('oliviana_db', JSON.stringify(db));
};

export const db = {
  // Synchronize and seed Supabase on application load
  initSupabaseSync: async () => {
    if (!isSupabaseConfigured() || !supabase) return;
    try {
      console.log('🔄 Initializing Supabase cloud database sync...');

      // 1. Upload Master Data jika tabel products di Supabase masih kosong
      const { data: existingProducts, error: checkErr } = await supabase.from('products').select('id').limit(1);
      
      if (!checkErr && (!existingProducts || existingProducts.length === 0)) {
        console.log('🌱 Supabase database is empty. Uploading users, categories, products, variants...');
        
        if (INITIAL_DATA.users?.length) {
          await supabase.from('users').upsert(INITIAL_DATA.users);
        }
        if (INITIAL_DATA.categories?.length) {
          await supabase.from('categories').upsert(INITIAL_DATA.categories);
        }
        if (INITIAL_DATA.products?.length) {
          await supabase.from('products').upsert(INITIAL_DATA.products);
        }

        const variants = INITIAL_DATA.product_variants || [];
        for (let i = 0; i < variants.length; i += 50) {
          await supabase.from('product_variants').upsert(variants.slice(i, i + 50));
        }

        if (INITIAL_DATA.piece_rate_items?.length) {
          const pieceItems = INITIAL_DATA.piece_rate_items.map(p => ({
            id: p.id,
            name: p.item_name || p.name || 'Pekerjaan',
            rate_price: Number(p.rate_price || p.rate_per_unit || 0),
            category: p.category || 'Baju',
            notes: p.notes || ''
          }));
          await supabase.from('piece_rate_items').upsert(pieceItems);
        }
        console.log('✅ Initial master data uploaded to Supabase successfully!');
      }

      // 2. Fetch existing master data & sales/orders from Supabase to sync local cache
      const { data: remoteUsers } = await supabase.from('users').select('*');
      const { data: remoteCategories } = await supabase.from('categories').select('*');
      const { data: remoteProducts } = await supabase.from('products').select('*');
      const { data: remoteVariants } = await supabase.from('product_variants').select('*');
      const { data: remotePieceItems } = await supabase.from('piece_rate_items').select('*');
      const { data: remoteOrders } = await supabase.from('orders').select('*');
      const { data: remoteOrderItems } = await supabase.from('order_items').select('*');
      const { data: remoteWorkerLogs } = await supabase.from('worker_daily_logs').select('*');
      const { data: remoteWorkerLogItems } = await supabase.from('worker_daily_log_items').select('*');
      const { data: remoteCustomers } = await supabase.from('customers').select('*');
      const { data: remoteDebtPayments } = await supabase.from('debt_payments').select('*');
      const { data: remoteStockMovements } = await supabase.from('stock_movements').select('*');

      const current = getDB();

      if (Array.isArray(remoteUsers) && remoteUsers.length > 0) {
        current.users = remoteUsers;
      }
      if (Array.isArray(remoteCategories) && remoteCategories.length > 0) {
        current.categories = remoteCategories;
      }
      if (Array.isArray(remoteProducts) && remoteProducts.length > 0) {
        current.products = remoteProducts;
      }
      if (Array.isArray(remotePieceItems) && remotePieceItems.length >= INITIAL_DATA.piece_rate_items.length && remotePieceItems.some(p => p.garment_type)) {
        current.piece_rate_items = remotePieceItems;
      } else {
        const pieceMap = new Map();
        INITIAL_DATA.piece_rate_items.forEach(p => pieceMap.set(p.id, p));
        if (Array.isArray(remotePieceItems)) {
          remotePieceItems.forEach(p => {
            const match = pieceMap.get(p.id);
            pieceMap.set(p.id, {
              ...p,
              item_name: p.item_name || p.name || match?.item_name || 'Pekerjaan',
              garment_type: p.garment_type || match?.garment_type || p.category || 'Seragam',
              product_id: p.product_id || match?.product_id || null
            });
          });
        }
        current.piece_rate_items = Array.from(pieceMap.values());
        for (let i = 0; i < current.piece_rate_items.length; i += 50) {
          const chunk = current.piece_rate_items.slice(i, i + 50).map(p => ({
            id: p.id,
            name: p.item_name || p.name || 'Pekerjaan',
            item_name: p.item_name || p.name || 'Pekerjaan',
            garment_type: p.garment_type || p.category || 'Seragam',
            product_id: p.product_id || null,
            rate_price: Number(p.rate_price || p.rate_per_unit || 0),
            category: p.garment_type || p.category || 'Seragam',
            notes: p.notes || ''
          }));
          await supabase.from('piece_rate_items').upsert(chunk);
        }
      }

      // Restore seluruh 428 varian master (stok 0) jika data di Supabase belum lengkap
      if (Array.isArray(remoteVariants) && remoteVariants.length >= INITIAL_DATA.product_variants.length) {
        current.product_variants = remoteVariants;
      } else {
        const variantMap = new Map();
        INITIAL_DATA.product_variants.forEach(v => variantMap.set(v.id, { ...v, stock_quantity: 0 }));
        if (Array.isArray(remoteVariants)) {
          remoteVariants.forEach(v => variantMap.set(v.id, v));
        }
        current.product_variants = Array.from(variantMap.values());
        for (let i = 0; i < current.product_variants.length; i += 50) {
          await supabase.from('product_variants').upsert(current.product_variants.slice(i, i + 50));
        }
      }

      if (Array.isArray(remoteOrders)) {
        current.orders = remoteOrders;
        current.sales = remoteOrders.map(o => ({
          ...o,
          invoice_number: o.order_number || o.invoice_number || o.id,
          total_amount: Number(o.total_amount || 0),
          paid_amount: Number(o.paid_amount !== undefined ? o.paid_amount : (o.total_amount || 0))
        }));
      }

      if (Array.isArray(remoteOrderItems)) {
        current.order_items = remoteOrderItems;
        current.sale_items = remoteOrderItems.map(i => ({
          ...i,
          sale_id: i.order_id || i.sale_id,
          price_per_unit: i.unit_price || i.price_per_unit
        }));
      }

      if (Array.isArray(remoteWorkerLogs)) {
        current.worker_daily_logs = remoteWorkerLogs.map(l => ({
          ...l,
          total_daily_amount: Number(l.total_daily_amount || l.total_amount || 0),
          status: l.status || 'PENDING'
        }));
      }

      if (Array.isArray(remoteWorkerLogItems)) {
        current.worker_daily_log_items = remoteWorkerLogItems;
      }

      if (Array.isArray(remoteCustomers)) {
        current.customers = remoteCustomers;
      }

      if (Array.isArray(remoteDebtPayments)) {
        current.debt_payments = remoteDebtPayments;
      }

      if (Array.isArray(remoteStockMovements)) {
        current.stock_movements = remoteStockMovements;
      }
      saveDB(current);
    } catch (err) {
      console.error('❌ Supabase Init/Sync Failed:', err);
    }
  },

  // Real-time Supabase Subscription Listener for multi-device instant sync (HP <-> Laptop)
  subscribeSupabaseRealtime: (onUpdateCallback) => {
    if (!isSupabaseConfigured() || !supabase) return null;
    try {
      console.log('📡 Subscribing to Supabase Real-Time database changes...');
      const channel = supabase
        .channel('pos-realtime-channel')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public' },
          (payload) => {
            console.log('⚡ Real-Time DB Event from Supabase:', payload.table, payload.eventType);
            db.initSupabaseSync().then(() => {
              if (onUpdateCallback) onUpdateCallback(payload);
            });
          }
        )
        .subscribe();
      return channel;
    } catch (err) {
      console.error('❌ Failed to subscribe to Supabase Real-time:', err);
      return null;
    }
  },

  // Manual Force Sync All Data to Supabase Cloud Database
  forceSyncAllToSupabase: async () => {
    const status = getSupabaseConfigStatus();
    if (!isSupabaseConfigured() || !supabase) {
      const details = [];
      if (!status.hasUrl) details.push('VITE_SUPABASE_URL tidak terdeteksi');
      if (!status.hasKey) details.push('VITE_SUPABASE_ANON_KEY tidak terdeteksi');
      if (status.hasUrl && !status.isValidUrl) details.push('Format VITE_SUPABASE_URL tidak valid (harus diawali https://)');

      return {
        success: false,
        message: `⚠️ Supabase belum aktif! (${details.join(', ')}). Pastikan nama variabel diawali VITE_ di Settings Vercel & jalankan 'Redeploy'.`
      };
    }

    try {
      console.log('🚀 Synchronizing all data to Supabase cloud...');
      const current = getDB();
      const syncErrors = [];

      // 1. Users
      if (current.users?.length) {
        const { error } = await supabase.from('users').upsert(current.users);
        if (error) {
          console.error('Error syncing users:', error.message || error);
          syncErrors.push(`users (${error.message})`);
        }
      }

      // 2. Categories
      if (current.categories?.length) {
        const { error } = await supabase.from('categories').upsert(current.categories);
        if (error) {
          console.error('Error syncing categories:', error.message || error);
          syncErrors.push(`categories (${error.message})`);
        }
      }

      // 3. Products
      if (current.products?.length) {
        const { error } = await supabase.from('products').upsert(current.products);
        if (error) {
          console.error('Error syncing products:', error.message || error);
          syncErrors.push(`products (${error.message})`);
        }
      }

      // 4. Product Variants (chunks of 50)
      const variants = current.product_variants || [];
      for (let i = 0; i < variants.length; i += 50) {
        const chunk = variants.slice(i, i + 50).map(v => ({
          id: v.id,
          product_id: v.product_id,
          sku: v.sku || `SKU-${v.id}`,
          size: v.size || '',
          color: v.color || '',
          selling_price: Number(v.selling_price || 0),
          stock_quantity: Number(v.stock_quantity || 0),
          created_at: v.created_at || new Date().toISOString()
        }));
        const { error } = await supabase.from('product_variants').upsert(chunk);
        if (error) {
          console.error('Error syncing variants:', error.message || error);
          syncErrors.push(`product_variants (${error.message})`);
        }
      }

      // 5. Piece Rate Items
      if (current.piece_rate_items?.length) {
        const pieceItems = current.piece_rate_items.map(p => ({
          id: p.id,
          name: p.item_name || p.name || 'Pekerjaan',
          item_name: p.item_name || p.name || 'Pekerjaan',
          garment_type: p.garment_type || p.category || 'Seragam',
          product_id: p.product_id || null,
          rate_price: Number(p.rate_price || p.rate_per_unit || 0),
          category: p.garment_type || p.category || 'Seragam',
          notes: p.notes || ''
        }));
        const { error } = await supabase.from('piece_rate_items').upsert(pieceItems);
        if (error) {
          console.error('Error syncing piece items:', error.message || error);
          const fallbackPiece = pieceItems.map(({ garment_type, product_id, item_name, ...rest }) => rest);
          const { error: err2 } = await supabase.from('piece_rate_items').upsert(fallbackPiece);
          if (err2) syncErrors.push(`piece_rate_items (${err2.message})`);
        }
      }

      // 6. Orders
      const sales = current.sales || current.orders || [];
      if (sales.length) {
        const mappedOrders = sales.map(s => ({
          id: s.id,
          order_number: s.order_number || s.invoice_number || s.id,
          cashier_id: s.cashier_id || null,
          customer_id: s.customer_id || null,
          customer_name: s.customer_name || 'Pelanggan Umum',
          customer_phone: s.customer_phone || '',
          total_amount: Number(s.total_amount || 0),
          paid_amount: Number(s.paid_amount || 0),
          change_amount: Number(s.change_amount || 0),
          payment_method: s.payment_method || 'CASH',
          payment_status: s.payment_status || 'PAID',
          notes: s.notes || '',
          created_at: s.created_at || new Date().toISOString()
        }));
        const { error } = await supabase.from('orders').upsert(mappedOrders);
        if (error) {
          console.error('Error syncing orders:', error.message || error);
          // Fallback retry if customer_id/paid_amount columns don't exist yet on remote table
          const fallbackOrders = mappedOrders.map(({ customer_id, paid_amount, change_amount, ...rest }) => rest);
          const { error: err2 } = await supabase.from('orders').upsert(fallbackOrders);
          if (err2) syncErrors.push(`orders (${err2.message})`);
        }
      }

      // 7. Order Items
      const saleItems = current.sale_items || current.order_items || [];
      if (saleItems.length) {
        const mappedOrderItems = saleItems.map(i => ({
          id: i.id,
          order_id: i.order_id || i.sale_id,
          variant_id: i.variant_id,
          product_name: i.product_name || 'Produk',
          variant_detail: i.variant_detail || '',
          unit_price: Number(i.unit_price || i.price_per_unit || 0),
          quantity: Number(i.quantity || 1),
          subtotal: Number(i.subtotal || 0)
        }));
        const { error } = await supabase.from('order_items').upsert(mappedOrderItems);
        if (error) {
          console.error('Error syncing order items:', error.message || error);
          syncErrors.push(`order_items (${error.message})`);
        }
      }

      // 8. Customers
      if (current.customers?.length) {
        const mappedCustomers = current.customers.map(c => ({
          id: c.id,
          name: c.name || 'Pelanggan',
          phone_number: c.phone_number || c.phone || '',
          type: c.type || 'UMUM',
          total_debt: Number(c.total_debt || c.totalDebt || 0),
          created_at: c.created_at || new Date().toISOString()
        }));
        const { error } = await supabase.from('customers').upsert(mappedCustomers);
        if (error) {
          console.error('Error syncing customers:', error.message || error);
          syncErrors.push(`customers (${error.message})`);
        }
      }

      // 9. Debt Payments
      if (current.debt_payments?.length) {
        const mappedDebtPayments = current.debt_payments.map(dp => ({
          id: dp.id,
          customer_id: dp.customer_id || dp.customerId,
          amount: Number(dp.amount || 0),
          payment_method: dp.payment_method || dp.paymentMethod || 'CASH',
          cashier_id: dp.cashier_id || dp.cashierId || null,
          created_at: dp.created_at || new Date().toISOString()
        }));
        const { error } = await supabase.from('debt_payments').upsert(mappedDebtPayments);
        if (error) {
          console.error('Error syncing debt_payments:', error.message || error);
          syncErrors.push(`debt_payments (${error.message})`);
        }
      }

      // 10. Stock Movements
      if (current.stock_movements?.length) {
        const { error } = await supabase.from('stock_movements').upsert(current.stock_movements);
        if (error) {
          console.error('Error syncing stock_movements:', error.message || error);
          syncErrors.push(`stock_movements (${error.message})`);
        }
      }

      if (syncErrors.length > 0) {
        console.warn('⚠️ Some tables failed sync:', syncErrors);
        return {
          success: false,
          message: `Sebagian tabel gagal disinkronkan ke Supabase: ${syncErrors.join(', ')}. Pastikan skrip SQL terbaru sudah di-run di Supabase SQL Editor.`
        };
      }

      console.log('✅ Force sync to Supabase finished!');
      return { success: true, message: 'Berhasil menyinkronkan seluruh data ke Supabase Cloud!' };
    } catch (err) {
      console.error('❌ Force sync failed:', err);
      return { success: false, message: `Gagal sync: ${err.message}` };
    }
  },

  get: (table) => {
    return getDB()[table] || [];
  },

  find: (table, predicate) => {
    return getDB()[table]?.find(predicate);
  },

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
    syncSupabaseUpsert(table, newItem);
    return newItem;
  },

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
    syncSupabaseUpsert(table, current[table][idx]);
    return current[table][idx];
  },

  delete: (table, id) => {
    const current = getDB();
    if (!current[table]) return false;

    const filtered = current[table].filter(x => x.id !== id);
    current[table] = filtered;
    saveDB(current);
    syncSupabaseDelete(table, id);
    return true;
  },

  reset: () => {
    saveDB(INITIAL_DATA);
    localStorage.setItem('oliviana_db_version', CURRENT_DB_VERSION);
    if (isSupabaseConfigured()) {
      db.initSupabaseSync();
    }
    return INITIAL_DATA;
  },

  login: (usernameOrEmail, password, role) => {
    const users = db.get('users') || [];
    const input = (usernameOrEmail || '').toLowerCase().trim();
    const passInput = (password || '').trim();

    if (!input || !passInput) return null;

    const matched = users.find(u => {
      const uEmail = (u.email || '').toLowerCase().trim();
      const uName = (u.username || u.name || '').toLowerCase().trim();
      const matchIdentity = (uEmail === input || uName === input);
      const matchPass = (u.password ? u.password === passInput : passInput === '123456');
      return matchIdentity && matchPass;
    });

    if (matched && matched.role === role) return matched;
    return null;
  },

  changePassword: (userId, oldPassword, newPassword) => {
    const users = db.get('users') || [];
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) return { success: false, message: 'User tidak ditemukan' };

    const user = users[idx];
    const currentPass = user.password || '123456';
    if (oldPassword !== currentPass) {
      return { success: false, message: 'Kata sandi lama tidak cocok' };
    }

    return db.update('users', userId, { password: newPassword });
  },

  createSale: (saleData, items, userId) => {
    const current = getDB();
    const invoiceNumber = `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(Date.now()).slice(-4)}`;
    const saleId = `s-${Date.now()}`;

    const newSale = {
      id: saleId,
      invoice_number: invoiceNumber,
      order_number: invoiceNumber,
      cashier_id: userId,
      customer_id: saleData.customer_id || null,
      customer_name: saleData.customer_name || 'Pelanggan Umum',
      customer_phone: saleData.customer_phone || '',
      total_amount: Number(saleData.total_amount),
      payment_method: saleData.payment_method || 'CASH',
      payment_status: saleData.payment_status || 'PAID',
      paid_amount: Number(saleData.paid_amount || 0),
      change_amount: Number(saleData.change_amount || 0),
      notes: saleData.notes || '',
      work_order_number: saleData.work_order_number || null,
      created_at: new Date().toISOString()
    };

    const formattedItems = items.map((item, idx) => {
      const newItem = {
        id: `si-${Date.now()}-${idx}`,
        sale_id: saleId,
        order_id: saleId,
        variant_id: item.variant_id,
        product_name: item.product_name || item.name || 'Produk',
        variant_detail: `${item.size || ''} ${item.color || ''}`.trim(),
        unit_price: Number(item.price_per_unit || item.unit_price || 0),
        price_per_unit: Number(item.price_per_unit || item.unit_price || 0),
        quantity: Number(item.quantity),
        subtotal: Number(item.quantity) * Number(item.price_per_unit || item.unit_price || 0)
      };

      current.sale_items.push(newItem);

      const variantIdx = current.product_variants.findIndex(v => v.id === item.variant_id);
      if (variantIdx !== -1) {
        current.product_variants[variantIdx].stock_quantity = Number(current.product_variants[variantIdx].stock_quantity) - Number(item.quantity);
        syncSupabaseUpsert('product_variants', current.product_variants[variantIdx]);
      }

      const movement = {
        id: `m-${Date.now()}-${idx}`,
        variant_id: item.variant_id,
        type: 'SALE',
        quantity: -Number(item.quantity),
        notes: `Penjualan ${invoiceNumber}`,
        created_by: userId,
        created_at: new Date().toISOString()
      };
      current.stock_movements.push(movement);
      syncSupabaseUpsert('stock_movements', movement);

      return newItem;
    });

    if (newSale.customer_id) {
      const customerIdx = current.customers.findIndex(c => c.id === newSale.customer_id);
      if (customerIdx !== -1) {
        let addedDebt = 0;
        if (newSale.payment_method === 'DEBT') {
          addedDebt = newSale.total_amount - newSale.paid_amount;
        }
        current.customers[customerIdx].total_debt = Number(current.customers[customerIdx].total_debt) + Number(addedDebt);
        syncSupabaseUpsert('customers', current.customers[customerIdx]);
      }
    }

    current.sales.push(newSale);
    if (!current.orders) current.orders = [];
    current.orders.push(newSale);
    if (!current.order_items) current.order_items = [];
    current.order_items.push(...formattedItems);

    saveDB(current);
    syncSupabaseUpsert('orders', newSale);
    formattedItems.forEach(it => syncSupabaseUpsert('order_items', it));
    return newSale;
  },

  addStockFromFactory: (variantId, quantity, notes = '', userId = null) => {
    const current = getDB();
    if (!current.product_variants) current.product_variants = [];
    if (!current.stock_movements) current.stock_movements = [];

    const variantIdx = current.product_variants.findIndex(v => v.id === variantId);
    if (variantIdx === -1) return null;

    const qtyNum = Number(quantity) || 0;
    const newStock = Number(current.product_variants[variantIdx].stock_quantity || 0) + qtyNum;

    current.product_variants[variantIdx] = {
      ...current.product_variants[variantIdx],
      stock_quantity: newStock
    };

    const newMovement = {
      id: `m-${Date.now()}`,
      variant_id: variantId,
      type: 'INBOUND',
      quantity: qtyNum,
      notes: notes || 'Pasokan Pabrik (Restock)',
      created_by: userId,
      created_at: new Date().toISOString()
    };

    current.stock_movements.push(newMovement);

    saveDB(current);
    syncSupabaseUpsert('product_variants', current.product_variants[variantIdx]);
    syncSupabaseUpsert('stock_movements', newMovement);

    return current.product_variants[variantIdx];
  },

  addDebtPayment: (customerId, amount, paymentMethod = 'CASH', cashierId = null) => {
    const current = getDB();
    if (!current.customers) current.customers = [];
    if (!current.debt_payments) current.debt_payments = [];

    const custIdx = current.customers.findIndex(c => c.id === customerId);
    if (custIdx === -1) return { success: false, message: 'Pelanggan tidak ditemukan.' };

    const amtNum = Number(amount) || 0;
    const currentDebt = Number(current.customers[custIdx].total_debt || 0);
    const newDebt = Math.max(0, currentDebt - amtNum);

    current.customers[custIdx] = {
      ...current.customers[custIdx],
      total_debt: newDebt
    };

    const newPayment = {
      id: `dp-${Date.now()}`,
      customer_id: customerId,
      amount: amtNum,
      payment_method: paymentMethod,
      cashier_id: cashierId,
      created_at: new Date().toISOString()
    };

    current.debt_payments.push(newPayment);

    saveDB(current);
    syncSupabaseUpsert('customers', current.customers[custIdx]);
    syncSupabaseUpsert('debt_payments', newPayment);

    return {
      success: true,
      customer: current.customers[custIdx],
      payment: newPayment
    };
  },

  getPieceRateItems: () => {
    const current = getDB();
    const pieceItems = current.piece_rate_items || [];
    const products = current.products || [];

    return pieceItems.map(p => {
      const prod = products.find(prd => prd.id === p.product_id);
      const garmentType = p.garment_type || (prod ? prod.name : (p.category || 'Seragam'));
      return {
        ...p,
        item_name: p.item_name || p.name || 'Pekerjaan',
        rate_price: Number(p.rate_price || p.rate_per_unit || 0),
        product_name: garmentType,
        garment_type: garmentType
      };
    });
  },

  updatePieceRateItem: (id, updates) => {
    const current = getDB();
    if (!current.piece_rate_items) return null;
    const idx = current.piece_rate_items.findIndex(p => p.id === id);
    if (idx === -1) return null;
    current.piece_rate_items[idx] = {
      ...current.piece_rate_items[idx],
      ...updates,
      rate_price: updates.rate_price !== undefined ? Number(updates.rate_price) : current.piece_rate_items[idx].rate_price
    };
    saveDB(current);
    syncSupabaseUpsert('piece_rate_items', current.piece_rate_items[idx]);
    return current.piece_rate_items[idx];
  },

  deletePieceRateItem: (id) => {
    const current = getDB();
    if (!current.piece_rate_items) return false;
    current.piece_rate_items = current.piece_rate_items.filter(p => p.id !== id);
    saveDB(current);
    syncSupabaseDelete('piece_rate_items', id);
    return true;
  },

  addWorkerDailyLog: (workerId, logDate, items) => {
    const current = getDB();
    if (!current.worker_daily_logs) current.worker_daily_logs = [];
    if (!current.worker_daily_log_items) current.worker_daily_log_items = [];

    let totalDailyAmount = 0;
    const logId = `wdl-${Date.now()}`;

    const formattedItems = items.map((it, idx) => {
      const subtotal = Number(it.quantity) * Number(it.rate_per_unit);
      totalDailyAmount += subtotal;
      return {
        id: `wdli-${Date.now()}-${idx}`,
        daily_log_id: logId,
        piece_rate_item_id: it.piece_rate_item_id,
        quantity: Number(it.quantity),
        rate_per_unit: Number(it.rate_per_unit),
        subtotal
      };
    });

    const newLogHeader = {
      id: logId,
      worker_id: workerId,
      log_date: logDate || new Date().toISOString().slice(0, 10),
      total_daily_amount: totalDailyAmount,
      status: 'PENDING',
      created_at: new Date().toISOString()
    };

    current.worker_daily_logs.push(newLogHeader);
    current.worker_daily_log_items.push(...formattedItems);
    saveDB(current);

    syncSupabaseUpsert('worker_daily_logs', {
      ...newLogHeader,
      total_amount: totalDailyAmount
    });
    formattedItems.forEach(it => syncSupabaseUpsert('worker_daily_log_items', it));

    return { ...newLogHeader, items: formattedItems };
  },

  getWorkerDailyLogs: (workerId = null, monthYear = null) => {
    const current = getDB();
    const logs = current.worker_daily_logs || [];
    const items = current.worker_daily_log_items || [];
    const pieceItems = current.piece_rate_items || [];
    const products = current.products || [];
    const users = current.users || [];

    let filteredLogs = [...logs];
    if (workerId) {
      filteredLogs = filteredLogs.filter(l => l.worker_id === workerId);
    }
    if (monthYear) {
      filteredLogs = filteredLogs.filter(l => l.log_date.startsWith(monthYear));
    }

    filteredLogs.sort((a, b) => new Date(b.log_date) - new Date(a.log_date));

    return filteredLogs.map(log => {
      const worker = users.find(u => u.id === log.worker_id);
      const logDetails = items.filter(it => it.daily_log_id === log.id).map(it => {
        const pieceRate = pieceItems.find(pr => pr.id === it.piece_rate_item_id);
        const prod = pieceRate ? products.find(p => p.id === pieceRate.product_id) : null;
        return {
          ...it,
          item_name: pieceRate ? pieceRate.item_name : 'Item Borongan',
          product_name: prod ? prod.name : 'Seragam'
        };
      });

      return {
        ...log,
        worker_name: worker ? worker.name : 'Worker',
        items: logDetails
      };
    });
  },

  approveAndDisbursePayroll: (workerId, monthYear, approvedBy) => {
    const current = getDB();
    if (!current.payroll_disbursements) current.payroll_disbursements = [];
    if (!current.cash_expenses) current.cash_expenses = [];

    const workerLogs = (current.worker_daily_logs || []).filter(
      l => l.worker_id === workerId && l.log_date.startsWith(monthYear) && l.status !== 'PAID'
    );

    if (workerLogs.length === 0) {
      return { success: false, message: 'Tidak ada log harian pending untuk di-approve pada bulan ini.' };
    }

    const totalAmount = workerLogs.reduce((sum, l) => sum + Number(l.total_daily_amount || l.total_amount || 0), 0);

    current.worker_daily_logs.forEach(l => {
      if (l.worker_id === workerId && l.log_date.startsWith(monthYear) && l.status !== 'PAID') {
        l.status = 'PAID';
      }
    });

    const payrollId = `pay-${Date.now()}`;
    const payrollNumber = `PAY-${monthYear.replace('-', '')}-${String(Date.now()).slice(-3)}`;

    const newDisbursement = {
      id: payrollId,
      payroll_number: payrollNumber,
      worker_id: workerId,
      month_year: monthYear,
      total_amount: totalAmount,
      approved_by: approvedBy,
      paid_at: new Date().toISOString()
    };

    const worker = (current.users || []).find(u => u.id === workerId);
    const workerName = worker ? worker.name : 'Worker';

    const newExpense = {
      id: `exp-${Date.now()}`,
      expense_category: 'PAYROLL',
      amount: totalAmount,
      description: `Pencairan Gaji Borongan ${monthYear} - ${workerName}`,
      reference_id: payrollId,
      created_by: approvedBy,
      created_at: new Date().toISOString()
    };

    current.payroll_disbursements.push(newDisbursement);
    current.cash_expenses.push(newExpense);

    saveDB(current);

    workerLogs.forEach(l => {
      syncSupabaseUpsert('worker_daily_logs', {
        ...l,
        status: 'PAID'
      });
    });
    syncSupabaseUpsert('payroll_disbursements', {
      id: payrollId,
      worker_id: workerId,
      month_year: monthYear,
      total_earnings: totalAmount,
      approved_by: approvedBy,
      paid_at: newDisbursement.paid_at
    });
    syncSupabaseUpsert('cash_expenses', {
      id: newExpense.id,
      category: 'PAYROLL',
      amount: totalAmount,
      description: newExpense.description,
      reference_id: payrollId,
      created_by: approvedBy,
      created_at: newExpense.created_at
    });

    return { success: true, disbursement: newDisbursement, expense: newExpense };
  },

  getPayrollDisbursements: (monthYear = null) => {
    const current = getDB();
    const disbursements = current.payroll_disbursements || [];
    const users = current.users || [];

    let filtered = [...disbursements];
    if (monthYear) {
      filtered = filtered.filter(d => d.month_year === monthYear);
    }

    filtered.sort((a, b) => new Date(b.paid_at) - new Date(a.paid_at));

    return filtered.map(d => {
      const worker = users.find(u => u.id === d.worker_id);
      const approver = users.find(u => u.id === d.approved_by);
      return {
        ...d,
        worker_name: worker ? worker.name : 'Worker',
        approver_name: approver ? approver.name : 'Owner'
      };
    });
  },

  getCashExpenses: () => {
    const current = getDB();
    return (current.cash_expenses || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
};
