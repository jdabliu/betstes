import React from 'react';
import { Match } from '../types';
import { Clock, Plus } from 'lucide-react';

import { Search } from 'lucide-react';

interface MatchListProps {
  matches: Match[];
  onMatchClick: (match: Match) => void;
}

export const MatchList: React.FC<MatchListProps> = ({ matches, onMatchClick }) => {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Pesquisar um evento"
          className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Header */}
      <div className="bg-emerald-600 text-white p-4 rounded-lg">
        <h2 className="text-lg font-semibold">PRÓXIMAS PARTIDAS</h2>
        <p className="text-emerald-100">Quarta-feira, 23 de julho de 2025</p>
      </div>

      {/* Matches */}
      <div className="space-y-2">
        {matches.map((match) => (
          <div
            key={match.id}
            className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:bg-slate-750 transition-colors cursor-pointer"
            onClick={() => onMatchClick(match)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-400 text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  {match.time}
                </div>
                <div className="text-white">
                  <span className="font-medium">{match.homeTeam}</span>
                  <span className="mx-2 text-gray-400">vs</span>
                  <span className="font-medium">{match.awayTeam}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Odds */}
                <div className="flex space-x-1">
                  <div className="bg-slate-700 hover:bg-emerald-600 px-3 py-2 rounded text-sm font-medium text-white transition-colors cursor-pointer">
                    <div className="text-xs text-gray-400 text-center">1</div>
                    <div className="text-white">{match.odds.home.toFixed(2)}</div>
                  </div>
                  <div className="bg-slate-700 hover:bg-emerald-600 px-3 py-2 rounded text-sm font-medium text-white transition-colors cursor-pointer">
                    <div className="text-xs text-gray-400 text-center">N</div>
                    <div className="text-white">{match.odds.draw.toFixed(2)}</div>
                  </div>
                  <div className="bg-slate-700 hover:bg-emerald-600 px-3 py-2 rounded text-sm font-medium text-white transition-colors cursor-pointer">
                    <div className="text-xs text-gray-400 text-center">2</div>
                    <div className="text-white">{match.odds.away.toFixed(2)}</div>
                  </div>
                </div>

                <button className="p-2 hover:bg-slate-700 rounded transition-colors">
                  <Plus className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};