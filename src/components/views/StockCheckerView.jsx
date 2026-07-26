// src/components/views/StockCheckerView.jsx
import React from 'react';
import { X } from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';
import { sortSizes, compareVariants } from '../../utils/sizeSorting';

/**
 * Komponen Tampilan Halaman Cek Stok Barang
 * @param {Object} props
 * @param {boolean} props.isOpen - Status apakah tab check-stock sedang aktif
 * @param {Array} props.allVariants - Daftar seluruh varian produk
 * @param {Array} props.allProducts - Daftar seluruh produk induk
 * @param {Array} props.allCategories - Daftar seluruh kategori
 * @param {string} props.stockProductFilter - Filter ID produk terpilih
 * @param {Function} props.setStockProductFilter - Setter filter produk
 * @param {string} props.stockSizeFilter - Filter ukuran terpilih
 * @param {Function} props.setStockSizeFilter - Setter filter ukuran
 * @param {string} props.stockColorFilter - Filter warna terpilih
 * @param {Function} props.setStockColorFilter - Setter filter warna
 * @param {string} props.stockSearchQuery - Kata kunci pencarian
 * @param {Function} props.setStockSearchQuery - Setter pencarian
 * @param {number} props.stockPage - Halaman pagination saat ini
 * @param {Function} props.setStockPage - Setter halaman pagination
 * @param {Object} props.currentUser - User yang sedang login
 * @param {boolean} props.isMobile - Status mode mobile
 */
