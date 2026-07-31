// src/components/layout/BottomNav.jsx
import React from 'react';
import { TrendingUp, Package, ShoppingCart, CreditCard, Search } from 'lucide-react';

/**
 * Komponen Bottom Navigation Bar Khusus Layar HP / Mobile (< 768px)
 * @param {Object} props
 * @param {string} props.activeTab - Tab view aktif saat ini
 * @param {Function} props.setActiveTab - Setter tab view aktif
 * @param {Object} props.currentUser - User yang sedang aktif login
 * @param {Function} props.setIsMobileMenuOpen - Setter status menu mobile drawer
 */
export default function BottomNav({
  activeTab,
  setActiveTab,
  currentUser,
  setIsMobileMenuOpen
}) {
  if (!currentUser) return null;

  return (
    <nav className="bottom-nav">
      {currentUser.role === 'WORKER' ? (
        <button
          type="button"
          className={`bottom-nav-item ${activeTab === 'worker-daily-log' ? 'active' : ''}`}
          onClick={() => { setActiveTab('worker-daily-log'); setIsMobileMenuOpen(false); }}
        >
          <TrendingUp size={20} />
          <span>Hasil Kerja</span>
        </button>
      ) : (
        <>
          {currentUser.role === 'OWNER' && (
            <button
              type="button"
              className={`bottom-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
            >
              <TrendingUp size={20} />
              <span>Ringkasan</span>
            </button>
          )}

          <button
            type="button"
            className={`bottom-nav-item ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => { setActiveTab('inventory'); setIsMobileMenuOpen(false); }}
          >
            <Package size={20} />
            <span>Stok</span>
          </button>

          <button
            type="button"
            className={`bottom-nav-item ${activeTab === 'pos' ? 'active' : ''}`}
            onClick={() => { setActiveTab('pos'); setIsMobileMenuOpen(false); }}
          >
            <ShoppingCart size={20} />
            <span>Kasir POS</span>
          </button>

          <button
            type="button"
            className={`bottom-nav-item ${activeTab === 'debt' ? 'active' : ''}`}
            onClick={() => { setActiveTab('debt'); setIsMobileMenuOpen(false); }}
          >
            <CreditCard size={20} />
            <span>Kasbon</span>
          </button>

          <button
            type="button"
            className={`bottom-nav-item ${activeTab === 'check-stock' ? 'active' : ''}`}
            onClick={() => { setActiveTab('check-stock'); setIsMobileMenuOpen(false); }}
          >
            <Search size={20} />
            <span>Cek Stok</span>
          </button>
        </>
      )}
    </nav>
  );
}
