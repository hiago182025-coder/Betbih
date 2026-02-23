import React from 'react';
import { MatchData } from '../types';

interface MatchSelectorProps {
  matches: MatchData[];
  onSelect: (matchId: string) => void;
  isLoading: boolean;
  selectedMatchId?: string | null;
}

const MatchSelector: React.FC<MatchSelectorProps> = ({ matches, onSelect, isLoading, selectedMatchId }) => {
  if (isLoading) {
    return <div className="text-center p-4 text-gray-400">Buscando jogos da semana...</div>;
  }

  if (matches.length === 0) {
    return <div className="text-center p-4 text-gray-400">Nenhum jogo encontrado para a próxima semana.</div>;
  }
  
  // Fix: The previous method of calling reduce with a generic argument was causing a TS error.
  // By creating a strongly-typed initial value for the accumulator, we allow TypeScript's
  // inference to correctly type `groupedMatches` without needing generics or casting,
  // which resolves both the initial and downstream type errors.
  const initialAccumulator: Record<string, MatchData[]> = {};
  const groupedMatches = matches.reduce((acc, match) => {
    const date = match.date || 'Sem data';
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(match);
    return acc;
  }, initialAccumulator);

  const formatDateHeader = (dateString: string) => {
    if (dateString === 'Sem data') return dateString;
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    const date = new Date(dateString.replace(/-/g, '/')); // Corrigir formato de data para compatibilidade
    return date.toLocaleDateString('pt-BR', options);
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg mb-8">
      <h2 className="text-2xl font-bold text-green-400 mb-4 border-b border-gray-600 pb-2">
        Jogos da Semana
      </h2>
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {/* FIX: Cast Object.entries result to fix 'map' does not exist on type 'unknown' error. */}
        {(Object.entries(groupedMatches) as [string, MatchData[]][]).map(([date, games]) => (
          <div key={date}>
            <h3 className="text-lg font-semibold text-gray-300 sticky top-0 bg-gray-800/80 backdrop-blur-sm py-2">
              {formatDateHeader(date)}
            </h3>
            <div className="space-y-2">
              {games.map((match) => (
                <button
                  key={match.id}
                  onClick={() => onSelect(match.id!)}
                  className={`w-full text-left p-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${selectedMatchId === match.id ? 'bg-green-500/30' : 'bg-gray-700/50 hover:bg-green-500/20'}`}
                >
                  <p className="text-sm text-gray-400">{match.competition} - {match.time}</p>
                  <p className="font-semibold">{match.homeTeam.name} vs {match.awayTeam.name}</p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchSelector;