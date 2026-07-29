// src/components/views/MasterPieceRateView.jsx
import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Scissors, Users, X, DollarSign, Briefcase } from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';
import { db } from '../../db';

const GARMENT_TYPES = [
  'Rok Panggul Karet',
  'Rok Panggul SMLXL',
  'Celana Panjang Levis',
  'Rok Wiru',
  'Hem Panjang',
  'Celana Tutup',
  'Celana Panjang Karet',
  'Hem Lengan Pendek',
  'Rok Panggul (16)'
];

/**
 * Komponen Tampilan Pengaturan Master Tarif & Daftar Penjahit (Owner View)
 */
export default function MasterPieceRateView({
  isOpen,
  showToast,
  askConfirmation,
  setRefreshKey,
  isMobile
}) {
  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductFilter, setSelectedProductFilter] = useState('');

  // Modal State for Piece Rate Item (Create & Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [formProductId, setFormProductId] = useState('');
  const [formItemName, setFormItemName] = useState('');
  const [formRatePrice, setFormRatePrice] = useState('');

  if (!isOpen) return null;

  // Data Fetching
  const pieceRateItems = db.getPieceRateItems();
  const products = db.get('products') || [];

  // Filtered Piece Rate Items
  const filteredPieceRates = pieceRateItems.filter(item => {
    const matchesSearch =
      item.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.product_name && item.product_name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesProduct = !selectedProductFilter ||
      item.product_id === selectedProductFilter ||
      item.garment_type === selectedProductFilter ||
      item.product_name === selectedProductFilter;
    return matchesSearch && matchesProduct;
  });

  // Calculate Metrics
  const totalItemsCount = pieceRateItems.length;
  const avgRatePrice =
    totalItemsCount > 0
      ? Math.round(
        pieceRateItems.reduce((acc, item) => acc + Number(item.rate_price || 0), 0) /
        totalItemsCount
      )
      : 0;

  // Handlers for Piece Rate Items
  const handleOpenAddModal = () => {
    setEditingItemId(null);
    setFormProductId(products[0]?.id || '');
    setFormItemName('');
    setFormRatePrice('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItemId(item.id);
    setFormProductId(item.product_id);
    setFormItemName(item.item_name);
    setFormRatePrice(item.rate_price);
    setIsModalOpen(true);
  };

  const handleSavePieceRate = (e) => {
    e.preventDefault();

    if (!formProductId || !formItemName.trim() || !formRatePrice) {
      showToast('Seluruh kolom formulir tarif borongan harus diisi.', 'danger');
      return;
    }

    if (editingItemId) {
      db.update('piece_rate_items', editingItemId, {
        product_id: formProductId,
        item_name: formItemName.trim(),
        rate_price: Number(formRatePrice)
      });
      showToast(`Tarif borongan "${formItemName.trim()}" berhasil diperbarui.`);
    } else {
      db.insert('piece_rate_items', {
        product_id: formProductId,
        item_name: formItemName.trim(),
        rate_price: Number(formRatePrice)
      });
      showToast(`Tarif borongan baru "${formItemName.trim()}" berhasil ditambahkan.`);
    }

    setIsModalOpen(false);
    if (setRefreshKey) setRefreshKey(prev => prev + 1);
  };

  const handleDeletePieceRate = (item) => {
    askConfirmation({
      title: 'Hapus Tarif Borongan',
      message: `Apakah Anda yakin ingin menghapus tarif "${item.item_name}" (${formatRupiah(item.rate_price)})?`,
      confirmText: 'Ya, Hapus Tarif',
      confirmVariant: 'danger',
      onConfirm: () => {
        const deleted = db.delete('piece_rate_items', item.id);
        if (deleted) {
          showToast(`Tarif borongan "${item.item_name}" telah dihapus.`);
          if (setRefreshKey) setRefreshKey(prev => prev + 1);
        } else {
          showToast('Gagal menghapus tarif borongan.', 'danger');
        }
      }
    });
  };

  return (
    <div className="view-container" style={{ padding: isMobile ? '12px' : '24px' }}>
      {/* Header Title */}
      <div className="dashboard-header" style={{ marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <Scissors size={24} style={{ color: 'var(--primary)' }} />
            Master Tarif
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '4px 0 0 0' }}>
            Pengaturan harga ongkos jahit per jenis pekerjaan konveksi
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: isMobile ? '12px' : '0' }}>
          <button type="button" className="btn btn-primary" onClick={handleOpenAddModal}>
            <Plus size={16} /> Tambah Tarif Borongan
          </button>
        </div>
      </div>      {/* TARIF BORONGAN LIST */}
      <div className="card" style={{ padding: isMobile ? '14px' : '22px', borderRadius: '16px', border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)' }}>

        {/* Controls: Search Bar & Preset Chips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>

          {/* Search Input with Clear Action */}
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-control"
              style={{
                paddingLeft: '40px',
                paddingRight: searchQuery ? '40px' : '14px',
                height: '44px',
                fontSize: '14px',
                borderRadius: '12px'
              }}
              placeholder="Cari jenis pekerjaan jahit (misal: Ngobras, Krah, Resleting...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Garment Type Filter: Mobile Dropdown Select vs Desktop Button Grid */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Pilih Jenis Pakaian Garment:
            </div>

            {isMobile ? (
              /* Mobile View: Modern Dropdown Select (No Horizontal Scroll) */
              <select
                className="form-control"
                style={{
                  fontSize: '14px',
                  height: '44px',
                  fontWeight: '600',
                  borderRadius: '12px',
                  borderColor: selectedProductFilter ? 'var(--primary)' : 'var(--card-border)',
                  background: selectedProductFilter ? 'var(--primary-light)' : 'var(--bg-secondary)',
                  color: selectedProductFilter ? 'var(--primary)' : 'var(--text-primary)'
                }}
                value={selectedProductFilter}
                onChange={(e) => setSelectedProductFilter(e.target.value)}
              >
                <option value="">-- Semua Jenis Pakaian --</option>
                {GARMENT_TYPES.map(gType => (
                  <option key={gType} value={gType}>
                    {gType}
                  </option>
                ))}
              </select>
            ) : (
              /* Desktop/Laptop View: Wrapped Button Chips (No Horizontal Scroll) */
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  alignItems: 'center'
                }}
              >
                <button
                  type="button"
                  onClick={() => setSelectedProductFilter('')}
                  style={{
                    padding: '7px 16px',
                    borderRadius: '30px',
                    fontSize: '13px',
                    fontWeight: !selectedProductFilter ? '700' : '500',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: !selectedProductFilter ? '1px solid var(--primary)' : '1px solid var(--card-border)',
                    background: !selectedProductFilter ? 'var(--primary)' : 'var(--bg-tertiary)',
                    color: !selectedProductFilter ? '#ffffff' : 'var(--text-primary)',
                    boxShadow: !selectedProductFilter ? '0 4px 12px var(--primary-glow)' : 'none'
                  }}
                >
                  Semua Jenis
                </button>

                {GARMENT_TYPES.map(gType => {
                  const isSelected = selectedProductFilter === gType;
                  return (
                    <button
                      key={gType}
                      type="button"
                      onClick={() => setSelectedProductFilter(gType)}
                      style={{
                        padding: '7px 16px',
                        borderRadius: '30px',
                        fontSize: '13px',
                        fontWeight: isSelected ? '700' : '500',
                        whiteSpace: 'nowrap',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        border: isSelected ? '1px solid var(--primary)' : '1px solid var(--card-border)',
                        background: isSelected ? 'var(--primary)' : 'var(--bg-tertiary)',
                        color: isSelected ? '#ffffff' : 'var(--text-primary)',
                        boxShadow: isSelected ? '0 4px 12px var(--primary-glow)' : 'none'
                      }}
                    >
                      {gType}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Table / Mobile Cards */}
        {filteredPieceRates.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 10px', color: 'var(--text-muted)' }}>
            <Scissors size={48} style={{ opacity: 0.25, marginBottom: '10px' }} />
            <p style={{ fontWeight: '500', fontSize: '14px' }}>Tidak ada tarif borongan yang sesuai pencarian/filter.</p>
          </div>
        ) : isMobile ? (
          /* Mobile Cards View */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredPieceRates.map(item => (
              <div
                key={item.id}
                className="card"
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  border: '1px solid var(--card-border)',
                  borderLeft: '4px solid var(--primary)',
                  background: 'var(--bg-secondary)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, paddingRight: '8px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: 'var(--primary)',
                        background: 'var(--primary-light)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        marginBottom: '6px',
                        display: 'inline-block'
                      }}
                    >
                      {item.product_name}
                    </span>
                    <h4 style={{ fontSize: '15px', fontWeight: '700', margin: '4px 0 8px 0', color: 'var(--text-primary)' }}>
                      {item.item_name}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                      <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--success)' }}>
                        {formatRupiah(item.rate_price)}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/ pcs</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm btn-icon"
                      onClick={() => handleOpenEditModal(item)}
                      title="Edit Tarif"
                      style={{ width: '34px', height: '34px' }}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm btn-icon"
                      onClick={() => handleDeletePieceRate(item)}
                      title="Hapus Tarif"
                      style={{ width: '34px', height: '34px' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
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
                  <th style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', width: '220px' }}>Jenis Pakaian</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Proses / Pekerjaan Jahit</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right', width: '180px' }}>Tarif (Rp / Pcs)</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center', width: '110px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredPieceRates.map((item, idx) => (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: '1px solid var(--card-border)',
                      background: idx % 2 === 0 ? 'var(--bg-secondary)' : 'var(--bg-primary)'
                    }}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: '700',
                          color: 'var(--primary)',
                          background: 'var(--primary-light)',
                          padding: '3px 10px',
                          borderRadius: '8px',
                          display: 'inline-block'
                        }}
                      >
                        {item.product_name}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: '600', fontSize: '14px' }}>
                      {item.item_name}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '800', fontSize: '15px', color: 'var(--success)' }}>
                      {formatRupiah(item.rate_price)}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
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
    </div>
  );
}
