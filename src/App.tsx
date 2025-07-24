import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MatchList } from './components/MatchList';
import { MatchDetails } from './components/MatchDetails';
import { BetModal } from './components/BetModal';
import MyBets from './components/MyBets';
import { mockMatches, generateMatchDetails } from './data/mockData';
import { useBets } from './hooks/useBets';
import { Match, MatchDetails as MatchDetailsType, BetLine } from './types';

function App() {
  const [currentView, setCurrentView] = useState<'matches' | 'my-bets'>('matches');
  const [selectedSport, setSelectedSport] = useState('futebol');
  const [selectedMatch, setSelectedMatch] = useState<MatchDetailsType | null>(null);
  const [betModalOpen, setBetModalOpen] = useState(false);
  const [selectedBetLine, setSelectedBetLine] = useState<BetLine | null>(null);
  const { bets, addBet, stats } = useBets();

  const handleMatchClick = (match: Match) => {
    const matchDetails = generateMatchDetails(match);
    setSelectedMatch(matchDetails);
  };

  const handleBackToMatches = () => {
    setSelectedMatch(null);
  };

  const handleBetClick = (line: BetLine) => {
    setSelectedBetLine(line);
    setBetModalOpen(true);
  };

  const handleBetSubmit = (bet: any) => {
    addBet(bet);
    setBetModalOpen(false);
    setSelectedBetLine(null);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      
      <div className="flex">
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          {currentView === 'matches' && (
            <>
              {!selectedMatch ? (
                <div className="max-w-4xl mx-auto">
                  <MatchList
                    matches={mockMatches}
                    onMatchClick={handleMatchClick}
                  />
                </div>
              ) : (
                <div className="max-w-6xl mx-auto">
                  <MatchDetails
                    match={selectedMatch}
                    onBack={handleBackToMatches}
                    onBetClick={handleBetClick}
                  />
                </div>
              )}
            </>
          )}
          
          {currentView === 'my-bets' && (
            <MyBets bets={bets} stats={stats} />
          )}
        </main>
      </div>

      <BetModal
        isOpen={betModalOpen}
        onClose={() => setBetModalOpen(false)}
        line={selectedBetLine}
        match={selectedMatch}
        onSubmit={handleBetSubmit}
      />
    </div>
  );
}

export default App;