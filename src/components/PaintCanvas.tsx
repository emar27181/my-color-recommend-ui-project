import React, { useRef, useEffect, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CircleDashed, Plus, Minus, Eraser, Pen, PaintBucket, Undo, Redo, Palette, RefreshCw, Download, Upload, Pipette, Image, Layers } from 'lucide-react';
import { BORDER_PRESETS } from '@/constants/ui';
import { useColorStore } from '@/store/colorStore';
import { useToastContext } from '@/contexts/ToastContext';
import { extractColorsFromImage, validateImageFile } from '@/lib/colorExtractor';
import chroma from 'chroma-js';
import ColorThief from 'colorthief';
import type { ExtractedColor } from '@/lib/colorExtractor';

interface PaintCanvasProps {
  className?: string;
}

export interface PaintCanvasRef {
  drawImageToCanvas: (imageFile: File) => void;
  extractColorsFromCanvas: () => Promise<void>;
}

const PaintCanvasComponent = forwardRef<PaintCanvasRef, PaintCanvasProps>(({ className = '' }, ref) => {
  const { selectedColor, setSelectedColor, setExtractedColors } = useColorStore();
  const { showToast } = useToastContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [penSize, setPenSize] = useState(20);
  const [isEraserMode, setIsEraserMode] = useState(false);
  const [isFillMode, setIsFillMode] = useState(true);
  const [isEyedropperMode, setIsEyedropperMode] = useState(false);
  const [isEditingPenSize, setIsEditingPenSize] = useState(false);
  const [tempPenSize, setTempPenSize] = useState('');
  const [isExtractingColors, setIsExtractingColors] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // キャンバスサイズ管理
  const [canvasSize, setCanvasSize] = useState({ width: 1920, height: 1440 });
  const [canvasAspectRatio, setCanvasAspectRatio] = useState(1920 / 1440);
  // const [forceUpdate, setForceUpdate] = useState(0); // 強制再レンダリング用 - 未使用のためコメントアウト
  const [containerWidth, setContainerWidth] = useState(800); // コンテナ幅管理

  // レイヤーシステム
  const [currentLayer, setCurrentLayer] = useState<1 | 2>(1);
  const layer1CanvasRef = useRef<HTMLCanvasElement>(null);
  const layer2CanvasRef = useRef<HTMLCanvasElement>(null);
  const [layer1Context, setLayer1Context] = useState<CanvasRenderingContext2D | null>(null);
  const [layer2Context, setLayer2Context] = useState<CanvasRenderingContext2D | null>(null);

  // パフォーマンス最適化用
  const compositeUpdateRef = useRef<number | null>(null);
  const needsCompositeUpdate = useRef<boolean>(false);

  // Undo/Redo履歴管理
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const maxHistorySize = 50; // 最大履歴保存数


  // ベースカラーとのコントラスト比を考慮したアイコン色を取得
  const getIconColor = () => {
    try {
      const color = chroma(selectedColor);
      const lightness = color.get('hsl.l');
      // 明るい色には暗いアイコン、暗い色には明るいアイコン
      return lightness > 0.5 ? '#374151' : '#f9fafb'; // gray-700 or gray-50
    } catch {
      return '#6b7280'; // デフォルト: gray-500
    }
  };

  // キャンバスサイズを動的に調整する関数
  const resizeCanvas = useCallback((newWidth: number, newHeight: number) => {
    const maxWidth = 2560;  // 最大幅制限
    const maxHeight = 1920; // 最大高さ制限

    // 最大サイズに収まるようにスケール調整
    const scale = Math.min(1, Math.min(maxWidth / newWidth, maxHeight / newHeight));
    const finalWidth = Math.floor(newWidth * scale);
    const finalHeight = Math.floor(newHeight * scale);

    setCanvasSize({ width: finalWidth, height: finalHeight });
    const newRatio = finalWidth / finalHeight;
    setCanvasAspectRatio(newRatio);

    console.log(`Canvas aspect ratio updated: ${newRatio.toFixed(3)} (${finalWidth}x${finalHeight})`);
    console.log(`Calculated canvas height: ${Math.min(450, Math.floor(containerWidth / newRatio))}px`);

    // 全キャンバスのサイズを更新
    if (canvasRef.current) {
      canvasRef.current.width = finalWidth;
      canvasRef.current.height = finalHeight;
    }
    if (layer1CanvasRef.current) {
      layer1CanvasRef.current.width = finalWidth;
      layer1CanvasRef.current.height = finalHeight;
    }
    if (layer2CanvasRef.current) {
      layer2CanvasRef.current.width = finalWidth;
      layer2CanvasRef.current.height = finalHeight;
    }

    // コンテキストは呼び出し元で再取得・設定するためここでは触らない

    console.log(`Canvas resized to: ${finalWidth}x${finalHeight} (aspect: ${(finalWidth / finalHeight).toFixed(2)})`);
  }, []);



  // カラーピッカーの変更ハンドラー
  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setSelectedColor(color);
  };

  // レイヤーキャンバスの初期化
  useEffect(() => {
    // レイヤー1の初期化
    const layer1Canvas = layer1CanvasRef.current;
    if (layer1Canvas) {
      const ctx1 = layer1Canvas.getContext('2d');
      if (ctx1) {
        // キャンバス内部解像度を設定
        layer1Canvas.width = canvasSize.width;
        layer1Canvas.height = canvasSize.height;

        // 描画設定
        ctx1.lineCap = 'round';
        ctx1.lineJoin = 'round';
        ctx1.strokeStyle = '#000000';
        ctx1.lineWidth = 20;
        ctx1.globalCompositeOperation = 'source-over';

        // レイヤー1は透明に初期化（上のレイヤー）
        ctx1.clearRect(0, 0, layer1Canvas.width, layer1Canvas.height);
        setLayer1Context(ctx1);
      }
    }

    // レイヤー2の初期化
    const layer2Canvas = layer2CanvasRef.current;
    if (layer2Canvas) {
      const ctx2 = layer2Canvas.getContext('2d');
      if (ctx2) {
        // キャンバス内部解像度を設定
        layer2Canvas.width = canvasSize.width;
        layer2Canvas.height = canvasSize.height;

        // 描画設定
        ctx2.lineCap = 'round';
        ctx2.lineJoin = 'round';
        ctx2.strokeStyle = '#000000';
        ctx2.lineWidth = 20;
        ctx2.globalCompositeOperation = 'source-over';

        // レイヤー2は常に白い背景（下のレイヤー）
        ctx2.fillStyle = '#ffffff';
        ctx2.fillRect(0, 0, layer2Canvas.width, layer2Canvas.height);
        setLayer2Context(ctx2);
      }
    }

    // 表示用キャンバスの初期化（合成表示用）
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = canvasSize.width;
        canvas.height = canvasSize.height;
        setContext(ctx);

        // 表示用キャンバスも白い背景で初期化
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 初期状態を履歴に保存
        setTimeout(() => {
          updateCompositeCanvas();
          if (layer1CanvasRef.current && layer2CanvasRef.current) {
            const layer1DataURL = layer1CanvasRef.current.toDataURL();
            const layer2DataURL = layer2CanvasRef.current.toDataURL();
            const initialHistoryData = JSON.stringify({
              layer1: layer1DataURL,
              layer2: layer2DataURL
            });
            setHistory([initialHistoryData]);
            setHistoryIndex(0);
            console.log('Initial layer history saved');
          }
        }, 50); // 初期化時間短縮
      }
    }
  }, [canvasSize]);

  // キャンバスアスペクト比の変更を監視して強制更新
  useEffect(() => {
    console.log(`Aspect ratio state updated: ${canvasAspectRatio.toFixed(3)}`);

    // アスペクト比が変更されたら、キャンバス要素のスタイルも強制更新
    const updateCanvasStyles = () => {
      [canvasRef, layer1CanvasRef, layer2CanvasRef].forEach(ref => {
        if (ref.current) {
          ref.current.style.aspectRatio = canvasAspectRatio.toString();
          console.log(`Updated canvas style aspect-ratio: ${canvasAspectRatio.toString()}`);
        }
      });
    };

    // 少し遅延させてDOM更新を確実にする
    const timeoutId = setTimeout(updateCanvasStyles, 50);
    return () => clearTimeout(timeoutId);
  }, [canvasAspectRatio]);

  // コンテナ幅の監視
  useEffect(() => {
    const updateContainerWidth = () => {
      if (typeof window !== 'undefined') {
        // キャンバスカードの実際の幅を取得（最大90%で制限）
        setContainerWidth(Math.min(window.innerWidth * 0.9, 800));
      }
    };

    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);

    return () => {
      window.removeEventListener('resize', updateContainerWidth);
    };
  }, []);

  // 初期化時に線画テンプレートを自動読み込み（一度のみ実行）
  const [hasAutoLoaded, setHasAutoLoaded] = useState(false);

  useEffect(() => {
    // レイヤーコンテキストとキャンバス参照が完全に初期化された後に線画を読み込み（初回のみ）
    console.log('Checking initialization status:', {
      layer1Context: !!layer1Context,
      layer2Context: !!layer2Context,
      layer1Canvas: !!layer1CanvasRef.current,
      layer2Canvas: !!layer2CanvasRef.current,
      hasAutoLoaded
    });
    
    if (layer1Context && layer2Context && 
        layer1CanvasRef.current && layer2CanvasRef.current && 
        !hasAutoLoaded) {
      const timer = setTimeout(() => {
        console.log('Auto-loading template image on initialization (one time only)');
        setHasAutoLoaded(true); // フラグを設定して再実行を防止
        loadTemplateImage().catch(error => {
          console.error('Failed to auto-load template:', error);
        });
      }, 500); // より長い遅延で確実性を向上
      
      return () => clearTimeout(timer);
    }
  }, [layer1Context, layer2Context, hasAutoLoaded]); // isExtractingColorsを削除

  // クリーンアップ：コンポーネントアンマウント時の処理
  useEffect(() => {
    return () => {
      // アニメーションフレームをキャンセル
      if (compositeUpdateRef.current) {
        cancelAnimationFrame(compositeUpdateRef.current);
        compositeUpdateRef.current = null;
      }
    };
  }, []);

  // 履歴に現在のレイヤー状態を保存
  const saveToHistory = useCallback(() => {
    if (!layer1CanvasRef.current || !layer2CanvasRef.current) return;

    const layer1Canvas = layer1CanvasRef.current;
    const layer2Canvas = layer2CanvasRef.current;

    // 両レイヤーの状態を保存
    const layer1DataURL = layer1Canvas.toDataURL();
    const layer2DataURL = layer2Canvas.toDataURL();

    const historyData = JSON.stringify({
      layer1: layer1DataURL,
      layer2: layer2DataURL
    });

    console.log('Saving layers to history - current index:', historyIndex);

    setHistory(prevHistory => {
      // 現在のインデックス以降の履歴を削除（新しい操作時）
      const newHistory = prevHistory.slice(0, historyIndex + 1);
      newHistory.push(historyData);

      console.log('New history length:', newHistory.length);

      // 最大サイズを超えた場合、古い履歴を削除
      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
        console.log('History trimmed to max size');
        // インデックスも調整
        setHistoryIndex(newHistory.length - 1);
        return newHistory;
      }

      return newHistory;
    });

    // インデックスを更新（履歴更新後）
    setHistoryIndex(prevIndex => {
      const newIndex = Math.min(prevIndex + 1, maxHistorySize - 1);
      console.log('New history index:', newIndex);
      return newIndex;
    });
  }, [historyIndex]);

  // レイヤーを合成して表示用キャンバスに描画（最適化版）
  const updateCompositeCanvas = useCallback(() => {
    if (!context || !canvasRef.current || !layer1CanvasRef.current || !layer2CanvasRef.current) return;

    const compositeCanvas = canvasRef.current;
    const layer1Canvas = layer1CanvasRef.current;
    const layer2Canvas = layer2CanvasRef.current;

    // 合成キャンバスを白い背景でクリア
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, compositeCanvas.width, compositeCanvas.height);

    // レイヤー2（下）を描画
    context.drawImage(layer2Canvas, 0, 0);

    // レイヤー1（上）を描画
    context.drawImage(layer1Canvas, 0, 0);
  }, [context]);

  // 遅延合成更新（パフォーマンス最適化）
  const scheduleCompositeUpdate = useCallback(() => {
    needsCompositeUpdate.current = true;

    if (compositeUpdateRef.current === null) {
      compositeUpdateRef.current = requestAnimationFrame(() => {
        if (needsCompositeUpdate.current) {
          updateCompositeCanvas();
          needsCompositeUpdate.current = false;
        }
        compositeUpdateRef.current = null;
      });
    }
  }, [updateCompositeCanvas]);

  // 現在のレイヤーのコンテキストを取得
  const getCurrentLayerContext = useCallback(() => {
    return currentLayer === 1 ? layer1Context : layer2Context;
  }, [currentLayer, layer1Context, layer2Context]);

  // レイヤーコンテキストの描画設定を最適化
  const applyDrawingSettings = useCallback((layerContext: CanvasRenderingContext2D) => {
    layerContext.lineWidth = penSize;
    layerContext.lineCap = 'round';
    layerContext.lineJoin = 'round';

    if (isEraserMode) {
      if (currentLayer === 1) {
        layerContext.globalCompositeOperation = 'destination-out';
      } else {
        layerContext.globalCompositeOperation = 'source-over';
        layerContext.strokeStyle = '#ffffff';
      }
    } else {
      layerContext.globalCompositeOperation = 'source-over';
      layerContext.strokeStyle = selectedColor;
    }
  }, [penSize, isEraserMode, currentLayer, selectedColor]);

  // キャンバスに画像を描画する関数
  const drawImageToCanvas = useCallback((imageFile: File) => {
    if (!context || !canvasRef.current) return;

    // const canvas = canvasRef.current; // 未使用のため削除
    const img: HTMLImageElement = document.createElement('img');

    img.onload = () => {
      // 履歴保存
      saveToHistory();

      // 画像サイズに合わせてキャンバスをリサイズ
      resizeCanvas(img.width, img.height);

      // リサイズ後、少し待ってから描画（コンテキスト更新を待つ）
      setTimeout(() => {
        const currentContext = canvasRef.current?.getContext('2d');
        const currentLayer2Context = layer2CanvasRef.current?.getContext('2d');

        if (!currentContext || !currentLayer2Context || !canvasRef.current || !layer2CanvasRef.current) {
          console.error('Context lost after resize');
          return;
        }

        // リサイズ後のキャンバスサイズを取得
        const canvasWidth = canvasRef.current.width;
        const canvasHeight = canvasRef.current.height;

        // レイヤー2（背景）に画像を描画
        currentLayer2Context.fillStyle = '#ffffff';
        currentLayer2Context.fillRect(0, 0, canvasWidth, canvasHeight);
        currentLayer2Context.drawImage(img, 0, 0, canvasWidth, canvasHeight);

        // 表示用キャンバスに合成結果を描画
        currentContext.fillStyle = '#ffffff';
        currentContext.fillRect(0, 0, canvasWidth, canvasHeight);
        currentContext.drawImage(layer2CanvasRef.current, 0, 0);
        if (layer1CanvasRef.current) {
          currentContext.drawImage(layer1CanvasRef.current, 0, 0);
        }

        console.log('Image drawn to canvas:', imageFile.name);

        // 強制再レンダリングで縦横比変更を反映 (未使用のためコメント化)
        // setForceUpdate(prev => prev + 1);
      }, 100); // リサイズ処理完了を待つ
    };

    img.onerror = () => {
      console.error('Failed to load image:', imageFile.name);
    };

    // FileからDataURLを作成
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(imageFile);
  }, [context, saveToHistory]);

  // キャンバスから色を抽出する関数（先に定義）
  const extractColorsFromCanvas = useCallback(async () => {
    if (!layer1CanvasRef.current || !layer2CanvasRef.current) return;

    setIsExtractingColors(true);

    try {
      // レイヤーキャンバスから直接合成して色抽出用の一時キャンバスを作成
      const layer1Canvas = layer1CanvasRef.current;
      const layer2Canvas = layer2CanvasRef.current;
      
      // 色抽出専用の一時キャンバスを作成（表示用キャンバスとは完全に分離）
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) {
        setIsExtractingColors(false);
        return;
      }

      // 高速化のため縮小して処理
      const maxDimension = 400;
      let width = layer1Canvas.width;
      let height = layer1Canvas.height;

      if (width > maxDimension || height > maxDimension) {
        const ratio = Math.min(maxDimension / width, maxDimension / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }

      tempCanvas.width = width;
      tempCanvas.height = height;
      
      // レイヤーを合成して一時キャンバスに描画（表示用キャンバスには一切触れない）
      tempCtx.fillStyle = '#ffffff';
      tempCtx.fillRect(0, 0, width, height);
      
      // レイヤー2（下）を描画
      tempCtx.drawImage(layer2Canvas, 0, 0, width, height);
      
      // レイヤー1（上）を描画  
      tempCtx.drawImage(layer1Canvas, 0, 0, width, height);

      // Canvas内容を画像として取得
      const dataURL = tempCanvas.toDataURL('image/png');
      const img: HTMLImageElement = document.createElement('img');

      img.onload = () => {
        try {
          const colorThief = new ColorThief();

          // ドミナントカラー取得
          const dominantRgb = colorThief.getColor(img, 20);

          // パレット取得（最大8色）
          const palette = colorThief.getPalette(img, 8, 20) || [];

          // 色使用率を計算
          const imageData = tempCtx.getImageData(0, 0, width, height);
          const pixels = imageData.data;
          const sampleRate = Math.max(1, Math.floor(Math.sqrt(width * height) / 80));
          const totalSamples = Math.floor((width * height) / (sampleRate * sampleRate));

          const colorCounts = new Map<string, number>();
          const tolerance = 30;

          // ピクセルサンプリングで色使用率を計算
          for (let y = 0; y < height; y += sampleRate) {
            for (let x = 0; x < width; x += sampleRate) {
              const i = (y * width + x) * 4;
              const r = pixels[i];
              const g = pixels[i + 1];
              const b = pixels[i + 2];
              const a = pixels[i + 3];

              // 透明または白い背景は除外
              if (a < 50 || (r > 240 && g > 240 && b > 240)) {
                continue;
              }

              const pixelColor = chroma.rgb(r, g, b);

              let closestColor = '';
              let minDistance = Infinity;

              for (const paletteRgb of palette) {
                const paletteColor = chroma.rgb(paletteRgb[0], paletteRgb[1], paletteRgb[2]);
                const distance = chroma.deltaE(pixelColor, paletteColor);

                if (distance < minDistance && distance < tolerance) {
                  minDistance = distance;
                  closestColor = paletteColor.hex();
                }
              }

              if (closestColor) {
                colorCounts.set(closestColor, (colorCounts.get(closestColor) || 0) + 1);
              }
            }
          }

          // ExtractedColor形式に変換
          const colors: ExtractedColor[] = palette.map((rgb: [number, number, number]) => {
            const hex = chroma.rgb(rgb[0], rgb[1], rgb[2]).hex();
            const count = colorCounts.get(hex) || 0;
            const usage = totalSamples > 0 ? count / totalSamples : 0;

            return {
              hex,
              rgb,
              usage
            };
          })
            .filter(color => color.usage > 0.01) // 1%以上の色のみ
            .sort((a, b) => b.usage - a.usage);

          const dominantHex = chroma.rgb(dominantRgb[0], dominantRgb[1], dominantRgb[2]).hex();
          const dominantUsage = colorCounts.get(dominantHex) || 0;

          const dominantColor: ExtractedColor = {
            hex: dominantHex,
            rgb: dominantRgb,
            usage: totalSamples > 0 ? dominantUsage / totalSamples : 0
          };

          // ストアに保存
          setExtractedColors(colors, dominantColor);

          console.log('Canvas colors extracted:', colors);
          console.log('Dominant color:', dominantColor);

          // 色抽出処理は完全に読み取り専用なので、表示用キャンバスの更新は不要
          console.log('Color extraction completed without touching display canvas');

        } catch (error) {
          console.error('Color extraction failed:', error);
        } finally {
          setIsExtractingColors(false);
        }
      };

      img.onerror = () => {
        console.error('Failed to load canvas image');
        setIsExtractingColors(false);
      };

      img.src = dataURL;

    } catch (error) {
      console.error('Canvas color extraction error:', error);
      setIsExtractingColors(false);
    }
  }, [setExtractedColors]);

  // テンプレート画像をレイヤー1に読み込む
  const loadTemplateImage = useCallback(async () => {
    console.log('loadTemplateImage called - loading to layer 1');

    if (!layer1Context || !layer1CanvasRef.current) {
      console.log('Layer 1 context or canvas ref is null');
      showToast('レイヤー1が初期化されていません', 'error');
      return;
    }

    try {
      // 現在の状態を履歴に保存
      saveToHistory();

      const img: HTMLImageElement = document.createElement('img');

      img.onload = () => {
        console.log('Template image loaded successfully to layer 1', { 
          width: img.width, 
          height: img.height 
        });

        // テンプレート画像サイズに合わせてキャンバスをリサイズ
        console.log('Resizing canvas to image dimensions');
        resizeCanvas(img.width, img.height);

        // リサイズ後、少し待ってから描画
        setTimeout(() => {
          const currentLayer1Context = layer1CanvasRef.current?.getContext('2d');
          const currentLayer2Context = layer2CanvasRef.current?.getContext('2d');

          console.log('Drawing template image after resize delay', {
            currentLayer1Context: !!currentLayer1Context,
            currentLayer2Context: !!currentLayer2Context,
            layer1Canvas: !!layer1CanvasRef.current,
            layer2Canvas: !!layer2CanvasRef.current,
            canvasSize: { 
              width: layer1CanvasRef.current?.width, 
              height: layer1CanvasRef.current?.height 
            }
          });

          if (!currentLayer1Context || !currentLayer2Context || !layer1CanvasRef.current || !layer2CanvasRef.current) {
            console.error('Layer contexts lost during image load');
            return;
          }

          // レイヤー2を白背景で初期化
          console.log('Initializing layer 2 background');
          currentLayer2Context.fillStyle = '#ffffff';
          currentLayer2Context.fillRect(0, 0, layer2CanvasRef.current.width, layer2CanvasRef.current.height);

          // 画像をレイヤー1に等倍で描画（キャンバスサイズに合わせて調整済み）
          console.log('Drawing image to layer 1');
          currentLayer1Context.drawImage(img, 0, 0, layer1CanvasRef.current.width, layer1CanvasRef.current.height);

          // 描画レイヤーをレイヤー2に自動切り替え
          setCurrentLayer(2);

          // 合成キャンバスを更新
          updateCompositeCanvas();

          showToast('線画をレイヤー1に読み込みました（描画はレイヤー2）', 'success');

          // 強制再レンダリングで縦横比変更を反映 (未使用のためコメント化)
          // setForceUpdate(prev => prev + 1);
        }, 100);
      };

      img.onerror = (error: string | Event) => {
        console.error('Template image load error:', error);
        console.error('Failed to load from path:', '/line-art-template.png');
        showToast('テンプレート画像の読み込みに失敗しました', 'error');
      };

      // publicディレクトリからテンプレート画像を読み込み
      console.log('Setting image source to:', '/line-art-template.png');
      console.log('Current base URL:', window.location.origin);
      img.src = '/line-art-template.png';

    } catch (error) {
      console.error('Template image load error:', error);
      showToast('テンプレート画像の読み込みに失敗しました', 'error');
    }
  }, [layer1Context, saveToHistory, showToast, updateCompositeCanvas]);

  // 外部からアクセス可能な関数を公開
  useImperativeHandle(ref, () => ({
    drawImageToCanvas,
    extractColorsFromCanvas
  }), [drawImageToCanvas, extractColorsFromCanvas]);

  // 履歴からレイヤー状態を復元
  const restoreFromHistory = useCallback((historyData: string) => {
    if (!layer1Context || !layer2Context || !layer1CanvasRef.current || !layer2CanvasRef.current) return;

    try {
      const parsedData = JSON.parse(historyData);
      const { layer1: layer1DataURL, layer2: layer2DataURL } = parsedData;

      // レイヤー1を復元
      const img1: HTMLImageElement = document.createElement('img');
      img1.onload = () => {
        if (!layer1Context || !layer1CanvasRef.current) return;
        layer1Context.clearRect(0, 0, layer1CanvasRef.current.width, layer1CanvasRef.current.height);
        layer1Context.drawImage(img1, 0, 0);

        // 合成キャンバスを更新
        updateCompositeCanvas();
      };
      img1.src = layer1DataURL;

      // レイヤー2を復元
      const img2: HTMLImageElement = document.createElement('img');
      img2.onload = () => {
        if (!layer2Context || !layer2CanvasRef.current) return;
        layer2Context.clearRect(0, 0, layer2CanvasRef.current.width, layer2CanvasRef.current.height);
        layer2Context.drawImage(img2, 0, 0);

        // 合成キャンバスを更新
        updateCompositeCanvas();
      };
      img2.src = layer2DataURL;

    } catch (error) {
      console.error('Failed to restore from history:', error);
      // 古い形式の単一画像データの場合の互換性処理
      if (!context || !canvasRef.current) return;
      const img: HTMLImageElement = document.createElement('img');
      img.onload = () => {
        if (!context || !canvasRef.current) return;
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        context.drawImage(img, 0, 0);
      };
      img.src = historyData;
    }
  }, [layer1Context, layer2Context, updateCompositeCanvas, context]);

  // Undo機能
  const undo = useCallback(() => {
    console.log('Undo called - historyIndex:', historyIndex, 'history.length:', history.length);
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      console.log('Restoring to index:', newIndex);
      setHistoryIndex(newIndex);
      restoreFromHistory(history[newIndex]);
    } else {
      console.log('Cannot undo - at beginning of history');
    }
  }, [historyIndex, history, restoreFromHistory]);

  // Redo機能
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      restoreFromHistory(history[newIndex]);
    }
  }, [historyIndex, history, restoreFromHistory]);

  // contextが設定された時とペンサイズ変更時にcanvasに反映
  useEffect(() => {
    if (context) {
      console.log('Setting pen size to:', penSize);
      context.lineWidth = penSize;
    }
  }, [context, penSize]);


  // 消しゴムモード変更時にstrokeStyleを更新
  useEffect(() => {
    if (context) {
      console.log('Setting eraser mode to:', isEraserMode);
      context.globalCompositeOperation = 'source-over'; // 常に通常描画モード
      if (isEraserMode) {
        context.strokeStyle = '#ffffff'; // 消しゴムは白色
      } else {
        context.strokeStyle = selectedColor; // 選択された色
      }
    }
  }, [context, isEraserMode, selectedColor]);

  // デバッグ用：状態変更を監視
  useEffect(() => {
    console.log('Mode state changed:', { isFillMode, isEraserMode, isEyedropperMode });
  }, [isFillMode, isEraserMode, isEyedropperMode]);

  // フラッドフィル（塗りつぶし）アルゴリズム
  const floodFill = useCallback((startX: number, startY: number, newColor: string) => {
    console.log('FloodFill called with:', { startX, startY, newColor, currentLayer });

    // 塗りつぶし中は中間更新を完全に無効化
    if (compositeUpdateRef.current) {
      cancelAnimationFrame(compositeUpdateRef.current);
      compositeUpdateRef.current = null;
    }
    needsCompositeUpdate.current = false;

    // 処理中カーソルを設定
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'wait';
    }

    const layerContext = getCurrentLayerContext();
    if (!layerContext || !canvasRef.current) {
      console.error('FloodFill: No layer context or composite canvas available');
      // エラー時もカーソルを元に戻す
      if (canvasRef.current) {
        canvasRef.current.style.cursor = isFillMode ? 'pointer' : 'crosshair';
      }
      return;
    }

    // 現在のレイヤーキャンバスを取得（塗りつぶし結果の適用用）
    const currentLayerCanvas = currentLayer === 1 ? layer1CanvasRef.current : layer2CanvasRef.current;
    if (!currentLayerCanvas) {
      console.error('FloodFill: No current layer canvas available');
      // エラー時もカーソルを元に戻す
      if (canvasRef.current) {
        canvasRef.current.style.cursor = isFillMode ? 'pointer' : 'crosshair';
      }
      return;
    }

    // 境界検出用に合成されたキャンバス（全レイヤー）のピクセルデータを使用
    const compositeContext = canvasRef.current.getContext('2d');
    if (!compositeContext) {
      console.error('FloodFill: No composite context available');
      // エラー時もカーソルを元に戻す
      if (canvasRef.current) {
        canvasRef.current.style.cursor = isFillMode ? 'pointer' : 'crosshair';
      }
      return;
    }

    console.log('FloodFill: Using composite canvas for boundary detection, layer', currentLayer, 'for filling');
    console.log('FloodFill: Canvas size:', canvasRef.current.width, 'x', canvasRef.current.height);
    console.log('FloodFill: Start coordinates:', Math.floor(startX), Math.floor(startY));

    try {
      // 境界検出用：合成キャンバス全体のピクセルデータ
      const compositeImageData = compositeContext.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
      console.log('FloodFill: Successfully got composite imageData, length:', compositeImageData.data.length);

      // 塗りつぶし結果適用用：現在のレイヤーのピクセルデータ
      const layerImageData = layerContext.getImageData(0, 0, currentLayerCanvas.width, currentLayerCanvas.height);
      console.log('FloodFill: Successfully got layer imageData, length:', layerImageData.data.length);
    } catch (error) {
      console.error('FloodFill: Failed to get imageData:', error);
      // エラー時もカーソルを元に戻す
      if (canvasRef.current) {
        canvasRef.current.style.cursor = isFillMode ? 'pointer' : 'crosshair';
      }
      return;
    }

    // 境界検出用：合成キャンバス全体のピクセルデータ
    const compositeImageData = compositeContext.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    const compositePixels = compositeImageData.data;

    // 塗りつぶし結果適用用：現在のレイヤーのピクセルデータ
    const layerImageData = layerContext.getImageData(0, 0, currentLayerCanvas.width, currentLayerCanvas.height);
    const layerPixels = layerImageData.data;

    // === 調整可能な定数 ===
    const colorTolerance = 5;        // 色の許容閾値（0-255）- より厳格な境界検出
    const gapBridgeDistance = 1;     // 隙間をブリッジする最大距離（px）- 最小限のブリッジ
    const gapSearchRadius = 1;       // 隙間検索時の探索半径（px）- 最小限に  
    const expansionRadius = 1;       // 正方形拡張半径（px）- 検出領域から1px拡大

    // 新しい色をRGBAに変換
    const hex = newColor.replace('#', '');
    const newR = parseInt(hex.substring(0, 2), 16);
    const newG = parseInt(hex.substring(2, 4), 16);
    const newB = parseInt(hex.substring(4, 6), 16);
    const newA = 255;

    // 開始点の色を取得（境界検出用は合成ピクセルデータを使用）
    const startIndex = (Math.floor(startY) * canvasRef.current.width + Math.floor(startX)) * 4;
    const startR = compositePixels[startIndex];
    const startG = compositePixels[startIndex + 1];
    const startB = compositePixels[startIndex + 2];
    const startA = compositePixels[startIndex + 3];

    // 軽量な色の差を計算する関数（平方根を避ける）
    const colorDistance = (r1: number, g1: number, b1: number, a1: number, r2: number, g2: number, b2: number, a2: number) => {
      return Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2) + Math.abs(a1 - a2);
    };

    // 指定位置のピクセルが開始色と似ているかチェック（境界検出は合成ピクセルデータを使用）
    const isSimilarToStart = (x: number, y: number) => {
      if (!canvasRef.current || x < 0 || x >= canvasRef.current.width || y < 0 || y >= canvasRef.current.height) return false;
      const index = (y * canvasRef.current.width + x) * 4;
      const r = compositePixels[index];
      const g = compositePixels[index + 1];
      const b = compositePixels[index + 2];
      const a = compositePixels[index + 3];
      return colorDistance(r, g, b, a, startR, startG, startB, startA) <= colorTolerance;
    };

    // 元の塗りつぶし判定（拡張なし）
    const shouldFill = (x: number, y: number) => {
      return isSimilarToStart(x, y);
    };

    // 拡張エリアかどうかを判定（隙間エリア検出に使用）
    const isExpansionArea = (x: number, y: number) => {
      // 現在位置が塗りつぶし対象の場合は拡張対象外
      if (isSimilarToStart(x, y)) return false;

      // 周辺に塗りつぶし対象があるかチェック（隙間検出）
      for (let dx = -expansionRadius; dx <= expansionRadius; dx++) {
        for (let dy = -expansionRadius; dy <= expansionRadius; dy++) {
          if (dx === 0 && dy === 0) continue;
          const checkX = x + dx;
          const checkY = y + dy;
          if (canvasRef.current && checkX >= 0 && checkX < canvasRef.current.width &&
            checkY >= 0 && checkY < canvasRef.current.height) {
            if (isSimilarToStart(checkX, checkY)) {
              return true; // 周辺に塗りつぶし対象があれば拡張エリア
            }
          }
        }
      }
      return false;
    };

    // 隙間を越えて同じ色の領域があるかチェック（隙間ブリッジ機能）
    const canBridgeGap = (fromX: number, fromY: number, dirX: number, dirY: number) => {
      // 隙間の向こう側に同じ色があり、かつ隙間が十分小さい場合のみ
      let gapPixels = 0;

      for (let dist = 1; dist <= gapBridgeDistance; dist++) {
        const checkX = fromX + dirX * dist;
        const checkY = fromY + dirY * dist;

        if (!canvasRef.current || checkX < 0 || checkX >= canvasRef.current.width || checkY < 0 || checkY >= canvasRef.current.height) {
          return false; // 範囲外なら失敗
        }

        if (isSimilarToStart(checkX, checkY)) {
          // 同じ色を見つけた

          // 周辺の色一致度をチェック（緩和した条件）
          let matchCount = 0;
          let totalCount = 0;
          for (let dx = -gapSearchRadius; dx <= gapSearchRadius; dx++) {
            for (let dy = -gapSearchRadius; dy <= gapSearchRadius; dy++) {
              const nearX = checkX + dx;
              const nearY = checkY + dy;
              if (canvasRef.current && nearX >= 0 && nearX < canvasRef.current.width && nearY >= 0 && nearY < canvasRef.current.height) {
                totalCount++;
                if (isSimilarToStart(nearX, nearY)) {
                  matchCount++;
                }
              }
            }
          }

          // 90%以上が同じ色で、隙間が1px以下の場合のみ許可（非常に厳格）
          return matchCount >= totalCount * 0.9 && gapPixels <= 1;
        } else {
          gapPixels++;
        }
      }

      return false;
    };

    // 同じ色の場合は何もしない
    if (colorDistance(startR, startG, startB, startA, newR, newG, newB, newA) < colorTolerance) {
      // カーソルを元に戻す
      if (canvasRef.current) {
        canvasRef.current.style.cursor = isFillMode ? 'pointer' : 'crosshair';
      }
      return;
    }

    // 処理済みピクセルをビットマップで管理（メモリ効率向上）
    const visitedBitmap = new Uint8Array(Math.ceil(canvasRef.current.width * canvasRef.current.height / 8));

    const setVisited = (x: number, y: number) => {
      if (!canvasRef.current) return;
      const bitIndex = y * canvasRef.current.width + x;
      const byteIndex = Math.floor(bitIndex / 8);
      const bitOffset = bitIndex % 8;
      visitedBitmap[byteIndex] |= (1 << bitOffset);
    };

    const isVisited = (x: number, y: number) => {
      if (!canvasRef.current) return false;
      const bitIndex = y * canvasRef.current.width + x;
      const byteIndex = Math.floor(bitIndex / 8);
      const bitOffset = bitIndex % 8;
      return (visitedBitmap[byteIndex] & (1 << bitOffset)) !== 0;
    };

    // スタックベースのフラッドフィル（基本領域検出）
    const filledPixels = new Set<string>(); // 基本塗りつぶし領域（String座標管理）
    const expandedPixels = new Set<string>(); // 拡張領域（成功版アルゴリズム復元）
    const stack: { x: number; y: number }[] = [{ x: Math.floor(startX), y: Math.floor(startY) }];

    while (stack.length > 0) {
      const { x, y } = stack.pop()!;

      if (x < 0 || x >= canvasRef.current.width || y < 0 || y >= canvasRef.current.height) continue;
      if (isVisited(x, y)) continue;

      setVisited(x, y);

      // 基本塗りつぶし判定
      if (shouldFill(x, y)) {
        // 基本領域として記録（String座標で直接保存）
        filledPixels.add(`${x},${y}`);

        // 隣接する4方向をスタックに追加
        stack.push({ x: x + 1, y });
        stack.push({ x: x - 1, y });
        stack.push({ x, y: y + 1 });
        stack.push({ x, y: y - 1 });
      } else if (gapBridgeDistance > 0) {
        // 隙間ブリッジ機能を使用して、隙間を越えた塗りつぶしを実行
        const directions = [
          { dx: 1, dy: 0 },   // 右
          { dx: -1, dy: 0 },  // 左  
          { dx: 0, dy: 1 },   // 下
          { dx: 0, dy: -1 }   // 上
        ];

        // 各方向に隙間ブリッジを試行
        for (const { dx, dy } of directions) {
          if (canBridgeGap(x, y, dx, dy)) {
            // 隙間の向こう側に同色領域があることが確認できた場合
            // ブリッジパスを辿って塗りつぶしを続行
            for (let dist = 1; dist <= gapBridgeDistance; dist++) {
              const bridgeX = x + dx * dist;
              const bridgeY = y + dy * dist;

              if (bridgeX >= 0 && bridgeX < canvasRef.current.width &&
                bridgeY >= 0 && bridgeY < canvasRef.current.height &&
                !isVisited(bridgeX, bridgeY)) {

                // 隙間部分も塗りつぶし対象に追加（隙間を埋める）
                filledPixels.add(`${bridgeX},${bridgeY}`);
                setVisited(bridgeX, bridgeY);

                // さらに先の領域も探索対象に追加
                if (shouldFill(bridgeX, bridgeY)) {
                  stack.push({ x: bridgeX, y: bridgeY });
                }
              }
            }
          }
        }
      }
    }

    // Morphological Dilation（形態学的膨張処理）- 成功版アルゴリズム完全復元
    if (expansionRadius > 0) {
      console.log('FloodFill: Applying morphological dilation with radius', expansionRadius);
      
      // String座標管理による高精度膨張処理（成功版と同じ実装）
      for (const pixel of filledPixels) {
        const [centerX, centerY] = pixel.split(',').map(Number);

        // 正方形カーネルによる膨張（座標変換誤差なし）
        for (let dy = -expansionRadius; dy <= expansionRadius; dy++) {
          for (let dx = -expansionRadius; dx <= expansionRadius; dx++) {
            const expandX = centerX + dx;
            const expandY = centerY + dy;

            // 境界チェック
            if (expandX >= 0 && expandX < canvasRef.current.width &&
                expandY >= 0 && expandY < canvasRef.current.height) {
              
              const expandCoord = `${expandX},${expandY}`;
              
              // 基本領域に含まれていない場合のみ拡張領域に追加
              if (!filledPixels.has(expandCoord)) {
                expandedPixels.add(expandCoord);
              }
            }
          }
        }
      }
    }

    console.log('FloodFill: Detected', filledPixels.size, 'base pixels +', expandedPixels.size, 'expansion pixels');
    console.log('FloodFill parameters:', {
      colorTolerance,
      gapBridgeDistance,
      gapSearchRadius,
      expansionRadius
    });

    // === 基本領域+拡張領域を塗りつぶし ===
    let paintedCount = 0;

    // 基本領域を塗りつぶし（String座標から直接解析）
    for (const pixel of filledPixels) {
      if (!canvasRef.current) continue;
      const [x, y] = pixel.split(',').map(Number);
      const layerIndex = (y * currentLayerCanvas.width + x) * 4;

      if (layerIndex >= 0 && layerIndex < layerPixels.length - 3) {
        layerPixels[layerIndex] = newR;
        layerPixels[layerIndex + 1] = newG;
        layerPixels[layerIndex + 2] = newB;
        layerPixels[layerIndex + 3] = newA;
        paintedCount++;
      }
    }

    // 拡張領域を塗りつぶし（String座標から直接解析）
    for (const pixel of expandedPixels) {
      if (!canvasRef.current) continue;
      const [x, y] = pixel.split(',').map(Number);
      const layerIndex = (y * currentLayerCanvas.width + x) * 4;

      if (layerIndex >= 0 && layerIndex < layerPixels.length - 3) {
        layerPixels[layerIndex] = newR;
        layerPixels[layerIndex + 1] = newG;
        layerPixels[layerIndex + 2] = newB;
        layerPixels[layerIndex + 3] = newA;
        paintedCount++;
      }
    }

    console.log('FloodFill: Actually painted', paintedCount, 'pixels (base + expansion regions)');

    // 変更されたピクセルデータを現在のレイヤーキャンバスに反映
    layerContext.putImageData(layerImageData, 0, 0);
    console.log('FloodFill: Successfully applied pixel changes to layer', currentLayer);

    // 塗りつぶし完了後、一度だけ合成更新を実行（視覚的なちらつきを防止）
    requestAnimationFrame(() => {
      updateCompositeCanvas();
      console.log('FloodFill: Composite canvas updated (single batch update)');

      // カーソルを元に戻す
      if (canvasRef.current) {
        canvasRef.current.style.cursor = isFillMode ? 'pointer' : 'crosshair';
      }
    });
  }, [getCurrentLayerContext, currentLayer, updateCompositeCanvas]);

  // キーボードショートカット
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'z':
            event.preventDefault();
            if (event.shiftKey) {
              redo(); // Ctrl+Shift+Z または Cmd+Shift+Z
            } else {
              undo(); // Ctrl+Z または Cmd+Z
            }
            break;
          case 'y':
            event.preventDefault();
            redo(); // Ctrl+Y または Cmd+Y
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [undo, redo]);

  // iPadでのスクロール防止のためのタッチイベント制御
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const preventScroll = (e: TouchEvent) => {
      // キャンバス上でのタッチイベントの場合のみスクロールを防止
      if (e.target === canvas) {
        e.preventDefault();
      }
    };

    // パッシブでないイベントリスナーを追加
    canvas.addEventListener('touchstart', preventScroll, { passive: false });
    canvas.addEventListener('touchmove', preventScroll, { passive: false });
    canvas.addEventListener('touchend', preventScroll, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', preventScroll);
      canvas.removeEventListener('touchmove', preventScroll);
      canvas.removeEventListener('touchend', preventScroll);
    };
  }, []);


  // 座標計算のヘルパー関数（objectFit: contain対応）
  const getScaledCoordinates = useCallback((clientX: number, clientY: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    console.log('Canvas rect:', rect);
    console.log('Canvas internal size:', canvas.width, 'x', canvas.height);
    console.log('Click position:', clientX, clientY);

    // objectFit: containによる実際の描画エリアを計算
    const displayAspect = rect.width / rect.height;
    const canvasAspect = canvas.width / canvas.height;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasAspect > displayAspect) {
      // キャンバスが表示エリアより横長：幅基準
      drawWidth = rect.width;
      drawHeight = rect.width / canvasAspect;
      offsetX = 0;
      offsetY = (rect.height - drawHeight) / 2;
    } else {
      // キャンバスが表示エリアより縦長：高さ基準
      drawWidth = rect.height * canvasAspect;
      drawHeight = rect.height;
      offsetX = (rect.width - drawWidth) / 2;
      offsetY = 0;
    }

    // クリック座標を描画エリア内の相対座標に変換
    const relativeX = (clientX - rect.left - offsetX) / drawWidth;
    const relativeY = (clientY - rect.top - offsetY) / drawHeight;

    // キャンバス内部座標に変換
    const x = relativeX * canvas.width;
    const y = relativeY * canvas.height;

    console.log('Calculated coordinates:', x, y);
    console.log('Draw area:', drawWidth, 'x', drawHeight, 'offset:', offsetX, offsetY);

    return { x: Math.max(0, Math.min(canvas.width - 1, x)), y: Math.max(0, Math.min(canvas.height - 1, y)) };
  }, []);

  // キャンバスから色を取得する関数（合成表示から）
  const pickColorFromCanvas = useCallback((x: number, y: number) => {
    if (!context || !canvasRef.current) return;

    const canvas = canvasRef.current;

    // キャンバスの範囲内チェック
    if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) return;

    // 合成表示キャンバスからピクセルデータを取得
    const imageData = context.getImageData(Math.floor(x), Math.floor(y), 1, 1);
    const pixel = imageData.data;

    // RGB値をHEX形式に変換
    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];
    const a = pixel[3];

    // 透明度が低い場合は取得しない
    if (a < 50) return;

    const hexColor = chroma.rgb(r, g, b).hex();

    // 描画色として設定
    setSelectedColor(hexColor);

    // スポイトモードを終了
    setIsEyedropperMode(false);

    // トースト通知
    showToast(`色を取得しました: ${hexColor}`, 'success');

    console.log('Color picked from composite:', hexColor, `RGB(${r}, ${g}, ${b})`);
  }, [context, setSelectedColor, showToast]);

  // 描画開始
  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    console.log('startDrawing called - Current modes:', {
      isFillMode,
      isEraserMode,
      isEyedropperMode,
      currentLayer
    });

    const layerContext = getCurrentLayerContext();
    if (!layerContext || !canvasRef.current) return;

    const { x, y } = getScaledCoordinates(e.clientX, e.clientY);
    console.log('Scaled coordinates:', { x, y });

    // スポイトモードの場合
    if (isEyedropperMode) {
      console.log('Eyedropper mode detected');
      pickColorFromCanvas(x, y);
      return;
    }

    // 塗りつぶしモードの場合
    if (isFillMode) {
      console.log('PaintCanvas: Starting flood fill at coordinates:', { x, y }, 'with color:', selectedColor, 'on layer:', currentLayer);

      // レイヤーコンテキストの状態確認
      const layerContext = getCurrentLayerContext();
      console.log('Layer context available:', !!layerContext);
      console.log('Current layer canvas:', currentLayer === 1 ? !!layer1CanvasRef.current : !!layer2CanvasRef.current);

      // 塗りつぶし前に現在の状態を履歴に保存
      saveToHistory();

      // 塗りつぶし中の中間更新を無効化
      if (compositeUpdateRef.current) {
        cancelAnimationFrame(compositeUpdateRef.current);
        compositeUpdateRef.current = null;
      }
      needsCompositeUpdate.current = false;

      // 塗りつぶし実行（同期的に実行）
      floodFill(x, y, selectedColor);
      return;
    }

    // 描画開始前に現在の状態を履歴に保存
    saveToHistory();

    setIsDrawing(true);

    // 最適化された描画設定を適用
    applyDrawingSettings(layerContext);

    layerContext.beginPath();
    layerContext.moveTo(x, y);
  }, [getCurrentLayerContext, getScaledCoordinates, applyDrawingSettings, isFillMode, isEyedropperMode, selectedColor, floodFill, saveToHistory, pickColorFromCanvas]);

  // 描画中（最適化版）
  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const layerContext = getCurrentLayerContext();
    if (!isDrawing || !layerContext || !canvasRef.current) return;

    const { x, y } = getScaledCoordinates(e.clientX, e.clientY);

    // 描画中は設定済みなので座標のみ更新
    layerContext.lineTo(x, y);
    layerContext.stroke();

    // 描画中は遅延更新でパフォーマンス向上
    scheduleCompositeUpdate();
  }, [isDrawing, getCurrentLayerContext, getScaledCoordinates, scheduleCompositeUpdate]);

  // 描画終了
  const stopDrawing = useCallback(() => {
    const layerContext = getCurrentLayerContext();
    if (!layerContext) return;
    setIsDrawing(false);
    layerContext.closePath();

    // 描画終了時は即座に合成更新
    if (compositeUpdateRef.current) {
      cancelAnimationFrame(compositeUpdateRef.current);
      compositeUpdateRef.current = null;
    }
    updateCompositeCanvas();
  }, [getCurrentLayerContext, updateCompositeCanvas]);

  // タッチイベント対応
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const layerContext = getCurrentLayerContext();
    if (!layerContext || !canvasRef.current) return;

    const touch = e.touches[0];
    const { x, y } = getScaledCoordinates(touch.clientX, touch.clientY);

    // スポイトモードの場合
    if (isEyedropperMode) {
      pickColorFromCanvas(x, y);
      return;
    }

    // 塗りつぶしモードの場合
    if (isFillMode) {
      console.log('PaintCanvas (Touch): Starting flood fill at coordinates:', { x, y }, 'with color:', selectedColor, 'on layer:', currentLayer);

      // レイヤーコンテキストの状態確認
      const layerContext = getCurrentLayerContext();
      console.log('Touch - Layer context available:', !!layerContext);
      console.log('Touch - Current layer canvas:', currentLayer === 1 ? !!layer1CanvasRef.current : !!layer2CanvasRef.current);

      // 塗りつぶし前に現在の状態を履歴に保存
      saveToHistory();

      // 塗りつぶし中の中間更新を無効化
      if (compositeUpdateRef.current) {
        cancelAnimationFrame(compositeUpdateRef.current);
        compositeUpdateRef.current = null;
      }
      needsCompositeUpdate.current = false;

      // 塗りつぶし実行（同期的に実行）
      floodFill(x, y, selectedColor);
      return;
    }

    // 描画開始前に現在の状態を履歴に保存
    saveToHistory();

    setIsDrawing(true);

    // 最適化された描画設定を適用
    applyDrawingSettings(layerContext);

    layerContext.beginPath();
    layerContext.moveTo(x, y);
  }, [getCurrentLayerContext, getScaledCoordinates, applyDrawingSettings, isFillMode, isEyedropperMode, selectedColor, floodFill, saveToHistory, pickColorFromCanvas]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const layerContext = getCurrentLayerContext();
    if (!isDrawing || !layerContext || !canvasRef.current) return;

    const touch = e.touches[0];
    const { x, y } = getScaledCoordinates(touch.clientX, touch.clientY);

    // 描画中は設定済みなので座標のみ更新
    layerContext.lineTo(x, y);
    layerContext.stroke();

    // 描画中は遅延更新でパフォーマンス向上
    scheduleCompositeUpdate();
  }, [isDrawing, getCurrentLayerContext, getScaledCoordinates, scheduleCompositeUpdate]);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const layerContext = getCurrentLayerContext();
    if (!layerContext) return;
    setIsDrawing(false);
    layerContext.closePath();

    // 描画終了時は即座に合成更新
    if (compositeUpdateRef.current) {
      cancelAnimationFrame(compositeUpdateRef.current);
      compositeUpdateRef.current = null;
    }
    updateCompositeCanvas();
  }, [getCurrentLayerContext, updateCompositeCanvas]);

  // キャンバスをクリア
  const clearCanvas = useCallback(() => {
    const layerContext = getCurrentLayerContext();
    const currentLayerCanvas = currentLayer === 1 ? layer1CanvasRef.current : layer2CanvasRef.current;
    if (!layerContext || !currentLayerCanvas) return;

    // クリア前に現在の状態を履歴に保存
    saveToHistory();

    // 少し待ってからクリア実行
    setTimeout(() => {
      // 現在のレイヤーをクリア
      layerContext.save();
      layerContext.globalCompositeOperation = 'source-over';

      if (currentLayer === 1) {
        // レイヤー1は透明にクリア
        layerContext.clearRect(0, 0, currentLayerCanvas.width, currentLayerCanvas.height);
      } else {
        // レイヤー2は常に白色でクリア（テーマに関係なく）
        layerContext.fillStyle = '#ffffff';
        layerContext.fillRect(0, 0, currentLayerCanvas.width, currentLayerCanvas.height);
      }

      layerContext.restore();

      // 描画設定を再設定
      layerContext.globalCompositeOperation = 'source-over';
      layerContext.strokeStyle = isEraserMode ? '#ffffff' : selectedColor;
      layerContext.lineWidth = penSize;
      layerContext.lineCap = 'round';
      layerContext.lineJoin = 'round';

      // クリア後は即座に合成更新
      updateCompositeCanvas();
    }, 10);
  }, [getCurrentLayerContext, currentLayer, penSize, isEraserMode, selectedColor, saveToHistory, updateCompositeCanvas]);

  // ペンサイズ変更関数
  const increasePenSize = useCallback(() => {
    setPenSize(prev => Math.min(prev + 2, 200)); // 最大200px
  }, []);

  const decreasePenSize = useCallback(() => {
    setPenSize(prev => Math.max(prev - 2, 2)); // 最小2px
  }, []);


  // ペンサイズ数値入力の処理
  const handlePenSizeEdit = useCallback(() => {
    setTempPenSize(penSize.toString());
    setIsEditingPenSize(true);
  }, [penSize]);

  const handlePenSizeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTempPenSize(value);

    // 空文字列の場合は何もしない（一時的に空を許可）
    if (value === '') {
      return;
    }

    // 数値として有効で範囲内の場合のみ更新
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 2 && numValue <= 200) {
      setPenSize(numValue);
    }
  }, []);

  const handlePenSizeBlur = useCallback(() => {
    // 編集終了時に空文字列の場合は前の値に戻す
    if (tempPenSize === '' || tempPenSize === '0' || tempPenSize === '1') {
      // 無効な値の場合は最小値の2に設定
      setPenSize(2);
    } else {
      const numValue = parseInt(tempPenSize, 10);
      if (!isNaN(numValue)) {
        // 範囲外の場合は範囲内に収める
        const clampedValue = Math.max(2, Math.min(200, numValue));
        setPenSize(clampedValue);
      }
    }
    setIsEditingPenSize(false);
    setTempPenSize('');
  }, [tempPenSize]);

  const handlePenSizeKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handlePenSizeBlur();
    }
    if (e.key === 'Escape') {
      // Escapeの場合は変更をキャンセルして元の値に戻す
      setIsEditingPenSize(false);
      setTempPenSize('');
    }
  }, [handlePenSizeBlur]);


  // キャンバスをダウンロードする関数
  const downloadCanvas = useCallback(() => {
    if (!canvasRef.current) return;

    try {
      const canvas = canvasRef.current;

      // 現在の日時でファイル名を生成
      const now = new Date();
      const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = `canvas-drawing-${timestamp}.png`;

      // CanvasをPNG形式のDataURLに変換
      const dataURL = canvas.toDataURL('image/png');

      // ダウンロード用のリンクを作成
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataURL;

      // 一時的にDOMに追加してクリックしてから削除
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('Canvas downloaded as:', filename);
    } catch (error) {
      console.error('Failed to download canvas:', error);
    }
  }, []);

  // 画像アップロードボタンクリック時の処理
  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  // ファイル選択時の処理
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      showToast(validation.error || '無効なファイルです', 'error');
      return;
    }

    // キャンバスに画像を描画
    drawImageToCanvas(file);

    // 色抽出処理も実行（ベースカラー選択と同期）
    try {
      const result = await extractColorsFromImage(file, 8);
      setExtractedColors(result.colors, result.dominantColor);
      showToast('画像から色を抽出しました', 'success');
    } catch (error) {
      console.error('Color extraction failed:', error);
      showToast('色の抽出に失敗しました', 'error');
    }

    // input をリセット（同じファイルを再選択可能にする）
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className={`w-full flex flex-col bg-background border-transparent ${className}`} style={{ height: '600px' }}>
      <CardHeader className="pb-0 pt-1">
        <div className="flex flex-wrap items-center justify-start gap-2">
          {/* 現在の描画色表示（ColorPicker風） */}
          <div className="relative cursor-pointer hover:scale-110 transition-all duration-200 flex-shrink-0">
            <input
              type="color"
              value={selectedColor}
              onChange={handleColorPickerChange}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
              title="描画色を変更"
            />
            <div
              className={`${BORDER_PRESETS.colorBlock} flex items-center justify-center pointer-events-none w-6 h-6 sm:w-8 sm:h-8`}
              style={{
                backgroundColor: selectedColor
              }}
              title="描画色 - クリックで変更"
            >
              <Palette
                className="w-3 h-3 sm:w-4 sm:h-4"
                style={{ color: getIconColor() }}
              />
            </div>
          </div>
          {/* スポイトボタン */}
          <div className="flex flex-wrap gap-1 flex-shrink-0">
            <Button
              onClick={() => {
                setIsEyedropperMode(!isEyedropperMode);
                setIsEraserMode(false);
                setIsFillMode(false);
              }}
              variant={isEyedropperMode ? "default" : "outline"}
              size="sm"
              className="h-6 px-1 sm:h-8 sm:px-2"
              title="スポイトツール - キャンバスから色を取得"
            >
              <Pipette className="w-4 h-4 text-foreground" />
            </Button>
          </div>
          {/* ペン/消しゴム/塗りつぶしモード切り替え */}
          <div className="flex flex-wrap gap-1 flex-shrink-0">
            <Button
              onClick={() => {
                setIsEraserMode(false);
                setIsFillMode(false);
                setIsEyedropperMode(false);
              }}
              variant={!isEraserMode && !isFillMode && !isEyedropperMode ? "default" : "outline"}
              size="sm"
              className="h-6 px-1 sm:h-8 sm:px-2"
            >
              <Pen className="w-4 h-4 text-foreground" />
            </Button>
            <Button
              onClick={() => {
                setIsEraserMode(true);
                setIsFillMode(false);
                setIsEyedropperMode(false);
              }}
              variant={isEraserMode ? "default" : "outline"}
              size="sm"
              className="h-6 px-1 sm:h-8 sm:px-2"
            >
              <Eraser className="w-4 h-4 text-foreground" />
            </Button>
            <Button
              onClick={() => {
                console.log('Fill button clicked - setting fill mode');
                setIsEraserMode(false);
                setIsFillMode(true);
                setIsEyedropperMode(false);
                console.log('Fill mode state should now be true');
              }}
              variant={isFillMode ? "default" : "outline"}
              size="sm"
              className="h-6 px-1 sm:h-8 sm:px-2"
              title="塗りつぶしツール"
            >
              <PaintBucket className="w-4 h-4 text-foreground" />
            </Button>
          </div>
          {/* レイヤー切り替えボタン */}
          <div className="flex flex-wrap gap-1 flex-shrink-0">
            <Button
              onClick={() => setCurrentLayer(1)}
              variant={currentLayer === 1 ? "default" : "outline"}
              size="sm"
              className="h-6 px-1 sm:h-8 sm:px-2"
              title="レイヤー1（上）"
            >
              <Layers className="w-4 h-4 text-foreground" />
              <span className="ml-1 text-xs text-foreground">1</span>
            </Button>
            <Button
              onClick={() => setCurrentLayer(2)}
              variant={currentLayer === 2 ? "default" : "outline"}
              size="sm"
              className="h-6 px-1 sm:h-8 sm:px-2"
              title="レイヤー2（下）"
            >
              <Layers className="w-4 h-4 text-foreground" />
              <span className="ml-1 text-xs text-foreground">2</span>
            </Button>
          </div>
          {/* Undo/Redoボタン */}
          <div className="flex flex-wrap gap-1 flex-shrink-0">
            <Button
              onClick={undo}
              variant="outline"
              size="sm"
              className="h-6 px-1 sm:h-8 sm:px-2"
              disabled={historyIndex <= 0}
              title="元に戻す (Ctrl+Z)"
            >
              <Undo className="w-4 h-4 text-foreground" />
            </Button>
            <Button
              onClick={redo}
              variant="outline"
              size="sm"
              className="h-6 px-1 sm:h-8 sm:px-2"
              disabled={historyIndex >= history.length - 1}
              title="やり直し (Ctrl+Y)"
            >
              <Redo className="w-4 h-4 text-foreground" />
            </Button>
          </div>
          {/* ペンサイズ調整 */}
          <div className="flex flex-wrap items-center gap-1 flex-shrink-0">
            <Button
              onClick={decreasePenSize}
              variant="outline"
              size="sm"
              className="h-6 w-6 p-0 sm:h-8 sm:w-8"
              disabled={penSize <= 2}
            >
              <Minus className="w-3 h-3 text-foreground" />
            </Button>
            {isEditingPenSize ? (
              <input
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                value={tempPenSize}
                onChange={handlePenSizeChange}
                onBlur={handlePenSizeBlur}
                onKeyDown={handlePenSizeKeyDown}
                min="2"
                max="200"
                className="text-xs font-mono text-foreground min-w-[20px] sm:min-w-[24px] text-center bg-transparent border border-border rounded px-0.5 sm:px-1 h-5 sm:h-6 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                autoFocus
              />
            ) : (
              <span
                className="text-xs font-mono text-foreground min-w-[20px] sm:min-w-[24px] text-center cursor-pointer hover:bg-muted rounded px-0.5 sm:px-1 py-0.5 sm:py-1"
                onClick={handlePenSizeEdit}
                title="クリックして数値入力"
              >
                {penSize}
              </span>
            )}
            <Button
              onClick={increasePenSize}
              variant="outline"
              size="sm"
              className="h-6 w-6 p-0 sm:h-8 sm:w-8"
              disabled={penSize >= 200}
            >
              <Plus className="w-3 h-3 text-foreground" />
            </Button>
          </div>
          {/* その他のボタングループ - リセット、色抽出、ダウンロード */}
          <div className="flex flex-wrap gap-1 flex-shrink-0">
            {/* リセットボタン */}
            <Button
              onClick={clearCanvas}
              variant="outline"
              size="sm"
              className="h-6 px-1 sm:h-8 sm:px-2"
            >
              <CircleDashed className="w-4 h-4 text-foreground" />
            </Button>
            {/* 色抽出更新ボタン */}
            <Button
              onClick={extractColorsFromCanvas}
              variant="outline"
              size="sm"
              className="h-6 px-1 sm:h-8 sm:px-2"
              disabled={isExtractingColors}
              title="キャンバスから色を抽出"
            >
              <RefreshCw className={`w-4 h-4 text-foreground ${isExtractingColors ? 'animate-spin' : ''}`} />
            </Button>
            {/* ダウンロードボタン */}
            <Button
              onClick={downloadCanvas}
              variant="outline"
              size="sm"
              className="h-6 px-1 sm:h-8 sm:px-2"
              title="キャンバスをPNG画像でダウンロード"
            >
              <Download className="w-4 h-4 text-foreground" />
            </Button>
            {/* 画像アップロードボタン */}
            <Button
              onClick={handleImageUploadClick}
              variant="outline"
              size="sm"
              className="h-6 px-1 sm:h-8 sm:px-2"
              title="画像をアップロードしてキャンバスに描画"
            >
              <Upload className="w-4 h-4 text-foreground" />
            </Button>
            {/* テンプレート画像読み込みボタン */}
            <Button
              onClick={() => {
                console.log('Template button clicked');
                loadTemplateImage();
              }}
              variant="outline"
              size="sm"
              className="h-6 px-1 sm:h-8 sm:px-2"
              title="テンプレート画像を読み込み（線画：Wacom提供）"
            >
              <Image className="w-4 h-4 text-foreground" />
            </Button>
          </div>
        </div>
        {/* 隠しファイル入力 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </CardHeader>
      <CardContent className="pt-1 pb-1 flex-1 flex flex-col">
        <div className="relative flex-1 flex flex-col">
          {/* 隠しレイヤーキャンバス */}
          <canvas
            ref={layer1CanvasRef}
            className="absolute inset-0 pointer-events-none opacity-0"
            style={{
              width: '100%',
              height: `${Math.min(450, Math.floor(containerWidth / canvasAspectRatio))}px`,
              objectFit: 'contain'
            }}
          />
          <canvas
            ref={layer2CanvasRef}
            className="absolute inset-0 pointer-events-none opacity-0"
            style={{
              width: '100%',
              height: `${Math.min(450, Math.floor(containerWidth / canvasAspectRatio))}px`,
              objectFit: 'contain'
            }}
          />
          {/* 表示用合成キャンバス */}
          <canvas
            ref={canvasRef}
            className={`border border-border rounded-md bg-white ${isEyedropperMode ? 'cursor-crosshair' :
              isFillMode ? 'cursor-pointer' : 'cursor-crosshair'
              }`}
            data-fill-mode={isFillMode}
            data-eraser-mode={isEraserMode}
            data-eyedropper-mode={isEyedropperMode}
            style={{
              width: '100%',
              height: `${Math.min(450, Math.floor(containerWidth / canvasAspectRatio))}px`,
              objectFit: 'contain',
              touchAction: 'none'
            }}
            onMouseDown={(e) => {
              console.log('Mouse down event fired');
              startDrawing(e);
            }}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
        </div>
        {/* Wacomクレジット */}
        <div className="mt-2 text-center">
          <p className="text-xs text-muted-foreground">
            テンプレート線画：
            <a
              href="https://tablet.wacom.co.jp/article/painting-with-wacom"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline ml-1"
            >
              Wacom提供
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
});

PaintCanvasComponent.displayName = 'PaintCanvas';

export const PaintCanvas = PaintCanvasComponent;