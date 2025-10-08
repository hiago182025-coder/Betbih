import React from 'react';
import { MatchData, TeamFeatures, AnalysisFocus } from '../types';
import FeatureInput from './FeatureInput';
import LoadingSpinner from './LoadingSpinner';

interface InputFormProps {
  matchData: MatchData;
  setMatchData: React.Dispatch<React.SetStateAction<MatchData>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onFetchStats: () => Promise<void>;
  isFetchingStats: boolean;
}

const teamFeatureKeys: (keyof Omit<TeamFeatures, 'name'>)[] = [
    'elo', 'eloMomentum', 'xgPer90', 'xgOpenPlayPer90', 'xgSetPiecesPer90', 'xaPer90',
    'shotsPer90', 'conversionRate', 'xgaPer90', 'foulsPerPossessionLost', 'cardsPerGame',
    'possession', 'highPressSuccessRate'
];

const featureTooltips: Record<keyof Omit<TeamFeatures, 'name'>, string> = {
    elo: "Rating ELO atual da equipe.",
    eloMomentum: "Tendência do rating ELO nos últimos 10 jogos.",
    xgPer90: "Gols esperados (xG) marcados por 90 minutos.",
    xgOpenPlayPer90: "Gols esperados (xG) de jogadas abertas por 90 minutos.",
    xgSetPiecesPer90: "Gols esperados (xG) de bolas paradas por 90 minutos.",
    xaPer90: "Assistências esperadas (xA) por 90 minutos.",
    shotsPer90: "Finalizações por 90 minutos.",
    conversionRate: "Taxa de conversão de finalizações em gol (%).",
    xgaPer90: "Gols esperados (xG) sofridos por 90 minutos.",
    foulsPerPossessionLost: "Razão de faltas cometidas por posse de bola perdida.",
    cardsPerGame: "Média de cartões (amarelos/vermelhos) por jogo.",
    possession: "Média de posse de bola por jogo (%).",
    highPressSuccessRate: "Taxa de sucesso em pressões altas no campo de ataque (%).",
};

const featureLabels: Record<keyof Omit<TeamFeatures, 'name'>, string> = {
    elo: "ELO",
    eloMomentum: "Momentum ELO",
    xgPer90: "xG por 90 min",
    xgOpenPlayPer90: "xG (Jog. Abertas) por 90 min",
    xgSetPiecesPer90: "xG (Bolas Paradas) por 90 min",
    xaPer90: "xA por 90 min",
    shotsPer90: "Finalizações por 90 min",
    conversionRate: "Taxa de Conversão (%)",
    xgaPer90: "xGA por 90 min",
    foulsPerPossessionLost: "Faltas por Posse Perdida",
    cardsPerGame: "Cartões por Jogo",
    possession: "Posse de Bola (%)",
    highPressSuccessRate: "Sucesso Pressão Alta (%)",
};

const analysisFocusOptions: {id: AnalysisFocus, label: string, description: string}[] = [
    { id: 'standard', label: 'Padrão', description: 'Análise equilibrada e objetiva.' },
    { id: 'defensive', label: 'Foco Defensivo', description: 'Analisa solidez, xGA e chances de poucos gols.' },
    { id: 'offensive', label: 'Foco Ofensivo', description: 'Analisa xG, finalizações e chances de muitos gols.' },
    { id: 'upset', label: 'Caça-Zebra', description: 'Busca fatores subestimados para um resultado surpresa.' },
];

