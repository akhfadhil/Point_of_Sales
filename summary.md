# 🛍️ Oliviana Point of Sales (POS) & Manajemen Stok & Penggajian Konveksi

Aplikasi **Point of Sales (POS), Sistem Manajemen Stok Seragam & Penggajian Borongan Penjahit** modern, cepat, dan *offline-ready* yang dirancang khusus untuk toko seragam sekolah dan konveksi (**Oliviana**). Aplikasi ini mengintegrasikan seluruh proses bisnis toko dari kasir penjualan harian, skema harga bertingkat, pencatatan utang pelanggan, pengelolaan ratusan varian seragam sekolah (Ukuran & Warna), hingga manajemen hasil kerja harian & pencairan gaji penjahit borongan.

---

## 🌟 Fitur Utama & Peningkatan Aplikasi (All Menus Complete)

### 1. 🛒 Kasir POS (Point of Sales) Real-Time & iPad Split-Screen
* **📱 HP & Mobile View:**
  * Toggle navigasi instan **`[ Katalog Produk ]` ↔️ `[ Keranjang ]`**.
  * Modal Pemilihan Varian mengadopsi **Dropdown Select (`<select>`)** khusus HP sehingga ringkas, rapi, dan tidak ada puluhan tombol bertumpuk.
* **📟 iPad & Tablet POS Register (Split-Screen 100% Full Width):**
  * Tampilan 2-Panel Profesional Berdampingan: **Katalog Produk (Kiri)** + **Keranjang Belanja Real-Time (Kanan)**.
  * 100% Menempel Penuh Layar iPad, Tanpa Area Kosong, dan **Nol Scroll Samping**.
* **Kartu Produk Uniform:** Teks daftar ukuran diringkas maksimal 4 ukuran + total sisa ukuran *(misal: 14 Ukuran (2, 3, 4, 5, +10 lainnya))*, membuat seluruh kartu produk di katalog tampil dengan tinggi yang seragam dan rapi.
* **Skema Harga Bertingkat Otomatis:**
  * 👤 **Umum:** Base Pricelist + Rp 15.000
  * 👨‍🏫 **Guru:** Base Pricelist + Rp 5.000
  * 🏢 **Grosir:** Base Pricelist (Rp 0)
* **Dukungan Metode Pembayaran:** TUNAI (Cash), QRIS, Transfer, dan UTANG / CICILAN.
* **Struk Belanja Thermal & WhatsApp:** Cetak struk belanja thermal/browser + simulasi pengiriman WhatsApp.

---

### 2. 🔍 Cek Stok Barang (Shared Stock Checker)
* **⚡ Multi-Filter Presisi (Persis Manajemen Stok):**
  * Filter serentak berdasarkan **Pilih Produk**, **Pilih Ukuran**, **Pilih Warna**, dan **Kata Kunci / SKU**.
  * Tombol **Reset Filter** 1-klik untuk mengembalikan kondisi filter ke awal.
* **📄 Pagination Varian Stok (10 Varian/Halaman):** Navigasi ringkas `‹ Sebelumnya` dan `Selanjutnya ›`.
* **📱 Layout Adaptif (Desktop vs Mobile):**
  * **Laptop / PC:** Tampilan tabel lebar lengkap dengan harga jual dan status stok (penghapusan harga modal pada cek stok publik).
  * **HP & Tablet:** Tampilan *Mobile Stock Cards Grid* yang ringkas tanpa scroll samping.

---

### 3. 📦 Manajemen Stok & Produk (Inventory Management)
* **Pemisahan Varian Terstruktur (Ukuran & Warna):** Setiap produk seragam menyimpan varian ukuran *(misal: 2, 3, 4, S, M, L, XL)* dan warna *(misal: Merah, Putih, Pramuka, Cokelat)*.
* **Multi-Filter Presisi:** Auto-expand dan menyaring varian hingga persis 1 varian tanpa scrolling.
* **🏭 Restock Terpusat ("+ Terima Barang Pabrik"):** Penerimaan pasokan barang konveksi dengan pencatatan riwayat *Stock Movement* otomatis.

---

### 4. 📄 Riwayat Transaksi Penjualan (Sales History)
* **🔍 Search Bar Instan:** Pencarian cepat berdasarkan nomor invoice, nama kasir, atau nama pelanggan.
* **📅 Filter Tanggal Responsif:** Tombol preset cepat (*Semua*, *Hari Ini*, *7 Hari Terakhir*, *Bulan Ini*) dan *Custom Date Picker* (Mulai s/d Selesai).
* **📄 Pagination (5 Invoice/Halaman):** Tampilan rapi terbagi per 5 transaksi dengan navigasi halaman.
* **📱 Mobile Card View:** Menampilkan rincian invoice, metode pembayaran, total belanja, dan tombol cetak ulang struk dalam bentuk kartu vertikal yang rapi di HP.

