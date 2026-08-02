// src/components/views/DashboardView.jsx
import React, { useState, useEffect } from 'react';
import { TrendingUp, ShoppingCart, Package, Users, Calendar, Scissors, DollarSign, Activity, Printer, Eye, CheckCircle, Clock, X } from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';
import { db } from '../../db';
import { printReport } from '../../utils/printHelper';

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
  const [workerLogsPage, setWorkerLogsPage] = useState(1);
  const [inspectWorkerLogModal, setInspectWorkerLogModal] = useState(null);

  // Reset pagination when date filter changes
  useEffect(() => {
    setSalesPage(1);
    setMovementsPage(1);
    setWorkerLogsPage(1);
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
  const grossSales = filteredSales.reduce((sum, s) => sum + Number(s.total_amount || 0), 0);
  const totalTransactions = filteredSales.length;

  // Fetch Worker Logs & Expenses for Expanded Financial Metrics
  const allWorkerLogs = db.getWorkerDailyLogs() || [];
  const allExpenses = db.getCashExpenses() || [];

  const filteredWorkerLogs = allWorkerLogs.filter(log => {
    const logTime = new Date(log.log_date || log.created_at).getTime();
    const now = new Date();
    if (datePreset === 'today') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
      return logTime >= startOfDay && logTime <= endOfDay;
    } else if (datePreset === '7days') {
      const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6).getTime();
      return logTime >= sevenDaysAgo;
    } else if (datePreset === 'thisMonth') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
      return logTime >= startOfMonth;
    } else if (datePreset === 'custom') {
      if (startDate && logTime < new Date(startDate).setHours(0, 0, 0, 0)) return false;
      if (endDate && logTime > new Date(endDate).setHours(23, 59, 59, 999)) return false;
      return true;
    }
    return true;
  });

  const filteredExpenses = allExpenses.filter(exp => {
    const expTime = new Date(exp.created_at || exp.paid_at).getTime();
    const now = new Date();
    if (datePreset === 'today') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
      return expTime >= startOfDay && expTime <= endOfDay;
    } else if (datePreset === '7days') {
      const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6).getTime();
      return expTime >= sevenDaysAgo;
    } else if (datePreset === 'thisMonth') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
      return expTime >= startOfMonth;
    } else if (datePreset === 'custom') {
      if (startDate && expTime < new Date(startDate).setHours(0, 0, 0, 0)) return false;
      if (endDate && expTime > new Date(endDate).setHours(23, 59, 59, 999)) return false;
      return true;
    }
    return true;
  });

  const allDebtPayments = db.get('debt_payments') || [];
  const filteredDebtPayments = allDebtPayments.filter(payment => {
    const payTime = new Date(payment.created_at || payment.paid_at || 0).getTime();
    const now = new Date();
    if (datePreset === 'today') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
      return payTime >= startOfDay && payTime <= endOfDay;
    } else if (datePreset === '7days') {
      const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6).getTime();
      return payTime >= sevenDaysAgo;
    } else if (datePreset === 'thisMonth') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
      return payTime >= startOfMonth;
    } else if (datePreset === 'custom') {
      if (startDate && payTime < new Date(startDate).setHours(0, 0, 0, 0)) return false;
      if (endDate && payTime > new Date(endDate).setHours(23, 59, 59, 999)) return false;
      return true;
    }
    return true;
  });

  const salesCashReceived = filteredSales.reduce((sum, s) => {
    if (s.payment_method === 'DEBT') {
      return sum + Number(s.paid_amount || 0);
    }
    return sum + Number(s.total_amount || 0);
  }, 0);

  const debtRepaymentReceived = filteredDebtPayments.reduce((sum, p) => {
    return sum + Number(p.amount !== undefined ? p.amount : (p.amount_paid || 0));
  }, 0);

  const realizedCashIn = salesCashReceived + debtRepaymentReceived;

  const pendingWorkerPayroll = filteredWorkerLogs
    .filter(l => l.status !== 'PAID')
    .reduce((sum, l) => sum + Number(l.total_daily_amount || l.total_amount || 0), 0);

  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const netCashFlow = grossSales - totalExpenses;
  const outstandingDebt = (allCustomers || []).reduce((sum, c) => sum + Number(c.total_debt || 0), 0);
  const totalActiveStock = (allVariants || []).reduce((sum, v) => sum + Number(v.stock_quantity || 0), 0);

  // Pagination logic for Sales (Sorted Newest First)
  const salesLimit = 5;
  const sortedSales = filteredSales.slice().sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  const totalSalesPages = Math.ceil(sortedSales.length / salesLimit) || 1;
  const currentSalesPage = Math.min(salesPage, totalSalesPages);
  const paginatedSales = sortedSales.slice((currentSalesPage - 1) * salesLimit, currentSalesPage * salesLimit);

  // Pagination logic for Stock Movements (Sorted Newest First)
  const movementsLimit = 5;
  const sortedMovements = filteredMovements.slice().sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  const totalMovementsPages = Math.ceil(sortedMovements.length / movementsLimit) || 1;
  const currentMovementsPage = Math.min(movementsPage, totalMovementsPages);
  const paginatedMovements = sortedMovements.slice((currentMovementsPage - 1) * movementsLimit, currentMovementsPage * movementsLimit);

  // Pagination logic for Worker Logs (Sorted Newest First)
  const workerLogsLimit = 5;
  const sortedWorkerLogs = filteredWorkerLogs.slice().sort((a, b) => new Date(b.created_at || b.log_date || 0) - new Date(a.created_at || a.log_date || 0));
  const totalWorkerLogsPages = Math.ceil(sortedWorkerLogs.length / workerLogsLimit) || 1;
  const currentWorkerLogsPage = Math.min(workerLogsPage, totalWorkerLogsPages);
  const paginatedWorkerLogs = sortedWorkerLogs.slice((currentWorkerLogsPage - 1) * workerLogsLimit, currentWorkerLogsPage * workerLogsLimit);

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

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ marginLeft: isMobile ? '0' : 'auto', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}
            onClick={() => {
              const reportHtml = `
                <div class="summary-box">
                  <div class="stat-card">
                    <div class="stat-label">Omset Penjualan (Gross)</div>
                    <div class="stat-value">${formatRupiah(grossSales)}</div>
                    <div style="font-size:11px;color:#64748b;">${totalTransactions} Transaksi</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-label">Total Pengeluaran Kas</div>
                    <div class="stat-value" style="color:#dc2626;">${formatRupiah(totalExpenses)}</div>
                    <div style="font-size:11px;color:#64748b;">Pencairan Gaji & Kas</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-label">Penerimaan Kas Real (Terbayar)</div>
                    <div class="stat-value" style="color:#10b981;">${formatRupiah(realizedCashIn)}</div>
                    <div style="font-size:11px;color:#64748b;">Total Tunai/DP & Cicilan Masuk</div>
                  </div>
                </div>

                <h4 style="margin-top:20px;margin-bottom:8px;font-size:14px;color:#0f172a;">Ringkasan Indikator Operasional</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Metrik Operasional Toko</th>
                      <th class="text-right">Nilai / Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Estimasi Upah Penjahit (Pending Approval)</td>
                      <td class="text-right bold" style="color:#9333ea;">${formatRupiah(pendingWorkerPayroll)}</td>
                    </tr>
                    <tr>
                      <td>Total Piutang Kasbon Pelanggan</td>
                      <td class="text-right bold" style="color:#ea580c;">${formatRupiah(outstandingDebt)}</td>
                    </tr>
                    <tr>
                      <td>Total Stok Fisik Barang Ready Toko</td>
                      <td class="text-right bold" style="color:#0284c7;">${totalActiveStock} Pcs (${allVariants.length} Varian Produk)</td>
                    </tr>
                  </tbody>
                </table>

                <h4 style="margin-top:24px;margin-bottom:8px;font-size:14px;color:#0f172a;">Daftar Transaksi Penjualan Terbaru (${sortedSales.length} Transaksi)</h4>
                <table>
                  <thead>
                    <tr>
                      <th>No. Nota / Invoice</th>
                      <th>Tanggal Transaksi</th>
                      <th>Metode Bayar</th>
                      <th class="text-right">Total Tagihan</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${sortedSales.slice(0, 20).map(sale => `
                      <tr>
                        <td class="bold">${sale.invoice_number || sale.id}</td>
                        <td>${new Date(sale.created_at).toLocaleString('id-ID')}</td>
                        <td>${sale.payment_method || 'CASH'}</td>
                        <td class="text-right bold">${formatRupiah(sale.total_amount)}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              `;
              printReport('Laporan Ringkasan Keuangan & Operasional', reportHtml);
            }}
          >
            <Printer size={14} /> Cetak / Export PDF Laporan
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="stats-grid">
        {/* 1. Gross Revenue */}
        <div className="card stat-card">
          <div className="stat-icon-wrapper success">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Omset Penjualan (Gross)</span>
            <span className="stat-value">{formatRupiah(grossSales)}</span>
            <small style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{totalTransactions} Transaksi</small>
          </div>
        </div>

        {/* 2. Pending Worker Payroll */}
        <div className="card stat-card">
          <div className="stat-icon-wrapper warning" style={{ backgroundColor: 'rgba(168, 85, 247, 0.15)', color: '#9333ea' }}>
            <Scissors size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Estimasi Upah Penjahit</span>
            <span className="stat-value" style={{ color: '#9333ea' }}>{formatRupiah(pendingWorkerPayroll)}</span>
            <small style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Pending Pencairan</small>
          </div>
        </div>

        {/* 3. Total Expenses */}
        <div className="card stat-card">
          <div className="stat-icon-wrapper danger">
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Pengeluaran Kas</span>
            <span className="stat-value" style={{ color: 'var(--danger)' }}>{formatRupiah(totalExpenses)}</span>
            <small style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Pencairan Gaji & Kas</small>
          </div>
        </div>

        {/* 4. Realized Cash In (Total Terbayar) */}
        <div className="card stat-card">
          <div className="stat-icon-wrapper primary" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Penerimaan Kas Real (Terbayar)</span>
            <span className="stat-value" style={{ color: '#10b981' }}>
              {formatRupiah(realizedCashIn)}
            </span>
            <small style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {formatRupiah(salesCashReceived)} (Sales) {debtRepaymentReceived > 0 ? `+ ${formatRupiah(debtRepaymentReceived)} (Cicilan)` : ''}
            </small>
          </div>
        </div>

        {/* 5. Outstanding Debt */}
        <div className="card stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(249, 115, 22, 0.15)', color: '#f97316' }}>
            <Users size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Piutang Kasbon Pelanggan</span>
            <span className="stat-value">{formatRupiah(outstandingDebt)}</span>
            <small style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Sisa Kasbon</small>
          </div>
        </div>

        {/* 6. Active Inventory Stock */}
        <div className="card stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(14, 165, 233, 0.15)', color: '#0ea5e9' }}>
            <Package size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Stok Barang Toko</span>
            <span className="stat-value">{totalActiveStock} Pcs</span>
            <small style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{allVariants.length} Varian Produk</small>
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
              <span className="badge info">{sortedSales.length} Transaksi</span>
            </div>

            {isMobile ? (
              /* Mobile View Cards for Penjualan Terbaru */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {paginatedSales.map(sale => {
                  const cust = allCustomers.find(c => c.id === sale.customer_id);
                  return (
                    <div
                      key={sale.id}
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid var(--card-border)',
                        backgroundColor: 'var(--bg-tertiary)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '14px', color: 'var(--primary)' }}>{sale.invoice_number}</strong>
                        <span className={`badge ${sale.payment_method === 'CASH' ? 'success' :
                          sale.payment_method === 'DEBT' ? 'danger' : 'info'
                          }`}>
                          {sale.payment_method}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          Pelanggan: <strong>{cust ? cust.name : 'Umum (Walk-in)'}</strong>
                        </span>
                        <strong style={{ color: 'var(--success)', fontSize: '14px' }}>
                          {formatRupiah(sale.total_amount)}
                        </strong>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        🗓️ {new Date(sale.created_at).toLocaleString('id-ID')}
                      </div>
                    </div>
                  );
                })}
                {sortedSales.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: '13px' }}>
                    Belum ada data penjualan pada periode ini.
                  </div>
                )}
              </div>
            ) : (
              /* Desktop Table View for Penjualan Terbaru */
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
                    {sortedSales.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)' }}>
                          Belum ada data penjualan pada periode ini.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
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
              <span className="badge warning">{sortedMovements.length} Mutasi</span>
            </div>

            {isMobile ? (
              /* Mobile View Cards for Stock Movements */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {paginatedMovements.map(mov => {
                  const variant = allVariants.find(v => v.id === mov.variant_id);
                  const prod = variant ? allProducts.find(p => p.id === variant.product_id) : null;
                  return (
                    <div
                      key={mov.id}
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid var(--card-border)',
                        backgroundColor: 'var(--bg-tertiary)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '14px' }}>{prod ? prod.name : 'Unknown'}</strong>
                        <span style={{
                          fontWeight: 'bold',
                          fontSize: '13px',
                          color: mov.quantity > 0 ? 'var(--success)' : 'var(--danger)',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          backgroundColor: mov.quantity > 0 ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)'
                        }}>
                          {mov.quantity > 0 ? `+${mov.quantity} Pcs` : `${mov.quantity} Pcs`}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <span>Ukuran / Warna: <strong>{variant ? `${variant.size || '-'}${variant.color ? ` (${variant.color})` : ''}` : '-'}</strong></span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          🗓️ {new Date(mov.created_at).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      {mov.notes && (
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic', borderTop: '1px dashed var(--card-border)', paddingTop: '4px', marginTop: '2px' }}>
                          Catatan: {mov.notes}
                        </div>
                      )}
                    </div>
                  );
                })}
                {sortedMovements.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: '13px' }}>
                    Belum ada mutasi stok pada periode ini.
                  </div>
                )}
              </div>
            ) : (
              /* Desktop Table View for Stock Movements */
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
                    {sortedMovements.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)' }}>
                          Belum ada mutasi stok pada periode ini.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
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

        {/* 3. Latest Worker Daily Log Inputs Table Card */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Scissors size={18} style={{ color: '#9333ea' }} /> Log Input Hasil Kerja Penjahit Terbaru
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {sortedWorkerLogs.length} Entri Disetor
            </span>
          </div>

          {isMobile ? (
            /* Mobile Card View for Worker Logs */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {paginatedWorkerLogs.map(log => {
                const totalAmt = Number(log.total_daily_amount || log.total_amount || 0);
                const isPaid = log.status === 'PAID';
                return (
                  <div key={log.id} style={{
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--card-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '13px', color: 'var(--text-primary)' }}>
                        {log.worker_name || 'Penjahit'}
                      </span>
                      <span className={`badge ${isPaid ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '10px', padding: '2px 8px' }}>
                        {isPaid ? 'LUNAS / DICAIRKAN' : 'PENDING'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <span>🗓️ {new Date(log.created_at || log.log_date).toLocaleDateString('id-ID')}</span>
                      <span style={{ fontWeight: 'bold', color: '#9333ea' }}>{formatRupiah(totalAmt)}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px', borderTop: '1px dashed var(--card-border)' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {log.items?.length || 0} Item Pekerjaan
                      </span>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '11px', padding: '2px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                        onClick={() => setInspectWorkerLogModal(log)}
                      >
                        <Eye size={12} /> Detail
                      </button>
                    </div>
                  </div>
                );
              })}
              {sortedWorkerLogs.length === 0 && (
                <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: '13px' }}>
                  Belum ada log input hasil kerja penjahit pada periode ini.
                </div>
              )}
            </div>
          ) : (
            /* Desktop Table View for Worker Logs */
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ whiteSpace: 'nowrap' }}>Waktu Submit</th>
                    <th>Nama Penjahit</th>
                    <th className="text-right">Total Upah</th>
                    <th style={{ whiteSpace: 'nowrap' }}>Status Gaji</th>
                    <th style={{ textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedWorkerLogs.map(log => {
                    const totalAmt = Number(log.total_daily_amount || log.total_amount || 0);
                    const isPaid = log.status === 'PAID';
                    return (
                      <tr key={log.id}>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          {new Date(log.created_at || log.log_date).toLocaleString('id-ID')}
                        </td>
                        <td>
                          <strong>{log.worker_name || 'Penjahit'}</strong>
                        </td>
                        <td className="text-right bold" style={{ color: '#9333ea' }}>
                          {formatRupiah(totalAmt)}
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <span className={`badge ${isPaid ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '11px', padding: '3px 8px' }}>
                            {isPaid ? 'LUNAS / DICAIRKAN' : 'PENDING (Belum Dicairkan)'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '11px', padding: '2px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            onClick={() => setInspectWorkerLogModal(log)}
                          >
                            <Eye size={12} /> Detail
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {sortedWorkerLogs.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)' }}>
                        Belum ada log input hasil kerja penjahit pada periode ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls for Worker Logs */}
          {totalWorkerLogsPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--card-border)', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Hal {currentWorkerLogsPage} dari {totalWorkerLogsPages}
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '11px', padding: '3px 8px' }}
                  disabled={currentWorkerLogsPage === 1}
                  onClick={() => setWorkerLogsPage(prev => Math.max(1, prev - 1))}
                >
                  ‹ Prev
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '11px', padding: '3px 8px' }}
                  disabled={currentWorkerLogsPage === totalWorkerLogsPages}
                  onClick={() => setWorkerLogsPage(prev => Math.min(totalWorkerLogsPages, prev + 1))}
                >
                  Next ›
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Detail Worker Log Inspect Modal */}
      {inspectWorkerLogModal && (
        <div className="modal-backdrop" onClick={() => setInspectWorkerLogModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', width: '95%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--card-border)', paddingBottom: '12px', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Scissors size={18} style={{ color: '#9333ea' }} /> Detail Log Hasil Kerja Penjahit
              </h3>
              <button type="button" className="btn-icon" onClick={() => setInspectWorkerLogModal(null)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderBottom: '1px dashed var(--card-border)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Penjahit:</span>
                <strong>{inspectWorkerLogModal.worker_name || 'Penjahit'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderBottom: '1px dashed var(--card-border)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Waktu Submit:</span>
                <span>{new Date(inspectWorkerLogModal.created_at || inspectWorkerLogModal.log_date).toLocaleString('id-ID')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderBottom: '1px dashed var(--card-border)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Status Pencairan:</span>
                <span className={`badge ${inspectWorkerLogModal.status === 'PAID' ? 'badge-success' : 'badge-warning'}`}>
                  {inspectWorkerLogModal.status === 'PAID' ? 'LUNAS / DICAIRKAN' : 'PENDING'}
                </span>
              </div>

              <h4 style={{ margin: '8px 0 4px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>Tabel Detail Log Hasil Kerja Penjahit:</h4>
              <div className="table-wrapper" style={{ margin: '4px 0' }}>
                <table className="table" style={{ width: '100%', fontSize: '12px' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'center', width: '40px' }}>No</th>
                      <th style={{ textAlign: 'left' }}>Jenis Pekerjaan / Item</th>
                      <th style={{ textAlign: 'center' }}>Qty</th>
                      <th style={{ textAlign: 'right' }}>Tarif / Pcs</th>
                      <th style={{ textAlign: 'right' }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(inspectWorkerLogModal.items || []).map((it, idx) => (
                      <tr key={it.id || idx}>
                        <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                        <td><strong>{it.item_name || 'Pekerjaan Borongan'}</strong></td>
                        <td style={{ textAlign: 'center' }}>{it.quantity} Pcs</td>
                        <td style={{ textAlign: 'right' }}>{formatRupiah(it.rate_per_unit)}</td>
                        <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#9333ea' }}>
                          {formatRupiah(it.subtotal || (it.quantity * it.rate_per_unit))}
                        </td>
                      </tr>
                    ))}
                    {(!inspectWorkerLogModal.items || inspectWorkerLogModal.items.length === 0) && (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '12px', color: 'var(--text-muted)' }}>
                          Belum ada rincian item pekerjaan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '12px', borderTop: '2px solid var(--card-border)', fontSize: '14px', fontWeight: 'bold' }}>
                <span>Total Upah Borongan:</span>
                <span style={{ color: '#9333ea', fontSize: '16px' }}>
                  {formatRupiah(inspectWorkerLogModal.total_daily_amount || inspectWorkerLogModal.total_amount || 0)}
                </span>
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setInspectWorkerLogModal(null)}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
