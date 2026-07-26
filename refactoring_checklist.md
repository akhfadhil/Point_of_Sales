# 📝 Checklist Refactoring App.jsx — Oliviana POS

Dokumen ini berisi panduan dan checklist langkah-demi-langkah untuk melakukan refactoring file `App.jsx` (4.480+ baris) secara bertahap dari tingkat risiko terendah hingga terbanyak.

---

## 🎯 Target Arsitektur Akhir

```text
src/
├── components/
│   ├── common/
│   │   ├── ErrorBoundary.jsx
│   │   ├── Toast.jsx
│   │   └── ConfirmModal.jsx
│   ├── layout/
│   │   ├── Sidebar.jsx
│   │   ├── HeaderBar.jsx
│   │   └── BottomNav.jsx
│   ├── modals/
│   │   ├── CheckoutSuccessModal.jsx
│   │   ├── DebtReceiptModal.jsx
│   │   ├── FactoryInboundModal.jsx
│   │   ├── AddProductVariantModal.jsx
│   │   └── RepayDebtModal.jsx
│   └── views/
│       ├── LoginView.jsx
│       ├── DashboardView.jsx
│       ├── PosView.jsx
│       ├── InventoryView.jsx
│       ├── DebtView.jsx
│       ├── SalesHistoryView.jsx
│       ├── StockCheckerView.jsx
│       └── DbInspectorView.jsx
├── hooks/
│   ├── useResponsive.js
│   ├── useAuth.js
│   └── useCart.js
├── utils/
│   ├── formatters.js
│   ├── sizeSorting.js
│   └── printHelper.js
└── App.jsx (Hanya ~100-150 baris)
```

---

## 📋 Checklist Eksekusi Bertahap

### 🟢 Fase 1: Utilitas Murni (Risiko: 0% — Paling Mudah)
*Fungsi pembantu murni (pure JS) tanpa state React atau manipulasi DOM langsung.*

- [x] **1.1 `src/utils/formatters.js`**
  - [x] Ekstraksi `formatRupiah(num)`
- [x] **1.2 `src/utils/sizeSorting.js`**
  - [x] Ekstraksi `SIZE_HIERARCHY`
  - [x] Ekstraksi `parseSizeWeight(size)`
  - [x] Ekstraksi `compareVariants(a, b)`
  - [x] Ekstraksi `sortSizes(sizes)`
- [x] **1.3 `src/utils/printHelper.js`**
  - [x] Ekstraksi `printReceipt(elementId)` (Isolated Print Iframe System)

---

### 🟢 Fase 2: Komponen Feedback UI Umum & Hooks Dasar (Risiko: Sangat Rendah)
*Komponen UI terisolasi & hook event listener sederhana.*

- [x] **2.1 `src/components/common/ErrorBoundary.jsx`**
  - [x] Ekstraksi kelas `ErrorBoundary` dari bagian bawah `App.jsx`
- [x] **2.2 `src/components/common/Toast.jsx`**
  - [x] Ekstraksi tampilan toast notifikasi melayang
- [x] **2.3 `src/components/common/ConfirmModal.jsx`**
  - [x] Ekstraksi dialog konfirmasi kustom (`askConfirmation`)
- [x] **2.4 `src/hooks/useResponsive.js`**
  - [x] Ekstraksi window resize listener untuk state `isMobile` (768px)

---

### 🟡 Fase 3: Komponen Modal Pop-up (Risiko: Rendah)
*Modal-modal terpisah yang dirender kondisional berdasarkan `activeModal`.*

- [x] **3.1 `src/components/modals/CheckoutSuccessModal.jsx`**
  - [x] Struk dot matrix kasir POS & tombol WhatsApp PDF Sharing
- [x] **3.2 `src/components/modals/DebtReceiptModal.jsx`**
  - [x] Struk bukti pembayaran cicilan utang
- [x] **3.3 `src/components/modals/FactoryInboundModal.jsx`**
  - [x] Form terima pasokan barang dari pabrik konveksi
- [x] **3.4 `src/components/modals/AddProductVariantModal.jsx`**
  - [x] Form gabungan tambah produk baru & varian ukuran/warna
- [x] **3.5 `src/components/modals/RepayDebtModal.jsx`**
  - [x] Form catat pembayaran cicilan utang pelanggan

---

### 🟡 Fase 4: Komponen Layout & Navigasi (Risiko: Rendah)
*Komponen navigasi & kerangka luar antarmuka.*

- [x] **4.1 `src/components/layout/Sidebar.jsx`**
  - [x] Navigasi sidebar desktop, mobile drawer, profil user, ganti tema, inspector, logout, & reset DB
- [x] **4.2 `src/components/layout/HeaderBar.jsx`**
  - [x] Header judul halaman dinamis & badge status role aktif
- [x] **4.3 `src/components/layout/BottomNav.jsx`**
  - [x] Bottom navigation bar khusus tampilan layar HP (< 768px)

---

### 🟠 Fase 5: Halaman / Tab Views Utama (Risiko: Sedang)
*Pemisahan tampilan halaman sesuai `activeTab`.*

- [x] **5.1 `src/components/views/LoginView.jsx`**
  - [x] Tampilan halaman login & role switcher (`OWNER` vs `CASHIER`)
- [x] **5.2 `src/components/views/DbInspectorView.jsx`**
  - [x] Tampilan developer inspektor database lokal
- [x] **5.3 `src/components/views/StockCheckerView.jsx`**
  - [x] Tampilan halaman Cek Stok Barang
- [x] **5.4 `src/components/views/SalesHistoryView.jsx`**
  - [x] Tampilan Riwayat Transaksi Penjualan & Invoice
- [x] **5.5 `src/components/views/DebtView.jsx`**
  - [x] Tampilan Buku Kasbon & Utang (Piutang Aktif, Lunas, Riwayat Cicilan)
- [x] **5.6 `src/components/views/InventoryView.jsx`**
  - [x] Tampilan Manajemen Stok & Produk (Multi-filter + Accordion Varian)
- [x] **5.7 `src/components/views/DashboardView.jsx`**
  - [x] Tampilan Ringkasan Keuangan Owner (Omset, Laba, Piutang)
- [x] **5.8 `src/components/views/PosView.jsx`**
  - [x] Tampilan Kasir POS (Katalog, Modal Varian POS, & Keranjang Split-Screen)

---

### 🔴 Fase 6: Custom Hooks State Management (Opsional / Perapihan Akhir)
*Mengonsolidasi state global/lokal agar `App.jsx` menjadi sangat ringkas.*

- [x] **6.1 `src/hooks/useAuth.js`**
  - [x] Pengelolaan state user login, role, & LocalStorage persistence
- [x] **6.2 `src/hooks/useCart.js`**
  - [x] Pengelolaan state keranjang belanja, penyesuaian harga bertingkat, & checkout POS
- [x] **6.3 Perapihan Akhir `App.jsx`**
  - [x] Menjadikan `App.jsx` sebagai Router / View Switcher murni yang bersih & modular
  - [x] Jalankan verifikasi `npm run build` untuk memastikan 0 error regression

---

🎉 **REFACTORING 100% SELESAI!**
Semua komponen, modal, layout, modul utilitas, view utama, dan custom hook telah dipisah dengan rapi. Hasil build terverifikasi 0 error.
