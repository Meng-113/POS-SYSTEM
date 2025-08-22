import React from 'react';
import { DollarSign, ShoppingCart, TrendingUp, Package } from 'lucide-react';
import { Sale } from '../types';

interface DashboardProps {
  sales: Sale[];
  onNavigate: (section: string) => void;
}

export default function Dashboard({ sales, onNavigate }: DashboardProps) {
  const todaysales = sales.filter(sale => 
    new Date(sale.date).toDateString() === new Date().toDateString()
  );
  
  const todaysRevenue = todaysales.reduce((sum, sale) => sum + sale.total, 0);
  const totalTransactions = todaysales.length;
  const averageOrder = totalTransactions > 0 ? todaysRevenue / totalTransactions : 0;

  const stats = [
    {
      title: 'Today\'s Sales',
      value: `$${todaysRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-500',
      onClick: () => onNavigate('pos')
    },
    {
      title: 'Transactions',
      value: totalTransactions.toString(),
      icon: ShoppingCart,
      color: 'bg-blue-500',
      onClick: () => onNavigate('history')
    },
    {
      title: 'Average Order',
      value: `$${averageOrder.toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      onClick: () => onNavigate('pos')
    },
    {
      title: 'Products',
      value: '8',
      icon: Package,
      color: 'bg-orange-500',
      onClick: () => onNavigate('products')
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your store overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              onClick={stat.onClick}
              className="bg-white rounded-xl shadow-sm border p-6 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-2">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {sales.slice(-5).reverse().map((sale) => (
              <div key={sale.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-800">{sale.receiptNumber}</p>
                  <p className="text-sm text-gray-600">{sale.date} at {sale.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800">${sale.total.toFixed(2)}</p>
                  <p className="text-sm text-gray-600 capitalize">{sale.paymentMethod}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => onNavigate('pos')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Start New Sale
            </button>
            <button
              onClick={() => onNavigate('products')}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Manage Products
            </button>
            <button
              onClick={() => onNavigate('history')}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              View Sales History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}