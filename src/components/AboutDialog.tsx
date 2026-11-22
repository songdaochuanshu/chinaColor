import { useEffect, useRef } from 'react';
import { Copy, X } from 'lucide-react';
import { cssVarName } from '../lib/colors';
import type { IColor } from '../types';

interface AboutDialogProps {
  open: boolean;
  onClose: () => void;
  current: IColor;
  visibleCount: number;
  totalCount: number;
  visibleCss: string;
  onCopy: (text: string, message: string) => void;
}

const SHORTCUTS: { keys: string[]; label: string }[] = [
  { keys: ['←', '↑'], label: '上一色' },
  { keys: ['→', '↓'], label: '下一色' },
  { keys: ['R'], label: '随机一色' },
  { keys: ['F'], label: '收藏 / 取消收藏' },
  { keys: ['/'], label: '聚焦搜索' },
  { keys: ['Esc'], label: '关闭弹窗' },
];

const AboutDialog: React.FC<AboutDialogProps> = ({
  open,
  onClose,
  current,
  visibleCount,
  totalCount,
  visibleCss,
  onCopy,
}) => {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(() => closeRef.current?.focus(), 80);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(timer);
    };
  }, [open]);

  if (!open) return null;

  const currentVar = `  ${cssVarName(current)}: ${current.hex};`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-title"
    >
      <div
        className="animate-fade-in absolute inset-0 bg-neutral-900/45 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="animate-sheet-up relative flex max-h-[88svh] w-full max-w-lg flex-col overflow-y-auto rounded-t-3xl bg-[#faf7f0] px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 shadow-2xl sm:rounded-3xl sm:px-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[9px] uppercase tracking-[0.35em] text-neutral-400">
              About ChinaColor
            </p>
            <h2 id="about-title" className="mt-1 text-xl font-bold text-neutral-800">
              关于中国传统色
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="关闭"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-black/[0.08] bg-white/70 text-neutral-500"
          >
            <X size={16} />
          </button>
        </div>

        <p className="mt-4 text-[13px] leading-6 text-neutral-600">
          中国传统色源自山川草木、器物与诗文：天青取自雨后长空，月白是月光落在白衣上的颜色，朱砂来自矿石。色名之外，还有一整套关于季节、火候与心境的讲究。
        </p>
        <p className="mt-2 text-[13px] leading-6 text-neutral-600">
          本站收录 {totalCount} 种传统色，提供 HEX、RGB、CMYK 数值，供设计、开发与爱好者查阅。当前筛选下有{' '}
          {visibleCount} 色。
        </p>

        <div className="mt-5 rounded-2xl border border-black/[0.06] bg-white/60 p-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
            快捷操作
          </h3>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5">
            {SHORTCUTS.map((item) => (
              <li key={item.label} className="flex items-center gap-2 text-[12px] text-neutral-600">
                <span className="flex gap-1">
                  {item.keys.map((key) => (
                    <kbd
                      key={key}
                      className="grid h-6 min-w-6 place-items-center rounded-md border border-neutral-300/70 bg-white px-1.5 text-[11px] font-sans text-neutral-600 shadow-sm"
                    >
                      {key}
                    </kbd>
                  ))}
                </span>
                {item.label}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] leading-5 text-neutral-400">
            键盘操作在电脑上使用；手机上直接点按色卡、胶囊筛选条即可。
          </p>
        </div>

        <div className="mt-4 rounded-2xl border border-black/[0.06] bg-white/60 p-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
            CSS 变量
          </h3>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-neutral-900 p-3 text-[11px] leading-5 text-neutral-200">
            <code>
              {':root {\n'}
              {currentVar}
              {'\n}'}
            </code>
          </pre>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => onCopy(`:root {\n${currentVar}\n}`, `${current.name} 的 CSS 变量已复制`)}
              className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-neutral-900 text-xs text-white active:scale-[0.98]"
            >
              <Copy size={13} />
              复制当前色
            </button>
            <button
              type="button"
              onClick={() =>
                onCopy(visibleCss, `已复制 ${visibleCount} 个 CSS 变量`)
              }
              className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full border border-neutral-300/80 bg-white text-xs text-neutral-700 active:scale-[0.98]"
            >
              <Copy size={13} />
              复制全部 {visibleCount} 色
            </button>
          </div>
        </div>

        <p className="mt-5 text-center text-[10px] uppercase tracking-[0.3em] text-neutral-400">
          Heritage of Aesthetics · {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default AboutDialog;
