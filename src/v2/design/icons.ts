/**
 * MD2D src/design/icons.ts を基準にした V2 専用アイコン登録簿。
 * Lucide の直接 import はこのファイルのみ。旧 UI には適用しない。
 */
import { Palette, ArrowLeft, Copy, Check, Plus, Trash2, ArrowUp, ArrowDown, ArrowRight, Ellipsis, Upload, ImageDown, Clipboard, Download, Sun, Moon, Info, ImagePlus, ChevronDown, type LucideIcon } from 'lucide-react';

export const ICONS = {
  design: Palette,
  back: ArrowLeft,
  copy: Copy,
  done: Check,
  add: Plus,
  trash: Trash2,
  moveUp: ArrowUp,
  moveDown: ArrowDown,
  moveLeft: ArrowLeft,
  moveRight: ArrowRight,
  more: Ellipsis,
  upload: Upload,
  export: ImageDown,
  imageCopy: Clipboard,
  download: Download,
  appearanceLight: Sun,
  appearanceDark: Moon,
  notice: Info,
  image: ImagePlus,
  expand: ChevronDown,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
