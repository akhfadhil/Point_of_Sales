// src/db.js
import { supabase, isSupabaseConfigured } from './supabaseClient';

// Helper Supabase Sync
const syncSupabaseUpsert = async (table, data) => {
  if (!isSupabaseConfigured() || !supabase || !table || !data) return;
  try {
    const { error } = await supabase.from(table).upsert(data);
    if (error) console.error(`[Supabase Sync Error - ${table}]`, error.message || error);
  } catch (err) {
    console.error(`[Supabase Sync Exception - ${table}]`, err);
  }
};

const syncSupabaseDelete = async (table, id) => {
  if (!isSupabaseConfigured() || !supabase || !table || !id) return;
  try {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) console.error(`[Supabase Delete Error - ${table}]`, error.message || error);
  } catch (err) {
    console.error(`[Supabase Delete Exception - ${table}]`, err);
  }
};

const INITIAL_DATA = {
  users: [
    { id: 'u-1', name: 'Bu Oliviana (Owner)', email: 'owner@oliviana.com', role: 'OWNER' },

    { id: 'u-2', name: 'Ani (Kasir)', email: 'kasir@oliviana.com', role: 'CASHIER' },
    { id: 'u-3', name: 'Siti (Penjahit)', email: 'siti@oliviana.com', role: 'WORKER' },
    { id: 'u-4', name: 'Budi (Penjahit)', email: 'budi@oliviana.com', role: 'WORKER' },
    { id: 'u-5', name: 'Dewi (Penjahit)', email: 'dewi@oliviana.com', role: 'WORKER' },
    { id: 'u-6', name: 'Joko (Penjahit)', email: 'joko@oliviana.com', role: 'WORKER' }
  ],
  categories: [
    { id: 'c-1', name: 'Atasan' },
    { id: 'c-2', name: 'Bawahan' },
    { id: 'c-3', name: 'Aksesoris' }
  ],
  products: [
    {
        "id": "p-1",
        "category_id": "c-1",
        "name": "HEM PD PRAMUKA",
        "description": "Seragam atasan - HEM PD PRAMUKA"
    },
    {
        "id": "p-2",
        "category_id": "c-1",
        "name": "HEM PJ PRAMUKA OSWOD",
        "description": "Seragam atasan - HEM PJ PRAMUKA OSWOD"
    },
    {
        "id": "p-3",
        "category_id": "c-1",
        "name": "HEM PD PRAMUKA (SAKU DUA)",
        "description": "Seragam atasan - HEM PD PRAMUKA (SAKU DUA)"
    },
    {
        "id": "p-4",
        "category_id": "c-1",
        "name": "HEM PJ PRAMUKA (SAKU DUA)",
        "description": "Seragam atasan - HEM PJ PRAMUKA (SAKU DUA)"
    },
    {
        "id": "p-5",
        "category_id": "c-1",
        "name": "HEM PJ PUTIH OSWOD",
        "description": "Seragam atasan - HEM PJ PUTIH OSWOD"
    },
    {
        "id": "p-6",
        "category_id": "c-1",
        "name": "HEM PD PUTIH",
        "description": "Seragam atasan - HEM PD PUTIH"
    },
    {
        "id": "p-7",
        "category_id": "c-1",
        "name": "PRAMUKA PELET",
        "description": "Seragam atasan - PRAMUKA PELET"
    },
    {
        "id": "p-8",
        "category_id": "c-2",
        "name": "ROK WIRU",
        "description": "Seragam bawahan - ROK WIRU"
    },
    {
        "id": "p-9",
        "category_id": "c-2",
        "name": "ROK TURUN PANGGUL",
        "description": "Seragam bawahan - ROK TURUN PANGGUL"
    },
    {
        "id": "p-10",
        "category_id": "c-2",
        "name": "CELANA PD KARET",
        "description": "Seragam bawahan - CELANA PD KARET"
    },
    {
        "id": "p-11",
        "category_id": "c-2",
        "name": "CELANA PJ KARET",
        "description": "Seragam bawahan - CELANA PJ KARET"
    },
    {
        "id": "p-12",
        "category_id": "c-2",
        "name": "CELANA PJ KARET KEMPOL",
        "description": "Seragam bawahan - CELANA PJ KARET KEMPOL"
    },
    {
        "id": "p-13",
        "category_id": "c-2",
        "name": "CELANA PJ LEVIS",
        "description": "Seragam bawahan - CELANA PJ LEVIS"
    },
    {
        "id": "p-14",
        "category_id": "c-2",
        "name": "MEXY PJ SAKU DUA",
        "description": "Seragam bawahan - MEXY PJ SAKU DUA"
    },
    {
        "id": "p-15",
        "category_id": "c-2",
        "name": "CELANA PJ KEMPOL",
        "description": "Seragam bawahan - CELANA PJ KEMPOL"
    },
    {
        "id": "p-16",
        "category_id": "c-2",
        "name": "MEXY PANJANG",
        "description": "Seragam bawahan - MEXY PANJANG"
    },
    {
        "id": "p-17",
        "category_id": "c-3",
        "name": "GESPER PUTIH",
        "description": "Seragam aksesoris - GESPER PUTIH"
    },
    {
        "id": "p-18",
        "category_id": "c-3",
        "name": "GESPER PRAMUKA",
        "description": "Seragam aksesoris - GESPER PRAMUKA"
    }
],
  product_variants: [
    {
        "id": "v-1",
        "product_id": "p-1",
        "sku": "HEMPDP-2-PRAM",
        "size": "2",
        "color": "Pramuka",
        "selling_price": 38000,
        "stock_quantity": 50
    },
    {
        "id": "v-2",
        "product_id": "p-1",
        "sku": "HEMPDP-3-PRAM",
        "size": "3",
        "color": "Pramuka",
        "selling_price": 39000,
        "stock_quantity": 50
    },
    {
        "id": "v-3",
        "product_id": "p-1",
        "sku": "HEMPDP-4-PRAM",
        "size": "4",
        "color": "Pramuka",
        "selling_price": 40000,
        "stock_quantity": 50
    },
    {
        "id": "v-4",
        "product_id": "p-1",
        "sku": "HEMPDP-5-PRAM",
        "size": "5",
        "color": "Pramuka",
        "selling_price": 42000,
        "stock_quantity": 50
    },
    {
        "id": "v-5",
        "product_id": "p-1",
        "sku": "HEMPDP-6-PRAM",
        "size": "6",
        "color": "Pramuka",
        "selling_price": 43000,
        "stock_quantity": 50
    },
    {
        "id": "v-6",
        "product_id": "p-1",
        "sku": "HEMPDP-7-PRAM",
        "size": "7",
        "color": "Pramuka",
        "selling_price": 45000,
        "stock_quantity": 50
    },
    {
        "id": "v-7",
        "product_id": "p-1",
        "sku": "HEMPDP-8-PRAM",
        "size": "8",
        "color": "Pramuka",
        "selling_price": 46000,
        "stock_quantity": 50
    },
    {
        "id": "v-8",
        "product_id": "p-1",
        "sku": "HEMPDP-S-PRAM",
        "size": "S",
        "color": "Pramuka",
        "selling_price": 49000,
        "stock_quantity": 50
    },
    {
        "id": "v-9",
        "product_id": "p-1",
        "sku": "HEMPDP-M-PRAM",
        "size": "M",
        "color": "Pramuka",
        "selling_price": 51000,
        "stock_quantity": 50
    },
    {
        "id": "v-10",
        "product_id": "p-1",
        "sku": "HEMPDP-L-PRAM",
        "size": "L",
        "color": "Pramuka",
        "selling_price": 54000,
        "stock_quantity": 50
    },
    {
        "id": "v-11",
        "product_id": "p-1",
        "sku": "HEMPDP-XL-PRAM",
        "size": "XL",
        "color": "Pramuka",
        "selling_price": 56000,
        "stock_quantity": 50
    },
    {
        "id": "v-12",
        "product_id": "p-2",
        "sku": "HEMPJP-2-PRAM",
        "size": "2",
        "color": "Pramuka",
        "selling_price": 41000,
        "stock_quantity": 50
    },
    {
        "id": "v-13",
        "product_id": "p-2",
        "sku": "HEMPJP-3-PRAM",
        "size": "3",
        "color": "Pramuka",
        "selling_price": 42000,
        "stock_quantity": 50
    },
    {
        "id": "v-14",
        "product_id": "p-2",
        "sku": "HEMPJP-4-PRAM",
        "size": "4",
        "color": "Pramuka",
        "selling_price": 43000,
        "stock_quantity": 50
    },
    {
        "id": "v-15",
        "product_id": "p-2",
        "sku": "HEMPJP-5-PRAM",
        "size": "5",
        "color": "Pramuka",
        "selling_price": 45000,
        "stock_quantity": 50
    },
    {
        "id": "v-16",
        "product_id": "p-2",
        "sku": "HEMPJP-6-PRAM",
        "size": "6",
        "color": "Pramuka",
        "selling_price": 46000,
        "stock_quantity": 50
    },
    {
        "id": "v-17",
        "product_id": "p-2",
        "sku": "HEMPJP-7-PRAM",
        "size": "7",
        "color": "Pramuka",
        "selling_price": 48000,
        "stock_quantity": 50
    },
    {
        "id": "v-18",
        "product_id": "p-2",
        "sku": "HEMPJP-8-PRAM",
        "size": "8",
        "color": "Pramuka",
        "selling_price": 49000,
        "stock_quantity": 50
    },
    {
        "id": "v-19",
        "product_id": "p-2",
        "sku": "HEMPJP-S-PRAM",
        "size": "S",
        "color": "Pramuka",
        "selling_price": 52000,
        "stock_quantity": 50
    },
    {
        "id": "v-20",
        "product_id": "p-2",
        "sku": "HEMPJP-M-PRAM",
        "size": "M",
        "color": "Pramuka",
        "selling_price": 54000,
        "stock_quantity": 50
    },
    {
        "id": "v-21",
        "product_id": "p-2",
        "sku": "HEMPJP-L-PRAM",
        "size": "L",
        "color": "Pramuka",
        "selling_price": 57000,
        "stock_quantity": 50
    },
    {
        "id": "v-22",
        "product_id": "p-2",
        "sku": "HEMPJP-XL-PRAM",
        "size": "XL",
        "color": "Pramuka",
        "selling_price": 58000,
        "stock_quantity": 50
    },
    {
        "id": "v-23",
        "product_id": "p-3",
        "sku": "HEMPDP-6-PRAM",
        "size": "6",
        "color": "Pramuka",
        "selling_price": 48000,
        "stock_quantity": 50
    },
    {
        "id": "v-24",
        "product_id": "p-3",
        "sku": "HEMPDP-7-PRAM",
        "size": "7",
        "color": "Pramuka",
        "selling_price": 50000,
        "stock_quantity": 50
    },
    {
        "id": "v-25",
        "product_id": "p-3",
        "sku": "HEMPDP-8-PRAM",
        "size": "8",
        "color": "Pramuka",
        "selling_price": 51000,
        "stock_quantity": 50
    },
    {
        "id": "v-26",
        "product_id": "p-3",
        "sku": "HEMPDP-S-PRAM",
        "size": "S",
        "color": "Pramuka",
        "selling_price": 54000,
        "stock_quantity": 50
    },
    {
        "id": "v-27",
        "product_id": "p-3",
        "sku": "HEMPDP-M-PRAM",
        "size": "M",
        "color": "Pramuka",
        "selling_price": 56000,
        "stock_quantity": 50
    },
    {
        "id": "v-28",
        "product_id": "p-3",
        "sku": "HEMPDP-L-PRAM",
        "size": "L",
        "color": "Pramuka",
        "selling_price": 59000,
        "stock_quantity": 50
    },
    {
        "id": "v-29",
        "product_id": "p-3",
        "sku": "HEMPDP-XL-PRAM",
        "size": "XL",
        "color": "Pramuka",
        "selling_price": 61000,
        "stock_quantity": 50
    },
    {
        "id": "v-30",
        "product_id": "p-4",
        "sku": "HEMPJP-6-PRAM",
        "size": "6",
        "color": "Pramuka",
        "selling_price": 54000,
        "stock_quantity": 50
    },
    {
        "id": "v-31",
        "product_id": "p-4",
        "sku": "HEMPJP-7-PRAM",
        "size": "7",
        "color": "Pramuka",
        "selling_price": 56000,
        "stock_quantity": 50
    },
    {
        "id": "v-32",
        "product_id": "p-4",
        "sku": "HEMPJP-8-PRAM",
        "size": "8",
        "color": "Pramuka",
        "selling_price": 57000,
        "stock_quantity": 50
    },
    {
        "id": "v-33",
        "product_id": "p-4",
        "sku": "HEMPJP-S-PRAM",
        "size": "S",
        "color": "Pramuka",
        "selling_price": 60000,
        "stock_quantity": 50
    },
    {
        "id": "v-34",
        "product_id": "p-4",
        "sku": "HEMPJP-M-PRAM",
        "size": "M",
        "color": "Pramuka",
        "selling_price": 62000,
        "stock_quantity": 50
    },
    {
        "id": "v-35",
        "product_id": "p-4",
        "sku": "HEMPJP-L-PRAM",
        "size": "L",
        "color": "Pramuka",
        "selling_price": 65000,
        "stock_quantity": 50
    },
    {
        "id": "v-36",
        "product_id": "p-4",
        "sku": "HEMPJP-XL-PRAM",
        "size": "XL",
        "color": "Pramuka",
        "selling_price": 67000,
        "stock_quantity": 50
    },
    {
        "id": "v-37",
        "product_id": "p-5",
        "sku": "HEMPJP-2-PUTI",
        "size": "2",
        "color": "Putih",
        "selling_price": 40000,
        "stock_quantity": 50
    },
    {
        "id": "v-38",
        "product_id": "p-5",
        "sku": "HEMPJP-3-PUTI",
        "size": "3",
        "color": "Putih",
        "selling_price": 41000,
        "stock_quantity": 50
    },
    {
        "id": "v-39",
        "product_id": "p-5",
        "sku": "HEMPJP-4-PUTI",
        "size": "4",
        "color": "Putih",
        "selling_price": 42000,
        "stock_quantity": 50
    },
    {
        "id": "v-40",
        "product_id": "p-5",
        "sku": "HEMPJP-5-PUTI",
        "size": "5",
        "color": "Putih",
        "selling_price": 44000,
        "stock_quantity": 50
    },
    {
        "id": "v-41",
        "product_id": "p-5",
        "sku": "HEMPJP-6-PUTI",
        "size": "6",
        "color": "Putih",
        "selling_price": 45000,
        "stock_quantity": 50
    },
    {
        "id": "v-42",
        "product_id": "p-5",
        "sku": "HEMPJP-7-PUTI",
        "size": "7",
        "color": "Putih",
        "selling_price": 47000,
        "stock_quantity": 50
    },
    {
        "id": "v-43",
        "product_id": "p-5",
        "sku": "HEMPJP-8-PUTI",
        "size": "8",
        "color": "Putih",
        "selling_price": 48000,
        "stock_quantity": 50
    },
    {
        "id": "v-44",
        "product_id": "p-5",
        "sku": "HEMPJP-S-PUTI",
        "size": "S",
        "color": "Putih",
        "selling_price": 51000,
        "stock_quantity": 50
    },
    {
        "id": "v-45",
        "product_id": "p-5",
        "sku": "HEMPJP-M-PUTI",
        "size": "M",
        "color": "Putih",
        "selling_price": 53000,
        "stock_quantity": 50
    },
    {
        "id": "v-46",
        "product_id": "p-5",
        "sku": "HEMPJP-L-PUTI",
        "size": "L",
        "color": "Putih",
        "selling_price": 56000,
        "stock_quantity": 50
    },
    {
        "id": "v-47",
        "product_id": "p-5",
        "sku": "HEMPJP-XL-PUTI",
        "size": "XL",
        "color": "Putih",
        "selling_price": 58000,
        "stock_quantity": 50
    },
    {
        "id": "v-48",
        "product_id": "p-6",
        "sku": "HEMPDP-2-PUTI",
        "size": "2",
        "color": "Putih",
        "selling_price": 37000,
        "stock_quantity": 50
    },
    {
        "id": "v-49",
        "product_id": "p-6",
        "sku": "HEMPDP-3-PUTI",
        "size": "3",
        "color": "Putih",
        "selling_price": 38000,
        "stock_quantity": 50
    },
    {
        "id": "v-50",
        "product_id": "p-6",
        "sku": "HEMPDP-4-PUTI",
        "size": "4",
        "color": "Putih",
        "selling_price": 39000,
        "stock_quantity": 50
    },
    {
        "id": "v-51",
        "product_id": "p-6",
        "sku": "HEMPDP-5-PUTI",
        "size": "5",
        "color": "Putih",
        "selling_price": 41000,
        "stock_quantity": 50
    },
    {
        "id": "v-52",
        "product_id": "p-6",
        "sku": "HEMPDP-6-PUTI",
        "size": "6",
        "color": "Putih",
        "selling_price": 42000,
        "stock_quantity": 50
    },
    {
        "id": "v-53",
        "product_id": "p-6",
        "sku": "HEMPDP-7-PUTI",
        "size": "7",
        "color": "Putih",
        "selling_price": 44000,
        "stock_quantity": 50
    },
    {
        "id": "v-54",
        "product_id": "p-6",
        "sku": "HEMPDP-8-PUTI",
        "size": "8",
        "color": "Putih",
        "selling_price": 45000,
        "stock_quantity": 50
    },
    {
        "id": "v-55",
        "product_id": "p-6",
        "sku": "HEMPDP-S-PUTI",
        "size": "S",
        "color": "Putih",
        "selling_price": 48000,
        "stock_quantity": 50
    },
    {
        "id": "v-56",
        "product_id": "p-6",
        "sku": "HEMPDP-M-PUTI",
        "size": "M",
        "color": "Putih",
        "selling_price": 50000,
        "stock_quantity": 50
    },
    {
        "id": "v-57",
        "product_id": "p-6",
        "sku": "HEMPDP-L-PUTI",
        "size": "L",
        "color": "Putih",
        "selling_price": 53000,
        "stock_quantity": 50
    },
    {
        "id": "v-58",
        "product_id": "p-6",
        "sku": "HEMPDP-XL-PUTI",
        "size": "XL",
        "color": "Putih",
        "selling_price": 55000,
        "stock_quantity": 50
    },
    {
        "id": "v-59",
        "product_id": "p-7",
        "sku": "PRAMUK-2-PRAM",
        "size": "2",
        "color": "Pramuka",
        "selling_price": 46000,
        "stock_quantity": 50
    },
    {
        "id": "v-60",
        "product_id": "p-7",
        "sku": "PRAMUK-3-PRAM",
        "size": "3",
        "color": "Pramuka",
        "selling_price": 47000,
        "stock_quantity": 50
    },
    {
        "id": "v-61",
        "product_id": "p-7",
        "sku": "PRAMUK-4-PRAM",
        "size": "4",
        "color": "Pramuka",
        "selling_price": 48000,
        "stock_quantity": 50
    },
    {
        "id": "v-62",
        "product_id": "p-7",
        "sku": "PRAMUK-5-PRAM",
        "size": "5",
        "color": "Pramuka",
        "selling_price": 50000,
        "stock_quantity": 50
    },
    {
        "id": "v-63",
        "product_id": "p-7",
        "sku": "PRAMUK-6-PRAM",
        "size": "6",
        "color": "Pramuka",
        "selling_price": 51000,
        "stock_quantity": 50
    },
    {
        "id": "v-64",
        "product_id": "p-7",
        "sku": "PRAMUK-7-PRAM",
        "size": "7",
        "color": "Pramuka",
        "selling_price": 53000,
        "stock_quantity": 50
    },
    {
        "id": "v-65",
        "product_id": "p-7",
        "sku": "PRAMUK-8-PRAM",
        "size": "8",
        "color": "Pramuka",
        "selling_price": 54000,
        "stock_quantity": 50
    },
    {
        "id": "v-66",
        "product_id": "p-8",
        "sku": "ROKWIR-2-MERA",
        "size": "2",
        "color": "Merah",
        "selling_price": 38000,
        "stock_quantity": 50
    },
    {
        "id": "v-67",
        "product_id": "p-8",
        "sku": "ROKWIR-2-COKE",
        "size": "2",
        "color": "Cokelat",
        "selling_price": 38000,
        "stock_quantity": 50
    },
    {
        "id": "v-68",
        "product_id": "p-8",
        "sku": "ROKWIR-2-BIRU",
        "size": "2",
        "color": "Biru",
        "selling_price": 38000,
        "stock_quantity": 50
    },
    {
        "id": "v-69",
        "product_id": "p-8",
        "sku": "ROKWIR-2-ABU",
        "size": "2",
        "color": "Abu",
        "selling_price": 38000,
        "stock_quantity": 50
    },
    {
        "id": "v-70",
        "product_id": "p-8",
        "sku": "ROKWIR-2-HIJA",
        "size": "2",
        "color": "Hijau",
        "selling_price": 38000,
        "stock_quantity": 50
    },
    {
        "id": "v-71",
        "product_id": "p-8",
        "sku": "ROKWIR-2-PUTI",
        "size": "2",
        "color": "Putih",
        "selling_price": 38000,
        "stock_quantity": 50
    },
    {
        "id": "v-72",
        "product_id": "p-8",
        "sku": "ROKWIR-2-HITA",
        "size": "2",
        "color": "Hitam",
        "selling_price": 38000,
        "stock_quantity": 50
    },
    {
        "id": "v-73",
        "product_id": "p-8",
        "sku": "ROKWIR-3-MERA",
        "size": "3",
        "color": "Merah",
        "selling_price": 39000,
        "stock_quantity": 50
    },
    {
        "id": "v-74",
        "product_id": "p-8",
        "sku": "ROKWIR-3-COKE",
        "size": "3",
        "color": "Cokelat",
        "selling_price": 39000,
        "stock_quantity": 50
    },
    {
        "id": "v-75",
        "product_id": "p-8",
        "sku": "ROKWIR-3-BIRU",
        "size": "3",
        "color": "Biru",
        "selling_price": 39000,
        "stock_quantity": 50
    },
    {
        "id": "v-76",
        "product_id": "p-8",
        "sku": "ROKWIR-3-ABU",
        "size": "3",
        "color": "Abu",
        "selling_price": 39000,
        "stock_quantity": 50
    },
    {
        "id": "v-77",
        "product_id": "p-8",
        "sku": "ROKWIR-3-HIJA",
        "size": "3",
        "color": "Hijau",
        "selling_price": 39000,
        "stock_quantity": 50
    },
    {
        "id": "v-78",
        "product_id": "p-8",
        "sku": "ROKWIR-3-PUTI",
        "size": "3",
        "color": "Putih",
        "selling_price": 39000,
        "stock_quantity": 50
    },
    {
        "id": "v-79",
        "product_id": "p-8",
        "sku": "ROKWIR-3-HITA",
        "size": "3",
        "color": "Hitam",
        "selling_price": 39000,
        "stock_quantity": 50
    },
    {
        "id": "v-80",
        "product_id": "p-8",
        "sku": "ROKWIR-4-MERA",
        "size": "4",
        "color": "Merah",
        "selling_price": 40000,
        "stock_quantity": 50
    },
    {
        "id": "v-81",
        "product_id": "p-8",
        "sku": "ROKWIR-4-COKE",
        "size": "4",
        "color": "Cokelat",
        "selling_price": 40000,
        "stock_quantity": 50
    },
    {
        "id": "v-82",
        "product_id": "p-8",
        "sku": "ROKWIR-4-BIRU",
        "size": "4",
        "color": "Biru",
        "selling_price": 40000,
        "stock_quantity": 50
    },
    {
        "id": "v-83",
        "product_id": "p-8",
        "sku": "ROKWIR-4-ABU",
        "size": "4",
        "color": "Abu",
        "selling_price": 40000,
        "stock_quantity": 50
    },
    {
        "id": "v-84",
        "product_id": "p-8",
        "sku": "ROKWIR-4-HIJA",
        "size": "4",
        "color": "Hijau",
        "selling_price": 40000,
        "stock_quantity": 50
    },
    {
        "id": "v-85",
        "product_id": "p-8",
        "sku": "ROKWIR-4-PUTI",
        "size": "4",
        "color": "Putih",
        "selling_price": 40000,
        "stock_quantity": 50
    },
    {
        "id": "v-86",
        "product_id": "p-8",
        "sku": "ROKWIR-4-HITA",
        "size": "4",
        "color": "Hitam",
        "selling_price": 40000,
        "stock_quantity": 50
    },
    {
        "id": "v-87",
        "product_id": "p-8",
        "sku": "ROKWIR-5-MERA",
        "size": "5",
        "color": "Merah",
        "selling_price": 41000,
        "stock_quantity": 50
    },
    {
        "id": "v-88",
        "product_id": "p-8",
        "sku": "ROKWIR-5-COKE",
        "size": "5",
        "color": "Cokelat",
        "selling_price": 41000,
        "stock_quantity": 50
    },
    {
        "id": "v-89",
        "product_id": "p-8",
        "sku": "ROKWIR-5-BIRU",
        "size": "5",
        "color": "Biru",
        "selling_price": 41000,
        "stock_quantity": 50
    },
    {
        "id": "v-90",
        "product_id": "p-8",
        "sku": "ROKWIR-5-ABU",
        "size": "5",
        "color": "Abu",
        "selling_price": 41000,
        "stock_quantity": 50
    },
    {
        "id": "v-91",
        "product_id": "p-8",
        "sku": "ROKWIR-5-HIJA",
        "size": "5",
        "color": "Hijau",
        "selling_price": 41000,
        "stock_quantity": 50
    },
    {
        "id": "v-92",
        "product_id": "p-8",
        "sku": "ROKWIR-5-PUTI",
        "size": "5",
        "color": "Putih",
        "selling_price": 41000,
        "stock_quantity": 50
    },
    {
        "id": "v-93",
        "product_id": "p-8",
        "sku": "ROKWIR-5-HITA",
        "size": "5",
        "color": "Hitam",
        "selling_price": 41000,
        "stock_quantity": 50
    },
    {
        "id": "v-94",
        "product_id": "p-8",
        "sku": "ROKWIR-6-MERA",
        "size": "6",
        "color": "Merah",
        "selling_price": 42000,
        "stock_quantity": 50
    },
    {
        "id": "v-95",
        "product_id": "p-8",
        "sku": "ROKWIR-6-COKE",
        "size": "6",
        "color": "Cokelat",
        "selling_price": 42000,
        "stock_quantity": 50
    },
    {
        "id": "v-96",
        "product_id": "p-8",
        "sku": "ROKWIR-6-BIRU",
        "size": "6",
        "color": "Biru",
        "selling_price": 42000,
        "stock_quantity": 50
    },
    {
        "id": "v-97",
        "product_id": "p-8",
        "sku": "ROKWIR-6-ABU",
        "size": "6",
        "color": "Abu",
        "selling_price": 42000,
        "stock_quantity": 50
    },
    {
        "id": "v-98",
        "product_id": "p-8",
        "sku": "ROKWIR-6-HIJA",
        "size": "6",
        "color": "Hijau",
        "selling_price": 42000,
        "stock_quantity": 50
    },
    {
        "id": "v-99",
        "product_id": "p-8",
        "sku": "ROKWIR-6-PUTI",
        "size": "6",
        "color": "Putih",
        "selling_price": 42000,
        "stock_quantity": 50
    },
    {
        "id": "v-100",
        "product_id": "p-8",
        "sku": "ROKWIR-6-HITA",
        "size": "6",
        "color": "Hitam",
        "selling_price": 42000,
        "stock_quantity": 50
    },
    {
        "id": "v-101",
        "product_id": "p-8",
        "sku": "ROKWIR-7-MERA",
        "size": "7",
        "color": "Merah",
        "selling_price": 43000,
        "stock_quantity": 50
    },
    {
        "id": "v-102",
        "product_id": "p-8",
        "sku": "ROKWIR-7-COKE",
        "size": "7",
        "color": "Cokelat",
        "selling_price": 43000,
        "stock_quantity": 50
    },
    {
        "id": "v-103",
        "product_id": "p-8",
        "sku": "ROKWIR-7-BIRU",
        "size": "7",
        "color": "Biru",
        "selling_price": 43000,
        "stock_quantity": 50
    },
    {
        "id": "v-104",
        "product_id": "p-8",
        "sku": "ROKWIR-7-ABU",
        "size": "7",
        "color": "Abu",
        "selling_price": 43000,
        "stock_quantity": 50
    },
    {
        "id": "v-105",
        "product_id": "p-8",
        "sku": "ROKWIR-7-HIJA",
        "size": "7",
        "color": "Hijau",
        "selling_price": 43000,
        "stock_quantity": 50
    },
    {
        "id": "v-106",
        "product_id": "p-8",
        "sku": "ROKWIR-7-PUTI",
        "size": "7",
        "color": "Putih",
        "selling_price": 43000,
        "stock_quantity": 50
    },
    {
        "id": "v-107",
        "product_id": "p-8",
        "sku": "ROKWIR-7-HITA",
        "size": "7",
        "color": "Hitam",
        "selling_price": 43000,
        "stock_quantity": 50
    },
    {
        "id": "v-108",
        "product_id": "p-8",
        "sku": "ROKWIR-8-MERA",
        "size": "8",
        "color": "Merah",
        "selling_price": 44000,
        "stock_quantity": 50
    },
    {
        "id": "v-109",
        "product_id": "p-8",
        "sku": "ROKWIR-8-COKE",
        "size": "8",
        "color": "Cokelat",
        "selling_price": 44000,
        "stock_quantity": 50
    },
    {
        "id": "v-110",
        "product_id": "p-8",
        "sku": "ROKWIR-8-BIRU",
        "size": "8",
        "color": "Biru",
        "selling_price": 44000,
        "stock_quantity": 50
    },
    {
        "id": "v-111",
        "product_id": "p-8",
        "sku": "ROKWIR-8-ABU",
        "size": "8",
        "color": "Abu",
        "selling_price": 44000,
        "stock_quantity": 50
    },
    {
        "id": "v-112",
        "product_id": "p-8",
        "sku": "ROKWIR-8-HIJA",
        "size": "8",
        "color": "Hijau",
        "selling_price": 44000,
        "stock_quantity": 50
    },
    {
        "id": "v-113",
        "product_id": "p-8",
        "sku": "ROKWIR-8-PUTI",
        "size": "8",
        "color": "Putih",
        "selling_price": 44000,
        "stock_quantity": 50
    },
    {
        "id": "v-114",
        "product_id": "p-8",
        "sku": "ROKWIR-8-HITA",
        "size": "8",
        "color": "Hitam",
        "selling_price": 44000,
        "stock_quantity": 50
    },
    {
        "id": "v-115",
        "product_id": "p-8",
        "sku": "ROKWIR-9-MERA",
        "size": "9",
        "color": "Merah",
        "selling_price": 45000,
        "stock_quantity": 50
    },
    {
        "id": "v-116",
        "product_id": "p-8",
        "sku": "ROKWIR-9-COKE",
        "size": "9",
        "color": "Cokelat",
        "selling_price": 45000,
        "stock_quantity": 50
    },
    {
        "id": "v-117",
        "product_id": "p-8",
        "sku": "ROKWIR-9-BIRU",
        "size": "9",
        "color": "Biru",
        "selling_price": 45000,
        "stock_quantity": 50
    },
    {
        "id": "v-118",
        "product_id": "p-8",
        "sku": "ROKWIR-9-ABU",
        "size": "9",
        "color": "Abu",
        "selling_price": 45000,
        "stock_quantity": 50
    },
    {
        "id": "v-119",
        "product_id": "p-8",
        "sku": "ROKWIR-9-HIJA",
        "size": "9",
        "color": "Hijau",
        "selling_price": 45000,
        "stock_quantity": 50
    },
    {
        "id": "v-120",
        "product_id": "p-8",
        "sku": "ROKWIR-9-PUTI",
        "size": "9",
        "color": "Putih",
        "selling_price": 45000,
        "stock_quantity": 50
    },
    {
        "id": "v-121",
        "product_id": "p-8",
        "sku": "ROKWIR-9-HITA",
        "size": "9",
        "color": "Hitam",
        "selling_price": 45000,
        "stock_quantity": 50
    },
    {
        "id": "v-122",
        "product_id": "p-8",
        "sku": "ROKWIR-11-MERA",
        "size": "11",
        "color": "Merah",
        "selling_price": 47000,
        "stock_quantity": 50
    },
    {
        "id": "v-123",
        "product_id": "p-8",
        "sku": "ROKWIR-11-COKE",
        "size": "11",
        "color": "Cokelat",
        "selling_price": 47000,
        "stock_quantity": 50
    },
    {
        "id": "v-124",
        "product_id": "p-8",
        "sku": "ROKWIR-11-BIRU",
        "size": "11",
        "color": "Biru",
        "selling_price": 47000,
        "stock_quantity": 50
    },
    {
        "id": "v-125",
        "product_id": "p-8",
        "sku": "ROKWIR-11-ABU",
        "size": "11",
        "color": "Abu",
        "selling_price": 47000,
        "stock_quantity": 50
    },
    {
        "id": "v-126",
        "product_id": "p-8",
        "sku": "ROKWIR-11-HIJA",
        "size": "11",
        "color": "Hijau",
        "selling_price": 47000,
        "stock_quantity": 50
    },
    {
        "id": "v-127",
        "product_id": "p-8",
        "sku": "ROKWIR-11-PUTI",
        "size": "11",
        "color": "Putih",
        "selling_price": 47000,
        "stock_quantity": 50
    },
    {
        "id": "v-128",
        "product_id": "p-8",
        "sku": "ROKWIR-11-HITA",
        "size": "11",
        "color": "Hitam",
        "selling_price": 47000,
        "stock_quantity": 50
    },
    {
        "id": "v-129",
        "product_id": "p-8",
        "sku": "ROKWIR-12-MERA",
        "size": "12",
        "color": "Merah",
        "selling_price": 48000,
        "stock_quantity": 50
    },
    {
        "id": "v-130",
        "product_id": "p-8",
        "sku": "ROKWIR-12-COKE",
        "size": "12",
        "color": "Cokelat",
        "selling_price": 48000,
        "stock_quantity": 50
    },
    {
        "id": "v-131",
        "product_id": "p-8",
        "sku": "ROKWIR-12-BIRU",
        "size": "12",
        "color": "Biru",
        "selling_price": 48000,
        "stock_quantity": 50
    },
    {
        "id": "v-132",
        "product_id": "p-8",
        "sku": "ROKWIR-12-ABU",
        "size": "12",
        "color": "Abu",
        "selling_price": 48000,
        "stock_quantity": 50
    },
    {
        "id": "v-133",
        "product_id": "p-8",
        "sku": "ROKWIR-12-HIJA",
        "size": "12",
        "color": "Hijau",
        "selling_price": 48000,
        "stock_quantity": 50
    },
    {
        "id": "v-134",
        "product_id": "p-8",
        "sku": "ROKWIR-12-PUTI",
        "size": "12",
        "color": "Putih",
        "selling_price": 48000,
        "stock_quantity": 50
    },
    {
        "id": "v-135",
        "product_id": "p-8",
        "sku": "ROKWIR-12-HITA",
        "size": "12",
        "color": "Hitam",
        "selling_price": 48000,
        "stock_quantity": 50
    },
    {
        "id": "v-136",
        "product_id": "p-8",
        "sku": "ROKWIR-13-MERA",
        "size": "13",
        "color": "Merah",
        "selling_price": 49000,
        "stock_quantity": 50
    },
    {
        "id": "v-137",
        "product_id": "p-8",
        "sku": "ROKWIR-13-COKE",
        "size": "13",
        "color": "Cokelat",
        "selling_price": 49000,
        "stock_quantity": 50
    },
    {
        "id": "v-138",
        "product_id": "p-8",
        "sku": "ROKWIR-13-BIRU",
        "size": "13",
        "color": "Biru",
        "selling_price": 49000,
        "stock_quantity": 50
    },
    {
        "id": "v-139",
        "product_id": "p-8",
        "sku": "ROKWIR-13-ABU",
        "size": "13",
        "color": "Abu",
        "selling_price": 49000,
        "stock_quantity": 50
    },
    {
        "id": "v-140",
        "product_id": "p-8",
        "sku": "ROKWIR-13-HIJA",
        "size": "13",
        "color": "Hijau",
        "selling_price": 49000,
        "stock_quantity": 50
    },
    {
        "id": "v-141",
        "product_id": "p-8",
        "sku": "ROKWIR-13-PUTI",
        "size": "13",
        "color": "Putih",
        "selling_price": 49000,
        "stock_quantity": 50
    },
    {
        "id": "v-142",
        "product_id": "p-8",
        "sku": "ROKWIR-13-HITA",
        "size": "13",
        "color": "Hitam",
        "selling_price": 49000,
        "stock_quantity": 50
    },
    {
        "id": "v-143",
        "product_id": "p-8",
        "sku": "ROKWIR-14-MERA",
        "size": "14",
        "color": "Merah",
        "selling_price": 50000,
        "stock_quantity": 50
    },
    {
        "id": "v-144",
        "product_id": "p-8",
        "sku": "ROKWIR-14-COKE",
        "size": "14",
        "color": "Cokelat",
        "selling_price": 50000,
        "stock_quantity": 50
    },
    {
        "id": "v-145",
        "product_id": "p-8",
        "sku": "ROKWIR-14-BIRU",
        "size": "14",
        "color": "Biru",
        "selling_price": 50000,
        "stock_quantity": 50
    },
    {
        "id": "v-146",
        "product_id": "p-8",
        "sku": "ROKWIR-14-ABU",
        "size": "14",
        "color": "Abu",
        "selling_price": 50000,
        "stock_quantity": 50
    },
    {
        "id": "v-147",
        "product_id": "p-8",
        "sku": "ROKWIR-14-HIJA",
        "size": "14",
        "color": "Hijau",
        "selling_price": 50000,
        "stock_quantity": 50
    },
    {
        "id": "v-148",
        "product_id": "p-8",
        "sku": "ROKWIR-14-PUTI",
        "size": "14",
        "color": "Putih",
        "selling_price": 50000,
        "stock_quantity": 50
    },
    {
        "id": "v-149",
        "product_id": "p-8",
        "sku": "ROKWIR-14-HITA",
        "size": "14",
        "color": "Hitam",
        "selling_price": 50000,
        "stock_quantity": 50
    },
    {
        "id": "v-150",
        "product_id": "p-8",
        "sku": "ROKWIR-15-MERA",
        "size": "15",
        "color": "Merah",
        "selling_price": 51000,
        "stock_quantity": 50
    },
    {
        "id": "v-151",
        "product_id": "p-8",
        "sku": "ROKWIR-15-COKE",
        "size": "15",
        "color": "Cokelat",
        "selling_price": 51000,
        "stock_quantity": 50
    },
    {
        "id": "v-152",
        "product_id": "p-8",
        "sku": "ROKWIR-15-BIRU",
        "size": "15",
        "color": "Biru",
        "selling_price": 51000,
        "stock_quantity": 50
    },
    {
        "id": "v-153",
        "product_id": "p-8",
        "sku": "ROKWIR-15-ABU",
        "size": "15",
        "color": "Abu",
        "selling_price": 51000,
        "stock_quantity": 50
    },
    {
        "id": "v-154",
        "product_id": "p-8",
        "sku": "ROKWIR-15-HIJA",
        "size": "15",
        "color": "Hijau",
        "selling_price": 51000,
        "stock_quantity": 50
    },
    {
        "id": "v-155",
        "product_id": "p-8",
        "sku": "ROKWIR-15-PUTI",
        "size": "15",
        "color": "Putih",
        "selling_price": 51000,
        "stock_quantity": 50
    },
    {
        "id": "v-156",
        "product_id": "p-8",
        "sku": "ROKWIR-15-HITA",
        "size": "15",
        "color": "Hitam",
        "selling_price": 51000,
        "stock_quantity": 50
    },
    {
        "id": "v-157",
        "product_id": "p-8",
        "sku": "ROKWIR-16-MERA",
        "size": "16",
        "color": "Merah",
        "selling_price": 52000,
        "stock_quantity": 50
    },
    {
        "id": "v-158",
        "product_id": "p-8",
        "sku": "ROKWIR-16-COKE",
        "size": "16",
        "color": "Cokelat",
        "selling_price": 52000,
        "stock_quantity": 50
    },
    {
        "id": "v-159",
        "product_id": "p-8",
        "sku": "ROKWIR-16-BIRU",
        "size": "16",
        "color": "Biru",
        "selling_price": 52000,
        "stock_quantity": 50
    },
    {
        "id": "v-160",
        "product_id": "p-8",
        "sku": "ROKWIR-16-ABU",
        "size": "16",
        "color": "Abu",
        "selling_price": 52000,
        "stock_quantity": 50
    },
    {
        "id": "v-161",
        "product_id": "p-8",
        "sku": "ROKWIR-16-HIJA",
        "size": "16",
        "color": "Hijau",
        "selling_price": 52000,
        "stock_quantity": 50
    },
    {
        "id": "v-162",
        "product_id": "p-8",
        "sku": "ROKWIR-16-PUTI",
        "size": "16",
        "color": "Putih",
        "selling_price": 52000,
        "stock_quantity": 50
    },
    {
        "id": "v-163",
        "product_id": "p-8",
        "sku": "ROKWIR-16-HITA",
        "size": "16",
        "color": "Hitam",
        "selling_price": 52000,
        "stock_quantity": 50
    },
    {
        "id": "v-164",
        "product_id": "p-8",
        "sku": "ROKWIR-17-MERA",
        "size": "17",
        "color": "Merah",
        "selling_price": 53000,
        "stock_quantity": 50
    },
    {
        "id": "v-165",
        "product_id": "p-8",
        "sku": "ROKWIR-17-COKE",
        "size": "17",
        "color": "Cokelat",
        "selling_price": 53000,
        "stock_quantity": 50
    },
    {
        "id": "v-166",
        "product_id": "p-8",
        "sku": "ROKWIR-17-BIRU",
        "size": "17",
        "color": "Biru",
        "selling_price": 53000,
        "stock_quantity": 50
    },
    {
        "id": "v-167",
        "product_id": "p-8",
        "sku": "ROKWIR-17-ABU",
        "size": "17",
        "color": "Abu",
        "selling_price": 53000,
        "stock_quantity": 50
    },
    {
        "id": "v-168",
        "product_id": "p-8",
        "sku": "ROKWIR-17-HIJA",
        "size": "17",
        "color": "Hijau",
        "selling_price": 53000,
        "stock_quantity": 50
    },
    {
        "id": "v-169",
        "product_id": "p-8",
        "sku": "ROKWIR-17-PUTI",
        "size": "17",
        "color": "Putih",
        "selling_price": 53000,
        "stock_quantity": 50
    },
    {
        "id": "v-170",
        "product_id": "p-8",
        "sku": "ROKWIR-17-HITA",
        "size": "17",
        "color": "Hitam",
        "selling_price": 53000,
        "stock_quantity": 50
    },
    {
        "id": "v-171",
        "product_id": "p-9",
        "sku": "ROKTUR-21-MERA",
        "size": "21",
        "color": "Merah",
        "selling_price": 47000,
        "stock_quantity": 50
    },
    {
        "id": "v-172",
        "product_id": "p-9",
        "sku": "ROKTUR-21-COKE",
        "size": "21",
        "color": "Cokelat",
        "selling_price": 47000,
        "stock_quantity": 50
    },
    {
        "id": "v-173",
        "product_id": "p-9",
        "sku": "ROKTUR-21-BIRU",
        "size": "21",
        "color": "Biru",
        "selling_price": 47000,
        "stock_quantity": 50
    },
    {
        "id": "v-174",
        "product_id": "p-9",
        "sku": "ROKTUR-21-ABU",
        "size": "21",
        "color": "Abu",
        "selling_price": 47000,
        "stock_quantity": 50
    },
    {
        "id": "v-175",
        "product_id": "p-9",
        "sku": "ROKTUR-21-HIJA",
        "size": "21",
        "color": "Hijau",
        "selling_price": 47000,
        "stock_quantity": 50
    },
    {
        "id": "v-176",
        "product_id": "p-9",
        "sku": "ROKTUR-21-PUTI",
        "size": "21",
        "color": "Putih",
        "selling_price": 47000,
        "stock_quantity": 50
    },
    {
        "id": "v-177",
        "product_id": "p-9",
        "sku": "ROKTUR-21-HITA",
        "size": "21",
        "color": "Hitam",
        "selling_price": 47000,
        "stock_quantity": 50
    },
    {
        "id": "v-178",
        "product_id": "p-9",
        "sku": "ROKTUR-22-MERA",
        "size": "22",
        "color": "Merah",
        "selling_price": 48000,
        "stock_quantity": 50
    },
    {
        "id": "v-179",
        "product_id": "p-9",
        "sku": "ROKTUR-22-COKE",
        "size": "22",
        "color": "Cokelat",
        "selling_price": 48000,
        "stock_quantity": 50
    },
    {
        "id": "v-180",
        "product_id": "p-9",
        "sku": "ROKTUR-22-BIRU",
        "size": "22",
        "color": "Biru",
        "selling_price": 48000,
        "stock_quantity": 50
    },
    {
        "id": "v-181",
        "product_id": "p-9",
        "sku": "ROKTUR-22-ABU",
        "size": "22",
        "color": "Abu",
        "selling_price": 48000,
        "stock_quantity": 50
    },
    {
        "id": "v-182",
        "product_id": "p-9",
        "sku": "ROKTUR-22-HIJA",
        "size": "22",
        "color": "Hijau",
        "selling_price": 48000,
        "stock_quantity": 50
    },
    {
        "id": "v-183",
        "product_id": "p-9",
        "sku": "ROKTUR-22-PUTI",
        "size": "22",
        "color": "Putih",
        "selling_price": 48000,
        "stock_quantity": 50
    },
    {
        "id": "v-184",
        "product_id": "p-9",
        "sku": "ROKTUR-22-HITA",
        "size": "22",
        "color": "Hitam",
        "selling_price": 48000,
        "stock_quantity": 50
    },
    {
        "id": "v-185",
        "product_id": "p-9",
        "sku": "ROKTUR-23-MERA",
        "size": "23",
        "color": "Merah",
        "selling_price": 49000,
        "stock_quantity": 50
    },
    {
        "id": "v-186",
        "product_id": "p-9",
        "sku": "ROKTUR-23-COKE",
        "size": "23",
        "color": "Cokelat",
        "selling_price": 49000,
        "stock_quantity": 50
    },
    {
        "id": "v-187",
        "product_id": "p-9",
        "sku": "ROKTUR-23-BIRU",
        "size": "23",
        "color": "Biru",
        "selling_price": 49000,
        "stock_quantity": 50
    },
    {
        "id": "v-188",
        "product_id": "p-9",
        "sku": "ROKTUR-23-ABU",
        "size": "23",
        "color": "Abu",
        "selling_price": 49000,
        "stock_quantity": 50
    },
    {
        "id": "v-189",
        "product_id": "p-9",
        "sku": "ROKTUR-23-HIJA",
        "size": "23",
        "color": "Hijau",
        "selling_price": 49000,
        "stock_quantity": 50
    },
    {
        "id": "v-190",
        "product_id": "p-9",
        "sku": "ROKTUR-23-PUTI",
        "size": "23",
        "color": "Putih",
        "selling_price": 49000,
        "stock_quantity": 50
    },
    {
        "id": "v-191",
        "product_id": "p-9",
        "sku": "ROKTUR-23-HITA",
        "size": "23",
        "color": "Hitam",
        "selling_price": 49000,
        "stock_quantity": 50
    },
    {
        "id": "v-192",
        "product_id": "p-9",
        "sku": "ROKTUR-24-MERA",
        "size": "24",
        "color": "Merah",
        "selling_price": 50000,
        "stock_quantity": 50
    },
    {
        "id": "v-193",
        "product_id": "p-9",
        "sku": "ROKTUR-24-COKE",
        "size": "24",
        "color": "Cokelat",
        "selling_price": 50000,
        "stock_quantity": 50
    },
    {
        "id": "v-194",
        "product_id": "p-9",
        "sku": "ROKTUR-24-BIRU",
        "size": "24",
        "color": "Biru",
        "selling_price": 50000,
        "stock_quantity": 50
    },
    {
        "id": "v-195",
        "product_id": "p-9",
        "sku": "ROKTUR-24-ABU",
        "size": "24",
        "color": "Abu",
        "selling_price": 50000,
        "stock_quantity": 50
    },
    {
        "id": "v-196",
        "product_id": "p-9",
        "sku": "ROKTUR-24-HIJA",
        "size": "24",
        "color": "Hijau",
        "selling_price": 50000,
        "stock_quantity": 50
    },
    {
        "id": "v-197",
        "product_id": "p-9",
        "sku": "ROKTUR-24-PUTI",
        "size": "24",
        "color": "Putih",
        "selling_price": 50000,
        "stock_quantity": 50
    },
    {
        "id": "v-198",
        "product_id": "p-9",
        "sku": "ROKTUR-24-HITA",
        "size": "24",
        "color": "Hitam",
        "selling_price": 50000,
        "stock_quantity": 50
    },
    {
        "id": "v-199",
        "product_id": "p-9",
        "sku": "ROKTUR-25-MERA",
        "size": "25",
        "color": "Merah",
        "selling_price": 51000,
        "stock_quantity": 50
    },
    {
        "id": "v-200",
        "product_id": "p-9",
        "sku": "ROKTUR-25-COKE",
        "size": "25",
        "color": "Cokelat",
        "selling_price": 51000,
        "stock_quantity": 50
    },
    {
        "id": "v-201",
        "product_id": "p-9",
        "sku": "ROKTUR-25-BIRU",
        "size": "25",
        "color": "Biru",
        "selling_price": 51000,
        "stock_quantity": 50
    },
    {
        "id": "v-202",
        "product_id": "p-9",
        "sku": "ROKTUR-25-ABU",
        "size": "25",
        "color": "Abu",
        "selling_price": 51000,
        "stock_quantity": 50
    },
    {
        "id": "v-203",
        "product_id": "p-9",
        "sku": "ROKTUR-25-HIJA",
        "size": "25",
        "color": "Hijau",
        "selling_price": 51000,
        "stock_quantity": 50
    },
    {
        "id": "v-204",
        "product_id": "p-9",
        "sku": "ROKTUR-25-PUTI",
        "size": "25",
        "color": "Putih",
        "selling_price": 51000,
        "stock_quantity": 50
    },
    {
        "id": "v-205",
        "product_id": "p-9",
        "sku": "ROKTUR-25-HITA",
        "size": "25",
        "color": "Hitam",
        "selling_price": 51000,
        "stock_quantity": 50
    },
    {
        "id": "v-206",
        "product_id": "p-9",
        "sku": "ROKTUR-26-MERA",
        "size": "26",
        "color": "Merah",
        "selling_price": 52000,
        "stock_quantity": 50
    },
    {
        "id": "v-207",
        "product_id": "p-9",
        "sku": "ROKTUR-26-COKE",
        "size": "26",
        "color": "Cokelat",
        "selling_price": 52000,
        "stock_quantity": 50
    },
    {
        "id": "v-208",
        "product_id": "p-9",
        "sku": "ROKTUR-26-BIRU",
        "size": "26",
        "color": "Biru",
        "selling_price": 52000,
        "stock_quantity": 50
    },
    {
        "id": "v-209",
        "product_id": "p-9",
        "sku": "ROKTUR-26-ABU",
        "size": "26",
        "color": "Abu",
        "selling_price": 52000,
        "stock_quantity": 50
    },
    {
        "id": "v-210",
        "product_id": "p-9",
        "sku": "ROKTUR-26-HIJA",
        "size": "26",
        "color": "Hijau",
        "selling_price": 52000,
        "stock_quantity": 50
    },
    {
        "id": "v-211",
        "product_id": "p-9",
        "sku": "ROKTUR-26-PUTI",
        "size": "26",
        "color": "Putih",
        "selling_price": 52000,
        "stock_quantity": 50
    },
    {
        "id": "v-212",
        "product_id": "p-9",
        "sku": "ROKTUR-26-HITA",
        "size": "26",
        "color": "Hitam",
        "selling_price": 52000,
        "stock_quantity": 50
    },
    {
        "id": "v-213",
        "product_id": "p-9",
        "sku": "ROKTUR-15-MERA",
        "size": "15",
        "color": "Merah",
        "selling_price": 55000,
        "stock_quantity": 50
    },
    {
        "id": "v-214",
        "product_id": "p-9",
        "sku": "ROKTUR-15-COKE",
        "size": "15",
        "color": "Cokelat",
        "selling_price": 55000,
        "stock_quantity": 50
    },
    {
        "id": "v-215",
        "product_id": "p-9",
        "sku": "ROKTUR-15-BIRU",
        "size": "15",
        "color": "Biru",
        "selling_price": 55000,
        "stock_quantity": 50
    },
    {
        "id": "v-216",
        "product_id": "p-9",
        "sku": "ROKTUR-15-ABU",
        "size": "15",
        "color": "Abu",
        "selling_price": 55000,
        "stock_quantity": 50
    },
    {
        "id": "v-217",
        "product_id": "p-9",
        "sku": "ROKTUR-15-HIJA",
        "size": "15",
        "color": "Hijau",
        "selling_price": 55000,
        "stock_quantity": 50
    },
    {
        "id": "v-218",
        "product_id": "p-9",
        "sku": "ROKTUR-15-PUTI",
        "size": "15",
        "color": "Putih",
        "selling_price": 55000,
        "stock_quantity": 50
    },
    {
        "id": "v-219",
        "product_id": "p-9",
        "sku": "ROKTUR-15-HITA",
        "size": "15",
        "color": "Hitam",
        "selling_price": 55000,
        "stock_quantity": 50
    },
    {
        "id": "v-220",
        "product_id": "p-9",
        "sku": "ROKTUR-16-MERA",
        "size": "16",
        "color": "Merah",
        "selling_price": 56000,
        "stock_quantity": 50
    },
    {
        "id": "v-221",
        "product_id": "p-9",
        "sku": "ROKTUR-16-COKE",
        "size": "16",
        "color": "Cokelat",
        "selling_price": 56000,
        "stock_quantity": 50
    },
    {
        "id": "v-222",
        "product_id": "p-9",
        "sku": "ROKTUR-16-BIRU",
        "size": "16",
        "color": "Biru",
        "selling_price": 56000,
        "stock_quantity": 50
    },
    {
        "id": "v-223",
        "product_id": "p-9",
        "sku": "ROKTUR-16-ABU",
        "size": "16",
        "color": "Abu",
        "selling_price": 56000,
        "stock_quantity": 50
    },
    {
        "id": "v-224",
        "product_id": "p-9",
        "sku": "ROKTUR-16-HIJA",
        "size": "16",
        "color": "Hijau",
        "selling_price": 56000,
        "stock_quantity": 50
    },
    {
        "id": "v-225",
        "product_id": "p-9",
        "sku": "ROKTUR-16-PUTI",
        "size": "16",
        "color": "Putih",
        "selling_price": 56000,
        "stock_quantity": 50
    },
    {
        "id": "v-226",
        "product_id": "p-9",
        "sku": "ROKTUR-16-HITA",
        "size": "16",
        "color": "Hitam",
        "selling_price": 56000,
        "stock_quantity": 50
    },
    {
        "id": "v-227",
        "product_id": "p-9",
        "sku": "ROKTUR-S-MERA",
        "size": "S",
        "color": "Merah",
        "selling_price": 59000,
        "stock_quantity": 50
    },
    {
        "id": "v-228",
        "product_id": "p-9",
        "sku": "ROKTUR-S-COKE",
        "size": "S",
        "color": "Cokelat",
        "selling_price": 59000,
        "stock_quantity": 50
    },
    {
        "id": "v-229",
        "product_id": "p-9",
        "sku": "ROKTUR-S-BIRU",
        "size": "S",
        "color": "Biru",
        "selling_price": 59000,
        "stock_quantity": 50
    },
    {
        "id": "v-230",
        "product_id": "p-9",
        "sku": "ROKTUR-S-ABU",
        "size": "S",
        "color": "Abu",
        "selling_price": 59000,
        "stock_quantity": 50
    },
    {
        "id": "v-231",
        "product_id": "p-9",
        "sku": "ROKTUR-S-HIJA",
        "size": "S",
        "color": "Hijau",
        "selling_price": 59000,
        "stock_quantity": 50
    },
    {
        "id": "v-232",
        "product_id": "p-9",
        "sku": "ROKTUR-S-PUTI",
        "size": "S",
        "color": "Putih",
        "selling_price": 59000,
        "stock_quantity": 50
    },
    {
        "id": "v-233",
        "product_id": "p-9",
        "sku": "ROKTUR-S-HITA",
        "size": "S",
        "color": "Hitam",
        "selling_price": 59000,
        "stock_quantity": 50
    },
    {
        "id": "v-234",
        "product_id": "p-9",
        "sku": "ROKTUR-M-MERA",
        "size": "M",
        "color": "Merah",
        "selling_price": 60000,
        "stock_quantity": 50
    },
    {
        "id": "v-235",
        "product_id": "p-9",
        "sku": "ROKTUR-M-COKE",
        "size": "M",
        "color": "Cokelat",
        "selling_price": 60000,
        "stock_quantity": 50
    },
    {
        "id": "v-236",
        "product_id": "p-9",
        "sku": "ROKTUR-M-BIRU",
        "size": "M",
        "color": "Biru",
        "selling_price": 60000,
        "stock_quantity": 50
    },
    {
        "id": "v-237",
        "product_id": "p-9",
        "sku": "ROKTUR-M-ABU",
        "size": "M",
        "color": "Abu",
        "selling_price": 60000,
        "stock_quantity": 50
    },
    {
        "id": "v-238",
        "product_id": "p-9",
        "sku": "ROKTUR-M-HIJA",
        "size": "M",
        "color": "Hijau",
        "selling_price": 60000,
        "stock_quantity": 50
    },
    {
        "id": "v-239",
        "product_id": "p-9",
        "sku": "ROKTUR-M-PUTI",
        "size": "M",
        "color": "Putih",
        "selling_price": 60000,
        "stock_quantity": 50
    },
    {
        "id": "v-240",
        "product_id": "p-9",
        "sku": "ROKTUR-M-HITA",
        "size": "M",
        "color": "Hitam",
        "selling_price": 60000,
        "stock_quantity": 50
    },
    {
        "id": "v-241",
        "product_id": "p-9",
        "sku": "ROKTUR-L-MERA",
        "size": "L",
        "color": "Merah",
        "selling_price": 61000,
        "stock_quantity": 50
    },
    {
        "id": "v-242",
        "product_id": "p-9",
        "sku": "ROKTUR-L-COKE",
        "size": "L",
        "color": "Cokelat",
        "selling_price": 61000,
        "stock_quantity": 50
    },
    {
        "id": "v-243",
        "product_id": "p-9",
        "sku": "ROKTUR-L-BIRU",
        "size": "L",
        "color": "Biru",
        "selling_price": 61000,
        "stock_quantity": 50
    },
    {
        "id": "v-244",
        "product_id": "p-9",
        "sku": "ROKTUR-L-ABU",
        "size": "L",
        "color": "Abu",
        "selling_price": 61000,
        "stock_quantity": 50
    },
    {
        "id": "v-245",
        "product_id": "p-9",
        "sku": "ROKTUR-L-HIJA",
        "size": "L",
        "color": "Hijau",
        "selling_price": 61000,
        "stock_quantity": 50
    },
    {
        "id": "v-246",
        "product_id": "p-9",
        "sku": "ROKTUR-L-PUTI",
        "size": "L",
        "color": "Putih",
        "selling_price": 61000,
        "stock_quantity": 50
    },
    {
        "id": "v-247",
        "product_id": "p-9",
        "sku": "ROKTUR-L-HITA",
        "size": "L",
        "color": "Hitam",
        "selling_price": 61000,
        "stock_quantity": 50
    },
    {
        "id": "v-248",
        "product_id": "p-9",
        "sku": "ROKTUR-XL-MERA",
        "size": "XL",
        "color": "Merah",
        "selling_price": 62000,
        "stock_quantity": 50
    },
    {
        "id": "v-249",
        "product_id": "p-9",
        "sku": "ROKTUR-XL-COKE",
        "size": "XL",
        "color": "Cokelat",
        "selling_price": 62000,
        "stock_quantity": 50
    },
    {
        "id": "v-250",
        "product_id": "p-9",
        "sku": "ROKTUR-XL-BIRU",
        "size": "XL",
        "color": "Biru",
        "selling_price": 62000,
        "stock_quantity": 50
    },
    {
        "id": "v-251",
        "product_id": "p-9",
        "sku": "ROKTUR-XL-ABU",
        "size": "XL",
        "color": "Abu",
        "selling_price": 62000,
        "stock_quantity": 50
    },
    {
        "id": "v-252",
        "product_id": "p-9",
        "sku": "ROKTUR-XL-HIJA",
        "size": "XL",
        "color": "Hijau",
        "selling_price": 62000,
        "stock_quantity": 50
    },
    {
        "id": "v-253",
        "product_id": "p-9",
        "sku": "ROKTUR-XL-PUTI",
        "size": "XL",
        "color": "Putih",
        "selling_price": 62000,
        "stock_quantity": 50
    },
    {
        "id": "v-254",
        "product_id": "p-9",
        "sku": "ROKTUR-XL-HITA",
        "size": "XL",
        "color": "Hitam",
        "selling_price": 62000,
        "stock_quantity": 50
    },
    {
        "id": "v-255",
        "product_id": "p-10",
        "sku": "CELANA-3-MERA",
        "size": "3",
        "color": "Merah",
        "selling_price": 38000,
        "stock_quantity": 50
    },
    {
        "id": "v-256",
        "product_id": "p-10",
        "sku": "CELANA-3-COKE",
        "size": "3",
        "color": "Cokelat",
        "selling_price": 38000,
        "stock_quantity": 50
    },
    {
        "id": "v-257",
        "product_id": "p-10",
        "sku": "CELANA-3-BIRU",
        "size": "3",
        "color": "Biru",
        "selling_price": 38000,
        "stock_quantity": 50
    },
    {
        "id": "v-258",
        "product_id": "p-10",
        "sku": "CELANA-3-ABU",
        "size": "3",
        "color": "Abu",
        "selling_price": 38000,
        "stock_quantity": 50
    },
    {
        "id": "v-259",
        "product_id": "p-10",
        "sku": "CELANA-3-HIJA",
        "size": "3",
        "color": "Hijau",
        "selling_price": 38000,
        "stock_quantity": 50
    },
    {
        "id": "v-260",
        "product_id": "p-10",
        "sku": "CELANA-3-PUTI",
        "size": "3",
        "color": "Putih",
        "selling_price": 38000,
        "stock_quantity": 50
    },
    {
        "id": "v-261",
        "product_id": "p-10",
        "sku": "CELANA-3-HITA",
        "size": "3",
        "color": "Hitam",
        "selling_price": 38000,
        "stock_quantity": 50
    },
    {
        "id": "v-262",
        "product_id": "p-10",
        "sku": "CELANA-4-MERA",
        "size": "4",
        "color": "Merah",
        "selling_price": 39000,
        "stock_quantity": 50
    },
    {
        "id": "v-263",
        "product_id": "p-10",
        "sku": "CELANA-4-COKE",
        "size": "4",
        "color": "Cokelat",
        "selling_price": 39000,
        "stock_quantity": 50
    },
    {
        "id": "v-264",
        "product_id": "p-10",
        "sku": "CELANA-4-BIRU",
        "size": "4",
        "color": "Biru",
        "selling_price": 39000,
        "stock_quantity": 50
    },
    {
        "id": "v-265",
        "product_id": "p-10",
        "sku": "CELANA-4-ABU",
        "size": "4",
        "color": "Abu",
        "selling_price": 39000,
        "stock_quantity": 50
    },
    {
        "id": "v-266",
        "product_id": "p-10",
        "sku": "CELANA-4-HIJA",
        "size": "4",
        "color": "Hijau",
        "selling_price": 39000,
        "stock_quantity": 50
    },
    {
        "id": "v-267",
        "product_id": "p-10",
        "sku": "CELANA-4-PUTI",
        "size": "4",
        "color": "Putih",
        "selling_price": 39000,
        "stock_quantity": 50
    },
    {
        "id": "v-268",
        "product_id": "p-10",
        "sku": "CELANA-4-HITA",
        "size": "4",
        "color": "Hitam",
        "selling_price": 39000,
        "stock_quantity": 50
    },
    {
        "id": "v-269",
        "product_id": "p-10",
        "sku": "CELANA-5-MERA",
        "size": "5",
        "color": "Merah",
        "selling_price": 40000,
        "stock_quantity": 50
    },
    {
        "id": "v-270",
        "product_id": "p-10",
        "sku": "CELANA-5-COKE",
        "size": "5",
        "color": "Cokelat",
        "selling_price": 40000,
        "stock_quantity": 50
    },
    {
        "id": "v-271",
        "product_id": "p-10",
        "sku": "CELANA-5-BIRU",
        "size": "5",
        "color": "Biru",
        "selling_price": 40000,
        "stock_quantity": 50
    },
    {
        "id": "v-272",
        "product_id": "p-10",
        "sku": "CELANA-5-ABU",
        "size": "5",
        "color": "Abu",
        "selling_price": 40000,
        "stock_quantity": 50
    },
    {
        "id": "v-273",
        "product_id": "p-10",
        "sku": "CELANA-5-HIJA",
        "size": "5",
        "color": "Hijau",
        "selling_price": 40000,
        "stock_quantity": 50
    },
    {
        "id": "v-274",
        "product_id": "p-10",
        "sku": "CELANA-5-PUTI",
        "size": "5",
        "color": "Putih",
        "selling_price": 40000,
        "stock_quantity": 50
    },
    {
        "id": "v-275",
        "product_id": "p-10",
        "sku": "CELANA-5-HITA",
        "size": "5",
        "color": "Hitam",
        "selling_price": 40000,
        "stock_quantity": 50
    },
    {
        "id": "v-276",
        "product_id": "p-10",
        "sku": "CELANA-6-MERA",
        "size": "6",
        "color": "Merah",
        "selling_price": 41000,
        "stock_quantity": 50
    },
    {
        "id": "v-277",
        "product_id": "p-10",
        "sku": "CELANA-6-COKE",
        "size": "6",
        "color": "Cokelat",
        "selling_price": 41000,
        "stock_quantity": 50
    },
    {
        "id": "v-278",
        "product_id": "p-10",
        "sku": "CELANA-6-BIRU",
        "size": "6",
        "color": "Biru",
        "selling_price": 41000,
        "stock_quantity": 50
    },
    {
        "id": "v-279",
        "product_id": "p-10",
        "sku": "CELANA-6-ABU",
        "size": "6",
        "color": "Abu",
        "selling_price": 41000,
        "stock_quantity": 50
    },
    {
        "id": "v-280",
        "product_id": "p-10",
        "sku": "CELANA-6-HIJA",
        "size": "6",
        "color": "Hijau",
        "selling_price": 41000,
        "stock_quantity": 50
    },
    {
        "id": "v-281",
        "product_id": "p-10",
        "sku": "CELANA-6-PUTI",
        "size": "6",
        "color": "Putih",
        "selling_price": 41000,
        "stock_quantity": 50
    },
    {
        "id": "v-282",
        "product_id": "p-10",
        "sku": "CELANA-6-HITA",
        "size": "6",
        "color": "Hitam",
        "selling_price": 41000,
        "stock_quantity": 50
    },
    {
        "id": "v-283",
        "product_id": "p-10",
        "sku": "CELANA-7-MERA",
        "size": "7",
        "color": "Merah",
        "selling_price": 42000,
        "stock_quantity": 50
    },
    {
        "id": "v-284",
        "product_id": "p-10",
        "sku": "CELANA-7-COKE",
        "size": "7",
        "color": "Cokelat",
        "selling_price": 42000,
        "stock_quantity": 50
    },
    {
        "id": "v-285",
        "product_id": "p-10",
        "sku": "CELANA-7-BIRU",
        "size": "7",
        "color": "Biru",
        "selling_price": 42000,
        "stock_quantity": 50
    },
    {
        "id": "v-286",
        "product_id": "p-10",
        "sku": "CELANA-7-ABU",
        "size": "7",
        "color": "Abu",
        "selling_price": 42000,
        "stock_quantity": 50
    },
    {
        "id": "v-287",
        "product_id": "p-10",
        "sku": "CELANA-7-HIJA",
        "size": "7",
        "color": "Hijau",
        "selling_price": 42000,
        "stock_quantity": 50
    },
    {
        "id": "v-288",
        "product_id": "p-10",
        "sku": "CELANA-7-PUTI",
        "size": "7",
        "color": "Putih",
        "selling_price": 42000,
        "stock_quantity": 50
    },
    {
        "id": "v-289",
        "product_id": "p-10",
        "sku": "CELANA-7-HITA",
        "size": "7",
        "color": "Hitam",
        "selling_price": 42000,
        "stock_quantity": 50
    },
    {
        "id": "v-290",
        "product_id": "p-10",
        "sku": "CELANA-8-MERA",
        "size": "8",
        "color": "Merah",
        "selling_price": 43000,
        "stock_quantity": 50
    },
    {
        "id": "v-291",
        "product_id": "p-10",
        "sku": "CELANA-8-COKE",
        "size": "8",
        "color": "Cokelat",
        "selling_price": 43000,
        "stock_quantity": 50
    },
    {
        "id": "v-292",
        "product_id": "p-10",
        "sku": "CELANA-8-BIRU",
        "size": "8",
        "color": "Biru",
        "selling_price": 43000,
        "stock_quantity": 50
    },
    {
        "id": "v-293",
        "product_id": "p-10",
        "sku": "CELANA-8-ABU",
        "size": "8",
        "color": "Abu",
        "selling_price": 43000,
        "stock_quantity": 50
    },
    {
        "id": "v-294",
        "product_id": "p-10",
        "sku": "CELANA-8-HIJA",
        "size": "8",
        "color": "Hijau",
        "selling_price": 43000,
        "stock_quantity": 50
    },
    {
        "id": "v-295",
        "product_id": "p-10",
        "sku": "CELANA-8-PUTI",
        "size": "8",
        "color": "Putih",
        "selling_price": 43000,
        "stock_quantity": 50
    },
    {
        "id": "v-296",
        "product_id": "p-10",
        "sku": "CELANA-8-HITA",
        "size": "8",
        "color": "Hitam",
        "selling_price": 43000,
        "stock_quantity": 50
    },
    {
        "id": "v-297",
        "product_id": "p-10",
        "sku": "CELANA-9-MERA",
        "size": "9",
        "color": "Merah",
        "selling_price": 44000,
        "stock_quantity": 50
    },
    {
        "id": "v-298",
        "product_id": "p-10",
        "sku": "CELANA-9-COKE",
        "size": "9",
        "color": "Cokelat",
        "selling_price": 44000,
        "stock_quantity": 50
    },
    {
        "id": "v-299",
        "product_id": "p-10",
        "sku": "CELANA-9-BIRU",
        "size": "9",
        "color": "Biru",
        "selling_price": 44000,
        "stock_quantity": 50
    },
    {
        "id": "v-300",
        "product_id": "p-10",
        "sku": "CELANA-9-ABU",
        "size": "9",
        "color": "Abu",
        "selling_price": 44000,
        "stock_quantity": 50
    },
    {
        "id": "v-301",
        "product_id": "p-10",
        "sku": "CELANA-9-HIJA",
        "size": "9",
        "color": "Hijau",
        "selling_price": 44000,
        "stock_quantity": 50
    },
    {
        "id": "v-302",
        "product_id": "p-10",
        "sku": "CELANA-9-PUTI",
        "size": "9",
        "color": "Putih",
        "selling_price": 44000,
        "stock_quantity": 50
    },
    {
        "id": "v-303",
        "product_id": "p-10",
        "sku": "CELANA-9-HITA",
        "size": "9",
        "color": "Hitam",
        "selling_price": 44000,
        "stock_quantity": 50
    },
    {
        "id": "v-304",
        "product_id": "p-10",
        "sku": "CELANA-10-MERA",
        "size": "10",
        "color": "Merah",
        "selling_price": 45000,
        "stock_quantity": 50
    },
    {
        "id": "v-305",
        "product_id": "p-10",
        "sku": "CELANA-10-COKE",
        "size": "10",
        "color": "Cokelat",
        "selling_price": 45000,
        "stock_quantity": 50
    },
    {
        "id": "v-306",
        "product_id": "p-10",
        "sku": "CELANA-10-BIRU",
        "size": "10",
        "color": "Biru",
        "selling_price": 45000,
        "stock_quantity": 50
    },
    {
        "id": "v-307",
        "product_id": "p-10",
        "sku": "CELANA-10-ABU",
        "size": "10",
        "color": "Abu",
        "selling_price": 45000,
        "stock_quantity": 50
    },
    {
        "id": "v-308",
        "product_id": "p-10",
        "sku": "CELANA-10-HIJA",
        "size": "10",
        "color": "Hijau",
        "selling_price": 45000,
        "stock_quantity": 50
    },
    {
        "id": "v-309",
        "product_id": "p-10",
        "sku": "CELANA-10-PUTI",
        "size": "10",
        "color": "Putih",
        "selling_price": 45000,
        "stock_quantity": 50
    },
    {
        "id": "v-310",
        "product_id": "p-10",
        "sku": "CELANA-10-HITA",
        "size": "10",
        "color": "Hitam",
        "selling_price": 45000,
        "stock_quantity": 50
    },
    {
        "id": "v-311",
        "product_id": "p-11",
        "sku": "CELANA-3-MERA",
        "size": "3",
        "color": "Merah",
        "selling_price": 49000,
        "stock_quantity": 50
    },
    {
        "id": "v-312",
        "product_id": "p-11",
        "sku": "CELANA-3-COKE",
        "size": "3",
        "color": "Cokelat",
        "selling_price": 49000,
        "stock_quantity": 50
    },
    {
        "id": "v-313",
        "product_id": "p-11",
        "sku": "CELANA-3-BIRU",
        "size": "3",
        "color": "Biru",
        "selling_price": 49000,
        "stock_quantity": 50
    },
    {
        "id": "v-314",
        "product_id": "p-11",
        "sku": "CELANA-3-ABU",
        "size": "3",
        "color": "Abu",
        "selling_price": 49000,
        "stock_quantity": 50
    },
    {
        "id": "v-315",
        "product_id": "p-11",
        "sku": "CELANA-3-HIJA",
        "size": "3",
        "color": "Hijau",
        "selling_price": 49000,
        "stock_quantity": 50
    },
    {
        "id": "v-316",
        "product_id": "p-11",
        "sku": "CELANA-3-PUTI",
        "size": "3",
        "color": "Putih",
        "selling_price": 49000,
        "stock_quantity": 50
    },
    {
        "id": "v-317",
        "product_id": "p-11",
        "sku": "CELANA-3-HITA",
        "size": "3",
        "color": "Hitam",
        "selling_price": 49000,
        "stock_quantity": 50
    },
    {
        "id": "v-318",
        "product_id": "p-11",
        "sku": "CELANA-4-MERA",
        "size": "4",
        "color": "Merah",
        "selling_price": 50000,
        "stock_quantity": 50
    },
    {
        "id": "v-319",
        "product_id": "p-11",
        "sku": "CELANA-4-COKE",
        "size": "4",
        "color": "Cokelat",
        "selling_price": 50000,
        "stock_quantity": 50
    },
    {
        "id": "v-320",
        "product_id": "p-11",
        "sku": "CELANA-4-BIRU",
        "size": "4",
        "color": "Biru",
        "selling_price": 50000,
        "stock_quantity": 50
    },
    {
        "id": "v-321",
        "product_id": "p-11",
        "sku": "CELANA-4-ABU",
        "size": "4",
        "color": "Abu",
        "selling_price": 50000,
        "stock_quantity": 50
    },
    {
        "id": "v-322",
        "product_id": "p-11",
        "sku": "CELANA-4-HIJA",
        "size": "4",
        "color": "Hijau",
        "selling_price": 50000,
        "stock_quantity": 50
    },
    {
        "id": "v-323",
        "product_id": "p-11",
        "sku": "CELANA-4-PUTI",
        "size": "4",
        "color": "Putih",
        "selling_price": 50000,
        "stock_quantity": 50
    },
    {
        "id": "v-324",
        "product_id": "p-11",
        "sku": "CELANA-4-HITA",
        "size": "4",
        "color": "Hitam",
        "selling_price": 50000,
        "stock_quantity": 50
    },
    {
        "id": "v-325",
        "product_id": "p-11",
        "sku": "CELANA-5-MERA",
        "size": "5",
        "color": "Merah",
        "selling_price": 51000,
        "stock_quantity": 50
    },
    {
        "id": "v-326",
        "product_id": "p-11",
        "sku": "CELANA-5-COKE",
        "size": "5",
        "color": "Cokelat",
        "selling_price": 51000,
        "stock_quantity": 50
    },
    {
        "id": "v-327",
        "product_id": "p-11",
        "sku": "CELANA-5-BIRU",
        "size": "5",
        "color": "Biru",
        "selling_price": 51000,
        "stock_quantity": 50
    },
    {
        "id": "v-328",
        "product_id": "p-11",
        "sku": "CELANA-5-ABU",
        "size": "5",
        "color": "Abu",
        "selling_price": 51000,
        "stock_quantity": 50
    },
    {
        "id": "v-329",
        "product_id": "p-11",
        "sku": "CELANA-5-HIJA",
        "size": "5",
        "color": "Hijau",
        "selling_price": 51000,
        "stock_quantity": 50
    },
    {
        "id": "v-330",
        "product_id": "p-11",
        "sku": "CELANA-5-PUTI",
        "size": "5",
        "color": "Putih",
        "selling_price": 51000,
        "stock_quantity": 50
    },
    {
        "id": "v-331",
        "product_id": "p-11",
        "sku": "CELANA-5-HITA",
        "size": "5",
        "color": "Hitam",
        "selling_price": 51000,
        "stock_quantity": 50
    },
    {
        "id": "v-332",
        "product_id": "p-11",
        "sku": "CELANA-6-MERA",
        "size": "6",
        "color": "Merah",
        "selling_price": 52000,
        "stock_quantity": 50
    },
    {
        "id": "v-333",
        "product_id": "p-11",
        "sku": "CELANA-6-COKE",
        "size": "6",
        "color": "Cokelat",
        "selling_price": 52000,
        "stock_quantity": 50
    },
    {
        "id": "v-334",
        "product_id": "p-11",
        "sku": "CELANA-6-BIRU",
        "size": "6",
        "color": "Biru",
        "selling_price": 52000,
        "stock_quantity": 50
    },
    {
        "id": "v-335",
        "product_id": "p-11",
        "sku": "CELANA-6-ABU",
        "size": "6",
        "color": "Abu",
        "selling_price": 52000,
        "stock_quantity": 50
    },
    {
        "id": "v-336",
        "product_id": "p-11",
        "sku": "CELANA-6-HIJA",
        "size": "6",
        "color": "Hijau",
        "selling_price": 52000,
        "stock_quantity": 50
    },
    {
        "id": "v-337",
        "product_id": "p-11",
        "sku": "CELANA-6-PUTI",
        "size": "6",
        "color": "Putih",
        "selling_price": 52000,
        "stock_quantity": 50
    },
    {
        "id": "v-338",
        "product_id": "p-11",
        "sku": "CELANA-6-HITA",
        "size": "6",
        "color": "Hitam",
        "selling_price": 52000,
        "stock_quantity": 50
    },
    {
        "id": "v-339",
        "product_id": "p-11",
        "sku": "CELANA-7-MERA",
        "size": "7",
        "color": "Merah",
        "selling_price": 54000,
        "stock_quantity": 50
    },
    {
        "id": "v-340",
        "product_id": "p-11",
        "sku": "CELANA-7-COKE",
        "size": "7",
        "color": "Cokelat",
        "selling_price": 54000,
        "stock_quantity": 50
    },
    {
        "id": "v-341",
        "product_id": "p-11",
        "sku": "CELANA-7-BIRU",
        "size": "7",
        "color": "Biru",
        "selling_price": 54000,
        "stock_quantity": 50
    },
    {
        "id": "v-342",
        "product_id": "p-11",
        "sku": "CELANA-7-ABU",
        "size": "7",
        "color": "Abu",
        "selling_price": 54000,
        "stock_quantity": 50
    },
    {
        "id": "v-343",
        "product_id": "p-11",
        "sku": "CELANA-7-HIJA",
        "size": "7",
        "color": "Hijau",
        "selling_price": 54000,
        "stock_quantity": 50
    },
    {
        "id": "v-344",
        "product_id": "p-11",
        "sku": "CELANA-7-PUTI",
        "size": "7",
        "color": "Putih",
        "selling_price": 54000,
        "stock_quantity": 50
    },
    {
        "id": "v-345",
        "product_id": "p-11",
        "sku": "CELANA-7-HITA",
        "size": "7",
        "color": "Hitam",
        "selling_price": 54000,
        "stock_quantity": 50
    },
    {
        "id": "v-346",
        "product_id": "p-11",
        "sku": "CELANA-8-MERA",
        "size": "8",
        "color": "Merah",
        "selling_price": 56000,
        "stock_quantity": 50
    },
    {
        "id": "v-347",
        "product_id": "p-11",
        "sku": "CELANA-8-COKE",
        "size": "8",
        "color": "Cokelat",
        "selling_price": 56000,
        "stock_quantity": 50
    },
    {
        "id": "v-348",
        "product_id": "p-11",
        "sku": "CELANA-8-BIRU",
        "size": "8",
        "color": "Biru",
        "selling_price": 56000,
        "stock_quantity": 50
    },
    {
        "id": "v-349",
        "product_id": "p-11",
        "sku": "CELANA-8-ABU",
        "size": "8",
        "color": "Abu",
        "selling_price": 56000,
        "stock_quantity": 50
    },
    {
        "id": "v-350",
        "product_id": "p-11",
        "sku": "CELANA-8-HIJA",
        "size": "8",
        "color": "Hijau",
        "selling_price": 56000,
        "stock_quantity": 50
    },
    {
        "id": "v-351",
        "product_id": "p-11",
        "sku": "CELANA-8-PUTI",
        "size": "8",
        "color": "Putih",
        "selling_price": 56000,
        "stock_quantity": 50
    },
    {
        "id": "v-352",
        "product_id": "p-11",
        "sku": "CELANA-8-HITA",
        "size": "8",
        "color": "Hitam",
        "selling_price": 56000,
        "stock_quantity": 50
    },
    {
        "id": "v-353",
        "product_id": "p-11",
        "sku": "CELANA-9-MERA",
        "size": "9",
        "color": "Merah",
        "selling_price": 58000,
        "stock_quantity": 50
    },
    {
        "id": "v-354",
        "product_id": "p-11",
        "sku": "CELANA-9-COKE",
        "size": "9",
        "color": "Cokelat",
        "selling_price": 58000,
        "stock_quantity": 50
    },
    {
        "id": "v-355",
        "product_id": "p-11",
        "sku": "CELANA-9-BIRU",
        "size": "9",
        "color": "Biru",
        "selling_price": 58000,
        "stock_quantity": 50
    },
    {
        "id": "v-356",
        "product_id": "p-11",
        "sku": "CELANA-9-ABU",
        "size": "9",
        "color": "Abu",
        "selling_price": 58000,
        "stock_quantity": 50
    },
    {
        "id": "v-357",
        "product_id": "p-11",
        "sku": "CELANA-9-HIJA",
        "size": "9",
        "color": "Hijau",
        "selling_price": 58000,
        "stock_quantity": 50
    },
    {
        "id": "v-358",
        "product_id": "p-11",
        "sku": "CELANA-9-PUTI",
        "size": "9",
        "color": "Putih",
        "selling_price": 58000,
        "stock_quantity": 50
    },
    {
        "id": "v-359",
        "product_id": "p-11",
        "sku": "CELANA-9-HITA",
        "size": "9",
        "color": "Hitam",
        "selling_price": 58000,
        "stock_quantity": 50
    },
    {
        "id": "v-360",
        "product_id": "p-11",
        "sku": "CELANA-10-MERA",
        "size": "10",
        "color": "Merah",
        "selling_price": 60000,
        "stock_quantity": 50
    },
    {
        "id": "v-361",
        "product_id": "p-11",
        "sku": "CELANA-10-COKE",
        "size": "10",
        "color": "Cokelat",
        "selling_price": 60000,
        "stock_quantity": 50
    },
    {
        "id": "v-362",
        "product_id": "p-11",
        "sku": "CELANA-10-BIRU",
        "size": "10",
        "color": "Biru",
        "selling_price": 60000,
        "stock_quantity": 50
    },
    {
        "id": "v-363",
        "product_id": "p-11",
        "sku": "CELANA-10-ABU",
        "size": "10",
        "color": "Abu",
        "selling_price": 60000,
        "stock_quantity": 50
    },
    {
        "id": "v-364",
        "product_id": "p-11",
        "sku": "CELANA-10-HIJA",
        "size": "10",
        "color": "Hijau",
        "selling_price": 60000,
        "stock_quantity": 50
    },
    {
        "id": "v-365",
        "product_id": "p-11",
        "sku": "CELANA-10-PUTI",
        "size": "10",
        "color": "Putih",
        "selling_price": 60000,
        "stock_quantity": 50
    },
    {
        "id": "v-366",
        "product_id": "p-11",
        "sku": "CELANA-10-HITA",
        "size": "10",
        "color": "Hitam",
        "selling_price": 60000,
        "stock_quantity": 50
    },
    {
        "id": "v-367",
        "product_id": "p-12",
        "sku": "CELANA-3-PRAM",
        "size": "3",
        "color": "Pramuka",
        "selling_price": 64000,
        "stock_quantity": 50
    },
    {
        "id": "v-368",
        "product_id": "p-12",
        "sku": "CELANA-4-PRAM",
        "size": "4",
        "color": "Pramuka",
        "selling_price": 66000,
        "stock_quantity": 50
    },
    {
        "id": "v-369",
        "product_id": "p-12",
        "sku": "CELANA-5-PRAM",
        "size": "5",
        "color": "Pramuka",
        "selling_price": 68000,
        "stock_quantity": 50
    },
    {
        "id": "v-370",
        "product_id": "p-12",
        "sku": "CELANA-6-PRAM",
        "size": "6",
        "color": "Pramuka",
        "selling_price": 70000,
        "stock_quantity": 50
    },
    {
        "id": "v-371",
        "product_id": "p-12",
        "sku": "CELANA-7-PRAM",
        "size": "7",
        "color": "Pramuka",
        "selling_price": 72000,
        "stock_quantity": 50
    },
    {
        "id": "v-372",
        "product_id": "p-12",
        "sku": "CELANA-8-PRAM",
        "size": "8",
        "color": "Pramuka",
        "selling_price": 74000,
        "stock_quantity": 50
    },
    {
        "id": "v-373",
        "product_id": "p-12",
        "sku": "CELANA-9-PRAM",
        "size": "9",
        "color": "Pramuka",
        "selling_price": 76000,
        "stock_quantity": 50
    },
    {
        "id": "v-374",
        "product_id": "p-12",
        "sku": "CELANA-10-PRAM",
        "size": "10",
        "color": "Pramuka",
        "selling_price": 78000,
        "stock_quantity": 50
    },
    {
        "id": "v-375",
        "product_id": "p-13",
        "sku": "CELANA-27-BIRU",
        "size": "27",
        "color": "Biru",
        "selling_price": 58000,
        "stock_quantity": 50
    },
    {
        "id": "v-376",
        "product_id": "p-13",
        "sku": "CELANA-27-ABU",
        "size": "27",
        "color": "Abu",
        "selling_price": 58000,
        "stock_quantity": 50
    },
    {
        "id": "v-377",
        "product_id": "p-13",
        "sku": "CELANA-27-COKE",
        "size": "27",
        "color": "Cokelat",
        "selling_price": 58000,
        "stock_quantity": 50
    },
    {
        "id": "v-378",
        "product_id": "p-13",
        "sku": "CELANA-27-HITA",
        "size": "27",
        "color": "Hitam",
        "selling_price": 58000,
        "stock_quantity": 50
    },
    {
        "id": "v-379",
        "product_id": "p-13",
        "sku": "CELANA-S-BIRU",
        "size": "S",
        "color": "Biru",
        "selling_price": 60000,
        "stock_quantity": 50
    },
    {
        "id": "v-380",
        "product_id": "p-13",
        "sku": "CELANA-S-ABU",
        "size": "S",
        "color": "Abu",
        "selling_price": 60000,
        "stock_quantity": 50
    },
    {
        "id": "v-381",
        "product_id": "p-13",
        "sku": "CELANA-S-COKE",
        "size": "S",
        "color": "Cokelat",
        "selling_price": 60000,
        "stock_quantity": 50
    },
    {
        "id": "v-382",
        "product_id": "p-13",
        "sku": "CELANA-S-HITA",
        "size": "S",
        "color": "Hitam",
        "selling_price": 60000,
        "stock_quantity": 50
    },
    {
        "id": "v-383",
        "product_id": "p-13",
        "sku": "CELANA-M-BIRU",
        "size": "M",
        "color": "Biru",
        "selling_price": 61000,
        "stock_quantity": 50
    },
    {
        "id": "v-384",
        "product_id": "p-13",
        "sku": "CELANA-M-ABU",
        "size": "M",
        "color": "Abu",
        "selling_price": 61000,
        "stock_quantity": 50
    },
    {
        "id": "v-385",
        "product_id": "p-13",
        "sku": "CELANA-M-COKE",
        "size": "M",
        "color": "Cokelat",
        "selling_price": 61000,
        "stock_quantity": 50
    },
    {
        "id": "v-386",
        "product_id": "p-13",
        "sku": "CELANA-M-HITA",
        "size": "M",
        "color": "Hitam",
        "selling_price": 61000,
        "stock_quantity": 50
    },
    {
        "id": "v-387",
        "product_id": "p-13",
        "sku": "CELANA-L-BIRU",
        "size": "L",
        "color": "Biru",
        "selling_price": 62000,
        "stock_quantity": 50
    },
    {
        "id": "v-388",
        "product_id": "p-13",
        "sku": "CELANA-L-ABU",
        "size": "L",
        "color": "Abu",
        "selling_price": 62000,
        "stock_quantity": 50
    },
    {
        "id": "v-389",
        "product_id": "p-13",
        "sku": "CELANA-L-COKE",
        "size": "L",
        "color": "Cokelat",
        "selling_price": 62000,
        "stock_quantity": 50
    },
    {
        "id": "v-390",
        "product_id": "p-13",
        "sku": "CELANA-L-HITA",
        "size": "L",
        "color": "Hitam",
        "selling_price": 62000,
        "stock_quantity": 50
    },
    {
        "id": "v-391",
        "product_id": "p-13",
        "sku": "CELANA-XL-BIRU",
        "size": "XL",
        "color": "Biru",
        "selling_price": 64000,
        "stock_quantity": 50
    },
    {
        "id": "v-392",
        "product_id": "p-13",
        "sku": "CELANA-XL-ABU",
        "size": "XL",
        "color": "Abu",
        "selling_price": 64000,
        "stock_quantity": 50
    },
    {
        "id": "v-393",
        "product_id": "p-13",
        "sku": "CELANA-XL-COKE",
        "size": "XL",
        "color": "Cokelat",
        "selling_price": 64000,
        "stock_quantity": 50
    },
    {
        "id": "v-394",
        "product_id": "p-13",
        "sku": "CELANA-XL-HITA",
        "size": "XL",
        "color": "Hitam",
        "selling_price": 64000,
        "stock_quantity": 50
    },
    {
        "id": "v-395",
        "product_id": "p-13",
        "sku": "CELANA-XXL-BIRU",
        "size": "XXL",
        "color": "Biru",
        "selling_price": 66000,
        "stock_quantity": 50
    },
    {
        "id": "v-396",
        "product_id": "p-13",
        "sku": "CELANA-XXL-ABU",
        "size": "XXL",
        "color": "Abu",
        "selling_price": 66000,
        "stock_quantity": 50
    },
    {
        "id": "v-397",
        "product_id": "p-13",
        "sku": "CELANA-XXL-COKE",
        "size": "XXL",
        "color": "Cokelat",
        "selling_price": 66000,
        "stock_quantity": 50
    },
    {
        "id": "v-398",
        "product_id": "p-13",
        "sku": "CELANA-XXL-HITA",
        "size": "XXL",
        "color": "Hitam",
        "selling_price": 66000,
        "stock_quantity": 50
    },
    {
        "id": "v-399",
        "product_id": "p-14",
        "sku": "MEXYPJ-S-BIRU",
        "size": "S",
        "color": "Biru",
        "selling_price": 56000,
        "stock_quantity": 50
    },
    {
        "id": "v-400",
        "product_id": "p-14",
        "sku": "MEXYPJ-S-PRAM",
        "size": "S",
        "color": "Pramuka",
        "selling_price": 56000,
        "stock_quantity": 50
    },
    {
        "id": "v-401",
        "product_id": "p-14",
        "sku": "MEXYPJ-M-BIRU",
        "size": "M",
        "color": "Biru",
        "selling_price": 58000,
        "stock_quantity": 50
    },
    {
        "id": "v-402",
        "product_id": "p-14",
        "sku": "MEXYPJ-M-PRAM",
        "size": "M",
        "color": "Pramuka",
        "selling_price": 58000,
        "stock_quantity": 50
    },
    {
        "id": "v-403",
        "product_id": "p-14",
        "sku": "MEXYPJ-L-BIRU",
        "size": "L",
        "color": "Biru",
        "selling_price": 60000,
        "stock_quantity": 50
    },
    {
        "id": "v-404",
        "product_id": "p-14",
        "sku": "MEXYPJ-L-PRAM",
        "size": "L",
        "color": "Pramuka",
        "selling_price": 60000,
        "stock_quantity": 50
    },
    {
        "id": "v-405",
        "product_id": "p-14",
        "sku": "MEXYPJ-XL-BIRU",
        "size": "XL",
        "color": "Biru",
        "selling_price": 63000,
        "stock_quantity": 50
    },
    {
        "id": "v-406",
        "product_id": "p-14",
        "sku": "MEXYPJ-XL-PRAM",
        "size": "XL",
        "color": "Pramuka",
        "selling_price": 63000,
        "stock_quantity": 50
    },
    {
        "id": "v-407",
        "product_id": "p-15",
        "sku": "CELANA-27-PRAM",
        "size": "27",
        "color": "Pramuka",
        "selling_price": 76000,
        "stock_quantity": 50
    },
    {
        "id": "v-408",
        "product_id": "p-15",
        "sku": "CELANA-S-PRAM",
        "size": "S",
        "color": "Pramuka",
        "selling_price": 77000,
        "stock_quantity": 50
    },
    {
        "id": "v-409",
        "product_id": "p-15",
        "sku": "CELANA-M-PRAM",
        "size": "M",
        "color": "Pramuka",
        "selling_price": 78000,
        "stock_quantity": 50
    },
    {
        "id": "v-410",
        "product_id": "p-15",
        "sku": "CELANA-L-PRAM",
        "size": "L",
        "color": "Pramuka",
        "selling_price": 79000,
        "stock_quantity": 50
    },
    {
        "id": "v-411",
        "product_id": "p-15",
        "sku": "CELANA-XL-PRAM",
        "size": "XL",
        "color": "Pramuka",
        "selling_price": 82000,
        "stock_quantity": 50
    },
    {
        "id": "v-412",
        "product_id": "p-15",
        "sku": "CELANA-XXL-PRAM",
        "size": "XXL",
        "color": "Pramuka",
        "selling_price": 83000,
        "stock_quantity": 50
    },
    {
        "id": "v-413",
        "product_id": "p-16",
        "sku": "MEXYPA-S-BIRU",
        "size": "S",
        "color": "Biru",
        "selling_price": 53000,
        "stock_quantity": 50
    },
    {
        "id": "v-414",
        "product_id": "p-16",
        "sku": "MEXYPA-S-PRAM",
        "size": "S",
        "color": "Pramuka",
        "selling_price": 53000,
        "stock_quantity": 50
    },
    {
        "id": "v-415",
        "product_id": "p-16",
        "sku": "MEXYPA-M-BIRU",
        "size": "M",
        "color": "Biru",
        "selling_price": 55000,
        "stock_quantity": 50
    },
    {
        "id": "v-416",
        "product_id": "p-16",
        "sku": "MEXYPA-M-PRAM",
        "size": "M",
        "color": "Pramuka",
        "selling_price": 55000,
        "stock_quantity": 50
    },
    {
        "id": "v-417",
        "product_id": "p-16",
        "sku": "MEXYPA-L-BIRU",
        "size": "L",
        "color": "Biru",
        "selling_price": 57000,
        "stock_quantity": 50
    },
    {
        "id": "v-418",
        "product_id": "p-16",
        "sku": "MEXYPA-L-PRAM",
        "size": "L",
        "color": "Pramuka",
        "selling_price": 57000,
        "stock_quantity": 50
    },
    {
        "id": "v-419",
        "product_id": "p-16",
        "sku": "MEXYPA-XL-BIRU",
        "size": "XL",
        "color": "Biru",
        "selling_price": 59000,
        "stock_quantity": 50
    },
    {
        "id": "v-420",
        "product_id": "p-16",
        "sku": "MEXYPA-XL-PRAM",
        "size": "XL",
        "color": "Pramuka",
        "selling_price": 59000,
        "stock_quantity": 50
    },
    {
        "id": "v-421",
        "product_id": "p-17",
        "sku": "GESPER-S-PUTI",
        "size": "S",
        "color": "Putih",
        "selling_price": 57000,
        "stock_quantity": 50
    },
    {
        "id": "v-422",
        "product_id": "p-17",
        "sku": "GESPER-M-PUTI",
        "size": "M",
        "color": "Putih",
        "selling_price": 59000,
        "stock_quantity": 50
    },
    {
        "id": "v-423",
        "product_id": "p-17",
        "sku": "GESPER-L-PUTI",
        "size": "L",
        "color": "Putih",
        "selling_price": 62000,
        "stock_quantity": 50
    },
    {
        "id": "v-424",
        "product_id": "p-17",
        "sku": "GESPER-XL-PUTI",
        "size": "XL",
        "color": "Putih",
        "selling_price": 64000,
        "stock_quantity": 50
    },
    {
        "id": "v-425",
        "product_id": "p-18",
        "sku": "GESPER-S-PRAM",
        "size": "S",
        "color": "Pramuka",
        "selling_price": 58000,
        "stock_quantity": 50
    },
    {
        "id": "v-426",
        "product_id": "p-18",
        "sku": "GESPER-M-PRAM",
        "size": "M",
        "color": "Pramuka",
        "selling_price": 60000,
        "stock_quantity": 50
    },
    {
        "id": "v-427",
        "product_id": "p-18",
        "sku": "GESPER-L-PRAM",
        "size": "L",
        "color": "Pramuka",
        "selling_price": 63000,
        "stock_quantity": 50
    },
    {
        "id": "v-428",
        "product_id": "p-18",
        "sku": "GESPER-XL-PRAM",
        "size": "XL",
        "color": "Pramuka",
        "selling_price": 65000,
        "stock_quantity": 50
    }
],
  stock_movements: [
    {
        "id": "m-1",
        "variant_id": "v-1",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-2",
        "variant_id": "v-2",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-3",
        "variant_id": "v-3",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-4",
        "variant_id": "v-4",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-5",
        "variant_id": "v-5",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-6",
        "variant_id": "v-6",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-7",
        "variant_id": "v-7",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-8",
        "variant_id": "v-8",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-9",
        "variant_id": "v-9",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-10",
        "variant_id": "v-10",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-11",
        "variant_id": "v-11",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-12",
        "variant_id": "v-12",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-13",
        "variant_id": "v-13",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-14",
        "variant_id": "v-14",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-15",
        "variant_id": "v-15",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-16",
        "variant_id": "v-16",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-17",
        "variant_id": "v-17",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-18",
        "variant_id": "v-18",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-19",
        "variant_id": "v-19",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-20",
        "variant_id": "v-20",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-21",
        "variant_id": "v-21",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-22",
        "variant_id": "v-22",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-23",
        "variant_id": "v-23",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-24",
        "variant_id": "v-24",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-25",
        "variant_id": "v-25",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-26",
        "variant_id": "v-26",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-27",
        "variant_id": "v-27",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-28",
        "variant_id": "v-28",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-29",
        "variant_id": "v-29",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-30",
        "variant_id": "v-30",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-31",
        "variant_id": "v-31",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-32",
        "variant_id": "v-32",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-33",
        "variant_id": "v-33",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-34",
        "variant_id": "v-34",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-35",
        "variant_id": "v-35",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-36",
        "variant_id": "v-36",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-37",
        "variant_id": "v-37",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-38",
        "variant_id": "v-38",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-39",
        "variant_id": "v-39",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-40",
        "variant_id": "v-40",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-41",
        "variant_id": "v-41",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-42",
        "variant_id": "v-42",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-43",
        "variant_id": "v-43",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-44",
        "variant_id": "v-44",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-45",
        "variant_id": "v-45",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-46",
        "variant_id": "v-46",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-47",
        "variant_id": "v-47",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-48",
        "variant_id": "v-48",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-49",
        "variant_id": "v-49",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-50",
        "variant_id": "v-50",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-51",
        "variant_id": "v-51",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-52",
        "variant_id": "v-52",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-53",
        "variant_id": "v-53",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-54",
        "variant_id": "v-54",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-55",
        "variant_id": "v-55",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-56",
        "variant_id": "v-56",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-57",
        "variant_id": "v-57",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-58",
        "variant_id": "v-58",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-59",
        "variant_id": "v-59",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-60",
        "variant_id": "v-60",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-61",
        "variant_id": "v-61",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-62",
        "variant_id": "v-62",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-63",
        "variant_id": "v-63",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-64",
        "variant_id": "v-64",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-65",
        "variant_id": "v-65",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-66",
        "variant_id": "v-66",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-67",
        "variant_id": "v-67",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-68",
        "variant_id": "v-68",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-69",
        "variant_id": "v-69",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-70",
        "variant_id": "v-70",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-71",
        "variant_id": "v-71",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-72",
        "variant_id": "v-72",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-73",
        "variant_id": "v-73",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-74",
        "variant_id": "v-74",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-75",
        "variant_id": "v-75",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-76",
        "variant_id": "v-76",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-77",
        "variant_id": "v-77",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-78",
        "variant_id": "v-78",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-79",
        "variant_id": "v-79",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-80",
        "variant_id": "v-80",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-81",
        "variant_id": "v-81",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-82",
        "variant_id": "v-82",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-83",
        "variant_id": "v-83",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-84",
        "variant_id": "v-84",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-85",
        "variant_id": "v-85",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-86",
        "variant_id": "v-86",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-87",
        "variant_id": "v-87",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-88",
        "variant_id": "v-88",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-89",
        "variant_id": "v-89",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-90",
        "variant_id": "v-90",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-91",
        "variant_id": "v-91",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-92",
        "variant_id": "v-92",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-93",
        "variant_id": "v-93",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-94",
        "variant_id": "v-94",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-95",
        "variant_id": "v-95",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-96",
        "variant_id": "v-96",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-97",
        "variant_id": "v-97",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-98",
        "variant_id": "v-98",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-99",
        "variant_id": "v-99",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-100",
        "variant_id": "v-100",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-101",
        "variant_id": "v-101",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-102",
        "variant_id": "v-102",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-103",
        "variant_id": "v-103",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-104",
        "variant_id": "v-104",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-105",
        "variant_id": "v-105",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-106",
        "variant_id": "v-106",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-107",
        "variant_id": "v-107",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-108",
        "variant_id": "v-108",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-109",
        "variant_id": "v-109",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-110",
        "variant_id": "v-110",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-111",
        "variant_id": "v-111",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-112",
        "variant_id": "v-112",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-113",
        "variant_id": "v-113",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-114",
        "variant_id": "v-114",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-115",
        "variant_id": "v-115",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-116",
        "variant_id": "v-116",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-117",
        "variant_id": "v-117",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-118",
        "variant_id": "v-118",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-119",
        "variant_id": "v-119",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-120",
        "variant_id": "v-120",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-121",
        "variant_id": "v-121",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-122",
        "variant_id": "v-122",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-123",
        "variant_id": "v-123",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-124",
        "variant_id": "v-124",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-125",
        "variant_id": "v-125",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-126",
        "variant_id": "v-126",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-127",
        "variant_id": "v-127",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-128",
        "variant_id": "v-128",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-129",
        "variant_id": "v-129",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-130",
        "variant_id": "v-130",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-131",
        "variant_id": "v-131",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-132",
        "variant_id": "v-132",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-133",
        "variant_id": "v-133",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-134",
        "variant_id": "v-134",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-135",
        "variant_id": "v-135",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-136",
        "variant_id": "v-136",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-137",
        "variant_id": "v-137",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-138",
        "variant_id": "v-138",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-139",
        "variant_id": "v-139",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-140",
        "variant_id": "v-140",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-141",
        "variant_id": "v-141",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-142",
        "variant_id": "v-142",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-143",
        "variant_id": "v-143",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-144",
        "variant_id": "v-144",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-145",
        "variant_id": "v-145",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-146",
        "variant_id": "v-146",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-147",
        "variant_id": "v-147",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-148",
        "variant_id": "v-148",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-149",
        "variant_id": "v-149",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-150",
        "variant_id": "v-150",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-151",
        "variant_id": "v-151",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-152",
        "variant_id": "v-152",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-153",
        "variant_id": "v-153",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-154",
        "variant_id": "v-154",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-155",
        "variant_id": "v-155",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-156",
        "variant_id": "v-156",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-157",
        "variant_id": "v-157",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-158",
        "variant_id": "v-158",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-159",
        "variant_id": "v-159",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-160",
        "variant_id": "v-160",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-161",
        "variant_id": "v-161",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-162",
        "variant_id": "v-162",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-163",
        "variant_id": "v-163",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-164",
        "variant_id": "v-164",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-165",
        "variant_id": "v-165",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-166",
        "variant_id": "v-166",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-167",
        "variant_id": "v-167",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-168",
        "variant_id": "v-168",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-169",
        "variant_id": "v-169",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-170",
        "variant_id": "v-170",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-171",
        "variant_id": "v-171",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-172",
        "variant_id": "v-172",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-173",
        "variant_id": "v-173",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-174",
        "variant_id": "v-174",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-175",
        "variant_id": "v-175",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-176",
        "variant_id": "v-176",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-177",
        "variant_id": "v-177",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-178",
        "variant_id": "v-178",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-179",
        "variant_id": "v-179",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-180",
        "variant_id": "v-180",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-181",
        "variant_id": "v-181",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-182",
        "variant_id": "v-182",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-183",
        "variant_id": "v-183",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-184",
        "variant_id": "v-184",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-185",
        "variant_id": "v-185",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-186",
        "variant_id": "v-186",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-187",
        "variant_id": "v-187",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-188",
        "variant_id": "v-188",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-189",
        "variant_id": "v-189",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-190",
        "variant_id": "v-190",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-191",
        "variant_id": "v-191",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-192",
        "variant_id": "v-192",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-193",
        "variant_id": "v-193",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-194",
        "variant_id": "v-194",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-195",
        "variant_id": "v-195",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-196",
        "variant_id": "v-196",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-197",
        "variant_id": "v-197",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-198",
        "variant_id": "v-198",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-199",
        "variant_id": "v-199",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-200",
        "variant_id": "v-200",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-201",
        "variant_id": "v-201",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-202",
        "variant_id": "v-202",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-203",
        "variant_id": "v-203",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-204",
        "variant_id": "v-204",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-205",
        "variant_id": "v-205",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-206",
        "variant_id": "v-206",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-207",
        "variant_id": "v-207",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-208",
        "variant_id": "v-208",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-209",
        "variant_id": "v-209",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-210",
        "variant_id": "v-210",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-211",
        "variant_id": "v-211",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-212",
        "variant_id": "v-212",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-213",
        "variant_id": "v-213",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-214",
        "variant_id": "v-214",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-215",
        "variant_id": "v-215",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-216",
        "variant_id": "v-216",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-217",
        "variant_id": "v-217",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-218",
        "variant_id": "v-218",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-219",
        "variant_id": "v-219",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-220",
        "variant_id": "v-220",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-221",
        "variant_id": "v-221",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-222",
        "variant_id": "v-222",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-223",
        "variant_id": "v-223",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-224",
        "variant_id": "v-224",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-225",
        "variant_id": "v-225",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-226",
        "variant_id": "v-226",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-227",
        "variant_id": "v-227",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-228",
        "variant_id": "v-228",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-229",
        "variant_id": "v-229",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-230",
        "variant_id": "v-230",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-231",
        "variant_id": "v-231",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-232",
        "variant_id": "v-232",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-233",
        "variant_id": "v-233",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-234",
        "variant_id": "v-234",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-235",
        "variant_id": "v-235",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-236",
        "variant_id": "v-236",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-237",
        "variant_id": "v-237",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-238",
        "variant_id": "v-238",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-239",
        "variant_id": "v-239",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-240",
        "variant_id": "v-240",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-241",
        "variant_id": "v-241",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-242",
        "variant_id": "v-242",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-243",
        "variant_id": "v-243",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-244",
        "variant_id": "v-244",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-245",
        "variant_id": "v-245",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-246",
        "variant_id": "v-246",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-247",
        "variant_id": "v-247",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-248",
        "variant_id": "v-248",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-249",
        "variant_id": "v-249",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-250",
        "variant_id": "v-250",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-251",
        "variant_id": "v-251",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-252",
        "variant_id": "v-252",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-253",
        "variant_id": "v-253",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-254",
        "variant_id": "v-254",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-255",
        "variant_id": "v-255",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-256",
        "variant_id": "v-256",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-257",
        "variant_id": "v-257",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-258",
        "variant_id": "v-258",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-259",
        "variant_id": "v-259",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-260",
        "variant_id": "v-260",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-261",
        "variant_id": "v-261",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-262",
        "variant_id": "v-262",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-263",
        "variant_id": "v-263",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-264",
        "variant_id": "v-264",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-265",
        "variant_id": "v-265",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-266",
        "variant_id": "v-266",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-267",
        "variant_id": "v-267",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-268",
        "variant_id": "v-268",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-269",
        "variant_id": "v-269",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-270",
        "variant_id": "v-270",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-271",
        "variant_id": "v-271",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-272",
        "variant_id": "v-272",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-273",
        "variant_id": "v-273",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-274",
        "variant_id": "v-274",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-275",
        "variant_id": "v-275",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-276",
        "variant_id": "v-276",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-277",
        "variant_id": "v-277",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-278",
        "variant_id": "v-278",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-279",
        "variant_id": "v-279",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-280",
        "variant_id": "v-280",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-281",
        "variant_id": "v-281",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-282",
        "variant_id": "v-282",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-283",
        "variant_id": "v-283",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-284",
        "variant_id": "v-284",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-285",
        "variant_id": "v-285",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-286",
        "variant_id": "v-286",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-287",
        "variant_id": "v-287",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-288",
        "variant_id": "v-288",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-289",
        "variant_id": "v-289",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-290",
        "variant_id": "v-290",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-291",
        "variant_id": "v-291",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-292",
        "variant_id": "v-292",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-293",
        "variant_id": "v-293",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-294",
        "variant_id": "v-294",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-295",
        "variant_id": "v-295",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-296",
        "variant_id": "v-296",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-297",
        "variant_id": "v-297",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-298",
        "variant_id": "v-298",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-299",
        "variant_id": "v-299",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-300",
        "variant_id": "v-300",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-301",
        "variant_id": "v-301",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-302",
        "variant_id": "v-302",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-303",
        "variant_id": "v-303",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-304",
        "variant_id": "v-304",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-305",
        "variant_id": "v-305",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-306",
        "variant_id": "v-306",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-307",
        "variant_id": "v-307",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-308",
        "variant_id": "v-308",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-309",
        "variant_id": "v-309",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-310",
        "variant_id": "v-310",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-311",
        "variant_id": "v-311",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-312",
        "variant_id": "v-312",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-313",
        "variant_id": "v-313",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-314",
        "variant_id": "v-314",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-315",
        "variant_id": "v-315",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-316",
        "variant_id": "v-316",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-317",
        "variant_id": "v-317",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-318",
        "variant_id": "v-318",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-319",
        "variant_id": "v-319",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-320",
        "variant_id": "v-320",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-321",
        "variant_id": "v-321",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-322",
        "variant_id": "v-322",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-323",
        "variant_id": "v-323",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-324",
        "variant_id": "v-324",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-325",
        "variant_id": "v-325",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-326",
        "variant_id": "v-326",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-327",
        "variant_id": "v-327",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-328",
        "variant_id": "v-328",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-329",
        "variant_id": "v-329",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-330",
        "variant_id": "v-330",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-331",
        "variant_id": "v-331",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-332",
        "variant_id": "v-332",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-333",
        "variant_id": "v-333",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-334",
        "variant_id": "v-334",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-335",
        "variant_id": "v-335",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-336",
        "variant_id": "v-336",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-337",
        "variant_id": "v-337",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-338",
        "variant_id": "v-338",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-339",
        "variant_id": "v-339",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-340",
        "variant_id": "v-340",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-341",
        "variant_id": "v-341",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-342",
        "variant_id": "v-342",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-343",
        "variant_id": "v-343",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-344",
        "variant_id": "v-344",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-345",
        "variant_id": "v-345",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-346",
        "variant_id": "v-346",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-347",
        "variant_id": "v-347",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-348",
        "variant_id": "v-348",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-349",
        "variant_id": "v-349",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-350",
        "variant_id": "v-350",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-351",
        "variant_id": "v-351",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-352",
        "variant_id": "v-352",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-353",
        "variant_id": "v-353",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-354",
        "variant_id": "v-354",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-355",
        "variant_id": "v-355",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-356",
        "variant_id": "v-356",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-357",
        "variant_id": "v-357",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-358",
        "variant_id": "v-358",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-359",
        "variant_id": "v-359",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-360",
        "variant_id": "v-360",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Merah)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-361",
        "variant_id": "v-361",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-362",
        "variant_id": "v-362",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-363",
        "variant_id": "v-363",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-364",
        "variant_id": "v-364",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hijau)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-365",
        "variant_id": "v-365",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-366",
        "variant_id": "v-366",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-367",
        "variant_id": "v-367",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-368",
        "variant_id": "v-368",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-369",
        "variant_id": "v-369",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-370",
        "variant_id": "v-370",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-371",
        "variant_id": "v-371",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-372",
        "variant_id": "v-372",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-373",
        "variant_id": "v-373",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-374",
        "variant_id": "v-374",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-375",
        "variant_id": "v-375",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-376",
        "variant_id": "v-376",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-377",
        "variant_id": "v-377",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-378",
        "variant_id": "v-378",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-379",
        "variant_id": "v-379",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-380",
        "variant_id": "v-380",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-381",
        "variant_id": "v-381",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-382",
        "variant_id": "v-382",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-383",
        "variant_id": "v-383",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-384",
        "variant_id": "v-384",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-385",
        "variant_id": "v-385",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-386",
        "variant_id": "v-386",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-387",
        "variant_id": "v-387",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-388",
        "variant_id": "v-388",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-389",
        "variant_id": "v-389",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-390",
        "variant_id": "v-390",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-391",
        "variant_id": "v-391",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-392",
        "variant_id": "v-392",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-393",
        "variant_id": "v-393",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-394",
        "variant_id": "v-394",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-395",
        "variant_id": "v-395",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-396",
        "variant_id": "v-396",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Abu)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-397",
        "variant_id": "v-397",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Cokelat)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-398",
        "variant_id": "v-398",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Hitam)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-399",
        "variant_id": "v-399",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-400",
        "variant_id": "v-400",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-401",
        "variant_id": "v-401",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-402",
        "variant_id": "v-402",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-403",
        "variant_id": "v-403",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-404",
        "variant_id": "v-404",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-405",
        "variant_id": "v-405",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-406",
        "variant_id": "v-406",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-407",
        "variant_id": "v-407",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-408",
        "variant_id": "v-408",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-409",
        "variant_id": "v-409",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-410",
        "variant_id": "v-410",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-411",
        "variant_id": "v-411",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-412",
        "variant_id": "v-412",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-413",
        "variant_id": "v-413",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-414",
        "variant_id": "v-414",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-415",
        "variant_id": "v-415",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-416",
        "variant_id": "v-416",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-417",
        "variant_id": "v-417",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-418",
        "variant_id": "v-418",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-419",
        "variant_id": "v-419",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Biru)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-420",
        "variant_id": "v-420",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-421",
        "variant_id": "v-421",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-422",
        "variant_id": "v-422",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-423",
        "variant_id": "v-423",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-424",
        "variant_id": "v-424",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Putih)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-425",
        "variant_id": "v-425",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-426",
        "variant_id": "v-426",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-427",
        "variant_id": "v-427",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    },
    {
        "id": "m-428",
        "variant_id": "v-428",
        "type": "FACTORY_IN",
        "quantity": 50,
        "notes": "Stok awal pabrik (Pramuka)",
        "created_by": "u-1",
        "created_at": "2026-07-24T08:00:00Z"
    }
],
  customers: [
    { id: 'cst-1', name: 'Pak Rahmad (Guru SD 1)', phone_number: '081234567890', total_debt: 350000, created_at: '2026-07-24T09:00:00Z' },
    { id: 'cst-2', name: 'Bu Siti Khotimah', phone_number: '089876543210', total_debt: 120000, created_at: '2026-07-24T10:00:00Z' },
    { id: 'cst-3', name: 'Bpk. H. Ahmad Fauzi', phone_number: '081399887766', total_debt: 450000, created_at: '2026-07-20T08:00:00Z' },
    { id: 'cst-4', name: 'Ibu Endang Setyowati', phone_number: '085711223344', total_debt: 275000, created_at: '2026-07-21T09:30:00Z' },
    { id: 'cst-5', name: 'Pak Bambang Kurniawan', phone_number: '081288776655', total_debt: 600000, created_at: '2026-07-22T11:15:00Z' },
    { id: 'cst-6', name: 'Bu Hj. Nurul Hidayah', phone_number: '082133445566', total_debt: 180000, created_at: '2026-07-23T14:20:00Z' },
    { id: 'cst-7', name: 'Pak Slamet Riyadi', phone_number: '087812345678', total_debt: 520000, created_at: '2026-07-24T07:45:00Z' },
    { id: 'cst-8', name: 'Ibu Ratna Dewi', phone_number: '081987654321', total_debt: 0, created_at: '2026-07-15T10:00:00Z' },
    { id: 'cst-9', name: 'Pak Eko Prasetyo', phone_number: '085699887711', total_debt: 0, created_at: '2026-07-16T11:30:00Z' },
    { id: 'cst-10', name: 'Bu Yuni Astuti', phone_number: '082244668800', total_debt: 0, created_at: '2026-07-17T13:45:00Z' },
    { id: 'cst-11', name: 'Pak Sugeng Widodo', phone_number: '081377889900', total_debt: 0, created_at: '2026-07-18T15:20:00Z' },
    { id: 'cst-12', name: 'Ibu Maya Sari', phone_number: '087711335577', total_debt: 0, created_at: '2026-07-19T16:10:00Z' }
  ],
  sales: [
    {
      id: 'sl-1',
      invoice_number: 'INV-20260724-001',
      cashier_id: 'u-1',
      customer_id: 'cst-1',
      customer_type: 'GURU',
      total_amount: 350000,
      payment_method: 'DEBT',
      payment_status: 'PARTIAL',
      paid_amount: 150000,
      change_amount: 0,
      created_at: '2026-07-24T08:30:00Z'
    },
    {
      id: 'sl-2',
      invoice_number: 'INV-20260724-002',
      cashier_id: 'u-2',
      customer_id: 'cst-2',
      customer_type: 'UMUM',
      total_amount: 200000,
      payment_method: 'CASH',
      payment_status: 'PAID',
      paid_amount: 200000,
      change_amount: 0,
      created_at: '2026-07-24T09:15:00Z'
    },
    {
      id: 'sl-3',
      invoice_number: 'INV-20260724-003',
      cashier_id: 'u-1',
      customer_id: 'cst-3',
      customer_type: 'GROSIR',
      total_amount: 650000,
      payment_method: 'TRANSFER',
      payment_status: 'PAID',
      paid_amount: 650000,
      change_amount: 0,
      created_at: '2026-07-24T10:00:00Z'
    },
    {
      id: 'sl-4',
      invoice_number: 'INV-20260724-004',
      cashier_id: 'u-2',
      customer_id: '',
      customer_type: 'UMUM',
      total_amount: 145000,
      payment_method: 'QRIS',
      payment_status: 'PAID',
      paid_amount: 145000,
      change_amount: 0,
      created_at: '2026-07-24T10:45:00Z'
    },
    {
      id: 'sl-5',
      invoice_number: 'INV-20260724-005',
      cashier_id: 'u-1',
      customer_id: 'cst-4',
      customer_type: 'UMUM',
      total_amount: 375000,
      payment_method: 'DEBT',
      payment_status: 'PARTIAL',
      paid_amount: 100000,
      change_amount: 0,
      created_at: '2026-07-24T11:20:00Z'
    },
    {
      id: 'sl-6',
      invoice_number: 'INV-20260724-006',
      cashier_id: 'u-2',
      customer_id: 'cst-5',
      customer_type: 'GURU',
      total_amount: 900000,
      payment_method: 'DEBT',
      payment_status: 'PARTIAL',
      paid_amount: 300000,
      change_amount: 0,
      created_at: '2026-07-24T12:00:00Z'
    },
    {
      id: 'sl-7',
      invoice_number: 'INV-20260724-007',
      cashier_id: 'u-1',
      customer_id: '',
      customer_type: 'UMUM',
      total_amount: 85000,
      payment_method: 'CASH',
      payment_status: 'PAID',
      paid_amount: 100000,
      change_amount: 15000,
      created_at: '2026-07-24T13:10:00Z'
    },
    {
      id: 'sl-8',
      invoice_number: 'INV-20260724-008',
      cashier_id: 'u-2',
      customer_id: 'cst-8',
      customer_type: 'GROSIR',
      total_amount: 500000,
      payment_method: 'CASH',
      payment_status: 'PAID',
      paid_amount: 500000,
      change_amount: 0,
      created_at: '2026-07-24T14:30:00Z'
    },
    {
      id: 'sl-9',
      invoice_number: 'INV-20260724-009',
      cashier_id: 'u-1',
      customer_id: 'cst-7',
      customer_type: 'UMUM',
      total_amount: 770000,
      payment_method: 'DEBT',
      payment_status: 'PARTIAL',
      paid_amount: 250000,
      change_amount: 0,
      created_at: '2026-07-24T15:15:00Z'
    },
    {
      id: 'sl-10',
      invoice_number: 'INV-20260724-010',
      cashier_id: 'u-2',
      customer_id: 'cst-9',
      customer_type: 'GURU',
      total_amount: 230000,
      payment_method: 'TRANSFER',
      payment_status: 'PAID',
      paid_amount: 230000,
      change_amount: 0,
      created_at: '2026-07-24T16:00:00Z'
    },
    {
      id: 'sl-11',
      invoice_number: 'INV-20260724-011',
      cashier_id: 'u-1',
      customer_id: '',
      customer_type: 'UMUM',
      total_amount: 120000,
      payment_method: 'QRIS',
      payment_status: 'PAID',
      paid_amount: 120000,
      change_amount: 0,
      created_at: '2026-07-24T16:45:00Z'
    },
    {
      id: 'sl-12',
      invoice_number: 'INV-20260724-012',
      cashier_id: 'u-2',
      customer_id: 'cst-10',
      customer_type: 'GROSIR',
      total_amount: 410000,
      payment_method: 'CASH',
      payment_status: 'PAID',
      paid_amount: 450000,
      change_amount: 40000,
      created_at: '2026-07-24T17:10:00Z'
    }
  ],
  sale_items: [],
  debt_payments: [
    { id: 'dp-1', customer_id: 'cst-1', amount_paid: 150000, payment_method: 'CASH', cashier_id: 'u-1', created_at: '2026-07-24T10:00:00Z' },
    { id: 'dp-2', customer_id: 'cst-3', amount_paid: 200000, payment_method: 'TRANSFER', cashier_id: 'u-1', created_at: '2026-07-24T11:30:00Z' },
    { id: 'dp-3', customer_id: 'cst-5', amount_paid: 300000, payment_method: 'CASH', cashier_id: 'u-2', created_at: '2026-07-24T13:15:00Z' },
    { id: 'dp-4', customer_id: 'cst-7', amount_paid: 250000, payment_method: 'QRIS', cashier_id: 'u-1', created_at: '2026-07-24T14:45:00Z' },
    { id: 'dp-5', customer_id: 'cst-2', amount_paid: 80000, payment_method: 'CASH', cashier_id: 'u-2', created_at: '2026-07-24T15:20:00Z' },
    { id: 'dp-6', customer_id: 'cst-4', amount_paid: 100000, payment_method: 'TRANSFER', cashier_id: 'u-1', created_at: '2026-07-24T16:00:00Z' },
    { id: 'dp-7', customer_id: 'cst-6', amount_paid: 120000, payment_method: 'CASH', cashier_id: 'u-2', created_at: '2026-07-24T16:45:00Z' },
    { id: 'dp-8', customer_id: 'cst-8', amount_paid: 500000, payment_method: 'CASH', cashier_id: 'u-1', created_at: '2026-07-24T17:30:00Z' }
  ],
  piece_rate_items: [
    { id: 'pri-1', product_id: 'p-9', garment_type: 'Rok Panggul Karet', item_name: "Nata Rok", rate_price: 150, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-2', product_id: 'p-9', garment_type: 'Rok Panggul Karet', item_name: "Ngobras panggul samping", rate_price: 150, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-3', product_id: 'p-9', garment_type: 'Rok Panggul Karet', item_name: "Nandai jarak wiru", rate_price: 300, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-4', product_id: 'p-9', garment_type: 'Rok Panggul Karet', item_name: "Ngupnat", rate_price: 300, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-5', product_id: 'p-9', garment_type: 'Rok Panggul Karet', item_name: "Ngobras rok bawah", rate_price: 400, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-6', product_id: 'p-9', garment_type: 'Rok Panggul Karet', item_name: "Sumbawa Rok", rate_price: 400, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-7', product_id: 'p-9', garment_type: 'Rok Panggul Karet', item_name: "Jahit tengah rok", rate_price: 300, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-8', product_id: 'p-9', garment_type: 'Rok Panggul Karet', item_name: "Menjahit wiru ke panggul", rate_price: 450, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-9', product_id: 'p-9', garment_type: 'Rok Panggul Karet', item_name: "Ngobras bawah panggul", rate_price: 350, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-10', product_id: 'p-9', garment_type: 'Rok Panggul Karet', item_name: "Jahit Resleting", rate_price: 450, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-11', product_id: 'p-9', garment_type: 'Rok Panggul Karet', item_name: "Ngobras ban pinggang", rate_price: 150, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-12', product_id: 'p-9', garment_type: 'Rok Panggul Karet', item_name: "Menjahit ban pinggang/kapas", rate_price: 550, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-13', product_id: 'p-9', garment_type: 'Rok Panggul Karet', item_name: "Menutup ban pinggang", rate_price: 500, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-14', product_id: 'p-9', garment_type: 'Rok Panggul Karet', item_name: "Membuat kolong (satu rok)", rate_price: 250, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-15', product_id: 'p-9', garment_type: 'Rok Panggul Karet', item_name: "Memotong kolong", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-16', product_id: 'p-9', garment_type: 'Rok Panggul Karet', item_name: "Memasang hak", rate_price: 250, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-17', product_id: 'p-9', garment_type: 'Rok Panggul Karet', item_name: "Menjahit samping hak", rate_price: 200, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-18', product_id: 'p-9', garment_type: 'Rok Panggul Karet', item_name: "Nindes kolom ke ban + nindes ban ke karet (bagi 3)", rate_price: 450, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-19', product_id: 'p-9', garment_type: 'Rok Panggul Karet', item_name: "Motong kapas", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-20', product_id: 'p-9', garment_type: 'Rok Panggul Karet', item_name: "Motong karet (50 + 50)", rate_price: 150, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-21', product_id: 'p-9', garment_type: 'Rok Panggul Karet', item_name: "Nyambung karet ke kapas", rate_price: 350, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-22', product_id: 'p-9', garment_type: 'Rok Panggul Karet', item_name: "Ngobras sambung panggul", rate_price: 300, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-23', product_id: 'p-9', garment_type: 'Rok Panggul Karet', item_name: "Masang merk", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-24', product_id: 'p-9', garment_type: 'Rok Panggul SMLXL', item_name: "Ngobras nyambung", rate_price: 350, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-25', product_id: 'p-9', garment_type: 'Rok Panggul SMLXL', item_name: "Ngobras bawah keliling", rate_price: 400, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-26', product_id: 'p-9', garment_type: 'Rok Panggul SMLXL', item_name: "Nambung tengah rok", rate_price: 350, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-27', product_id: 'p-9', garment_type: 'Rok Panggul SMLXL', item_name: "Sumbawa rok", rate_price: 450, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-28', product_id: 'p-9', garment_type: 'Rok Panggul SMLXL', item_name: "Nyambung panggul", rate_price: 300, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-29', product_id: 'p-9', garment_type: 'Rok Panggul SMLXL', item_name: "Ngobras samping panggul", rate_price: 150, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-30', product_id: 'p-9', garment_type: 'Rok Panggul SMLXL', item_name: "Nandai wiru", rate_price: 300, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-31', product_id: 'p-9', garment_type: 'Rok Panggul SMLXL', item_name: "Ngewiru rok", rate_price: 800, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-32', product_id: 'p-9', garment_type: 'Rok Panggul SMLXL', item_name: "Masang resleting", rate_price: 500, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-33', product_id: 'p-9', garment_type: 'Rok Panggul SMLXL', item_name: "Jahit Kolong", rate_price: 250, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-34', product_id: 'p-9', garment_type: 'Rok Panggul SMLXL', item_name: "Motong kolong", rate_price: 150, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-35', product_id: 'p-9', garment_type: 'Rok Panggul SMLXL', item_name: "Masang ban/kapas", rate_price: 600, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-36', product_id: 'p-9', garment_type: 'Rok Panggul SMLXL', item_name: "Jahit tempat hak", rate_price: 250, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-37', product_id: 'p-9', garment_type: 'Rok Panggul SMLXL', item_name: "Masang hak", rate_price: 300, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-38', product_id: 'p-9', garment_type: 'Rok Panggul SMLXL', item_name: "Nutup ban", rate_price: 450, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-39', product_id: 'p-9', garment_type: 'Rok Panggul SMLXL', item_name: "Nindes kolom", rate_price: 250, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-40', product_id: 'p-9', garment_type: 'Rok Panggul SMLXL', item_name: "Motong kapas", rate_price: 150, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-41', product_id: 'p-9', garment_type: 'Rok Panggul SMLXL', item_name: "Ngupnat", rate_price: 300, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-42', product_id: 'p-9', garment_type: 'Rok Panggul SMLXL', item_name: "Masang merk", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-43', product_id: 'p-9', garment_type: 'Rok Panggul SMLXL', item_name: "Ngobras wiru", rate_price: 350, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-44', product_id: 'p-9', garment_type: 'Rok Panggul SMLXL', item_name: "Nata kain", rate_price: 150, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-45', product_id: 'p-13', garment_type: 'Celana Panjang Levis', item_name: "Jahit bagian atas saku belakang", rate_price: 200, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-46', product_id: 'p-13', garment_type: 'Celana Panjang Levis', item_name: "Nindes", rate_price: 150, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-47', product_id: 'p-13', garment_type: 'Celana Panjang Levis', item_name: "Sumbawa atas saku", rate_price: 250, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-48', product_id: 'p-13', garment_type: 'Celana Panjang Levis', item_name: "Menempel saku bagian belakang", rate_price: 1000, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-49', product_id: 'p-13', garment_type: 'Celana Panjang Levis', item_name: "Ngobras bagian tengah belakang", rate_price: 300, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-50', product_id: 'p-13', garment_type: 'Celana Panjang Levis', item_name: "Nindes bagian tengah belakang", rate_price: 150, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-51', product_id: 'p-13', garment_type: 'Celana Panjang Levis', item_name: "Ngobras bagian tengah muka (manuk)", rate_price: 250, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-52', product_id: 'p-13', garment_type: 'Celana Panjang Levis', item_name: "Ngobras eblek resleting", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-53', product_id: 'p-13', garment_type: 'Celana Panjang Levis', item_name: "Jahit eblek ke resleting", rate_price: 250, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-54', product_id: 'p-13', garment_type: 'Celana Panjang Levis', item_name: "Menutup resleting", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-55', product_id: 'p-13', garment_type: 'Celana Panjang Levis', item_name: "Ngobras eblek saku muka", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-56', product_id: 'p-13', garment_type: 'Celana Panjang Levis', item_name: "Jahit saku kecil sumbawa", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-57', product_id: 'p-13', garment_type: 'Celana Panjang Levis', item_name: "Nempel eblek ke furing", rate_price: 200, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-58', product_id: 'p-13', garment_type: 'Celana Panjang Levis', item_name: "Nyambung furing ke badan celana", rate_price: 300, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-59', product_id: 'p-13', garment_type: 'Celana Panjang Levis', item_name: "Nindes dua lengkung", rate_price: 350, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-60', product_id: 'p-13', garment_type: 'Celana Panjang Levis', item_name: "Jahit bagian bawah furing", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-61', product_id: 'p-13', garment_type: 'Celana Panjang Levis', item_name: "Menyempurnakan/menjahit kolong dan nomor", rate_price: 350, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-62', product_id: 'p-13', garment_type: 'Celana Panjang Levis', item_name: "Ngobras samping celana", rate_price: 550, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-63', product_id: 'p-13', garment_type: 'Celana Panjang Levis', item_name: "Ngobras tengah celana", rate_price: 450, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-64', product_id: 'p-13', garment_type: 'Celana Panjang Levis', item_name: "Nindes samping celana", rate_price: 300, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-65', product_id: 'p-13', garment_type: 'Celana Panjang Levis', item_name: "Sumbawa", rate_price: 500, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-66', product_id: 'p-13', garment_type: 'Celana Panjang Levis', item_name: "Nyambung ban ke celana", rate_price: 550, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-67', product_id: 'p-13', garment_type: 'Celana Panjang Levis', item_name: "Jahit tengah ban/samping hak", rate_price: 200, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-68', product_id: 'p-13', garment_type: 'Celana Panjang Levis', item_name: "Masang hak", rate_price: 250, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-69', product_id: 'p-13', garment_type: 'Celana Panjang Levis', item_name: "Nutup ban", rate_price: 500, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-70', product_id: 'p-13', garment_type: 'Celana Panjang Levis', item_name: "Kapas", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-71', product_id: 'p-13', garment_type: 'Celana Panjang Levis', item_name: "Jahit Kolong", rate_price: 250, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-72', product_id: 'p-13', garment_type: 'Celana Panjang Levis', item_name: "Gulby", rate_price: 300, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-73', product_id: 'p-13', garment_type: 'Celana Panjang Levis', item_name: "Nindes ban + nindes kolong", rate_price: 400, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-74', product_id: 'p-13', garment_type: 'Celana Panjang Levis', item_name: "Nempel saku kecil ke eblek", rate_price: 200, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-75', product_id: 'p-13', garment_type: 'Celana Panjang Levis', item_name: "Motong kolong", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-76', product_id: 'p-13', garment_type: 'Celana Panjang Levis', item_name: "Jahit kecil resleting", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-77', product_id: 'p-13', garment_type: 'Celana Panjang Levis', item_name: "Ngobras saku kecil", rate_price: 50, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-78', product_id: 'p-13', garment_type: 'Celana Panjang Levis', item_name: "Jahit manuk", rate_price: 150, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-79', product_id: 'p-13', garment_type: 'Celana Panjang Levis', item_name: "Nandai", rate_price: 250, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-80', product_id: 'p-13', garment_type: 'Celana Panjang Levis', item_name: "Nata", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-81', product_id: 'p-8', garment_type: 'Rok Wiru', item_name: "Ngobras sumbawa rok", rate_price: 400, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-82', product_id: 'p-8', garment_type: 'Rok Wiru', item_name: "Jahit tengah", rate_price: 350, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-83', product_id: 'p-8', garment_type: 'Rok Wiru', item_name: "Sumbawa", rate_price: 400, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-84', product_id: 'p-8', garment_type: 'Rok Wiru', item_name: "Ngobras ban pinggang", rate_price: 150, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-85', product_id: 'p-8', garment_type: 'Rok Wiru', item_name: "Nandai wiru ke ban", rate_price: 250, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-86', product_id: 'p-8', garment_type: 'Rok Wiru', item_name: "Jahit resleting", rate_price: 450, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-87', product_id: 'p-8', garment_type: 'Rok Wiru', item_name: "Masang merk", rate_price: 150, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-88', product_id: 'p-8', garment_type: 'Rok Wiru', item_name: "Jahit kolong", rate_price: 200, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-89', product_id: 'p-8', garment_type: 'Rok Wiru', item_name: "Motong kolong", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-90', product_id: 'p-8', garment_type: 'Rok Wiru', item_name: "Ngewiru", rate_price: 750, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-91', product_id: 'p-8', garment_type: 'Rok Wiru', item_name: "Masang kapas", rate_price: 300, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-92', product_id: 'p-8', garment_type: 'Rok Wiru', item_name: "Motong karet", rate_price: 150, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-93', product_id: 'p-8', garment_type: 'Rok Wiru', item_name: "Masang karet", rate_price: 300, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-94', product_id: 'p-8', garment_type: 'Rok Wiru', item_name: "Jahit tempat hak", rate_price: 250, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-95', product_id: 'p-8', garment_type: 'Rok Wiru', item_name: "Masang hak", rate_price: 300, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-96', product_id: 'p-8', garment_type: 'Rok Wiru', item_name: "Nutup ban", rate_price: 500, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-97', product_id: 'p-8', garment_type: 'Rok Wiru', item_name: "Nindes karet + kolong", rate_price: 450, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-98', product_id: 'p-8', garment_type: 'Rok Wiru', item_name: "Motong kapas", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-99', product_id: 'p-8', garment_type: 'Rok Wiru', item_name: "Nata rok", rate_price: 250, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-100', product_id: 'p-2', garment_type: 'Hem Panjang', item_name: "Menggambar krah", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-101', product_id: 'p-2', garment_type: 'Hem Panjang', item_name: "Memotong krah", rate_price: 150, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-102', product_id: 'p-2', garment_type: 'Hem Panjang', item_name: "Menyetrika krah ke kain", rate_price: 150, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-103', product_id: 'p-2', garment_type: 'Hem Panjang', item_name: "Menyambung/jahit sumbawa krah", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-104', product_id: 'p-2', garment_type: 'Hem Panjang', item_name: "Menjahit merek ke krah", rate_price: 150, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-105', product_id: 'p-2', garment_type: 'Hem Panjang', item_name: "Menjahit lapisan krah", rate_price: 350, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-106', product_id: 'p-2', garment_type: 'Hem Panjang', item_name: "Membalik lapisan krah + motong", rate_price: 200, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-107', product_id: 'p-2', garment_type: 'Hem Panjang', item_name: "Menindas krah setengah", rate_price: 150, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-108', product_id: 'p-2', garment_type: 'Hem Panjang', item_name: "Menyambung/menjahit krah ke baju", rate_price: 550, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-109', product_id: 'p-2', garment_type: 'Hem Panjang', item_name: "Nandai", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-110', product_id: 'p-2', garment_type: 'Hem Panjang', item_name: "Menindas krah/jahit/nutup krah", rate_price: 450, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-111', product_id: 'p-2', garment_type: 'Hem Panjang', item_name: "Nyetrika manset/dua lapisan tangan", rate_price: 150, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-112', product_id: 'p-2', garment_type: 'Hem Panjang', item_name: "Jahit sumbawa dua lapisan tangan", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-113', product_id: 'p-2', garment_type: 'Hem Panjang', item_name: "Jahit samping dua lapisan tangan + membalik", rate_price: 500, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-114', product_id: 'p-2', garment_type: 'Hem Panjang', item_name: "Jahit dua manset tangan ke baju", rate_price: 350, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-115', product_id: 'p-2', garment_type: 'Hem Panjang', item_name: "Menutup/jahit dua manset ke baju", rate_price: 300, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-116', product_id: 'p-2', garment_type: 'Hem Panjang', item_name: "Menjahit panah lengan", rate_price: 800, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-117', product_id: 'p-2', garment_type: 'Hem Panjang', item_name: "Menjahit sumbawa saku", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-118', product_id: 'p-2', garment_type: 'Hem Panjang', item_name: "Menjahit saku ke baju", rate_price: 350, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-119', product_id: 'p-2', garment_type: 'Hem Panjang', item_name: "Menjahit tengah bagian depan (tempat kancing)", rate_price: 300, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-120', product_id: 'p-2', garment_type: 'Hem Panjang', item_name: "Menjahit tengah bagian depan (lubang kancing)", rate_price: 200, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-121', product_id: 'p-2', garment_type: 'Hem Panjang', item_name: "Ngobras bahu", rate_price: 150, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-122', product_id: 'p-2', garment_type: 'Hem Panjang', item_name: "Ngobras kerung lengan", rate_price: 350, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-123', product_id: 'p-2', garment_type: 'Hem Panjang', item_name: "Ngobras samping", rate_price: 400, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-124', product_id: 'p-2', garment_type: 'Hem Panjang', item_name: "Sumbawa baju", rate_price: 400, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-125', product_id: 'p-2', garment_type: 'Hem Panjang', item_name: "Nata hem", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-126', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Gambar tutup", rate_price: 50, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-127', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Gunting tutup", rate_price: 50, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-128', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Nyerika tutup", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-129', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Menjahit tutup", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-130', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Gunting+membalik tutup", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-131', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Nindes tutup", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-132', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Nandai belakang", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-133', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Ngupnat", rate_price: 150, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-134', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Menjahit eblek ke furing belakang", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-135', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Menjahit furing + tutup", rate_price: 200, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-136', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Menempelkan bibir saku", rate_price: 200, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-137', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Menyobek tutup", rate_price: 250, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-138', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Menyempurnakan tutup", rate_price: 550, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-139', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Menjahit sisi", rate_price: 400, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-140', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Ngobras manuk", rate_price: 250, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-141', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Nindes 1 cm", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-142', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Jahit manuk", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-143', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Jahit resleting", rate_price: 200, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-144', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Menutup resleting", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-145', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Menjahit gulby", rate_price: 200, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-146', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Ngobras eblek resleting", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-147', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Ngobras eblek depan", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-148', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Menjahit eblek ke furing", rate_price: 200, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-149', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Ngobras eblek depan atas", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-150', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Menjahit furing ke celana", rate_price: 250, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-151', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Menjahit eblek atas", rate_price: 200, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-152', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Menjahit tutup saku depan", rate_price: 200, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-153', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Masang kolong + nomor", rate_price: 300, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-154', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Ngobras pecah sisi", rate_price: 400, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-155', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Ngobras pantat", rate_price: 250, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-156', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Ngebanni", rate_price: 550, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-157', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Jahit tempat hak", rate_price: 150, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-158', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Masang hak", rate_price: 200, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-159', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Nindes kolong + muter", rate_price: 300, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-160', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Jahit kolong", rate_price: 200, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-161', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Motong kolong", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-162', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Nutup ban pinggang", rate_price: 450, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-163', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Ngobras tengah", rate_price: 350, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-164', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Sumbawa", rate_price: 400, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-165', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Kapas", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-166', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Nata", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-167', product_id: 'p-10', garment_type: 'Celana Tutup', item_name: "Obras eblek belakang", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-168', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Nandai saku belakang", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-169', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Nata", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-170', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Gambar tutup", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-171', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Motong tutup", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-172', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Nyetrika tutup", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-173', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Jahit lapisan tutup", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-174', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Membalik + memotong tutup", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-175', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Menindas tutup", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-176', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Ngobras lapisan saku belakang", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-177', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Jahit/menempel lapisan ke furing belakang", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-178', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Jahit tutup ke celana + mulut saku", rate_price: 400, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-179', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Gunting mulut saku", rate_price: 300, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-180', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Menyempurnakan/jahit saku belakang", rate_price: 350, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-181', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Menjahit resleting", rate_price: 250, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-182', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Menutup jahit resleting", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-183', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Gulby", rate_price: 300, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-184', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Merek", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-185', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Ngobras bagian resleting", rate_price: 250, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-186', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Jahit manuk resleting", rate_price: 200, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-187', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Jahit kecil", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-188', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Ngobras eblek saku muka celana", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-189', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Ngobras atas eblek", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-190', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Jahit menempel eblek ke furing depan", rate_price: 200, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-191', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Nyambung furing kecelana", rate_price: 250, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-192', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Nindes bagian eblek atas", rate_price: 200, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-193', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Nindes bagian eblek furing (lapisan miring)", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-194', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Membuat kolong celana (saku celana)", rate_price: 300, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-195', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Nyambung/jahit bawah furing", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-196', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Nindes bagian saku kolong nomer", rate_price: 250, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-197', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Ngobras ban celana", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-198', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Memasang ban pinggang ke celana", rate_price: 300, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-199', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Nutup ban pinggang", rate_price: 300, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-200', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Memasang hak", rate_price: 200, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-201', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Jahit tengah ban/samping hak", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-202', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Jahit karet badan celana belakang", rate_price: 150, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-203', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Ngobras bagian belakang+atas pinggang", rate_price: 250, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-204', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Kaki tengah celana", rate_price: 350, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-205', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Samping celana", rate_price: 400, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-206', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Ngobras sumbawa kaki/jahit sumbawa", rate_price: 150, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-207', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Nindes kolong belakang", rate_price: 200, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-208', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Nindes kolong depan", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-209', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Memotong kolong", rate_price: 50, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-210', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Mengglender karet", rate_price: 150, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-211', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Motong kapas", rate_price: 50, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-212', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Sumbawa", rate_price: 350, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-213', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Motong karet", rate_price: 50, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-214', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Nindes samping sisi celana", rate_price: 300, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-215', product_id: 'p-11', garment_type: 'Celana Panjang Karet', item_name: "Nyambung depan + belakang", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-216', product_id: 'p-1', garment_type: 'Hem Lengan Pendek', item_name: "Menggambar krah", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-217', product_id: 'p-1', garment_type: 'Hem Lengan Pendek', item_name: "Memotong krah", rate_price: 150, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-218', product_id: 'p-1', garment_type: 'Hem Lengan Pendek', item_name: "Menyetrika krah ke kain", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-219', product_id: 'p-1', garment_type: 'Hem Lengan Pendek', item_name: "Sumbawa krah", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-220', product_id: 'p-1', garment_type: 'Hem Lengan Pendek', item_name: "Menjahit merek ke krah", rate_price: 50, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-221', product_id: 'p-1', garment_type: 'Hem Lengan Pendek', item_name: "Menjahit lapisan krah", rate_price: 250, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-222', product_id: 'p-1', garment_type: 'Hem Lengan Pendek', item_name: "Membalik lapisan krah + motong", rate_price: 200, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-223', product_id: 'p-1', garment_type: 'Hem Lengan Pendek', item_name: "Menindas krah setengah", rate_price: 150, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-224', product_id: 'p-1', garment_type: 'Hem Lengan Pendek', item_name: "Memasang krah ke baju", rate_price: 450, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-225', product_id: 'p-1', garment_type: 'Hem Lengan Pendek', item_name: "Menutup krah", rate_price: 350, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-226', product_id: 'p-1', garment_type: 'Hem Lengan Pendek', item_name: "Jahit sumbawa saku", rate_price: 50, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-227', product_id: 'p-1', garment_type: 'Hem Lengan Pendek', item_name: "Memasang saku", rate_price: 250, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-228', product_id: 'p-1', garment_type: 'Hem Lengan Pendek', item_name: "Jahit tempat saku depan", rate_price: 150, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-229', product_id: 'p-1', garment_type: 'Hem Lengan Pendek', item_name: "Jahit tempat kancing", rate_price: 200, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-230', product_id: 'p-1', garment_type: 'Hem Lengan Pendek', item_name: "Ngobras bahu", rate_price: 150, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-231', product_id: 'p-1', garment_type: 'Hem Lengan Pendek', item_name: "Ngobras kerung lengan", rate_price: 350, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-232', product_id: 'p-1', garment_type: 'Hem Lengan Pendek', item_name: "Ngobras samping", rate_price: 250, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-233', product_id: 'p-1', garment_type: 'Hem Lengan Pendek', item_name: "Sumbawa baju", rate_price: 400, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-234', product_id: 'p-1', garment_type: 'Hem Lengan Pendek', item_name: "Kelem lengan", rate_price: 500, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-235', product_id: 'p-9', garment_type: 'Rok Panggul (16)', item_name: "Nata", rate_price: 150, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-236', product_id: 'p-9', garment_type: 'Rok Panggul (16)', item_name: "Ngobras bawah rok", rate_price: 350, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-237', product_id: 'p-9', garment_type: 'Rok Panggul (16)', item_name: "Nandai wiru", rate_price: 250, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-238', product_id: 'p-9', garment_type: 'Rok Panggul (16)', item_name: "Kupnat", rate_price: 300, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-239', product_id: 'p-9', garment_type: 'Rok Panggul (16)', item_name: "Ngewiru", rate_price: 600, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-240', product_id: 'p-9', garment_type: 'Rok Panggul (16)', item_name: "Ngobras wiru", rate_price: 300, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-241', product_id: 'p-9', garment_type: 'Rok Panggul (16)', item_name: "Masang resleting", rate_price: 400, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-242', product_id: 'p-9', garment_type: 'Rok Panggul (16)', item_name: "Jahit kolong", rate_price: 200, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-243', product_id: 'p-9', garment_type: 'Rok Panggul (16)', item_name: "Motong kolong", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-244', product_id: 'p-9', garment_type: 'Rok Panggul (16)', item_name: "Motong kapas", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-245', product_id: 'p-9', garment_type: 'Rok Panggul (16)', item_name: "Masang ban", rate_price: 550, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-246', product_id: 'p-9', garment_type: 'Rok Panggul (16)', item_name: "Jahit tempat hak", rate_price: 150, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-247', product_id: 'p-9', garment_type: 'Rok Panggul (16)', item_name: "Masang hak", rate_price: 250, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-248', product_id: 'p-9', garment_type: 'Rok Panggul (16)', item_name: "Nutup ban", rate_price: 400, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-249', product_id: 'p-9', garment_type: 'Rok Panggul (16)', item_name: "Nindes kolong", rate_price: 200, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-250', product_id: 'p-9', garment_type: 'Rok Panggul (16)', item_name: "Jahit tengah", rate_price: 300, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-251', product_id: 'p-9', garment_type: 'Rok Panggul (16)', item_name: "Sumbawa rok", rate_price: 350, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-252', product_id: 'p-9', garment_type: 'Rok Panggul (16)', item_name: "Ngobras panggul", rate_price: 300, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-253', product_id: 'p-9', garment_type: 'Rok Panggul (16)', item_name: "Ngobras panggul samping", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' },
    { id: 'pri-254', product_id: 'p-9', garment_type: 'Rok Panggul (16)', item_name: "Masang merek", rate_price: 100, created_at: '2026-07-28T00:00:00.000Z' }
  ],
  worker_daily_logs: [
    { id: 'wdl-1', worker_id: 'u-3', log_date: '2026-07-25', total_daily_amount: 50000, status: 'PAID', created_at: '2026-07-25T17:00:00Z' },
    { id: 'wdl-2', worker_id: 'u-3', log_date: '2026-07-27', total_daily_amount: 63500, status: 'PENDING', created_at: '2026-07-27T16:30:00Z' },
    { id: 'wdl-3', worker_id: 'u-3', log_date: '2026-07-28', total_daily_amount: 77000, status: 'PENDING', created_at: '2026-07-28T17:00:00Z' },
    { id: 'wdl-4', worker_id: 'u-4', log_date: '2026-07-26', total_daily_amount: 76000, status: 'PAID', created_at: '2026-07-26T17:30:00Z' },
    { id: 'wdl-5', worker_id: 'u-4', log_date: '2026-07-27', total_daily_amount: 89000, status: 'PENDING', created_at: '2026-07-27T17:00:00Z' },
    { id: 'wdl-6', worker_id: 'u-4', log_date: '2026-07-28', total_daily_amount: 59500, status: 'PENDING', created_at: '2026-07-28T17:30:00Z' },
    { id: 'wdl-7', worker_id: 'u-5', log_date: '2026-07-24', total_daily_amount: 42000, status: 'PAID', created_at: '2026-07-24T17:00:00Z' },
    { id: 'wdl-8', worker_id: 'u-5', log_date: '2026-07-27', total_daily_amount: 67500, status: 'PENDING', created_at: '2026-07-27T17:15:00Z' },
    { id: 'wdl-9', worker_id: 'u-5', log_date: '2026-07-28', total_daily_amount: 62000, status: 'PENDING', created_at: '2026-07-28T16:45:00Z' },
    { id: 'wdl-10', worker_id: 'u-6', log_date: '2026-07-25', total_daily_amount: 55000, status: 'PAID', created_at: '2026-07-25T17:30:00Z' },
    { id: 'wdl-11', worker_id: 'u-6', log_date: '2026-07-27', total_daily_amount: 65000, status: 'PENDING', created_at: '2026-07-27T17:30:00Z' },
    { id: 'wdl-12', worker_id: 'u-6', log_date: '2026-07-28', total_daily_amount: 81000, status: 'PENDING', created_at: '2026-07-28T17:15:00Z' }
  ],
  worker_daily_log_items: [
    { id: 'wdli-1', daily_log_id: 'wdl-1', piece_rate_item_id: 'pri-8', quantity: 50, rate_per_unit: 450, subtotal: 22500 },
    { id: 'wdli-2', daily_log_id: 'wdl-1', piece_rate_item_id: 'pri-12', quantity: 50, rate_per_unit: 550, subtotal: 27500 },
    
    { id: 'wdli-3', daily_log_id: 'wdl-2', piece_rate_item_id: 'pri-110', quantity: 40, rate_per_unit: 550, subtotal: 22000 },
    { id: 'wdli-4', daily_log_id: 'wdl-2', piece_rate_item_id: 'pri-118', quantity: 30, rate_per_unit: 800, subtotal: 24000 },
    { id: 'wdli-5', daily_log_id: 'wdl-2', piece_rate_item_id: 'pri-121', quantity: 50, rate_per_unit: 350, subtotal: 17500 },
    
    { id: 'wdli-6', daily_log_id: 'wdl-3', piece_rate_item_id: 'pri-31', quantity: 35, rate_per_unit: 800, subtotal: 28000 },
    { id: 'wdli-7', daily_log_id: 'wdl-3', piece_rate_item_id: 'pri-35', quantity: 40, rate_per_unit: 600, subtotal: 24000 },
    { id: 'wdli-8', daily_log_id: 'wdl-3', piece_rate_item_id: 'pri-32', quantity: 50, rate_per_unit: 500, subtotal: 25000 },

    { id: 'wdli-9', daily_log_id: 'wdl-4', piece_rate_item_id: 'pri-223', quantity: 80, rate_per_unit: 500, subtotal: 40000 },
    { id: 'wdli-10', daily_log_id: 'wdl-4', piece_rate_item_id: 'pri-218', quantity: 80, rate_per_unit: 450, subtotal: 36000 },

    { id: 'wdli-11', daily_log_id: 'wdl-5', piece_rate_item_id: 'pri-48', quantity: 45, rate_per_unit: 1000, subtotal: 45000 },
    { id: 'wdli-12', daily_log_id: 'wdl-5', piece_rate_item_id: 'pri-62', quantity: 40, rate_per_unit: 550, subtotal: 22000 },
    { id: 'wdli-13', daily_log_id: 'wdl-5', piece_rate_item_id: 'pri-71', quantity: 40, rate_per_unit: 550, subtotal: 22000 },

    { id: 'wdli-14', daily_log_id: 'wdl-6', piece_rate_item_id: 'pri-178', quantity: 60, rate_per_unit: 400, subtotal: 24000 },
    { id: 'wdli-15', daily_log_id: 'wdl-6', piece_rate_item_id: 'pri-171', quantity: 60, rate_per_unit: 300, subtotal: 18000 },
    { id: 'wdli-16', daily_log_id: 'wdl-6', piece_rate_item_id: 'pri-172', quantity: 50, rate_per_unit: 350, subtotal: 17500 },

    { id: 'wdli-17', daily_log_id: 'wdl-7', piece_rate_item_id: 'pri-129', quantity: 120, rate_per_unit: 100, subtotal: 12000 },
    { id: 'wdli-18', daily_log_id: 'wdl-7', piece_rate_item_id: 'pri-148', quantity: 120, rate_per_unit: 250, subtotal: 30000 },

    { id: 'wdli-19', daily_log_id: 'wdl-8', piece_rate_item_id: 'pri-156', quantity: 50, rate_per_unit: 550, subtotal: 27500 },
    { id: 'wdli-20', daily_log_id: 'wdl-8', piece_rate_item_id: 'pri-162', quantity: 50, rate_per_unit: 450, subtotal: 22500 },
    { id: 'wdli-21', daily_log_id: 'wdl-8', piece_rate_item_id: 'pri-163', quantity: 50, rate_per_unit: 350, subtotal: 17500 },

    { id: 'wdli-22', daily_log_id: 'wdl-9', piece_rate_item_id: 'pri-126', quantity: 100, rate_per_unit: 50, subtotal: 5000 },
    { id: 'wdli-23', daily_log_id: 'wdl-9', piece_rate_item_id: 'pri-131', quantity: 100, rate_per_unit: 100, subtotal: 10000 },
    { id: 'wdli-24', daily_log_id: 'wdl-9', piece_rate_item_id: 'pri-133', quantity: 100, rate_per_unit: 150, subtotal: 15000 },
    { id: 'wdli-25', daily_log_id: 'wdl-9', piece_rate_item_id: 'pri-138', quantity: 80, rate_per_unit: 400, subtotal: 32000 },

    { id: 'wdli-26', daily_log_id: 'wdl-10', piece_rate_item_id: 'pri-240', quantity: 100, rate_per_unit: 300, subtotal: 30000 },
    { id: 'wdli-27', daily_log_id: 'wdl-10', piece_rate_item_id: 'pri-247', quantity: 100, rate_per_unit: 250, subtotal: 25000 },

    { id: 'wdli-28', daily_log_id: 'wdl-11', piece_rate_item_id: 'pri-245', quantity: 50, rate_per_unit: 550, subtotal: 27500 },
    { id: 'wdli-29', daily_log_id: 'wdl-11', piece_rate_item_id: 'pri-248', quantity: 50, rate_per_unit: 400, subtotal: 20000 },
    { id: 'wdli-30', daily_log_id: 'wdl-11', piece_rate_item_id: 'pri-251', quantity: 50, rate_per_unit: 350, subtotal: 17500 },

    { id: 'wdli-31', daily_log_id: 'wdl-12', piece_rate_item_id: 'pri-238', quantity: 60, rate_per_unit: 350, subtotal: 21000 },
    { id: 'wdli-32', daily_log_id: 'wdl-12', piece_rate_item_id: 'pri-241', quantity: 60, rate_per_unit: 600, subtotal: 36000 },
    { id: 'wdli-33', daily_log_id: 'wdl-12', piece_rate_item_id: 'pri-243', quantity: 60, rate_per_unit: 400, subtotal: 24000 }
  ],
  payroll_disbursements: [
    {
      id: 'pay-1',
      payroll_number: 'PAY-202606-001',
      worker_id: 'u-3',
      month_year: '2026-06',
      total_amount: 2850000,
      approved_by: 'u-1',
      paid_at: '2026-06-30T16:00:00Z'
    }
  ],
  cash_expenses: [
    {
      id: 'exp-1',
      expense_category: 'PAYROLL',
      amount: 2850000,
      description: 'Pencairan Gaji Borongan Juni 2026 - Siti',
      reference_id: 'pay-1',
      created_by: 'u-1',
      created_at: '2026-06-30T16:00:00Z'
    }
  ]
};

