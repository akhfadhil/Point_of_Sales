// src/utils/printHelper.js

/**
 * Isolated Print Iframe Helper untuk pencetakan nota A5 Landscape yang 100% konsisten
 * di seluruh perangkat (Laptop, iPad, dan Smartphone/HP).
 * @param {string} elementId - ID dari elemen HTML yang berisi template nota yang ingin dicetak
 */
export const printReceipt = (elementId) => {
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
  frameDoc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Nota Toko Oliviana</title>
        <style>
          @page {
            size: A5 landscape;
            margin: 4mm;
          }
          *, *:before, *:after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: 'Courier New', 'Consolas', monospace;
            font-size: 11px;
            color: #000000;
            background: #ffffff;
            line-height: 1.35;
            padding: 2mm;
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
            font-size: 11px;
          }
          th, td {
            font-size: 11px;
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
