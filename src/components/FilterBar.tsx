import { useEffect, useRef, useState } from 'react';
import { Heart, Search, Shuffle, X } from 'lucide-react';
import { withAlpha } from '../lib/colors';
import type { FilterKey, IColor } from '../types';

const PILLS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'favorites', label: '收藏' },
  { key: 'red', label: '红' },
  { key: 'orange', label: '橙黄' },
  { key: 'green', label: '绿' },
  { key: 'cyan', label: '青蓝' },
  { key: 'purple', label: '紫' },
  { key: 'neutral', label: '黑白灰' },
];

interface FilterBarProps {
  selected: IColor;
  favorite: boolean;
  onToggleFavorite: () => void;
  onRandom: () => void;
  query: string;
  onQuery: (value: string) => void;
  filter: FilterKey;
  onFilter: (value: FilterKey) => void;
  counts: Record<FilterKey, number>;
  resultCount: number;
  searchRef: React.RefObject<HTMLInputElement>;
}

const FilterBar: React.FC<FilterBarProps> = ({
  selected,
  favorite,
  onToggleFavorite,
  onRandom,
  query,
  onQuery,
  filter,
  onFilter,
  counts,
  resultCount,
  searchRef,
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!searchOpen) return;
    const input = mobileInputRef.current;
    if (!input) return;
    const timer = window.setTimeout(() => input.focus(), 60);
    return () => window.clearTimeout(timer);
  }, [searchOpen]);

  const closeSearch = () => {
    setSearchOpen(false);
    onQuery('');
    mobileInputRef.current?.blur();
  };

  const pickFilter = (key: FilterKey, el: HTMLButtonElement) => {
    onFilter(key);
    el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  return (
    <div className="sticky top-0 z-30 border-b border-black/[0.06] bg-[#f7f4ed]/95 px-4 pb-2 pt-2 backdrop-blur-md lg:border-0 lg:bg-transparent lg:px-12 lg:pb-3 lg:pt-6 lg:backdrop-blur-none">
      {/* Desktop search */}
      <div className="relative hidden lg:block">
        <Search
          size={16}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
        />
        <input
          ref={searchRef}
          type="text"
          inputMode="search"
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder="搜索颜色名称、拼音、HEX、RGB…"
          aria-label="搜索颜色"
          className="h-11 w-full rounded-full border border-black/[0.06] bg-white/70 pl-11 pr-11 text-sm font-light tracking-wide text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              onQuery('');
              searchRef.current?.focus();
            }}
            aria-label="清空搜索"
            className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-neutral-400 hover:text-neutral-700"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Mobile: current colour strip + search toggle */}
      <div className="flex items-center gap-2 lg:hidden">
        <span
          aria-hidden="true"
          className="h-9 w-9 shrink-0 rounded-full ring-1 ring-black/10"
          style={{ backgroundColor: selected.hex }}
        />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-sm font-medium text-neutral-800">{selected.name}</p>
          <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">
            {selected.hex}
            <span className="ml-2 normal-case tracking-normal">{resultCount} 色</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => (searchOpen ? closeSearch() : setSearchOpen(true))}
          aria-label={searchOpen ? '关闭搜索' : '搜索'}
          aria-expanded={searchOpen}
          className={`grid h-10 w-10 place-items-center rounded-full border transition-colors ${
            searchOpen
              ? 'border-neutral-900 bg-neutral-900 text-white'
              : 'border-black/[0.07] bg-white/70 text-neutral-600'
          }`}
        >
          <Search size={16} />
        </button>
        <button
          type="button"
          onClick={onToggleFavorite}
          aria-label={favorite ? `取消收藏 ${selected.name}` : `收藏 ${selected.name}`}
          aria-pressed={favorite}
          className={`grid h-10 w-10 place-items-center rounded-full border transition-colors ${
            favorite
              ? 'border-neutral-900 bg-neutral-900'
              : 'border-black/[0.07] bg-white/70 text-neutral-600'
          }`}
          style={favorite ? { color: selected.hex } : undefined}
        >
          <Heart size={16} className={favorite ? 'fill-current' : undefined} />
        </button>
        <button
          type="button"
          onClick={onRandom}
          aria-label="随机一色"
          className="grid h-10 w-10 place-items-center rounded-full bg-neutral-900 text-white active:scale-95"
        >
          <Shuffle size={16} />
        </button>
      </div>

      {searchOpen && (
        <div className="relative mt-2 lg:hidden">
          <input
            ref={mobileInputRef}
            type="text"
            inputMode="search"
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') closeSearch();
            }}
            placeholder="名称、拼音、HEX、RGB…"
            aria-label="搜索颜色"
            className="h-10 w-full rounded-full border border-black/[0.06] bg-white pl-4 pr-11 text-sm font-light text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-300 focus:outline-none"
          />
          <button
            type="button"
            onClick={closeSearch}
            aria-label="关闭搜索"
            className="absolute right-1 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-neutral-500"
          >
            <X size={15} />
          </button>
        </div>
      )}

      <div
        className="no-scrollbar -mx-4 mt-2 flex gap-1.5 overflow-x-auto px-4 pb-0.5 lg:mx-0 lg:px-0"
      >
        {PILLS.map((pill) => {
          const active = filter === pill.key;
          const count = counts[pill.key] ?? 0;
          return (
            <button
              key={pill.key}
              type="button"
              onClick={(event) => pickFilter(pill.key, event.currentTarget)}
              aria-pressed={active}
              className={`flex h-10 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-3.5 text-[13px] tracking-wide transition-colors lg:h-8 lg:px-3 lg:text-xs ${
                active
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-black/[0.07] bg-white/70 text-neutral-600 hover:bg-white'
              }`}
            >
              {pill.key === 'favorites' && (
                <Heart
                  size={11}
                  className={active || count === 0 ? '' : 'fill-current'}
                  style={{ color: active ? withAlpha('#ffffff', 0.9) : '#e05a7a' }}
                />
              )}
              {pill.label}
              <span className={`text-[10px] ${active ? 'text-white/55' : 'text-neutral-400'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FilterBar;
