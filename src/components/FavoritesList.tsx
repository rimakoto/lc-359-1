import { useConverterStore, Favorite } from '@/store/useConverterStore';
import { getCategoryByKey } from '@/utils/converter';
import { X, ArrowRight } from 'lucide-react';

export default function FavoritesList() {
  const favorites = useConverterStore(s => s.favorites);
  const removeFavorite = useConverterStore(s => s.removeFavorite);
  const loadFavorite = useConverterStore(s => s.loadFavorite);

  if (favorites.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="text-3xl mb-2 opacity-30">♡</div>
        <p className="text-white/30 text-sm">还没有收藏的换算组合</p>
        <p className="text-white/20 text-xs mt-1">点击换算面板中的收藏按钮保存常用组合</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {favorites.map((fav) => (
        <FavoriteCard
          key={fav.id}
          fav={fav}
          onLoad={() => loadFavorite(fav)}
          onRemove={() => removeFavorite(fav.id)}
        />
      ))}
    </div>
  );
}

function FavoriteCard({ fav, onLoad, onRemove }: { fav: Favorite; onLoad: () => void; onRemove: () => void }) {
  const cat = getCategoryByKey(fav.category);
  const fromLabel = cat.units.find(u => u.key === fav.fromUnit)?.label ?? fav.fromUnit;
  const toLabel = cat.units.find(u => u.key === fav.toUnit)?.label ?? fav.toUnit;

  return (
    <div
      onClick={onLoad}
      className="group relative bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] hover:border-amber-400/30 rounded-xl px-4 py-3 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-amber-400/5 hover:-translate-y-0.5"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div className="flex items-center gap-1 text-xs text-white/30 mb-1">
        <span className="uppercase tracking-wider font-semibold">{cat.label}</span>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span className="text-white/80 font-medium truncate">{fromLabel}</span>
        <ArrowRight className="w-3.5 h-3.5 text-amber-400/60 flex-shrink-0" />
        <span className="text-white/80 font-medium truncate">{toLabel}</span>
      </div>
    </div>
  );
}
