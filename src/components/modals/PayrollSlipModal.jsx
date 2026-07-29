// src/components/modals/PayrollSlipModal.jsx
import React from 'react';
import { X, Printer, Send, CheckCircle2 } from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';

/**
 * Modal Cetak & Share Slip Gaji Bulanan Penjahit
 * @param {Object} props
 * @param {boolean} props.isOpen - Status modal terbuka
 * @param {Object} props.payrollData - Data pencairan { disbursement, worker, monthYear, logs }
 * @param {Function} props.showToast - Callback notifikasi toast
 * @param {Function} props.onClose - Callback menutup modal
 */
export default function PayrollSlipModal({
  isOpen,
  payrollData,
  showToast,
  onClose
}) {
  if (!isOpen || !payrollData) return null;

  const { disbursement, worker, monthYear, logs } = payrollData;

  // Flatten all items from logs for detailed breakdown
  const itemizedList = [];
  if (logs && Array.isArray(logs)) {
    logs.forEach(log => {
      if (log.items && Array.isArray(log.items)) {
        log.items.forEach(it => {
          const key = `${it.product_name || ''} - ${it.item_name}`;
          const existing = itemizedList.find(x => x.key === key);
          if (existing) {
            existing.quantity += Number(it.quantity);
            existing.subtotal += Number(it.subtotal);
          } else {
            itemizedList.push({
              key,
              product_name: it.product_name,
              item_name: it.item_name,
              rate_per_unit: Number(it.rate_per_unit),
              quantity: Number(it.quantity),
              subtotal: Number(it.subtotal)
            });
          }
        });
      }
    });
  }

  // Handle WhatsApp Share Simulation
  const handleSendWhatsApp = () => {
    const itemsText = itemizedList.map((it, idx) => (
      `${idx + 1}. ${it.item_name} (${it.product_name}): ${it.quantity} Pcs x Rp ${it.rate_per_unit.toLocaleString('id-ID')} = Rp ${it.subtotal.toLocaleString('id-ID')}`
    )).join('\n');

    const messageText = `*TOKO SERAGAM OLIVIANA*
Jl. Semeru No. 81, Sukodono, Lumajang

*SLIP GAJI PENJAHIT*
----------------------------------------
No. Slip   : ${disbursement?.payroll_number || 'PAY-OFFICIAL'}
Tanggal    : ${new Date(disbursement?.paid_at || Date.now()).toLocaleDateString('id-ID')}
Pekerja    : ${worker?.name || 'Penjahit'}
Periode    : ${monthYear}
Status     : LUNAS / PAID
----------------------------------------
*RINCIAN PEKERJAAN:*
${itemsText}
----------------------------------------
*TOTAL GAJI DICAIKAN: Rp ${Number(disbursement?.total_amount || 0).toLocaleString('id-ID')}*
----------------------------------------
Terima kasih atas dedikasi & kerja keras Anda di Toko Seragam Oliviana!`;

    const encoded = encodeURIComponent(messageText);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
    if (showToast) showToast('Membuka WhatsApp untuk mengirim Slip Gaji...');
  };

  // Handle Print Action
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '440px', width: '100%' }} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={20} style={{ color: 'var(--success)' }} />
            Slip Gaji (Pratinjau)
          </h3>
          <button type="button" className="btn btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Printable Thermal Slip Sheet */}
        <div
          id="printable-payroll-slip"
          style={{
            background: '#fff',
            color: '#000',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: '12px',
            lineHeight: '1.4',
            border: '1px dashed #ccc',
            marginTop: '12px'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, color: '#000' }}>
              TOKO SERAGAM OLIVIANA
            </h3>
            <p style={{ fontSize: '11px', margin: '2px 0 0 0', color: '#333' }}>
              Jl. Semeru No. 81, Sukodono, Lumajang
            </p>
            <div style={{ borderBottom: '1px dashed #000', margin: '8px 0' }} />
            <strong style={{ fontSize: '13px' }}>SLIP GAJI PENJAHIT</strong>
          </div>

          <div style={{ marginBottom: '10px', fontSize: '11px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>No. Slip:</span>
              <strong>{disbursement?.payroll_number}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Tanggal:</span>
              <span>{new Date(disbursement?.paid_at || Date.now()).toLocaleDateString('id-ID')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Penjahit:</span>
              <strong>{worker?.name}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Periode Bulan:</span>
              <span>{monthYear}</span>
            </div>
          </div>

          <div style={{ borderBottom: '1px dashed #000', margin: '8px 0' }} />

          {/* Itemized Table */}
          <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px dashed #000', textAlign: 'left' }}>
                <th>Pekerjaan</th>
                <th style={{ textAlign: 'center' }}>Qty</th>
                <th style={{ textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {itemizedList.map((it, idx) => (
                <tr key={idx} style={{ verticalAlign: 'top' }}>
                  <td style={{ padding: '3px 0' }}>
                    <div>{it.item_name}</div>
                    <span style={{ fontSize: '9px', color: '#555' }}>{it.product_name}</span>
                  </td>
                  <td style={{ textAlign: 'center', padding: '3px 0' }}>{it.quantity}</td>
                  <td style={{ textAlign: 'right', padding: '3px 0' }}>{formatRupiah(it.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ borderBottom: '1px dashed #000', margin: '10px 0' }} />

          {/* Total & Status */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 'bold' }}>
            <span>TOTAL DICAIKAN:</span>
            <span>{formatRupiah(disbursement?.total_amount || 0)}</span>
          </div>
          <div style={{ textAlign: 'right', marginTop: '4px' }}>
            <span style={{ background: '#000', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '10px' }}>
              STATUS: LUNAS / PAID
            </span>
          </div>

          <div style={{ borderBottom: '1px dashed #000', margin: '12px 0 8px' }} />
          <div style={{ textAlign: 'center', fontSize: '10px', color: '#444' }}>
            Terima kasih atas kerja keras & dedikasi Anda di Toko Seragam Oliviana.
          </div>
        </div>

        {/* Modal Actions */}
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={handlePrint}
            >
              <Printer size={16} /> Cetak Slip Thermal
            </button>

            <button
              type="button"
              className="btn btn-success"
              style={{ flex: 1, background: '#25D366', color: '#fff', border: 'none' }}
              onClick={handleSendWhatsApp}
            >
              <Send size={16} /> WhatsApp Share
            </button>
          </div>

          <button type="button" className="btn btn-secondary" onClick={onClose} style={{ width: '100%' }}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
