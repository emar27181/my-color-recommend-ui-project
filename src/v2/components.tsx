/**
 * MD2D の foundation/Icon、atoms/Button、IconButton、SwatchButton の
 * インターフェースと役割を V2 名前空間に移植。別リポジトリなので依存は独立。
 */
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { ICONS, type IconName, type IconSize } from './design/icons';

export function Icon({ name, size = 'md' }: { name: IconName; size?: IconSize }) {
  const Glyph = ICONS[name];
  return <Glyph className={'crv2-icon crv2-icon--' + size} aria-hidden="true" focusable="false" />;
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon: IconName;
  children: ReactNode;
}

export function Button({ variant = 'secondary', size = 'md', icon, children, type = 'button', ...rest }: ButtonProps) {
  return (
    <button {...rest} type={type} className={'crv2-btn crv2-btn--' + variant + ' crv2-btn--' + size}>
      <Icon name={icon} />
      <span>{children}</span>
    </button>
  );
}

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> {
  icon: IconName;
  label: string;
  size?: ButtonSize;
}

export function IconButton({ icon, label, size = 'md', type = 'button', ...rest }: IconButtonProps) {
  return (
    <button {...rest} type={type} className={'crv2-iconbtn crv2-iconbtn--' + size} aria-label={label} title={label}>
      <Icon name={icon} />
    </button>
  );
}

interface SwatchButtonProps {
  hex: string;
  label: string;
  checked?: boolean;
  onSelect: () => void;
}
export function SwatchButton({ hex, label, checked, onSelect }: SwatchButtonProps) {
  return (
    <button
      type="button" role="radio" aria-checked={Boolean(checked)}
      aria-label={label + ' ' + hex} title={label + ' ' + hex}
      className="crv2-swatch" data-selected={checked ? 'true' : undefined}
      onClick={onSelect}
    >
      <span className="crv2-swatch__chip" style={{ backgroundColor: hex }}>
        {checked && <span className="crv2-swatch__check"><Icon name="done" /></span>}
      </span>
    </button>
  );
}