const CURRENT_DB_VERSION = 'v18_fix_duplicate_log_items';

// Selalu pastikan LocalStorage diperbarui dengan data terbaru jika versi berubah
if (localStorage.getItem('oliviana_db_version') !== CURRENT_DB_VERSION) {
  localStorage.setItem('oliviana_db', JSON.stringify(INITIAL_DATA));
  localStorage.setItem('oliviana_db_version', CURRENT_DB_VERSION);
}

const getDB = () => {
  const data = JSON.parse(localStorage.getItem('oliviana_db')) || INITIAL_DATA;
  if (!data.users || data.users.length < 4) {
    data.users = INITIAL_DATA.users;
  }
  if (!data.piece_rate_items) data.piece_rate_items = INITIAL_DATA.piece_rate_items;
  if (!data.worker_daily_logs) data.worker_daily_logs = INITIAL_DATA.worker_daily_logs;
  if (!data.worker_daily_log_items) data.worker_daily_log_items = INITIAL_DATA.worker_daily_log_items;
  if (!data.payroll_disbursements) data.payroll_disbursements = INITIAL_DATA.payroll_disbursements;
  if (!data.cash_expenses) data.cash_expenses = INITIAL_DATA.cash_expenses;
  return data;
};

const saveDB = (db) => {
  localStorage.setItem('oliviana_db', JSON.stringify(db));
};

