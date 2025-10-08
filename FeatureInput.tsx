
import React from 'react';

interface FeatureInputProps {
  label: string;
  id: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: 'text' | 'number';
  step?: string;
  tooltip?: string;
}

const FeatureInput: React.FC<FeatureInputProps> = ({
  label,
  id,
  value,
  onChange,
  type = 'number',
  step = "0.01",
  tooltip
}) => {
  return (
    <div className="relative">
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
        {label}
        {tooltip && (
          <span className="group relative ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="absolute bottom-full mb-2 w-64 p-2 bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              {tooltip}
            </span>
          </span>
        )}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        step={type === 'number' ? step : undefined}
        className="w-full bg-gray-800 border border-gray-600 text-white rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm p-2 transition"
      />
    </div>
  );
};

export default FeatureInput;
