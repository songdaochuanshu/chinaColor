import { memo } from 'react';
import { Heart } from 'lucide-react';
import { readableOn } from '../lib/colors';
import type { IColor } from '../types';

interface ColorCardProps {
  color: IColor;
  selected: boolean;
  favorite: boolean;
  onSelect: (color: IColor) => void;
  onToggleFavorite: (name: string) => void;
}

const ColorCard: React.FC<ColorCardProps> = ({
  color,
  selected,
  favorite,
  onSelect,
  onToggleFavorite,
}) => {
  const ink = readableOn(color.hex);
  const showHeart = favorite || selected;

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={() => onSelect(color)}
        aria-pressed={selected}
        aria-label={`${color.name} ${color.hex.toUpperCase()}`}
        className="flex w-full flex-col items-center focus:outline-none focus-visible:opacity-80"
      >
        <span
          className={`relative flex w-full items-center justify-center overflow-hidden rounded-[3px] transition-[transform,box-shadow] duration-200 ease-out active:scale-[0.97] ${
            selected
              ? 'scale-[1.03] ring-2 ring-neutral-900/70'
              : 'group-hover:-translate-y-0.5 group-hover:shadow-md'
          }`}
          style={{
            backgroundColor: color.hex,
            aspectRatio: '2 / 3',
            boxShadow: selected ? `0 10px 22px -10px ${color.hex}` : undefined,
          }}
        >
          <span
            className="vertical-text text-[11px] font-medium leading-none tracking-[0.18em] sm:text-xs"
            style={{ color: ink.fg }}
          >
            {color.name}
          </span>
        </span>
        <span
          className={`mt-1 text-[9px] uppercase tracking-tight transition-colors ${
            selected ? 'text-neutral-700' : 'text-neutral-400'
          }`}
        >
          {color.hex.toUpperCase()}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onToggleFavorite(color.name)}
        aria-label={favorite ? `取消收藏 ${color.name}` : `收藏 ${color.name}`}
        aria-pressed={favorite}
        className={`absolute right-0 top-0 grid h-9 w-9 place-items-center rounded-bl-md transition-opacity ${
          showHeart ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100'
        }`}
      >
        <Heart
          size={13}
          className={favorite ? 'fill-current drop-shadow-sm' : 'drop-shadow-sm'}
          style={{ color: ink.fg }}
        />
      </button>
    </div>
  );
};

export default memo(ColorCard);
