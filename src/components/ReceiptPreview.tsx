import React from 'react';
import { X, Printer, Download } from 'lucide-react';
import { Sale } from '../types';
import { USD_TO_KHR_RATE } from '../utils/mockData';

interface ReceiptPreviewProps {
  sale: Sale | null;
  onClose: () => void;
}

export default function ReceiptPreview({ sale, onClose }: ReceiptPreviewProps) {
  if (!sale) return null;

  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = document.getElementById('receipt-print-content');
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
              line-height: 1.4;
              color: #1a1a1a;
              background: white;
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
              font-size: 14px;
            }
            
            .receipt-container {
              max-width: 90%;
              width: 500px;
              margin: 0 auto;
              background: white;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              overflow: hidden;
            }
            
            .receipt-header {
              // background: linear-gradient(135deg, #ffffff 0%, #ffffff 100%);
              // background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
              color: Black;
              padding: 29px 25px;
              text-align: center;
            }
            
            .store-name {
              font-size: 32px;
              font-weight: 800;
              margin-bottom: 6px;
              letter-spacing: -0.5px;
            }
            
            .store-tagline {
              font-size: 14px;
              opacity: 0.9;
              margin-bottom: 8px;
              text-transform: uppercase;
              letter-spacing: 1px;
              font-weight: 500;
            }
            
            .store-contact {
              font-size: 15px;
              opacity: 0.8;
              line-height: 1.2;
              font-family: 'Khmer OS Battambang', sans-serif;
            }
            
            .receipt-body {
              padding: 24px;
            }
            
            .transaction-info {
              background: #f8fafc;
              border-radius: 6px;
              padding: 15px;
              margin-bottom: 24px;
              border-left: 3px solid #2563eb;
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
              color: #374151;
              font-size: 12px;
            }
            
            .info-value {
              font-weight: 500;
              color: #1f2937;
              font-size: 12px;
            }
            
            .items-section {
              margin-bottom: 22px;
            }
            
            .section-title {
              font-size: 16px;
              font-weight: 700;
              color: #1f2937;
              margin-bottom: 10px;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 4px;
            }
            
            .item {
              background: white;
              border: 1px solid #e5e7eb;
              border-radius: 6px;
              padding: 10px;
              margin-bottom: 8px;
            }
            
            .item-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 4px;
            }
            
            .item-name {
              font-size: 14px;
              font-weight: 600;
              color: #1f2937;
              flex: 1;
            }
            
            .item-total {
              font-size: 15px;
              font-weight: 700;
              color: #059669;
            }
            
            .item-details {
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 12px;
              color: #6b7280;
            }
            
            .item-size {
              background: #e5e7eb;
              padding: 2px 6px;
              border-radius: 3px;
              font-size: 11px;
              font-weight: 500;
              margin-right: 6px;
            }
            
            .totals-section {
              background: #f9fafb;
              border-radius: 6px;
              padding: 16px;
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
              color: #6b7280;
            }
            
            .tax-row {
              color: #6b7280;
              border-bottom: 1px solid #d1d5db;
              margin-bottom: 6px;
            }
            
            .grand-total {
              font-size: 18px;
              font-weight: 800;
              color: #1f2937;
              background: white;
              margin: 10px -14px -14px -14px;
              padding: 14px;
              border-top: 2px solid #2563eb;
            }
            
            .payment-info {
              background: #fef3c7;
              border: 1px solid #f59e0b;
              border-radius: 6px;
              padding: 12px;
              margin-bottom: 16px;
            }
            
            .payment-method {
              font-weight: 600;
              color: #92400e;
              margin-bottom: 2px;
              font-size: 12px;
            }
            
            .currency-info {
              font-size: 11px;
              color: #a16207;
            }
            
            .receipt-footer {
              text-align: center;
              border-top: 1px dashed #d1d5db;
              padding-top: 12px;
              color: #6b7280;
            }
            
            .thank-you {
              font-size: 16px;
              font-weight: 700;
              color: #2563eb;
              margin-bottom: 4px;
            }
            
            .footer-text {
              font-size: 12px;
              margin-bottom: 2px;
            }
            
            .policy-text {
              font-size: 11px;
              color: #9ca3af;
            }
            
            .decorative-line {
              margin-top: 8px;
              font-size: 12px;
              letter-spacing: 2px;
              color: #d1d5db;
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
    if (sale?.currency === 'KHR') {
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
          <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
              <div id="receipt-content-preview">
                {/* Store Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 text-center">
                  <h1 className="text-3xl font-bold mb-2">
                    Teenager Collection
                  </h1>
                  <p className="text-blue-100 text-sm uppercase tracking-wider font-medium mb-3">
                    Fashion & Style Collection
                  </p>
                  <p className="text-blue-200 text-sm">📞 010 414 418</p>
                  <p className="text-blue-200 text-sm font-khmer">
                    📍Home Number 10Eo ផ្លូវ 608 សង្កាត់បឹងកក់២ ខណ្ឌទួលគោក
                    រាជធានីភ្នំពេញ
                  </p>
                </div>

                {/* Receipt Body */}
                <div className="p-6">
                  {/* Transaction Info */}
                  <div className="bg-gray-50 rounded-lg p-5 mb-6 border-l-4 border-blue-500">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">
                          Receipt #
                        </span>
                        <span className="font-semibold">
                          {sale.receiptNumber}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Date</span>
                        <span className="font-semibold">{sale.date}</span>
                      </div>
                      <div className="flex justify-between col-span-2">
                        <span className="text-gray-600 font-medium">Time</span>
                        <span className="font-semibold">{sale.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
                      Items Purchased
                    </h3>
                    <div className="space-y-3">
                      {sale.items.map((item, index) => (
                        <div
                          key={index}
                          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800">
                                {item.name}
                              </h4>
                              {item.selectedSize && (
                                <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mt-1">
                                  Size: {item.selectedSize}
                                </span>
                              )}
                            </div>
                            <div className="text-lg font-bold text-green-600">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                          </div>
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>
                              {formatPrice(item.price)} × {item.quantity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="bg-gray-50 rounded-lg p-5 mb-6 border border-gray-200">
                    <div className="space-y-3">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>{formatPrice(sale.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600 pb-3 border-b border-gray-300">
                        <span>Tax</span>
                        <span>{formatPrice(sale.tax)}</span>
                      </div>
                      <div className="flex justify-between text-2xl font-bold text-gray-800 bg-white p-4 rounded-lg border-l-4 border-blue-500">
                        <span>Grand Total</span>
                        <span>{formatPrice(sale.total)}</span>
                      </div>

                      {sale.customerPaid && (
                        <div className="pt-3 border-t border-gray-300 space-y-2">
                          <div className="flex justify-between text-gray-600">
                            <span>Customer Paid</span>
                            <span>
                              {sale.currency === 'KHR'
                                ? `${sale.customerPaid.toLocaleString()}៛`
                                : `$${sale.customerPaid.toFixed(2)}`}
                            </span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>Change</span>
                            <span>
                              {sale.currency === 'KHR'
                                ? `${(sale.change || 0).toLocaleString()}៛`
                                : `$${(sale.change || 0).toFixed(2)}`}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-yellow-800">
                        Payment Method
                      </span>
                      <span className="text-yellow-700 capitalize">
                        {sale.paymentMethod === 'bank'
                          ? `Bank Transfer (${sale.bankName})`
                          : sale.paymentMethod}
                      </span>
                    </div>
                    <div className="text-sm text-yellow-600 text-center">
                      Currency:{' '}
                      {sale.currency === 'KHR'
                        ? 'Cambodian Riel (៛)'
                        : 'US Dollar ($)'}
                    </div>
                  </div>

                  {/* Bank Slip Preview */}
                  {sale.paymentMethod === 'bank' && sale.bankSlip && (
                    <div className="text-center mb-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold mb-3 text-blue-800">
                        Payment Slip
                      </h4>
                      <img
                        src={sale.bankSlip}
                        alt="Payment Slip"
                        className="max-w-40 mx-auto rounded-lg border-2 border-blue-200"
                      />
                    </div>
                  )}

                  {/* Footer */}
                  <div className="text-center border-t-2 border-dashed border-gray-300 pt-6">
                    <h3 className="text-xl font-bold text-blue-600 mb-2">
                      Thank you for shopping with us!
                    </h3>
                    <p className="text-gray-600 mb-1">Visit us again soon</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Exchange policy: 7 days with receipt
                    </p>
                    <div className="text-gray-300 text-lg tracking-widest">
                      ═══════════════════════════════
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t bg-gray-50 p-6">
            <div className="flex space-x-4 max-w-2xl mx-auto">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors shadow-md hover:shadow-lg"
              >
                <Printer size={18} />
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
                  <div className="total-row" style={{ marginTop: '16px' }}>
                    <span>Customer Paid</span>
                    <span>
                      {sale.currency === 'KHR'
                        ? `${sale.customerPaid.toLocaleString()}៛`
                        : `$${sale.customerPaid.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="total-row">
                    <span>Change</span>
                    <span>
                      {sale.currency === 'KHR'
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
                Payment Method:{' '}
                {sale.paymentMethod === 'bank'
                  ? `Bank Transfer (${sale.bankName})`
                  : sale.paymentMethod}
              </div>
              <div className="currency-info">
                Currency:{' '}
                {sale.currency === 'KHR'
                  ? 'Cambodian Riel (៛)'
                  : 'US Dollar ($)'}
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
