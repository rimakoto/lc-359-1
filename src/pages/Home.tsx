import CategoryTabs from '@/components/CategoryTabs';
import ConverterPanel from '@/components/ConverterPanel';
import FavoritesList from '@/components/FavoritesList';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-950 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-400/[0.07] rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/[0.07] rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-400/[0.03] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-xl mx-auto px-4 py-10 sm:py-16">
        <header className="mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-2" style={{ fontFamily: '"DM Serif Display", serif' }}>
            单位换算
          </h1>
          <p className="text-white/40 text-sm tracking-wide">
            长度 · 重量 · 体积 · 温度 · 面积
          </p>
        </header>

        <div className="mb-6">
          <CategoryTabs />
        </div>

        <div className="mb-8">
          <ConverterPanel />
        </div>

        <section>
          <h2 className="text-lg font-semibold text-white/70 mb-4 flex items-center gap-2" style={{ fontFamily: '"DM Serif Display", serif' }}>
            <span className="text-amber-400">♡</span>
            收藏组合
          </h2>
          <FavoritesList />
        </section>
      </div>
    </div>
  );
}