export default function StockCheckerView({
  isOpen,
  allVariants,
  allProducts,
  allCategories,
  stockProductFilter,
  setStockProductFilter,
  stockSizeFilter,
  setStockSizeFilter,
  stockColorFilter,
  setStockColorFilter,
  stockSearchQuery,
  setStockSearchQuery,
  stockPage,
  setStockPage,
  currentUser,
  isMobile
}) {
  if (!isOpen) return null;

  const stockProductsList = allProducts.slice().sort((a, b) => String(a?.name || '').localeCompare(String(b?.name || ''), 'id', { sensitivity: 'base' }));
  const stockSizesList = sortSizes(Array.from(new Set(allVariants.map(v => v.size))));
  const stockColorsList = Array.from(new Set(allVariants.map(v => v.color))).sort((a, b) => String(a || '').localeCompare(String(b || ''), 'id', { sensitivity: 'base' }));

  const isAnyStockFilterActive = Boolean(stockProductFilter || stockSizeFilter || stockColorFilter || stockSearchQuery.trim());

  // Filter variants
  const filteredVariants = allVariants.filter(v => {
    const product = allProducts.find(p => p.id === v.product_id);
    if (!product) return false;

    if (stockProductFilter && v.product_id !== stockProductFilter) return false;
    if (stockSizeFilter && v.size !== stockSizeFilter) return false;
    if (stockColorFilter && v.color !== stockColorFilter) return false;

    if (stockSearchQuery.trim()) {
      const q = stockSearchQuery.toLowerCase().trim();
      const category = allCategories.find(c => c.id === product.category_id);
      const catName = category ? category.name.toLowerCase() : '';
      const searchStr = `${product.name} ${catName} ${v.sku} ${v.size} ${v.color}`.toLowerCase();
      if (!searchStr.includes(q)) return false;
    }

    return true;
  }).sort(compareVariants);

  // Pagination params
  const stockLimit = 10;
  const totalStockPages = Math.ceil(filteredVariants.length / stockLimit) || 1;
  const currentStockPage = Math.min(stockPage, totalStockPages);
  const paginatedVariants = filteredVariants.slice((currentStockPage - 1) * stockLimit, currentStockPage * stockLimit);

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Multi-Filter Bar */}
      <div className="card" style={{ padding: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', alignItems: 'end' }}>
          {/* 1. Filter Produk */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="stock-filter-prod" className="form-label" style={{ fontSize: '12px', fontWeight: 'bold' }}>Pilih Produk</label>
            <select
              id="stock-filter-prod"
              className="form-control"
              style={{ fontSize: '13px', padding: '8px 12px' }}
              value={stockProductFilter}
              onChange={(e) => { setStockProductFilter(e.target.value); setStockPage(1); }}
            >
              <option value="">-- Semua Produk --</option>
              {stockProductsList.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* 2. Filter Ukuran */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="stock-filter-size" className="form-label" style={{ fontSize: '12px', fontWeight: 'bold' }}>Pilih Ukuran</label>
            <select
              id="stock-filter-size"
              className="form-control"
              style={{ fontSize: '13px', padding: '8px 12px' }}
              value={stockSizeFilter}
              onChange={(e) => { setStockSizeFilter(e.target.value); setStockPage(1); }}
            >
              <option value="">-- Semua Ukuran --</option>
              {stockSizesList.map(sz => (
                <option key={sz} value={sz}>Ukuran {sz}</option>
              ))}
            </select>
          </div>

          {/* 3. Filter Warna */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="stock-filter-color" className="form-label" style={{ fontSize: '12px', fontWeight: 'bold' }}>Pilih Warna</label>
            <select
              id="stock-filter-color"
              className="form-control"
              style={{ fontSize: '13px', padding: '8px 12px' }}
              value={stockColorFilter}
              onChange={(e) => { setStockColorFilter(e.target.value); setStockPage(1); }}
            >
              <option value="">-- Semua Warna --</option>
              {stockColorsList.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>

          {/* 4. Keyword / SKU Search */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="stock-filter-search" className="form-label" style={{ fontSize: '12px', fontWeight: 'bold' }}>Kata Kunci / SKU</label>
            <div style={{ position: 'relative' }}>
              <input
                id="stock-filter-search"
                type="text"
                className="form-control"
                style={{ fontSize: '13px', padding: '8px 12px' }}
                placeholder="Cari SKU / nama..."
                value={stockSearchQuery}
                onChange={(e) => { setStockSearchQuery(e.target.value); setStockPage(1); }}
              />
            </div>
          </div>

          {/* Reset Filter Button */}
          {isAnyStockFilterActive && (
            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '12px', padding: '8px 14px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              onClick={() => {
                setStockProductFilter('');
                setStockSizeFilter('');
                setStockColorFilter('');
                setStockSearchQuery('');
                setStockPage(1);
              }}
            >
              <X size={14} /> Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Table / Cards Grid */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: 'var(--text-primary)' }}>Hasil Cek Stok Barang</h2>
          <span className="badge info">{filteredVariants.length} Varian Ditemukan</span>
        </div>

        {isMobile ? (
          /* Mobile & Tablet Card Grid View */
          <div className="mobile-only">
            {paginatedVariants.map(variant => {
              const product = allProducts.find(p => p.id === variant.product_id);
              const category = product ? allCategories.find(c => c.id === product.category_id) : null;
              const isLow = variant.stock_quantity < 5;

              return (
                <div
                  key={variant.id}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    border: '1px solid var(--card-border)',
                    backgroundColor: 'var(--card-bg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <code style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 'bold' }}>{variant.sku}</code>
                    <span className="badge info" style={{ fontSize: '10px' }}>{category ? category.name : 'Umum'}</span>
                  </div>

                  <h4 style={{ fontSize: '15px', fontWeight: 'bold', margin: 0 }}>{product ? product.name : 'Unknown'}</h4>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className="product-item-size" style={{ fontSize: '12px' }}>Ukuran {variant.size}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Warna: {variant.color}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-tertiary)', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', marginTop: '4px' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Harga Jual: </span>
                      <strong style={{ color: 'var(--primary)' }}>{formatRupiah(variant.selling_price)}</strong>
                    </div>
                    <span className={`badge ${variant.stock_quantity === 0 ? 'danger' : isLow ? 'warning' : 'success'}`}>
                      Stok: {variant.stock_quantity} Pcs
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredVariants.length === 0 && (
              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '13px' }}>
                Tidak ada varian stok yang cocok dengan filter.
              </div>
            )}
          </div>
        ) : (
          /* Desktop Table View */
          <div className="table-wrapper desktop-only">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ whiteSpace: 'nowrap' }}>SKU</th>
                  <th style={{ minWidth: '180px' }}>Nama Produk</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Ukuran</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Warna</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Harga Jual</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Jumlah Stok</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedVariants.map(variant => {
                  const product = allProducts.find(p => p.id === variant.product_id);
                  const isLow = variant.stock_quantity < 5;

                  return (
                    <tr key={variant.id}>
                      <td style={{ whiteSpace: 'nowrap' }}><code>{variant.sku}</code></td>
                      <td><strong>{product ? product.name : 'Unknown'}</strong></td>
                      <td style={{ whiteSpace: 'nowrap' }}><span className="product-item-size">{variant.size}</span></td>
                      <td style={{ whiteSpace: 'nowrap' }}>{variant.color}</td>
                      <td style={{ whiteSpace: 'nowrap' }}><strong>{formatRupiah(variant.selling_price)}</strong></td>
                      <td style={{ whiteSpace: 'nowrap' }}><strong>{variant.stock_quantity} Pcs</strong></td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        {variant.stock_quantity === 0 ? (
                          <span className="badge danger">Kosong</span>
                        ) : isLow ? (
                          <span className="badge warning">Kritis (&lt; 5)</span>
                        ) : (
                          <span className="badge success">Tersedia</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filteredVariants.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      Tidak ada varian stok yang cocok dengan filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Cek Stok */}
        {totalStockPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--card-border)', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Halaman {currentStockPage} dari {totalStockPages} ({filteredVariants.length} Varian)
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={currentStockPage === 1}
                onClick={() => setStockPage(prev => Math.max(1, prev - 1))}
              >
                ‹ Sebelumnya
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={currentStockPage === totalStockPages}
                onClick={() => setStockPage(prev => Math.min(totalStockPages, prev + 1))}
              >
                Selanjutnya ›
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
