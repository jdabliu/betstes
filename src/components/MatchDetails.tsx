import React from 'react';
import { MatchDetails as MatchDetailsType, BetLine } from '../types';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';

interface MatchDetailsProps {
  match: MatchDetailsType;
  onBack: () => void;
  onBetClick: (line: BetLine) => void;
}

export const MatchDetails: React.FC<MatchDetailsProps> = ({ match, onBack, onBetClick }) => {
  const handicapLines = match.lines.filter(line => line.type === 'handicap');
  const totalLines = match.lines.filter(line => line.type === 'total');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-700 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">
            {match.homeTeam} - {match.awayTeam}
          </h1>
          <p className="text-gray-400">{match.date} - {match.time}</p>
        </div>
      </div>

      {/* Main odds */}
      <div className="bg-emerald-600 rounded-lg p-4">
        <div className="text-center text-white font-bold text-lg mb-4">1X2</div>
        <div className="flex justify-center space-x-4">
          <div className="bg-white/10 rounded-lg p-4 text-center cursor-pointer hover:bg-white/20 transition-colors min-w-[100px]">
            <div className="text-xs text-emerald-100 mt-1">1</div>
            <div className="text-white font-bold text-lg flex items-center justify-center">
              {match.odds.home.toFixed(2)}
              <TrendingUp className="h-4 w-4 ml-1 text-green-300" />
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center cursor-pointer hover:bg-white/20 transition-colors min-w-[100px]">
            <div className="text-white font-bold text-xl">Draw</div>
            <div className="text-xs text-emerald-100 mt-1">N</div>
            <div className="text-white font-bold text-lg flex items-center justify-center">
              {match.odds.draw.toFixed(2)}
              <TrendingDown className="h-4 w-4 ml-1 text-red-300" />
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center cursor-pointer hover:bg-white/20 transition-colors min-w-[100px]">
            <div className="text-xs text-emerald-100 mt-1">2</div>
            <div className="text-white font-bold text-lg flex items-center justify-center">
              {match.odds.away.toFixed(2)}
              <TrendingUp className="h-4 w-4 ml-1 text-green-300" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Handicap */}
        <div className="bg-slate-800 rounded-lg overflow-hidden">
          <div className="bg-emerald-600 text-white p-3 text-center font-bold">
            Handicap
          </div>
          <div className="p-4 space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-400 mb-3">
              <div className="text-center font-medium">HOME</div>
              <div className="text-center font-medium">AWAY</div>
            </div>
            {Array.from({ length: handicapLines.length / 2 }).map((_, i) => {
              const homeLine = handicapLines[i * 2];
              const awayLine = handicapLines[i * 2 + 1];
              return (
                <div key={i} className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onBetClick(homeLine)}
                    className="bg-slate-700 hover:bg-emerald-600 p-3 rounded transition-colors"
                  >
                    <div className="text-gray-400 text-xs">{homeLine.description}</div>
                    <div className="text-white font-bold">{homeLine.odds.toFixed(2)}</div>
                  </button>
                  <button
                    onClick={() => onBetClick(awayLine)}
                    className="bg-slate-700 hover:bg-emerald-600 p-3 rounded transition-colors"
                  >
                    <div className="text-gray-400 text-xs">{awayLine.description}</div>
                    <div className="text-white font-bold">{awayLine.odds.toFixed(2)}</div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Totals */}
        <div className="bg-slate-800 rounded-lg overflow-hidden">
          <div className="bg-emerald-600 text-white p-3 text-center font-bold">
            Totals
          </div>
          <div className="p-4 space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-400 mb-3">
              <div className="text-center font-medium">Over</div>
              <div className="text-center font-medium">Under</div>
            </div>
            {Array.from({ length: totalLines.length / 2 }).map((_, i) => {
              const moreLine = totalLines[i * 2];
              const lessLine = totalLines[i * 2 + 1];
              return (
                <div key={i} className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onBetClick(moreLine)}
                    className="bg-slate-700 hover:bg-emerald-600 p-3 rounded transition-colors"
                  >
                    <div className="text-gray-400 text-xs">{moreLine.description}</div>
                    <div className="text-white font-bold">{moreLine.odds.toFixed(2)}</div>
                  </button>
                  <button
                    onClick={() => onBetClick(lessLine)}
                    className="bg-slate-700 hover:bg-emerald-600 p-3 rounded transition-colors"
                  >
                    <div className="text-gray-400 text-xs">{lessLine.description}</div>
                    <div className="text-white font-bold">{lessLine.odds.toFixed(2)}</div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};