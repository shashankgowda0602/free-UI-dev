import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search designs, frameworks, categories, or keywords...',
  autoFocus = false,
}) => {
  const [internalValue, setInternalValue] = useState(value);

  // Sync prop changes
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Debounced search output (250ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      if (internalValue !== value) {
        onChange(internalValue);
      }
    }, 250);
    return () => clearTimeout(handler);
  }, [internalValue, value, onChange]);

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
      />
      {internalValue && (
        <button
          onClick={() => {
            setInternalValue('');
            onChange('');
          }}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
