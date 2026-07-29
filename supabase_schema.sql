-- ===================================================
-- SUPABASE SQL SCHEMA UNTUK POINT OF SALES
-- Jalankan Script ini di SQL Editor Dashboard Supabase
-- ===================================================

-- 1. TABEL USERS (Karyawan & Staff)
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('OWNER', 'CASHIER', 'WORKER')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABEL KATEGORI PRODUK
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL PRODUK
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL VARIAN PRODUK (SKU, Ukuran, Warna, Harga, Stok)
CREATE TABLE IF NOT EXISTS public.product_variants (
    id TEXT PRIMARY KEY,
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
    sku TEXT UNIQUE NOT NULL,
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
    cashier_id TEXT REFERENCES public.users(id),
    customer_name TEXT,
    customer_phone TEXT,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    payment_method TEXT DEFAULT 'CASH',
    payment_status TEXT DEFAULT 'PAID',
    notes TEXT,
    work_order_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABEL ITEM ORDERS
CREATE TABLE IF NOT EXISTS public.order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    variant_id TEXT REFERENCES public.product_variants(id),
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
    order_id TEXT REFERENCES public.orders(id) ON DELETE SET NULL,
    worker_id TEXT REFERENCES public.users(id),
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
    work_order_id TEXT REFERENCES public.work_orders(id) ON DELETE CASCADE,
    variant_id TEXT REFERENCES public.product_variants(id),
    target_qty INT DEFAULT 0,
    completed_qty INT DEFAULT 0
);

-- 9. TABEL TARIF BORONGAN (PIECE RATE)
CREATE TABLE IF NOT EXISTS public.piece_rate_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    rate_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    category TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TABEL LAPORAN HARIAN PEKERJA
CREATE TABLE IF NOT EXISTS public.worker_daily_logs (
    id TEXT PRIMARY KEY,
    worker_id TEXT REFERENCES public.users(id),
    log_date DATE NOT NULL,
    total_amount NUMERIC(12, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.worker_daily_log_items (
    id TEXT PRIMARY KEY,
    daily_log_id TEXT REFERENCES public.worker_daily_logs(id) ON DELETE CASCADE,
    piece_rate_item_id TEXT REFERENCES public.piece_rate_items(id),
    quantity INT DEFAULT 0,
    rate_per_unit NUMERIC(12, 2) DEFAULT 0,
    subtotal NUMERIC(12, 2) DEFAULT 0
);

-- 11. TABEL PENCAIRAN GAJI & PENGELUARAN KAS
CREATE TABLE IF NOT EXISTS public.payroll_disbursements (
    id TEXT PRIMARY KEY,
    worker_id TEXT REFERENCES public.users(id),
    month_year TEXT NOT NULL,
    total_earnings NUMERIC(12, 2) DEFAULT 0,
    paid_at TIMESTAMPTZ DEFAULT NOW(),
    approved_by TEXT REFERENCES public.users(id),
    notes TEXT
);

CREATE TABLE IF NOT EXISTS public.cash_expenses (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    amount NUMERIC(12, 2) DEFAULT 0,
    description TEXT,
    reference_id TEXT,
    created_by TEXT REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY (RLS) & PUBLIC PERMISSIONS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.piece_rate_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_daily_log_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_disbursements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_expenses ENABLE ROW LEVEL SECURITY;

-- Kebijakan Akses Publik (Allow Read & Write)
CREATE POLICY "Allow public full access users" ON public.users FOR ALL USING (true);
CREATE POLICY "Allow public full access categories" ON public.categories FOR ALL USING (true);
CREATE POLICY "Allow public full access products" ON public.products FOR ALL USING (true);
CREATE POLICY "Allow public full access product_variants" ON public.product_variants FOR ALL USING (true);
CREATE POLICY "Allow public full access orders" ON public.orders FOR ALL USING (true);
CREATE POLICY "Allow public full access order_items" ON public.order_items FOR ALL USING (true);
CREATE POLICY "Allow public full access work_orders" ON public.work_orders FOR ALL USING (true);
CREATE POLICY "Allow public full access work_order_items" ON public.work_order_items FOR ALL USING (true);
CREATE POLICY "Allow public full access piece_rate_items" ON public.piece_rate_items FOR ALL USING (true);
CREATE POLICY "Allow public full access worker_daily_logs" ON public.worker_daily_logs FOR ALL USING (true);
CREATE POLICY "Allow public full access worker_daily_log_items" ON public.worker_daily_log_items FOR ALL USING (true);
CREATE POLICY "Allow public full access payroll_disbursements" ON public.payroll_disbursements FOR ALL USING (true);
CREATE POLICY "Allow public full access cash_expenses" ON public.cash_expenses FOR ALL USING (true);
