import React from 'react';
import { Bet, Stats } from '../types';
import { mockBets } from '../data/mockData';

export const useBets = () => {
  const [bets, setBets] = React.useState<Bet[]>(mockBets);

  const addBet = (bet: Bet) => {
    setBets(prev => [bet, ...prev]);
  };

  const updateBet = (betId: string, updates: Partial<Bet>) => {
    setBets(prev => prev.map(bet => 
      bet.id === betId ? { ...bet, ...updates } : bet
    ));
  };

  const calculateStats = (): Stats => {
    const totalBets = bets.length;
    const totalStake = bets.reduce((sum, bet) => sum + bet.stake, 0);
    const totalProfit = bets.reduce((sum, bet) => sum + (bet.profit || 0), 0);
    const wonBets = bets.filter(bet => bet.status === 'won').length;
    const avgOdds = bets.reduce((sum, bet) => sum + bet.odds, 0) / (totalBets || 1);
    const avgStake = totalStake / (totalBets || 1);
    
    return {
      totalProfit,
      totalBets,
      totalTurnover: totalStake,
      yield: totalStake > 0 ? (totalProfit / totalStake) * 100 : 0,
      roi: totalStake > 0 ? (totalProfit / totalStake) * 100 : 0,
      winRate: totalBets > 0 ? (wonBets / totalBets) * 100 : 0,
      avgOdds,
      avgStake
    };
  };

  return {
    bets,
    addBet,
    updateBet,
    stats: calculateStats()
  };
};