// src/components/views/DebtView.jsx
import React, { useState } from 'react';
import { Search, X, CreditCard, Printer, Calendar } from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';

/**
 * Komponen Tampilan Halaman Manajemen Utang & Kasbon Pelanggan
 * @param {Object} props
 * @param {boolean} props.isOpen - Status apakah tab debt sedang aktif
 * @param {Array} props.allCustomers - Daftar pelanggan
 * @param {Array} props.allDebtPayments - Daftar riwayat pembayaran cicilan kasbon
 * @param {Object} props.db - Instance database lokal
 * @param {string} props.debtSearchQuery - Kata kunci pencarian pelanggan
 * @param {Function} props.setDebtSearchQuery - Setter pencarian pelanggan
 * @param {number} props.debtActivePage - Halaman pagination piutang aktif
 * @param {Function} props.setDebtActivePage - Setter halaman piutang aktif
 * @param {number} props.debtSettledPage - Halaman pagination bebas utang
 * @param {Function} props.setDebtSettledPage - Setter halaman bebas utang
 * @param {number} props.debtHistoryPage - Halaman pagination riwayat cicilan
 * @param {Function} props.setDebtHistoryPage - Setter halaman riwayat cicilan
 * @param {Function} props.setSelectedCustomer - Setter pelanggan terpilih untuk cicilan
 * @param {Function} props.setDebtRepayAmount - Setter input nominal cicilan
 * @param {Function} props.setDebtRepayMethod - Setter metode bayar cicilan
 * @param {Function} props.setActiveModal - Setter modal aktif
 * @param {Function} props.setSelectedDebtPayment - Setter objek pembayaran cicilan terpilih untuk cetak struk
 * @param {boolean} props.isMobile - Status mode mobile
 */
