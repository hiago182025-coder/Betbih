import React from 'react';
import { TeamFeatures } from '../types';

interface RadarChartProps {
    home: TeamFeatures;
    away: TeamFeatures;
}

const metricsConfig = [
    { key: 'xgPer90', label: 'Ataque', higherIsBetter: true },
    { key: 'xgaPer90', label: 'Defesa', higherIsBetter: false },
    { key: 'possession', label: 'Posse', higherIsBetter: true },
    { key: 'highPressSuccessRate', label: 'Pressão', higherIsBetter: true },
    { key: 'conversionRate', label: 'Eficiência', higherIsBetter: true },
    { key: 'cardsPerGame', label: 'Disciplina', higherIsBetter: false },
];

const RadarChart: React.FC<RadarChartProps> = ({ home, away }) => {
    const size = 300;
    const center = size / 2;
    const numLevels = 5;
    const angleSlice = (Math.PI * 2) / metricsConfig.length;

    const normalize = (metric: typeof metricsConfig[0], homeValue: number, awayValue: number) => {
        const total = homeValue + awayValue;
        if (total === 0) return { home: 0.5, away: 0.5 };
        
        let homeNorm = homeValue / total;
        let awayNorm = awayValue / total;

        if (!metric.higherIsBetter) {
            [homeNorm, awayNorm] = [awayNorm, homeNorm];
        }
        
        return { home: homeNorm, away: awayNorm };
    };

    const dataPoints = metricsConfig.map(metric => {
        const homeValue = home[metric.key as keyof TeamFeatures] as number;
        const awayValue = away[metric.key as keyof TeamFeatures] as number;
        return normalize(metric, homeValue, awayValue);
    });

    const getPoint = (value: number, i: number) => {
        const radius = value * (center * 0.8);
        const x = center + radius * Math.cos(angleSlice * i - Math.PI / 2);
        const y = center + radius * Math.sin(angleSlice * i - Math.PI / 2);
        return `${x},${y}`;
    };

    const homePoints = dataPoints.map((p, i) => getPoint(p.home, i)).join(' ');
    const awayPoints = dataPoints.map((p, i) => getPoint(p.away, i)).join(' ');
    
    return (
        <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-white mb-4 border-b border-green-500/30 pb-3">
                Comparativo Tático (Radar)
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                 <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
                    {/* Grid Levels */}
                    {[...Array(numLevels)].map((_, i) => (
                        <circle key={i} cx={center} cy={center} r={(center * 0.8 / numLevels) * (i + 1)}
                            fill="none" stroke="#4A5568" strokeWidth="0.5" />
                    ))}
                    
                    {/* Axes and Labels */}
                    {metricsConfig.map((metric, i) => {
                        const x1 = center;
                        const y1 = center;
                        const radius = center * 0.95;
                        const x2 = center + radius * Math.cos(angleSlice * i - Math.PI / 2);
                        const y2 = center + radius * Math.sin(angleSlice * i - Math.PI / 2);
                        const labelRadius = center * 1.05;
                        const lx = center + labelRadius * Math.cos(angleSlice * i - Math.PI / 2);
                        const ly = center + labelRadius * Math.sin(angleSlice * i - Math.PI / 2);
                        return (
                           <g key={i}>
                               <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#4A5568" strokeWidth="0.5" />
                               <text x={lx} y={ly} dy="0.35em" textAnchor="middle" fill="#A0AEC0" fontSize="10">{metric.label}</text>
                           </g> 
                        )
                    })}
                    
                    {/* Data Polygons */}
                    <polygon points={awayPoints} fill="#f56565" opacity="0.4" stroke="#c53030" strokeWidth="1" />
                    <polygon points={homePoints} fill="#48bb78" opacity="0.6" stroke="#2f855a" strokeWidth="1" />
                </svg>
                <div className="w-full md:w-auto">
                    <h3 className="text-lg font-semibold mb-3">Legenda</h3>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-green-500/80 border border-green-300"></div>
                            <span className="text-gray-200">{home.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-red-500/70 border border-red-300"></div>
                            <span className="text-gray-200">{away.name}</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">
                        * A área maior em cada eixo indica superioridade estatística naquela métrica em relação ao oponente.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RadarChart;
