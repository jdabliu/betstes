import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { BetLine, MatchDetails } from '../types';
import { useTags, Tag } from '../hooks/useTags';
import { useSettings } from '../hooks/useSettings';

interface BetModalProps {
  isOpen: boolean;
  onClose: () => void;
  line: BetLine | null;
  match: MatchDetails | null;
  onSubmit: (bet: any) => void;
}

const bookmakers = [
  'Bet365',
  'Pinnacle',
  'Bet7k',
  'Cassino'
];

const colors = [
  'bg-emerald-500',
  'bg-blue-500',
  'bg-purple-500',
  'bg-yellow-500',
  'bg-red-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-orange-500'
];

export const BetModal: React.FC<BetModalProps> = ({ isOpen, onClose, line, match, onSubmit }) => {
  const { tags, addTag } = useTags();
  const { settings } = useSettings();
  const [odds, setOdds] = useState(line?.odds.toFixed(2) || '');
  const [stake, setStake] = useState(settings.lockStake ? settings.defaultStake.toString() : '');
  const [selectedBookmaker, setSelectedBookmaker] = useState('Bet365');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showNewTagForm, setShowNewTagForm] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('bg-emerald-500');

  React.useEffect(() => {
    if (line) {
      setOdds(line.odds.toFixed(2));
    }
    if (settings.lockStake) {
      setStake(settings.defaultStake.toString());
    }
  }, [line, settings]);

  const handleSubmit = () => {
    if (!line || !match || !stake || !odds) return;

    const numOdds = parseFloat(odds);
    const numStake = parseFloat(stake);
    const potentialReturn = numOdds * numStake;

    // Format bet description based on type
    let description = '';
    if (line.type === 'handicap') {
      const team = line.team === match.homeTeam ? 'Home' : 'Away';
      description = `${team} ${line.description}`;
    } else if (line.type === 'total') {
      description = line.description;
    } else {
      description = line.team ? `${line.team} ${line.description}` : line.description;
    }

    const bet = {
      id: Date.now().toString(),
      matchId: match.id,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      startTime: `${match.time} ${match.date.split(',')[0]}`,
      betPlaced: new Date().toLocaleString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit'
      }),
      betType: line.type,
      description,
      sport: 'Soccer',
      competition: match.league,
      market: line.type === 'handicap' ? 'Spreads' : 'Totals',
      outcome: description,
      period: 'Match',
      odds: numOdds,
      stake: numStake,
      potentialReturn,
      loggedEv: numOdds,
      currentEv: Math.random() * 10 - 5,
      clv: Math.random() * 20 - 10,
      ev: 0,
      status: 'pending' as const,
      date: new Date().toISOString().split('T')[0],
      bookmaker: selectedBookmaker,
      tags: selectedTags,
      opening: {
        avg: numOdds + (Math.random() * 0.2 - 0.1),
        p: numOdds + (Math.random() * 0.1 - 0.05),
        v: Math.random() * 15 + 5
      },
      close: {
        avg: numOdds + (Math.random() * 0.1 - 0.05),
        p: numOdds + (Math.random() * 0.05 - 0.025),
        v: Math.random() * 20 + 10
      }
    };

    onSubmit(bet);
    onClose();
    if (!settings.lockStake) {
      setStake('');
    }
    setSelectedTags([]);
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      const newTag = addTag(newTagName.trim(), newTagColor);
      setSelectedTags(prev => [...prev, newTag.id]);
      setNewTagName('');
      setShowNewTagForm(false);
    }
  };

  if (!isOpen || !line || !match) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 w-96 max-w-sm mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Log Bet</h3>
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

          {/* Bet type */}
          <div>
            <label className="block text-gray-400 text-sm mb-1">
              {line.type === 'handicap' ? 'Handicap' : 'Total'}
            </label>
            <div className="bg-slate-700 p-3 rounded text-white">
              {line.type === 'handicap' 
                ? `${line.team === match.homeTeam ? 'Home' : 'Away'} ${line.description}`
                : line.description
              }
            </div>
          </div>

          {/* Bookmaker */}
          <div>
            <label className="block text-gray-400 text-sm mb-1">Bookmaker</label>
            <select
              value={selectedBookmaker}
              onChange={(e) => setSelectedBookmaker(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded p-3 text-white focus:outline-none focus:border-emerald-500"
            >
              {bookmakers.map(bookmaker => (
                <option key={bookmaker} value={bookmaker}>{bookmaker}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => handleTagToggle(tag.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedTags.includes(tag.id)
                      ? `${tag.color} text-white`
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
              <button
                onClick={() => setShowNewTagForm(true)}
                className="px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-gray-300 hover:bg-slate-600 flex items-center"
              >
                <Plus className="h-3 w-3 mr-1" />
                New Tag
              </button>
            </div>

            {showNewTagForm && (
              <div className="bg-slate-700 p-3 rounded space-y-2">
                <input
                  type="text"
                  placeholder="Tag name"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  className="w-full bg-slate-600 border border-slate-500 rounded p-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
                <div className="flex space-x-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setNewTagColor(color)}
                      className={`w-6 h-6 rounded-full ${color} ${
                        newTagColor === color ? 'ring-2 ring-white' : ''
                      }`}
                    />
                  ))}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleCreateTag}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-1 px-3 rounded text-sm"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowNewTagForm(false)}
                    className="flex-1 bg-slate-600 hover:bg-slate-500 text-white py-1 px-3 rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
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
                onChange={(e) => !settings.lockStake && setStake(e.target.value)}
                disabled={settings.lockStake}
                className={`flex-1 bg-slate-700 border border-slate-600 border-l-0 rounded-r p-3 text-white focus:outline-none focus:border-emerald-500 ${
                  settings.lockStake ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                placeholder="0.00"
              />
            </div>
            {settings.lockStake && (
              <p className="text-xs text-gray-500 mt-1">Stake is locked in settings</p>
            )}
          </div>
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
            Log Bet
          </button>
        </div>
      </div>
    </div>
  );
};