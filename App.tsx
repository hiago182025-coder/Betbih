import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import { MatchData, GeminiApiResponse } from './types';
import { generateBettingSuggestions, fetchTeamStatsWithAI, fetchTacticalContextWithAI } from './services/geminiService';
import { fetchWeeklyMatches } from './services/apiService';
import MatchSelector from './components/MatchSelector';

const initialMatchData: MatchData = {
  competition: '',
  matchday: 1,
  homeTeam: { name: '', elo: 0, eloMomentum: 0, xgPer90: 0, xgOpenPlayPer90: 0, xgSetPiecesPer90: 0, xaPer90: 0, shotsPer90: 0, conversionRate: 0, xgaPer90: 0, foulsPerPossessionLost: 0, cardsPerGame: 0, possession: 0, highPressSuccessRate: 0 },
  awayTeam: { name: '', elo: 0, eloMomentum: 0, xgPer90: 0, xgOpenPlayPer90: 0, xgSetPiecesPer90: 0, xaPer90: 0, shotsPer90: 0, conversionRate: 0, xgaPer90: 0, foulsPerPossessionLost: 0, cardsPerGame: 0, possession: 0, highPressSuccessRate: 0 },
  context: '',
  homeFormation: '',
  awayFormation: '',
  h2hHistory: '',
  analysisFocus: 'standard',
};

const App: React.FC = () => {
  const [matchData, setMatchData] = useState<MatchData>(initialMatchData);
  const [results, setResults] = useState<GeminiApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingStats, setIsFetchingStats] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [matches, setMatches] = useState<MatchData[]>([]);
  const [isFetchingMatches, setIsFetchingMatches] = useState(true);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        setIsFetchingMatches(true);
        const fetchedMatches = await fetchWeeklyMatches();
        setMatches(fetchedMatches.map(m => ({...initialMatchData, ...m})));
      } catch (err) {
        setError("Não foi possível carregar os jogos da semana.");
      } finally {
        setIsFetchingMatches(false);
      }
    };
    loadMatches();
  }, []);
  
  const handleMatchSelect = (matchId: string) => {
    const selectedMatch = matches.find(m => m.id === matchId);
    if (selectedMatch) {
      setMatchData(selectedMatch);
      setSelectedMatchId(matchId);
      setResults(null); // Clear previous results
      setError(null);
    }
  };

  const handleFetchStats = async () => {
      if (!matchData.homeTeam.name || !matchData.awayTeam.name) {
          setError("Por favor, insira os nomes dos times para buscar os dados.");
          return;
      }
      setIsFetchingStats(true);
      setError(null);
      try {
          const [stats, tacticalContext] = await Promise.all([
              fetchTeamStatsWithAI(matchData.homeTeam.name, matchData.awayTeam.name),
              fetchTacticalContextWithAI(matchData.homeTeam.name, matchData.awayTeam.name)
          ]);

          setMatchData(prev => ({
              ...prev,
              homeTeam: { ...prev.homeTeam, ...stats.homeTeam },
              awayTeam: { ...prev.awayTeam, ...stats.awayTeam },
              homeFormation: tacticalContext.homeFormation,
              awayFormation: tacticalContext.awayFormation,
              h2hHistory: tacticalContext.h2hHistory,
              context: tacticalContext.context,
          }));
      } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Ocorreu um erro desconhecido ao buscar os dados com a IA.");
          }
      } finally {
          setIsFetchingStats(false);
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResults(null);
    setError(null);

    try {
      const apiResponse = await generateBettingSuggestions(matchData);
      setResults(apiResponse);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro desconhecido.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1">
                 <MatchSelector 
                    matches={matches} 
                    onSelect={handleMatchSelect}
                    isLoading={isFetchingMatches}
                    selectedMatchId={selectedMatchId}
                 />
            </div>
            <div className="lg:col-span-2">
                 <InputForm 
                    matchData={matchData} 
                    setMatchData={setMatchData} 
                    onSubmit={handleSubmit} 
                    isLoading={isLoading}
                    onFetchStats={handleFetchStats}
                    isFetchingStats={isFetchingStats}
                />
            </div>
        </div>
        
        {error && (
            <div className="mt-8 bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg text-center">
                <p className="font-bold">Erro!</p>
                <p>{error}</p>
            </div>
        )}

        {isLoading && <div className="mt-8"><LoadingSpinner message="Analisando e gerando previsões..." /></div>}
        
        {results && !isLoading && (
          <div className="mt-8">
            <ResultsDisplay results={results} matchData={matchData} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;