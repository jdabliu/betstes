import React from 'react';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';

interface SidebarProps {
  selectedSport: string;
  onSportChange: (sport: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ selectedSport, onSportChange }) => {
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
    leagues: true,
    brazil: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const sports = [
    { id: 'futebol', name: 'Futebol', count: 31 },
    { id: 'basquete', name: 'Basquetebol', count: 15 },
    { id: 'tenis', name: 'Tênis', count: 42 },
    { id: 'esports', name: 'E-Sports', count: 8 },
    { id: 'hockey', name: 'Hóquei', count: 12 }
  ];

  const leagues = [
    'Brasileirão',
    'Copa do Brasil',
    'Libertadores',
    'Copa Sul-Americana',
    'Premier League',
    'La Liga',
    'Serie A',
    'Bundesliga'
  ];

  return (
    <aside className="w-80 bg-slate-900 border-r border-slate-700 h-screen overflow-y-auto">
      <div className="p-4">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Pesquisar um evento"
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Sports Section */}
        <div className="mb-6">
          <div 
            className="flex items-center justify-between p-2 cursor-pointer hover:bg-slate-800 rounded"
            onClick={() => toggleSection('leagues')}
          >
            <div className="flex items-center">
              <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
              <span className="text-white font-medium">LIGAS</span>
            </div>
            <div className="flex items-center">
              <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded mr-2">
                Ao vivo (31)
              </span>
              {expandedSections.leagues ? 
                <ChevronDown className="h-4 w-4 text-gray-400" /> : 
                <ChevronRight className="h-4 w-4 text-gray-400" />
              }
            </div>
          </div>

          {expandedSections.leagues && (
            <div className="ml-4 mt-2">
              {sports.map((sport) => (
                <div
                  key={sport.id}
                  className={`flex items-center justify-between p-2 cursor-pointer rounded hover:bg-slate-800 ${
                    selectedSport === sport.id ? 'bg-slate-800' : ''
                  }`}
                  onClick={() => onSportChange(sport.id)}
                >
                  <span className="text-gray-300">{sport.name}</span>
                  <span className="text-gray-500 text-sm">({sport.count})</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Brazil Section */}
        <div>
          <div 
            className="flex items-center justify-between p-2 cursor-pointer hover:bg-slate-800 rounded"
            onClick={() => toggleSection('brazil')}
          >
            <div className="flex items-center">
              <span className="mr-2">🇧🇷</span>
              <span className="text-white font-medium">Brasil</span>
            </div>
            {expandedSections.brazil ? 
              <ChevronDown className="h-4 w-4 text-gray-400" /> : 
              <ChevronRight className="h-4 w-4 text-gray-400" />
            }
          </div>

          {expandedSections.brazil && (
            <div className="ml-6 mt-2 space-y-1">
              {leagues.map((league) => (
                <div
                  key={league}
                  className="p-2 text-gray-300 cursor-pointer hover:bg-slate-800 rounded text-sm"
                >
                  {league}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};