const InputForm: React.FC<InputFormProps> = ({ matchData, setMatchData, onSubmit, isLoading, onFetchStats, isFetchingStats }) => {

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMatchData(prev => ({ ...prev, [name]: name === 'matchday' ? parseInt(value) || 0 : value }));
  };
  
  const handleFocusChange = (focus: AnalysisFocus) => {
    setMatchData(prev => ({ ...prev, analysisFocus: focus }));
  };

  const handleTeamNameChange = (team: 'homeTeam' | 'awayTeam', value: string) => {
    setMatchData(prev => ({
        ...prev,
        [team]: { ...prev[team], name: value }
    }));
  };

  const handleFeatureChange = (team: 'homeTeam' | 'awayTeam', feature: keyof Omit<TeamFeatures, 'name'>, value: string) => {
    setMatchData(prev => ({
      ...prev,
      [team]: {
        ...prev[team],
        [feature]: value === '' ? 0 : parseFloat(value)
      }
    }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-green-400 mb-4 border-b border-gray-600 pb-2">Detalhes da Partida</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureInput label="Competição" id="competition" value={matchData.competition} onChange={handleInputChange} type="text" />
          <FeatureInput label="Rodada" id="matchday" value={matchData.matchday} onChange={handleInputChange} type="number" step="1" />
          <FeatureInput label="Time da Casa" id="homeTeamName" value={matchData.homeTeam.name} onChange={(e) => handleTeamNameChange('homeTeam', e.target.value)} type="text" />
          <FeatureInput label="Time Visitante" id="awayTeamName" value={matchData.awayTeam.name} onChange={(e) => handleTeamNameChange('awayTeam', e.target.value)} type="text" />
          <div className="md:col-span-2">
            <button
                type="button"
                onClick={onFetchStats}
                disabled={isFetchingStats || !matchData.homeTeam.name || !matchData.awayTeam.name}
                className="w-full flex justify-center items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:bg-blue-800/50 disabled:cursor-not-allowed transition-colors"
            >
                {isFetchingStats ? (
                    <>
                        <LoadingSpinner message="Buscando dados com IA..." />
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2H5zm11 1H4a1 1 0 00-1 1v6a1 1 0 001 1h12a1 1 0 001-1V6a1 1 0 00-1-1z" /><path d="M12.293 8.293a1 1 0 011.414 0l2 2a1 1 0 01-1.414 1.414L13 10.414V12a1 1 0 11-2 0V9a1 1 0 01.293-.707zM7.707 11.707a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L7 9.586V8a1 1 0 112 0v3a1 1 0 01-.293.707z" /></svg>
                        Preencher Dados com IA
                    </>
                )}
            </button>
          </div>
        </div>
      </div>
      
       <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-green-400 mb-4 border-b border-gray-600 pb-2">Contexto e Tática</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureInput label="Formação Casa" id="homeFormation" value={matchData.homeFormation || ''} onChange={handleInputChange} type="text" tooltip="Ex: 4-3-3, 3-5-2" />
          <FeatureInput label="Formação Visitante" id="awayFormation" value={matchData.awayFormation || ''} onChange={handleInputChange} type="text" tooltip="Ex: 4-4-2, 5-3-2" />
          <div className="md:col-span-2">
            <label htmlFor="h2hHistory" className="block text-sm font-medium text-gray-300 mb-1">Histórico H2H (Últimos 5)</label>
            <textarea id="h2hHistory" name="h2hHistory" rows={3} value={matchData.h2hHistory || ''} onChange={handleInputChange}
              className="w-full bg-gray-800 border border-gray-600 text-white rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm p-2 transition"
              placeholder="Ex: Time A 2-1 Time B, Empate 0-0..." />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="context" className="block text-sm font-medium text-gray-300 mb-1">Contexto Adicional</label>
            <textarea id="context" name="context" rows={3} value={matchData.context} onChange={handleInputChange}
              className="w-full bg-gray-800 border border-gray-600 text-white rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm p-2 transition"
              placeholder="Ex: Jogo de rivalidade. Jogadores chave: K. De Bruyne (MCI). Desfalques: V. van Dijk (LIV)." />
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-green-400 mb-4 border-b border-gray-600 pb-2">Foco da Análise da IA</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {analysisFocusOptions.map(option => (
            <div key={option.id}>
              <button type="button" onClick={() => handleFocusChange(option.id)}
                className={`w-full h-full text-left p-4 rounded-lg border-2 transition-all ${matchData.analysisFocus === option.id ? 'border-green-500 bg-green-500/10' : 'border-gray-600 bg-gray-700/50 hover:border-green-500/50'}`}>
                <p className="font-bold text-white">{option.label}</p>
                <p className="text-xs text-gray-400 mt-1">{option.description}</p>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {([ 'homeTeam', 'awayTeam' ] as const).map(teamType => (
          <div key={teamType} className="bg-gray-800/50 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4">
              Features - {teamType === 'homeTeam' ? 'Time da Casa' : 'Time Visitante'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {teamFeatureKeys.map(key => (
                  <FeatureInput
                      key={`${teamType}-${key}`}
                      label={featureLabels[key]}
                      id={`${teamType}-${key}`}
                      value={matchData[teamType][key]}
                      onChange={(e) => handleFeatureChange(teamType, key, e.target.value)}
                      tooltip={featureTooltips[key]}
                  />
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-md bg-green-600 px-8 py-3 text-lg font-semibold text-white shadow-sm hover:bg-green-500 disabled:bg-green-800/50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? <LoadingSpinner message="Gerando Análise..." /> : 'Gerar Análise Preditiva'}
        </button>
      </div>
    </form>
  );
};

export default InputForm;