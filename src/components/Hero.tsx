import { useEffect, useState } from 'react';
import { Check, Heart, Info, Share2, Shuffle } from 'lucide-react';
import { cmykString, readableOn, rgbString } from '../lib/colors';
import type { IColor } from '../types';

type CopyField = 'hex' | 'rgb' | 'cmyk';

interface HeroProps {
  color: IColor;
  favorite: boolean;
  onToggleFavorite: () => void;
  onShare: () => void;
  onRandom: () => void;
  onAbout: () => void;
  onCopy: (text: string, message: string) => void;
}

function nameSizeClass(name: string): string {
  if (name.length <= 2) return 'text-[3rem] sm:text-6xl lg:text-9xl';
  if (name.length === 3) return 'text-[2.6rem] sm:text-5xl lg:text-8xl';
  if (name.length === 4) return 'text-[2.15rem] sm:text-[2.75rem] lg:text-7xl';
  return 'text-[1.95rem] sm:text-5xl lg:text-6xl';
}

const Hero: React.FC<HeroProps> = ({
  color,
  favorite,
  onToggleFavorite,
  onShare,
  onRandom,
  onAbout,
  onCopy,
}) => {
  const ink = readableOn(color.hex);
  const [copied, setCopied] = useState<CopyField | null>(null);

  useEffect(() => {
    setCopied(null);
  }, [color.name]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(null), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copyField = (field: CopyField, text: string, label: string) => {
    onCopy(text, `${label} 已复制`);
    setCopied(field);
  };

  // Translucent white reads cleanly on both pale and deep colours; the ink
  // fill would turn a cream hero into grey mud.
  const softBorder = ink.isLight ? 'rgba(28, 25, 23, 0.12)' : 'rgba(255, 255, 255, 0.28)';
  const softFill = ink.isLight ? 'rgba(255, 255, 255, 0.55)' : 'rgba(255, 255, 255, 0.16)';
  const inkStyle = { color: ink.fg };
  const codeStyle = { '--chip-bg': softFill, '--chip-border': softBorder } as React.CSSProperties;

  const actionClass =
    'flex h-11 flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-full border px-2 text-[12px] tracking-wide transition-transform active:scale-95 lg:flex-none lg:gap-1.5 lg:px-5 lg:text-xs';

  return (
    <section
      className="relative isolate flex shrink-0 flex-col justify-center overflow-hidden px-5 pb-6 pt-8 transition-colors duration-500 sm:px-8 lg:h-screen lg:w-1/2 lg:min-h-0 lg:justify-center lg:p-16"
      style={{ backgroundColor: color.hex }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -right-12 select-none text-[15rem] font-bold leading-none lg:-bottom-32 lg:-right-28 lg:text-[30rem]"
        style={{ color: ink.isLight ? '#ffffff' : ink.fg, opacity: ink.isLight ? 0.4 : 0.07 }}
      >
        {color.name[0]}
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 0%, rgba(255,255,255,0.22), rgba(255,255,255,0) 62%)',
        }}
      />

      <div className="relative flex flex-col items-center text-center" style={inkStyle}>
        <p className="mb-3 text-[9px] font-light uppercase tracking-[0.42em] opacity-60 lg:mb-10 lg:text-[10px]">
          中国传统色 · Chinacolor
        </p>
        <div key={color.name} className="animate-hero-in flex flex-col items-center">
          <h1
            className={`${nameSizeClass(color.name)} lg-vertical font-bold leading-none tracking-[0.06em] lg:mb-8 lg:tracking-tight`}
          >
            {color.name}
          </h1>
          <p className="mt-3 text-[10px] font-light uppercase tracking-[0.42em] opacity-70 lg:mt-0 lg:text-xl lg:tracking-[0.5em]">
            {color.pinyin}
          </p>
        </div>
      </div>

      <div className="relative mx-auto mt-6 w-full max-w-[28rem] lg:mt-12 lg:max-w-lg" style={inkStyle}>
        <div
          className="grid w-full grid-cols-3 gap-2 lg:gap-x-8 lg:border-t lg:pt-8"
          style={{ borderTopColor: softBorder }}
        >
          <button
            type="button"
            onClick={() => copyField('hex', color.hex.toUpperCase(), 'HEX')}
            className="code-chip flex min-w-0 flex-col items-start gap-0.5 rounded-xl border px-3 py-2 text-left transition-colors active:opacity-70 lg:px-0 lg:py-0"
            style={codeStyle}
          >
            <span className="flex items-center gap-1 text-[9px] uppercase tracking-[0.22em] opacity-60">
              HEX
              {copied === 'hex' && <Check size={10} />}
            </span>
            <span className="w-full truncate text-[13px] font-light tracking-wide sm:text-sm lg:text-2xl">
              {color.hex.toUpperCase()}
            </span>
          </button>

          <button
            type="button"
            onClick={() => copyField('rgb', rgbString(color), 'RGB')}
            className="code-chip flex min-w-0 flex-col items-start gap-0.5 rounded-xl border px-3 py-2 text-left transition-colors active:opacity-70 lg:px-0 lg:py-0"
            style={codeStyle}
          >
            <span className="flex items-center gap-1 text-[9px] uppercase tracking-[0.22em] opacity-60">
              RGB
              {copied === 'rgb' && <Check size={10} />}
            </span>
            <span className="w-full truncate text-[12px] font-light tracking-wide sm:text-sm lg:text-lg">
              {color.RGB.join(', ')}
            </span>
          </button>

          <button
            type="button"
            onClick={() => copyField('cmyk', cmykString(color), 'CMYK')}
            className="code-chip flex min-w-0 flex-col items-start gap-0.5 rounded-xl border px-3 py-2 text-left transition-colors active:opacity-70 lg:px-0 lg:py-0"
            style={codeStyle}
          >
            <span className="flex items-center gap-1 text-[9px] uppercase tracking-[0.22em] opacity-60">
              CMYK
              {copied === 'cmyk' && <Check size={10} />}
            </span>
            <span className="w-full truncate text-[12px] font-light tracking-wide sm:text-sm lg:text-lg">
              {color.CMYK.join(', ')}
            </span>
          </button>
        </div>

        <div className="mt-3 flex items-stretch gap-2 lg:mt-7">
          <button
            type="button"
            onClick={onToggleFavorite}
            aria-pressed={favorite}
            className={actionClass}
            style={{
              color: favorite ? color.hex : ink.fg,
              backgroundColor: favorite ? ink.fg : softFill,
              borderColor: softBorder,
            }}
          >
            <Heart size={15} className={favorite ? 'fill-current' : undefined} />
            {favorite ? '已收藏' : '收藏'}
          </button>
          <button
            type="button"
            onClick={onShare}
            className={actionClass}
            style={{ color: ink.fg, backgroundColor: softFill, borderColor: softBorder }}
          >
            <Share2 size={15} />
            分享
          </button>
          <button
            type="button"
            onClick={onRandom}
            className={actionClass}
            style={{ color: ink.fg, backgroundColor: softFill, borderColor: softBorder }}
          >
            <Shuffle size={15} />
            随机
          </button>
          <button
            type="button"
            onClick={onAbout}
            className={actionClass}
            style={{ color: ink.fg, backgroundColor: softFill, borderColor: softBorder }}
          >
            <Info size={15} />
            关于
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
