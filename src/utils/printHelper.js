// src/utils/printHelper.js

/**
 * Isolated Print Iframe Helper untuk pencetakan nota & rincian transaksi
 * Menerima opsi ukuran kertas: 'a5' (A5 Landscape), '58mm' (Thermal 58mm), '80mm' (Thermal 80mm)
 * @param {string} elementId - ID elemen HTML template nota
 * @param {string} paperSize - Ukuran kertas ('a5' | '58mm' | '80mm')
 */
export const printReceipt = (elementId, paperSize = 'a5') => {
  const element = document.getElementById(elementId);
  if (!element) return;

  let printFrame = document.getElementById('receipt-print-iframe');
  if (!printFrame) {
    printFrame = document.createElement('iframe');
    printFrame.id = 'receipt-print-iframe';
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0px';
    printFrame.style.height = '0px';
    printFrame.style.border = 'none';
    printFrame.style.zIndex = '-9999';
    document.body.appendChild(printFrame);
  }

  const frameDoc = printFrame.contentWindow.document;
  frameDoc.open();

  let pageSizeCss = 'A5 landscape';
  let bodyWidthCss = '100%';
  let fontSizeCss = '11px';

  if (paperSize === '58mm') {
    pageSizeCss = '58mm auto';
    bodyWidthCss = '54mm';
    fontSizeCss = '9.5px';
  } else if (paperSize === '80mm') {
    pageSizeCss = '80mm auto';
    bodyWidthCss = '74mm';
    fontSizeCss = '10.5px';
  }

  frameDoc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Nota Toko Oliviana</title>
        <style>
          @page {
            size: ${pageSizeCss};
            margin: ${paperSize.includes('mm') ? '1mm' : '4mm'};
          }
          *, *:before, *:after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: 'Courier New', 'Consolas', monospace;
            font-size: ${fontSizeCss};
            color: #000000;
            background: #ffffff;
            line-height: 1.35;
            padding: ${paperSize.includes('mm') ? '1mm' : '2mm'};
            max-width: ${bodyWidthCss};
            margin: 0 auto;
          }
          .receipt-paper {
            width: 100%;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .receipt-paper code {
            font-family: 'Courier New', 'Consolas', monospace;
            font-weight: bold;
          }
          .receipt-divider {
            border-top: 1px dashed #000000;
            margin: 6px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: ${fontSizeCss};
          }
          th, td {
            font-size: ${fontSizeCss};
          }
        </style>
      </head>
      <body>
        <div class="receipt-paper">
          ${element.innerHTML}
        </div>
      </body>
    </html>
  `);
  frameDoc.close();

  setTimeout(() => {
    printFrame.contentWindow.focus();
    printFrame.contentWindow.print();
  }, 250);
};

/**
 * Isolated Print Helper untuk Laporan Keuangan, Stok, dan Rekap Gaji (PDF Output)
 * @param {string} title - Judul Laporan
 * @param {string} contentHtml - Isi HTML tabel / ringkasan laporan
 */
export const printReport = (title, contentHtml) => {
  let printFrame = document.getElementById('report-print-iframe');
  if (!printFrame) {
    printFrame = document.createElement('iframe');
    printFrame.id = 'report-print-iframe';
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0px';
    printFrame.style.height = '0px';
    printFrame.style.border = 'none';
    printFrame.style.zIndex = '-9999';
    document.body.appendChild(printFrame);
  }

  const frameDoc = printFrame.contentWindow.document;
  frameDoc.open();
  frameDoc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 12mm;
          }
          *, *:before, *:after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 12px;
            color: #1e293b;
            background: #ffffff;
            line-height: 1.5;
            padding: 10px;
          }
          .header {
            border-bottom: 2px solid #2563eb;
            padding-bottom: 12px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .brand {
            font-size: 20px;
            font-weight: 800;
            color: #1e3a8a;
          }
          .subbrand {
            font-size: 12px;
            color: #64748b;
          }
          .report-title {
            font-size: 16px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 4px;
          }
          .report-date {
            font-size: 11px;
            color: #64748b;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 12px;
            font-size: 12px;
          }
          th {
            background-color: #f1f5f9;
            color: #334155;
            text-transform: uppercase;
            font-size: 11px;
            font-weight: 700;
            padding: 8px 12px;
            border: 1px solid #cbd5e1;
            text-align: left;
          }
          td {
            padding: 8px 12px;
            border: 1px solid #e2e8f0;
          }
          tr:nth-child(even) {
            background-color: #f8fafc;
          }
          .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
          }
          .badge-success { background: #dcfce7; color: #166534; }
          .badge-warning { background: #fef9c3; color: #854d0e; }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .bold { font-weight: bold; }
          .summary-box {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-bottom: 20px;
          }
          .stat-card {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 10px 14px;
            background: #f8fafc;
          }
          .stat-label { font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; }
          .stat-value { font-size: 16px; font-weight: 800; color: #0f172a; margin-top: 2px; }
          .footer {
            margin-top: 30px;
            padding-top: 10px;
            border-top: 1px solid #e2e8f0;
            font-size: 10px;
            color: #94a3b8;
            display: flex;
            justify-content: space-between;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">OLIVIANA POS</div>
            <div class="subbrand">Konveksi & Seragam Sekolah</div>
          </div>
          <div style="text-align: right;">
            <div class="report-title">${title}</div>
            <div class="report-date">Dicetak pada: ${new Date().toLocaleString('id-ID')}</div>
          </div>
        </div>

        ${contentHtml}

        <div class="footer">
          <span>Laporan Resmi Oliviana POS</span>
          <span>Dokumen Sistem Operasional</span>
        </div>
      </body>
    </html>
  `);
  frameDoc.close();

  setTimeout(() => {
    printFrame.contentWindow.focus();
    printFrame.contentWindow.print();
  }, 250);
};
