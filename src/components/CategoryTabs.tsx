import { getCategories, Category } from '@/utils/converter';
import { useConverterStore } from '@/store/useConverterStore';
import { Ruler, Weight, Beaker, Thermometer, Square } from 'lucide-react';
import { clsx } from 'clsx';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  ruler: Ruler,
  weight: Weight,
  beaker: Beaker,
  thermometer: Thermometer,
  square: Square,
};

export default function CategoryTabs() {
  const categories = getCategories();
  const current = useConverterStore(s => s.category);
  const setCategory = useConverterStore(s => s.setCategory);

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {categories.map((cat) => {
        const Icon = iconMap[cat.icon];
        const active = current === cat.key;
        return (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key as Category)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300',
              active
                ? 'bg-amber-400 text-indigo-950 shadow-lg shadow-amber-400/25 scale-105'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/90',
            )}
          >
            {Icon && <Icon className="w-4 h-4" />}
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
