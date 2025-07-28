export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  league: string;
  sport: string;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
}

export interface BetLine {
  id: string;
  type: string;
  description: string;
  team?: string;
  value?: string;
  odds: number;
}

export interface MatchDetails extends Match {
  lines: BetLine[];
}

export interface Bet {
  id: string;
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  betPlaced: string;
  betType: string;
  description: string;
  sport: string;
  competition: string;
  market: string;
  outcome: string;
  period: string;
  odds: number;
  stake: number;
  potentialReturn: number;
  loggedEv: number;
  currentEv: number;
  clv: number;
  ev: number;
  status: 'pending' | 'won' | 'lost' | 'void';
  date: string;
  bookmaker?: string;
  tags?: string[];
  result?: string;
  profit?: number;
  opening: {
    avg: number;
    p: number;
    v: number;
  };
  close: {
    avg: number;
    p: number;
    v: number;
  };
}

export interface Stats {
  totalProfit: number;
  totalBets: number;
  totalTurnover: number;
  yield: number;
  roi: number;
  winRate: number;
  avgOdds: number;
  avgStake: number;
}