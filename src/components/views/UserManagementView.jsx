// src/components/views/UserManagementView.jsx
import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Edit2,
  Trash2,
  Search,
  X,
  ShieldCheck,
  Scissors,
  ShoppingCart,
  Mail,
  UserCheck,
  CheckCircle,
  User,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';
import { db } from '../../db';

/**
 * Komponen Tampilan Manajemen Pengguna (Owner View)
 * @param {Object} props
 * @param {boolean} props.isOpen - Status tampilan aktif
 * @param {Object} props.currentUser - Data Owner login
 * @param {Function} props.showToast - Notifikasi toast
 * @param {Function} props.askConfirmation - Modal konfirmasi
 * @param {Function} props.setRefreshKey - Refresh trigger data app
 * @param {boolean} props.isMobile - Status mode mobile
 */
export default function UserManagementView({
  isOpen,
  currentUser,
  showToast,
  askConfirmation,
  setRefreshKey,
  isMobile
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('123456');
  const [formRole, setFormRole] = useState('WORKER');
  const [showPasswordToggle, setShowPasswordToggle] = useState(false);

  if (!isOpen) return null;

  // Fetch Users Data
  const users = db.get('users') || [];

  // Filter Users
  const filteredUsers = users.filter(u => {
    const matchesSearch =
      (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter ? u.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  // Role Counts
  const countOwner = users.filter(u => u.role === 'OWNER').length;
  const countCashier = users.filter(u => u.role === 'CASHIER').length;
  const countWorker = users.filter(u => u.role === 'WORKER').length;

  // Handlers
  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormName('');
    setFormEmail('');
    setFormPassword('123456');
    setFormRole('WORKER');
    setShowPasswordToggle(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (userItem) => {
    setEditingUser(userItem);
    setFormName(userItem.name || '');
    setFormEmail(userItem.email || '');
    setFormPassword(userItem.password || '123456');
    setFormRole(userItem.role || 'WORKER');
    setShowPasswordToggle(false);
    setIsModalOpen(true);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();

    if (!formName.trim() || !formEmail.trim() || !formPassword.trim()) {
      showToast('Nama, Email, dan Kata Sandi wajib diisi.', 'danger');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formEmail.trim())) {
      showToast('Format email tidak valid (contoh: penjahit@oliviana.com).', 'danger');
      return;
    }

    // Check duplicate email for new user
    const existing = users.find(
      u => u.email.toLowerCase() === formEmail.trim().toLowerCase() && (!editingUser || u.id !== editingUser.id)
    );

    if (existing) {
      showToast('Email ini sudah terdaftar untuk pengguna lain.', 'danger');
      return;
    }

    if (editingUser) {
      // Update
      db.update('users', editingUser.id, {
        name: formName.trim(),
        email: formEmail.trim(),
        password: formPassword.trim(),
        role: formRole
      });
      showToast(`Data pengguna "${formName.trim()}" berhasil diperbarui.`);
    } else {
      // Create new user
      const newId = `u-${Date.now()}`;
      db.insert('users', {
        id: newId,
        name: formName.trim(),
        email: formEmail.trim(),
        password: formPassword.trim(),
        role: formRole
      });
      showToast(`Pengguna baru "${formName.trim()}" berhasil ditambahkan!`);
    }

    setIsModalOpen(false);
    if (setRefreshKey) setRefreshKey(prev => prev + 1);
  };

  const handleDeleteUser = (userItem) => {
    if (currentUser && currentUser.id === userItem.id) {
      showToast('Anda tidak dapat menghapus akun Anda sendiri yang sedang login.', 'danger');
      return;
    }

    askConfirmation({
      title: 'Hapus Pengguna',
      message: `Apakah Anda yakin ingin menghapus pengguna "${userItem.name}" (${userItem.email})? Akses pengguna ini akan dicabut.`,
      confirmText: 'Ya, Hapus Pengguna',
      confirmVariant: 'danger',
      onConfirm: () => {
        const deleted = db.delete('users', userItem.id);
        if (deleted) {
          showToast(`Pengguna "${userItem.name}" telah dihapus.`);
          if (setRefreshKey) setRefreshKey(prev => prev + 1);
        } else {
          showToast('Gagal menghapus pengguna.', 'danger');
        }
      }
    });
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'OWNER':
        return (
          <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={12} /> Owner Toko
          </span>
        );
      case 'CASHIER':
        return (
          <span className="badge badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <ShoppingCart size={12} /> Kasir
          </span>
        );
      case 'WORKER':
        return (
          <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Scissors size={12} /> Penjahit
          </span>
        );
      default:
        return <span className="badge badge-secondary">{role}</span>;
    }
  };

  return (
    <div className="view-container" style={{ padding: isMobile ? '12px' : '24px' }}>
      {/* Header View */}
      <div
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: '12px',
          marginBottom: '20px'
        }}
      >
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <UserCheck size={24} style={{ color: 'var(--primary)' }} />
            Manajemen Pengguna
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '4px 0 0 0' }}>
            Kelola data akun Owner, Kasir, dan Penjahit (Worker) dalam satu antarmuka
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleOpenAddModal}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '600', width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}
        >
          <UserPlus size={16} /> Tambah Pengguna Baru
        </button>
      </div>

      {/* Summary Indicator Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="card" style={{ padding: '16px 20px', borderRadius: '12px', borderLeft: '4px solid var(--primary)', background: 'var(--bg-secondary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Total Pengguna</span>
            <Users size={20} style={{ color: 'var(--primary)' }} />
          </div>
          <h3 style={{ fontSize: '22px', fontWeight: 'bold', margin: '2px 0 0 0', color: 'var(--primary)' }}>
            {users.length} <span style={{ fontSize: '14px', fontWeight: 'normal', color: 'var(--text-muted)' }}>Akun</span>
          </h3>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Terdaftar di sistem Oliviana POS</span>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderRadius: '12px', borderLeft: '4px solid var(--success)', background: 'var(--bg-secondary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Penjahit (Worker)</span>
            <Scissors size={20} style={{ color: 'var(--success)' }} />
          </div>
          <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--success)', margin: '2px 0 0 0' }}>
            {countWorker} <span style={{ fontSize: '14px', fontWeight: 'normal', color: 'var(--text-muted)' }}>Orang</span>
          </h3>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Mencatat hasil borongan harian</span>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderRadius: '12px', borderLeft: '4px solid var(--info)', background: 'var(--bg-secondary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Kasir & Owner</span>
            <ShoppingCart size={20} style={{ color: 'var(--info)' }} />
          </div>
          <h3 style={{ fontSize: '22px', fontWeight: 'bold', margin: '2px 0 0 0', color: 'var(--info)' }}>
            {countOwner + countCashier} <span style={{ fontSize: '14px', fontWeight: 'normal', color: 'var(--text-muted)' }}>Akun</span>
          </h3>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{countOwner} Owner | {countCashier} Kasir</span>
        </div>
      </div>

      {/* Main Table & Filter Card */}
      <div className="card" style={{ padding: isMobile ? '14px' : '20px' }}>
        {/* Search & Filter Controls */}
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'stretch' : 'center', gap: '12px', marginBottom: '16px' }}>
          {/* Search Bar */}
          <div style={{ position: 'relative', flex: 1, maxWidth: isMobile ? '100%' : '320px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Cari nama atau email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '36px', paddingRight: searchTerm ? '32px' : '12px', height: '40px', borderRadius: '10px' }}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Role Filter Chips */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: isMobile ? '4px' : '0' }}>
            {[
              { key: '', label: 'Semua Role', count: users.length },
              { key: 'WORKER', label: 'Penjahit', count: countWorker },
              { key: 'CASHIER', label: 'Kasir', count: countCashier },
              { key: 'OWNER', label: 'Owner', count: countOwner }
            ].map(f => {
              const isSel = roleFilter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setRoleFilter(f.key)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: isSel ? '700' : '500',
                    border: isSel ? '1px solid var(--primary)' : '1px solid var(--card-border)',
                    background: isSel ? 'var(--primary)' : 'var(--bg-tertiary)',
                    color: isSel ? '#ffffff' : 'var(--text-primary)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {f.label} ({f.count})
                </button>
              );
            })}
          </div>
        </div>

        {/* User Table / Mobile Cards */}
        {filteredUsers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)' }}>
            <User size={40} style={{ opacity: 0.3, marginBottom: '8px' }} />
            <p>Tidak ada pengguna yang sesuai kriteria pencarian/filter.</p>
          </div>
        ) : isMobile ? (
          /* Mobile Card View (Aligned Layout) */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredUsers.map(u => (
              <div
                key={u.id}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  border: '1px solid var(--card-border)',
                  background: 'var(--bg-secondary)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                {/* Top Row: User Avatar, Name, Email, and Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: u.role === 'OWNER' ? 'var(--primary)' : u.role === 'CASHIER' ? 'var(--info)' : 'var(--success)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        flexShrink: 0
                      }}
                    >
                      {u.name ? u.name.charAt(0) : 'U'}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 2px 0', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {u.name}
                      </h4>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {u.email}
                      </div>
                    </div>
                  </div>

                  {/* Buttons aligned perfectly horizontally */}
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginLeft: '8px', flexShrink: 0 }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm btn-icon"
                      onClick={() => handleOpenEditModal(u)}
                      title="Edit Pengguna"
                      style={{ width: '36px', height: '36px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm btn-icon"
                      onClick={() => handleDeleteUser(u)}
                      title="Hapus Pengguna"
                      style={{ width: '36px', height: '36px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Bottom Row: Role Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--card-border)', paddingTop: '8px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>
                    Hak Akses:
                  </span>
                  {getRoleBadge(u.role)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Desktop Table View */
          <div className="table-responsive" style={{ borderRadius: '12px', border: '1px solid var(--card-border)' }}>
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-tertiary)' }}>
                  <th style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pengguna</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Login</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Role / Akses</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center', width: '120px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u, idx) => (
                  <tr
                    key={u.id}
                    style={{
                      borderBottom: '1px solid var(--card-border)',
                      background: idx % 2 === 0 ? 'var(--bg-secondary)' : 'var(--bg-primary)'
                    }}
                  >
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: u.role === 'OWNER' ? 'var(--primary)' : u.role === 'CASHIER' ? 'var(--info)' : 'var(--success)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '14px'
                          }}
                        >
                          {u.name ? u.name.charAt(0) : 'U'}
                        </div>
                        <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>
                          {u.name}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-secondary)', verticalAlign: 'middle' }}>
                      {u.email}
                    </td>
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                      {getRoleBadge(u.role)}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', verticalAlign: 'middle' }}>
                      <div style={{ display: 'inline-flex', gap: '6px', justifyContent: 'center', alignItems: 'center' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm btn-icon"
                          onClick={() => handleOpenEditModal(u)}
                          title="Edit Pengguna"
                          style={{ width: '34px', height: '34px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm btn-icon"
                          onClick={() => handleDeleteUser(u)}
                          title="Hapus Pengguna"
                          style={{ width: '34px', height: '34px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL ADD / EDIT USER */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '480px', width: '100%', padding: isMobile ? '16px' : '24px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCheck size={20} style={{ color: 'var(--primary)' }} />
                {editingUser ? 'Edit Data Pengguna' : 'Tambah Pengguna Baru'}
              </h3>
              <button type="button" className="btn btn-icon" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveUser}>
              <div className="modal-body" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                    Nama Lengkap <span style={{ color: 'var(--danger)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Rina (Penjahit)"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    style={{ height: '42px', borderRadius: '10px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                    Email Login <span style={{ color: 'var(--danger)' }}>*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Contoh: rina@oliviana.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    required
                    style={{ height: '42px', borderRadius: '10px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                    Kata Sandi (Password) <span style={{ color: 'var(--danger)' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPasswordToggle ? 'text' : 'password'}
                      className="form-control"
                      placeholder="Masukkan kata sandi login"
                      value={formPassword}
                      onChange={(e) => setFormPassword(e.target.value)}
                      required
                      style={{ height: '42px', borderRadius: '10px', paddingRight: '40px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordToggle(!showPasswordToggle)}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        color: 'var(--text-muted)'
                      }}
                      title={showPasswordToggle ? 'Sembunyikan Kata Sandi' : 'Tampilkan Kata Sandi'}
                    >
                      {showPasswordToggle ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                    Kata sandi untuk login karyawan ke dalam aplikasi (Default: 123456)
                  </span>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                    Role / Hak Akses Pengguna <span style={{ color: 'var(--danger)' }}>*</span>
                  </label>
                  <select
                    className="form-control"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    style={{ height: '42px', borderRadius: '10px', fontWeight: '600' }}
                  >
                    <option value="WORKER">✂️ Penjahit (Worker) - Input Hasil Kerja</option>
                    <option value="CASHIER">🛒 Kasir (Cashier) - Transaksi POS & Stok</option>
                    <option value="OWNER">🛡️ Owner (Pemilik Toko) - Akses Penuh & Laporan</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle size={16} /> Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
