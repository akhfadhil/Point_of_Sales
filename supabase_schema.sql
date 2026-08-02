-- ===================================================
-- SUPABASE SQL SCHEMA UNTUK POINT OF SALES
-- Jalankan Script ini di SQL Editor Dashboard Supabase
-- ===================================================

-- 1. TABEL USERS (Karyawan & Staff)
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    username TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    role TEXT NOT NULL CHECK (role IN ('OWNER', 'CASHIER', 'WORKER')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration/patch jika tabel users sudah dibuat sebelumnya:
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password TEXT;

-- 2. TABEL KATEGORI PRODUK
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL PRODUK
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    category_id TEXT,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL VARIAN PRODUK (SKU, Ukuran, Warna, Harga, Stok)
CREATE TABLE IF NOT EXISTS public.product_variants (
    id TEXT PRIMARY KEY,
    product_id TEXT,
    sku TEXT,
    size TEXT,
    color TEXT,
    selling_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    stock_quantity INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABEL TRANSAKSI / ORDERS (Penjualan Kasir)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    cashier_id TEXT,
    customer_id TEXT,
    customer_name TEXT,
    customer_phone TEXT,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    paid_amount NUMERIC(12, 2) DEFAULT 0,
    change_amount NUMERIC(12, 2) DEFAULT 0,
    payment_method TEXT DEFAULT 'CASH',
    payment_status TEXT DEFAULT 'PAID',
    notes TEXT,
    work_order_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS paid_amount NUMERIC(12, 2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS change_amount NUMERIC(12, 2) DEFAULT 0;

-- 6. TABEL ITEM ORDERS
CREATE TABLE IF NOT EXISTS public.order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT,
    variant_id TEXT,
    product_name TEXT NOT NULL,
    variant_detail TEXT,
    unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    quantity INT NOT NULL DEFAULT 1,
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0
);

-- 7. TABEL SURAT PERINTAH KERJA (WORK ORDERS)
CREATE TABLE IF NOT EXISTS public.work_orders (
    id TEXT PRIMARY KEY,
    work_order_number TEXT UNIQUE NOT NULL,
    order_id TEXT,
    worker_id TEXT,
    status TEXT DEFAULT 'PENDING',
    total_target_qty INT DEFAULT 0,
    total_completed_qty INT DEFAULT 0,
    deadline TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABEL ITEM SURAT PERINTAH KERJA
CREATE TABLE IF NOT EXISTS public.work_order_items (
    id TEXT PRIMARY KEY,
    work_order_id TEXT,
    variant_id TEXT,
    target_qty INT DEFAULT 0,
    completed_qty INT DEFAULT 0
);

-- 9. TABEL TARIF BORONGAN (PIECE RATE)
CREATE TABLE IF NOT EXISTS public.piece_rate_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    item_name TEXT,
    garment_type TEXT,
    product_id TEXT,
    rate_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    category TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.piece_rate_items ADD COLUMN IF NOT EXISTS garment_type TEXT;
ALTER TABLE public.piece_rate_items ADD COLUMN IF NOT EXISTS product_id TEXT;
ALTER TABLE public.piece_rate_items ADD COLUMN IF NOT EXISTS item_name TEXT;

-- 10. TABEL LAPORAN HARIAN PEKERJA
CREATE TABLE IF NOT EXISTS public.worker_daily_logs (
    id TEXT PRIMARY KEY,
    worker_id TEXT,
    log_date DATE NOT NULL,
    total_amount NUMERIC(12, 2) DEFAULT 0,
    total_daily_amount NUMERIC(12, 2) DEFAULT 0,
    status TEXT DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.worker_daily_logs ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PENDING';
ALTER TABLE public.worker_daily_logs ADD COLUMN IF NOT EXISTS total_daily_amount NUMERIC(12, 2) DEFAULT 0;

CREATE TABLE IF NOT EXISTS public.worker_daily_log_items (
    id TEXT PRIMARY KEY,
    daily_log_id TEXT,
    piece_rate_item_id TEXT,
    quantity INT DEFAULT 0,
    rate_per_unit NUMERIC(12, 2) DEFAULT 0,
    subtotal NUMERIC(12, 2) DEFAULT 0
);

-- 11. TABEL PENCAIRAN GAJI & PENGELUARAN KAS
CREATE TABLE IF NOT EXISTS public.payroll_disbursements (
    id TEXT PRIMARY KEY,
    worker_id TEXT,
    month_year TEXT NOT NULL,
    total_earnings NUMERIC(12, 2) DEFAULT 0,
    paid_at TIMESTAMPTZ DEFAULT NOW(),
    approved_by TEXT,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS public.cash_expenses (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    amount NUMERIC(12, 2) DEFAULT 0,
    description TEXT,
    reference_id TEXT,
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. TABEL PERGERAKAN STOK
CREATE TABLE IF NOT EXISTS public.stock_movements (
    id TEXT PRIMARY KEY,
    variant_id TEXT,
    type TEXT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    notes TEXT,
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. TABEL PELANGGAN & UTANG KASBON
CREATE TABLE IF NOT EXISTS public.customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone_number TEXT,
    type TEXT DEFAULT 'UMUM',
    total_debt NUMERIC(12, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. TABEL PEMBAYARAN CICILAN KASBON
CREATE TABLE IF NOT EXISTS public.debt_payments (
    id TEXT PRIMARY KEY,
    customer_id TEXT,
    amount NUMERIC(12, 2) DEFAULT 0,
    payment_method TEXT DEFAULT 'CASH',
    cashier_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DROP STRICT FOREIGN KEY CONSTRAINTS IF THEY ALREADY EXIST
ALTER TABLE IF EXISTS public.orders DROP CONSTRAINT IF EXISTS orders_cashier_id_fkey;
ALTER TABLE IF EXISTS public.order_items DROP CONSTRAINT IF EXISTS order_items_order_id_fkey;
ALTER TABLE IF EXISTS public.order_items DROP CONSTRAINT IF EXISTS order_items_variant_id_fkey;
ALTER TABLE IF EXISTS public.products DROP CONSTRAINT IF EXISTS products_category_id_fkey;
ALTER TABLE IF EXISTS public.product_variants DROP CONSTRAINT IF EXISTS product_variants_product_id_fkey;
ALTER TABLE IF EXISTS public.work_orders DROP CONSTRAINT IF EXISTS work_orders_order_id_fkey;
ALTER TABLE IF EXISTS public.work_orders DROP CONSTRAINT IF EXISTS work_orders_worker_id_fkey;
ALTER TABLE IF EXISTS public.work_order_items DROP CONSTRAINT IF EXISTS work_order_items_work_order_id_fkey;
ALTER TABLE IF EXISTS public.work_order_items DROP CONSTRAINT IF EXISTS work_order_items_variant_id_fkey;
ALTER TABLE IF EXISTS public.worker_daily_logs DROP CONSTRAINT IF EXISTS worker_daily_logs_worker_id_fkey;
ALTER TABLE IF EXISTS public.worker_daily_log_items DROP CONSTRAINT IF EXISTS worker_daily_log_items_daily_log_id_fkey;
ALTER TABLE IF EXISTS public.worker_daily_log_items DROP CONSTRAINT IF EXISTS worker_daily_log_items_piece_rate_item_id_fkey;
ALTER TABLE IF EXISTS public.payroll_disbursements DROP CONSTRAINT IF EXISTS payroll_disbursements_worker_id_fkey;
ALTER TABLE IF EXISTS public.payroll_disbursements DROP CONSTRAINT IF EXISTS payroll_disbursements_approved_by_fkey;
ALTER TABLE IF EXISTS public.cash_expenses DROP CONSTRAINT IF EXISTS cash_expenses_created_by_fkey;
ALTER TABLE IF EXISTS public.debt_payments DROP CONSTRAINT IF EXISTS debt_payments_customer_id_fkey;

-- DISABLE ROW LEVEL SECURITY (RLS) FOR UNRESTRICTED POS API ACCESS
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.piece_rate_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_daily_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_daily_log_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_disbursements DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.debt_payments DISABLE ROW LEVEL SECURITY;

-- 15. AKTIFKAN REALTIME PUBLICATION UNTUK SINKRONISASI MULTI-DEVICE OTOMATIS
-- Jalankan perintah ini agar perubahan dari Device A langsung ter-broadcast ke Device B secara instan via WebSocket
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR ALL TABLES;
COMMIT;

