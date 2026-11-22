import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, Heart, SearchX } from 'lucide-react';
import AboutDialog from './components/AboutDialog';
import ColorCard from './components/ColorCard';
import FilterBar from './components/FilterBar';
import Hero from './components/Hero';
import { cssVarName, familyOf, loadColors } from './lib/colors';
import type { FilterKey, IColor } from './types';

const COLORS = loadColors();
const FAMILY_BY_NAME = new Map(COLORS.map((color) => [color.name, familyOf(color.hex)]));
const FAVORITES_KEY = 'chinacolor:favorites:v1';

function readFavorites(): string[] {
  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((name): name is string => typeof name === 'string') : [];
  } catch {
    return [];
  }
}

function colorFromUrl(): IColor | undefined {
  try {
    const raw = new URLSearchParams(window.location.search).get('color');
    if (!raw) return undefined;
    const needle = raw.trim();
    const lower = needle.toLowerCase();
    return (
      COLORS.find((color) => color.name === needle) ??
      COLORS.find((color) => color.name.toLowerCase() === lower) ??
      COLORS.find((color) => color.pinyin.toLowerCase() === lower) ??
      COLORS.find((color) => color.hex.toLowerCase() === lower || color.hex.toLowerCase() === `#${lower}`)
    );
  } catch {
    return undefined;
  }
}

