import React from 'react';
import { TeamFeatures } from '../types';

interface HeatmapProps {
    home: TeamFeatures;
    away: TeamFeatures;
}

const metrics = [
    { label: 'Rating ELO', key: 'elo', higherIsBetter: true },
    { label: 'Momentum ELO', key: 'eloMomentum', higherIsBetter: true },
    { label: 'xG por 90', key: 'xgPer90', higherIsBetter: true },
    { label: 'xGA por 90', key: 'xgaPer90', higherIsBetter: false },
    { label: 'Chutes por 90', key: 'shotsPer90', higherIsBetter: true },
    { label: 'Posse de Bola %', key: 'possession', higherIsBetter: true },
    { label: 'Sucesso na Pressão Alta %', key: 'highPressSuccessRate', higherIsBetter: true },
    { label: 'Cartões por Jogo', key: 'cardsPerGame', higherIsBetter: false },
];

const Heatmap: React.FC<HeatmapProps> = ({ home, away }) => {
    
    const getCellClass = (metric: (typeof metrics)[0], value: number, otherValue: number) => {
        if (value === otherValue) return 'bg-gray-700/50';
        
        const isBetter = metric.higherIsBetter ? value > otherValue : value < otherValue;
        
        return isBetter ? 'bg-green-500/30 font-bold' : 'bg-red-500/30';
    };

    return (
        <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-white mb-4 border-b border-green-500/30 pb-3">
                Comparativo (Mapa de Calor)
            </h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-600">
                            <th className="p-3 text-sm font-semibold text-gray-300">Métrica</th>
                            <th className="p-3 text-sm font-semibold text-gray-300 text-center">{home.name}</th>
                            <th className="p-3 text-sm font-semibold text-gray-300 text-center">{away.name}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {metrics.map((metric) => {
                            const homeValue = home[metric.key as keyof TeamFeatures] as number;
                            const awayValue = away[metric.key as keyof TeamFeatures] as number;
                            return (
                                <tr key={metric.key} className="border-b border-gray-700/50">
                                    <td className="p-3 font-medium">{metric.label}</td>
                                    <td className={`p-3 text-center rounded-md transition-colors ${getCellClass(metric, homeValue, awayValue)}`}>
                                        {homeValue.toFixed(2)}
                                    </td>
                                    <td className={`p-3 text-center rounded-md transition-colors ${getCellClass(metric, awayValue, homeValue)}`}>
                                        {awayValue.toFixed(2)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
             <p className="text-xs text-gray-500 mt-4">
                * Verde indica uma métrica estatisticamente melhor em comparação com o adversário.
            </p>
        </div>
    );
};

export default Heatmap;
