import React, { useState } from 'react';
import { Eye, Calendar, Search, Trash2, Edit, X, Save } from 'lucide-react';
import { Sale } from '../types';
import { USD_TO_KHR_RATE } from '../utils/mockData';

interface SalesHistoryProps {
  sales: Sale[];
  onClearHistory: () => void;
  onUpdateSale: (sale: Sale) => void;
  onDeleteSale: (saleId: string) => void;
  onShowReceipt: (sale: Sale) => void;
}

export default function SalesHistory({
  sales,
  onShowReceipt,
  onClearHistory,
  onUpdateSale,
  onDeleteSale,
}: SalesHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    receiptNumber: '',
    date: '',
    time: '',
    paymentMethod: 'cash' as 'cash' | 'credit' | 'bank',
    bankName: '',
    customerPaid: 0,
    currency: 'USD' as 'USD' | 'KHR',
  });

  const filteredSales = sales.filter((sale) => {
    const matchesSearch = sale.receiptNumber
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || sale.date === dateFilter;
    return matchesSearch && matchesDate;
  });

  const formatPrice = (sale: Sale) => {
    if (sale.currency === 'KHR') {
      const convertedPrice = sale.total * USD_TO_KHR_RATE;
      return `${convertedPrice.toLocaleString()}៛`;
    }
    return `$${sale.total.toFixed(2)}`;
  };

  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);

  const handleClearHistory = () => {
    onClearHistory();
    setShowClearConfirm(false);
  };

  const handleEditSale = (sale: Sale) => {
    setEditingSale(sale);
    setEditFormData({
      receiptNumber: sale.receiptNumber,
      date: sale.date,
      time: sale.time,
      paymentMethod: sale.paymentMethod,
      bankName: sale.bankName || '',
      customerPaid: sale.customerPaid || 0,
      currency: sale.currency,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingSale) return;

    const updatedSale: Sale = {
      ...editingSale,
      receiptNumber: editFormData.receiptNumber,
      date: editFormData.date,
      time: editFormData.time,
      paymentMethod: editFormData.paymentMethod,
      bankName:
        editFormData.paymentMethod === 'bank'
          ? editFormData.bankName
          : undefined,
      customerPaid: editFormData.customerPaid,
      currency: editFormData.currency,
      change:
        editFormData.customerPaid > editingSale.total
          ? editFormData.customerPaid - editingSale.total
          : 0,
    };

    onUpdateSale(updatedSale);
    setShowEditModal(false);
    setEditingSale(null);
  };

  const handleDeleteSale = (sale: Sale) => {
    if (
      window.confirm(
        `Are you sure you want to delete receipt ${sale.receiptNumber}? This action cannot be undone.`
      )
    ) {
      onDeleteSale(sale.id);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingSale(null);
  };

  return (
    <>
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Sales History
              </h1>
              <p className="text-gray-600 mt-2">
                View and manage past transactions
              </p>
            </div>
            {sales.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Trash2 size={18} />
                <span>Clear History</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Receipt
              </label>
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter receipt number"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Date
              </label>
              <div className="relative">
                <Calendar
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                ${totalRevenue.toFixed(2)} USD
              </p>
            </div>
          </div>
        </div>

        {/* Sales Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Receipt #
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSales.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No sales found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredSales.reverse().map((sale) => (
                    <tr key={sale.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-gray-900">
                          {sale.receiptNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div>
                          <div>{sale.date}</div>
                          <div>{sale.time}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {sale.items.length} item
                          {sale.items.length !== 1 ? 's' : ''}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-40">
                          {sale.items
                            .map((item) => `${item.name} (${item.quantity})`)
                            .join(', ')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              sale.paymentMethod === 'cash'
                                ? 'bg-green-100 text-green-800'
                                : sale.paymentMethod === 'credit'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {sale.paymentMethod === 'bank'
                              ? `Bank (${sale.bankName})`
                              : sale.paymentMethod}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-lg font-semibold text-gray-900">
                          {formatPrice(sale)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onShowReceipt(sale)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-3 rounded-lg flex items-center space-x-1 text-sm transition-colors"
                          >
                            <Eye size={14} />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => handleEditSale(sale)}
                            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-3 rounded-lg flex items-center space-x-1 text-sm transition-colors"
                          >
                            <Edit size={14} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteSale(sale)}
                            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-3 rounded-lg flex items-center space-x-1 text-sm transition-colors"
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Clear History Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} className="text-red-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Clear Sales History
              </h2>
              <p className="text-gray-600">
                Are you sure you want to delete all sales history? This action
                cannot be undone.
              </p>
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>{sales.length}</strong> sales records will be
                  permanently deleted.
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearHistory}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Clear History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Sale Modal */}
      {showEditModal && editingSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Edit Sale</h2>
              <button
                onClick={handleCloseEditModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Receipt Number
                </label>
                <input
                  type="text"
                  value={editFormData.receiptNumber}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      receiptNumber: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={editFormData.date}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, date: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={editFormData.time}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, time: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={editFormData.currency}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      currency: e.target.value as 'USD' | 'KHR',
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="USD">US Dollar ($)</option>
                  <option value="KHR">Cambodian Riel (៛)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Paid ({editFormData.currency === 'KHR' ? '៛' : '$'})
                </label>
                <input
                  type="number"
                  value={editFormData.customerPaid}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      customerPaid: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  step={editFormData.currency === 'KHR' ? '100' : '0.01'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={editFormData.paymentMethod}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      paymentMethod: e.target.value as
                        | 'cash'
                        | 'credit'
                        | 'bank',
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="cash">Cash</option>
                  <option value="credit">Credit Card</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>

              {editFormData.paymentMethod === 'bank' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.bankName}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        bankName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter bank name"
                  />
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Total:</span>
                  <span className="font-semibold">
                    {editFormData.currency === 'KHR'
                      ? `${(
                          editingSale.total * USD_TO_KHR_RATE
                        ).toLocaleString()}៛`
                      : `$${editingSale.total.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Change:</span>
                  <span
                    className={`font-semibold ${
                      editFormData.customerPaid > editingSale.total
                        ? 'text-green-600'
                        : editFormData.customerPaid < editingSale.total
                        ? 'text-red-600'
                        : 'text-gray-800'
                    }`}
                  >
                    {editFormData.currency === 'KHR'
                      ? `${Math.max(
                          0,
                          editFormData.customerPaid -
                            editingSale.total * USD_TO_KHR_RATE
                        ).toLocaleString()}៛`
                      : `$${Math.max(
                          0,
                          editFormData.customerPaid - editingSale.total
                        ).toFixed(2)}`}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleCloseEditModal}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                <Save size={16} />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
