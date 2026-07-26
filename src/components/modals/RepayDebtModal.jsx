// src/components/modals/RepayDebtModal.jsx
import React from 'react';
import { X } from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';

/**
 * Modal Form Pencatatan Pembayaran Cicilan Utang / Kasbon Pelanggan
 * @param {Object} props
 * @param {boolean} props.isOpen - Status tampil modal
 * @param {Object} props.customer - Data pelanggan terpilih
 * @param {string|number} props.debtRepayAmount - Nominal pembayaran cicilan
 * @param {Function} props.setDebtRepayAmount - Setter nominal cicilan
 * @param {string} props.debtRepayMethod - Metode bayar ('CASH' | 'QRIS' | 'TRANSFER')
 * @param {Function} props.setDebtRepayMethod - Setter metode bayar
 * @param {Function} props.onSubmit - Function submit handler
 * @param {Function} props.onClose - Function callback menutup modal
 */
export default function RepayDebtModal({
  isOpen,
  customer,
  debtRepayAmount,
  setDebtRepayAmount,
  debtRepayMethod,
  setDebtRepayMethod,
  onSubmit,
  onClose
}) {
  if (!isOpen || !customer) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <header className="modal-header">
          <h2 className="modal-title">Catat Pembayaran Cicilan</h2>
          <button type="button" className="modal-close" onClick={onClose}><X size={20} /></button>
        </header>

        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}>
            <strong>Pelanggan:</strong> {customer.name}<br />
            <strong>No HP:</strong> {customer.phone_number}<br />
            <strong>Total Utang Saat Ini:</strong> <span style={{ color: 'red', fontWeight: 'bold' }}>{formatRupiah(customer.total_debt)}</span>
          </div>

          <div className="form-group">
            <label htmlFor="repay-amount" className="form-label">Nominal Pembayaran Cicilan (Rp)</label>
            <input
              id="repay-amount"
              type="number"
              className="form-control"
              placeholder="Masukkan jumlah yang dicicil..."
              value={debtRepayAmount}
              onChange={(e) => setDebtRepayAmount(e.target.value)}
              max={customer.total_debt}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Metode Pembayaran Cicilan</label>
            <div className="segmented-control">
              <button
                type="button"
                className={`segmented-option ${debtRepayMethod === 'CASH' ? 'active' : ''}`}
                onClick={() => setDebtRepayMethod('CASH')}
              >
                Tunai
              </button>
              <button
                type="button"
                className={`segmented-option ${debtRepayMethod === 'QRIS' ? 'active' : ''}`}
                onClick={() => setDebtRepayMethod('QRIS')}
              >
                QRIS
              </button>
              <button
                type="button"
                className={`segmented-option ${debtRepayMethod === 'TRANSFER' ? 'active' : ''}`}
                onClick={() => setDebtRepayMethod('TRANSFER')}
              >
                Transfer
              </button>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Batal</button>
            <button type="submit" className="btn btn-success">Simpan Cicilan</button>
          </div>
        </form>
      </div>
    </div>
  );
}
