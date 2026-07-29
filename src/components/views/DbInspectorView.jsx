// src/components/views/DbInspectorView.jsx
import React from 'react';
import { formatRupiah } from '../../utils/formatters';
import { getSupabaseConfigStatus, testSupabaseConnection } from '../../supabaseClient';

export default function DbInspectorView({
  isOpen,
  selectedDbTable,
  setSelectedDbTable,
  db,
  isMobile
}) {
  const [syncStatus, setSyncStatus] = React.useState(null);
  const [isSyncing, setIsSyncing] = React.useState(false);

  if (!isOpen) return null;

  const configStatus = getSupabaseConfigStatus();

  const handleTestConnection = async () => {
    setIsSyncing(true);
    setSyncStatus('Menguji koneksi ke Supabase...');
    const res = await testSupabaseConnection();
    setSyncStatus(res.message);
    setIsSyncing(false);
  };

  const handleForceSync = async () => {
    setIsSyncing(true);
    setSyncStatus('Mengunggah seluruh data ke Supabase Database Cloud...');
    const res = await db.forceSyncAllToSupabase();
    setSyncStatus(res.message);
    setIsSyncing(false);
  };

  const tableData = db.get(selectedDbTable) || [];

  return (
    <section className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 className="card-title" style={{ margin: 0 }}>Inspektor Database & Supabase Sync</h2>
        <div style={{ display: 'flex', gap: '8px', width: isMobile ? '100%' : 'auto', flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary"
            onClick={handleTestConnection}
            disabled={isSyncing}
            style={{ fontSize: '13px', padding: '6px 14px' }}
          >
            🔍 Tes Koneksi
          </button>
          <button
            className="btn btn-primary"
            onClick={handleForceSync}
            disabled={isSyncing}
            style={{ fontSize: '13px', padding: '6px 14px' }}
          >
            {isSyncing ? '🔄 Syncing...' : '⚡ Upload Semua Data'}
          </button>
          <select
            className="form-control"
            style={{ width: isMobile ? '100%' : '230px', maxWidth: '100%' }}
            value={selectedDbTable}
            onChange={(e) => setSelectedDbTable(e.target.value)}
          >
            <option value="users">Tabel: users (Pengguna)</option>
            <option value="categories">Tabel: categories (Kategori)</option>
            <option value="products">Tabel: products (Produk Induk)</option>
            <option value="product_variants">Tabel: product_variants (Varian & Harga)</option>
            <option value="stock_movements">Tabel: stock_movements (Mutasi Stok)</option>
            <option value="customers">Tabel: customers (Pelanggan & Utang)</option>
            <option value="sales">Tabel: sales (Header Transaksi)</option>
            <option value="sale_items">Tabel: sale_items (Detail Transaksi)</option>
            <option value="debt_payments">Tabel: debt_payments (Cicilan Kasbon)</option>
          </select>
        </div>
      </div>

      {syncStatus && (
        <div style={{ padding: '10px 14px', marginBottom: '16px', borderRadius: '6px', backgroundColor: 'var(--bg-accent, #eef2ff)', color: 'var(--text-primary)', fontSize: '13px', fontWeight: '500' }}>
          {syncStatus}
        </div>
      )}

      <div style={{ padding: '12px 14px', marginBottom: '16px', borderRadius: '8px', backgroundColor: configStatus.hasUrl && configStatus.hasKey ? '#ecfdf5' : '#fff1f2', border: `1px solid ${configStatus.hasUrl && configStatus.hasKey ? '#a7f3d0' : '#fecdd3'}`, color: 'var(--text-primary)', fontSize: '13px' }}>
        <strong>Status Koneksi Supabase: </strong>
        {configStatus.hasUrl && configStatus.hasKey ? (
          <span style={{ color: '#047857', fontWeight: 'bold' }}>🟢 TERDETEKSI ({configStatus.urlPreview})</span>
        ) : (
          <span style={{ color: '#b91c1c', fontWeight: 'bold' }}>🔴 BELUM AKTIF. (URL: {configStatus.urlPreview} | Key: {configStatus.keyPreview})</span>
        )}
        {(!configStatus.hasUrl || !configStatus.hasKey) && (
          <div style={{ marginTop: '6px', fontSize: '12px', color: '#9f1239' }}>
            💡 <em>Pastikan Environment Variables di Vercel dinamai <code>VITE_SUPABASE_URL</code> dan <code>VITE_SUPABASE_ANON_KEY</code>, lalu lakukan <strong>Redeploy</strong> di Dashboard Vercel.</em>
          </div>
        )}
      </div>

      {typeof window !== 'undefined' && window.__lastSupabaseError && (
        <div style={{ padding: '10px 14px', marginBottom: '16px', borderRadius: '6px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', fontSize: '12px' }}>
          <strong>⚠️ Log Error Supabase Terakhir:</strong> {window.__lastSupabaseError}
        </div>
      )}

      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        Berikut adalah data yang tersimpan di memori aplikasi (<code>localStorage.getItem('oliviana_db')</code>).
      </p>

      <div className="table-wrapper">
        <table className="table" style={{ fontSize: '13px' }}>
          <thead>
            {selectedDbTable === 'users' && (
              <tr>
                <th>ID</th>
                <th>Nama</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            )}
            {selectedDbTable === 'categories' && (
              <tr>
                <th>ID</th>
                <th>Nama Kategori</th>
              </tr>
            )}
            {selectedDbTable === 'products' && (
              <tr>
                <th>ID</th>
                <th>Kategori ID</th>
                <th>Nama Produk</th>
                <th>Deskripsi</th>
              </tr>
            )}
            {selectedDbTable === 'product_variants' && (
              <tr>
                <th>ID</th>
                <th>Product ID</th>
                <th>SKU</th>
                <th>Ukuran</th>
                <th>Warna</th>
                <th>Harga Modal</th>
                <th>Harga Jual</th>
                <th>Stok</th>
              </tr>
            )}
            {selectedDbTable === 'stock_movements' && (
              <tr>
                <th>ID</th>
                <th>Variant ID</th>
                <th>Tipe</th>
                <th>Jumlah</th>
                <th>Catatan</th>
                <th>User ID</th>
                <th>Waktu</th>
              </tr>
            )}
            {selectedDbTable === 'customers' && (
              <tr>
                <th>ID</th>
                <th>Nama</th>
                <th>No HP</th>
                <th>Total Utang</th>
                <th>Terdaftar</th>
              </tr>
            )}
            {selectedDbTable === 'sales' && (
              <tr>
                <th>ID</th>
                <th>Invoice No</th>
                <th>Kasir ID</th>
                <th>Customer ID</th>
                <th>Total</th>
                <th>Metode</th>
                <th>Status</th>
                <th>Dibayar</th>
                <th>Kembalian</th>
                <th>Waktu</th>
              </tr>
            )}
            {selectedDbTable === 'sale_items' && (
              <tr>
                <th>ID</th>
                <th>Sale ID</th>
                <th>Variant ID</th>
                <th>Qty</th>
                <th>Harga Unit</th>
                <th>Subtotal</th>
              </tr>
            )}
            {selectedDbTable === 'debt_payments' && (
              <tr>
                <th>ID</th>
                <th>Customer ID</th>
                <th>Jumlah Bayar</th>
                <th>Metode</th>
                <th>Kasir ID</th>
                <th>Waktu</th>
              </tr>
            )}
          </thead>
          <tbody>
            {tableData.map((row, idx) => (
              <tr key={row.id || idx}>
                {selectedDbTable === 'users' && (
                  <>
                    <td><code>{row.id}</code></td>
                    <td><strong>{row.name}</strong></td>
                    <td>{row.email}</td>
                    <td><span className="badge info">{row.role}</span></td>
                  </>
                )}
                {selectedDbTable === 'categories' && (
                  <>
                    <td><code>{row.id}</code></td>
                    <td><strong>{row.name}</strong></td>
                  </>
                )}
                {selectedDbTable === 'products' && (
                  <>
                    <td><code>{row.id}</code></td>
                    <td><code>{row.category_id}</code></td>
                    <td><strong>{row.name}</strong></td>
                    <td>{row.description}</td>
                  </>
                )}
                {selectedDbTable === 'product_variants' && (
                  <>
                    <td><code>{row.id}</code></td>
                    <td><code>{row.product_id}</code></td>
                    <td><code>{row.sku}</code></td>
                    <td><strong>{row.size}</strong></td>
                    <td>{row.color}</td>
                    <td>{formatRupiah(row.cost_price)}</td>
                    <td>{formatRupiah(row.selling_price)}</td>
                    <td>{row.stock_quantity} Pcs</td>
                  </>
                )}
                {selectedDbTable === 'stock_movements' && (
                  <>
                    <td><code>{row.id}</code></td>
                    <td><code>{row.variant_id}</code></td>
                    <td>
                      <span className={`badge ${row.type.includes('IN') || row.type.includes('RETURN') ? 'success' : 'danger'}`}>
                        {row.type}
                      </span>
                    </td>
                    <td><strong>{row.quantity}</strong></td>
                    <td>{row.notes}</td>
                    <td><code>{row.created_by}</code></td>
                    <td>{new Date(row.created_at).toLocaleString('id-ID')}</td>
                  </>
                )}
                {selectedDbTable === 'customers' && (
                  <>
                    <td><code>{row.id}</code></td>
                    <td><strong>{row.name}</strong></td>
                    <td>{row.phone_number}</td>
                    <td style={{ color: row.total_debt > 0 ? 'red' : 'green', fontWeight: 'bold' }}>{formatRupiah(row.total_debt)}</td>
                    <td>{new Date(row.created_at).toLocaleDateString('id-ID')}</td>
                  </>
                )}
                {selectedDbTable === 'sales' && (
                  <>
                    <td><code>{row.id}</code></td>
                    <td><strong>{row.invoice_number}</strong></td>
                    <td><code>{row.cashier_id}</code></td>
                    <td><code>{row.customer_id || '-'}</code></td>
                    <td>{formatRupiah(row.total_amount)}</td>
                    <td><span className="badge info">{row.payment_method}</span></td>
                    <td>
                      <span className={`badge ${row.payment_status === 'PAID' ? 'success' : 'danger'}`}>
                        {row.payment_status}
                      </span>
                    </td>
                    <td>{formatRupiah(row.paid_amount)}</td>
                    <td>{formatRupiah(row.change_amount)}</td>
                    <td>{new Date(row.created_at).toLocaleString('id-ID')}</td>
                  </>
                )}
                {selectedDbTable === 'sale_items' && (
                  <>
                    <td><code>{row.id}</code></td>
                    <td><code>{row.sale_id}</code></td>
                    <td><code>{row.variant_id}</code></td>
                    <td><strong>{row.quantity}</strong></td>
                    <td>{formatRupiah(row.price_per_unit)}</td>
                    <td><strong>{formatRupiah(row.subtotal)}</strong></td>
                  </>
                )}
                {selectedDbTable === 'debt_payments' && (
                  <>
                    <td><code>{row.id}</code></td>
                    <td><code>{row.customer_id}</code></td>
                    <td style={{ color: 'green', fontWeight: 'bold' }}>{formatRupiah(row.amount_paid)}</td>
                    <td><span className="badge info">{row.payment_method}</span></td>
                    <td><code>{row.cashier_id}</code></td>
                    <td>{new Date(row.created_at).toLocaleString('id-ID')}</td>
                  </>
                )}
              </tr>
            ))}
            {tableData.length === 0 && (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                  Data kosong di tabel "{selectedDbTable}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
