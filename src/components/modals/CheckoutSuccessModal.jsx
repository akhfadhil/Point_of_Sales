// src/components/modals/CheckoutSuccessModal.jsx
import React from 'react';
import { X, Printer, Send } from 'lucide-react';
import { printReceipt } from '../../utils/printHelper';

/**
 * Modal Sukses Transaksi Kasir POS & Simulasi Faktur Dot Matrix
 * @param {Object} props
 * @param {boolean} props.isOpen - Status tampil modal
 * @param {Object} props.invoice - Data invoice transaksi penjualan
 * @param {Object} props.db - Instance database lokal
 * @param {Function} props.showToast - Function callback notifikasi toast
 * @param {Function} props.onClose - Function callback menutup modal
 */
export default function CheckoutSuccessModal({
  isOpen,
  invoice,
  db,
  showToast,
  onClose
}) {
  if (!isOpen || !invoice) return null;

  const cashier = db.find('users', u => u.id === invoice.cashier_id);
  const customer = db.find('customers', c => c.id === invoice.customer_id);
  const saleItems = db.get('sale_items').filter(item => item.sale_id === invoice.id);
  const allVariants = db.get('product_variants');
  const allProducts = db.get('products');

  const handleSendWhatsApp = () => {
    const rawPhone = customer?.phone_number || '';
    const formattedPhone = rawPhone.replace(/^0/, '62').replace(/[^0-9]/g, '');
    const itemsText = saleItems.map((item, idx) => {
      const variant = allVariants.find(v => v.id === item.variant_id);
      const prod = variant ? allProducts.find(p => p.id === variant.product_id) : null;
      const sizeStr = variant ? ` (${variant.size}${variant.color && variant.color !== 'Standard' ? `, ${variant.color}` : ''})` : '';
      return `${idx + 1}. ${prod ? prod.name : 'Barang'}${sizeStr} x ${item.quantity} Pcs = Rp ${Number(item.subtotal).toLocaleString('id-ID')}`;
    }).join('\n');

    const textMessage = `*TOKO SERAGAM OLIVIANA*
Jl. Semeru No. 81, Sukodono - Lumajang

*FAKTUR PENJUALAN / NOTA*
----------------------------------------
No. Invoice : ${invoice.invoice_number}
Tanggal     : ${new Date(invoice.created_at).toLocaleDateString('id-ID')} ${new Date(invoice.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
Kasir       : ${cashier ? cashier.name : 'Kasir'}
Pelanggan   : ${customer ? customer.name : 'Umum (Walk-in)'}

*RINCIAN BARANG:*
${itemsText}
----------------------------------------
*TOTAL BELANJA : Rp ${Number(invoice.total_amount).toLocaleString('id-ID')}*
Metode Bayar  : ${invoice.payment_method} (${invoice.payment_status})
Nominal Bayar : Rp ${Number(invoice.paid_amount).toLocaleString('id-ID')}
${invoice.change_amount > 0 ? `Kembalian     : Rp ${Number(invoice.change_amount).toLocaleString('id-ID')}\n` : ''}${customer && customer.total_debt > 0 ? `Sisa Utang    : Rp ${Number(customer.total_debt).toLocaleString('id-ID')}\n` : ''}
*Terima kasih telah berbelanja di Toko Oliviana!*`;

    const waUrl = formattedPhone
      ? `https://wa.me/${formattedPhone}?text=${encodeURIComponent(textMessage)}`
      : `https://wa.me/?text=${encodeURIComponent(textMessage)}`;

    showToast('Mengunduh Nota PDF Dot Matrix & Membuka WhatsApp...', 'info');

    const element = document.getElementById('sale-receipt-paper');
    if (element && window.html2pdf) {
      const opt = {
        margin: 5,
        filename: `Nota_Penjualan_${invoice.invoice_number}.pdf`,
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
          <h2 className="modal-title">Faktur Penjualan</h2>
          <button type="button" className="modal-close" onClick={onClose}><X size={20} /></button>
        </header>

        <div className="receipt-paper-wrapper" style={{ backgroundColor: '#e2e8f0', padding: '16px', borderRadius: '12px', overflowX: 'auto' }}>
          {/* Simulated Dot Matrix Continuous Form Paper */}
          <div className="receipt-paper" id="sale-receipt-paper" style={{ color: '#000000' }}>
            {/* Header Store */}
            <div style={{ textTransform: 'uppercase', textAlign: 'center', marginBottom: '10px', borderBottom: '2px double #000000', paddingBottom: '6px' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '1px' }}>TOKO SERAGAM OLIVIANA</div>
              <div style={{ fontSize: '11px', color: '#000000' }}>Jl. Semeru No. 81, Sukodono - Lumajang | HP/WA: 0812-3456-7890</div>
            </div>

            {/* Title & Metadata with Aligned Colons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '11px', marginBottom: '8px', color: '#000000' }}>
              {/* Kiri */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '2px' }}>FAKTUR PENJUALAN / NOTA</div>
                <div style={{ display: 'grid', gridTemplateColumns: '80px 10px 1fr', alignItems: 'center' }}>
                  <div>No. Invoice</div><div>:</div><div><code>{invoice.invoice_number}</code></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '80px 10px 1fr', alignItems: 'center' }}>
                  <div>Tanggal</div><div>:</div><div>{new Date(invoice.created_at).toLocaleDateString('id-ID')} {new Date(invoice.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>

              {/* Kanan */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ height: '17px' }}></div>
                <div style={{ display: 'grid', gridTemplateColumns: '70px 10px 1fr', alignItems: 'center' }}>
                  <div>Kasir</div><div>:</div><div><strong>{cashier ? cashier.name : 'Kasir'}</strong></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '70px 10px 1fr', alignItems: 'center' }}>
                  <div>Pelanggan</div><div>:</div><div><strong>{customer ? customer.name : 'Umum (Walk-in)'}</strong></div>
                </div>
              </div>
            </div>

            <div className="receipt-divider"></div>

            {/* Item Table Dot Matrix */}
            <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse', marginBottom: '8px', color: '#000000' }}>
              <thead>
                <tr style={{ borderBottom: '1px dashed #000000', borderTop: '1px dashed #000000', textAlign: 'left' }}>
                  <th style={{ padding: '6px 2px', width: '28px' }}>NO</th>
                  <th style={{ padding: '6px 2px', width: '95px' }}>SKU</th>
                  <th style={{ padding: '6px 2px' }}>NAMA BARANG / VARIAN</th>
                  <th style={{ padding: '6px 2px', textAlign: 'center', width: '50px' }}>QTY</th>
                  <th style={{ padding: '6px 2px', textAlign: 'right', width: '90px' }}>HARGA</th>
                  <th style={{ padding: '6px 2px', textAlign: 'right', width: '95px' }}>SUBTOTAL</th>
                </tr>
              </thead>
              <tbody>
                {saleItems.map((item, idx) => {
                  const variant = allVariants.find(v => v.id === item.variant_id);
                  const prod = variant ? allProducts.find(p => p.id === variant.product_id) : null;
                  const displayName = prod ? `${prod.name} (Ukuran ${variant.size}${variant.color && variant.color !== 'Standard' ? `, ${variant.color}` : ''})` : 'Barang';

                  return (
                    <tr key={idx} style={{ borderBottom: '1px dotted #000000' }}>
                      <td style={{ padding: '5px 2px', verticalAlign: 'top' }}>{idx + 1}</td>
                      <td style={{ padding: '5px 2px', verticalAlign: 'top' }}><code>{variant ? variant.sku : '-'}</code></td>
                      <td style={{ padding: '5px 2px', verticalAlign: 'top' }}><strong>{displayName}</strong></td>
                      <td style={{ padding: '5px 2px', textAlign: 'center', verticalAlign: 'top' }}>{item.quantity} Pcs</td>
                      <td style={{ padding: '5px 2px', textAlign: 'right', verticalAlign: 'top' }}>{Number(item.price_per_unit).toLocaleString('id-ID')}</td>
                      <td style={{ padding: '5px 2px', textAlign: 'right', verticalAlign: 'top', fontWeight: 'bold' }}>{Number(item.subtotal).toLocaleString('id-ID')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="receipt-divider"></div>

            {/* Ringkasan Belanja & Tanda Tangan */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px', fontSize: '11px', alignItems: 'start', color: '#000000' }}>
              {/* Kolom Kiri: Tanda Tangan */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '4px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', textAlign: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div>Tanda Terima,</div>
                    <div style={{ height: '44px' }}></div>
                    <div style={{ fontWeight: 'bold', borderBottom: '1px solid #000000', paddingBottom: '1px', display: 'inline-block', width: '110px' }}>
                      {customer ? customer.name : '...................'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div>Hormat Kami,</div>
                    <div style={{ height: '44px' }}></div>
                    <div style={{ fontWeight: 'bold', borderBottom: '1px solid #000000', paddingBottom: '1px', display: 'inline-block', width: '110px' }}>
                      {cashier ? cashier.name : 'Kasir Toko'}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '10px', color: '#000000' }}>
                  * Terima kasih telah berbelanja di Toko Oliviana.<br />
                  * Barang yang sudah dibeli tidak dapat ditukar/dikembalikan.
                </div>
              </div>

              {/* Kolom Kanan: Rincian Total dengan Titik Dua Sejajar */}
              <div style={{ display: 'grid', gridTemplateColumns: '90px 10px 1fr', rowGap: '4px', backgroundColor: '#ffffff', padding: '8px 10px', borderRadius: '4px', border: '1px solid #000000', color: '#000000', alignItems: 'center' }}>
                <div style={{ fontWeight: 'bold', fontSize: '12px' }}>TOTAL</div>
                <div style={{ fontWeight: 'bold', fontSize: '12px' }}>:</div>
                <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '13px' }}>Rp {Number(invoice.total_amount).toLocaleString('id-ID')}</div>

                <div>Metode Bayar</div><div>:</div><div style={{ textAlign: 'right' }}><strong>{invoice.payment_method}</strong> ({invoice.payment_status})</div>
                <div>Nominal Bayar</div><div>:</div><div style={{ textAlign: 'right' }}>Rp {Number(invoice.paid_amount).toLocaleString('id-ID')}</div>

                {invoice.change_amount > 0 && (
                  <>
                    <div>Kembalian</div><div>:</div><div style={{ textAlign: 'right' }}>Rp {Number(invoice.change_amount).toLocaleString('id-ID')}</div>
                  </>
                )}

                {customer && customer.total_debt > 0 && (
                  <>
                    <div style={{ fontWeight: 'bold' }}>Sisa Utang</div>
                    <div style={{ fontWeight: 'bold' }}>:</div>
                    <div style={{ textAlign: 'right', fontWeight: 'bold' }}>Rp {Number(customer.total_debt).toLocaleString('id-ID')}</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer receipt-modal-footer" style={{ justifyContent: 'center' }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => printReceipt('sale-receipt-paper')}>
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