---

### 5. 💳 Buku Kasbon & Utang (Customer & Debt Management)
* **Pencatatan Piutang Real-Time:** Pencatatan saldo utang pelanggan otomatis saat transaksi kasir non-tunai.
* **🔍 Search Bar Pelanggan:** Pencarian cepat nama / nomor HP pelanggan secara instan.
* **📐 Urutan Tampilan Optimal:**
  1. *Daftar Piutang & Kasbon Aktif* (teratas untuk pencatatan cepat)
  2. *Riwayat Pembayaran Cicilan* (dengan Filter Tanggal & badge total terkumpul)
  3. *Daftar Pelanggan Bebas Utang* (lunas)
* **📄 Pagination Ringkas (5 Data/Halaman):** Pembatasan 5 data per halaman untuk Piutang Aktif, Pelanggan Lunas, dan Riwayat Pembayaran.

---

### 6. 📊 Ringkasan Keuangan & Inspektor Database (Supabase Cloud Sync)
* **Ringkasan Omset & Laba:** Performa penjualan harian, bulanan, dan total piutang toko dengan filter tanggal periode laporan.
* **📄 Paginasi Independen:** Tabel *Penjualan Terbaru* dan *Log Mutasi Stok* memuat seluruh data transaksi dengan kontrol paginasi instan (5 baris/halaman).
* **🗄️ Inspektor Database & Supabase Cloud Sync:**
  * Relokasi tombol inspektor ke bentuk **Icon Button (`<Database />`)** di footer sidebar & mobile header.
  * Dropdown selector tabel otomatis responsif 100% full-width di HP (`flexWrap: wrap`) untuk mencegah overflow.
  * **🔍 Tes Koneksi Supabase:** Tombol pengujian koneksi langsung ke Supabase Cloud via JS Client v2 dengan feedback latency dan status HTTP.
  * **⚡ Upload Semua Data (Force Sync):** Sinkronisasi massal seluruh tabel (`users`, `categories`, `products`, `product_variants`, `stock_movements`, `customers`, `sales`, `sale_items`, `debt_payments`, `piece_rates`, `worker_daily_logs`, `payroll_disbursements`) dari Local Storage ke Cloud Database Supabase.

---

### 7. 🖨️ Nota Faktur Dot Matrix & WhatsApp PDF Direct Sharing
* **📜 Format Faktur Toko Resmi (Lebar ~580px / A5 Landscape):**
  * Desain beralih dari struk thermal sempit ke **Faktur Toko Continuous Form Klasik Monokrom (`#000000`)** dengan font `Courier New` / `Consolas`.
  * **Header Berdampingan:** Identitas Toko (TOKO SERAGAM OLIVIANA), No. Invoice/Bukti, Tanggal & Jam, Kasir, dan Pelanggan.
  * **Tabel Barang Bergaris Klasik:** Kolom `NO` | `SKU` | `NAMA BARANG / VARIAN` | `QTY` | `HARGA` | `SUBTOTAL` dengan border putus-putus (*dashed/dotted*).
* **🖨️ Multi-Device Single-Page Print System (Iframe Isolation):**
  * Menggunakan modul cetak **Isolated Print Iframe** yang terkunci khusus pada ukuran **A5 Landscape (`210mm x 148mm`)**.
  * Hasil cetakan di **Laptop, iPad, maupun HP Android/iPhone 100% SAMA PERSIS, Pas 1 Halaman A5 (Zero Page-Break)**.

---

### 8. 🧵 Modul Penggajian & Borongan Penjahit (Piece-Rate Payroll)
* **🔐 Multi-Role Access Control (`OWNER`, `CASHIER`, `WORKER`):**
  * Peran **`WORKER` (Penjahit)** memiliki navigasi khusus yang langsung diarahkan ke menu *Input Hasil Kerja Harian*, tanpa akses ke transaksi kasir atau data keuangan.
  * Peran **`OWNER`** memiliki kontrol penuh untuk mengelola Master Tarif, menyetujui log pengerjaan, dan melakukan pencairan gaji.
