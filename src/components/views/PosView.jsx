// src/components/views/PosView.jsx
import React from 'react';
import { Search, ShoppingCart, Trash2, X } from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';
import { sortSizes } from '../../utils/sizeSorting';

/**
 * Komponen Tampilan Utama Kasir POS (Katalog Produk & Keranjang Belanja Split-Screen)
 * @param {Object} props
 * @param {boolean} props.isOpen - Status apakah tab POS sedang aktif
 * @param {string} props.mobilePosActiveView - Tampilan aktif pada HP ('products' | 'cart')
 * @param {Function} props.setMobilePosActiveView - Setter tampilan HP
 * @param {string} props.posSearchQuery - Kata kunci pencarian produk POS
 * @param {Function} props.setPosSearchQuery - Setter kata kunci pencarian
 * @param {string} props.selectedCategoryFilter - Kategori filter terpilih
 * @param {Function} props.setSelectedCategoryFilter - Setter kategori filter
 * @param {Array} props.allProducts - Daftar seluruh produk induk
 * @param {Array} props.allCategories - Daftar seluruh kategori
 * @param {Array} props.allVariants - Daftar seluruh varian
 * @param {Array} props.allCustomers - Daftar seluruh pelanggan
 * @param {Function} props.getAdjustedPrice - Fungsi penyesuaian harga berdasarkan tipe pelanggan
 * @param {Function} props.setPosSelectedProduct - Setter produk terpilih untuk modal varian
 * @param {Function} props.setPosModalVariantId - Setter ID varian terpilih di modal
 * @param {Function} props.setPosModalSize - Setter ukuran terpilih di modal
 * @param {Function} props.setPosModalColor - Setter warna terpilih di modal
 * @param {Function} props.setPosModalQty - Setter qty terpilih di modal
 * @param {Function} props.setActiveModal - Setter modal aktif
 * @param {Array} props.cart - Daftar barang di keranjang belanja
 * @param {Function} props.setCart - Setter keranjang belanja
 * @param {Function} props.updateCartQty - Fungsi ubah qty item keranjang
 * @param {Function} props.removeFromCart - Fungsi hapus item keranjang
 * @param {string} props.customerType - Tipe pelanggan ('UMUM' | 'GURU' | 'GROSIR')
 * @param {Function} props.setCustomerType - Setter tipe pelanggan
 * @param {string} props.selectedCustomerId - ID pelanggan terpilih
 * @param {Function} props.setSelectedCustomerId - Setter ID pelanggan terpilih
 * @param {string} props.customerSearchQuery - Kata kunci pencarian pelanggan
 * @param {Function} props.setCustomerSearchQuery - Setter pencarian pelanggan
 * @param {boolean} props.isAddingCustomer - Status form tambah pelanggan baru
 * @param {Function} props.setIsAddingCustomer - Setter status form pelanggan baru
 * @param {string} props.newCustomerName - Input nama pelanggan baru
 * @param {Function} props.setNewCustomerName - Setter input nama pelanggan baru
 * @param {string} props.newCustomerPhone - Input HP pelanggan baru
 * @param {Function} props.setNewCustomerPhone - Setter input HP pelanggan baru
 * @param {Function} props.handleAddCustomer - Handler submit tambah pelanggan baru
 * @param {string} props.paymentMethod - Metode pembayaran ('CASH' | 'QRIS' | 'TRANSFER' | 'DEBT')
 * @param {Function} props.setPaymentMethod - Setter metode pembayaran
 * @param {string} props.paidAmount - Nominal uang dibayar
 * @param {Function} props.setPaidAmount - Setter nominal uang dibayar
 * @param {Function} props.getCartTotal - Fungsi hitung total belanja keranjang
 * @param {Function} props.handleCheckout - Handler submit transaksi checkout
 * @param {boolean} props.isMobile - Status mode mobile
 */
