// src/components/layout/HeaderBar.jsx
import React from 'react';

/**
 * Komponen Header Bar Utama (Judul Halaman Dinamis & Status Role User)
 * Harus dirender di dalam <main className="main-content">
 * @param {Object} props
 * @param {string} props.activeTab - Tab view aktif saat ini
 * @param {Object} props.currentUser - User yang sedang aktif login
 */
export default function HeaderBar({
  activeTab,
  currentUser
}) {
  if (!currentUser) return null;

  return (
    <header className="header-bar">
      <div className="header-title">
        {activeTab === 'dashboard' && (
          <>
            <h1>Ringkasan Keuangan</h1>
            <p>Pantau performa penjualan, laba bersih, dan utang toko.</p>
          </>
        )}
        {activeTab === 'inventory' && (
          <>
            <h1>Manajemen Produk & Stok</h1>
            <p>Tambah varian baju, atur harga jual, dan terima barang dari pabrik konveksi.</p>
          </>
        )}
        {activeTab === 'debt' && (
          <>
            <h1>Buku Kasbon & Utang</h1>
            <p>Catat dan kelola piutang pelanggan beserta pembayaran cicilan.</p>
          </>
        )}
        {activeTab === 'history' && (
          <>
            <h1>Riwayat Transaksi Penjualan</h1>
            <p>Laporan detail invoice penjualan toko Oliviana.</p>
          </>
        )}
        {activeTab === 'pos' && (
          <>
            <h1>Kasir</h1>
            <p>Pencatatan penjualan cepat tanpa barcode scanner.</p>
          </>
        )}
        {activeTab === 'check-stock' && (
          <>
            <h1>Cek Stok Barang</h1>
            <p>Cari sisa stok produk secara real-time berdasarkan ukuran & nama.</p>
          </>
        )}
        {activeTab === 'piece-rates' && (
          <>
            <h1>Master Tarif</h1>
            <p>Atur tarif borongan per jenis pakaian dan kelola data penjahit.</p>
          </>
        )}
        {activeTab === 'payroll' && (
          <>
            <h1>Rekap & Pencairan Gaji</h1>
            <p>Persetujuan gaji bulanan penjahit dan pencatatan pengeluaran kas otomatis.</p>
          </>
        )}
        {activeTab === 'worker-daily-log' && (
          <>
            <h1>Input Hasil Kerja Harian</h1>
            <p>Portal penjahit untuk melaporkan hasil pekerjaan borongan harian.</p>
          </>
        )}
        {activeTab === 'db-viewer' && (
          <>
            <h1>Inspektor Database</h1>
            <p>Lihat data tabel database lokal (LocalStorage) secara visual.</p>
          </>
        )}
        {activeTab === 'users' && (
          <>
            <h1>Manajemen Pengguna</h1>
            <p>Kelola data akun Owner, Kasir, dan Penjahit (Worker) dalam satu antarmuka.</p>
          </>
        )}
      </div>
    </header>
  );
}
