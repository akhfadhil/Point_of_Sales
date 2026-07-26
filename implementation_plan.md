# Implementation Plan: Point of Sale (POS) & Integrated Inventory System

## 1. Project Overview
Aplikasi POS (Point of Sale), Manajemen Stok, dan Pembukuan Keuangan untuk toko baju/seragam "Oliviana" yang terintegrasi dengan penerimaan barang dari pabrik konveksi mandiri.

### Store Profile & Receipt Identity:
- **Nama Toko**: Oliviana
- **Alamat**: Jl. Semeru No. 81, Sukodono, Lumajang
- **Catatan Struk (Footer)**: "Terima kasih telah berbelanja di Oliviana. Barang yang sudah dibeli tidak dapat ditukar/dikembalikan."

### Key Goals:
1. **Multi-Role Access**: Pemisahan hak akses antara Kasir dan Owner.
2. **Flexible Product & Variant Model**: Mendukung produk baju dengan variasi ukuran (No. 2-27, S-XXL) dan warna.
3. **Auto-Generated SKU & Smart Search**: SKU dibuat otomatis di sistem (misal: `HEM-PD-PRAMUKA-M`), kasir mencari produk via pengetikan nama/ukuran tanpa scan barcode.
4. **Penerimaan Stok Pabrik**: Fitur manual "Terima Barang dari Pabrik" tanpa alur surat jalan yang rumit.
5. **Point of Sale (Kasir)**: Transaksi cepat dengan pembayaran Tunai, QRIS, Transfer, dan Kasbon/Utang (Pencatatan simpel: Nama, No. HP, Sisa Utang).
6. **Multi-Format Receipt & Printing**: Support Struk Thermal (58mm/80mm), Invoice A4, Kirim Struk via WhatsApp, dan Download PDF.
7. **Real-time Stock & Balance Updates**: Stok otomatis berkurang saat terjual/bertambah saat restock, saldo kas ter-update otomatis.

---

## 2. User Roles & Security Guidelines

### 1. Owner (Akses Penuh)
- Buka dashboard keuangan, laporan laba/rugi, dan total saldo.
- Tambah/edit/hapus data produk, ukuran, warna, harga beli (modal), dan harga jual.
- Input penerimaan barang dari pabrik.
- Mengelola data utang/kasbon pelanggan dan riwayat cicilan.
- Membuat dan mengelola akun Kasir.

### 2. Kasir (Akses Terbatas)
- Akses halaman POS / Kasir untuk pencatatan transaksi.
- Akses halaman Cek Stok (hanya membaca jumlah stok, tidak bisa lihat harga modal).
- Cetak struk (Thermal/A4) dan kirim nota via WhatsApp / PDF.
- Input pembayaran tunai, QRIS, transfer, atau pencatatan kasbon pelanggan.
- *Dilarang*: Mengedit harga produk, menghapus riwayat transaksi, atau melihat total keuntungan toko.

---

## 3. Database Schema (PostgreSQL / Supabase)

```sql
-- 1. Roles & Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(20) CHECK (role IN ('OWNER', 'CASHIER')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Categories (Atasan, Bawahan, Aksesoris, dll)
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL
);

-- 3. Master Products (Parent)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(id),
    name VARCHAR(150) NOT NULL, -- e.g., "HEM PD PRAMUKA", "ROK WIRU"
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Product Variants (Auto SKU/Size/Color specific)
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE NOT NULL, -- Auto-generated: e.g., "HEM-PD-PRAMUKA-M"
    size VARCHAR(20) NOT NULL, -- e.g., "2", "3", "S", "M", "L", "XL"
    color VARCHAR(50) DEFAULT 'Standard',
    cost_price DECIMAL(12,2) DEFAULT 0, -- Harga Modal Pabrik
    selling_price DECIMAL(12,2) NOT NULL, -- Harga Jual Toko
    stock_quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Stock Movements (Inbound from Factory / Adjustments)
CREATE TABLE stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id UUID REFERENCES product_variants(id),
    type VARCHAR(20) CHECK (type IN ('FACTORY_IN', 'SALE', 'ADJUSTMENT', 'RETURN')),
    quantity INT NOT NULL,
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 6. Customers (For Simple Debt Tracking)
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    total_debt DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 7. Sales Transactions (Header)
CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    cashier_id UUID REFERENCES users(id),
    customer_id UUID REFERENCES customers(id) NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    payment_method VARCHAR(20) CHECK (payment_method IN ('CASH', 'QRIS', 'TRANSFER', 'DEBT')),
    payment_status VARCHAR(20) CHECK (payment_status IN ('PAID', 'UNPAID', 'PARTIAL')),
    paid_amount DECIMAL(12,2) DEFAULT 0,
    change_amount DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 8. Sale Items (Detail)
CREATE TABLE sale_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id),
    quantity INT NOT NULL,
    price_per_unit DECIMAL(12,2) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL
);

-- 9. Debt Payments (Riwayat Pembayaran Cicilan Utang)
CREATE TABLE debt_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    amount_paid DECIMAL(12,2) NOT NULL,
    payment_method VARCHAR(20) CHECK (payment_method IN ('CASH', 'QRIS', 'TRANSFER')),
    cashier_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);