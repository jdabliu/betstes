import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
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

export const BetModal: React.FC<BetModalProps> = ({ isOpen, onClose, line, match, onSubmit }) => {
  const { tags, addTag } = useTags();
  const { settings } = useSettings();
  const [odds, setOdds] = useState(line?.odds.toFixed(2) || '');
  const [stake, setStake] = useState(settings.lockStake ? settings.defaultStake.toString() : '');
  const [selectedBookmaker, setSelectedBookmaker] = useState('Bet365');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [period, setPeriod] = useState('Match');
  const [market, setMarket] = useState('Spreads');

  React.useEffect(() => {
    if (line) {
      setOdds(line.odds.toFixed(2));
      // Set market based on line type
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
  };

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
      <div 
        className="fixed z-50 grid gap-4 border border-neutral-200 bg-white p-6 shadow-lg duration-200 dark:border-neutral-800 dark:bg-neutral-950 sm:rounded-lg left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] max-w-lg w-[400px]"
        role="dialog"
      >
        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
          <h2 className="text-lg font-semibold leading-none tracking-tight text-white">Log bet</h2>
        </div>
        
        <div className="max-sm:overflow-auto max-sm:px-4">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Match Selection */}
            <div className="space-y-2">
              <button
                type="button"
                className="items-center whitespace-nowrap rounded-md text-sm ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300 flex shrink-0 w-full justify-between font-normal border border-neutral-200 bg-white hover:bg-neutral-100 hover:text-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-950 dark:hover:text-neutral-50 h-10 px-4 py-2 sm:max-w-[350px]"
                disabled
              >
                <span className="max-w-[90%] truncate text-left text-white">
                  {match.homeTeam} vs {match.awayTeam} [Pre-match]
                </span>
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </button>
            </div>

            {/* Period Selection */}
            <div className="space-y-2">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-neutral-200 bg-white px-4 py-2 text-base ring-offset-white focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:focus:ring-neutral-300 sm:text-sm text-white"
              >
                <option value="Match">Match</option>
                <option value="1st Half">1st Half</option>
              </select>
            </div>

            {/* Market Selection */}
            <div className="space-y-2">
              <select
                value={market}
                onChange={(e) => setMarket(e.target.value)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-neutral-200 bg-white px-4 py-2 text-base ring-offset-white focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:focus:ring-neutral-300 sm:text-sm text-white"
              >
                <option value="Moneyline (3-way)">Moneyline (3-way)</option>
                <option value="Spreads">Spreads</option>
                <option value="Totals">Totals</option>
              </select>
            </div>

            {/* Outcome Selection */}
            <div className="space-y-2">
              <button
                type="button"
                className="flex h-10 w-full items-center justify-between rounded-md border border-neutral-200 bg-white px-4 py-2 text-base ring-offset-white focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:focus:ring-neutral-300 sm:text-sm text-white"
                disabled
              >
                <span>{getOutcomeText()}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </button>
            </div>

            <hr className="border-neutral-800" />

            {/* Odds and Stake section */}
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex items-end gap-2">
                <div className="space-y-2 flex-1">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white">
                    Odds
                  </label>
                  <input
                    type="text"
                    value={odds}
                    onChange={(e) => setOdds(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300 sm:text-sm text-white"
                    inputMode="numeric"
                    pattern="[0-9]*[.,]?[0-9]*"
                  />
                </div>
                
                <div className="space-y-2 flex-1">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white">
                    Stake
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">R$</span>
                    <input
                      type="text"
                      value={stake}
                      onChange={(e) => !settings.lockStake && setStake(e.target.value)}
                      disabled={settings.lockStake}
                      className={`flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300 sm:text-sm pl-11 text-white ${
                        settings.lockStake ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      inputMode="decimal"
                      pattern="[0-9]*[.,]?[0-9]{0,2}"
                    />
                  </div>
                </div>
              </div>

              {/* Tags Selection */}
              <div className="space-y-2">
                <button
                  type="button"
                  className="items-center whitespace-nowrap rounded-md text-sm ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300 flex shrink-0 w-full justify-between font-normal border border-neutral-200 bg-white hover:bg-neutral-100 hover:text-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-950 dark:hover:text-neutral-50 h-10 px-4 py-[0.4375rem]"
                >
                  <div className="mx-auto flex w-full items-center justify-between">
                    <span className="text-base opacity-50 sm:text-sm text-white">
                      Select tags (optional)
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4 cursor-pointer opacity-50" />
                  </div>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300 bg-neutral-100 text-neutral-900 dark:text-neutral-50 hover:bg-neutral-100/80 dark:bg-neutral-800 dark:hover:bg-neutral-800/80 h-10 px-4 py-2 max-sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!stake || !odds}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300 bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90 h-10 px-4 py-2 max-sm:text-base"
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
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:pointer-events-none dark:ring-offset-neutral-950 dark:focus:ring-neutral-300"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  );
};