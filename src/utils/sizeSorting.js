// src/utils/sizeSorting.js

/**
 * Hierarki bobot pengurutan ukuran baju/seragam
 */
export const SIZE_HIERARCHY = {
  'XS': 99,
  'S': 100,
  'M': 101,
  'L': 102,
  'XL': 103,
  'XXL': 104,
  '2XL': 104,
  '3XL': 105,
  '4XL': 106,
  '5XL': 107,
  'ALL SIZE': 200,
  'STANDARD': 201
};

/**
 * Mendapatkan bobot angka dari sebuah string ukuran (angka -> XS/S/M/L/XL -> All Size/Standard)
 * @param {string} size - String ukuran
 * @returns {number} Bobot angka
 */
export const parseSizeWeight = (size) => {
  const s = String(size || '').trim().toUpperCase();
  if (SIZE_HIERARCHY[s] !== undefined) return SIZE_HIERARCHY[s];
  const num = parseFloat(s);
  if (!isNaN(num)) return num;
  return 300;
};

/**
 * Membandingkan dua varian berdasarkan ukuran dan warna
 * @param {Object} a - Varian A
 * @param {Object} b - Varian B
 * @returns {number} Hasil komparasi (-1, 0, 1)
 */
export const compareVariants = (a, b) => {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  const weightA = parseSizeWeight(a.size);
  const weightB = parseSizeWeight(b.size);
  if (weightA !== weightB) return weightA - weightB;

  const sizeCmp = String(a.size || '').localeCompare(String(b.size || ''), 'id', { numeric: true });
  if (sizeCmp !== 0) return sizeCmp;

  return String(a.color || '').localeCompare(String(b.color || ''), 'id', { sensitivity: 'base' });
};

/**
 * Mengurutkan array string ukuran
 * @param {Array<string>} sizes - Daftar string ukuran
 * @returns {Array<string>} Daftar ukuran terurut
 */
export const sortSizes = (sizes) => {
  if (!Array.isArray(sizes)) return [];
  return sizes.slice().sort((a, b) => {
    const wA = parseSizeWeight(a);
    const wB = parseSizeWeight(b);
    if (wA !== wB) return wA - wB;
    return String(a || '').localeCompare(String(b || ''), 'id', { numeric: true });
  });
};
