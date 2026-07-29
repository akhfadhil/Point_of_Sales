// src/components/modals/ChangePasswordModal.jsx
import React, { useState } from 'react';
import { Key, Eye, EyeOff, X, CheckCircle, ShieldCheck } from 'lucide-react';
import { db } from '../../db';

/**
 * Modal Self-Service Ubah Kata Sandi untuk Pengguna Login
 * @param {Object} props
 * @param {boolean} props.isOpen - Status modal terbuka
 * @param {Function} props.onClose - Handler menutup modal
 * @param {Object} props.currentUser - User login saat ini
 * @param {Function} props.setCurrentUser - Setter state user login
 * @param {Function} props.showToast - Notifikasi toast
 * @param {boolean} props.isMobile - Status mode mobile
 */
export default function ChangePasswordModal({
  isOpen,
  onClose,
  currentUser,
  setCurrentUser,
  showToast,
  isMobile
}) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen || !currentUser) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      showToast('Seluruh kolom kata sandi wajib diisi.', 'danger');
      return;
    }

    // Current password stored on user or fallback '123456'
    const actualCurrentPassword = currentUser.password || '123456';
    if (oldPassword.trim() !== actualCurrentPassword) {
      showToast('Kata sandi saat ini yang Anda masukkan salah.', 'danger');
      return;
    }

    if (newPassword.trim().length < 4) {
      showToast('Kata sandi baru minimal 4 karakter.', 'danger');
      return;
    }

    if (newPassword.trim() !== confirmPassword.trim()) {
      showToast('Konfirmasi kata sandi baru tidak cocok.', 'danger');
      return;
    }

    // Save to database
    const updated = db.update('users', currentUser.id, {
      password: newPassword.trim()
    });

    if (updated) {
      if (setCurrentUser) {
        setCurrentUser(prev => ({
          ...prev,
          password: newPassword.trim()
        }));
      }
      showToast('Kata sandi Anda berhasil diperbarui!');
      // Reset state & close
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    } else {
      showToast('Gagal memperbarui kata sandi.', 'danger');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '440px', width: '100%', padding: isMobile ? '16px' : '24px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Key size={20} style={{ color: 'var(--primary)' }} />
            Ubah Kata Sandi Saya
          </h3>
          <button type="button" className="btn btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* User Badge Info */}
            <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-tertiary)', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {currentUser.name ? currentUser.name.charAt(0) : 'U'}
              </div>
              <div>
                <strong style={{ fontSize: '13px', display: 'block', color: 'var(--text-primary)' }}>{currentUser.name}</strong>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{currentUser.email}</span>
              </div>
            </div>

            {/* Current Password Input */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                Kata Sandi Saat Ini <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showOld ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Masukkan kata sandi saat ini"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  style={{ height: '42px', borderRadius: '10px', paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* New Password Input */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                Kata Sandi Baru <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showNew ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Masukkan kata sandi baru (min. 4 karakter)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  style={{ height: '42px', borderRadius: '10px', paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password Input */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                Konfirmasi Kata Sandi Baru <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Ketik ulang kata sandi baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{ height: '42px', borderRadius: '10px', paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className="modal-footer" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle size={16} /> Perbarui Kata Sandi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
