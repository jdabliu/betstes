import React, { useState } from 'react';
import { X } from 'lucide-react';
import { BetLine, MatchDetails } from '../types';

interface BetModalProps {
  isOpen: boolean;
  onClose: () => void;
  line: BetLine | null;
  match: MatchDetails | null;
  onSubmit: (bet: any) => void;
}

export const BetModal: React.FC<BetModalProps> = ({ isOpen, onClose, line, match, onSubmit }) => {
  const [odds, setOdds] = useState(line?.odds.toFixed(2) || '');
  const [stake, setStake] = useState('');

  React.useEffect(() => {
    if (line) {
      setOdds(line.odds.toFixed(2));
    }
  }, [line]);

  const handleSubmit = () => {
    if (!line || !match || !stakes || !odds) return;

    const numOdds = parseFloat(odds);
    const numStake = parseFloat(stake);
    const potentialReturn = numOdds * numStake;
    const ev = ((numOdds - 1) * 0.5 - 0.5) * 100; // Simple EV calculation

    const bet = {
      id: Date.now().toString(),
      matchId: match.id,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      betType: line.type,
      description: line.team ? `${line.team} ${line.description}` : line.description,
      odds: numOdds,
      stake: numStake,
      potentialReturn,
      ev,
      status: 'pending' as const,
      date: new Date().toISOString().split('T')[0]
    };

    onSubmit(bet);
    onClose();
    setStake('');
  };

  if (!isOpen || !line || !match) return null;

  const potentialReturn = parseFloat(odds) * parseFloat(stake || '0');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 w-96 max-w-sm mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Log bet</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Match info */}
          <div className="bg-slate-700 p-3 rounded">
            <div className="text-white font-medium text-sm">
              {match.homeTeam} vs {match.awayTeam}
            </div>
          </div>

          {/* Game */}
          <div>
            <label className="block text-gray-400 text-sm mb-1">Game</label>
            <div className="bg-slate-700 p-3 rounded text-white">
              {match.homeTeam} vs {match.awayTeam}
            </div>
          </div>

          {/* Bet type */}
          <div>
            <label className="block text-gray-400 text-sm mb-1">
              {line.type === 'handicap' ? 'Handicap' : 'Total'}
            </label>
            <div className="bg-slate-700 p-3 rounded text-white">
              {line.team ? `${line.team} ${line.description}` : line.description}
            </div>
          </div>

          {/* Team selection */}
          <div>
            <label className="block text-gray-400 text-sm mb-1">Team</label>
            <div className="bg-slate-700 p-3 rounded text-white">
              {line.team || match.homeTeam}
            </div>
          </div>

          {/* Odds */}
          <div>
            <label className="block text-gray-400 text-sm mb-1">Odds</label>
            <input
              type="number"
              step="0.01"
              value={odds}
              onChange={(e) => setOdds(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded p-3 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Stake */}
          <div>
            <label className="block text-gray-400 text-sm mb-1">Stake</label>
            <div className="flex items-center">
              <span className="bg-slate-700 border border-slate-600 rounded-l p-3 text-gray-400">R$</span>
              <input
                type="number"
                step="0.01"
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                className="flex-1 bg-slate-700 border border-slate-600 border-l-0 rounded-r p-3 text-white focus:outline-none focus:border-emerald-500"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* EV */}
          <div>
            <label className="block text-gray-400 text-sm mb-1">EV</label>
            <div className="bg-slate-700 p-3 rounded text-gray-400">
              N/A
            </div>
          </div>

          {/* Potential return */}
          {stake && (
            <div className="bg-slate-700 p-3 rounded">
              <div className="text-gray-400 text-sm">Retorno Potencial</div>
              <div className="text-white font-bold">R$ {potentialReturn.toFixed(2)}</div>
            </div>
          )}
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!stake || !odds}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded transition-colors"
          >
            Log bet
          </button>
        </div>
      </div>
    </div>
  );
};