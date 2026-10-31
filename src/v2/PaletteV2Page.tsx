import { useEffect, useState, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { COLOR_SCHEMES, useColorStore } from '@/store/colorStore';
import { extractColorsFromImage } from '@/lib/colorExtractor';
import { Button, Icon, IconButton, SwatchButton, TextField, ColorInput, SelectField, FileInput, CopyColorButton, ExtractedSwatchButton } from './components';
import { V2_COPY, type V2Strings } from './design/copy';
import {
  PALETTE_SPEC, normalizeHex, sanitizedPalette, addPaletteColor,
  movePaletteColor, downloadPalette, copyPaletteImage,
  type ExportMode,
} from './paletteExport';
import './design/tokens.css';
import './design/breakpoints.css';

function loadPalette(): string[] {
  try {
    return sanitizedPalette(JSON.parse(localStorage.getItem(PALETTE_SPEC.storageKey) || '[]'));
  } catch {
    return [];
  }
}

function loadTheme(): 'light' | 'dark' {
  try {
    const preference = localStorage.getItem(PALETTE_SPEC.themeKey);
    if (preference === 'light' || preference === 'dark') return preference;
  } catch {
    // Storage can be blocked; prefer dark as MD2D's default.
  }
  return 'dark';
}

interface ColorTileProps {
  color: string;
  active: boolean;
  caption: string;
  onPick: () => void;
  onCopy: (color: string) => void;
  copyLabel: string;
}

function ColorTile({ color, active, caption, onPick, onCopy, copyLabel }: ColorTileProps) {
  return (
    <div className="crv2-color-tile">
      <SwatchButton hex={color} label={caption} checked={active} onSelect={onPick} />
      <div className="crv2-color-code-row">
        <CopyColorButton color={color} label={copyLabel} onCopy={onCopy} />
      </div>
    </div>
  );
}

function PaletteActions({
  colors, mode, setMode, busy, onSave, onCopy, copy,
}: {
  colors: string[];
  mode: ExportMode;
  setMode: (mode: ExportMode) => void;
  busy: boolean;
  onSave: () => void;
  onCopy: () => void;
  copy: V2Strings;
}) {
  const disabled = !colors.length || busy;
  return (
    <>
      <div>
        <label htmlFor="v2-export-mode" className="crv2-inputlabel">{copy.exportMode}</label>
        <SelectField id="v2-export-mode" value={mode} onChange={e => setMode(e.target.value as ExportMode)}>
          <option value="solid">{copy.strip}</option>
          <option value="labeled">{copy.labeled}</option>
        </SelectField>
      </div>
      <div className="crv2-control-row">
        <Button icon="download" variant="primary" disabled={disabled} onClick={onSave}>{copy.export}</Button>
        <Button icon="imageCopy" disabled={disabled} onClick={onCopy}>{copy.copyImage}</Button>
      </div>
      {disabled && !busy && <p className="crv2-muted">{copy.noColor}</p>}
    </>
  );
}

export default function PaletteV2Page() {
  const { i18n } = useTranslation();
  const copy: V2Strings = V2_COPY[i18n.language.startsWith('en') ? 'en' : 'ja'];
  const {
    baseColor, selectedColor, paintColor, selectedScheme, recommendedColors,
    recommendedTones, setColorFromBase, setSelectedScheme,
    setColorFromRecommendation, setPaintColor, setExtractedColors,
  } = useColorStore();
  const [palette, setPalette] = useState<string[]>(loadPalette);
  const [theme, setTheme] = useState<'light' | 'dark'>(loadTheme);
  const [baseDraft, setBaseDraft] = useState(baseColor.toUpperCase());
  const [exportMode, setExportMode] = useState<ExportMode>('solid');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [extractedColors, setExtracted] = useState<string[]>([]);

  useEffect(() => {
    try { localStorage.setItem(PALETTE_SPEC.storageKey, JSON.stringify(palette)); } catch { /* storage unavailable */ }
  }, [palette]);
  useEffect(() => {
    try { localStorage.setItem(PALETTE_SPEC.themeKey, theme); } catch { /* storage unavailable */ }
  }, [theme]);
  useEffect(() => setBaseDraft(baseColor.toUpperCase()), [baseColor]);

  const changeBase = (color: string) => {
    const normalized = normalizeHex(color);
    if (!normalized) { setBaseDraft(baseColor.toUpperCase()); return; }
    setBaseDraft(normalized);
    setColorFromBase(normalized);
    setNotice('');
  };
  const copyHex = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color.toUpperCase());
      setNotice(copy.copied + ': ' + color.toUpperCase());
    } catch {
      setNotice(copy.copyFailed);
    }
  };
  const addColor = (color: string) => {
    const normalized = normalizeHex(color);
    if (!normalized) return;
    if (palette.includes(normalized)) { setNotice(copy.duplicate); return; }
    if (palette.length >= PALETTE_SPEC.maxColors) { setNotice(copy.limit); return; }
    setPalette(prev => addPaletteColor(prev, normalized));
    setNotice('');
  };
  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > PALETTE_SPEC.maxImageBytes) {
      setNotice(copy.fileError);
      return;
    }
    setExtracting(true);
    try {
      const result = await extractColorsFromImage(file, 8);
      const colors = sanitizedPalette(result.colors.map(color => color.hex));
      setExtracted(colors);
      setExtractedColors(result.colors, result.dominantColor);
      changeBase(result.dominantColor.hex);
      setNotice('');
    } catch {
      setNotice(copy.imageError);
    } finally {
      setExtracting(false);
    }
  };
  const runExport = async (kind: 'save' | 'copy') => {
    if (!palette.length || busy) return;
    setBusy(true);
    try {
      if (kind === 'save') await downloadPalette(palette, exportMode);
      else {
        await copyPaletteImage(palette, exportMode);
        setNotice(copy.imageCopied);
      }
    } catch {
      setNotice(kind === 'copy' ? copy.imageCopyFailed : copy.saveFailed);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="cr-v2" data-theme={theme}>
      <header className="crv2-header">
        <div className="crv2-header-brand">
          <Icon name="design" size="lg" />
          <span className="crv2-header-brand__full">{copy.brand}</span>
          <span className="crv2-header-brand__short" aria-label={copy.brand}>{copy.mobileBrand}</span>
          <span className="crv2-subtitle crv2-header-brand__version">{copy.version}</span>
        </div>
        <div className="crv2-header-actions">
          <Link className="crv2-btn crv2-btn--secondary crv2-btn--sm" to="/">
            <Icon name="back" />
            <span className="crv2-header-action__full">{copy.legacy}</span>
            <span className="crv2-header-action__short">{copy.legacyShort}</span>
          </Link>
          <IconButton
            icon={theme === 'dark' ? 'appearanceLight' : 'appearanceDark'}
            label={copy.appearance}
            onClick={() => setTheme(old => old === 'dark' ? 'light' : 'dark')}
          />
        </div>
      </header>
      <div className="crv2-intro">
        <h1>{copy.intro}</h1>
        <p className="crv2-subtitle">{copy.source}</p>
      </div>
      <main className="crv2-workspace">
        <aside className="crv2-panel" aria-label={copy.base}>
          <div className="crv2-section-title"><h2>{copy.base}</h2><span className="crv2-step">01</span></div>
          <div>
            <label htmlFor="crv2-hex" className="crv2-inputlabel">{copy.input} (HEX)</label>
            <div className="crv2-picker-row">
              <ColorInput label={copy.input} value={baseColor} onChange={event => changeBase(event.target.value)} />
              <TextField
                id="crv2-hex" value={baseDraft}
                onChange={event => setBaseDraft(event.target.value)}
                onBlur={() => changeBase(baseDraft)}
                onKeyDown={event => { if (event.key === 'Enter') event.currentTarget.blur(); }}
                spellCheck={false} maxLength={7} inputMode="text"
              />
              <IconButton icon="copy" label={copy.copy} onClick={() => void copyHex(baseColor)} />
            </div>
          </div>
          <div>
            <label htmlFor="crv2-image" className="crv2-inputlabel">{copy.imageInput}</label>
            <FileInput id="crv2-image" label={extracting ? copy.imageInput + '...' : copy.chooseFile}
              onChange={event => void handleUpload(event)} disabled={extracting} />
            <p className="crv2-muted">{copy.imageHint}</p>
          </div>
          {extractedColors.length > 0 && (
            <div>
              <h3>{copy.extracted}</h3>
              <div className="crv2-extracted" role="group" aria-label={copy.extracted}>
                {extractedColors.map(color => (
                  <ExtractedSwatchButton key={color} color={color}
                    label={copy.input} onSelect={() => changeBase(color)} />
                ))}
              </div>
            </div>
          )}
        </aside>
        <section className="crv2-panel" aria-label={copy.hue}>
          <div className="crv2-section-title"><h2>{copy.hue}</h2><span className="crv2-step">02</span></div>
          <p className="crv2-muted">{copy.hueHint}</p>
          <div>
            <label htmlFor="crv2-scheme" className="crv2-inputlabel">{copy.scheme}</label>
            <SelectField
              id="crv2-scheme" value={selectedScheme}
              onChange={event => setSelectedScheme(event.target.value)}
            >
              {COLOR_SCHEMES.map(scheme => <option key={scheme.id} value={scheme.id}>{scheme.name.replace(/\n/g, ' / ')}</option>)}
            </SelectField>
          </div>
          <div role="radiogroup" aria-label={copy.hue} className="crv2-hue-grid">
            {recommendedColors.map((color, index) => (
              <ColorTile key={color + index} color={color.toUpperCase()}
                caption={copy.hue + ' ' + (index + 1)} active={selectedColor.toUpperCase() === color.toUpperCase()}
                onPick={() => setColorFromRecommendation(color)}
                onCopy={color => void copyHex(color)} copyLabel={copy.copy}
              />
            ))}
          </div>
          <div className="crv2-section-title"><h2>{copy.tones}</h2><span className="crv2-step">03</span></div>
          <p className="crv2-muted">{copy.tonesHint}</p>
          <div role="radiogroup" aria-label={copy.tones} className="crv2-color-grid">
            {recommendedTones.map((color, index) => (
              <ColorTile key={color + index} color={color.toUpperCase()}
                caption={copy.tones + ' ' + (index + 1)} active={paintColor.toUpperCase() === color.toUpperCase()}
                onPick={() => setPaintColor(color)}
                onCopy={color => void copyHex(color)} copyLabel={copy.copy}
              />
            ))}
          </div>
          <h3>{copy.selected}</h3>
          <div className="crv2-current">
            <span className="crv2-current-chip" style={{ backgroundColor: paintColor }} aria-hidden="true" />
            <div className="crv2-selection">
              <div className="crv2-code">{paintColor.toUpperCase()}</div>
              <span className="crv2-muted">{copy.selected}</span>
            </div>
            <IconButton icon="copy" label={copy.copy} onClick={() => void copyHex(paintColor)} />
          </div>
          <Button variant="primary" icon="add" onClick={() => addColor(paintColor)}>{copy.add}</Button>
        </section>
        <aside className="crv2-panel crv2-palette-panel" aria-label={copy.palette}>
          <div className="crv2-section-title">
            <h2>{copy.palette}</h2>
            <span className="crv2-step">{palette.length} / {PALETTE_SPEC.maxColors}</span>
          </div>
          <p className="crv2-muted">{copy.paletteHint}</p>
          {palette.length ? (
            <>
              <div className="crv2-palette-strip" aria-label={copy.palette} role="img">
                {palette.map((color, index) => <span key={color + index} style={{ backgroundColor: color }} />)}
              </div>
              <div className="crv2-palette-list">
                {palette.map((color, index) => (
                  <div className="crv2-palette-row" key={color}>
                    <span className="crv2-palette-chip" style={{ backgroundColor: color }} aria-hidden="true" />
                    <CopyColorButton color={color} label={copy.copy}
                      className="crv2-palette-row__code" onCopy={color => void copyHex(color)} />
                    <div className="crv2-palette-actions">
                      <IconButton icon="moveUp" size="sm" label={copy.up} disabled={index === 0}
                        onClick={() => setPalette(prev => movePaletteColor(prev, index, -1))} />
                      <IconButton icon="moveDown" size="sm" label={copy.down} disabled={index === palette.length - 1}
                        onClick={() => setPalette(prev => movePaletteColor(prev, index, 1))} />
                      <IconButton icon="trash" size="sm" label={copy.remove}
                        onClick={() => setPalette(prev => prev.filter((_, i) => i !== index))} />
                    </div>
                  </div>
                ))}
              </div>
              <Button icon="trash" variant="ghost" size="sm" onClick={() => setPalette([])}>{copy.reset}</Button>
            </>
          ) : (
            <div className="crv2-empty">{copy.empty}</div>
          )}
          <PaletteActions
            colors={palette} mode={exportMode} setMode={setExportMode} busy={busy}
            onSave={() => void runExport('save')}
            onCopy={() => void runExport('copy')} copy={copy}
          />
          <p className="crv2-notice" role="status" aria-live="polite">{notice}</p>
        </aside>
      </main>
      <footer className="crv2-footer">{copy.source}</footer>
    </div>
  );
}
