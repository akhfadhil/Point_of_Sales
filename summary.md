# 🛍️ Oliviana Point of Sales (POS) & Manajemen Stok Seragam

Aplikasi **Point of Sales (POS) & Sistem Manajemen Stok Seragam** modern, cepat, dan *offline-ready* yang dirancang khusus untuk toko seragam sekolah (**Oliviana**). Aplikasi ini mengintegrasikan seluruh proses bisnis toko dari kasir penjualan harian, skema harga bertingkat, pencatatan utang pelanggan, hingga pengelolaan ratusan varian seragam sekolah (Ukuran & Warna) dari pabrik konveksi.

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
  * **Laptop / PC:** Tampilan tabel lebar lengkap dengan harga modal (Owner), harga jual, dan status stok.
  * **HP & Tablet:** Tampilan *Mobile Stock Cards Grid* yang ringkas tanpa scroll samping.

---

### 3. 📦 Manajemen Stok & Produk (Inventory Management)
* **Pemisahan Varian Terstruktur (Ukuran & Warna):** Setiap produk seragam menyimpan varian ukuran *(misal: 2, 3, 4, S, M, L, XL)* dan warna *(misal: Merah, Putih, Pramuka, Cokelat)*.
* **Multi-Filter Presisi:** Auto-expand dan menyaring varian hingga persis 1 varian tanpa scrolling.
* **🏭 Restock Terpusat ("+ Terima Barang Pabrik"):** Penerimaan pasokan barang konveksi dengan pencatatan riwayat *Stock Movement* otomatis.

---

### 4. 📄 Riwayat Transaksi Penjualan (Sales History)
* **🔍 Search Bar Instan:** Pencarian cepat berdasarkan nomor invoice, nama kasir, atau nama pelanggan.
* **📄 Pagination (5 Invoice/Halaman):** Tampilan rapi terbagi per 5 transaksi dengan navigasi halaman.
* **📱 Mobile Card View:** Menampilkan rincian invoice, metode pembayaran, total belanja, dan tombol cetak ulang struk dalam bentuk kartu vertikal yang rapi di HP.
* **Data Dummy Realistis:** Dilengkapi 12 sampel transaksi penjualan dummy (`sl-1` s/d `sl-12`) untuk pengujian pencarian dan pagination.

---

### 5. 💳 Buku Kasbon & Utang (Customer & Debt Management)
* **Pencatatan Piutang Real-Time:** Pencatatan saldo utang pelanggan otomatis saat transaksi kasir non-tunai.
* **🔍 Search Bar Pelanggan:** Pencarian cepat nama / nomor HP pelanggan secara instan.
* **📄 Pagination Ringkas (5 Data/Halaman):** Pembatasan 5 data per halaman untuk Piutang Aktif, Pelanggan Lunas, dan Riwayat Pembayaran.
* **🎨 Tampilan Mobile Cards (Nol Scroll Samping):** Kartu vertikal piutang aktif dengan nominal utang merah tebal & tombol *Catat Pembayaran Cicilan*.

---

### 6. 📊 Ringkasan Keuangan & Inspektor Database
* **Ringkasan Omset & Laba:** Performa penjualan harian, bulanan, dan total piutang toko.
* **🗄️ Inspektor Database Lokal (Dev Helper):**
  * Relokasi tombol inspektor ke bentuk **Icon Button (`<Database />`)** di footer sidebar & mobile header.
  * Dropdown selector tabel otomatis responsif 100% full-width di HP (`flexWrap: wrap`) untuk mencegah overflow offside.

---

### 🛡️ Arsitektur Teknologi & Responsive System
* **Core:** React.js, Vite, Vanilla CSS design system.
* **Responsive Breakpoint (1024px):** Dukungan penuh layar iPad / Tablet (768px - 1024px) dan HP (< 768px).
* **Header & Drawer Mobile:** Header mobile 100% full-width edge-to-edge + drawer menu sidebar sleek width `min(320px, 85vw)`.
* **Persistence:** Custom LocalStorage Database Engine (`src/db.js`) v11 dengan data dummy awal.

---

*Status Project: **ALL MENUS COMPLETE & FULLY RESPONSIVE (POS, Inventory, Debt, Sales History, Stock Checker, Financial Summary, DB Inspector DONE)*** 🚀
