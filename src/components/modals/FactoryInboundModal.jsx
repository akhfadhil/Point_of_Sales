// src/components/modals/FactoryInboundModal.jsx
import React from 'react';
import { X } from 'lucide-react';

/**
 * Modal Form Penerimaan Pasokan Barang Masuk dari Pabrik Konveksi (Restock)
 * @param {Object} props
 * @param {boolean} props.isOpen - Status tampil modal
 * @param {Array} props.allProducts - Daftar produk
 * @param {Array} props.allVariants - Daftar varian produk
 * @param {string} props.restockProductId - ID produk yang dipilih
 * @param {Function} props.setRestockProductId - Setter ID produk terpilih
 * @param {string} props.restockSize - Ukuran terpilih
 * @param {Function} props.setRestockSize - Setter ukuran terpilih
 * @param {string} props.restockColor - Warna terpilih
 * @param {Function} props.setRestockColor - Setter warna terpilih
 * @param {string|number} props.factoryInQty - Jumlah barang masuk
 * @param {Function} props.setFactoryInQty - Setter jumlah barang masuk
 * @param {string} props.factoryInNotes - Catatan tambahan
 * @param {Function} props.setFactoryInNotes - Setter catatan tambahan
 * @param {Object} props.db - Instance database lokal
 * @param {Object} props.currentUser - User yang sedang login
 * @param {Function} props.setRefreshKey - Function trigger refresh data
 * @param {Function} props.showToast - Function callback notifikasi toast
 * @param {Function} props.onClose - Function callback menutup modal
 */
export default function FactoryInboundModal({
  isOpen,
  allProducts,
  allVariants,
  restockProductId,
  setRestockProductId,
  restockSize,
  setRestockSize,
  restockColor,
  setRestockColor,
  factoryInQty,
  setFactoryInQty,
  factoryInNotes,
  setFactoryInNotes,
  db,
  currentUser,
  setRefreshKey,
  showToast,
  onClose
}) {
  if (!isOpen) return null;

  const prod = allProducts.find(p => p.id === restockProductId) || (allProducts[0] || null);
  const prodVariants = prod ? allVariants.filter(v => v.product_id === prod.id) : [];

  const uniqueSizes = Array.from(new Set(prodVariants.map(v => v.size)));
  const currentSize = restockSize || (uniqueSizes[0] || '');

  const variantsForSize = prodVariants.filter(v => v.size === currentSize);
  const uniqueColors = Array.from(new Set(variantsForSize.map(v => v.color)));
  const currentColor = restockColor || (uniqueColors[0] || '');

  const targetVariant = prodVariants.find(v => v.size === currentSize && v.color === currentColor)
    || variantsForSize[0]
    || prodVariants[0]
    || null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!targetVariant) {
      showToast('Silakan pilih varian produk.', 'warning');
      return;
    }
    const qty = Number(factoryInQty);
    if (qty <= 0) {
      showToast('Jumlah barang masuk harus lebih dari 0.', 'warning');
      return;
    }
    db.addStockFromFactory(targetVariant.id, qty, factoryInNotes, currentUser ? currentUser.id : null);
    onClose();
    setRefreshKey(prev => prev + 1);
    showToast(`Stok ${qty} Pcs untuk ${prod ? prod.name : ''} (${targetVariant.size} - ${targetVariant.color}) berhasil ditambahkan!`, 'success');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '520px' }}>
        <header className="modal-header">
          <div>
            <h2 className="modal-title" style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Terima Barang dari Pabrik (Restock)</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>Tambah pasokan stok masuk dari konveksi pabrik.</p>
          </div>
          <button type="button" className="modal-close" onClick={onClose}><X size={20} /></button>
        </header>

        <form onSubmit={handleSubmit}>
          {/* 1. Pilih Produk Utama */}
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label htmlFor="restock-product-select" className="form-label" style={{ fontWeight: 'bold' }}>1. Pilih Produk Utama</label>
            <select
              id="restock-product-select"
              className="form-control"
              value={prod ? prod.id : ''}
              onChange={(e) => {
                setRestockProductId(e.target.value);
                const pVars = allVariants.filter(v => v.product_id === e.target.value);
                if (pVars.length > 0) {
                  setRestockSize(pVars[0].size);
                  setRestockColor(pVars[0].color);
                } else {
                  setRestockSize('');
                  setRestockColor('');
                }
              }}
              required
            >
              {allProducts.slice().sort((a, b) => a.name.localeCompare(b.name, 'id', { sensitivity: 'base' })).map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* 2. Pilih Ukuran */}
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ fontWeight: 'bold' }}>2. Pilih Ukuran</label>
            {uniqueSizes.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {uniqueSizes.map(sz => {
                  const isSelected = currentSize === sz;
                  return (
                    <button
                      type="button"
                      key={sz}
                      onClick={() => {
                        setRestockSize(sz);
                        const colors = Array.from(new Set(prodVariants.filter(v => v.size === sz).map(v => v.color)));
                        if (colors.length > 0) setRestockColor(colors[0]);
                      }}
                      className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '6px 14px', fontSize: '13px', fontWeight: 'bold', borderRadius: '8px' }}
                    >
                      Ukuran {sz}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Tidak ada varian ukuran untuk produk ini.</div>
            )}
          </div>

          {/* 3. Pilih Warna */}
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ fontWeight: 'bold' }}>3. Pilih Warna</label>
            {uniqueColors.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {uniqueColors.map(col => {
                  const isSelected = currentColor === col;
                  const v = prodVariants.find(x => x.size === currentSize && x.color === col);
                  return (
                    <button
                      type="button"
                      key={col}
                      onClick={() => setRestockColor(col)}
                      className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                      style={{
                        padding: '6px 14px',
                        fontSize: '13px',
                        borderRadius: '20px',
                        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--card-border)'
                      }}
                    >
                      {col} {v ? `(Stok: ${v.stock_quantity} Pcs)` : ''}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Pilih ukuran terlebih dahulu.</div>
            )}
          </div>

          {/* Target Variant Info Box */}
          {targetVariant && (
            <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>SKU Terpilih:</span>
                <code>{targetVariant.sku}</code>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>Stok Toko Saat Ini:</span>
                <span className="badge success">{targetVariant.stock_quantity} Pcs</span>
              </div>
            </div>
          )}

          {/* 4. Input Jumlah Masuk */}
          <div className="form-group">
            <label htmlFor="unified-factory-qty" className="form-label" style={{ fontWeight: 'bold' }}>4. Jumlah Barang Masuk (Pcs)</label>
            <input
              id="unified-factory-qty"
              type="number"
              min="1"
              className="form-control"
              placeholder="Masukkan jumlah pasokan pcs..."
              value={factoryInQty}
              onChange={(e) => setFactoryInQty(e.target.value)}
              required
            />
          </div>

          {/* 5. Catatan */}
          <div className="form-group">
            <label htmlFor="unified-factory-notes" className="form-label">Catatan Tambahan (Opsional)</label>
            <input
              id="unified-factory-notes"
              type="text"
              className="form-control"
              placeholder="Misal: Surat Jalan No. 102, Pabrik Mas Joko..."
              value={factoryInNotes}
              onChange={(e) => setFactoryInNotes(e.target.value)}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Batal</button>
            <button type="submit" className="btn btn-primary" disabled={!targetVariant}>Simpan Stok Masuk</button>
          </div>
        </form>
      </div>
    </div>
  );
}
