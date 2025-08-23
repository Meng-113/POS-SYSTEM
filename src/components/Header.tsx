import React from 'react';
import { LogOut, Clock, User } from 'lucide-react';
import { User as UserType } from '../types';

interface HeaderProps {
  user: UserType;
  onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  const currentTime = new Date().toLocaleString();

  return (
    <header className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img className="w-40 h-auto" src="/img.JPG" alt="" />
          <span>
            <h1 className="text-2xl font-bold text-gray-800">
              Teenager Collection
            </h1>
          </span>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock size={18} />
            <span className="text-sm">{currentTime}</span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User size={18} className="text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {user.name}
              </span>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
