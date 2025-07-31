import React, { useState } from 'react';
import { X, ChevronDown, Search, ChevronsUpDown } from 'lucide-react';
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

  { id: '1', name: '7k.bet', color: 'bg-emerald-500' },
  { id: '2', name: 'Betano', color: 'bg-blue-500' },
  { id: '3', name: 'Pinnacle', color: 'bg-purple-500' },
  { id: '4', name: 'Bet365', color: 'bg-yellow-500' },
  { id: '5', name: 'James', color: 'bg-red-500' },
  { id: '6', name: 'Joao', color: 'bg-green-500' },
  { id: '7', name: 'Pedro', color: 'bg-orange-500' },
  { id: '8', name: 'Betbra', color: 'bg-pink-500' },
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
      description = line.team ? `${line.team}` : line.description;
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
    } else if (line.type === 'total') {
      return line.description;
    } else {
      return line.team || match.homeTeam;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        role="dialog" 
        aria-describedby="radix-rri" 
        aria-labelledby="radix-rrh" 
        data-state="open" 
        className="fixed z-50 grid gap-4 border border-neutral-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 dark:border-neutral-800 dark:bg-neutral-950 sm:rounded-lg left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] max-w-lg w-[400px]" 
        tabIndex={-1} 
        style={{ pointerEvents: 'auto' }}
      >
        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
          <h2 id="radix-rrh" className="text-lg font-semibold leading-none tracking-tight">Log bet</h2>
        </div>
        
        <div className="max-sm:overflow-auto max-sm:px-4">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Match Selection */}
            <div className="space-y-2">
              <button 
                className="items-center whitespace-nowrap rounded-md text-sm ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300 flex shrink-0 w-full justify-between font-normal border border-neutral-200 bg-white hover:bg-neutral-100 hover:text-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-950 dark:hover:text-neutral-50 data-[state=open]:ring-2 data-[state=open]:ring-neutral-300 data-[state=open]:ring-offset-2 data-[state=open]:ring-offset-neutral-950 max-sm:text-base h-10 px-4 py-2 sm:max-w-[350px]" 
                role="combobox" 
                aria-expanded="false" 
                type="button" 
                aria-haspopup="dialog" 
                data-state="closed"
              >
                <span className="max-w-[90%] truncate text-left">{match.homeTeam} vs {match.awayTeam} [Pre-match]</span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </button>
            </div>

            {/* Period Selection */}
            <div className="space-y-2">
              <button 
                type="button" 
                role="combobox" 
                aria-expanded="false" 
                aria-autocomplete="none" 
                dir="ltr" 
                data-state="closed" 
                className="flex h-10 w-full items-center justify-between rounded-md border border-neutral-200 bg-white px-4 py-2 text-base ring-offset-white focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:focus:ring-neutral-300 dark:data-[placeholder]:text-neutral-400 sm:text-sm [&>span]:line-clamp-1"
              >
                <span style={{ pointerEvents: 'none' }}>Match</span>
                <ChevronDown className="h-4 w-4 opacity-50" aria-hidden="true" />
              </button>
              <select aria-hidden="true" tabIndex={-1} style={{ position: 'absolute', border: '0px', width: '1px', height: '1px', padding: '0px', margin: '-1px', overflow: 'hidden', clip: 'rect(0px, 0px, 0px, 0px)', whiteSpace: 'nowrap', overflowWrap: 'normal' }}>
                <option value="num_0" selected>Match</option>
                <option value="num_1">1st Half</option>
              </select>
            </div>

            {/* Market Selection */}
            <div className="space-y-2">
              <button 
                type="button" 
                role="combobox" 
                aria-expanded="false" 
                aria-autocomplete="none" 
                dir="ltr" 
                data-state="closed" 
                className="flex h-10 w-full items-center justify-between rounded-md border border-neutral-200 bg-white px-4 py-2 text-base ring-offset-white focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:focus:ring-neutral-300 dark:data-[placeholder]:text-neutral-400 sm:text-sm [&>span]:line-clamp-1"
              >
                <span style={{ pointerEvents: 'none' }}>{market}</span>
                <ChevronDown className="h-4 w-4 opacity-50" aria-hidden="true" />
              </button>
              <select aria-hidden="true" tabIndex={-1} style={{ position: 'absolute', border: '0px', width: '1px', height: '1px', padding: '0px', margin: '-1px', overflow: 'hidden', clip: 'rect(0px, 0px, 0px, 0px)', whiteSpace: 'nowrap', overflowWrap: 'normal' }}>
                <option value="MONEY_LINE_3_WAY">Moneyline (3-way)</option>
                <option value="SPREAD">Spreads</option>
                <option value="TOTAL">Totals</option>
              </select>
            </div>

            {/* Outcome Selection */}
            <div className="space-y-2">
              <button 
                type="button" 
                role="combobox" 
                aria-expanded="false" 
                aria-autocomplete="none" 
                dir="ltr" 
                data-state="closed" 
                className="flex h-10 w-full items-center justify-between rounded-md border border-neutral-200 bg-white px-4 py-2 text-base ring-offset-white focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:focus:ring-neutral-300 dark:data-[placeholder]:text-neutral-400 sm:text-sm [&>span]:line-clamp-1"
              >
                <span style={{ pointerEvents: 'none' }}>{getOutcomeText()}</span>
                <ChevronDown className="h-4 w-4 opacity-50" aria-hidden="true" />
              </button>
            </div>

            {/* Divider and Odds/Stake/EV section */}
            <div style={{ opacity: 1, height: 'auto' }}>
              <hr className="border-neutral-800" />
              <div className="mt-4 flex flex-col gap-4">
                <div className="flex items-end gap-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Odds
                    </label>
                    <input 
                      className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300 sm:text-sm sm:file:text-sm" 
                      inputMode="numeric" 
                      pattern="[0-9]*[.,]?[0-9]*" 
                      type="text" 
                      value={odds} 
                      onChange={(e) => setOdds(e.target.value)}
                      name="odds" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Stake
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">R$</span>
                      <input 
                        className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300 sm:text-sm sm:file:text-sm pl-11" 
                        inputMode="decimal" 
                        pattern="[0-9]*[.,]?[0-9]{0,2}" 
                        type="text" 
                        value={stake} 
                        onChange={(e) => !settings.lockStake && setStake(e.target.value)}
                        disabled={settings.lockStake}
                      />
                    </div>
                  </div>
                </div>

                {/* Tags Selection */}
                <div className="space-y-2 relative">
                  <button 
                    className="items-center whitespace-nowrap rounded-md text-sm ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300 flex shrink-0 w-full justify-between font-normal border border-neutral-200 bg-white hover:bg-neutral-100 hover:text-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-950 dark:hover:text-neutral-50 data-[state=open]:ring-2 data-[state=open]:ring-neutral-300 data-[state=open]:ring-offset-2 data-[state=open]:ring-offset-neutral-950 max-sm:text-base h-10 px-4 py-[0.4375rem] [&>span]:line-clamp-1" 
                    role="combobox" 
                    type="button" 
                    aria-haspopup="dialog" 
                    aria-expanded={showTagsDropdown ? "true" : "false"}
                    data-state={showTagsDropdown ? "open" : "closed"}
                    onClick={() => setShowTagsDropdown(!showTagsDropdown)}
                  >
                    <div className="mx-auto flex w-full items-center justify-between">
                      <span className="text-base opacity-50 sm:text-sm">
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
                    <div className="absolute bottom-full left-0 right-0 z-10 mb-1 bg-neutral-950 border border-neutral-800 rounded-md shadow-lg">
                      <div className="p-3">
                        <div className="relative mb-3">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
                          <input
                            type="text"
                            placeholder="Search…"
                            value={tagSearch}
                            onChange={(e) => setTagSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-transparent border-b border-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-500"
                          />
                        </div>
                        
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          <label className="flex items-center space-x-3 text-white hover:text-neutral-300 cursor-pointer py-1">
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
                              className="w-4 h-4 rounded border-neutral-600 bg-transparent"
                            />
                            <span>(Select All)</span>
                          </label>
                          
                          {filteredTags.map((tag) => (
                            <label key={tag.id} className="flex items-center space-x-3 text-white hover:text-neutral-300 cursor-pointer py-1">
                              <input
                                type="checkbox"
                                checked={selectedTags.includes(tag.id)}
                                onChange={() => toggleTag(tag.id)}
                                className="w-4 h-4 rounded border-neutral-600 bg-transparent"
                              />
                              <span>{tag.name}</span>
                            </label>
                          ))}
                        </div>
                        
                        <div className="flex justify-between mt-3 pt-3 border-t border-neutral-800">
                          <button
                            type="button"
                            onClick={() => setShowTagsDropdown(false)}
                            className="w-full bg-neutral-800 hover:bg-neutral-700 text-white py-2 px-4 rounded text-sm"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <button 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300 bg-neutral-100 text-neutral-900 dark:text-neutral-50 hover:bg-neutral-100/80 dark:bg-neutral-800 dark:hover:bg-neutral-800/80 h-10 px-4 py-2 max-sm:text-base" 
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300 bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90 h-10 px-4 py-2 max-sm:text-base" 
                type="submit" 
                disabled={!stake || !odds}
              >
                Log bet
              </button>
            </div>
          </form>
        </div>

        {/* Close Button */}
        <button 
          type="button" 
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-neutral-100 data-[state=open]:text-neutral-500 dark:ring-offset-neutral-950 dark:focus:ring-neutral-300 dark:data-[state=open]:bg-neutral-800 dark:data-[state=open]:text-neutral-400"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  );
};