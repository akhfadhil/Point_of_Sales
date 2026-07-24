# 🛍️ Oliviana Point of Sales (POS) & Manajemen Stok Seragam

Aplikasi **Point of Sales (POS) & System Manajemen Stok Seragam** modern, cepat, dan *offline-ready* yang dirancang khusus untuk toko seragam sekolah (**Oliviana**). Aplikasi ini mengintegrasikan seluruh proses bisnis toko dari kasir penjualan harian, skema harga bertingkat, pencatatan utang pelanggan, hingga pengelolaan ratusan varian seragam sekolah (Ukuran & Warna) dari pabrik konveksi.

---

## 🌟 Fitur Utama Aplikasi

### 1. 🛒 Kasir POS (Point of Sales) Real-Time
* **Pemilihan Produk 2-Langkah Mudah:** Pilih Produk Utama ➡️ Pilih tombol **Ukuran** & **Warna** varian baju secara instan.
* **Skema Harga Bertingkat Otomatis:**
  * 👤 **Umum:** Base Pricelist + Rp 15.000
  * 👨‍🏫 **Guru:** Base Pricelist + Rp 5.000
  * 🏢 **Grosir:** Base Pricelist (Rp 0)
* **Dukungan Metode Pembayaran:**
  * **TUNAI (Cash):** Kalkulasi kembalian otomatis & pengurangan stok real-time.
  * **UTANG / CICILAN:** Pencatatan utang otomatis ke saldo pelanggan.
* **Struk Belanja & WhatsApp:**
  * Cetak struk belanja thermal/browser.
  * Simulasi pengiriman struk belanja langsung ke WhatsApp pelanggan.

---

### 2. 📦 Manajemen Stok & Produk (Inventory Management)
* **Pemisahan Varian Terstruktur (Ukuran & Warna):**
  * Setiap produk seragam menyimpan varian ukuran *(misal: 2, 3, 4, S, M, L, XL)* dan warna *(misal: Merah, Putih, Pramuka, Cokelat)* secara terpisah.
* **⚡ Multi-Filter Presisi (Nol Scroll):**
  * Filter serentak berdasarkan **Produk**, **Ukuran**, **Warna**, dan **SKU / Kata Kunci**.
  * Hasil pencarian otomatis melakukan *auto-expand* dan menyaring hingga **persis 1 varian** tanpa perlu scrolling di HP maupun Laptop.
* **🏭 Restock Terpusat ("+ Terima Barang Pabrik"):**
  * Tombol restock terpusat di toolbar atas.
  * Memungkinkan penerimaan pasokan barang dari pabrik konveksi dengan pencatatan riwayat *Stock Movement* otomatis.
* **📱 Layout Adaptif (Desktop vs Mobile):**
  * **Laptop / PC:** Tampilan tabel lebar lengkap & bersih.
  * **Smartphone / HP:** Tampilan *Mobile Variant Cards* vertikal tanpa scroll menyamping.

---

### 3. 👥 Manajemen Pelanggan & Utang (Customer & Debt)
* Pencatatan saldo utang pelanggan secara real-time.
* Modal pembayaran cicilan utang dengan riwayat transaksi lengkap.
* Cetak struk pembayaran cicilan utang.

---

### 4. 📊 Ringkasan Keuangan & Dashboard Owner
* Ringkasan Omset Penjualan Harian & Bulanan.
* Total Piutang Utang Aktif Pelanggan.
* Ekspor data & database inspector terpadu.

---

### 🛡️ Arsitektur Teknologi
* **Core:** React.js, Vite, Vanilla CSS design system.
* **Persistence:** Custom LocalStorage Database Engine (`src/db.js`) dengan auto-seeding data dari Excel konveksi.
* **Safety:** Protected React ErrorBoundary untuk mencegah *blank screen*.

---

*Project status: **Stok Management & POS Core DONE*** 🚀
