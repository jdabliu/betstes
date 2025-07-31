import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, ChevronsUpDown } from 'lucide-react';

interface LogBetModalProps {
  trigger?: React.ReactNode;
}

export default function LogBetModal({ trigger }: LogBetModalProps) {
  const [open, setOpen] = useState(false);
  const [matchSelection, setMatchSelection] = useState('atletico-vs-gualaceo');
  const [matchType, setMatchType] = useState('match');
  const [betCategory, setBetCategory] = useState('spreads');
  const [specificBet, setSpecificBet] = useState('home_-1.25');
  const [odds, setOdds] = useState('');
  const [stake, setStake] = useState('');
  const [tags, setTags] = useState('');

  const calculateEV = () => {
    if (!odds || !stake) return 'N/A';
    // Simplified EV calculation - would need real logic for betting EV
    return 'N/A';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Bet logged:', {
      matchSelection,
      matchType,
      betCategory,
      specificBet,
      odds,
      stake,
      tags,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">Log Bet</Button>
        )}
      </DialogTrigger>
      <DialogContent className="fixed z-50 grid gap-4 border border-neutral-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 dark:border-neutral-800 dark:bg-neutral-950 sm:rounded-lg left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] max-w-lg w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold leading-none tracking-tight">
            Log bet
          </DialogTitle>
        </DialogHeader>
        
        <div className="max-sm:overflow-auto max-sm:px-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Match Selection */}
            <div className="space-y-2">
              <Select value={matchSelection} onValueChange={setMatchSelection}>
                <SelectTrigger className="items-center whitespace-nowrap rounded-md text-sm ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300 flex shrink-0 w-full justify-between font-normal border border-neutral-200 bg-white hover:bg-neutral-100 hover:text-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-950 dark:hover:text-neutral-50 data-[state=open]:ring-2 data-[state=open]:ring-neutral-300 data-[state=open]:ring-offset-2 data-[state=open]:ring-offset-neutral-950 max-sm:text-base h-10 px-4 py-2 sm:max-w-[350px]">
                  <SelectValue>
                    <span className="max-w-[90%] truncate text-left">
                      Atletico Vinotinto vs Gualaceo [Pre-match]
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="atletico-vs-gualaceo">
                    Atletico Vinotinto vs Gualaceo [Pre-match]
                  </SelectItem>
                  <SelectItem value="other-match">
                    Other Match [Live]  
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Match Type */}
            <div className="space-y-2">
              <Select value={matchType} onValueChange={setMatchType}>
                <SelectTrigger className="flex h-10 w-full items-center justify-between rounded-md border border-neutral-200 bg-white px-4 py-2 text-base ring-offset-white focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:focus:ring-neutral-300 dark:data-[placeholder]:text-neutral-400 sm:text-sm [&>span]:line-clamp-1">
                  <SelectValue placeholder="Match" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">Match</SelectItem>
                  <SelectItem value="first-half">1st Half</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bet Category */}
            <div className="space-y-2">
              <Select value={betCategory} onValueChange={setBetCategory}>
                <SelectTrigger className="flex h-10 w-full items-center justify-between rounded-md border border-neutral-200 bg-white px-4 py-2 text-base ring-offset-white focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:focus:ring-neutral-300 dark:data-[placeholder]:text-neutral-400 sm:text-sm [&>span]:line-clamp-1">
                  <SelectValue placeholder="Spreads" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="money-line">Moneyline (3-way)</SelectItem>
                  <SelectItem value="spreads">Spreads</SelectItem>
                  <SelectItem value="totals">Totals</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Specific Bet */}
            <div className="space-y-2">
              <Select value={specificBet} onValueChange={setSpecificBet}>
                <SelectTrigger className="flex h-10 w-full items-center justify-between rounded-md border border-neutral-200 bg-white px-4 py-2 text-base ring-offset-white focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:focus:ring-neutral-300 dark:data-[placeholder]:text-neutral-400 sm:text-sm [&>span]:line-clamp-1">
                  <SelectValue placeholder="-1.25 Atletico Vinotinto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home_0.0">0 Atletico Vinotinto</SelectItem>
                  <SelectItem value="away_0.0">0 Gualaceo</SelectItem>
                  <SelectItem value="home_-0.25">-0.25 Atletico Vinotinto</SelectItem>
                  <SelectItem value="away_0.25">+0.25 Gualaceo</SelectItem>
                  <SelectItem value="home_0.25">+0.25 Atletico Vinotinto</SelectItem>
                  <SelectItem value="away_-0.25">-0.25 Gualaceo</SelectItem>
                  <SelectItem value="home_-0.5">-0.5 Atletico Vinotinto</SelectItem>
                  <SelectItem value="away_0.5">+0.5 Gualaceo</SelectItem>
                  <SelectItem value="home_0.5">+0.5 Atletico Vinotinto</SelectItem>
                  <SelectItem value="away_-0.5">-0.5 Gualaceo</SelectItem>
                  <SelectItem value="home_-0.75">-0.75 Atletico Vinotinto</SelectItem>
                  <SelectItem value="away_0.75">+0.75 Gualaceo</SelectItem>
                  <SelectItem value="home_0.75">+0.75 Atletico Vinotinto</SelectItem>
                  <SelectItem value="away_-0.75">-0.75 Gualaceo</SelectItem>
                  <SelectItem value="home_-1.0">-1 Atletico Vinotinto</SelectItem>
                  <SelectItem value="away_1.0">+1 Gualaceo</SelectItem>
                  <SelectItem value="home_-1.25">-1.25 Atletico Vinotinto</SelectItem>
                  <SelectItem value="away_1.25">+1.25 Gualaceo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div style={{ opacity: 1, height: 'auto' }}>
              <Separator className="border-neutral-800" />
              
              <div className="mt-4 flex flex-col gap-4">
                {/* Odds, Stake, and EV Row */}
                <div className="flex items-end gap-2">
                  <div className="space-y-2">
                    <Label 
                      htmlFor="odds" 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Odds
                    </Label>
                    <Input
                      id="odds"
                      type="text"
                      value={odds}
                      onChange={(e) => setOdds(e.target.value)}
                      inputMode="numeric"
                      pattern="[0-9]*[.,]?[0-9]*"
                      className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300 sm:text-sm sm:file:text-sm"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label 
                      htmlFor="stake"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Stake
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                        R$
                      </span>
                      <Input
                        id="stake"
                        type="text"
                        value={stake}
                        onChange={(e) => setStake(e.target.value)}
                        inputMode="decimal"
                        pattern="[0-9]*[.,]?[0-9]{0,2}"
                        className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300 sm:text-sm sm:file:text-sm pl-11"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      EV
                    </Label>
                    <div className="flex h-10 w-24 items-center justify-center rounded px-3 border-neutral-300 bg-neutral-400/10 text-neutral-300">
                      <p className="truncate font-mono text-sm">{calculateEV()}</p>
                    </div>
                  </div>
                </div>

                {/* Tags Selection */}
                <div className="space-y-2">
                  <Select value={tags} onValueChange={setTags}>
                    <SelectTrigger className="items-center whitespace-nowrap rounded-md text-sm ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300 flex shrink-0 w-full justify-between font-normal border border-neutral-200 bg-white hover:bg-neutral-100 hover:text-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-950 dark:hover:text-neutral-50 data-[state=open]:ring-2 data-[state=open]:ring-neutral-300 data-[state=open]:ring-offset-2 data-[state=open]:ring-offset-neutral-950 max-sm:text-base h-10 px-4 py-[0.4375rem] [&>span]:line-clamp-1">
                      <div className="mx-auto flex w-full items-center justify-between">
                        <span className="text-base opacity-50 sm:text-sm">
                          Select tags (optional)
                        </span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high-confidence">High Confidence</SelectItem>
                      <SelectItem value="value-bet">Value Bet</SelectItem>
                      <SelectItem value="arbitrage">Arbitrage</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpen(false)}
                className="max-sm:text-base"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!odds || !stake}
                className="max-sm:text-base"
              >
                Log bet
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}