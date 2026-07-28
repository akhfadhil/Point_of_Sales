// src/components/layout/Sidebar.jsx
import React from 'react';
import {
  TrendingUp,
  ShoppingCart,
  Package,
  Users,
  History,
  Eye,
  Sun,
  Moon,
  Database,
  LogOut,
  RefreshCw,
  Scissors,
  DollarSign
} from 'lucide-react';

/**
 * Komponen Sidebar Navigasi Desktop & Mobile Drawer
 * @param {Object} props
 * @param {boolean} props.isMobileMenuOpen - Status terbuka drawer menu mobile
 * @param {Function} props.setIsMobileMenuOpen - Setter status menu mobile
 * @param {string} props.activeTab - Tab view aktif saat ini
 * @param {Function} props.setActiveTab - Setter tab view aktif
 * @param {Object} props.currentUser - Data user yang sedang aktif login
 * @param {Function} props.handleLogout - Handler proses logout
 * @param {Function} props.handleResetDB - Handler reset database simulasi
 * @param {boolean} props.darkMode - Status mode gelap (dark mode)
 * @param {Function} props.setDarkMode - Setter toggle mode gelap
 */
export default function Sidebar({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  activeTab,
  setActiveTab,
  currentUser,
  handleLogout,
  handleResetDB,
  darkMode,
  setDarkMode
}) {
  if (!currentUser) return null;

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div className="mobile-sidebar-overlay" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
          <div className="sidebar-brand">
            <span className="sidebar-logo">Oliviana POS</span>
          </div>

          <nav className="sidebar-menu">
            {currentUser.role === 'OWNER' && (
              <>
                <button
                  type="button"
                  className={`sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
                >
                  <TrendingUp size={18} />
                  Ringkasan Keuangan
                </button>

                <button
                  type="button"
                  className={`sidebar-item ${activeTab === 'piece-rates' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('piece-rates'); setIsMobileMenuOpen(false); }}
                >
                  <Scissors size={18} />
                  Master Tarif Borongan
                </button>

                <button
                  type="button"
                  className={`sidebar-item ${activeTab === 'payroll' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('payroll'); setIsMobileMenuOpen(false); }}
                >
                  <DollarSign size={18} />
                  Rekap Gaji Borongan
                </button>
              </>
            )}

            {currentUser.role === 'WORKER' && (
              <button
                type="button"
                className={`sidebar-item ${activeTab === 'worker-daily-log' ? 'active' : ''}`}
                onClick={() => { setActiveTab('worker-daily-log'); setIsMobileMenuOpen(false); }}
              >
                <Scissors size={18} />
                Input Hasil Kerja
              </button>
            )}

            {currentUser.role !== 'WORKER' && (
              <>
                <button
                  type="button"
                  className={`sidebar-item ${activeTab === 'pos' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('pos'); setIsMobileMenuOpen(false); }}
                >
                  <ShoppingCart size={18} />
                  Kasir
                </button>

                <button
                  type="button"
                  className={`sidebar-item ${activeTab === 'inventory' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('inventory'); setIsMobileMenuOpen(false); }}
                >
                  <Package size={18} />
                  Kelola Stok & Produk
                </button>

                <button
                  type="button"
                  className={`sidebar-item ${activeTab === 'debt' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('debt'); setIsMobileMenuOpen(false); }}
                >
                  <Users size={18} />
                  Utang & Kasbon
                </button>

                <button
                  type="button"
                  className={`sidebar-item ${activeTab === 'history' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('history'); setIsMobileMenuOpen(false); }}
                >
                  <History size={18} />
                  Riwayat Transaksi
                </button>
              </>
            )}

            <button
              type="button"
              className={`sidebar-item ${activeTab === 'check-stock' ? 'active' : ''}`}
              onClick={() => { setActiveTab('check-stock'); setIsMobileMenuOpen(false); }}
            >
              <Eye size={18} />
              Cek Stok Barang
            </button>
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              {currentUser.name ? currentUser.name.charAt(0) : 'U'}
            </div>
            <div className="user-info">
              <span className="user-name">{currentUser.name}</span>
              <span className="user-role">
                {currentUser.role === 'OWNER' ? 'Owner Toko' : currentUser.role === 'WORKER' ? 'Penjahit / Worker' : 'Kasir'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm btn-icon"
              style={{ flex: 1 }}
              onClick={() => setDarkMode(!darkMode)}
              title="Ganti Tema"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {currentUser.role === 'OWNER' && (
              <button
                type="button"
                className={`btn btn-sm btn-icon ${activeTab === 'db-viewer' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1 }}
                onClick={() => { setActiveTab('db-viewer'); setIsMobileMenuOpen(false); }}
                title="Inspektor Database"
              >
                <Database size={16} />
              </button>
            )}

            <button
              type="button"
              className="btn btn-danger btn-sm btn-icon"
              style={{ flex: 1 }}
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '11px', padding: '4px' }}
            onClick={handleResetDB}
          >
            <RefreshCw size={10} /> Reset DB Simulasi
          </button>
        </div>
      </aside>
    </>
  );
}
