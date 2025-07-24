import React from 'react';
import { Bet, Stats } from '../types';

interface MyBetsProps {
  bets: Bet[];
  stats: Stats;
}

export default function MyBets({ bets, stats }: MyBetsProps) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Bets</h2>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Bets</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.totalBets}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Win Rate</h3>
          <p className="text-2xl font-bold text-green-600">{stats.winRate}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Profit</h3>
          <p className={`text-2xl font-bold ${stats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${stats.totalProfit.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Bets List */}
      <div className="space-y-4">
        {bets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No bets placed yet</p>
          </div>
        ) : (
          bets.map((bet) => (
            <div key={bet.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">{bet.homeTeam} vs {bet.awayTeam}</h4>
                  <p className="text-sm text-gray-600">{bet.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${bet.stake}</p>
                  <p className="text-sm text-gray-600">@ {bet.odds}</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  bet.status === 'won' ? 'bg-green-100 text-green-800' :
                  bet.status === 'lost' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
                </span>
                {bet.status !== 'pending' && (
                  <span className={`font-semibold ${bet.profit && bet.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {bet.profit !== undefined ? `${bet.profit >= 0 ? '+' : ''}$${bet.profit.toFixed(2)}` : `-$${bet.stake.toFixed(2)}`}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}