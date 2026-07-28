// src/components/views/WorkerDailyLogView.jsx
import React, { useState } from 'react';
import { Calendar, Plus, Trash2, CheckCircle2, Clock, FileText, Send, X, Layers } from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';
import { db } from '../../db';

/**
 * Komponen Tampilan Mobile-First Input Laporan Hasil Kerja Harian Penjahit (Worker View)
 * @param {Object} props
 * @param {boolean} props.isOpen - Status apakah tab log harian worker sedang aktif
 * @param {Object} props.currentUser - Data penjahit yang sedang login
 * @param {Function} props.showToast - Notifikasi toast
 * @param {Function} props.setRefreshKey - Refresh trigger data app
 * @param {boolean} props.isMobile - Status mode mobile
 */
export default function WorkerDailyLogView({
  isOpen,
  currentUser,
  showToast,
  setRefreshKey,
  isMobile
}) {
  // Form State
  const [logDate, setLogDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [entryItems, setEntryItems] = useState([
    { piece_rate_item_id: '', quantity: '1', rate_per_unit: 0 }
  ]);

  // Selected Log Detail Modal State
  const [selectedLogDetail, setSelectedLogDetail] = useState(null);

  if (!isOpen) return null;

  // Fetch Master Piece Rate Items & Worker's Daily Logs
  const masterItems = db.getPieceRateItems();
  const workerLogs = currentUser ? db.getWorkerDailyLogs(currentUser.id) : [];

  // Calculate Worker Stats
  const pendingLogs = workerLogs.filter(l => l.status === 'PENDING');
  const paidLogs = workerLogs.filter(l => l.status === 'PAID');

  const pendingAmount = pendingLogs.reduce((sum, l) => sum + Number(l.total_daily_amount), 0);
  const paidAmount = paidLogs.reduce((sum, l) => sum + Number(l.total_daily_amount), 0);

  // Form Handlers
  const handleItemChange = (index, field, value) => {
    const updated = [...entryItems];
    if (field === 'piece_rate_item_id') {
      const selectedMaster = masterItems.find(m => m.id === value);
      updated[index] = {
        ...updated[index],
        piece_rate_item_id: value,
        rate_per_unit: selectedMaster ? Number(selectedMaster.rate_price) : 0
      };
    } else if (field === 'quantity') {
      updated[index] = {
        ...updated[index],
        quantity: value
      };
    }
    setEntryItems(updated);
  };

  const handleAddRow = () => {
    setEntryItems([
      ...entryItems,
      { piece_rate_item_id: '', quantity: '1', rate_per_unit: 0 }
    ]);
  };

  const handleRemoveRow = (index) => {
    if (entryItems.length === 1) {
      showToast('Minimal 1 item pekerjaan untuk dilaporkan.', 'danger');
      return;
    }
    setEntryItems(entryItems.filter((_, idx) => idx !== index));
  };

  // Calculate Batch Total
  const calculatedBatchTotal = entryItems.reduce((acc, curr) => {
    const qty = Number(curr.quantity) || 0;
    const rate = Number(curr.rate_per_unit) || 0;
    return acc + (qty * rate);
  }, 0);

  // Submit Handler
  const handleSubmitLog = (e) => {
    e.preventDefault();
    if (!currentUser) return;

    // Validate Items
    const validItems = entryItems.filter(
      it => it.piece_rate_item_id && Number(it.quantity) > 0 && Number(it.rate_per_unit) > 0
    );

    if (validItems.length === 0) {
      showToast('Pilih jenis pekerjaan dan masukkan kuantitas yang valid.', 'danger');
      return;
    }

    db.addWorkerDailyLog(currentUser.id, logDate, validItems);
    showToast('Laporan hasil kerja harian berhasil dikirim!');

    // Reset Form
    setEntryItems([{ piece_rate_item_id: '', quantity: '1', rate_per_unit: 0 }]);
    if (setRefreshKey) setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="view-container" style={{ padding: isMobile ? '12px' : '24px' }}>
      {/* Header Profile Info */}
      <div
        className="card"
        style={{
          padding: '16px',
          marginBottom: '20px',
          background: 'linear-gradient(135deg, var(--primary) 0%, #1d4ed8 100%)',
          color: '#ffffff',
          borderRadius: '16px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '12px', opacity: 0.85, textTransform: 'uppercase', tracking: '1px' }}>
              Portal Penjahit Konveksi
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '2px 0 0 0' }}>
              Halo, {currentUser?.name || 'Penjahit'} 👋
            </h2>
            <p style={{ fontSize: '13px', margin: '4px 0 0 0', opacity: 0.9 }}>
              Laporkan hasil kerja borongan harian Anda di sini
            </p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '12px' }}>
            <FileText size={28} />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(2, 1fr)',
          gap: '12px',
          marginBottom: '20px'
        }}
      >
        <div className="card" style={{ padding: '14px', borderLeft: '4px solid var(--warning)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--warning)' }}>
            <Clock size={18} />
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Pending Approval</span>
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '6px 0 0 0' }}>
            {formatRupiah(pendingAmount)}
          </h3>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{pendingLogs.length} Laporan Harian</span>
        </div>

        <div className="card" style={{ padding: '14px', borderLeft: '4px solid var(--success)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)' }}>
            <CheckCircle2 size={18} />
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Sudah Dicairkan</span>
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '6px 0 0 0' }}>
            {formatRupiah(paidAmount)}
          </h3>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{paidLogs.length} Pencairan Gaji</span>
        </div>
      </div>

      {/* FORM INPUT HASIL KERJA HARIAN */}
      <div className="card" style={{ padding: isMobile ? '14px' : '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} style={{ color: 'var(--primary)' }} />
            Input Hasil Kerja Harian
          </h3>
          <span className="badge badge-primary" style={{ fontSize: '11px' }}>Multi-Item Submit</span>
        </div>

        <form onSubmit={handleSubmitLog}>
          {/* Select Date */}
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label">Tanggal Pengerjaan</label>
            <input
              type="date"
              className="form-control"
              value={logDate}
              onChange={(e) => setLogDate(e.target.value)}
              required
            />
          </div>

          {/* Items Entry Builder */}
          <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>
            Rincian Item Borongan yang Dikerjakan:
          </label>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
            {entryItems.map((item, idx) => {
              const subtotal = (Number(item.quantity) || 0) * (Number(item.rate_per_unit) || 0);

              return (
                <div
                  key={idx}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-card-subtle, rgba(0,0,0,0.02))'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--primary)' }}>
                      Item #{idx + 1}
                    </span>
                    {entryItems.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm btn-icon"
                        style={{ padding: '2px 6px' }}
                        onClick={() => handleRemoveRow(idx)}
                        title="Hapus baris"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Pilih Pekerjaan</label>
                      <select
                        className="form-control"
                        style={{ fontSize: '13px' }}
                        value={item.piece_rate_item_id}
                        onChange={(e) => handleItemChange(idx, 'piece_rate_item_id', e.target.value)}
                        required
                      >
                        <option value="">-- Pilih Pekerjaan Borongan --</option>
                        {masterItems.map(m => (
                          <option key={m.id} value={m.id}>
                            [{m.product_name}] {m.item_name} - ({formatRupiah(m.rate_price)}/pcs)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Jumlah (Pcs)</label>
                      <input
                        type="number"
                        className="form-control"
                        style={{ fontSize: '13px' }}
                        min="1"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Subtotal</label>
                      <input
                        type="text"
                        className="form-control"
                        style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--success)' }}
                        value={formatRupiah(subtotal)}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', marginBottom: '16px', borderStyle: 'dashed' }}
            onClick={handleAddRow}
          >
            <Plus size={14} /> + Tambah Item Pekerjaan Lain
          </button>

          {/* Total & Submit Button */}
          <div
            style={{
              padding: '12px',
              borderRadius: '8px',
              background: 'var(--bg-card-subtle, rgba(0,0,0,0.03))',
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}
          >
            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Total Laporan Hari Ini:</span>
            <span style={{ fontWeight: 'bold', fontSize: '18px', color: 'var(--primary)' }}>
              {formatRupiah(calculatedBatchTotal)}
            </span>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
            <Send size={16} /> Kirim Laporan Harian
          </button>
        </form>
      </div>

      {/* RIWAYAT LAPORAN HARIAN WORKER */}
      <div className="card" style={{ padding: isMobile ? '14px' : '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={18} style={{ color: 'var(--primary)' }} />
          Riwayat Laporan Pekerjaan Anda
        </h3>

        {workerLogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
            <Clock size={36} style={{ opacity: 0.3, marginBottom: '8px' }} />
            <p>Belum ada laporan kerja harian yang dikirim.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {workerLogs.map(log => (
              <div
                key={log.id}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
                      📅 {log.log_date}
                    </span>
                    {log.status === 'PAID' ? (
                      <span className="badge badge-success" style={{ fontSize: '10px' }}>Lunas / Paid</span>
                    ) : (
                      <span className="badge badge-warning" style={{ fontSize: '10px' }}>Pending Owner</span>
                    )}
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {log.items ? log.items.length : 0} jenis pekerjaan
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '15px', color: 'var(--primary)' }}>
                    {formatRupiah(log.total_daily_amount)}
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '11px', marginTop: '4px', padding: '2px 8px' }}
                    onClick={() => setSelectedLogDetail(log)}
                  >
                    Detail Item
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DETAIL MODAL LAPORAN HARIAN */}
      {selectedLogDetail && (
        <div className="modal-overlay" onClick={() => setSelectedLogDetail(null)}>
          <div className="modal-content" style={{ maxWidth: '440px', width: '100%' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
                Rincian Laporan ({selectedLogDetail.log_date})
              </h3>
              <button type="button" className="btn btn-icon" onClick={() => setSelectedLogDetail(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ marginTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Status Laporan:</span>
                {selectedLogDetail.status === 'PAID' ? (
                  <span className="badge badge-success">Lunas (Paid)</span>
                ) : (
                  <span className="badge badge-warning">Pending Approval</span>
                )}
              </div>

              <div className="table-responsive">
                <table className="table" style={{ width: '100%', fontSize: '13px' }}>
                  <thead>
                    <tr>
                      <th>Pekerjaan</th>
                      <th style={{ textAlign: 'center' }}>Qty</th>
                      <th style={{ textAlign: 'right' }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedLogDetail.items && selectedLogDetail.items.map(it => (
                      <tr key={it.id}>
                        <td>
                          <strong style={{ display: 'block' }}>{it.item_name}</strong>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{it.product_name}</span>
                        </td>
                        <td style={{ textAlign: 'center' }}>{it.quantity} Pcs</td>
                        <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{formatRupiah(it.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div
                style={{
                  marginTop: '16px',
                  padding: '10px',
                  borderRadius: '6px',
                  background: 'var(--bg-card-subtle, rgba(0,0,0,0.03))',
                  display: 'flex',
                  justify: 'space-between',
                  fontWeight: 'bold'
                }}
              >
                <span>Total Gaji Hari Ini:</span>
                <span style={{ color: 'var(--primary)' }}>{formatRupiah(selectedLogDetail.total_daily_amount)}</span>
              </div>
            </div>

            <div className="modal-footer" style={{ marginTop: '16px', textAlign: 'right' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setSelectedLogDetail(null)}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
