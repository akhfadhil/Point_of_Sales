// src/components/modals/DebtReceiptModal.jsx
import React from 'react';
import { X, Printer, Send } from 'lucide-react';
import { printReceipt } from '../../utils/printHelper';

/**
 * Modal Struk Bukti Pembayaran Cicilan Utang / Kasbon Pelanggan
 * @param {Object} props
 * @param {boolean} props.isOpen - Status tampil modal
 * @param {Object} props.payment - Data transaksi pembayaran cicilan utang
 * @param {Object} props.db - Instance database lokal
 * @param {Function} props.showToast - Function callback notifikasi toast
 * @param {Function} props.onClose - Function callback menutup modal
 */
export default function DebtReceiptModal({
  isOpen,
  payment,
  db,
  showToast,
  onClose
}) {
  if (!isOpen || !payment) return null;

  const cashier = db.find('users', u => u.id === payment.cashier_id);
  const customer = db.find('customers', c => c.id === payment.customer_id);
  const remainingDebt = customer ? customer.total_debt : 0;

  const handleSendWhatsApp = () => {
    const rawPhone = customer?.phone_number || '';
    const formattedPhone = rawPhone.replace(/^0/, '62').replace(/[^0-9]/g, '');
    const textMessage = `*TOKO SERAGAM OLIVIANA*
Jl. Semeru No. 81, Sukodono - Lumajang

*** BUKTI PEMBAYARAN KASBON / UTANG ***
----------------------------------------
No. Bukti      : ${payment.id}
Tanggal        : ${new Date(payment.created_at).toLocaleDateString('id-ID')} ${new Date(payment.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
Kasir Penerima : ${cashier ? cashier.name : 'Kasir'}
Pelanggan      : ${customer ? customer.name : 'Pelanggan'}

*NOMINAL DIBAYAR : Rp ${Number(payment.amount_paid).toLocaleString('id-ID')}*
Metode Bayar   : ${payment.payment_method}
*SISA UTANG     : ${remainingDebt > 0 ? `Rp ${Number(remainingDebt).toLocaleString('id-ID')}` : 'LUNAS (Rp 0)'}*
----------------------------------------
*Terima kasih atas pembayaran Anda!*`;

    const waUrl = formattedPhone
      ? `https://wa.me/${formattedPhone}?text=${encodeURIComponent(textMessage)}`
      : `https://wa.me/?text=${encodeURIComponent(textMessage)}`;

    showToast('Mengunduh Nota PDF Dot Matrix & Membuka WhatsApp...', 'info');

    const element = document.getElementById('debt-receipt-paper');
    if (element && window.html2pdf) {
      const opt = {
        margin: 5,
        filename: `Nota_Kasbon_${payment.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          scrollY: 0,
          scrollX: 0
        },
        jsPDF: { unit: 'mm', format: 'a5', orientation: 'landscape' }
      };
      window.html2pdf().set(opt).from(element).save().then(() => {
        window.open(waUrl, '_blank');
      }).catch(() => {
        window.open(waUrl, '_blank');
      });
    } else {
      window.open(waUrl, '_blank');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content receipt-modal-content" style={{ maxWidth: '660px', width: '95%' }}>
        <header className="modal-header">
          <h2 className="modal-title">Nota Bukti Pembayaran Utang / Cicilan</h2>
          <button type="button" className="modal-close" onClick={onClose}><X size={20} /></button>
        </header>

        <div className="receipt-paper-wrapper" style={{ backgroundColor: '#e2e8f0', padding: '16px', borderRadius: '12px', overflowX: 'auto' }}>
          <div className="receipt-paper" id="debt-receipt-paper" style={{ color: '#000000' }}>
            <div style={{ textTransform: 'uppercase', textAlign: 'center', marginBottom: '8px', borderBottom: '2px double #000000', paddingBottom: '6px' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '1px' }}>TOKO SERAGAM OLIVIANA</div>
              <div style={{ fontSize: '11px', color: '#000000' }}>Jl. Semeru No. 81, Sukodono - Lumajang | HP/WA: 0812-3456-7890</div>
            </div>

            <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '13px', marginBottom: '8px', letterSpacing: '0.5px' }}>
              *** BUKTI PEMBAYARAN KASBON / UTANG ***
            </div>

            {/* Header Meta Info Kiri & Kanan */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '11px', marginBottom: '8px', color: '#000000' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '70px 10px 1fr', alignItems: 'center' }}>
                  <div>No. Bukti</div><div>:</div><div><code>{payment.id}</code></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '70px 10px 1fr', alignItems: 'center' }}>
                  <div>Tanggal</div><div>:</div><div>{new Date(payment.created_at).toLocaleDateString('id-ID')} {new Date(payment.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '95px 10px 1fr', alignItems: 'center' }}>
                  <div>Kasir Penerima</div><div>:</div><div><strong>{cashier ? cashier.name : 'Kasir'}</strong></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '95px 10px 1fr', alignItems: 'center' }}>
                  <div>Pelanggan</div><div>:</div><div><strong>{customer ? customer.name : 'Pelanggan'}</strong></div>
                </div>
              </div>
            </div>

            <div className="receipt-divider"></div>

            <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse', marginBottom: '8px', color: '#000000' }}>
              <thead>
                <tr style={{ borderBottom: '1px dashed #000000', borderTop: '1px dashed #000000', textAlign: 'left' }}>
                  <th style={{ padding: '6px 4px' }}>KETERANGAN PEMBAYARAN CICILAN / KASBON</th>
                  <th style={{ padding: '6px 4px', textAlign: 'right', width: '140px' }}>NOMINAL DIBAYAR</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '8px 4px' }}>
                    Pembayaran Utang Toko Oliviana a.n. <strong>{customer ? customer.name : 'Pelanggan'}</strong> via <strong>{payment.payment_method}</strong>
                  </td>
                  <td style={{ padding: '8px 4px', textAlign: 'right', fontWeight: 'bold', fontSize: '13px' }}>
                    Rp {Number(payment.amount_paid).toLocaleString('id-ID')}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="receipt-divider"></div>

            {/* Bottom Footer & Aligned Summary */}
            <div className="receipt-bottom-grid">
              <div className="receipt-bottom-signature" style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '4px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', textAlign: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div>Penyetor,</div>
                    <div style={{ height: '44px' }}></div>
                    <div style={{ fontWeight: 'bold', borderBottom: '1px solid #000000', paddingBottom: '1px', display: 'inline-block', width: '110px' }}>
                      {customer ? customer.name : '...................'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div>Kasir Penerima,</div>
                    <div style={{ height: '44px' }}></div>
                    <div style={{ fontWeight: 'bold', borderBottom: '1px solid #000000', paddingBottom: '1px', display: 'inline-block', width: '110px' }}>
                      {cashier ? cashier.name : 'Kasir Toko'}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '10px', color: '#000000' }}>
                  * Terima kasih atas pembayaran Anda.<br />
                  * Simpan struk faktur ini sebagai bukti pembayaran yang sah.
                </div>
              </div>

              <div className="receipt-bottom-summary" style={{
                backgroundColor: '#ffffff',
                padding: '10px 12px',
                borderRadius: '4px',
                border: '1px solid #000000',
                color: '#000000',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                minWidth: 0,
                boxSizing: 'border-box'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', gap: '6px', flexWrap: 'wrap' }}>
                  <span>Nominal Bayar:</span>
                  <strong style={{ fontSize: '12px' }}>Rp {Number(payment.amount_paid).toLocaleString('id-ID')}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', gap: '6px', flexWrap: 'wrap' }}>
                  <span>Metode Bayar:</span>
                  <strong>{payment.payment_method}</strong>
                </div>

                <div style={{ borderTop: '1px dashed #000000', margin: '2px 0' }}></div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', gap: '6px', flexWrap: 'wrap' }}>
                  <strong style={{ fontSize: '12px' }}>SISA UTANG:</strong>
                  <strong style={{ fontSize: '12px', color: remainingDebt > 0 ? '#dc2626' : '#16a34a' }}>
                    {remainingDebt > 0 ? `Rp ${Number(remainingDebt).toLocaleString('id-ID')}` : 'LUNAS (Rp 0)'}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer receipt-modal-footer" style={{ justifyContent: 'center' }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => printReceipt('debt-receipt-paper')}>
            <Printer size={14} /> Print Nota
          </button>
          <button type="button" className="btn btn-success btn-sm" onClick={handleSendWhatsApp}>
            <Send size={14} /> Kirim WhatsApp
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