export default function DebtView({
  isOpen,
  allCustomers,
  allDebtPayments,
  db,
  debtSearchQuery,
  setDebtSearchQuery,
  debtActivePage,
  setDebtActivePage,
  debtSettledPage,
  setDebtSettledPage,
  debtHistoryPage,
  setDebtHistoryPage,
  setSelectedCustomer,
  setDebtRepayAmount,
  setDebtRepayMethod,
  setActiveModal,
  setSelectedDebtPayment,
  isMobile
}) {
  const [historyDatePreset, setHistoryDatePreset] = useState('all'); // 'all' | 'today' | '7days' | 'thisMonth' | 'custom'
  const [historyStartDate, setHistoryStartDate] = useState('');
  const [historyEndDate, setHistoryEndDate] = useState('');

  if (!isOpen) return null;

  // Filter Customers by search query
  const filteredCustomers = allCustomers.filter(c => {
    if (!debtSearchQuery.trim()) return true;
    const q = debtSearchQuery.toLowerCase().trim();
    return c.name.toLowerCase().includes(q) || c.phone_number.toLowerCase().includes(q);
  });

  const activeDebtCustomers = filteredCustomers.filter(c => Number(c.total_debt || 0) > 0);
  const settledCustomers = filteredCustomers.filter(c => {
    const debt = Number(c.total_debt || 0);
    const hasDebtHistory = (allDebtPayments || []).some(p => p.customer_id === c.id) ||
      (db.get('orders') || []).some(o => o.customer_id === c.id && o.payment_method === 'DEBT');
    return debt === 0 && hasDebtHistory;
  });

  // Pagination params for Active Debt
  const activeLimit = 5;
  const activeTotalPages = Math.ceil(activeDebtCustomers.length / activeLimit) || 1;
  const currentActivePage = Math.min(debtActivePage, activeTotalPages);
  const paginatedActiveDebt = activeDebtCustomers.slice((currentActivePage - 1) * activeLimit, currentActivePage * activeLimit);

  // Pagination params for Settled Debt
  const settledLimit = 5;
  const settledTotalPages = Math.ceil(settledCustomers.length / settledLimit) || 1;
  const currentSettledPage = Math.min(debtSettledPage, settledTotalPages);
  const paginatedSettled = settledCustomers.slice((currentSettledPage - 1) * settledLimit, currentSettledPage * settledLimit);

  // Filter Debt Payments by search query & Date Range (Sorted Newest First)
  const sortedDebtPayments = allDebtPayments.slice().sort((a, b) => new Date(b.created_at || b.paid_at || 0) - new Date(a.created_at || a.paid_at || 0));

  const filteredDebtPayments = sortedDebtPayments.filter(payment => {
    const payTime = new Date(payment.created_at).getTime();
    const now = new Date();

    if (historyDatePreset === 'today') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
      if (payTime < startOfDay || payTime > endOfDay) return false;
    } else if (historyDatePreset === '7days') {
      const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6).getTime();
      if (payTime < sevenDaysAgo) return false;
    } else if (historyDatePreset === 'thisMonth') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
      if (payTime < startOfMonth) return false;
    } else if (historyDatePreset === 'custom') {
      if (historyStartDate && payTime < new Date(historyStartDate).setHours(0, 0, 0, 0)) return false;
      if (historyEndDate && payTime > new Date(historyEndDate).setHours(23, 59, 59, 999)) return false;
    }

    if (!debtSearchQuery.trim()) return true;
    const q = debtSearchQuery.toLowerCase().trim();
    const cust = allCustomers.find(c => c.id === payment.customer_id);
    const custName = cust ? cust.name.toLowerCase() : '';
    const custPhone = cust ? cust.phone_number.toLowerCase() : '';
    return custName.includes(q) || custPhone.includes(q);
  });

  const totalHistoryAmount = filteredDebtPayments.reduce((sum, p) => sum + Number(p.amount !== undefined ? p.amount : (p.amount_paid || 0)), 0);

  const historyLimit = 5;
  const historyTotalPages = Math.ceil(filteredDebtPayments.length / historyLimit) || 1;
  const currentHistoryPage = Math.min(debtHistoryPage, historyTotalPages);
  const paginatedHistory = filteredDebtPayments.slice((currentHistoryPage - 1) * historyLimit, currentHistoryPage * historyLimit);

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Title & Search Bar */}
      <div className="card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Manajemen Utang & Kasbon Pelanggan</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>Kelola saldo piutang aktif, penerimaan cicilan, dan daftar riwayat lunas.</p>
          </div>

          {/* Search Bar Pelanggan */}
          <div style={{ position: 'relative', minWidth: '260px', flex: 1, maxWidth: '400px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Cari nama / HP pelanggan..."
              value={debtSearchQuery}
              onChange={(e) => {
                setDebtSearchQuery(e.target.value);
                setDebtActivePage(1);
                setDebtSettledPage(1);
                setDebtHistoryPage(1);
              }}
              style={{ paddingLeft: '36px', paddingRight: '32px', fontSize: '13px' }}
            />
            {debtSearchQuery && (
              <button
                type="button"
                onClick={() => setDebtSearchQuery('')}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 1. BAGIAN: Daftar Piutang & Kasbon Aktif */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: 'var(--text-primary)' }}>Daftar Piutang & Kasbon Aktif</h2>
          <span className="badge warning">{activeDebtCustomers.length} Piutang Aktif</span>
        </div>

        {/* Desktop vs Mobile View */}
        {isMobile ? (
          /* Mobile View Card Grid */
          <div className="mobile-only">
            {paginatedActiveDebt.map(cust => (
              <div
                key={cust.id}
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
                    <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: 0 }}>{cust.name}</h3>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>📱 {cust.phone_number}</span>
                  </div>
                  <span className="badge warning" style={{ fontSize: '10px' }}>Piutang Aktif</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-tertiary)', padding: '10px 12px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Sisa Utang Aktif:</span>
                  <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--danger)' }}>
                    {formatRupiah(cust.total_debt)}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>Tgl Terdaftar: {new Date(cust.created_at).toLocaleDateString('id-ID')}</span>
                </div>

                <button
                  type="button"
                  className="btn btn-success"
                  style={{ width: '100%', padding: '10px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '2px' }}
                  onClick={() => {
                    setSelectedCustomer(cust);
                    setDebtRepayAmount('');
                    setDebtRepayMethod('CASH');
                    setActiveModal('repay-debt');
                  }}
                >
                  <CreditCard size={16} /> Catat Pembayaran Cicilan
                </button>
              </div>
            ))}

            {activeDebtCustomers.length === 0 && (
              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '13px' }}>
                {debtSearchQuery ? `Tidak ada piutang aktif atas nama "${debtSearchQuery}".` : 'Tidak ada piutang/kasbon aktif. Semua pelanggan dalam kondisi lunas! 🎉'}
              </div>
            )}
          </div>
        ) : (
          /* Desktop View Table */
          <div className="table-wrapper desktop-only">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ minWidth: '180px' }}>Nama Pelanggan</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Nomor HP</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Total Utang Aktif</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Tanggal Terdaftar</th>
                  <th style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>Tindakan</th>
                </tr>
              </thead>
              <tbody>
                {paginatedActiveDebt.map(cust => (
                  <tr key={cust.id}>
                    <td><strong>{cust.name}</strong></td>
                    <td style={{ whiteSpace: 'nowrap' }}>{cust.phone_number}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <span style={{
                        fontWeight: 'bold',
                        color: 'var(--danger)',
                        fontSize: '15px'
                      }}>
                        {formatRupiah(cust.total_debt)}
                      </span>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>{new Date(cust.created_at).toLocaleDateString('id-ID')}</td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        style={{ whiteSpace: 'nowrap' }}
                        onClick={() => {
                          setSelectedCustomer(cust);
                          setDebtRepayAmount('');
                          setDebtRepayMethod('CASH');
                          setActiveModal('repay-debt');
                        }}
                      >
                        <CreditCard size={14} /> Catat Pembayaran Cicilan
                      </button>
                    </td>
                  </tr>
                ))}
                {activeDebtCustomers.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      {debtSearchQuery ? `Tidak ada piutang aktif atas nama "${debtSearchQuery}".` : 'Tidak ada piutang/kasbon aktif. Semua pelanggan dalam kondisi lunas! 🎉'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Active Debt */}
        {activeTotalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--card-border)', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Halaman {currentActivePage} dari {activeTotalPages} ({activeDebtCustomers.length} Data)
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={currentActivePage === 1}
                onClick={() => setDebtActivePage(prev => Math.max(1, prev - 1))}
              >
                ‹ Sebelumnya
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={currentActivePage === activeTotalPages}
                onClick={() => setDebtActivePage(prev => Math.min(activeTotalPages, prev + 1))}
              >
                Selanjutnya ›
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. BAGIAN: Riwayat Pembayaran Cicilan */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: 'var(--text-primary)' }}>Riwayat Pembayaran Cicilan</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>Log transaksi uang masuk dari penerimaan cicilan kasbon.</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span className="badge success">Total Terkumpul: {formatRupiah(totalHistoryAmount)}</span>
            <span className="badge info">{filteredDebtPayments.length} Transaksi Cicilan</span>
          </div>
        </div>

        {/* Date Filter Bar for Debt History */}
        <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} /> Filter Tanggal Cicilan:
            </span>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`btn btn-sm ${historyDatePreset === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '11px', padding: '3px 8px' }}
                onClick={() => { setHistoryDatePreset('all'); setDebtHistoryPage(1); }}
              >
                Semua
              </button>
              <button
                type="button"
                className={`btn btn-sm ${historyDatePreset === 'today' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '11px', padding: '3px 8px' }}
                onClick={() => { setHistoryDatePreset('today'); setDebtHistoryPage(1); }}
              >
                Hari Ini
              </button>
              <button
                type="button"
                className={`btn btn-sm ${historyDatePreset === '7days' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '11px', padding: '3px 8px' }}
                onClick={() => { setHistoryDatePreset('7days'); setDebtHistoryPage(1); }}
              >
                7 Hari Terakhir
              </button>
              <button
                type="button"
                className={`btn btn-sm ${historyDatePreset === 'thisMonth' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '11px', padding: '3px 8px' }}
                onClick={() => { setHistoryDatePreset('thisMonth'); setDebtHistoryPage(1); }}
              >
                Bulan Ini
              </button>
              <button
                type="button"
                className={`btn btn-sm ${historyDatePreset === 'custom' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '11px', padding: '3px 8px' }}
                onClick={() => { setHistoryDatePreset('custom'); setDebtHistoryPage(1); }}
              >
                Custom
              </button>
            </div>

            {historyDatePreset === 'custom' && (
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="date"
                  className="form-control"
                  style={{ fontSize: '11px', padding: '2px 6px', width: 'auto' }}
                  value={historyStartDate}
                  onChange={(e) => { setHistoryStartDate(e.target.value); setDebtHistoryPage(1); }}
                />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>s/d</span>
                <input
                  type="date"
                  className="form-control"
                  style={{ fontSize: '11px', padding: '2px 6px', width: 'auto' }}
                  value={historyEndDate}
                  onChange={(e) => { setHistoryEndDate(e.target.value); setDebtHistoryPage(1); }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Desktop vs Mobile View */}
        {isMobile ? (
          /* Mobile View Card Grid */
          <div className="mobile-only">
            {paginatedHistory.map(payment => {
              const cust = allCustomers.find(c => c.id === payment.customer_id);
              const cashier = db.find('users', u => u.id === payment.cashier_id);
              return (
                <div
                  key={payment.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--card-border)',
                    backgroundColor: 'var(--card-bg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: '14px' }}>{cust ? cust.name : 'Unknown'}</strong>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {new Date(payment.created_at).toLocaleString('id-ID')}
                      </div>
                    </div>
                    <span style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--success)' }}>
                      + {formatRupiah(payment.amount !== undefined ? payment.amount : (payment.amount_paid || 0))}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px dashed var(--card-border)', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      Via: <span className="badge info" style={{ fontSize: '10px' }}>{payment.payment_method}</span> | Kasir: {cashier ? cashier.name : 'Kasir'}
                    </span>

                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '11px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      onClick={() => {
                        setSelectedDebtPayment(payment);
                        setActiveModal('debt-receipt');
                      }}
                    >
                      <Printer size={12} /> Struk
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredDebtPayments.length === 0 && (
              <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: '13px' }}>
                Belum ada riwayat cicilan pada periode ini.
              </div>
            )}
          </div>
        ) : (
          /* Desktop View Table */
          <div className="table-wrapper desktop-only">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ whiteSpace: 'nowrap' }}>Tanggal</th>
                  <th style={{ minWidth: '180px' }}>Nama Pelanggan</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Jumlah Bayar</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Metode</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Kasir Penerima</th>
                  <th style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedHistory.map(payment => {
                  const cust = allCustomers.find(c => c.id === payment.customer_id);
                  const cashier = db.find('users', u => u.id === payment.cashier_id);
                  return (
                    <tr key={payment.id}>
                      <td style={{ whiteSpace: 'nowrap' }}>{new Date(payment.created_at).toLocaleString('id-ID')}</td>
                      <td><strong>{cust ? cust.name : 'Unknown'}</strong></td>
                      <td style={{ color: 'var(--success)', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                        {formatRupiah(payment.amount !== undefined ? payment.amount : (payment.amount_paid || 0))}
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <span className="badge info">{payment.payment_method}</span>
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>{cashier ? cashier.name : 'Kasir'}</td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ whiteSpace: 'nowrap' }}
                          onClick={() => {
                            setSelectedDebtPayment(payment);
                            setActiveModal('debt-receipt');
                          }}
                        >
                          <Printer size={12} /> Struk
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredDebtPayments.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Belum ada riwayat cicilan pada periode ini.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Debt History */}
        {historyTotalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--card-border)', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Halaman {currentHistoryPage} dari {historyTotalPages} ({filteredDebtPayments.length} Data)
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={currentHistoryPage === 1}
                onClick={() => setDebtHistoryPage(prev => Math.max(1, prev - 1))}
              >
                ‹ Sebelumnya
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={currentHistoryPage === historyTotalPages}
                onClick={() => setDebtHistoryPage(prev => Math.min(historyTotalPages, prev + 1))}
              >
                Selanjutnya ›
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. BAGIAN: Daftar Pelanggan Bebas Utang */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: 'var(--text-primary)' }}>Daftar Pelanggan Bebas Utang</h2>
          <span className="badge success">{settledCustomers.length} Bebas Utang</span>
        </div>

        {/* Desktop vs Mobile View */}
        {isMobile ? (
          /* Mobile View Card Grid */
          <div className="mobile-only">
            {paginatedSettled.map(cust => (
              <div
                key={cust.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--card-border)',
                  backgroundColor: 'var(--card-bg)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 'bold', margin: 0 }}>{cust.name}</h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>📱 {cust.phone_number}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge success" style={{ fontSize: '10px' }}>Bebas Utang</span>
                </div>
              </div>
            ))}

            {settledCustomers.length === 0 && (
              <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: '13px' }}>
                Belum ada pelanggan lunas.
              </div>
            )}
          </div>
        ) : (
          /* Desktop View Table */
          <div className="table-wrapper desktop-only">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ minWidth: '180px' }}>Nama Pelanggan</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Nomor HP</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Status Utang</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Tanggal Terdaftar</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSettled.map(cust => (
                  <tr key={cust.id}>
                    <td><strong>{cust.name}</strong></td>
                    <td style={{ whiteSpace: 'nowrap' }}>{cust.phone_number}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <span className="badge success">Bebas Utang (Rp 0)</span>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>{new Date(cust.created_at).toLocaleDateString('id-ID')}</td>
                  </tr>
                ))}
                {settledCustomers.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Belum ada pelanggan lunas.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Settled Debt */}
        {settledTotalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--card-border)', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Halaman {currentSettledPage} dari {settledTotalPages} ({settledCustomers.length} Data)
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={currentSettledPage === 1}
                onClick={() => setDebtSettledPage(prev => Math.max(1, prev - 1))}
              >
                ‹ Sebelumnya
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={currentSettledPage === settledTotalPages}
                onClick={() => setDebtSettledPage(prev => Math.min(settledTotalPages, prev + 1))}
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
