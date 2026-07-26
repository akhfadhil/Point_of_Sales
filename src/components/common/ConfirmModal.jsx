// src/components/common/ConfirmModal.jsx
import React from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';

/**
 * Komponen Modal Dialog Konfirmasi Kustom Global
 * @param {Object} props
 * @param {Object} props.config - Config modal konfirmasi { title, message, confirmText, cancelText, confirmVariant, onConfirm }
 * @param {Function} props.onClose - Function callback membatalkan dialog
 */
export default function ConfirmModal({ config, onClose }) {
  if (!config) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 10000 }}>
      <div className="modal-content" style={{ maxWidth: '420px', textAlign: 'center', padding: '28px 24px' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: config.confirmVariant === 'danger' ? 'var(--danger-light)' : 'var(--primary-light)',
          color: config.confirmVariant === 'danger' ? 'var(--danger)' : 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          {config.confirmVariant === 'danger' ? <Trash2 size={24} /> : <AlertTriangle size={24} />}
        </div>

        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>{config.title}</h3>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.5' }}>
          {config.message}
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ flex: 1 }}
            onClick={onClose}
          >
            {config.cancelText || 'Batal'}
          </button>
          <button
            type="button"
            className={`btn btn-${config.confirmVariant || 'danger'}`}
            style={{ flex: 1 }}
            onClick={config.onConfirm}
          >
            {config.confirmText || 'Ya, Lanjutkan'}
          </button>
        </div>
      </div>
    </div>
  );
}
