/**
 * MD2D-style molecules: one swatch presentation for recommendation and saved palettes.
 * Color values are domain data; dimensions, interaction states and spacing come from tokens.
 */
import { CopyColorButton, IconButton, IconMenu, SwatchButton, SwatchSurface } from './components';
import type { V2Strings } from './design/copy';

export interface RecommendationColorTileProps {
  color: string;
  active: boolean;
  caption: string;
  onPick: () => void;
  onCopy: (color: string) => void;
  copyLabel: string;
}

export function RecommendationColorTile({
  color, active, caption, onPick, onCopy, copyLabel,
}: RecommendationColorTileProps) {
  return (
    <div className="crv2-color-tile" data-component="recommendation-color-tile">
      <SwatchButton hex={color} label={caption} checked={active} onSelect={onPick} />
      <div className="crv2-color-code-row">
        <CopyColorButton color={color} label={copyLabel} onCopy={onCopy} />
      </div>
    </div>
  );
}

export interface PaletteColorCardProps {
  color: string;
  index: number;
  count: number;
  copy: V2Strings;
  onCopy: (color: string) => void;
  onMove: (index: number, offset: number) => void;
  onRemove: (index: number) => void;
}

export function PaletteColorCard({
  color, index, count, copy, onCopy, onMove, onRemove,
}: PaletteColorCardProps) {
  return (
    <div className="crv2-palette-card" data-component="palette-color-card">
      <SwatchSurface color={color} />
      <div className="crv2-palette-card__footer">
        <CopyColorButton color={color} label={copy.copy} onCopy={onCopy} />
        <IconMenu label={copy.moreActions + ' ' + color}>
          <div className="crv2-palette-actions" role="group" aria-label={color}>
            <IconButton icon="moveLeft" label={copy.up} disabled={index === 0}
              onClick={() => onMove(index, -1)} />
            <IconButton icon="moveRight" label={copy.down} disabled={index === count - 1}
              onClick={() => onMove(index, 1)} />
            <IconButton icon="trash" label={copy.remove + ' ' + color}
              onClick={() => onRemove(index)} />
          </div>
        </IconMenu>
      </div>
    </div>
  );
}
