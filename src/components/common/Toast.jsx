// src/components/common/Toast.jsx
import React from 'react';
import { CheckCircle, X, AlertTriangle } from 'lucide-react';

/**
 * Komponen Toast Notifikasi Melayang Global
 * @param {Object} props
 * @param {Object} props.toast - Object data toast { message, type }
 * @param {Function} props.onClose - Function callback menutup toast
 */
export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className={`toast-notification toast-${toast.type}`}>
      <div className="toast-content">
        {toast.type === 'success' && <CheckCircle size={18} className="toast-icon success" />}
        {toast.type === 'error' && <X size={18} className="toast-icon danger" />}
        {toast.type === 'warning' && <AlertTriangle size={18} className="toast-icon warning" />}
        {toast.type === 'info' && <CheckCircle size={18} className="toast-icon info" />}
        <span>{toast.message}</span>
      </div>
      <button type="button" className="toast-close" onClick={onClose}>
        <X size={14} />
      </button>
    </div>
  );
}
