// src/components/views/PayrollDisbursementView.jsx
import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Users,
  Eye,
  Printer,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';
import { db } from '../../db';

/**
 * Komponen Tampilan Rekap & Pencairan Gaji Bulanan Penjahit (Owner View)
 * @param {Object} props
 * @param {boolean} props.isOpen - Status apakah tab rekap gaji owner aktif
 * @param {Object} props.currentUser - Data Owner yang sedang login
 * @param {Function} props.showToast - Notifikasi toast
 * @param {Function} props.askConfirmation - Modal konfirmasi
 * @param {Function} props.setRefreshKey - Refresh trigger data app
 * @param {Function} props.setPrintPayrollData - Callback untuk memicu modal cetak slip gaji
 * @param {boolean} props.isMobile - Status mode mobile
 */
export default function PayrollDisbursementView({
  isOpen,
  currentUser,
  showToast,
  askConfirmation,
  setRefreshKey,
  setPrintPayrollData,
  isMobile
}) {
  // Month State (Default: Current Year-Month "YYYY-MM")
  const [selectedMonthYear, setSelectedMonthYear] = useState(() => new Date().toISOString().slice(0, 7));

  // Detail Modal State
  const [inspectWorkerModal, setInspectWorkerModal] = useState(null); // { worker, logs, pendingTotal }

  // Pagination State
  const ITEMS_PER_PAGE = 5;
  const [workerPage, setWorkerPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);

  // Reset page numbers when month changes
  useEffect(() => {
    setWorkerPage(1);
    setHistoryPage(1);
  }, [selectedMonthYear]);

  if (!isOpen) return null;

  // Fetch Data
  const users = db.get('users') || [];
  const workers = users.filter(u => u.role === 'WORKER');
  const allLogs = db.getWorkerDailyLogs(null, selectedMonthYear);
  const disbursements = db.getPayrollDisbursements(selectedMonthYear);

  // Aggregate stats per worker for the selected month
  const workerSummaries = workers.map(w => {
    const workerMonthLogs = allLogs.filter(l => l.worker_id === w.id);
    const pendingLogs = workerMonthLogs.filter(l => l.status !== 'PAID');
    const paidLogs = workerMonthLogs.filter(l => l.status === 'PAID');

    const pendingTotal = pendingLogs.reduce((sum, l) => sum + Number(l.total_daily_amount), 0);
    const paidTotal = paidLogs.reduce((sum, l) => sum + Number(l.total_daily_amount), 0);

    return {
      worker: w,
      totalLogsCount: workerMonthLogs.length,
      pendingLogsCount: pendingLogs.length,
      pendingTotal,
      paidTotal,
      logs: workerMonthLogs
    };
  });

  // Calculate Overall Monthly Stats
  const totalPendingMonth = workerSummaries.reduce((sum, s) => sum + s.pendingTotal, 0);
  const totalDisbursedMonth = disbursements.reduce((sum, d) => sum + Number(d.total_amount), 0);

  // Paginated Worker Summaries
  const totalWorkerPages = Math.max(1, Math.ceil(workerSummaries.length / ITEMS_PER_PAGE));
  const paginatedWorkerSummaries = workerSummaries.slice(
    (workerPage - 1) * ITEMS_PER_PAGE,
    workerPage * ITEMS_PER_PAGE
  );

  // Paginated Disbursements History
  const totalHistoryPages = Math.max(1, Math.ceil(disbursements.length / ITEMS_PER_PAGE));
  const paginatedDisbursements = disbursements.slice(
    (historyPage - 1) * ITEMS_PER_PAGE,
    historyPage * ITEMS_PER_PAGE
  );

  // Handle Approve & Disburse Payroll
  const handleApprovePayroll = (summary) => {
    if (summary.pendingTotal <= 0) {
      showToast('Tidak ada sisa gaji pending yang perlu dicairkan untuk penjahit ini.', 'danger');
      return;
    }

    askConfirmation({
      title: 'Pencairan Gaji',
      message: `Konfirmasi pencairan gaji sebesar ${formatRupiah(summary.pendingTotal)} untuk ${summary.worker.name}? Saldo kas toko akan otomatis terpotong.`,
      confirmText: 'Ya, Cairkan & Potong Kas',
      confirmVariant: 'primary',
      onConfirm: () => {
        const res = db.approveAndDisbursePayroll(
          summary.worker.id,
          selectedMonthYear,
          currentUser ? currentUser.id : 'u-1'
        );

        if (res.success) {
          showToast(`Gaji ${summary.worker.name} sebesar ${formatRupiah(summary.pendingTotal)} berhasil dicairkan & kas terpotong!`);
          if (setRefreshKey) setRefreshKey(prev => prev + 1);

          // If print callback provided, trigger slip modal
          if (setPrintPayrollData) {
            setPrintPayrollData({
              disbursement: res.disbursement,
              worker: summary.worker,
              monthYear: selectedMonthYear,
              logs: summary.logs
            });
          }
        } else {
          showToast(res.message || 'Gagal memproses pencairan gaji.', 'danger');
        }
      }
    });
  };

  return (
    <div className="view-container" style={{ padding: isMobile ? '12px' : '24px' }}>
      {/* Dashboard Title & Month Picker */}
      <div
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justify: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: '12px',
          marginBottom: '20px'
        }}
      >
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <DollarSign size={24} style={{ color: 'var(--primary)' }} />
            Rekap & Pencairan Gaji
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '4px 0 0 0' }}>
            Verifikasi laporan harian, persetujuan gaji bulanan & pemotongan kas otomatis
          </p>
        </div>

        {/* Month Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: isMobile ? '100%' : 'auto' }}>
          <Calendar size={18} style={{ color: 'var(--primary)' }} />
          <span style={{ fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Bulan:</span>
          <input
            type="month"
            className="form-control"
            style={{ fontWeight: 'bold', minWidth: '150px' }}
            value={selectedMonthYear}
            onChange={(e) => setSelectedMonthYear(e.target.value)}
          />
        </div>
      </div>

      {/* OVERALL MONTHLY METRICS (3 CARDS) */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div
          className="card"
          style={{
            padding: '16px 20px',
            borderRadius: '12px',
            borderLeft: '4px solid var(--warning)',
            background: 'var(--bg-secondary)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Pending Pencairan</span>
            <Clock size={20} style={{ color: 'var(--warning)' }} />
          </div>
          <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--warning)', margin: '2px 0 0 0' }}>
            {formatRupiah(totalPendingMonth)}
          </h3>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Akumulasi gaji belum dicairkan</span>
        </div>

        <div
          className="card"
          style={{
            padding: '16px 20px',
            borderRadius: '12px',
            borderLeft: '4px solid var(--success)',
            background: 'var(--bg-secondary)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Total Gaji Dicairkan</span>
            <CheckCircle size={20} style={{ color: 'var(--success)' }} />
          </div>
          <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--success)', margin: '2px 0 0 0' }}>
            {formatRupiah(totalDisbursedMonth)}
          </h3>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Status lunas bulan {selectedMonthYear}</span>
        </div>

        <div
          className="card"
          style={{
            padding: '16px 20px',
            borderRadius: '12px',
            borderLeft: '4px solid var(--danger)',
            background: 'var(--bg-secondary)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Transaksi & Potong Kas</span>
            <TrendingDown size={20} style={{ color: 'var(--danger)' }} />
          </div>
          <h3 style={{ fontSize: '22px', fontWeight: 'bold', margin: '2px 0 0 0', color: 'var(--text-primary)' }}>
            {disbursements.length} <span style={{ fontSize: '14px', fontWeight: 'normal', color: 'var(--text-muted)' }}>Pencairan</span>
          </h3>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Otomatis potong pengeluaran kas</span>
        </div>
      </div>

      {/* REKAP GAJI PER PENJAHIT */}
      <div className="card" style={{ padding: isMobile ? '14px' : '20px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={18} style={{ color: 'var(--primary)' }} />
          Status Gaji Penjahit Periode {selectedMonthYear}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {paginatedWorkerSummaries.map(s => (
            <div
              key={s.worker.id}
              style={{
                padding: '16px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                background: 'var(--bg-card-subtle, rgba(0,0,0,0.01))'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  justify: 'space-between',
                  alignItems: isMobile ? 'flex-start' : 'center',
                  gap: '12px'
                }}
              >
                {/* Worker Profile */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: 'var(--primary)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '18px'
                    }}
                  >
                    {s.worker.name.charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 2px 0' }}>{s.worker.name}</h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Total {s.totalLogsCount} hari dilaporkan | {s.pendingLogsCount} hari belum dicairkan
                    </span>
                  </div>
                </div>

                {/* Amount & Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: isMobile ? '100%' : 'auto', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Gaji Pending:</span>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: s.pendingTotal > 0 ? 'var(--warning)' : 'var(--success)' }}>
                      {formatRupiah(s.pendingTotal)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setInspectWorkerModal(s)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}
                    >
                      <Eye size={14} /> Detail
                    </button>

                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      disabled={s.pendingTotal <= 0}
                      onClick={() => handleApprovePayroll(s)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}
                    >
                      <CheckCircle size={14} /> Setujui
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Worker Summary Pagination Control */}
        {totalWorkerPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', flexWrap: 'wrap', gap: '8px', borderTop: '1px solid var(--card-border)', paddingTop: '12px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Menampilkan {paginatedWorkerSummaries.length} dari {workerSummaries.length} penjahit (Halaman {workerPage} dari {totalWorkerPages})
            </span>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={workerPage === 1}
                onClick={() => setWorkerPage(prev => Math.max(1, prev - 1))}
                style={{ padding: '4px 10px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <span style={{ fontSize: '12px', fontWeight: 'bold', padding: '0 4px' }}>
                {workerPage} / {totalWorkerPages}
              </span>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={workerPage >= totalWorkerPages}
                onClick={() => setWorkerPage(prev => Math.min(totalWorkerPages, prev + 1))}
                style={{ padding: '4px 10px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* RIWAYAT PENCAIRAN GAJI */}
      <div className="card" style={{ padding: isMobile ? '14px' : '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={18} style={{ color: 'var(--primary)' }} />
          Riwayat Transaksi Pencairan Gaji ({selectedMonthYear})
        </h3>

        {disbursements.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
            <FileText size={36} style={{ opacity: 0.3, marginBottom: '8px' }} />
            <p>Belum ada transaksi pencairan gaji di bulan {selectedMonthYear}.</p>
          </div>
        ) : isMobile ? (
          /* Mobile Card View (No Horizontal Scroll) */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {paginatedDisbursements.map(d => {
              const workerObj = workers.find(w => w.id === d.worker_id) || { name: d.worker_name };
              return (
                <div
                  key={d.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1px solid var(--card-border)',
                    borderLeft: '4px solid var(--success)',
                    background: 'var(--bg-secondary)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary)', background: 'var(--primary-light)', padding: '2px 6px', borderRadius: '4px' }}>
                        {d.payroll_number}
                      </span>
                      <h4 style={{ fontSize: '15px', fontWeight: '700', margin: '4px 0 0 0', color: 'var(--text-primary)' }}>
                        {d.worker_name}
                      </h4>
                    </div>

                    <button
                      type="button"
                      className="btn btn-secondary btn-sm btn-icon"
                      onClick={() => {
                        if (setPrintPayrollData) {
                          setPrintPayrollData({
                            disbursement: d,
                            worker: workerObj,
                            monthYear: d.month_year,
                            logs: db.getWorkerDailyLogs(d.worker_id, d.month_year)
                          });
                        }
                      }}
                      title="Cetak Slip Gaji"
                      style={{ width: '36px', height: '36px' }}
                    >
                      <Printer size={16} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid var(--card-border)', paddingTop: '8px', marginTop: '6px', fontSize: '12px' }}>
                    <div style={{ color: 'var(--text-secondary)' }}>
                      <div>Periode: <strong>{d.month_year}</strong></div>
                      <div>ACC oleh: <strong>{d.approver_name}</strong></div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>Total Dicairkan</span>
                      <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--success)' }}>
                        {formatRupiah(d.total_amount)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Desktop Table View */
          <div className="table-responsive">
            <table className="table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>No. Slip Gaji</th>
                  <th>Nama Penjahit</th>
                  <th>Periode Bulan</th>
                  <th>Disetujui Oleh</th>
                  <th style={{ textAlign: 'right' }}>Total Dicairkan</th>
                  <th style={{ textAlign: 'center' }}>Cetak Slip</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDisbursements.map(d => {
                  const workerObj = workers.find(w => w.id === d.worker_id) || { name: d.worker_name };
                  return (
                    <tr key={d.id}>
                      <td style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{d.payroll_number}</td>
                      <td>{d.worker_name}</td>
                      <td>{d.month_year}</td>
                      <td>{d.approver_name}</td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold', color: 'var(--success)' }}>
                        {formatRupiah(d.total_amount)}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm btn-icon"
                          onClick={() => {
                            if (setPrintPayrollData) {
                              setPrintPayrollData({
                                disbursement: d,
                                worker: workerObj,
                                monthYear: d.month_year,
                                logs: db.getWorkerDailyLogs(d.worker_id, d.month_year)
                              });
                            }
                          }}
                          title="Cetak Slip Gaji"
                        >
                          <Printer size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* History Pagination Control */}
        {totalHistoryPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', flexWrap: 'wrap', gap: '8px', borderTop: '1px solid var(--card-border)', paddingTop: '12px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Menampilkan {paginatedDisbursements.length} dari {disbursements.length} transaksi (Halaman {historyPage} dari {totalHistoryPages})
            </span>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={historyPage === 1}
                onClick={() => setHistoryPage(prev => Math.max(1, prev - 1))}
                style={{ padding: '4px 10px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <span style={{ fontSize: '12px', fontWeight: 'bold', padding: '0 4px' }}>
                {historyPage} / {totalHistoryPages}
              </span>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={historyPage >= totalHistoryPages}
                onClick={() => setHistoryPage(prev => Math.min(totalHistoryPages, prev + 1))}
                style={{ padding: '4px 10px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DETAIL LOG HARIAN WORKER */}
      {inspectWorkerModal && (
        <div className="modal-overlay" onClick={() => setInspectWorkerModal(null)}>
          <div className="modal-content" style={{ maxWidth: '600px', width: '100%', padding: isMobile ? '16px' : '24px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: 'bold', margin: 0 }}>
                Rincian Kerja: {inspectWorkerModal.worker.name} ({selectedMonthYear})
              </h3>
              <button type="button" className="btn btn-icon" onClick={() => setInspectWorkerModal(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ marginTop: '12px', maxHeight: '70vh', overflowY: 'auto' }}>
              {inspectWorkerModal.logs.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
                  Tidak ada laporan harian pada bulan {selectedMonthYear}.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {inspectWorkerModal.logs.map(log => (
                    <div
                      key={log.id}
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid var(--card-border)',
                        background: 'var(--bg-tertiary)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '13px' }}>📅 {log.log_date}</span>
                        {log.status === 'PAID' ? (
                          <span className="badge badge-success" style={{ fontSize: '10px' }}>Lunas / Paid</span>
                        ) : (
                          <span className="badge badge-warning" style={{ fontSize: '10px' }}>Pending Approval</span>
                        )}
                      </div>

                      <div className="table-responsive">
                        <table className="table" style={{ width: '100%', fontSize: '12px' }}>
                          <thead>
                            <tr>
                              <th>Item Pekerjaan</th>
                              <th style={{ textAlign: 'center' }}>Qty</th>
                              <th style={{ textAlign: 'right' }}>Tarif</th>
                              <th style={{ textAlign: 'right' }}>Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {log.items && log.items.map(it => (
                              <tr key={it.id}>
                                <td>
                                  <div style={{ fontWeight: '600' }}>{it.item_name}</div>
                                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{it.product_name}</div>
                                </td>
                                <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>{it.quantity} Pcs</td>
                                <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>{formatRupiah(it.rate_per_unit)}</td>
                                <td style={{ textAlign: 'right', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{formatRupiah(it.subtotal)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div style={{ textAlign: 'right', marginTop: '6px', fontWeight: 'bold', fontSize: '13px', color: 'var(--primary)' }}>
                        Total Hari Ini: {formatRupiah(log.total_daily_amount)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-footer" style={{ marginTop: '16px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '10px' : '0', justifyContent: 'space-between', alignItems: isMobile ? 'stretch' : 'center' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Pending untuk dicairkan: </span>
                <strong style={{ color: 'var(--warning)', fontSize: '15px' }}>
                  {formatRupiah(inspectWorkerModal.pendingTotal)}
                </strong>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" className="btn btn-secondary btn-sm" style={{ flex: isMobile ? 1 : 'none' }} onClick={() => setInspectWorkerModal(null)}>
                  Tutup
                </button>
                {inspectWorkerModal.pendingTotal > 0 && (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    style={{ flex: isMobile ? 1 : 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}
                    onClick={() => {
                      const summary = inspectWorkerModal;
                      setInspectWorkerModal(null);
                      handleApprovePayroll(summary);
                    }}
                  >
                    <CheckCircle size={14} /> Setujui
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
