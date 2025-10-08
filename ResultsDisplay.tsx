import React from 'react';
import { GeminiApiResponse, MatchData, ValueBet, GameNarrative, ProbabilityDistribution } from '../types';
import BetSuggestionCard from './BetSuggestionCard';
import RadarChart from './RadarChart';

interface ResultsDisplayProps {
  results: GeminiApiResponse;
  matchData: MatchData;
}

const MultiBetCard: React.FC<{ bet: GeminiApiResponse['multi_bet'] }> = ({ bet }) => (
    <div className="bg-gradient-to-br from-green-800/50 via-gray-800 to-gray-800 rounded-xl shadow-2xl border border-green-500/30 p-6">
        <h3 className="text-2xl font-bold text-green-300 mb-1">{bet.title}</h3>
        <div className="flex items-baseline gap-4 mb-4">
            <p className="text-sm text-gray-300">Odds Combinadas:</p>
            <p className="text-4xl font-extrabold text-white">{bet.combined_odds.toFixed(2)}</p>
        </div>

        <div className="space-y-3 mb-4">
            {bet.legs.map((leg, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-900/50 p-3 rounded-md">
                    <div>
                        <p className="text-xs text-gray-400">{leg.market}</p>
                        <p className="font-semibold text-gray-200">{leg.selection}</p>
                    </div>
                    <p className="font-bold text-green-400 text-lg">{leg.odds.toFixed(2)}</p>
                </div>
            ))}
        </div>
        
        <p className="text-sm text-gray-400 italic border-l-2 border-green-500/50 pl-3">
            {bet.rationale}
        </p>
    </div>
);

const ProbabilityDisplay: React.FC<{ dist: ProbabilityDistribution }> = ({ dist }) => (
    <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg">
        <h3 className="text-2xl font-bold text-white mb-6 border-b border-green-500/30 pb-3">Distribuição de Probabilidades</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h4 className="font-semibold text-lg text-gray-200 mb-3">Resultado da Partida</h4>
                <div className="space-y-3">
                    {Object.entries(dist.outcome).map(([key, value]) => (
                        <div key={key}>
                            <div className="flex justify-between mb-1 text-sm">
                                <span className="font-medium text-gray-300">{key.replace('_', ' ').replace('home win', 'Vitória Casa').replace('away win', 'Vitória Visitante').replace('draw', 'Empate')}</span>
                                {/* FIX: Cast value to number to fix 'toFixed' does not exist on type 'unknown' error. */}
                                <span className="text-green-400 font-bold">{(value as number).toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div className="bg-green-500 h-2.5 rounded-full" style={{width: `${value}%`}}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h4 className="font-semibold text-lg text-gray-200 mb-3">Placares Mais Prováveis</h4>
                <div className="space-y-2">
                    {dist.correct_scores.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm p-2 bg-gray-900/40 rounded">
                            <span className="font-mono text-gray-200">{item.score}</span>
                            <span className="text-green-400 font-semibold">{item.probability.toFixed(1)}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const GameNarrativesDisplay: React.FC<{ narratives: GameNarrative[] }> = ({ narratives }) => (
    <div>
        <h2 className="text-3xl font-bold text-white mb-6">Narrativas de Jogo da IA</h2>
        <div className="space-y-4">
            {narratives.map((narrative, index) => (
                <details key={index} className="bg-gray-800/50 p-4 rounded-lg shadow-lg group" open={index === 0}>
                    <summary className="font-semibold text-lg text-green-400 cursor-pointer list-none flex justify-between items-center">
                        {narrative.title}
                        <svg className="w-5 h-5 transition-transform transform group-open:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </summary>
                    <p className="text-gray-300 mt-3 whitespace-pre-wrap">{narrative.description}</p>
                </details>
            ))}
        </div>
    </div>
);

const ValueBetsDisplay: React.FC<{ bets: ValueBet[] }> = ({ bets }) => (
    <div>
        <h2 className="text-3xl font-bold text-white mb-6">Apostas de Valor Identificadas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bets.map((bet, index) => (
                 <div key={index} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-[1.02] hover:shadow-green-500/20">
                    <div className="p-5">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-400">{bet.market}</p>
                                <h4 className="text-lg font-bold text-white">{bet.selection}</h4>
                            </div>
                            <div className="text-center">
                                 <p className="text-xs text-gray-400">Odd Justa (IA)</p>
                                <div className="text-2xl font-bold bg-gray-900 text-green-400 px-3 py-1 rounded-md">
                                    {bet.ai_odds.toFixed(2)}
                                </div>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-gray-400 italic border-l-2 border-green-500/50 pl-3">
                        {bet.rationale}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, matchData }) => {
  return (
    <div className="space-y-12 mt-12">
      <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-white mb-4 border-b border-green-500/30 pb-3">
          Análise 'Thread of Thought' da IA
        </h2>
        <div className="prose prose-invert prose-p:text-gray-300 prose-headings:text-gray-100 whitespace-pre-wrap text-gray-300">
            {results.analysis}
        </div>
      </div>
      
      <RadarChart home={matchData.homeTeam} away={matchData.awayTeam} />
      
      <ProbabilityDisplay dist={results.probability_distribution} />
      
      <GameNarrativesDisplay narratives={results.game_narratives} />
      
      <div>
        <h2 className="text-3xl font-bold text-white mb-6">Sugestões de Apostas Simples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.single_bets.map((bet, index) => (
            <BetSuggestionCard key={index} bet={bet} />
          ))}
        </div>
      </div>

      {results.value_bets && results.value_bets.length > 0 && (
          <ValueBetsDisplay bets={results.value_bets} />
      )}

      <div>
          <h2 className="text-3xl font-bold text-white mb-6">Sugestão de Aposta Múltipla</h2>
          <MultiBetCard bet={results.multi_bet} />
      </div>

    </div>
  );
};

export default ResultsDisplay;