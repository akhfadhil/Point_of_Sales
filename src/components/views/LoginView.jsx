// src/components/views/LoginView.jsx
import React from 'react';

/**
 * Komponen Tampilan Halaman Login & Switcher Role User
 * @param {Object} props
 * @param {string} props.selectedRole - Role yang dipilih ('OWNER' | 'CASHIER')
 * @param {Function} props.setSelectedRole - Setter role terpilih
 * @param {string} props.emailInput - Input nilai email pengguna
 * @param {Function} props.setEmailInput - Setter nilai email pengguna
 * @param {string} props.loginError - Pesan error login
 * @param {Function} props.onSubmit - Handler submit form login
 */
export default function LoginView({
  selectedRole,
  setSelectedRole,
  emailInput,
  setEmailInput,
  passwordInput,
  setPasswordInput,
  loginError,
  onSubmit
}) {
  return (
    <div className="login-container">
      <main className="card login-card">
        <header>
          <div className="login-logo">Oliviana POS</div>
          <p className="login-subtitle">Manajemen Stok & Kasir Terintegrasi</p>
        </header>

        <div className="login-role-selector">
          <button
            type="button"
            className={`login-role-btn ${selectedRole === 'OWNER' ? 'active' : ''}`}
            onClick={() => setSelectedRole('OWNER')}
          >
            Owner
          </button>
          <button
            type="button"
            className={`login-role-btn ${selectedRole === 'CASHIER' ? 'active' : ''}`}
            onClick={() => setSelectedRole('CASHIER')}
          >
            Kasir
          </button>
          <button
            type="button"
            className={`login-role-btn ${selectedRole === 'WORKER' ? 'active' : ''}`}
            onClick={() => setSelectedRole('WORKER')}
          >
            Penjahit
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="login-username" className="form-label">Username</label>
            <input
              id="login-username"
              type="text"
              className="form-control"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Masukkan username"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="login-pass" className="form-label">Password</label>
            <input
              id="login-pass"
              type="password"
              className="form-control"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Masukkan password"
              required
            />
          </div>

          {loginError && <p style={{ color: 'var(--danger)', fontSize: '13px', margin: '8px 0 16px', textAlign: 'left' }}>{loginError}</p>}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
            Masuk ke Aplikasi
          </button>
        </form>
      </main>
    </div>
  );
}
