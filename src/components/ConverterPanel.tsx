import { useConverterStore } from '@/store/useConverterStore';
import { getCategoryByKey } from '@/utils/converter';
import { ArrowUpDown } from 'lucide-react';
import { useState, useCallback } from 'react';

export default function ConverterPanel() {
  const {
    category,
    fromUnit,
    toUnit,
    fromValue,
    toValue,
    setFromUnit,
    setToUnit,
    setFromValue,
    setToValue,
    swapUnits,
    addFavorite,
    favorites,
  } = useConverterStore();

  const cat = getCategoryByKey(category);
  const [swapping, setSwapping] = useState(false);
  const [heartActive, setHeartActive] = useState(false);

  const isAlreadyFavorited = favorites.some(
    f => f.category === category && f.fromUnit === fromUnit && f.toUnit === toUnit,
  );

  const handleSwap = useCallback(() => {
    setSwapping(true);
    swapUnits();
    setTimeout(() => setSwapping(false), 400);
  }, [swapUnits]);

  const handleFavorite = useCallback(() => {
    if (isAlreadyFavorited) return;
    setHeartActive(true);
    const fromLabel = cat.units.find(u => u.key === fromUnit)?.label ?? fromUnit;
    const toLabel = cat.units.find(u => u.key === toUnit)?.label ?? toUnit;
    addFavorite(`${cat.label}: ${fromLabel} → ${toLabel}`);
    setTimeout(() => setHeartActive(false), 600);
  }, [addFavorite, cat, fromUnit, toUnit, isAlreadyFavorited]);

  return (
    <div className="relative bg-white/[0.06] backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl">
      <div className="space-y-1">
        <InputRow
          value={fromValue}
          unit={fromUnit}
          units={cat.units}
          onValueChange={setFromValue}
          onUnitChange={setFromUnit}
          label="从"
        />

        <div className="flex items-center justify-center py-3">
          <button
            onClick={handleSwap}
            className={`
              group relative w-12 h-12 rounded-full bg-amber-400/15 border border-amber-400/30
              flex items-center justify-center
              hover:bg-amber-400/25 hover:border-amber-400/50
              transition-all duration-300
              ${swapping ? 'rotate-180' : 'rotate-0'}
            `}
            style={{ transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s, border-color 0.3s' }}
          >
            <ArrowUpDown className="w-5 h-5 text-amber-400 transition-transform group-hover:scale-110" />
          </button>
        </div>

        <InputRow
          value={toValue}
          unit={toUnit}
          units={cat.units}
          onValueChange={setToValue}
          onUnitChange={setToUnit}
          label="到"
        />
      </div>

      <div className="mt-5 flex justify-end">
        <button
          onClick={handleFavorite}
          disabled={isAlreadyFavorited}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
            transition-all duration-300
            ${isAlreadyFavorited
              ? 'bg-white/5 text-white/30 cursor-not-allowed'
              : 'bg-amber-400/15 text-amber-400 hover:bg-amber-400/25 border border-amber-400/30 hover:border-amber-400/50'
            }
            ${heartActive ? 'scale-110' : 'scale-100'}
          `}
          style={{ transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s, border-color 0.3s, color 0.3s' }}
        >
          <span className={heartActive ? 'animate-bounce' : ''}>
            {isAlreadyFavorited ? '♥' : '♡'}
          </span>
          {isAlreadyFavorited ? '已收藏' : '收藏组合'}
        </button>
      </div>
    </div>
  );
}

interface InputRowProps {
  value: string;
  unit: string;
  units: { key: string; label: string }[];
  onValueChange: (val: string) => void;
  onUnitChange: (unit: string) => void;
  label: string;
}

function InputRow({ value, unit, units, onValueChange, onUnitChange, label }: InputRowProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '' || raw === '-' || /^-?\d*\.?\d*$/.test(raw)) {
      onValueChange(raw);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] uppercase tracking-widest text-white/30 font-semibold pl-1">
        {label}
      </span>
      <div className="flex gap-2">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={handleChange}
          placeholder="0"
          className="flex-1 bg-white/[0.07] border border-white/10 rounded-xl px-4 py-3.5 text-xl font-semibold text-white placeholder-white/20 outline-none focus:border-amber-400/50 focus:bg-white/[0.1] transition-all duration-200 font-mono tracking-tight"
        />
        <select
          value={unit}
          onChange={(e) => onUnitChange(e.target.value)}
          className="bg-white/[0.07] border border-white/10 rounded-xl px-3 py-3.5 text-sm text-white/80 outline-none focus:border-amber-400/50 transition-all duration-200 cursor-pointer min-w-[120px] appearance-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
            paddingRight: '32px',
          }}
        >
          {units.map((u) => (
            <option key={u.key} value={u.key} className="bg-indigo-950 text-white">
              {u.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
