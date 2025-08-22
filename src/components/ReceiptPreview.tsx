import React from "react";
import { X, Printer, Download } from "lucide-react";
import { Sale } from "../types";
import { USD_TO_KHR_RATE } from "../utils/mockData";

interface ReceiptPreviewProps {
  sale: Sale | null;
  onClose: () => void;
}

export default function ReceiptPreview({ sale, onClose }: ReceiptPreviewProps) {
  if (!sale) return null;

  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const printContent = document.getElementById("receipt-print-content");
    if (printContent) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Receipt - ${sale.receiptNumber}</title>
          <style>
            @page {
              size: A4;
              margin: 15mm 8mm;
            }

            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            body {
              font-family: 'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
              line-height: 1.6;
              color: #000;              /* 🔹 Force black text */
              background: #fff;         /* 🔹 White background */
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
              font-size: 16px;          /* 🔹 Bigger base text size */
              font-weight: 500;         /* 🔹 Thicker base text */
            }

            .receipt-container {
              max-width: 90%;
              width: 500px;
              margin: 0 auto;
              background: #fff;          /* 🔹 Force white */
              border: 1px solid #000;    /* 🔹 Black border for print clarity */
              border-radius: 8px;
              overflow: hidden;
            }

            .receipt-header {
              background: #fff;          /* 🔹 White header */
              color: #000;               /* 🔹 Black text */
              padding: 30px 25px;
              text-align: center;
            }

            .logo {
              justify-content: center;
              margin-bottom: 12px;
              display: flex;
            }

            .logo img {
              height: 120px;
              width: auto;
            }

            .store-name {
              font-size: 36px;           /* 🔹 Bigger */
              font-weight: 900;          /* 🔹 Extra bold */
              margin-bottom: 8px;
              letter-spacing: -0.5px;
            }

            .store-tagline {
              font-size: 18px;           /* 🔹 Bigger */
              font-weight: 700;          /* 🔹 Bolder */
              text-transform: uppercase;
              margin-bottom: 10px;
            }

            .store-contact {
              font-size: 16px;           /* 🔹 Larger */
              font-weight: 600;          /* 🔹 Bolder */
              line-height: 1.4;
              color: #000;               /* 🔹 Black */
              font-family: 'Khmer OS Battambang', sans-serif; /* 🔹 Khmer font for address */
            }

            .receipt-body {
              padding: 28px;
            }

            .transaction-info {
              background: #fff;          /* 🔹 White background */
              border-radius: 6px;
              padding: 18px;
              margin-bottom: 24px;
              border-left: 3px solid #000; /* 🔹 Black border */
            }

            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 8px;
            }

            .info-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }

            .info-label {
              font-weight: 600;
              color: #000000ff;
              font-size: 16px;
            }

            .info-value {
              font-weight: 800;
              color: #000000ff;
              font-size: 16px;
            }

            .items-section {
              margin-bottom: 22px;
            }
            
            .section-title {
              font-size: 20px;
              font-weight: 900;
              color: #000000ff;
              margin-bottom: 12px;
              border-bottom: 2px solid rgba(0, 0, 0, 1);
              padding-bottom: 4px;
            }
            
            .item {
              background: white;
              border: 1px solid #000000ff;
              border-radius: 6px;
              padding: 12px;
              margin-bottom: 10px;
            }
            
            .item-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 4px;
            }
            
            .item-name {
              font-size: 18px;
              font-weight: 700;
              color: #000000ff;
              flex: 1;
              font-family: 'Khmer OS Battambang', sans-serif;
            }
            
            .item-total {
              font-size: 18px;
              font-weight: 900;
              color: #000000ff;
            }
            
            .item-details {
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 16px;
              color: #000000ff;
            }
            
            .item-size {
              background: #ffffffff;
              font-size: 15px;
              font-weight: 750;
              margin-right: 4px;
            }
            
            .totals-section {
              background: #ffffffff;
              border-radius: 6px;
              padding: 20px;
              margin-bottom: 24px;
              border: 1px solid #e5e7eb;
            }
            
            .total-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 4px 0;
              font-size: 13px;
            }
            
            .subtotal-row {
              font-size: 14px;
              font-weight: 600;
              color: #000000ff;
            }
            
            .tax-row {
              font-size: 14px;
              font-weight: 600;
              color: #000000ff;
              border-bottom: 1px solid #d1d5db;
              margin-bottom: 6px;
            }
            
            .grand-total {
              font-size: 18px;
              font-weight: 800;
              color: #000000ff;
              background: white;
              margin: 10px -14px -14px -14px;
              padding: 14px;
              border-top: 2px solid #000000ff;
            }
            
            .payment-info {
              font-size: 15px;
              font-weight: 700;
              background: #ffffffff;
              border: 1px solid #000000ff;
              border-radius: 6px;
              padding: 12px;
              margin-bottom: 16px;
            }
            
            .payment-method {
              font-size: 15px;
              font-weight: 700;
              color: #000000ff;
              margin-bottom: 2px;
            }
            
            .currency-info {
              font-size: 15px;
              font-weight: 700;
              color: #000000ff;
            }
            
            .receipt-footer {
              text-align: center;
              border-top: 1px dashed #ffffffff;
              padding-top: 12px;
              color: #000000ff;
            }
            
            .thank-you {
              font-size: 16px;
              font-weight: 700;
              color: #000000ff;
              margin-bottom: 4px;
            }
            
            .footer-text {
              font-size: 12px;
              margin-bottom: 2px;
            }
            
            .policy-text {
              font-size: 11px;
              color: #ffffffff;
            }
            
            .decorative-line {
              margin-top: 8px;
              font-size: 12px;
              letter-spacing: 2px;
              color: #000000ff;
            }
            
            @media print {
              body { margin: 0; font-size: 12px; }
              .receipt-container { 
                border: none; 
                border-radius: 0;
                box-shadow: none;
                width: 100%;
                max-width: none;
              }
              .receipt-header { padding: 35px; border-radius: 0 0 20px 20px; margin-bottom: 20px;}
              .receipt-body { padding: 40px; }
              .store-name { font-size: 35px; }
              .transaction-info { margin-bottom: 12px; padding: 35px; }
              .items-section { margin-bottom: 13px; }
              .totals-section { margin-bottom: 22px; padding: 30px; }
              .payment-info { margin-bottom: 12px; padding: 25px; }
              .receipt-footer { padding-top: 10px; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      };
    }
  };

  const formatPrice = (price: number) => {
    if (sale?.currency === "KHR") {
      const convertedPrice = price * USD_TO_KHR_RATE;
      return `${convertedPrice.toLocaleString()}៛`;
    }
    return `$${price.toFixed(2)}`;
  };

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-xl font-bold text-gray-800">Receipt Preview</h2>
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePrint}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg"
              >
                <Printer size={18} />
                <span className="font-medium">Print</span>
              </button>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Receipt Preview Content */}
          <div className="flex-1 overflow-y-auto p-8 bg-white">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
              <div id="receipt-content-preview">
                {/* Store Header */}
                <div className="bg-white text-black p-8 text-center">
                  <div className="flex justify-center items-center mb-3 w-full h-[100px]">
                    <img
                      src="/logo.png"
                      alt="Logo"
                      className="h-[120px] w-auto"
                    />
                  </div>
                  <h1 className="text-4xl font-extrabold mb-2">
                    Teenager Collection
                  </h1>
                  <p className="text-black text-lg uppercase tracking-wider font-bold mb-3">
                    Fashion & Style Collection
                  </p>
                  <p className="text-black text-base font-semibold">
                    📞 010 414 418
                  </p>
                  <p className="text-black text-base font-semibold font-khmer">
                    📍Home Number 10Eo ផ្លូវ 608 សង្កាត់បឹងកក់២ ខណ្ឌទួលគោក
                    រាជធានីភ្នំពេញ
                  </p>
                </div>

                {/* Receipt Body */}
                <div className="p-6">
                  {/* Transaction Info */}
                  <div className="bg-white rounded-lg p-5 mb-6 border-l-4 border-black">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex justify-between">
                        <span className="text-black font-bold text-lg">
                          Receipt #
                        </span>
                        <span className="font-extrabold text-lg">
                          {sale.receiptNumber}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-black font-bold text-lg">
                          Date
                        </span>
                        <span className="font-extrabold text-lg">
                          {sale.date}
                        </span>
                      </div>
                      <div className="flex justify-between col-span-2">
                        <span className="text-black font-bold text-lg">
                          Time
                        </span>
                        <span className="font-extrabold text-lg">
                          {sale.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mb-6">
                    <h3 className="text-xl font-extrabold text-black mb-4 border-b-2 border-gray-300 pb-2">
                      Items Purchased
                    </h3>
                    <div className="space-y-3">
                      {sale.items.map((item, index) => (
                        <div
                          key={index}
                          className="bg-white border border-gray-300 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h4 className="font-bold text-black text-lg font-khmer">
                                {item.name}
                              </h4>
                              {item.selectedSize && (
                                <span className="inline-block bg-gray-100 text-black text-sm px-2 py-1 rounded mt-1 font-medium">
                                  Size: {item.selectedSize}
                                </span>
                              )}
                            </div>
                            <div className="text-xl font-extrabold text-black">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                          </div>
                          <div className="flex justify-between text-base text-black">
                            <span>
                              {formatPrice(item.price)} × {item.quantity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="bg-white rounded-lg p-5 mb-6 border border-gray-300">
                    <div className="space-y-3">
                      <div className="flex justify-between text-black text-lg font-bold">
                        <span>Subtotal</span>
                        <span>{formatPrice(sale.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-black text-lg font-bold pb-3 border-b border-gray-400">
                        <span>Tax</span>
                        <span>{formatPrice(sale.tax)}</span>
                      </div>
                      <div className="flex justify-between text-3xl font-extrabold text-black bg-white p-4 rounded-lg border-l-4 border-black">
                        <span>Grand Total</span>
                        <span>{formatPrice(sale.total)}</span>
                      </div>

                      {sale.customerPaid && (
                        <div className="pt-3 border-t border-gray-400 space-y-2">
                          <div className="flex justify-between text-black text-lg font-bold">
                            <span>Customer Paid</span>
                            <span>
                              {sale.currency === "KHR"
                                ? `${sale.customerPaid.toLocaleString()}៛`
                                : `$${sale.customerPaid.toFixed(2)}`}
                            </span>
                          </div>
                          <div className="flex justify-between text-black text-lg font-bold">
                            <span>Change</span>
                            <span>
                              {sale.currency === "KHR"
                                ? `${(sale.change || 0).toLocaleString()}៛`
                                : `$${(sale.change || 0).toFixed(2)}`}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-white border border-gray-300 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-black text-lg">
                        Payment Method
                      </span>
                      <span className="text-black font-bold text-lg capitalize">
                        {sale.paymentMethod === "bank"
                          ? `Bank Transfer (${sale.bankName})`
                          : sale.paymentMethod}
                      </span>
                    </div>
                    <div className="text-base text-black text-center font-semibold">
                      Currency:{" "}
                      {sale.currency === "KHR"
                        ? "Cambodian Riel (៛)"
                        : "US Dollar ($)"}
                    </div>
                  </div>

                  {/* Bank Slip Preview */}
                  {sale.paymentMethod === "bank" && sale.bankSlip && (
                    <div className="text-center mb-6 p-4 bg-white rounded-lg border border-gray-300">
                      <h4 className="font-bold mb-3 text-black text-lg">
                        Payment Slip
                      </h4>
                      <img
                        src={sale.bankSlip}
                        alt="Payment Slip"
                        className="max-w-40 mx-auto rounded-lg border-2 border-gray-300"
                      />
                    </div>
                  )}

                  {/* Footer */}
                  <div className="text-center border-t-2 border-dashed border-gray-400 pt-6">
                    <h3 className="text-2xl font-extrabold text-black mb-2">
                      Thank you for shopping with us!
                    </h3>
                    <p className="text-black text-lg font-medium mb-1">
                      Visit us again soon
                    </p>
                    <p className="text-base text-black mb-4 font-medium">
                      Exchange policy: 7 days with receipt
                    </p>
                    <div className="text-gray-400 text-lg tracking-widest font-bold">
                      ═══════════════════════════════
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t bg-white p-6">
            <div className="flex space-x-4 max-w-2xl mx-auto">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-black font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors shadow-md hover:shadow-lg"
              >
                <Printer size={20} />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Print-Only Content */}
      <div id="receipt-print-content" className="hidden">
        <div className="receipt-container">
          {/* Store Header */}
          <div className="receipt-header">
            <div className="logo">
              <img src="/logo.png" alt="" />
            </div>
            <div className="store-name">Teenager Collection</div>
            <div className="store-tagline">Fashion & Style Collection</div>
            <div className="store-contact">
              📍Home Number 10Eo ផ្លូវ 608 សង្កាត់បឹងកក់២ ខណ្ឌទួលគោក
              រាជធានីភ្នំពេញ
              <br />
              📞 010 414 418
            </div>
          </div>

          {/* Receipt Body */}
          <div className="receipt-body">
            {/* Transaction Info */}
            <div className="transaction-info">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Receipt #</span>
                  <span className="info-value">{sale.receiptNumber}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Date</span>
                  <span className="info-value">{sale.date}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Time</span>
                  <span className="info-value">{sale.time}</span>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="items-section">
              <h3 className="section-title">Items Purchased</h3>
              <div>
                {sale.items.map((item, index) => (
                  <div key={index} className="item">
                    <div className="item-header">
                      <div className="item-name">{item.name}</div>
                      <div className="item-total">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                    <div className="item-details">
                      <div>
                        {item.selectedSize && (
                          <span className="item-size">
                            Size: {item.selectedSize}
                          </span>
                        )}
                        <span>
                          {formatPrice(item.price)} × {item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="totals-section">
              <div className="total-row subtotal-row">
                <span>Subtotal</span>
                <span>{formatPrice(sale.subtotal)}</span>
              </div>
              <div className="total-row tax-row">
                <span>Tax</span>
                <span>{formatPrice(sale.tax)}</span>
              </div>
              <div className="total-row grand-total">
                <span>Grand Total</span>
                <span>{formatPrice(sale.total)}</span>
              </div>

              {sale.customerPaid && (
                <>
                  <div className="total-row" style={{ marginTop: "16px" }}>
                    <span>Customer Paid</span>
                    <span>
                      {sale.currency === "KHR"
                        ? `${sale.customerPaid.toLocaleString()}៛`
                        : `$${sale.customerPaid.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="total-row">
                    <span>Change</span>
                    <span>
                      {sale.currency === "KHR"
                        ? `${(sale.change || 0).toLocaleString()}៛`
                        : `$${(sale.change || 0).toFixed(2)}`}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Payment Method */}
            <div className="payment-info">
              <div className="payment-method">
                <span style={{ marginRight: "13cm" }}>Payment Method : </span>
                <span>
                  {sale.paymentMethod === "bank"
                    ? `Bank Transfer (${sale.bankName})`
                    : sale.paymentMethod}
                </span>
              </div>
              <div className="currency-info">
                <span style={{ marginRight: "13cm" }}>Currency : </span>
                <span>
                  {sale.currency === "KHR"
                    ? "Cambodian Riel (៛)"
                    : "US Dollar ($)"}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="receipt-footer">
              <div className="thank-you">Thank you for shopping with us!</div>
              <div className="footer-text">Visit us again soon</div>
              <div className="policy-text">
                Exchange policy: 7 days with receipt
              </div>
              <div className="decorative-line">
                ═══════════════════════════════
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
