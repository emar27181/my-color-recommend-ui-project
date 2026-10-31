/**
 * MD2D の foundation/Icon、atoms/Button、IconButton、SwatchButton の
 * インターフェースと役割を V2 名前空間に移植。別リポジトリなので依存は独立。
 */
import type { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, ChangeEventHandler, ReactNode } from 'react';
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

/** A single raw user-color surface; size and selected state are determined by tokens. */
export function SwatchSurface({ color, checked = false }: { color: string; checked?: boolean }) {
  return (
    <span className="crv2-swatch-surface" style={{ backgroundColor: color }} data-selected={checked ? 'true' : undefined} aria-hidden="true">
      {checked && <span className="crv2-swatch__check"><Icon name="done" /></span>}
    </span>
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
      <SwatchSurface color={hex} checked={checked} />
    </button>
  );
}

/** MD2D の raw-controls 規則: 入力UIは atom に集約する。 */
export function TextField(props: Omit<InputHTMLAttributes<HTMLInputElement>, 'className'>) {
  return <input {...props} className="crv2-textfield" />;
}

export function ColorInput({ label, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className' | 'aria-label'> & { label: string }) {
  return <input {...props} type="color" aria-label={label} />;
}

export function SelectField({ children, ...props }: Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'>) {
  return <select {...props} className="crv2-select">{children}</select>;
}

export function FileInput({
  id, label, disabled, onChange,
}: {
  id: string;
  label: string;
  disabled?: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <label className="crv2-picker-file" htmlFor={id}>
      <Icon name="image" />
      <span>{label}</span>
      <input id={id} className="crv2-inputfile" type="file" accept="image/*" onChange={onChange} disabled={disabled} />
    </label>
  );
}

export function CopyColorButton({
  color, label, onCopy, className = '',
}: {
  color: string;
  label: string;
  onCopy: (color: string) => void;
  className?: string;
}) {
  return (
    <button type="button" className={'crv2-copy-code crv2-code ' + className}
      title={label + ' ' + color} aria-label={label + ' ' + color}
      onClick={() => onCopy(color)}>
      <span>{color}</span><Icon name="copy" size="xs" />
    </button>
  );
}

export function ExtractedSwatchButton({ color, label, onSelect }: {
  color: string;
  label: string;
  onSelect: () => void;
}) {
  return (
    <button type="button" className="crv2-extracted-btn"
      onClick={onSelect} aria-label={label + ' ' + color} title={color}>
      <SwatchSurface color={color} />
    </button>
  );
}
