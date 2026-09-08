import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Sparkles, Palette, Check, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeChanger = ({ className = '' }) => {
  const { theme, setTheme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themes = [
    {
      id: 'dark',
      label: 'Deep Midnight (Dark)',
      shortLabel: 'Dark',
      icon: Moon,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/30',
    },
    {
      id: 'light',
      label: 'Clean Municipal (Light)',
      shortLabel: 'Light',
      icon: Sun,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
    },
    {
      id: 'cyber',
      label: 'Cyberpunk Neon',
      shortLabel: 'Cyber',
      icon: Sparkles,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
    },
  ];

  const currentTheme = themes.find((t) => t.id === theme) || themes[0];
  const CurrentIcon = currentTheme.icon;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border shadow-sm transition-all active:scale-95 ${currentTheme.bg} ${currentTheme.border} hover:opacity-90`}
        title={`Theme: ${currentTheme.label} - Click to change`}
        aria-label="Change Theme"
      >
        <CurrentIcon className={`w-4 h-4 ${currentTheme.color} transition-transform duration-300 hover:rotate-12`} />
        <span className="hidden sm:inline font-bold capitalize text-slate-200">{currentTheme.shortLabel}</span>
        <ChevronDown className="w-3 h-3 text-slate-400 opacity-70" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl">
          <div className="px-3 py-2 border-b border-slate-800/80 mb-1 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-indigo-400" />
              Theme Mode
            </span>
          </div>

          <div className="space-y-0.5">
            {themes.map((t) => {
              const Icon = t.icon;
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-indigo-600/20 text-white border border-indigo-500/40 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg ${t.bg}`}>
                      <Icon className={`w-3.5 h-3.5 ${t.color}`} />
                    </div>
                    <span>{t.label}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeChanger;
