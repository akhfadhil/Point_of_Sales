// src/components/views/SalesHistoryView.jsx
import React, { useState } from 'react';
import { Search, X, Printer, Calendar } from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';

/**
 * Komponen Tampilan Halaman Riwayat Transaksi Penjualan & Invoice
 * @param {Object} props
 * @param {boolean} props.isOpen - Status apakah tab history sedang aktif
 * @param {Array} props.allSales - Daftar transaksi penjualan
 * @param {Array} props.allCustomers - Daftar pelanggan
 * @param {Object} props.db - Instance database lokal
 * @param {string} props.historySearchQuery - Kata kunci pencarian invoice
 * @param {Function} props.setHistorySearchQuery - Setter pencarian invoice
 * @param {number} props.historyPage - Halaman pagination saat ini
 * @param {Function} props.setHistoryPage - Setter halaman pagination
 * @param {Function} props.setCurrentSaleInvoice - Setter invoice terpilih untuk struk
 * @param {Function} props.setActiveModal - Setter modal aktif
 * @param {boolean} props.isMobile - Status mode mobile
 */
export default function SalesHistoryView({
  isOpen,
  allSales,
  allCustomers,
  db,
  historySearchQuery,
  setHistorySearchQuery,
  historyPage,
  setHistoryPage,
  setCurrentSaleInvoice,
  setActiveModal,
  isMobile
}) {
  const [datePreset, setDatePreset] = useState('all'); // 'all' | 'today' | '7days' | 'thisMonth' | 'custom'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  if (!isOpen) return null;

  // Filter Sales History (Text Search + Date Filter)
  const filteredSales = allSales.slice().reverse().filter(sale => {
    const saleTime = new Date(sale.created_at).getTime();
    const now = new Date();

    if (datePreset === 'today') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
      if (saleTime < startOfDay || saleTime > endOfDay) return false;
    } else if (datePreset === '7days') {
      const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6).getTime();
      if (saleTime < sevenDaysAgo) return false;
    } else if (datePreset === 'thisMonth') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
      if (saleTime < startOfMonth) return false;
    } else if (datePreset === 'custom') {
      if (startDate) {
        const start = new Date(startDate).setHours(0, 0, 0, 0);
        if (saleTime < start) return false;
      }
      if (endDate) {
        const end = new Date(endDate).setHours(23, 59, 59, 999);
        if (saleTime > end) return false;
      }
    }

    if (!historySearchQuery.trim()) return true;
    const q = historySearchQuery.toLowerCase().trim();
    const cashier = db.find('users', u => u.id === sale.cashier_id);
    const cust = allCustomers.find(c => c.id === sale.customer_id);
    const invNum = sale.invoice_number.toLowerCase();
    const cashierName = cashier ? cashier.name.toLowerCase() : '';
    const custName = cust ? cust.name.toLowerCase() : 'umum walk-in';
    return invNum.includes(q) || cashierName.includes(q) || custName.includes(q);
  });

  // Pagination params
  const historyLimit = 5;
  const totalHistoryPages = Math.ceil(filteredSales.length / historyLimit) || 1;
  const currentHPage = Math.min(historyPage, totalHistoryPages);
  const paginatedSales = filteredSales.slice((currentHPage - 1) * historyLimit, currentHPage * historyLimit);

  // Calculate gross sales for filtered view
  const totalFilteredAmount = filteredSales.reduce((sum, s) => sum + (s.total_amount || 0), 0);

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header Title & Search Bar */}
      <div className="card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Laporan Invoice Penjualan</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>Riwayat lengkap transaksi nota penjualan toko Oliviana.</p>
          </div>

          {/* Search Bar Invoice */}
          <div style={{ position: 'relative', minWidth: '240px', flex: 1, maxWidth: '400px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Cari no. invoice, kasir, pelanggan..."
              value={historySearchQuery}
              onChange={(e) => {
                setHistorySearchQuery(e.target.value);
                setHistoryPage(1);
              }}
              style={{ paddingLeft: '36px', paddingRight: '32px', fontSize: '13px' }}
            />
            {historySearchQuery && (
              <button
                type="button"
                onClick={() => setHistorySearchQuery('')}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Responsive Filter Tanggal Bar */}
      <div className="card" style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
            <Calendar size={16} /> Filter Tanggal:
          </span>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', width: isMobile ? '100%' : 'auto' }}>
            <button
              type="button"
              className={`btn btn-sm ${datePreset === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '20px', padding: '4px 12px', fontSize: '12px', flex: isMobile ? '1 1 auto' : 'initial' }}
              onClick={() => { setDatePreset('all'); setHistoryPage(1); }}
            >
              Semua
            </button>
            <button
              type="button"
              className={`btn btn-sm ${datePreset === 'today' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '20px', padding: '4px 12px', fontSize: '12px', flex: isMobile ? '1 1 auto' : 'initial' }}
              onClick={() => { setDatePreset('today'); setHistoryPage(1); }}
            >
              Hari Ini
            </button>
            <button
              type="button"
              className={`btn btn-sm ${datePreset === '7days' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '20px', padding: '4px 12px', fontSize: '12px', flex: isMobile ? '1 1 auto' : 'initial' }}
              onClick={() => { setDatePreset('7days'); setHistoryPage(1); }}
            >
              7 Hari Terakhir
            </button>
            <button
              type="button"
              className={`btn btn-sm ${datePreset === 'thisMonth' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '20px', padding: '4px 12px', fontSize: '12px', flex: isMobile ? '1 1 auto' : 'initial' }}
              onClick={() => { setDatePreset('thisMonth'); setHistoryPage(1); }}
            >
              Bulan Ini
            </button>
            <button
              type="button"
              className={`btn btn-sm ${datePreset === 'custom' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '20px', padding: '4px 12px', fontSize: '12px', flex: isMobile ? '1 1 auto' : 'initial' }}
              onClick={() => { setDatePreset('custom'); setHistoryPage(1); }}
            >
              Custom Range
            </button>
          </div>

          {datePreset === 'custom' && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', width: isMobile ? '100%' : 'auto', marginTop: isMobile ? '4px' : '0' }}>
              <input
                type="date"
                className="form-control"
                style={{ fontSize: '12px', padding: '6px 10px', flex: 1, minWidth: '120px' }}
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setHistoryPage(1); }}
              />
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>s/d</span>
              <input
                type="date"
                className="form-control"
                style={{ fontSize: '12px', padding: '6px 10px', flex: 1, minWidth: '120px' }}
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setHistoryPage(1); }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: 'var(--text-primary)' }}>Riwayat Transaksi</h2>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span className="badge secondary">Total Omset: {formatRupiah(totalFilteredAmount)}</span>
            <span className="badge info">{filteredSales.length} Total Invoice</span>
          </div>
        </div>

        {/* Desktop vs Mobile/Tablet View */}
        {isMobile ? (
          /* Tablet & Mobile View Cards Grid */
          <div className="mobile-only">
            {paginatedSales.map(sale => {
              const cashier = db.find('users', u => u.id === sale.cashier_id);
              const cust = allCustomers.find(c => c.id === sale.customer_id);

              return (
                <div
                  key={sale.id}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    border: '1px solid var(--card-border)',
                    backgroundColor: 'var(--card-bg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <strong style={{ fontSize: '15px', color: 'var(--primary)' }}>{sale.invoice_number}</strong>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        🗓️ {new Date(sale.created_at).toLocaleString('id-ID')}
                      </div>
                    </div>
                    <span className={`badge ${sale.payment_status === 'PAID' ? 'success' : sale.payment_status === 'PARTIAL' ? 'warning' : 'danger'}`}>
                      {sale.payment_status === 'PAID' ? 'LUNAS' : sale.payment_status === 'PARTIAL' ? 'SEBAGIAN' : 'BELUM LUNAS'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-tertiary)', padding: '10px 12px', borderRadius: '8px', fontSize: '13px' }}>
                    <span>Total Transaksi:</span>
                    <strong style={{ fontSize: '16px', color: 'var(--success)' }}>
                      {formatRupiah(sale.total_amount)}
                    </strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <span>👤 Pelanggan: <strong>{cust ? cust.name : 'Umum (Walk-in)'}</strong></span>
                    <span>Via: <span className="badge info" style={{ fontSize: '10px' }}>{sale.payment_method}</span></span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <span>👨‍💼 Kasir: {cashier ? cashier.name : 'Unknown'}</span>
                  </div>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ width: '100%', padding: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '2px' }}
                    onClick={() => {
                      setCurrentSaleInvoice(sale);
                      setActiveModal('checkout-success');
                    }}
                  >
                    <Printer size={14} /> Cetak Struk
                  </button>
                </div>
              );
            })}

            {filteredSales.length === 0 && (
              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '13px' }}>
                {historySearchQuery ? `Tidak ada invoice cocok dengan "${historySearchQuery}".` : 'Belum ada riwayat penjualan pada periode ini.'}
              </div>
            )}
          </div>
        ) : (
          /* Desktop View Table */
          <div className="table-wrapper desktop-only">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ whiteSpace: 'nowrap' }}>Nomor Invoice</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Waktu/Tanggal</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Nama Kasir</th>
                  <th style={{ minWidth: '160px' }}>Pelanggan</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Total Transaksi</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Metode</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Status</th>
                  <th style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSales.map(sale => {
                  const cashier = db.find('users', u => u.id === sale.cashier_id);
                  const cust = allCustomers.find(c => c.id === sale.customer_id);

                  return (
                    <tr key={sale.id}>
                      <td style={{ whiteSpace: 'nowrap' }}><strong>{sale.invoice_number}</strong></td>
                      <td style={{ whiteSpace: 'nowrap' }}>{new Date(sale.created_at).toLocaleString('id-ID')}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{cashier ? cashier.name : 'Unknown'}</td>
                      <td>{cust ? cust.name : 'Umum (Walk-in)'}</td>
                      <td style={{ whiteSpace: 'nowrap' }}><strong>{formatRupiah(sale.total_amount)}</strong></td>
                      <td style={{ whiteSpace: 'nowrap' }}><span className="badge info">{sale.payment_method}</span></td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <span className={`badge ${sale.payment_status === 'PAID' ? 'success' :
                          sale.payment_status === 'PARTIAL' ? 'warning' : 'danger'
                          }`}>
                          {sale.payment_status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ whiteSpace: 'nowrap' }}
                          onClick={() => {
                            setCurrentSaleInvoice(sale);
                            setActiveModal('checkout-success');
                          }}
                        >
                          <Printer size={12} /> Struk
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredSales.length === 0 && (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '16px' }}>
                      {historySearchQuery ? `Tidak ada invoice cocok dengan "${historySearchQuery}".` : 'Belum ada riwayat penjualan pada periode ini.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Sales History */}
        {totalHistoryPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--card-border)', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Halaman {currentHPage} dari {totalHistoryPages} ({filteredSales.length} Invoice)
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={currentHPage === 1}
                onClick={() => setHistoryPage(prev => Math.max(1, prev - 1))}
              >
                ‹ Sebelumnya
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={currentHPage === totalHistoryPages}
                onClick={() => setHistoryPage(prev => Math.min(totalHistoryPages, prev + 1))}
              >
                Selanjutnya ›
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