const App: React.FC = () => {
  const [selected, setSelected] = useState<IColor>(() => colorFromUrl() ?? COLORS[0]);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(readFavorites);
  const [showAbout, setShowAbout] = useState(false);
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);

  const toastTimer = useRef<number | undefined>(undefined);
  const searchRef = useRef<HTMLInputElement>(null);

  const notify = useCallback((message: string) => {
    window.clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), message });
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
  }, []);

  const copy = useCallback(
    async (text: string, message: string) => {
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          throw new Error('clipboard unavailable');
        }
        notify(message);
      } catch {
        const area = document.createElement('textarea');
        area.value = text;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        const ok = document.execCommand('copy');
        area.remove();
        notify(ok ? message : '复制失败，请长按选择文本');
      }
    },
    [notify]
  );

  const searchMatched = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return COLORS;
    const compact = needle.replace(/\s+/g, '');
    return COLORS.filter((color) => {
      const rgb = color.RGB.join(',');
      return (
        color.name.includes(needle) ||
        color.pinyin.toLowerCase().includes(compact) ||
        color.hex.toLowerCase().includes(needle) ||
        rgb.includes(compact) ||
        rgb.replace(/,/g, ', ').includes(needle)
      );
    });
  }, [query]);

  const visible = useMemo(() => {
    if (filter === 'all') return searchMatched;
    if (filter === 'favorites') {
      const saved = new Set(favorites);
      return searchMatched.filter((color) => saved.has(color.name));
    }
    return searchMatched.filter((color) => FAMILY_BY_NAME.get(color.name) === filter);
  }, [searchMatched, filter, favorites]);

  const counts = useMemo(() => {
    const result: Record<FilterKey, number> = {
      all: searchMatched.length,
      favorites: 0,
      red: 0,
      orange: 0,
      green: 0,
      cyan: 0,
      purple: 0,
      neutral: 0,
    };
    const saved = new Set(favorites);
    for (const color of searchMatched) {
      const family = FAMILY_BY_NAME.get(color.name);
      if (family) result[family] += 1;
      if (saved.has(color.name)) result.favorites += 1;
    }
    return result;
  }, [searchMatched, favorites]);

  const isFavorite = favorites.includes(selected.name);

  const selectColor = useCallback((color: IColor) => setSelected(color), []);

  const toggleFavorite = useCallback((name: string) => {
    setFavorites((previous) =>
      previous.includes(name) ? previous.filter((item) => item !== name) : [...previous, name]
    );
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch {
      /* private mode: favourites simply do not persist */
    }
  }, [favorites]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === FAVORITES_KEY) setFavorites(readFavorites());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--bg-color', `${selected.hex}14`);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', selected.hex);
  }, [selected]);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get('color') === selected.name) return;
    url.searchParams.set('color', selected.name);
    window.history.replaceState(null, '', url);
  }, [selected]);

  const randomColor = useCallback(() => {
    const pool = visible.length > 1 ? visible : COLORS;
    let pick = pool[Math.floor(Math.random() * pool.length)];
    if (pool.length > 1 && pick.name === selected.name) {
      pick = pool[(pool.indexOf(pick) + 1) % pool.length];
    }
    setSelected(pick);
  }, [visible, selected.name]);

  const share = useCallback(async () => {
    const url = `${window.location.origin}${window.location.pathname}?color=${encodeURIComponent(
      selected.name
    )}`;
    const text = `${selected.name} ${selected.hex.toUpperCase()} · 中国传统色`;
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: text, text, url });
        return;
      } catch (error) {
        if ((error as DOMException)?.name === 'AbortError') return;
      }
    }
    await copy(url, '链接已复制，发给朋友即可直达此色');
  }, [selected, copy]);

  const visibleCss = useMemo(() => {
    if (!showAbout) return '';
    const seen = new Set<string>();
    const lines: string[] = [];
    for (const color of visible) {
      const name = cssVarName(color);
      if (seen.has(name)) continue;
      seen.add(name);
      lines.push(`  ${name}: ${color.hex};`);
    }
    return `:root {\n${lines.join('\n')}\n}`;
  }, [showAbout, visible]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showAbout) setShowAbout(false);
        else (document.activeElement as HTMLElement | null)?.blur();
        return;
      }
      if (showAbout) return;
      const target = event.target as HTMLElement | null;
      const typing =
        !!target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (typing) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const list = visible.length ? visible : COLORS;
      const index = list.findIndex((color) => color.name === selected.name);

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          setSelected(list[(index + 1 + list.length) % list.length]);
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          setSelected(list[(index - 1 + list.length) % list.length]);
          break;
        case 'r':
        case 'R':
          event.preventDefault();
          randomColor();
          break;
        case 'f':
        case 'F':
          event.preventDefault();
          toggleFavorite(selected.name);
          break;
        case '/':
          event.preventDefault();
          searchRef.current?.focus();
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showAbout, visible, selected.name, randomColor, toggleFavorite]);

  return (
    <div className="flex min-h-[100svh] flex-col font-serif lg:h-[100svh] lg:flex-row lg:overflow-hidden">
      <Hero
        color={selected}
        favorite={isFavorite}
        onToggleFavorite={() => toggleFavorite(selected.name)}
        onShare={share}
        onRandom={randomColor}
        onAbout={() => setShowAbout(true)}
        onCopy={copy}
      />

      <section className="relative z-10 -mt-5 flex min-h-0 flex-1 flex-col rounded-t-[26px] bg-[#f7f4ed] shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.18)] lg:mt-0 lg:h-screen lg:w-1/2 lg:overflow-y-auto lg:rounded-none lg:bg-white/40 lg:shadow-none lg:backdrop-blur-xl">
        <header className="flex items-end justify-between px-4 pb-1 pt-5 lg:px-12 lg:pt-10">
          <div>
            <h2 className="text-[22px] font-bold leading-tight text-neutral-800 lg:text-4xl">
              中国传统色
            </h2>
            <p className="mt-1 text-[9px] uppercase tracking-[0.26em] text-neutral-400 lg:text-[10px]">
              Traditional Chinese Colors · {COLORS.length}
            </p>
          </div>
          <p className="hidden text-[10px] tracking-[0.18em] text-neutral-400 lg:block">
            {visible.length} 色
          </p>
        </header>

        <FilterBar
          selected={selected}
          favorite={isFavorite}
          onToggleFavorite={() => toggleFavorite(selected.name)}
          onRandom={randomColor}
          query={query}
          onQuery={setQuery}
          filter={filter}
          onFilter={setFilter}
          counts={counts}
          resultCount={visible.length}
          searchRef={searchRef}
        />

        <div className="grid grid-cols-4 gap-x-2 gap-y-3 px-4 pb-6 pt-4 sm:grid-cols-5 sm:gap-x-3 lg:grid-cols-4 lg:gap-4 lg:px-12 xl:grid-cols-5">
          {visible.map((color) => (
            <ColorCard
              key={color.name}
              color={color}
              selected={selected.name === color.name}
              favorite={favorites.includes(color.name)}
              onSelect={selectColor}
              onToggleFavorite={toggleFavorite}
            />
          ))}

          {visible.length === 0 && (
            <div className="col-span-full flex flex-col items-center gap-3 px-6 py-16 text-center">
              <SearchX size={26} className="text-neutral-300" />
              <p className="text-sm text-neutral-500">
                {filter === 'favorites' && !query
                  ? '还没有收藏。'
                  : `没有找到「${query.trim()}」相关的颜色。`}
              </p>
              <p className="max-w-[18rem] text-xs leading-5 text-neutral-400">
                {filter === 'favorites' && !query
                  ? '点开喜欢的颜色，按「收藏」或色卡右上角的 ♥，它们就会出现在这里。'
                  : '试试色名、拼音，或 HEX / RGB 数值，例如「月白」「yuebai」「#eef7f2」。'}
              </p>
              {(filter !== 'all' || query) && (
                <button
                  type="button"
                  onClick={() => {
                    setFilter('all');
                    setQuery('');
                  }}
                  className="mt-1 flex h-10 items-center gap-1.5 rounded-full bg-neutral-900 px-5 text-xs text-white"
                >
                  <Heart size={13} />
                  查看全部 {COLORS.length} 色
                </button>
              )}
            </div>
          )}
        </div>

        <footer className="mt-auto border-t border-black/[0.06] px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-8 text-center text-[9px] uppercase tracking-[0.3em] text-neutral-400 lg:px-12">
          © {new Date().getFullYear()} ChinaColor / Heritage of Aesthetics
        </footer>
      </section>

      <AboutDialog
        open={showAbout}
        onClose={() => setShowAbout(false)}
        current={selected}
        visibleCount={visible.length}
        totalCount={COLORS.length}
        visibleCss={visibleCss}
        onCopy={copy}
      />

      {toast && (
        <div
          key={toast.id}
          role="status"
          aria-live="polite"
          className="animate-toast-in fixed inset-x-0 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-[60] mx-auto flex w-fit max-w-[92vw] items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-xs tracking-wide text-white shadow-xl"
        >
          <Check size={14} className="shrink-0 text-emerald-400" />
          <span className="truncate">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default App;
