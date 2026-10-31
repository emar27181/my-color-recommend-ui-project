import { useEffect, useId, useRef, useState } from 'react';
import { COLOR_PICKER, hslPickerHex, pickerHueOf } from './md2d/design/color-picker';
import { ColorInput, IconButton, SwatchButton, TextField } from './components';
import { normalizeHex } from './paletteExport';
import type { V2Strings } from './design/copy';

/**
 * MD2D components/molecules/ColorPicker.tsx ported to V2's Atom/MD2D tokens.
 * The selector never uses native input[type=color]; controls are consistent
 * across browsers. Presets and conversions are identical to MD2D develop.
 */
export function ColorPicker({ value, onChange, onCopy, copy }: {
  value: string;
  onChange: (hex: string) => void;
  onCopy: (hex: string) => void;
  copy: V2Strings;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const inputId = useId();
  const [hexDraft, setHexDraft] = useState(value.toUpperCase());
  const [pickerDraft, setPickerDraft] = useState(value.toUpperCase());
  const [hue, setHue] = useState(() => pickerHueOf(value));
  const open = () => {
    setPickerDraft(value.toUpperCase());
    setHue(pickerHueOf(value));
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();
  useEffect(() => { setHexDraft(value.toUpperCase()); }, [value]);

  const choose = (color: string) => {
    const hex = normalizeHex(color);
    if (!hex) return;
    setPickerDraft(hex);
    setHexDraft(hex);
    onChange(hex);
  };
  const editMain = (value: string) => {
    setHexDraft(value.toUpperCase());
    const valid = normalizeHex(value);
    if (valid && valid.length === 7 && value.trim().replace('#', '').length === 6) onChange(valid);
  };
  const editPicker = (value: string) => {
    setPickerDraft(value.toUpperCase());
    const valid = normalizeHex(value);
    if (valid && value.trim().replace('#', '').length === 6) {
      onChange(valid);
      setHue(pickerHueOf(valid));
    }
  };
  return (
    <>
      <div className="crv2-picker-row">
        <ColorInput value={value} label={copy.openPicker} onOpen={open} />
        <label htmlFor={inputId} className="crv2-sr-only">{copy.input}</label>
        <TextField id={inputId} value={hexDraft}
          onChange={event => editMain(event.target.value)}
          onBlur={() => setHexDraft(value.toUpperCase())}
          spellCheck={false} maxLength={7} inputMode="text" autoComplete="off" />
        <IconButton icon="copy" label={copy.copy} onClick={() => onCopy(value)} />
      </div>
      <dialog ref={dialog} className="crv2-color-dialog" aria-labelledby={titleId}
        onClick={event => { if (event.target === event.currentTarget) close(); }}>
        <div className="crv2-color-dialog__content">
          <div className="crv2-color-dialog__head">
            <h2 id={titleId}>{copy.openPicker}</h2>
            <IconButton icon="close" label={copy.close} onClick={close} />
          </div>
          <div className="crv2-picker-row">
            <span className="crv2-picker-preview" style={{ backgroundColor: value }} aria-hidden="true" />
            <TextField value={pickerDraft} onChange={event => editPicker(event.target.value)}
              aria-label={copy.input} spellCheck={false} maxLength={7} inputMode="text" />
          </div>
          <section className="crv2-picker-section" aria-label={copy.pickerHue}>
            <h3>{copy.pickerHue}</h3>
            <div className="crv2-picker-grid" role="radiogroup" aria-label={copy.pickerHue}>
              {COLOR_PICKER.hues.map(angle => {
                const hex = '#' + hslPickerHex(angle, COLOR_PICKER.defaultSaturation, COLOR_PICKER.defaultLightness);
                return (
                  <SwatchButton key={angle} hex={hex} label={copy.pickerHue + ' ' + angle + '°'}
                    checked={hue === angle} onSelect={() => { setHue(angle); choose(hex); }} />
                );
              })}
            </div>
          </section>
          <section className="crv2-picker-section" aria-label={copy.pickerTone}>
            <h3>{copy.pickerTone}</h3>
            <div className="crv2-picker-grid" role="radiogroup" aria-label={copy.pickerTone}>
              {COLOR_PICKER.tones.map(tone => {
                const hex = '#' + hslPickerHex(hue, tone.saturation, tone.lightness);
                return (
                  <SwatchButton key={tone.id} hex={hex} label={copy.pickerTone + ' ' + tone.id}
                    checked={hex === value.toUpperCase()} onSelect={() => choose(hex)} />
                );
              })}
            </div>
          </section>
          <section className="crv2-picker-section" aria-label={copy.pickerNeutral}>
            <h3>{copy.pickerNeutral}</h3>
            <div className="crv2-picker-grid" role="radiogroup" aria-label={copy.pickerNeutral}>
              {COLOR_PICKER.neutral.map(color => (
                <SwatchButton key={color} hex={'#' + color} label={'#' + color}
                  checked={'#' + color === value.toUpperCase()} onSelect={() => choose('#' + color)} />
              ))}
            </div>
          </section>
        </div>
      </dialog>
    </>
  );
}
