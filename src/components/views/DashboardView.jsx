// src/components/views/DashboardView.jsx
import React, { useState, useEffect } from 'react';
import { TrendingUp, ShoppingCart, Package, Users, Calendar } from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';

/**
 * Komponen Tampilan Ringkasan Keuangan & Dashboard Owner
 * @param {Object} props
 * @param {boolean} props.isOpen - Status apakah tab dashboard sedang aktif dan role === OWNER
 * @param {Object} props.dashboardMetrics - Objek ringkasan metric (grossSales, totalTransactions, totalItemsSold, outstandingDebt)
 * @param {Array} props.allSales - Daftar transaksi penjualan
 * @param {Array} props.allCustomers - Daftar pelanggan
 * @param {Array} props.allMovements - Log mutasi stok
 * @param {Array} props.allVariants - Daftar seluruh varian produk
 * @param {Array} props.allProducts - Daftar seluruh produk induk
 * @param {boolean} props.isMobile - Status mode mobile
 */
export default function DashboardView({
  isOpen,
  dashboardMetrics,
  allSales,
  allCustomers,
  allMovements,
  allVariants,
  allProducts,
  isMobile
}) {
  const [datePreset, setDatePreset] = useState('all'); // 'all' | 'today' | '7days' | 'thisMonth' | 'custom'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Pagination states for dashboard tables
  const [salesPage, setSalesPage] = useState(1);
  const [movementsPage, setMovementsPage] = useState(1);

  // Reset pagination when date filter changes
  useEffect(() => {
    setSalesPage(1);
    setMovementsPage(1);
  }, [datePreset, startDate, endDate]);

  if (!isOpen) return null;

  // Filter Sales based on Date Range
  const filteredSales = allSales.filter(sale => {
    const saleTime = new Date(sale.created_at).getTime();
    const now = new Date();

    if (datePreset === 'today') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
      return saleTime >= startOfDay && saleTime <= endOfDay;
    } else if (datePreset === '7days') {
      const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6).getTime();
      return saleTime >= sevenDaysAgo;
    } else if (datePreset === 'thisMonth') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
      return saleTime >= startOfMonth;
    } else if (datePreset === 'custom') {
      if (startDate && saleTime < new Date(startDate).setHours(0, 0, 0, 0)) return false;
      if (endDate && saleTime > new Date(endDate).setHours(23, 59, 59, 999)) return false;
      return true;
    }
    return true;
  });

  // Filter Movements based on Date Range
  const filteredMovements = allMovements.filter(mov => {
    const movTime = new Date(mov.created_at).getTime();
    const now = new Date();

    if (datePreset === 'today') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
      return movTime >= startOfDay && movTime <= endOfDay;
    } else if (datePreset === '7days') {
      const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6).getTime();
      return movTime >= sevenDaysAgo;
    } else if (datePreset === 'thisMonth') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
      return movTime >= startOfMonth;
    } else if (datePreset === 'custom') {
      if (startDate && movTime < new Date(startDate).setHours(0, 0, 0, 0)) return false;
      if (endDate && movTime > new Date(endDate).setHours(23, 59, 59, 999)) return false;
      return true;
    }
    return true;
  });

  // Calculate filtered metrics
  const grossSales = filteredSales.reduce((sum, s) => sum + (s.total_amount || 0), 0);
  const totalTransactions = filteredSales.length;

  // Pagination logic for Sales
  const salesLimit = 5;
  const reversedSales = filteredSales.slice().reverse();
  const totalSalesPages = Math.ceil(reversedSales.length / salesLimit) || 1;
  const currentSalesPage = Math.min(salesPage, totalSalesPages);
  const paginatedSales = reversedSales.slice((currentSalesPage - 1) * salesLimit, currentSalesPage * salesLimit);

  // Pagination logic for Stock Movements
  const movementsLimit = 5;
  const reversedMovements = filteredMovements.slice().reverse();
  const totalMovementsPages = Math.ceil(reversedMovements.length / movementsLimit) || 1;
  const currentMovementsPage = Math.min(movementsPage, totalMovementsPages);
  const paginatedMovements = reversedMovements.slice((currentMovementsPage - 1) * movementsLimit, currentMovementsPage * movementsLimit);

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Date Filter Control Bar (Responsive) */}
      <div className="card" style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
            <Calendar size={16} /> Filter Periode Laporan:
          </span>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', width: isMobile ? '100%' : 'auto' }}>
            <button
              type="button"
              className={`btn btn-sm ${datePreset === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '20px', padding: '4px 12px', fontSize: '12px', flex: isMobile ? '1 1 auto' : 'initial' }}
              onClick={() => setDatePreset('all')}
            >
              Semua
            </button>
            <button
              type="button"
              className={`btn btn-sm ${datePreset === 'today' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '20px', padding: '4px 12px', fontSize: '12px', flex: isMobile ? '1 1 auto' : 'initial' }}
              onClick={() => setDatePreset('today')}
            >
              Hari Ini
            </button>
            <button
              type="button"
              className={`btn btn-sm ${datePreset === '7days' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '20px', padding: '4px 12px', fontSize: '12px', flex: isMobile ? '1 1 auto' : 'initial' }}
              onClick={() => setDatePreset('7days')}
            >
              7 Hari Terakhir
            </button>
            <button
              type="button"
              className={`btn btn-sm ${datePreset === 'thisMonth' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '20px', padding: '4px 12px', fontSize: '12px', flex: isMobile ? '1 1 auto' : 'initial' }}
              onClick={() => setDatePreset('thisMonth')}
            >
              Bulan Ini
            </button>
            <button
              type="button"
              className={`btn btn-sm ${datePreset === 'custom' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '20px', padding: '4px 12px', fontSize: '12px', flex: isMobile ? '1 1 auto' : 'initial' }}
              onClick={() => setDatePreset('custom')}
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
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>s/d</span>
              <input
                type="date"
                className="form-control"
                style={{ fontSize: '12px', padding: '6px 10px', flex: 1, minWidth: '120px' }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-icon-wrapper success">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Omset Penjualan (Gross)</span>
            <span className="stat-value">{formatRupiah(grossSales)}</span>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon-wrapper primary">
            <ShoppingCart size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Transaksi</span>
            <span className="stat-value">{totalTransactions} Transaksi</span>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon-wrapper warning">
            <Package size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Barang Terjual</span>
            <span className="stat-value">{dashboardMetrics?.totalItemsSold || 0} Pcs</span>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon-wrapper danger">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Piutang Kasbon Pelanggan</span>
            <span className="stat-value">{formatRupiah(dashboardMetrics?.outstandingDebt || 0)}</span>
          </div>
        </div>
      </div>

      {/* Dashboard Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px' }}>

        {/* Recent Transactions with Pagination */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h2 className="card-title" style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
                Penjualan Terbaru
              </h2>
              <span className="badge info">{reversedSales.length} Transaksi</span>
            </div>

            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ whiteSpace: 'nowrap' }}>Invoice</th>
                    <th style={{ minWidth: '130px' }}>Pelanggan</th>
                    <th style={{ whiteSpace: 'nowrap' }}>Total</th>
                    <th style={{ whiteSpace: 'nowrap' }}>Metode</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSales.map(sale => {
                    const cust = allCustomers.find(c => c.id === sale.customer_id);
                    return (
                      <tr key={sale.id}>
                        <td style={{ whiteSpace: 'nowrap' }}><strong>{sale.invoice_number}</strong></td>
                        <td>{cust ? cust.name : 'Umum (Walk-in)'}</td>
                        <td style={{ whiteSpace: 'nowrap' }}><strong>{formatRupiah(sale.total_amount)}</strong></td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <span className={`badge ${sale.payment_method === 'CASH' ? 'success' :
                            sale.payment_method === 'DEBT' ? 'danger' : 'info'
                            }`}>
                            {sale.payment_method}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {reversedSales.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)' }}>
                        Belum ada data penjualan pada periode ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls for Sales */}
          {totalSalesPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--card-border)', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Hal {currentSalesPage} dari {totalSalesPages}
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '11px', padding: '3px 8px' }}
                  disabled={currentSalesPage === 1}
                  onClick={() => setSalesPage(prev => Math.max(1, prev - 1))}
                >
                  ‹ Prev
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '11px', padding: '3px 8px' }}
                  disabled={currentSalesPage === totalSalesPages}
                  onClick={() => setSalesPage(prev => Math.min(totalSalesPages, prev + 1))}
                >
                  Next ›
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Stock Movements Log with Pagination */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h2 className="card-title" style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
                Log Mutasi Stok
              </h2>
              <span className="badge warning">{reversedMovements.length} Mutasi</span>
            </div>

            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ whiteSpace: 'nowrap' }}>Tanggal</th>
                    <th style={{ minWidth: '130px' }}>Barang</th>
                    <th style={{ whiteSpace: 'nowrap' }}>Mutasi</th>
                    <th>Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedMovements.map(mov => {
                    const variant = allVariants.find(v => v.id === mov.variant_id);
                    const prod = variant ? allProducts.find(p => p.id === variant.product_id) : null;
                    return (
                      <tr key={mov.id}>
                        <td style={{ whiteSpace: 'nowrap' }}>{new Date(mov.created_at).toLocaleDateString('id-ID')}</td>
                        <td>
                          <strong>{prod ? prod.name : 'Unknown'}</strong> ({variant ? variant.size : '-'})
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <span style={{
                            fontWeight: 'bold',
                            color: mov.quantity > 0 ? 'var(--success)' : 'var(--danger)'
                          }}>
                            {mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity}
                          </span>
                        </td>
                        <td style={{ fontSize: '12px' }}>{mov.notes}</td>
                      </tr>
                    );
                  })}
                  {reversedMovements.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)' }}>
                        Belum ada mutasi stok pada periode ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls for Stock Movements */}
          {totalMovementsPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--card-border)', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Hal {currentMovementsPage} dari {totalMovementsPages}
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '11px', padding: '3px 8px' }}
                  disabled={currentMovementsPage === 1}
                  onClick={() => setMovementsPage(prev => Math.max(1, prev - 1))}
                >
                  ‹ Prev
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '11px', padding: '3px 8px' }}
                  disabled={currentMovementsPage === totalMovementsPages}
                  onClick={() => setMovementsPage(prev => Math.min(totalMovementsPages, prev + 1))}
                >
                  Next ›
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