export const db = {
  // Synchronize and seed Supabase on application load
  initSupabaseSync: async () => {
    if (!isSupabaseConfigured() || !supabase) return;
    try {
      console.log('🔄 Initializing Supabase cloud database sync...');

      // 1. Upload Master Data jika tabel products di Supabase masih kosong
      const { data: existingProducts, error: checkErr } = await supabase.from('products').select('id').limit(1);
      
      if (!checkErr && (!existingProducts || existingProducts.length === 0)) {
        console.log('🌱 Supabase database is empty. Uploading users, categories, products, variants...');
        
        if (INITIAL_DATA.users?.length) {
          await supabase.from('users').upsert(INITIAL_DATA.users);
        }
        if (INITIAL_DATA.categories?.length) {
          await supabase.from('categories').upsert(INITIAL_DATA.categories);
        }
        if (INITIAL_DATA.products?.length) {
          await supabase.from('products').upsert(INITIAL_DATA.products);
        }

        const variants = INITIAL_DATA.product_variants || [];
        for (let i = 0; i < variants.length; i += 50) {
          await supabase.from('product_variants').upsert(variants.slice(i, i + 50));
        }

        if (INITIAL_DATA.piece_rate_items?.length) {
          const pieceItems = INITIAL_DATA.piece_rate_items.map(p => ({
            id: p.id,
            name: p.item_name || p.name || 'Pekerjaan',
            rate_price: Number(p.rate_price || p.rate_per_unit || 0),
            category: p.category || 'Baju',
            notes: p.notes || ''
          }));
          await supabase.from('piece_rate_items').upsert(pieceItems);
        }
        console.log('✅ Initial master data uploaded to Supabase successfully!');
      }

      // 2. Fetch existing sales/orders from Supabase to sync local cache
      const { data: remoteOrders } = await supabase.from('orders').select('*');
      const { data: remoteOrderItems } = await supabase.from('order_items').select('*');

      const current = getDB();
      if (remoteOrders && remoteOrders.length > 0) {
        current.orders = remoteOrders;
        current.sales = remoteOrders.map(o => ({
          ...o,
          invoice_number: o.order_number || o.invoice_number || o.id
        }));
      }
      if (remoteOrderItems && remoteOrderItems.length > 0) {
        current.order_items = remoteOrderItems;
        current.sale_items = remoteOrderItems.map(i => ({
          ...i,
          sale_id: i.order_id || i.sale_id,
          price_per_unit: i.unit_price || i.price_per_unit
        }));
      }
      saveDB(current);
    } catch (err) {
      console.error('❌ Supabase Init/Sync Failed:', err);
    }
  },

  // Ambil semua data di tabel tertentu
  get: (table) => {
    return getDB()[table] || [];
  },

  // Cari item spesifik
  find: (table, predicate) => {
    return getDB()[table]?.find(predicate);
  },

  // Tambah item ke tabel
  insert: (table, item) => {
    const current = getDB();
    if (!current[table]) current[table] = [];

    const newItem = {
      id: `${table.substring(0, 3)}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      created_at: new Date().toISOString(),
      ...item
    };

    current[table].push(newItem);
    saveDB(current);
    syncSupabaseUpsert(table, newItem);
    return newItem;
  },

  // Update item di tabel
  update: (table, id, updates) => {
    const current = getDB();
    if (!current[table]) return null;

    const idx = current[table].findIndex(x => x.id === id);
    if (idx === -1) return null;

    current[table][idx] = {
      ...current[table][idx],
      ...updates
    };

    saveDB(current);
    syncSupabaseUpsert(table, current[table][idx]);
    return current[table][idx];
  },

  // Hapus item
  delete: (table, id) => {
    const current = getDB();
    if (!current[table]) return false;

    const filtered = current[table].filter(x => x.id !== id);
    current[table] = filtered;
    saveDB(current);
    syncSupabaseDelete(table, id);
    return true;
  },

  // Reset database ke kondisi awal
  reset: () => {
    saveDB(INITIAL_DATA);
    localStorage.setItem('oliviana_db_version', CURRENT_DB_VERSION);
    if (isSupabaseConfigured()) {
      db.initSupabaseSync();
    }
    return INITIAL_DATA;
  },

  // Login simulasi
  login: (email, role) => {
    const users = db.get('users');
    const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === role);
    return matched || null;
  },

  // Tambah stok dari pabrik (Inbound)
  addStockFromFactory: (variantId, quantity, notes, userId) => {
    const current = getDB();
    const variantIdx = current.product_variants.findIndex(v => v.id === variantId);
    if (variantIdx === -1) return null;

    // Update stock quantity
    current.product_variants[variantIdx].stock_quantity = Number(current.product_variants[variantIdx].stock_quantity) + Number(quantity);

    // Log stock movement
    const movementId = `m-${Date.now()}`;
    const newMovement = {
      id: movementId,
      variant_id: variantId,
      type: 'FACTORY_IN',
      quantity: Number(quantity),
      notes: notes || 'Terima barang dari Pabrik',
      created_by: userId,
      created_at: new Date().toISOString()
    };
    current.stock_movements.push(newMovement);

    saveDB(current);
    return current.product_variants[variantIdx];
  },

  // Buat transaksi penjualan baru
  createSale: (saleData, items, userId) => {
    const current = getDB();
    const invoiceNumber = `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(Date.now()).slice(-4)}`;
    const saleId = `s-${Date.now()}`;

    const newSale = {
      id: saleId,
      invoice_number: invoiceNumber,
      order_number: invoiceNumber,
      cashier_id: userId,
      customer_id: saleData.customer_id || null,
      customer_name: saleData.customer_name || 'Pelanggan Umum',
      customer_phone: saleData.customer_phone || '',
      total_amount: Number(saleData.total_amount),
      payment_method: saleData.payment_method || 'CASH', // 'CASH' | 'QRIS' | 'TRANSFER' | 'DEBT'
      payment_status: saleData.payment_status || 'PAID', // 'PAID' | 'UNPAID' | 'PARTIAL'
      paid_amount: Number(saleData.paid_amount || 0),
      change_amount: Number(saleData.change_amount || 0),
      notes: saleData.notes || '',
      work_order_number: saleData.work_order_number || null,
      created_at: new Date().toISOString()
    };

    // Tambahkan item transaksi
    const formattedItems = items.map((item, idx) => {
      const newItem = {
        id: `si-${Date.now()}-${idx}`,
        sale_id: saleId,
        order_id: saleId,
        variant_id: item.variant_id,
        product_name: item.product_name || item.name || 'Produk',
        variant_detail: `${item.size || ''} ${item.color || ''}`.trim(),
        unit_price: Number(item.price_per_unit || item.unit_price || 0),
        price_per_unit: Number(item.price_per_unit || item.unit_price || 0),
        quantity: Number(item.quantity),
        subtotal: Number(item.quantity) * Number(item.price_per_unit || item.unit_price || 0)
      };

      current.sale_items.push(newItem);

      // Potong stok varian
      const variantIdx = current.product_variants.findIndex(v => v.id === item.variant_id);
      if (variantIdx !== -1) {
        current.product_variants[variantIdx].stock_quantity = Number(current.product_variants[variantIdx].stock_quantity) - Number(item.quantity);
        syncSupabaseUpsert('product_variants', current.product_variants[variantIdx]);
      }

      // Catat pergerakan stok
      current.stock_movements.push({
        id: `m-${Date.now()}-${idx}`,
        variant_id: item.variant_id,
        type: 'SALE',
        quantity: -Number(item.quantity),
        notes: `Penjualan ${invoiceNumber}`,
        created_by: userId,
        created_at: new Date().toISOString()
      });

      return newItem;
    });

    // Urus Piutang Pelanggan jika pembayaran cicil / kasbon
    if (newSale.customer_id) {
      const customerIdx = current.customers.findIndex(c => c.id === newSale.customer_id);
      if (customerIdx !== -1) {
        let addedDebt = 0;
        if (newSale.payment_method === 'DEBT') {
          addedDebt = newSale.total_amount - newSale.paid_amount;
        }
        current.customers[customerIdx].total_debt = Number(current.customers[customerIdx].total_debt) + Number(addedDebt);
      }
    }

    current.sales.push(newSale);
    if (!current.orders) current.orders = [];
    current.orders.push(newSale);
    if (!current.order_items) current.order_items = [];
    current.order_items.push(...formattedItems);

    saveDB(current);

    // Sync ke Supabase Database Cloud
    syncSupabaseUpsert('orders', {
      id: newSale.id,
      order_number: newSale.order_number,
      cashier_id: newSale.cashier_id,
      customer_name: newSale.customer_name,
      customer_phone: newSale.customer_phone,
      total_amount: newSale.total_amount,
      payment_method: newSale.payment_method,
      payment_status: newSale.payment_status,
      notes: newSale.notes,
      work_order_number: newSale.work_order_number,
      created_at: newSale.created_at
    });

    formattedItems.forEach(it => {
      syncSupabaseUpsert('order_items', {
        id: it.id,
        order_id: it.order_id,
        variant_id: it.variant_id,
        product_name: it.product_name,
        variant_detail: it.variant_detail,
        unit_price: it.unit_price,
        quantity: it.quantity,
        subtotal: it.subtotal
      });
    });

    return newSale;
  },

  // Tambah pembayaran cicilan utang
  addDebtPayment: (customerId, amountPaid, paymentMethod, cashierId) => {
    const current = getDB();
    const customerIdx = current.customers.findIndex(c => c.id === customerId);
    if (customerIdx === -1) return null;

    // Pastikan tidak membayar melebihi utang
    const customer = current.customers[customerIdx];
    const actualPaid = Math.min(Number(amountPaid), Number(customer.total_debt));

    // Potong utang
    customer.total_debt = Number(customer.total_debt) - Number(actualPaid);

    // Catat riwayat cicilan
    const newPayment = {
      id: `dp-${Date.now()}`,
      customer_id: customerId,
      amount_paid: Number(actualPaid),
      payment_method: paymentMethod, // 'CASH' | 'QRIS' | 'TRANSFER'
      cashier_id: cashierId,
      created_at: new Date().toISOString()
    };
    current.debt_payments.push(newPayment);

    saveDB(current);
    return { customer, payment: newPayment };
  },

  // ===== MODUL PENGGAJIAN BORONGAN (PIECE-RATE PAYROLL) =====

  // Ambil data Master Tarif Borongan dengan Nama Produk / Jenis Pakaian
  getPieceRateItems: () => {
    const current = getDB();
    const products = current.products || [];
    return (current.piece_rate_items || []).map(item => {
      const prod = products.find(p => p.id === item.product_id);
      return {
        ...item,
        product_name: item.garment_type || (prod ? prod.name : 'Umum / Lain-lain')
      };
    });
  },

  // Tambah Master Tarif Borongan Baru
  addPieceRateItem: (productId, itemName, ratePrice) => {
    const current = getDB();
    if (!current.piece_rate_items) current.piece_rate_items = [];
    const newItem = {
      id: `pri-${Date.now()}`,
      product_id: productId,
      item_name: itemName,
      rate_price: Number(ratePrice),
      created_at: new Date().toISOString()
    };
    current.piece_rate_items.push(newItem);
    saveDB(current);
    return newItem;
  },

  // Update Tarif Borongan
  updatePieceRateItem: (id, updates) => {
    const current = getDB();
    if (!current.piece_rate_items) return null;
    const idx = current.piece_rate_items.findIndex(p => p.id === id);
    if (idx === -1) return null;
    current.piece_rate_items[idx] = {
      ...current.piece_rate_items[idx],
      ...updates,
      rate_price: updates.rate_price !== undefined ? Number(updates.rate_price) : current.piece_rate_items[idx].rate_price
    };
    saveDB(current);
    return current.piece_rate_items[idx];
  },

  // Hapus Tarif Borongan
  deletePieceRateItem: (id) => {
    const current = getDB();
    if (!current.piece_rate_items) return false;
    current.piece_rate_items = current.piece_rate_items.filter(p => p.id !== id);
    saveDB(current);
    return true;
  },

  // Tambah Laporan Harian Pekerja (Multi-item entry)
  addWorkerDailyLog: (workerId, logDate, items) => {
    const current = getDB();
    if (!current.worker_daily_logs) current.worker_daily_logs = [];
    if (!current.worker_daily_log_items) current.worker_daily_log_items = [];

    let totalDailyAmount = 0;
    const logId = `wdl-${Date.now()}`;

    const formattedItems = items.map((it, idx) => {
      const subtotal = Number(it.quantity) * Number(it.rate_per_unit);
      totalDailyAmount += subtotal;
      return {
        id: `wdli-${Date.now()}-${idx}`,
        daily_log_id: logId,
        piece_rate_item_id: it.piece_rate_item_id,
        quantity: Number(it.quantity),
        rate_per_unit: Number(it.rate_per_unit),
        subtotal
      };
    });

    const newLogHeader = {
      id: logId,
      worker_id: workerId,
      log_date: logDate || new Date().toISOString().slice(0, 10),
      total_daily_amount: totalDailyAmount,
      status: 'PENDING', // 'PENDING' | 'APPROVED' | 'PAID'
      created_at: new Date().toISOString()
    };

    current.worker_daily_logs.push(newLogHeader);
    current.worker_daily_log_items.push(...formattedItems);
    saveDB(current);

    return { ...newLogHeader, items: formattedItems };
  },

  // Ambil Data Laporan Harian Pekerja dengan Rincian Item
  getWorkerDailyLogs: (workerId = null, monthYear = null) => {
    const current = getDB();
    const logs = current.worker_daily_logs || [];
    const items = current.worker_daily_log_items || [];
    const pieceItems = current.piece_rate_items || [];
    const products = current.products || [];
    const users = current.users || [];

    let filteredLogs = [...logs];
    if (workerId) {
      filteredLogs = filteredLogs.filter(l => l.worker_id === workerId);
    }
    if (monthYear) {
      filteredLogs = filteredLogs.filter(l => l.log_date.startsWith(monthYear));
    }

    // Urutkan dari tanggal terbaru
    filteredLogs.sort((a, b) => new Date(b.log_date) - new Date(a.log_date));

    return filteredLogs.map(log => {
      const worker = users.find(u => u.id === log.worker_id);
      const logDetails = items.filter(it => it.daily_log_id === log.id).map(it => {
        const pieceRate = pieceItems.find(pr => pr.id === it.piece_rate_item_id);
        const prod = pieceRate ? products.find(p => p.id === pieceRate.product_id) : null;
        return {
          ...it,
          item_name: pieceRate ? pieceRate.item_name : 'Item Borongan',
          product_name: prod ? prod.name : 'Seragam'
        };
      });

      return {
        ...log,
        worker_name: worker ? worker.name : 'Worker',
        items: logDetails
      };
    });
  },

  // Pencairan Gaji Bulanan (Owner Approve & Deduct Cash)
  approveAndDisbursePayroll: (workerId, monthYear, approvedBy) => {
    const current = getDB();
    if (!current.payroll_disbursements) current.payroll_disbursements = [];
    if (!current.cash_expenses) current.cash_expenses = [];

    // Ambil log harian pekerja yang statusnya PENDING atau APPROVED pada bulan terpilih
    const workerLogs = (current.worker_daily_logs || []).filter(
      l => l.worker_id === workerId && l.log_date.startsWith(monthYear) && l.status !== 'PAID'
    );

    if (workerLogs.length === 0) {
      return { success: false, message: 'Tidak ada log harian pending untuk di-approve pada bulan ini.' };
    }

    const totalAmount = workerLogs.reduce((sum, l) => sum + Number(l.total_daily_amount), 0);

    // Update status log harian menjadi PAID
    current.worker_daily_logs.forEach(l => {
      if (l.worker_id === workerId && l.log_date.startsWith(monthYear) && l.status !== 'PAID') {
        l.status = 'PAID';
      }
    });

    const payrollId = `pay-${Date.now()}`;
    const payrollNumber = `PAY-${monthYear.replace('-', '')}-${String(Date.now()).slice(-3)}`;

    const newDisbursement = {
      id: payrollId,
      payroll_number: payrollNumber,
      worker_id: workerId,
      month_year: monthYear,
      total_amount: totalAmount,
      approved_by: approvedBy,
      paid_at: new Date().toISOString()
    };

    const worker = (current.users || []).find(u => u.id === workerId);
    const workerName = worker ? worker.name : 'Worker';

    const newExpense = {
      id: `exp-${Date.now()}`,
      expense_category: 'PAYROLL',
      amount: totalAmount,
      description: `Pencairan Gaji Borongan ${monthYear} - ${workerName}`,
      reference_id: payrollId,
      created_by: approvedBy,
      created_at: new Date().toISOString()
    };

    current.payroll_disbursements.push(newDisbursement);
    current.cash_expenses.push(newExpense);

    saveDB(current);
    return { success: true, disbursement: newDisbursement, expense: newExpense };
  },

  // Ambil Riwayat Pencairan Gaji
  getPayrollDisbursements: (monthYear = null) => {
    const current = getDB();
    const disbursements = current.payroll_disbursements || [];
    const users = current.users || [];

    let filtered = [...disbursements];
    if (monthYear) {
      filtered = filtered.filter(d => d.month_year === monthYear);
    }

    filtered.sort((a, b) => new Date(b.paid_at) - new Date(a.paid_at));

    return filtered.map(d => {
      const worker = users.find(u => u.id === d.worker_id);
      const approver = users.find(u => u.id === d.approved_by);
      return {
        ...d,
        worker_name: worker ? worker.name : 'Worker',
        approver_name: approver ? approver.name : 'Owner'
      };
    });
  },

  // Ambil Pengeluaran Kas
  getCashExpenses: () => {
    const current = getDB();
    return (current.cash_expenses || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
};
