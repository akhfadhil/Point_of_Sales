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
            onClick={() => {
              setSelectedRole('OWNER');
              setEmailInput('owner@oliviana.com');
            }}
          >
            Owner
          </button>
          <button
            type="button"
            className={`login-role-btn ${selectedRole === 'CASHIER' ? 'active' : ''}`}
            onClick={() => {
              setSelectedRole('CASHIER');
              setEmailInput('kasir@oliviana.com');
            }}
          >
            Kasir
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">Email Pengguna</label>
            <input
              id="login-email"
              type="email"
              className="form-control"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="login-pass" className="form-label">Password</label>
            <input
              id="login-pass"
              type="password"
              className="form-control"
              placeholder="•••••••• (Bebas untuk simulasi)"
              defaultValue="123456"
            />
          </div>

          {loginError && <p style={{ color: 'var(--danger)', fontSize: '13px', margin: '8px 0 16px', textAlign: 'left' }}>{loginError}</p>}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
            Masuk ke Aplikasi
          </button>
        </form>

        <div className="login-help-info">
          <strong>Akun Simulasi Default:</strong>
          <ul style={{ paddingLeft: '20px', marginTop: '6px', listStyleType: 'disc' }}>
            <li>Owner: <code>owner@oliviana.com</code></li>
            <li>Kasir: <code>kasir@oliviana.com</code></li>
          </ul>
        </div>
      </main>
    </div>
  );
}
