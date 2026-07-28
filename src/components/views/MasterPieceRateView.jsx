// src/components/views/MasterPieceRateView.jsx
import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Scissors, Users, X, DollarSign, Briefcase } from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';
import { db } from '../../db';

/**
 * Komponen Tampilan Pengaturan Master Tarif Borongan & Daftar Penjahit (Owner View)
 * @param {Object} props
 * @param {boolean} props.isOpen - Status apakah tab master borongan aktif
 * @param {Function} props.showToast - Notifikasi toast
 * @param {Function} props.askConfirmation - Modal konfirmasi
 * @param {Function} props.setRefreshKey - Refresh trigger data app
 * @param {boolean} props.isMobile - Tampilan mobile
 */
export default function MasterPieceRateView({
  isOpen,
  showToast,
  askConfirmation,
  setRefreshKey,
  isMobile
}) {
  // Active sub-tab state
  const [activeSubTab, setActiveSubTab] = useState('rates'); // 'rates' | 'workers'

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductFilter, setSelectedProductFilter] = useState('');

  // Modal State for Piece Rate Item (Create & Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [formProductId, setFormProductId] = useState('');
  const [formItemName, setFormItemName] = useState('');
  const [formRatePrice, setFormRatePrice] = useState('');

  // Modal State for Worker User (Create)
  const [isWorkerModalOpen, setIsWorkerModalOpen] = useState(false);
  const [formWorkerName, setFormWorkerName] = useState('');
  const [formWorkerEmail, setFormWorkerEmail] = useState('');

  if (!isOpen) return null;

  // Data Fetching
  const pieceRateItems = db.getPieceRateItems();
  const products = db.get('products') || [];
  const users = db.get('users') || [];
  const workers = users.filter(u => u.role === 'WORKER');

  // Filtered Piece Rate Items
  const filteredPieceRates = pieceRateItems.filter(item => {
    const matchesSearch =
      item.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.product_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProduct = !selectedProductFilter || item.product_id === selectedProductFilter;
    return matchesSearch && matchesProduct;
  });

  // Calculate Summary Stats
  const totalItemsCount = pieceRateItems.length;
  const avgRatePrice = totalItemsCount > 0
    ? Math.round(pieceRateItems.reduce((acc, curr) => acc + Number(curr.rate_price), 0) / totalItemsCount)
    : 0;

  // Handler Modal Open for New Piece Rate Item
  const handleOpenAddModal = () => {
    setEditingItemId(null);
    setFormProductId(products.length > 0 ? products[0].id : '');
    setFormItemName('');
    setFormRatePrice('');
    setIsModalOpen(true);
  };

  // Handler Modal Open for Edit Piece Rate Item
  const handleOpenEditModal = (item) => {
    setEditingItemId(item.id);
    setFormProductId(item.product_id || '');
    setFormItemName(item.item_name || '');
    setFormRatePrice(String(item.rate_price || ''));
    setIsModalOpen(true);
  };

  // Submit Handler for Piece Rate Item
  const handleSavePieceRate = (e) => {
    e.preventDefault();
    if (!formItemName.trim() || !formRatePrice || Number(formRatePrice) <= 0) {
      showToast('Mohon lengkapi nama pekerjaan dan tarif dengan benar.', 'danger');
      return;
    }

    if (editingItemId) {
      db.updatePieceRateItem(editingItemId, {
        product_id: formProductId,
        item_name: formItemName.trim(),
        rate_price: Number(formRatePrice)
      });
      showToast('Tarif borongan berhasil diperbarui!');
    } else {
      db.addPieceRateItem(formProductId, formItemName.trim(), Number(formRatePrice));
      showToast('Tarif borongan baru berhasil ditambahkan!');
    }

    setIsModalOpen(false);
    if (setRefreshKey) setRefreshKey(prev => prev + 1);
  };

  // Delete Handler for Piece Rate Item
  const handleDeletePieceRate = (item) => {
    askConfirmation({
      title: 'Hapus Tarif Borongan',
      message: `Apakah Anda yakin ingin menghapus tarif "${item.item_name}" (${formatRupiah(item.rate_price)})?`,
      confirmText: 'Ya, Hapus',
      confirmVariant: 'danger',
      onConfirm: () => {
        db.deletePieceRateItem(item.id);
        showToast('Tarif borongan berhasil dihapus.');
        if (setRefreshKey) setRefreshKey(prev => prev + 1);
      }
    });
  };

  // Submit Handler for New Worker
  const handleSaveWorker = (e) => {
    e.preventDefault();
    if (!formWorkerName.trim() || !formWorkerEmail.trim()) {
      showToast('Nama dan email penjahit harus diisi.', 'danger');
      return;
    }

    const existing = users.find(u => u.email.toLowerCase() === formWorkerEmail.trim().toLowerCase());
    if (existing) {
      showToast('Email penjahit sudah terdaftar.', 'danger');
      return;
    }

    db.insert('users', {
      name: formWorkerName.trim(),
      email: formWorkerEmail.trim().toLowerCase(),
      role: 'WORKER'
    });

    showToast(`Penjahit ${formWorkerName.trim()} berhasil ditambahkan!`);
    setIsWorkerModalOpen(false);
    setFormWorkerName('');
    setFormWorkerEmail('');
    if (setRefreshKey) setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="view-container" style={{ padding: isMobile ? '12px' : '24px' }}>
      {/* Header Title */}
      <div className="dashboard-header" style={{ marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <Scissors size={24} style={{ color: 'var(--primary)' }} />
            Master Tarif Borongan & Penjahit
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '4px 0 0 0' }}>
            Pengaturan harga per jenis pekerjaan konveksi & manajemen akun penjahit
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: isMobile ? '12px' : '0' }}>
          {activeSubTab === 'rates' ? (
            <button type="button" className="btn btn-primary" onClick={handleOpenAddModal}>
              <Plus size={16} /> Tambah Tarif Borongan
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={() => setIsWorkerModalOpen(true)}>
              <Plus size={16} /> Tambah Penjahit Baru
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: '16px',
          marginBottom: '20px'
        }}
      >
        <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <Briefcase size={22} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total Master Tarif</span>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '2px 0 0 0' }}>{totalItemsCount} Pekerjaan</h3>
          </div>
        </div>

        <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <DollarSign size={22} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Rata-rata Tarif / Pcs</span>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '2px 0 0 0' }}>{formatRupiah(avgRatePrice)}</h3>
          </div>
        </div>

        <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
            <Users size={22} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total Penjahit Aktif</span>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '2px 0 0 0' }}>{workers.length} Orang</h3>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '20px' }}>
        <button
          type="button"
          className={`btn ${activeSubTab === 'rates' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('rates')}
        >
          <Scissors size={16} /> Tarif Borongan ({pieceRateItems.length})
        </button>
        <button
          type="button"
          className={`btn ${activeSubTab === 'workers' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('workers')}
        >
          <Users size={16} /> Daftar Penjahit ({workers.length})
        </button>
      </div>

      {/* SUB-TAB 1: TARIF BORONGAN */}
      {activeSubTab === 'rates' && (
        <div className="card" style={{ padding: isMobile ? '12px' : '20px' }}>
          {/* Filters */}
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '12px', marginBottom: '16px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '36px' }}
                placeholder="Cari jenis pekerjaan atau produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ minWidth: '220px' }}>
              <select
                className="form-control"
                value={selectedProductFilter}
                onChange={(e) => setSelectedProductFilter(e.target.value)}
              >
                <option value="">-- Semua Jenis Pakaian --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table / Mobile Cards */}
          {filteredPieceRates.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)' }}>
              <Scissors size={40} style={{ opacity: 0.3, marginBottom: '8px' }} />
              <p>Belum ada tarif borongan yang sesuai filter.</p>
            </div>
          ) : isMobile ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredPieceRates.map(item => (
                <div key={item.id} className="card" style={{ padding: '14px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span className="badge badge-secondary" style={{ fontSize: '11px', marginBottom: '4px', display: 'inline-block' }}>
                        {item.product_name}
                      </span>
                      <h4 style={{ fontSize: '15px', fontWeight: 'bold', margin: '2px 0 6px' }}>{item.item_name}</h4>
                      <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--primary)' }}>
                        {formatRupiah(item.rate_price)} <span style={{ fontSize: '11px', fontWeight: 'normal', color: 'var(--text-muted)' }}>/ pcs</span>
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm btn-icon"
                        onClick={() => handleOpenEditModal(item)}
                        title="Edit Tarif"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm btn-icon"
                        onClick={() => handleDeletePieceRate(item)}
                        title="Hapus Tarif"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Jenis Pakaian (Produk)</th>
                    <th>Nama Pekerjaan Borongan</th>
                    <th style={{ textAlign: 'right' }}>Tarif (Rp / Pcs)</th>
                    <th style={{ textAlign: 'center', width: '120px' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPieceRates.map(item => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: '600' }}>{item.product_name}</td>
                      <td>{item.item_name}</td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold', color: 'var(--primary)' }}>
                        {formatRupiah(item.rate_price)}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm btn-icon"
                            onClick={() => handleOpenEditModal(item)}
                            title="Edit Tarif"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm btn-icon"
                            onClick={() => handleDeletePieceRate(item)}
                            title="Hapus Tarif"
                          >
                            <Trash2 size={14} />
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
      )}

      {/* SUB-TAB 2: DAFTAR PENJAHIT */}
      {activeSubTab === 'workers' && (
        <div className="card" style={{ padding: isMobile ? '12px' : '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>Daftar Penjahit / Pekerja Konveksi</h3>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => setIsWorkerModalOpen(true)}>
              <Plus size={14} /> Penjahit Baru
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {workers.map(w => (
              <div key={w.id} className="card" style={{ padding: '16px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '18px'
                  }}
                >
                  {w.name ? w.name.charAt(0).toUpperCase() : 'W'}
                </div>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 2px 0' }}>{w.name}</h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{w.email}</span>
                  <div style={{ marginTop: '4px' }}>
                    <span className="badge badge-success" style={{ fontSize: '10px' }}>WORKER / PENJAHIT</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH / EDIT TARIF BORONGAN */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '480px', width: '100%' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
                {editingItemId ? 'Edit Tarif Borongan' : 'Tambah Tarif Borongan Baru'}
              </h3>
              <button type="button" className="btn btn-icon" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSavePieceRate}>
              <div className="modal-body">
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label">Jenis Pakaian (Produk)</label>
                  <select
                    className="form-control"
                    value={formProductId}
                    onChange={(e) => setFormProductId(e.target.value)}
                    required
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label">Nama Pekerjaan Borongan</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Ngobras & Sambung Badan, Masang Resleting"
                    value={formItemName}
                    onChange={(e) => setFormItemName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tarif Pekerjaan per Pcs (Rp)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Contoh: 3500"
                    min="1"
                    value={formRatePrice}
                    onChange={(e) => setFormRatePrice(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Tarif
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH PENJAHIT BARU */}
      {isWorkerModalOpen && (
        <div className="modal-overlay" onClick={() => setIsWorkerModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '440px', width: '100%' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Tambah Penjahit Baru</h3>
              <button type="button" className="btn btn-icon" onClick={() => setIsWorkerModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveWorker}>
              <div className="modal-body">
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label">Nama Lengkap Penjahit</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Rina Susanti"
                    value={formWorkerName}
                    onChange={(e) => setFormWorkerName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Login Penjahit</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Contoh: rina@oliviana.com"
                    value={formWorkerEmail}
                    onChange={(e) => setFormWorkerEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsWorkerModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Tambah Penjahit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
