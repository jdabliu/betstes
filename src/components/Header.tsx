import React from 'react';
import { Search, User, TrendingUp } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  return (
    <header className="bg-slate-900 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-emerald-500" />
            <span className="ml-2 text-xl font-bold text-white">BetTracker</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => onViewChange('matches')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'matches'
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              Partidas
            </button>
            <button
              onClick={() => onViewChange('my-bets')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'my-bets'
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              Minhas Bets
            </button>
          </nav>

          {/* User section */}
          <div className="flex items-center space-x-4">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Apostar
            </button>
            <button className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-slate-700 transition-colors">
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};