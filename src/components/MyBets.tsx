import React from 'react';
import { Bet, Stats } from '../types';
import { TrendingUp, TrendingDown, Download, Search, Filter, Tag, BarChart3, Settings } from 'lucide-react';
import { useTags } from '../hooks/useTags';

interface MyBetsProps {
  bets: Bet[];
  stats: Stats;
}

export default function MyBets({ bets, stats }: MyBetsProps) {
  const { tags } = useTags();
  const [selectedFilter, setSelectedFilter] = React.useState('all');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showSettings, setShowSettings] = React.useState(false);

  // Calculate additional stats
  const totalProfit = bets.reduce((sum, bet) => sum + (bet.profit || 0), 0);
  const totalBets = bets.length;
  const totalTurnover = bets.reduce((sum, bet) => sum + bet.stake, 0);
  const yield_ = totalTurnover > 0 ? (totalProfit / totalTurnover) * 100 : 0;
  const roi = totalTurnover > 0 ? (totalProfit / totalTurnover) * 100 : 0;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header Stats */}
      <div className="bg-slate-800 border-b border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">My Bets</h2>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors"
          >
            <Settings className="h-5 w-5 text-gray-400" />
          </button>
        </div>
        <div className="grid grid-cols-5 gap-6">
          <div className="bg-slate-900 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Profit</div>
            <div className="text-2xl font-bold text-emerald-400">R${totalProfit.toFixed(2)}</div>
            <div className="text-xs text-gray-500">+R$1,515.33 in the last 30 days</div>
          </div>
          <div className="bg-slate-900 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Bets</div>
            <div className="text-2xl font-bold">{totalBets}</div>
            <div className="text-xs text-gray-500">+73 in the last 30 days</div>
          </div>
          <div className="bg-slate-900 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Turnover</div>
            <div className="text-2xl font-bold">R${totalTurnover.toFixed(2)}</div>
            <div className="text-xs text-gray-500">+R$26,165.33 in the last 30 days</div>
          </div>
          <div className="bg-slate-900 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Yield</div>
            <div className="text-2xl font-bold text-emerald-400">{yield_.toFixed(2)}%</div>
            <div className="text-xs text-gray-500">5.73% in the last 30 days</div>
          </div>
          <div className="bg-slate-900 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">ROI</div>
            <div className="text-2xl font-bold text-emerald-400">{roi.toFixed(0)}%</div>
            <div className="text-xs text-gray-500">22.0% in the last 30 days</div>
          </div>
        </div>
      </div>

      {/* Profit Chart */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Profit and Bets</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-sm text-gray-400">Actual Profit</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-300 rounded-full"></div>
              <span className="text-sm text-gray-400">Expected Profit (CLV)</span>
            </div>
            <button className="text-gray-400 hover:text-white">
              <BarChart3 className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-4 h-64 relative">
          {/* Y-axis labels */}
          <div className="absolute left-2 top-4 bottom-4 flex flex-col justify-between text-xs text-gray-500">
            <span>R$1,500</span>
            <span>R$1,000</span>
            <span>R$500</span>
            <span>R$0</span>
            <span>R$-500</span>
          </div>
          
          {/* Chart area */}
          <div className="ml-12 mr-4 h-full relative">
            <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.3"/>
                </linearGradient>
              </defs>
              
              {/* Grid lines */}
              <g stroke="#374151" strokeWidth="0.5" opacity="0.3">
                <line x1="0" y1="40" x2="800" y2="40"/>
                <line x1="0" y1="80" x2="800" y2="80"/>
                <line x1="0" y1="120" x2="800" y2="120"/>
                <line x1="0" y1="160" x2="800" y2="160"/>
              </g>
              
              {/* Main profit area */}
              <path
                d="M 0,120 L 100,115 L 200,110 L 300,105 L 400,100 L 500,95 L 600,90 L 700,85 L 800,80 L 800,200 L 0,200 Z"
                fill="url(#areaGradient)"
              />
              
              {/* Main profit line */}
              <path
                d="M 0,120 L 100,115 L 200,110 L 300,105 L 400,100 L 500,95 L 600,90 L 700,85 L 800,80"
                fill="none"
                stroke="#059669"
                strokeWidth="2"
              />
              
              {/* Expected profit line */}
              <path
                d="M 0,115 L 100,110 L 200,105 L 300,100 L 400,95 L 500,90 L 600,85 L 700,80 L 800,75"
                fill="none"
                stroke="#047857"
                strokeWidth="1.5"
                opacity="0.8"
              />
            </svg>
          </div>
          
          {/* X-axis labels */}
          <div className="absolute bottom-2 left-12 right-4 flex justify-between text-xs text-gray-500">
            <span>Oct 19</span>
            <span>Oct 21</span>
            <span>Oct 23</span>
            <span>Oct 25</span>
            <span>Oct 27</span>
            <span>Oct 29</span>
            <span>Oct 31</span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button className="flex items-center space-x-2 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg hover:bg-slate-700">
              <Filter className="h-4 w-4" />
              <span>Sport</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg hover:bg-slate-700">
              <span>Market</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg hover:bg-slate-700">
              <span>Competition</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg hover:bg-slate-700">
              <Tag className="h-4 w-4" />
              <span>Tags</span>
            </button>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg">
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Bets Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-800 border-b border-slate-700">
            <tr className="text-left text-sm text-gray-400">
              <th className="p-3 font-medium">Event</th>
              <th className="p-3 font-medium">Start time</th>
              <th className="p-3 font-medium">Bet placed</th>
              <th className="p-3 font-medium">Type</th>
              <th className="p-3 font-medium">Sport</th>
              <th className="p-3 font-medium">Competition</th>
              <th className="p-3 font-medium">Market</th>
              <th className="p-3 font-medium">Outcome</th>
              <th className="p-3 font-medium">Bookmaker</th>
              <th className="p-3 font-medium">Tags</th>
              <th className="p-3 font-medium">Stake</th>
              <th className="p-3 font-medium">Odds</th>
              <th className="p-3 font-medium">CLV</th>
              <th className="p-3 font-medium">Opening</th>
              <th className="p-3 font-medium">Close</th>
              <th className="p-3 font-medium">Result</th>
              <th className="p-3 font-medium">Profit</th>
            </tr>
          </thead>
          <tbody>
            {bets.map((bet, index) => (
              <tr key={bet.id} className="border-b border-slate-700 hover:bg-slate-800/50 text-sm">
                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-white">{bet.homeTeam} vs {bet.awayTeam}</span>
                  </div>
                </td>
                <td className="p-3 text-gray-300">{bet.startTime}</td>
                <td className="p-3 text-gray-300">{bet.betPlaced}</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                    Pre-match
                  </span>
                </td>
                <td className="p-3 text-gray-300">{bet.sport}</td>
                <td className="p-3 text-gray-300">{bet.competition}</td>
                <td className="p-3 text-gray-300">{bet.market}</td>
                <td className="p-3 text-gray-300">{bet.outcome}</td>
                <td className="p-3 text-gray-300">{bet.bookmaker || 'Bet365'}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {bet.tags?.map(tagId => {
                      const tag = tags.find(t => t.id === tagId);
                      return tag ? (
                        <span
                          key={tagId}
                          className={`px-2 py-1 rounded-full text-xs ${tag.color} text-white`}
                        >
                          {tag.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </td>
                <td className="p-3 text-white">R${bet.stake.toFixed(2)}</td>
                <td className="p-3 text-white">{bet.odds.toFixed(3)}</td>
                <td className="p-3">
                  <span className={bet.clv >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                    {bet.clv >= 0 ? '+' : ''}{bet.clv.toFixed(1)}%
                  </span>
                </td>
                <td className="p-3 text-gray-300">
                  <div className="text-xs">
                    <div>AVG: {bet.opening.avg.toFixed(3)}</div>
                    <div>P: {bet.opening.p.toFixed(3)}</div>
                    <div>V: {bet.opening.v.toFixed(2)}%</div>
                  </div>
                </td>
                <td className="p-3 text-gray-300">
                  <div className="text-xs">
                    <div>AVG: {bet.close.avg.toFixed(3)}</div>
                    <div>P: {bet.close.p.toFixed(3)}</div>
                    <div>V: {bet.close.v.toFixed(2)}%</div>
                  </div>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 text-xs rounded ${
                    bet.status === 'won' ? 'bg-emerald-600 text-white' :
                    bet.status === 'lost' ? 'bg-red-600 text-white' :
                    'bg-yellow-600 text-white'
                  }`}>
                    {bet.status === 'pending' ? 'PENDING' : bet.result?.toUpperCase()}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`font-medium ${
                    (bet.profit || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {bet.profit !== undefined ? 
                      `${bet.profit >= 0 ? '+' : ''}R$${bet.profit.toFixed(2)}` : 
                      '-'
                    }
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-slate-700 flex items-center justify-between">
        <div className="text-sm text-gray-400">
          1 to 20 of {bets.length}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Page 1 of {Math.ceil(bets.length / 20)}</span>
          <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm">
            &lt;
          </button>
          <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm">
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}