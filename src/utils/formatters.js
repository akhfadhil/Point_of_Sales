// src/utils/formatters.js

/**
 * Format angka ke dalam format mata uang Rupiah Indonesia (contoh: Rp 15.000)
 * @param {number|string} num - Nominal angka
 * @returns {string} String terformat Rupiah
 */
export const formatRupiah = (num) => {
  return 'Rp ' + Number(num || 0).toLocaleString('id-ID');
};