* **✂️ Master Tarif Borongan (`MasterPieceRateView`):** Pengaturan tarif ongkos jahit / potongan per pcs/unit berdasarkan jenis pekerjaan & varian seragam. Menggunakan filter tombol preset chip (*Rok Panggul Karet*, *Celana Panjang Levis*, *Rok Wiru*, *Hem Panjang*, dll) untuk perpindahan instan antar jenis pakaian tanpa dropdown.
* **📊 Import 254 Data Tarif Excel (`Daftar_Ongkos_Jahit_Garment - Copy.xlsx`):** Sebanyak 254 item proses kerja dari 9 Model Garment telah di-seed secara otomatis ke dalam database (`v15_garment_type_filter`) dengan prefiks yang rapi dan bersih.
* **📝 Input Hasil Kerja Harian (`WorkerDailyLogView`):** Form pencatatan harian penjahit untuk melaporkan jumlah unit pekerjaan yang diselesaikan beserta tanggal dan catatan.
* **💰 Rekap & Pencairan Gaji Bulanan (`PayrollDisbursementView`):** Rekapitulasi penghitungan total gaji borongan per penjahit/periode bulan. Pencairan gaji otomatis mencatat pengeluaran kas toko (`cash_expenses`) dan mengubah status log menjadi `PAID`.
* **🧾 Slip Gaji Printable (`PayrollSlipModal`):** Pencetakan slip gaji borongan resmi per pekerja via isolated printable iframe.

---

### 9. 👥 Manajemen Pengguna & Keamanan Mandiri (User Management & Security)
* **👥 Kelola Pengguna (`UserManagementView`):**
  * Menu khusus **`OWNER`** untuk mengelola seluruh akun pengguna sistem (Owner, Kasir, dan Penjahit/Worker).
  * Menampilkan badge role, pencarian instan nama/email/role, form tambah pengguna baru, serta fungsi edit & hapus user.
  * Opsi reset kata sandi default/custom oleh Owner untuk memudahkan pemulihan akun staf.
* **🔑 Self-Service Ubah Kata Sandi (`ChangePasswordModal`):**
  * Modal mandiri yang memungkinkan setiap staf/pengguna (Owner, Kasir, Penjahit) mengubah kata sandi mereka sendiri secara aman.
  * Dilengkapi validasi kata sandi lama, perbandingan kata sandi baru & konfirmasi, serta toggle lihat/sembunyikan kata sandi (Eye Icon).

---

### 10. 🏗️ Clean Architecture, Supabase Schema & Multi-Platform Deployment Setup
* **Penyusutan Kode `App.jsx`:** Terstruktur modular dengan penyusutan file utama.
* **Struktur Modular Modern:**
  * **View Components (`src/components/views/`):** `LoginView`, `DbInspectorView`, `StockCheckerView`, `SalesHistoryView`, `DebtView`, `InventoryView` (Kelola produk & daftar detail varian stok), `DashboardView`, `PosView`, `MasterPieceRateView` (Pengaturan daftar & ongkos borongan), `WorkerDailyLogView`, `PayrollDisbursementView`, `UserManagementView` (Kelola akun Owner, Kasir, Penjahit).
  * **Modal Components (`src/components/modals/`):** `CheckoutSuccessModal`, `DebtReceiptModal`, `FactoryInboundModal`, `AddProductVariantModal`, `RepayDebtModal`, `PayrollSlipModal`, `ChangePasswordModal` (Modal self-service ubah kata sandi pengguna).
  * **Layout Components (`src/components/layout/`):** `Sidebar` (dengan pengelompokan kategori *Penjualan*, *Produk & Stok*, *Penggajian*, dan *Keuangan & Sistem*), `HeaderBar`, `BottomNav`.
  * **Backend Cloud & Sync (`src/supabaseClient.js`, `supabase_schema.sql`, `.env.example`):** Konfigurasi Supabase Client v2, DDL PostgreSQL lengkap (12 tabel + RLS Policies), serta environment variable setup untuk Vercel.
  * **Custom Hooks (`src/hooks/`):** `useAuth`, `useCart`, `useResponsive`.
  * **Utilities (`src/utils/`):** `formatters.js`, `sizeSorting.js`, `printHelper.js`.
* **🚀 Vercel Production Ready (`vercel.json`):** Konfigurasi Single Page Application (SPA) routing re-write untuk kemudahan deployment ke platform Vercel.
* **Audit & Build Verification:** Terverifikasi 0 error regression (`npm run build` PASS).

---

*Status Project: **ALL MENUS, PAYROLL, USER MANAGEMENT & SUPABASE CLOUD SYNC 100% COMPLETE (POS, Inventory, Debt, Sales History, Stock Checker, Financial Summary, DB Inspector & Supabase Sync, Dot Matrix Receipt, Piece-Rate Payroll, User Management & Vercel Deployment DONE)*** 🚀
