import React from 'react';
import { BetSuggestion } from '../types';

interface BetSuggestionCardProps {
  bet: BetSuggestion;
}

const ConfidenceMeter: React.FC<{ level: number }> = ({ level }) => (
    <div className="flex items-center gap-1.5">
        {[...Array(5)].map((_, i) => (
            <div
                key={i}
                className={`w-full h-2 rounded-full ${i < level ? 'bg-green-500' : 'bg-gray-600'}`}
            />
        ))}
    </div>
);

const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const ExclamationIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414L9 10.414V14a1 1 0 102 0v-3.586l.293.293a1 1 0 001.414-1.414l-3-3z" clipRule="evenodd" />
    </svg>
);

const BetSuggestionCard: React.FC<BetSuggestionCardProps> = ({ bet }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-[1.02] hover:shadow-green-500/20 flex flex-col">
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm text-gray-400">{bet.market}</p>
                <h4 className="text-lg font-bold text-white">{bet.selection}</h4>
            </div>
            <div className="text-2xl font-bold bg-gray-900 text-green-400 px-3 py-1 rounded-md">
                {bet.odds.toFixed(2)}
            </div>
        </div>
        <div className="mt-4">
            <p className="text-sm text-gray-300 font-medium mb-1">Confiança</p>
            <ConfidenceMeter level={bet.confidence} />
        </div>
      </div>
      <div className="p-5 bg-gray-800/50 border-t border-gray-700/50">
          <div className="space-y-3">
              <div>
                  <h5 className="text-sm font-semibold text-green-400 mb-2">Fatores de Suporte</h5>
                  <ul className="space-y-1.5 text-xs text-gray-300">
                      {bet.supporting_factors.map((factor, i) => (
                          <li key={i} className="flex items-start gap-2">
                              <CheckIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                              <span>{factor}</span>
                          </li>
                      ))}
                  </ul>
              </div>
              <div>
                  <h5 className="text-sm font-semibold text-red-400 mb-2">Principais Riscos</h5>
                  <ul className="space-y-1.5 text-xs text-gray-300">
                      {bet.main_risks.map((risk, i) => (
                          <li key={i} className="flex items-start gap-2">
                              <ExclamationIcon className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                              <span>{risk}</span>
                          </li>
                      ))}
                  </ul>
              </div>
          </div>
      </div>
    </div>
  );
};

export default BetSuggestionCard;