export default function PosView({
  isOpen,
  mobilePosActiveView,
  setMobilePosActiveView,
  posSearchQuery,
  setPosSearchQuery,
  selectedCategoryFilter,
  setSelectedCategoryFilter,
  allProducts,
  allCategories,
  allVariants,
  allCustomers,
  getAdjustedPrice,
  setPosSelectedProduct,
  setPosModalVariantId,
  setPosModalSize,
  setPosModalColor,
  setPosModalQty,
  setActiveModal,
  cart,
  setCart,
  updateCartQty,
  removeFromCart,
  customerType,
  setCustomerType,
  selectedCustomerId,
  setSelectedCustomerId,
  customerSearchQuery,
  setCustomerSearchQuery,
  isAddingCustomer,
  setIsAddingCustomer,
  newCustomerName,
  setNewCustomerName,
  newCustomerPhone,
  setNewCustomerPhone,
  handleAddCustomer,
  paymentMethod,
  setPaymentMethod,
  paidAmount,
  setPaidAmount,
  getCartTotal,
  handleCheckout,
  isMobile
}) {
  if (!isOpen) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Segmented Control untuk Mobile View POS */}
      <div className="pos-mobile-toggle segmented-control">
        <button
          type="button"
          className={`segmented-option ${mobilePosActiveView === 'products' ? 'active' : ''}`}
          onClick={() => setMobilePosActiveView('products')}
        >
          Katalog Produk ({allProducts.length})
        </button>
        <button
          type="button"
          className={`segmented-option ${mobilePosActiveView === 'cart' ? 'active' : ''}`}
          onClick={() => setMobilePosActiveView('cart')}
        >
          Keranjang ({cart.reduce((s, i) => s + i.quantity, 0)})
        </button>
      </div>

      <section className={`pos-layout ${mobilePosActiveView === 'products' ? 'show-products' : 'show-cart'}`}>

        {/* Products Panel (Left) */}
        <div className="pos-products-panel">
          <div className="search-filter-bar">
            <div className="search-input-wrapper">
              <input
                type="text"
                className="form-control"
                placeholder="Cari cepat nama seragam, SKU, atau ukuran... (misal: S, M, Hem)"
                value={posSearchQuery}
                onChange={(e) => setPosSearchQuery(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '12px', color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Filter Chips Kategori */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '16px' }}>
            <button
              type="button"
              className={`btn btn-sm ${selectedCategoryFilter === '' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedCategoryFilter('')}
              style={{ borderRadius: '20px', whiteSpace: 'nowrap' }}
            >
              Semua Kategori ({allProducts.length})
            </button>
            {allCategories.map(cat => {
              const count = allProducts.filter(p => p.category_id === cat.id).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`btn btn-sm ${selectedCategoryFilter === cat.id ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedCategoryFilter(cat.id)}
                  style={{ borderRadius: '20px', whiteSpace: 'nowrap' }}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Grid of Product Cards */}
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px', color: 'var(--text-secondary)' }}>
            Pilih Jenis Produk Seragam:
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(160px, 1fr))' : 'repeat(auto-fill, minmax(190px, 1fr))', gap: '14px', marginBottom: '20px' }}>
            {(() => {
              const displayedProds = allProducts.filter(prod => {
                if (selectedCategoryFilter && prod.category_id !== selectedCategoryFilter) return false;
                if (posSearchQuery) {
                  const q = posSearchQuery.toLowerCase();
                  const prodVariants = allVariants.filter(v => v.product_id === prod.id);
                  const matchName = prod.name.toLowerCase().includes(q);
                  const matchCategory = (allCategories.find(c => c.id === prod.category_id)?.name || '').toLowerCase().includes(q);
                  const matchVariant = prodVariants.some(v =>
                    v.sku.toLowerCase().includes(q) ||
                    v.size.toLowerCase().includes(q) ||
                    v.color.toLowerCase().includes(q)
                  );
                  return matchName || matchCategory || matchVariant;
                }
                return true;
              });

              return (
                <>
                  {displayedProds.map(prod => {
                    const category = allCategories.find(c => c.id === prod.category_id);
                    const prodVariants = allVariants.filter(v => v.product_id === prod.id);
                    const totalStock = prodVariants.reduce((sum, v) => sum + v.stock_quantity, 0);
                    const prices = prodVariants.map(v => getAdjustedPrice(v.selling_price));
                    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
                    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
                    const priceRangeStr = prices.length === 0
                      ? '-'
                      : (minPrice === maxPrice ? formatRupiah(minPrice) : `${formatRupiah(minPrice)} - ${formatRupiah(maxPrice)}`);

                    const uniqueSizes = sortSizes(Array.from(new Set(prodVariants.map(v => v.size))));
                    const sizeDisplayStr = uniqueSizes.length === 0
                      ? 'Belum ada varian'
                      : (uniqueSizes.length <= 4
                        ? `${uniqueSizes.length} Ukuran (${uniqueSizes.join(', ')})`
                        : `${uniqueSizes.length} Ukuran (${uniqueSizes.slice(0, 4).join(', ')}, +${uniqueSizes.length - 4} lainnya)`
                      );

                    return (
                      <div
                        key={prod.id}
                        className="card"
                        onClick={() => {
                          setPosSelectedProduct(prod);
                          if (prodVariants.length > 0) {
                            setPosModalVariantId(prodVariants[0].id);
                            setPosModalSize(prodVariants[0].size);
                            setPosModalColor(prodVariants[0].color);
                          } else {
                            setPosModalVariantId('');
                            setPosModalSize('');
                            setPosModalColor('');
                          }
                          setPosModalQty(1);
                          setActiveModal('pos-select-item');
                        }}
                        style={{
                          cursor: 'pointer',
                          border: '1px solid var(--card-border)',
                          transition: 'transform 0.15s, box-shadow 0.15s',
                          padding: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          justify: 'space-between',
                          backgroundColor: 'var(--card-bg)'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                            <span className="badge info" style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>{category ? category.name : 'Umum'}</span>
                            <span className={`badge ${totalStock > 0 ? 'success' : 'danger'}`} style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>
                              Stok: {totalStock} Pcs
                            </span>
                          </div>
                          <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '6px', color: 'var(--text-primary)', wordBreak: 'break-word' }}>
                            {prod.name}
                          </h4>
                          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 12px 0', wordBreak: 'break-word' }}>
                            {sizeDisplayStr}
                          </p>
                        </div>

                        <div style={{ borderTop: '1px dashed var(--card-border)', paddingTop: '10px', marginTop: '4px' }}>
                          <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '8px' }}>
                            {priceRangeStr}
                          </div>
                          <button type="button" className="btn btn-primary btn-sm" style={{ width: '100%', fontSize: '12px' }}>
                            + Pilih Size & Jumlah
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {displayedProds.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      Tidak ada produk seragam yang ditemukan.
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>

        {/* Cart Panel (Right) */}
        <form onSubmit={handleCheckout} className="pos-cart-panel">
          <header className="cart-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingCart size={18} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>Keranjang Belanja</h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge info" style={{ padding: '4px 10px', fontSize: '12px' }}>
                {cart.reduce((s, i) => s + i.quantity, 0)} Item
              </span>
              {cart.length > 0 && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '3px 8px', fontSize: '11px', color: 'var(--danger)' }}
                  onClick={() => setCart([])}
                  title="Kosongkan Keranjang"
                >
                  Kosongkan
                </button>
              )}
            </div>
          </header>

          <div className="cart-items-list">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-info">
                  <span className="cart-item-title">{item.name}</span>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', margin: '2px 0 6px' }}>
                    <span className="cart-item-sku">{item.sku}</span>
                    {item.color && item.color !== 'Standard' && (
                      <span className="badge info" style={{ fontSize: '10px', padding: '1px 6px' }}>{item.color}</span>
                    )}
                  </div>
                  <div className="cart-item-qty-control">
                    <button type="button" className="qty-btn" onClick={() => updateCartQty(item.id, -1)}>-</button>
                    <span className="qty-val">{item.quantity}</span>
                    <button type="button" className="qty-btn" onClick={() => updateCartQty(item.id, 1)}>+</button>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginLeft: '6px' }}>
                      @ {formatRupiah(getAdjustedPrice(item.base_selling_price))}
                    </span>
                  </div>
                </div>

                <div className="cart-item-price-info">
                  <button type="button" className="cart-item-delete" title="Hapus Item" onClick={() => removeFromCart(item.id)}>
                    <Trash2 size={16} />
                  </button>
                  <span className="cart-item-subtotal">{formatRupiah(getAdjustedPrice(item.base_selling_price) * item.quantity)}</span>
                </div>
              </div>
            ))}

            {cart.length === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', minHeight: '200px', color: 'var(--text-muted)' }}>
                <ShoppingCart size={44} style={{ marginBottom: '12px', opacity: 0.4 }} />
                <p style={{ fontWeight: '600', fontSize: '14px' }}>Keranjang masih kosong</p>
                <p style={{ fontSize: '12px', marginTop: '4px', textAlign: 'center' }}>Klik produk di sebelah kiri untuk memasukkan barang ke keranjang.</p>
              </div>
            )}
          </div>

          {/* Checkout Form Actions */}
          {cart.length > 0 && (
            <div className="cart-summary">

              {/* Tipe Pelanggan & Skema Harga Selector */}
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label">Tipe Pelanggan & Skema Harga</label>
                <div className="segmented-control">
                  <button
                    type="button"
                    className={`segmented-option ${customerType === 'UMUM' ? 'active' : ''}`}
                    onClick={() => setCustomerType('UMUM')}
                  >
                    Umum (+15rb)
                  </button>
                  <button
                    type="button"
                    className={`segmented-option ${customerType === 'GURU' ? 'active' : ''}`}
                    onClick={() => setCustomerType('GURU')}
                  >
                    Guru (+5rb)
                  </button>
                  <button
                    type="button"
                    className={`segmented-option ${customerType === 'GROSIR' ? 'active' : ''}`}
                    onClick={() => setCustomerType('GROSIR')}
                  >
                    Grosir (Base)
                  </button>
                </div>
              </div>

              {/* Select Customer */}
              <div className="form-group" style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label htmlFor="select-customer" className="form-label">Pelanggan</label>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '2px 8px', fontSize: '11px' }}
                    onClick={() => setIsAddingCustomer(!isAddingCustomer)}
                  >
                    {isAddingCustomer ? 'Batal' : '+ Pelanggan Baru'}
                  </button>
                </div>

                {isAddingCustomer ? (
                  <div className="card" style={{ padding: '12px', marginTop: '6px' }}>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Nama Pelanggan"
                        value={newCustomerName}
                        onChange={(e) => setNewCustomerName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="No HP"
                        value={newCustomerPhone}
                        onChange={(e) => setNewCustomerPhone(e.target.value)}
                      />
                    </div>
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleAddCustomer}>Simpan</button>
                  </div>
                ) : (
                  <div style={{ position: 'relative' }}>
                    {selectedCustomerId ? (
                      // Tampilan pelanggan terpilih
                      (() => {
                        const selCustomer = allCustomers.find(c => c.id === selectedCustomerId);
                        return (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justify: 'space-between',
                            padding: '10px 14px',
                            borderRadius: 'var(--border-radius-md)',
                            border: '1px solid var(--primary)',
                            backgroundColor: 'var(--primary-light)',
                            color: 'var(--primary)',
                            fontWeight: '600'
                          }}>
                            <span>{selCustomer ? `${selCustomer.name} ${selCustomer.total_debt > 0 ? `(Utang: ${formatRupiah(selCustomer.total_debt)})` : ''}` : 'Umum (Walk-in)'}</span>
                            <button
                              type="button"
                              onClick={() => { setSelectedCustomerId(''); setCustomerSearchQuery(''); }}
                              style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        );
                      })()
                    ) : (
                      // Kolom input pencarian pelanggan
                      <>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Ketik nama / HP pelanggan..."
                            value={customerSearchQuery}
                            onChange={(e) => setCustomerSearchQuery(e.target.value)}
                            style={{ paddingRight: '32px' }}
                          />
                          {customerSearchQuery && (
                            <button
                              type="button"
                              onClick={() => setCustomerSearchQuery('')}
                              style={{ position: 'absolute', right: '10px', top: '12px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>

                        {/* Rekomendasi Hasil Pencarian Pelanggan */}
                        {customerSearchQuery && (
                          <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            backgroundColor: 'var(--card-bg)',
                            border: '1px solid var(--card-border)',
                            borderRadius: 'var(--border-radius-md)',
                            marginTop: '4px',
                            zIndex: 100,
                            maxHeight: '200px',
                            overflowY: 'auto',
                            boxShadow: 'var(--card-shadow)'
                          }}>
                            {allCustomers.filter(c => c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) || (c.phone_number && c.phone_number.includes(customerSearchQuery))).length > 0 ? (
                              allCustomers
                                .filter(c => c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) || (c.phone_number && c.phone_number.includes(customerSearchQuery)))
                                .map(c => (
                                  <div
                                    key={c.id}
                                    onClick={() => {
                                      setSelectedCustomerId(c.id);
                                      setCustomerSearchQuery('');
                                    }}
                                    style={{
                                      padding: '10px 14px',
                                      cursor: 'pointer',
                                      borderBottom: '1px solid var(--card-border)',
                                      fontSize: '13px',
                                      display: 'flex',
                                      justify: 'space-between',
                                      alignItems: 'center'
                                    }}
                                    className="customer-search-item"
                                  >
                                    <div>
                                      <strong>{c.name}</strong>
                                      {c.phone_number && <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{c.phone_number}</div>}
                                    </div>
                                    {c.total_debt > 0 && <span style={{ color: 'var(--danger)', fontWeight: '600' }}>Utang: {formatRupiah(c.total_debt)}</span>}
                                  </div>
                                ))
                            ) : (
                              <div style={{ padding: '12px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
                                Pelanggan tidak ditemukan.
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="form-group" style={{ marginBottom: '8px' }}>
                <label className="form-label">Metode Pembayaran</label>
                <div className="segmented-control">
                  <button
                    type="button"
                    className={`segmented-option ${paymentMethod === 'CASH' ? 'active' : ''}`}
                    onClick={() => { setPaymentMethod('CASH'); setPaidAmount(''); }}
                  >
                    Tunai
                  </button>
                  <button
                    type="button"
                    className={`segmented-option ${paymentMethod === 'QRIS' ? 'active' : ''}`}
                    onClick={() => { setPaymentMethod('QRIS'); setPaidAmount(getCartTotal()); }}
                  >
                    QRIS
                  </button>
                  <button
                    type="button"
                    className={`segmented-option ${paymentMethod === 'TRANSFER' ? 'active' : ''}`}
                    onClick={() => { setPaymentMethod('TRANSFER'); setPaidAmount(getCartTotal()); }}
                  >
                    Transfer
                  </button>
                  <button
                    type="button"
                    className={`segmented-option ${paymentMethod === 'DEBT' ? 'active' : ''}`}
                    onClick={() => { setPaymentMethod('DEBT'); setPaidAmount('0'); }}
                  >
                    Utang/Kasbon
                  </button>
                </div>
              </div>

              {/* Numeric Inputs */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="paid-amount" className="form-label">Uang Dibayar</label>
                  <input
                    id="paid-amount"
                    type="number"
                    className="form-control"
                    placeholder="Masukkan nominal..."
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                    required={paymentMethod !== 'DEBT'}
                  />
                </div>
                {paymentMethod !== 'DEBT' && paidAmount && (
                  <div className="form-group">
                    <label className="form-label">Kembalian</label>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', paddingTop: '8px', color: 'var(--success)' }}>
                      {formatRupiah(Math.max(0, Number(paidAmount) - getCartTotal()))}
                    </div>
                  </div>
                )}
              </div>

              <div className="cart-summary-row total">
                <span>Total Belanja</span>
                <span>{formatRupiah(getCartTotal())}</span>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                Proses Transaksi
              </button>
            </div>
          )}
        </form>
      </section>
    </div>
  );
}
