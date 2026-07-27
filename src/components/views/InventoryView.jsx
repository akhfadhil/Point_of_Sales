// src/components/views/InventoryView.jsx
import React from 'react';
import { Plus, X, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';
import { sortSizes, compareVariants } from '../../utils/sizeSorting';

/**
 * Komponen Tampilan Halaman Manajemen Stok & Produk (Inventory)
 * @param {Object} props
 * @param {boolean} props.isOpen - Status apakah tab inventory sedang aktif
 * @param {Array} props.allProducts - Daftar seluruh produk induk
 * @param {Array} props.allCategories - Daftar seluruh kategori produk
 * @param {Array} props.allVariants - Daftar seluruh varian produk
 * @param {string} props.inventoryProductFilter - Filter ID produk terpilih
 * @param {Function} props.setInventoryProductFilter - Setter filter produk
 * @param {string} props.inventorySizeFilter - Filter ukuran terpilih
 * @param {Function} props.setInventorySizeFilter - Setter filter ukuran
 * @param {string} props.inventoryColorFilter - Filter warna terpilih
 * @param {Function} props.setInventoryColorFilter - Setter filter warna
 * @param {string} props.inventorySearchQuery - Kata kunci pencarian produk
 * @param {Function} props.setInventorySearchQuery - Setter kata kunci pencarian
 * @param {Array} props.expandedProductIds - Daftar ID produk yang di-expand accordion-nya
 * @param {Function} props.setExpandedProductIds - Setter ID produk expanded
 * @param {Function} props.setRestockProductId - Setter ID produk restock pabrik
 * @param {Function} props.setRestockSize - Setter ukuran restock pabrik
 * @param {Function} props.setRestockColor - Setter warna restock pabrik
 * @param {Function} props.setFactoryInQty - Setter qty restock pabrik
 * @param {Function} props.setFactoryInNotes - Setter catatan restock pabrik
 * @param {Function} props.setNewProductName - Setter nama produk baru
 * @param {Function} props.setNewProductDesc - Setter deskripsi produk baru
 * @param {Function} props.setNewProductCategory - Setter kategori produk baru
 * @param {Function} props.setNewVariantProductId - Setter ID produk varian baru
 * @param {Function} props.setNewVariantSize - Setter ukuran varian baru
 * @param {Function} props.setNewVariantColor - Setter warna varian baru
 * @param {Function} props.setNewVariantSellingPrice - Setter harga jual varian baru
 * @param {Function} props.setNewVariantStock - Setter stok varian baru
 * @param {Function} props.setActiveModal - Setter modal aktif
 * @param {Function} props.askConfirmation - Fungsi pemicu modal konfirmasi
 * @param {Function} props.showToast - Fungsi pemicu toast notifikasi
 * @param {Object} props.db - Instance database lokal
 * @param {Function} props.setRefreshKey - Setter penyegar data database
 * @param {boolean} props.isMobile - Status mode mobile
 */
export default function InventoryView({
  isOpen,
  allProducts,
  allCategories,
  allVariants,
  inventoryProductFilter,
  setInventoryProductFilter,
  inventorySizeFilter,
  setInventorySizeFilter,
  inventoryColorFilter,
  setInventoryColorFilter,
  inventorySearchQuery,
  setInventorySearchQuery,
  expandedProductIds,
  setExpandedProductIds,
  setRestockProductId,
  setRestockSize,
  setRestockColor,
  setFactoryInQty,
  setFactoryInNotes,
  setNewProductName,
  setNewProductDesc,
  setNewProductCategory,
  setNewVariantProductId,
  setNewVariantSize,
  setNewVariantColor,
  setNewVariantSellingPrice,
  setNewVariantStock,
  setActiveModal,
  askConfirmation,
  showToast,
  db,
  setRefreshKey,
  isMobile
}) {
  if (!isOpen) return null;

  // List options for filter selects
  const inventoryProductsList = allProducts.slice().sort((a, b) => String(a?.name || '').localeCompare(String(b?.name || ''), 'id', { sensitivity: 'base' }));
  const inventorySizesList = sortSizes(Array.from(new Set(allVariants.map(v => v.size))));
  const inventoryColorsList = Array.from(new Set(allVariants.map(v => v.color))).sort((a, b) => String(a || '').localeCompare(String(b || ''), 'id', { sensitivity: 'base' }));

  const isAnyFilterActive = Boolean(inventoryProductFilter || inventorySizeFilter || inventoryColorFilter || inventorySearchQuery.trim());

  // Filter Inventory products based on multi-filters
  const filteredInventoryProducts = allProducts.filter(product => {
    if (inventoryProductFilter && product.id !== inventoryProductFilter) return false;

    let pVariants = allVariants.filter(v => v.product_id === product.id);

    if (inventorySizeFilter) {
      pVariants = pVariants.filter(v => v.size === inventorySizeFilter);
    }

    if (inventoryColorFilter) {
      pVariants = pVariants.filter(v => v.color === inventoryColorFilter);
    }

    if (inventorySearchQuery.trim()) {
      const q = inventorySearchQuery.toLowerCase().trim();
      const category = allCategories.find(c => c.id === product.category_id);
      const catName = category ? category.name.toLowerCase() : '';
      const prodName = product.name.toLowerCase();
      const hasMatchingVariant = pVariants.some(v =>
        `${v.sku} ${v.size} ${v.color}`.toLowerCase().includes(q)
      );
      if (!prodName.includes(q) && !catName.includes(q) && !hasMatchingVariant) return false;
    }

    if ((inventorySizeFilter || inventoryColorFilter) && pVariants.length === 0) {
      return false;
    }

    return true;
  });

  const toggleExpand = (productId) => {
    setExpandedProductIds(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <section>
      {/* Header section action buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Manajemen Stok & Produk</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>Kelola daftar baju, varian ukuran/warna, dan pasokan pabrik.</p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-success"
            onClick={() => {
              if (allProducts.length > 0) {
                const firstProd = allProducts[0];
                setRestockProductId(firstProd.id);
                const pVars = allVariants.filter(v => v.product_id === firstProd.id);
                if (pVars.length > 0) {
                  setRestockSize(pVars[0].size);
                  setRestockColor(pVars[0].color);
                } else {
                  setRestockSize('');
                  setRestockColor('');
                }
              }
              setFactoryInQty('');
              setFactoryInNotes('Terima pasokan dari pabrik');
              setActiveModal('factory-inbound-unified');
            }}
          >
            <Plus size={16} /> Terima Barang Pabrik
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setNewProductName('');
              setNewProductDesc('');
              if (allCategories.length > 0) setNewProductCategory(allCategories[0].id);
              if (allProducts.length > 0) {
                setNewVariantProductId(allProducts[0].id);
              } else {
                setNewVariantProductId('NEW_PRODUCT');
              }
              setNewVariantSize('S');
              setNewVariantColor('Standard');
              setNewVariantSellingPrice('');
              setNewVariantStock('0');
              setActiveModal('add-product-variant');
            }}
          >
            <Plus size={16} /> Tambah Produk Baru
          </button>
        </div>
      </div>

      {/* Multi-Filter Card Bar */}
      <div className="card" style={{ marginBottom: '24px', padding: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', alignItems: 'end' }}>
          {/* 1. Filter Produk */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="inv-filter-prod" className="form-label" style={{ fontSize: '12px', fontWeight: 'bold' }}>Pilih Produk</label>
            <select
              id="inv-filter-prod"
              className="form-control"
              style={{ fontSize: '13px', padding: '8px 12px' }}
              value={inventoryProductFilter}
              onChange={(e) => setInventoryProductFilter(e.target.value)}
            >
              <option value="">-- Semua Produk --</option>
              {inventoryProductsList.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* 2. Filter Ukuran */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="inv-filter-size" className="form-label" style={{ fontSize: '12px', fontWeight: 'bold' }}>Pilih Ukuran</label>
            <select
              id="inv-filter-size"
              className="form-control"
              style={{ fontSize: '13px', padding: '8px 12px' }}
              value={inventorySizeFilter}
              onChange={(e) => setInventorySizeFilter(e.target.value)}
            >
              <option value="">-- Semua Ukuran --</option>
              {inventorySizesList.map(sz => (
                <option key={sz} value={sz}>Ukuran {sz}</option>
              ))}
            </select>
          </div>

          {/* 3. Filter Warna */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="inv-filter-color" className="form-label" style={{ fontSize: '12px', fontWeight: 'bold' }}>Pilih Warna</label>
            <select
              id="inv-filter-color"
              className="form-control"
              style={{ fontSize: '13px', padding: '8px 12px' }}
              value={inventoryColorFilter}
              onChange={(e) => setInventoryColorFilter(e.target.value)}
            >
              <option value="">-- Semua Warna --</option>
              {inventoryColorsList.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>

          {/* 4. Keyword / SKU Search */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="inv-filter-search" className="form-label" style={{ fontSize: '12px', fontWeight: 'bold' }}>Kata Kunci / SKU</label>
            <div style={{ position: 'relative' }}>
              <input
                id="inv-filter-search"
                type="text"
                className="form-control"
                style={{ fontSize: '13px', padding: '8px 12px' }}
                placeholder="Cari SKU / nama..."
                value={inventorySearchQuery}
                onChange={(e) => setInventorySearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Reset Filter Button */}
          {isAnyFilterActive && (
            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '12px', padding: '8px 14px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              onClick={() => {
                setInventoryProductFilter('');
                setInventorySizeFilter('');
                setInventoryColorFilter('');
                setInventorySearchQuery('');
              }}
            >
              <X size={14} /> Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* List Products and their variants */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredInventoryProducts.map(product => {
          const category = allCategories.find(c => c.id === product.category_id);
          let variants = allVariants.filter(v => v.product_id === product.id);
          if (inventorySizeFilter) variants = variants.filter(v => v.size === inventorySizeFilter);
          if (inventoryColorFilter) variants = variants.filter(v => v.color === inventoryColorFilter);
          variants.sort(compareVariants);

          const totalStock = variants.reduce((sum, v) => sum + v.stock_quantity, 0);
          const uniqueSizes = sortSizes(Array.from(new Set(variants.map(v => v.size))));
          const uniqueColors = Array.from(new Set(variants.map(v => v.color))).sort((a, b) => String(a || '').localeCompare(String(b || ''), 'id', { sensitivity: 'base' }));

          const isExpanded = expandedProductIds.includes(product.id) || isAnyFilterActive;

          return (
            <div key={product.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
              {/* Product Accordion Header */}
              <header
                onClick={() => toggleExpand(product.id)}
                style={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: isMobile ? 'stretch' : 'center',
                  justifyContent: 'space-between',
                  padding: isMobile ? '12px 14px' : '16px 20px',
                  gap: '12px',
                  cursor: 'pointer',
                  backgroundColor: isExpanded ? 'var(--bg-tertiary)' : 'var(--card-bg)',
                  borderBottom: isExpanded ? '1px solid var(--card-border)' : 'none',
                  transition: 'background-color 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span className="badge info" style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>{category ? category.name : 'Umum'}</span>
                    <h2 style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: 'bold', margin: 0, wordBreak: 'break-word' }}>{product.name}</h2>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span className="badge secondary" style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>{variants.length} Varian</span>
                    <span className="badge secondary" style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>{uniqueSizes.length} Ukuran</span>
                    <span className="badge secondary" style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>{uniqueColors.length} Warna</span>
                    <span className={`badge ${totalStock > 0 ? 'success' : 'danger'}`} style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>
                      Total Stok: {totalStock} Pcs
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isMobile ? 'space-between' : 'flex-end',
                    gap: '8px',
                    width: isMobile ? '100%' : 'auto',
                    paddingTop: isMobile ? '8px' : '0',
                    borderTop: isMobile ? '1px dashed var(--card-border)' : 'none'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => toggleExpand(product.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', flex: isMobile ? 1 : 'initial', justifyContent: 'center' }}
                  >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    {isExpanded ? 'Sembunyikan Varian' : `Tampilkan Varian (${variants.length})`}
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    style={{ fontSize: '12px' }}
                    onClick={() => {
                      askConfirmation({
                        title: `Hapus Produk "${product.name}"`,
                        message: `Apakah Anda yakin ingin menghapus produk "${product.name}" beserta seluruh varian ukurannya? Tindakan ini tidak dapat dibatalkan.`,
                        confirmText: 'Hapus Produk',
                        confirmVariant: 'danger',
                        onConfirm: () => {
                          db.delete('products', product.id);
                          variants.forEach(v => db.delete('product_variants', v.id));
                          setRefreshKey(prev => prev + 1);
                          showToast(`Produk "${product.name}" berhasil dihapus.`, 'info');
                        }
                      });
                    }}
                  >
                    Hapus
                  </button>
                </div>
              </header>

              {/* Dropdown Body: Variants */}
              {isExpanded && (
                <div style={{ padding: '16px' }}>
                  {product.description && (
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                      {product.description}
                    </p>
                  )}

                  {/* Desktop vs Mobile View */}
                  {isMobile ? (
                    /* Mobile View Card Grid */
                    <div className="mobile-only">
                      {variants.map(variant => (
                        <div
                          key={variant.id}
                          style={{
                            padding: '12px 14px',
                            borderRadius: '8px',
                            border: '1px solid var(--card-border)',
                            backgroundColor: 'var(--card-bg)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                            <code style={{ fontSize: '12px', fontWeight: 'bold' }}>{variant.sku}</code>
                            <span className={`badge ${variant.stock_quantity < 5 ? 'danger' : 'success'}`} style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>
                              Stok: {variant.stock_quantity} Pcs
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                            <div>
                              <span style={{ fontWeight: 'bold' }}>Ukuran: {variant.size}</span>
                              <span style={{ color: 'var(--text-muted)', margin: '0 6px' }}>•</span>
                              <span>Warna: {variant.color}</span>
                            </div>
                            <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                              {formatRupiah(variant.selling_price)}
                            </span>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '6px', borderTop: '1px dashed var(--card-border)' }}>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              style={{ fontSize: '11px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                              onClick={() => {
                                askConfirmation({
                                  title: `Hapus Varian SKU ${variant.sku}`,
                                  message: `Apakah Anda yakin ingin menghapus varian ukuran ${variant.size} (${variant.color}) ini?`,
                                  confirmText: 'Hapus Varian',
                                  confirmVariant: 'danger',
                                  onConfirm: () => {
                                    db.delete('product_variants', variant.id);
                                    setRefreshKey(prev => prev + 1);
                                    showToast(`Varian SKU ${variant.sku} berhasil dihapus.`, 'info');
                                  }
                                });
                              }}
                            >
                              <Trash2 size={12} /> Hapus Varian
                            </button>
                          </div>
                        </div>
                      ))}

                      {variants.length === 0 && (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '16px', fontSize: '13px' }}>
                          Belum ada varian ukuran/warna untuk produk ini.
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Desktop View Table */
                    <div className="table-wrapper desktop-only">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>SKU</th>
                            <th>Ukuran</th>
                            <th>Warna</th>
                            <th>Harga Jual (Toko)</th>
                            <th>Sisa Stok</th>
                            <th style={{ textAlign: 'right' }}>Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {variants.map(variant => (
                            <tr key={variant.id}>
                              <td><code style={{ fontSize: '13px' }}>{variant.sku}</code></td>
                              <td><strong>{variant.size}</strong></td>
                              <td>{variant.color}</td>
                              <td>{formatRupiah(variant.selling_price)}</td>
                              <td>
                                <span className={`badge ${variant.stock_quantity < 5 ? 'danger' : 'success'}`}>
                                  {variant.stock_quantity} Pcs
                                </span>
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm btn-icon"
                                  title="Hapus Varian"
                                  onClick={() => {
                                    askConfirmation({
                                      title: `Hapus Varian SKU ${variant.sku}`,
                                      message: `Apakah Anda yakin ingin menghapus varian ukuran ${variant.size} (${variant.color}) ini?`,
                                      confirmText: 'Hapus Varian',
                                      confirmVariant: 'danger',
                                      onConfirm: () => {
                                        db.delete('product_variants', variant.id);
                                        setRefreshKey(prev => prev + 1);
                                        showToast(`Varian SKU ${variant.sku} berhasil dihapus.`, 'info');
                                      }
                                    });
                                  }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                          {variants.length === 0 && (
                            <tr>
                              <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '16px' }}>
                                Belum ada varian ukuran/warna untuk produk ini.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredInventoryProducts.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            {inventorySearchQuery ? `Tidak ada produk yang cocok dengan "${inventorySearchQuery}".` : 'Belum ada produk terdaftar. Klik "Tambah Produk Baru" untuk memulai.'}
          </div>
        )}
      </div>
    </section>
  );
}
