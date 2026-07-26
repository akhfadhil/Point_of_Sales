// src/components/modals/AddProductVariantModal.jsx
import React from 'react';
import { X } from 'lucide-react';

/**
 * Modal Form Gabungan Tambah Produk Induk Baru & Varian Ukuran/Warna
 * @param {Object} props
 * @param {boolean} props.isOpen - Status tampil modal
 * @param {Array} props.allProducts - Daftar produk utama
 * @param {Array} props.allCategories - Daftar kategori
 * @param {string} props.newVariantProductId - ID produk terpilih atau 'NEW_PRODUCT'
 * @param {Function} props.setNewVariantProductId - Setter ID produk terpilih
 * @param {string} props.newProductName - Nama produk baru
 * @param {Function} props.setNewProductName - Setter nama produk baru
 * @param {string} props.newProductCategory - Kategori produk baru
 * @param {Function} props.setNewProductCategory - Setter kategori produk baru
 * @param {string} props.newProductDesc - Deskripsi produk baru
 * @param {Function} props.setNewProductDesc - Setter deskripsi produk baru
 * @param {string} props.newVariantSize - Ukuran varian baru
 * @param {Function} props.setNewVariantSize - Setter ukuran varian baru
 * @param {string} props.newVariantColor - Warna varian baru
 * @param {Function} props.setNewVariantColor - Setter warna varian baru
 * @param {string|number} props.newVariantSellingPrice - Harga jual varian
 * @param {Function} props.setNewVariantSellingPrice - Setter harga jual varian
 * @param {string|number} props.newVariantStock - Stok awal varian
 * @param {Function} props.setNewVariantStock - Setter stok awal varian
 * @param {Function} props.onSubmit - Function submit handler
 * @param {Function} props.onClose - Function callback menutup modal
 */
export default function AddProductVariantModal({
  isOpen,
  allProducts,
  allCategories,
  newVariantProductId,
  setNewVariantProductId,
  newProductName,
  setNewProductName,
  newProductCategory,
  setNewProductCategory,
  newProductDesc,
  setNewProductDesc,
  newVariantSize,
  setNewVariantSize,
  newVariantColor,
  setNewVariantColor,
  newVariantSellingPrice,
  setNewVariantSellingPrice,
  newVariantStock,
  setNewVariantStock,
  onSubmit,
  onClose
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '520px' }}>
        <header className="modal-header">
          <div>
            <h2 className="modal-title" style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Tambah Produk & Varian Baru</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>Buat produk baru atau tambahkan varian ukuran/warna baru.</p>
          </div>
          <button type="button" className="modal-close" onClick={onClose}><X size={20} /></button>
        </header>

        <form onSubmit={onSubmit}>
          {/* Product Selection / Creation Mode */}
          <div className="form-group">
            <label htmlFor="variant-prod" className="form-label" style={{ fontWeight: 'bold' }}>1. Pilih Produk Utama</label>
            <select
              id="variant-prod"
              className="form-control"
              value={newVariantProductId}
              onChange={(e) => setNewVariantProductId(e.target.value)}
              required
            >
              <option value="NEW_PRODUCT">+ Buat Produk Induk Baru</option>
              {allProducts.slice().sort((a, b) => a.name.localeCompare(b.name, 'id', { sensitivity: 'base' })).map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* If NEW_PRODUCT is selected, show Product creation fields */}
          {newVariantProductId === 'NEW_PRODUCT' && (
            <div style={{ border: '1px dashed var(--primary)', padding: '16px', borderRadius: '12px', marginBottom: '16px', backgroundColor: 'var(--bg-tertiary)' }}>
              <h3 style={{ fontSize: '13px', marginBottom: '12px', color: 'var(--primary)', fontWeight: 'bold' }}>Detail Produk Induk Baru</h3>

              <div className="form-group">
                <label htmlFor="prod-category" className="form-label">Kategori</label>
                <select
                  id="prod-category"
                  className="form-control"
                  value={newProductCategory}
                  onChange={(e) => setNewProductCategory(e.target.value)}
                  required={newVariantProductId === 'NEW_PRODUCT'}
                >
                  <option value="">Pilih Kategori...</option>
                  {allCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="prod-name" className="form-label">Nama Produk Utama</label>
                <input
                  id="prod-name"
                  type="text"
                  className="form-control"
                  placeholder="Misal: Hem Putih Panjang, Rok Span, Sabuk..."
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  required={newVariantProductId === 'NEW_PRODUCT'}
                />
              </div>

              <div className="form-group">
                <label htmlFor="prod-desc" className="form-label">Deskripsi (Opsional)</label>
                <textarea
                  id="prod-desc"
                  className="form-control"
                  placeholder="Catatan opsional..."
                  value={newProductDesc}
                  onChange={(e) => setNewProductDesc(e.target.value)}
                  rows="2"
                />
              </div>
            </div>
          )}

          {/* Varian details section */}
          <h3 style={{ fontSize: '14px', margin: '16px 0 12px', fontWeight: 'bold' }}>2. Detail Varian (Ukuran & Warna)</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="variant-size" className="form-label">Ukuran Varian</label>
              <input
                id="variant-size"
                type="text"
                className="form-control"
                placeholder="Misal: 2, 3, S, M, L, XL"
                value={newVariantSize}
                onChange={(e) => setNewVariantSize(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="variant-color" className="form-label">Warna Varian</label>
              <input
                id="variant-color"
                type="text"
                className="form-control"
                placeholder="Misal: Merah, Putih, Pramuka"
                value={newVariantColor}
                onChange={(e) => setNewVariantColor(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="variant-selling" className="form-label">Harga Jual Toko (Rp)</label>
            <input
              id="variant-selling"
              type="number"
              className="form-control"
              placeholder="Masukkan harga jual..."
              value={newVariantSellingPrice}
              onChange={(e) => setNewVariantSellingPrice(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="variant-stock" className="form-label">Stok Awal (Pcs)</label>
            <input
              id="variant-stock"
              type="number"
              className="form-control"
              value={newVariantStock}
              onChange={(e) => setNewVariantStock(e.target.value)}
              required
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Batal</button>
            <button type="submit" className="btn btn-primary">Simpan Produk & Varian</button>
          </div>
        </form>
      </div>
    </div>
  );
}
