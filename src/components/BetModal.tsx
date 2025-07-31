import React, { useState } from 'react';
import { X, ChevronDown, Search } from 'lucide-react';
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
  'bet365',
  'Pinnacle',
  'Bet7k',
  'Cassino'
];

export const BetModal: React.FC<BetModalProps> = ({ isOpen, onClose, line, match, onSubmit }) => {
  const { tags, addTag } = useTags();
  const { settings } = useSettings();
  const [odds, setOdds] = useState(line?.odds.toFixed(2) || '');
  const [stake, setStake] = useState(settings.lockStake ? settings.defaultStake.toString() : '');
  const [selectedBookmaker, setSelectedBookmaker] = useState('bet365');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [period, setPeriod] = useState('Match');
  const [market, setMarket] = useState('Spreads');
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);
  const [tagSearch, setTagSearch] = useState('');

  React.useEffect(() => {
    if (line) {
      setOdds(line.odds.toFixed(2));
      if (line.type === 'handicap') {
        setMarket('Spreads');
      } else if (line.type === 'total') {
        setMarket('Totals');
      } else {
        setMarket('Moneyline (3-way)');
      }
    }
    if (settings.lockStake) {
      setStake(settings.defaultStake.toString());
    }
  }, [line, settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!line || !match || !stake || !odds) return;

    const numOdds = parseFloat(odds);
    const numStake = parseFloat(stake);
    const potentialReturn = numOdds * numStake;

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
      market,
      outcome: description,
      period,
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
    setShowTagsDropdown(false);
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(tagSearch.toLowerCase())
  );

  if (!isOpen || !line || !match) return null;

  const getOutcomeText = () => {
    if (line.type === 'handicap') {
      const team = line.team === match.homeTeam ? match.homeTeam : match.awayTeam;
      return `${line.description} ${team}`;
    }
    return line.description;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="fixed z-50 grid gap-4 border border-neutral-800 bg-neutral-950 p-6 shadow-lg duration-200 sm:rounded-lg left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] max-w-lg w-[400px]">
        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
          <h2 className="text-lg font-semibold leading-none tracking-tight text-white">Log bet</h2>
        </div>
        
        <div className="max-sm:overflow-auto max-sm:px-4">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Match Selection */}
            <div className="space-y-2">
              <button
                type="button"
                className="flex shrink-0 w-full justify-center items-center font-normal border border-neutral-800 bg-neutral-950 hover:bg-neutral-900 text-white h-10 px-4 py-2 rounded-md transition-colors"
                disabled
              >
                <span className="text-center flex-1">
                  {match.homeTeam} vs {match.awayTeam} [Pre-match]
                </span>
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </button>
            </div>

            {/* Period Selection */}
            <div className="space-y-2">
              <button
                type="button"
                className="flex h-10 w-full items-center justify-center rounded-md border border-neutral-800 bg-neutral-950 px-4 py-2 text-white hover:bg-neutral-900 transition-colors"
              >
                <span className="flex-1 text-center">{period}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </button>
            </div>

            {/* Market Selection */}
            <div className="space-y-2">
              <button
                type="button"
                className="flex h-10 w-full items-center justify-center rounded-md border border-neutral-800 bg-neutral-950 px-4 py-2 text-white hover:bg-neutral-900 transition-colors"
              >
                <span className="flex-1 text-center">{market}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </button>
            </div>

            {/* Outcome Selection */}
            <div className="space-y-2">
              <button
                type="button"
                className="flex h-10 w-full items-center justify-center rounded-md border border-neutral-800 bg-neutral-950 px-4 py-2 text-white hover:bg-neutral-900 transition-colors"
                disabled
              >
                <span className="flex-1 text-center">{getOutcomeText()}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </button>
            </div>

            <hr className="border-neutral-800" />

            {/* Odds and Stake section */}
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex items-end gap-2">
                <div className="space-y-2 flex-1">
                  <label className="text-sm font-medium leading-none text-white">
                    Odds
                  </label>
                  <input
                    type="text"
                    value={odds}
                    onChange={(e) => setOdds(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-white placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
                    inputMode="numeric"
                    pattern="[0-9]*[.,]?[0-9]*"
                  />
                </div>
                
                <div className="space-y-2 flex-1">
                  <label className="text-sm font-medium leading-none text-white">
                    Stake
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">$</span>
                    <input
                      type="text"
                      value={stake}
                      onChange={(e) => !settings.lockStake && setStake(e.target.value)}
                      disabled={settings.lockStake}
                      className={`flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-white placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 pl-8 ${
                        settings.lockStake ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      inputMode="decimal"
                      pattern="[0-9]*[.,]?[0-9]{0,2}"
                    />
                  </div>
                </div>
              </div>

              {/* Tags Selection */}
              <div className="space-y-2 relative">
                <button
                  type="button"
                  onClick={() => setShowTagsDropdown(!showTagsDropdown)}
                  className="flex shrink-0 w-full justify-center items-center font-normal border border-neutral-800 bg-neutral-950 hover:bg-neutral-900 text-white h-10 px-4 py-2 rounded-md transition-colors"
                >
                  <div className="flex w-full items-center justify-center">
                    <span className="text-neutral-400 flex-1 text-center">
                      {selectedTags.length > 0 
                        ? `${selectedTags.length} tag(s) selected`
                        : 'Select tags (optional)'
                      }
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4 cursor-pointer opacity-50" />
                  </div>
                </button>

                {/* Tags Dropdown */}
                {showTagsDropdown && (
                  <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-neutral-950 border border-neutral-800 rounded-md shadow-lg">
                    <div className="p-3">
                      <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
                        <input
                          type="text"
                          placeholder="Search..."
                          value={tagSearch}
                          onChange={(e) => setTagSearch(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-700 rounded text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-500"
                        />
                      </div>
                      
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        <label className="flex items-center space-x-2 text-neutral-400 hover:text-white cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedTags.length === tags.length}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedTags(tags.map(tag => tag.id));
                              } else {
                                setSelectedTags([]);
                              }
                            }}
                            className="rounded"
                          />
                          <span>(Select All)</span>
                        </label>
                        
                        {filteredTags.map((tag) => (
                          <label key={tag.id} className="flex items-center space-x-2 text-white hover:text-neutral-300 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedTags.includes(tag.id)}
                              onChange={() => toggleTag(tag.id)}
                              className="rounded"
                            />
                            <span>{tag.name}</span>
                          </label>
                        ))}
                      </div>
                      
                      <div className="flex justify-between mt-3 pt-3 border-t border-neutral-800">
                        <button
                          type="button"
                          onClick={() => setSelectedTags([])}
                          className="text-neutral-400 hover:text-white text-sm"
                        >
                          Clear
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowTagsDropdown(false)}
                          className="text-neutral-400 hover:text-white text-sm"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Selected Bookmaker Display */}
              <div className="flex items-center justify-center space-x-2 py-2">
                <span className="text-white bg-neutral-800 px-3 py-1 rounded-full text-sm flex items-center">
                  {selectedBookmaker}
                  <button
                    type="button"
                    onClick={() => setSelectedBookmaker('bet365')}
                    className="ml-2 text-neutral-400 hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
                <ChevronDown className="h-4 w-4 text-neutral-400" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-neutral-800 text-neutral-50 hover:bg-neutral-700 h-10 px-4 py-2 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!stake || !odds}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-neutral-50 text-neutral-900 hover:bg-neutral-200 h-10 px-4 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Log bet
              </button>
            </div>
          </form>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 text-white hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:ring-offset-2 focus:ring-offset-neutral-950"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  );
};