import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CircleDashed, Plus, Minus, Eraser, Pen, PaintBucket, Undo, Redo, Palette, RefreshCw, Download } from 'lucide-react';
import { BORDER_PRESETS } from '@/constants/ui';
import { useColorStore } from '@/store/colorStore';
import chroma from 'chroma-js';
import ColorThief from 'colorthief';
import type { ExtractedColor } from '@/lib/colorExtractor';

interface PaintCanvasProps {
  className?: string;
}

export const PaintCanvas: React.FC<PaintCanvasProps> = ({ className = '' }) => {
  const { selectedColor, setSelectedColor, setExtractedColors } = useColorStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [penSize, setPenSize] = useState(8);
  const [isEraserMode, setIsEraserMode] = useState(false);
  const [isFillMode, setIsFillMode] = useState(false);
  const [isEditingPenSize, setIsEditingPenSize] = useState(false);
  const [tempPenSize, setTempPenSize] = useState('');
  const [isExtractingColors, setIsExtractingColors] = useState(false);

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

  // カラーピッカーの変更ハンドラー
  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setSelectedColor(color);
  };

  // キャンバスの初期化
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // キャンバス内部解像度を超高解像度に設定（4K対応）
        canvas.width = 1920;
        canvas.height = 1440;

        // 描画設定
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#000000'; // 黒色固定
        ctx.lineWidth = 8; // 初期ペンサイズ
        ctx.globalCompositeOperation = 'source-over'; // 初期は通常描画モード

        // 背景を白に設定
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        setContext(ctx);

        // 初期状態を履歴に保存（白い背景）
        setTimeout(() => {
          if (canvasRef.current) {
            const dataURL = canvasRef.current.toDataURL();
            console.log('Initial history saved:', dataURL.substring(0, 50) + '...');
            setHistory([dataURL]);
            setHistoryIndex(0);
          }
        }, 100);
      }
    }
  }, []);

  // 履歴に現在の状態を保存
  const saveToHistory = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();

    console.log('Saving to history - current index:', historyIndex);

    setHistory(prevHistory => {
      // 現在のインデックス以降の履歴を削除（新しい操作時）
      const newHistory = prevHistory.slice(0, historyIndex + 1);
      newHistory.push(dataURL);

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

  // 履歴から状態を復元
  const restoreFromHistory = useCallback((dataURL: string) => {
    if (!context || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const img = new Image();

    img.onload = () => {
      // キャンバスをクリア
      context.clearRect(0, 0, canvas.width, canvas.height);
      // 背景を白に設定
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      // 画像を復元
      context.drawImage(img, 0, 0);
    };

    img.src = dataURL;
  }, [context]);

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

  // フラッドフィル（塗りつぶし）アルゴリズム
  const floodFill = useCallback((startX: number, startY: number, newColor: string) => {
    if (!context || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    // === 調整可能な定数 ===
    const colorTolerance = 8;        // 色の許容閾値（0-255）
    const gapBridgeDistance = 3;     // 隙間をブリッジする最大距離（px）- 大幅削減
    const gapSearchRadius = 1;       // 隙間検索時の探索半径（px）- 最小限に

    // 新しい色をRGBAに変換
    const hex = newColor.replace('#', '');
    const newR = parseInt(hex.substring(0, 2), 16);
    const newG = parseInt(hex.substring(2, 4), 16);
    const newB = parseInt(hex.substring(4, 6), 16);
    const newA = 255;

    // 開始点の色を取得
    const startIndex = (Math.floor(startY) * canvas.width + Math.floor(startX)) * 4;
    const startR = pixels[startIndex];
    const startG = pixels[startIndex + 1];
    const startB = pixels[startIndex + 2];
    const startA = pixels[startIndex + 3];

    // 軽量な色の差を計算する関数（平方根を避ける）
    const colorDistance = (r1: number, g1: number, b1: number, a1: number, r2: number, g2: number, b2: number, a2: number) => {
      return Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2) + Math.abs(a1 - a2);
    };

    // 指定位置のピクセルが開始色と似ているかチェック
    const isSimilarToStart = (x: number, y: number) => {
      if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) return false;
      const index = (y * canvas.width + x) * 4;
      const r = pixels[index];
      const g = pixels[index + 1];
      const b = pixels[index + 2];
      const a = pixels[index + 3];
      return colorDistance(r, g, b, a, startR, startG, startB, startA) <= colorTolerance;
    };

    // 隙間を越えて同じ色の領域があるかチェック（非常に保守的）
    const canBridgeGap = (fromX: number, fromY: number, dirX: number, dirY: number) => {
      // 隙間の向こう側に同じ色があり、かつ隙間が十分小さい場合のみ
      let gapPixels = 0;
      
      for (let dist = 1; dist <= gapBridgeDistance; dist++) {
        const checkX = fromX + dirX * dist;
        const checkY = fromY + dirY * dist;
        
        if (checkX < 0 || checkX >= canvas.width || checkY < 0 || checkY >= canvas.height) {
          return false; // 範囲外なら失敗
        }
        
        if (isSimilarToStart(checkX, checkY)) {
          // 同じ色を見つけた
          
          // 周辺の大部分が同じ色かチェック（より厳格に）
          let matchCount = 0;
          let totalCount = 0;
          for (let dx = -gapSearchRadius; dx <= gapSearchRadius; dx++) {
            for (let dy = -gapSearchRadius; dy <= gapSearchRadius; dy++) {
              const nearX = checkX + dx;
              const nearY = checkY + dy;
              if (nearX >= 0 && nearX < canvas.width && nearY >= 0 && nearY < canvas.height) {
                totalCount++;
                if (isSimilarToStart(nearX, nearY)) {
                  matchCount++;
                }
              }
            }
          }
          
          // 80%以上が同じ色で、隙間が2px以下の場合のみ許可
          return matchCount >= totalCount * 0.8 && gapPixels <= 2;
        } else {
          gapPixels++;
        }
      }
      
      return false;
    };

    // 同じ色の場合は何もしない
    if (colorDistance(startR, startG, startB, startA, newR, newG, newB, newA) < colorTolerance) {
      return;
    }

    // 処理済みピクセルをビットマップで管理（メモリ効率向上）
    const visitedBitmap = new Uint8Array(Math.ceil(canvas.width * canvas.height / 8));
    
    const setVisited = (x: number, y: number) => {
      const bitIndex = y * canvas.width + x;
      const byteIndex = Math.floor(bitIndex / 8);
      const bitOffset = bitIndex % 8;
      visitedBitmap[byteIndex] |= (1 << bitOffset);
    };
    
    const isVisited = (x: number, y: number) => {
      const bitIndex = y * canvas.width + x;
      const byteIndex = Math.floor(bitIndex / 8);
      const bitOffset = bitIndex % 8;
      return (visitedBitmap[byteIndex] & (1 << bitOffset)) !== 0;
    };

    // スタックベースのフラッドフィル
    const stack: { x: number; y: number }[] = [{ x: Math.floor(startX), y: Math.floor(startY) }];

    while (stack.length > 0) {
      const { x, y } = stack.pop()!;

      if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;
      if (isVisited(x, y)) continue;
      
      setVisited(x, y);

      const index = (y * canvas.width + x) * 4;

      // 現在のピクセルが開始色と似ているかチェック（閾値を使用）
      const currentR = pixels[index];
      const currentG = pixels[index + 1];
      const currentB = pixels[index + 2];
      const currentA = pixels[index + 3];

      const isDirectMatch = colorDistance(currentR, currentG, currentB, currentA, startR, startG, startB, startA) <= colorTolerance;
      
      if (isDirectMatch) {
        // 新しい色に塗り替え
        pixels[index] = newR;
        pixels[index + 1] = newG;
        pixels[index + 2] = newB;
        pixels[index + 3] = newA;

        // 隣接する4方向をスタックに追加
        stack.push({ x: x + 1, y });
        stack.push({ x: x - 1, y });
        stack.push({ x, y: y + 1 });
        stack.push({ x, y: y - 1 });
      } else {
        // 直接マッチしない場合、非常に限定的な隙間ブリッジのみ試行
        // 水平・垂直方向のみチェック（斜めは除外）
        const directions = [
          { dx: 1, dy: 0 },   // 右
          { dx: -1, dy: 0 },  // 左
          { dx: 0, dy: 1 },   // 下
          { dx: 0, dy: -1 }   // 上
        ];

        let bridgeApplied = false;
        for (const { dx, dy } of directions) {
          if (!bridgeApplied && canBridgeGap(x, y, dx, dy)) {
            // 1方向のみブリッジを許可（複数方向ブリッジを防止）
            const targetX = x + dx * gapBridgeDistance;
            const targetY = y + dy * gapBridgeDistance;
            
            if (targetX >= 0 && targetX < canvas.width && targetY >= 0 && targetY < canvas.height) {
              if (!isVisited(targetX, targetY) && isSimilarToStart(targetX, targetY)) {
                stack.push({ x: targetX, y: targetY });
                bridgeApplied = true;
              }
            }
          }
        }
      }
    }

    // 変更されたピクセルデータをキャンバスに反映
    context.putImageData(imageData, 0, 0);
  }, [context]);

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


  // 座標計算のヘルパー関数
  const getScaledCoordinates = useCallback((clientX: number, clientY: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    // 表示サイズと実際のキャンバスサイズの比率を計算
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // スケールを考慮した座標計算
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    return { x, y };
  }, []);

  // 描画開始
  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context || !canvasRef.current) return;

    const { x, y } = getScaledCoordinates(e.clientX, e.clientY);

    // 塗りつぶしモードの場合
    if (isFillMode) {
      console.log('PaintCanvas: Starting flood fill with color:', selectedColor);
      // 塗りつぶし前に現在の状態を履歴に保存
      saveToHistory();
      // 少し待ってから塗りつぶし実行
      setTimeout(() => {
        floodFill(x, y, selectedColor);
      }, 10);
      return;
    }

    // 描画開始前に現在の状態を履歴に保存
    saveToHistory();
    
    setIsDrawing(true);

    // 描画設定を確実に適用
    context.globalCompositeOperation = 'source-over'; // 常に通常描画モード
    if (isEraserMode) {
      context.strokeStyle = '#ffffff'; // 消しゴムは白色で描画
    } else {
      context.strokeStyle = selectedColor; // 選択された色
    }
    context.lineWidth = penSize;
    context.lineCap = 'round';
    context.lineJoin = 'round';

    context.beginPath();
    context.moveTo(x, y);
  }, [context, getScaledCoordinates, penSize, isEraserMode, isFillMode, selectedColor, floodFill, saveToHistory]);

  // 描画中
  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context || !canvasRef.current) return;

    const { x, y } = getScaledCoordinates(e.clientX, e.clientY);

    // 描画設定を確実に維持
    context.globalCompositeOperation = 'source-over';
    if (isEraserMode) {
      context.strokeStyle = '#ffffff'; // 消しゴムは白色で描画
    } else {
      context.strokeStyle = selectedColor; // 選択された色
    }

    context.lineTo(x, y);
    context.stroke();
  }, [isDrawing, context, getScaledCoordinates, isEraserMode, selectedColor]);

  // 描画終了
  const stopDrawing = useCallback(() => {
    if (!context) return;
    setIsDrawing(false);
    context.closePath();
  }, [context]);

  // タッチイベント対応
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!context || !canvasRef.current) return;

    const touch = e.touches[0];
    const { x, y } = getScaledCoordinates(touch.clientX, touch.clientY);

    // 塗りつぶしモードの場合
    if (isFillMode) {
      // 塗りつぶし前に現在の状態を履歴に保存
      saveToHistory();
      // 少し待ってから塗りつぶし実行
      setTimeout(() => {
        floodFill(x, y, selectedColor);
      }, 10);
      return;
    }

    // 描画開始前に現在の状態を履歴に保存
    saveToHistory();
    
    setIsDrawing(true);

    // 描画設定を確実に適用
    context.globalCompositeOperation = 'source-over'; // 常に通常描画モード
    if (isEraserMode) {
      context.strokeStyle = '#ffffff'; // 消しゴムは白色で描画
    } else {
      context.strokeStyle = selectedColor; // 選択された色
    }
    context.lineWidth = penSize;
    context.lineCap = 'round';
    context.lineJoin = 'round';

    context.beginPath();
    context.moveTo(x, y);
  }, [context, getScaledCoordinates, penSize, isEraserMode, isFillMode, selectedColor, floodFill, saveToHistory]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing || !context || !canvasRef.current) return;

    const touch = e.touches[0];
    const { x, y } = getScaledCoordinates(touch.clientX, touch.clientY);

    // 描画設定を確実に維持
    context.globalCompositeOperation = 'source-over';
    if (isEraserMode) {
      context.strokeStyle = '#ffffff'; // 消しゴムは白色で描画
    } else {
      context.strokeStyle = selectedColor; // 選択された色
    }

    context.lineTo(x, y);
    context.stroke();
  }, [isDrawing, context, getScaledCoordinates, isEraserMode, selectedColor]);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!context) return;
    setIsDrawing(false);
    context.closePath();
  }, [context]);

  // キャンバスをクリア
  const clearCanvas = useCallback(() => {
    if (!context || !canvasRef.current) return;

    // クリア前に現在の状態を履歴に保存
    saveToHistory();

    // 少し待ってからクリア実行
    setTimeout(() => {
      // 背景をクリア
      context.save();
      context.globalCompositeOperation = 'source-over';
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
      context.restore();

      // 描画設定を再設定
      context.globalCompositeOperation = 'source-over';
      context.strokeStyle = isEraserMode ? '#ffffff' : selectedColor;
      context.lineWidth = penSize;
      context.lineCap = 'round';
      context.lineJoin = 'round';
    }, 10);
  }, [context, penSize, isEraserMode, selectedColor, saveToHistory]);

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

  // キャンバスから色を抽出する関数
  const extractColorsFromCanvas = useCallback(async () => {
    if (!canvasRef.current) return;

    setIsExtractingColors(true);
    
    try {
      const canvas = canvasRef.current;
      
      // キャンバスを一時的な画像として作成
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      // 高速化のため縮小して処理
      const maxDimension = 400;
      let width = canvas.width;
      let height = canvas.height;
      
      if (width > maxDimension || height > maxDimension) {
        const ratio = Math.min(maxDimension / width, maxDimension / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }

      tempCanvas.width = width;
      tempCanvas.height = height;
      tempCtx.drawImage(canvas, 0, 0, width, height);

      // Canvas内容を画像として取得
      const dataURL = tempCanvas.toDataURL('image/png');
      const img = new Image();
      
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

  return (
    <Card className={`w-full h-full flex flex-col bg-background border-transparent ${className}`}>
      <CardHeader className="pb-1 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">
            0.キャンバス
          </h3>
          <div className="flex items-center gap-2">
            {/* 現在の描画色表示（ColorPicker風） */}
            <div className="relative cursor-pointer hover:scale-110 transition-all duration-200">
              <input
                type="color"
                value={selectedColor}
                onChange={handleColorPickerChange}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                title={`描画色を変更: ${selectedColor}`}
              />
              <div 
                className={`${BORDER_PRESETS.colorBlock} flex items-center justify-center pointer-events-none`}
                style={{
                  backgroundColor: selectedColor,
                  width: '24px',
                  height: '24px'
                }}
                title={`描画色: ${selectedColor} - クリックで変更`}
              >
                <Palette 
                  className="w-3 h-3" 
                  style={{ color: getIconColor() }}
                />
              </div>
            </div>
            {/* ペン/消しゴム/塗りつぶしモード切り替え */}
            <div className="flex gap-1">
              <Button
                onClick={() => {
                  setIsEraserMode(false);
                  setIsFillMode(false);
                }}
                variant={!isEraserMode && !isFillMode ? "default" : "outline"}
                size="sm"
                className="h-8 px-2"
              >
                <Pen className="w-4 h-4 text-foreground" />
              </Button>
              <Button
                onClick={() => {
                  setIsEraserMode(true);
                  setIsFillMode(false);
                }}
                variant={isEraserMode ? "default" : "outline"}
                size="sm"
                className="h-8 px-2"
              >
                <Eraser className="w-4 h-4 text-foreground" />
              </Button>
              <Button
                onClick={() => {
                  setIsEraserMode(false);
                  setIsFillMode(true);
                }}
                variant={isFillMode ? "default" : "outline"}
                size="sm"
                className="h-8 px-2"
              >
                <PaintBucket className="w-4 h-4 text-foreground" />
              </Button>
            </div>
            {/* Undo/Redoボタン */}
            <div className="flex gap-1">
              <Button
                onClick={undo}
                variant="outline"
                size="sm"
                className="h-8 px-2"
                disabled={historyIndex <= 0}
                title="元に戻す (Ctrl+Z)"
              >
                <Undo className="w-4 h-4 text-foreground" />
              </Button>
              <Button
                onClick={redo}
                variant="outline"
                size="sm"
                className="h-8 px-2"
                disabled={historyIndex >= history.length - 1}
                title="やり直し (Ctrl+Y)"
              >
                <Redo className="w-4 h-4 text-foreground" />
              </Button>
            </div>
            {/* ペンサイズ調整 */}
            <div className="flex items-center gap-1">
              <Button
                onClick={decreasePenSize}
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
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
                  className="text-xs font-mono text-foreground min-w-[24px] text-center bg-transparent border border-border rounded px-1 h-6 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                  autoFocus
                />
              ) : (
                <span 
                  className="text-xs font-mono text-foreground min-w-[24px] text-center cursor-pointer hover:bg-muted rounded px-1 py-1"
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
                className="h-8 w-8 p-0"
                disabled={penSize >= 200}
              >
                <Plus className="w-3 h-3 text-foreground" />
              </Button>
            </div>
            {/* リセットボタン */}
            <Button
              onClick={clearCanvas}
              variant="outline"
              size="sm"
              className="h-8 px-2"
            >
              <CircleDashed className="w-4 h-4 text-foreground" />
            </Button>
            {/* 色抽出更新ボタン */}
            <Button
              onClick={extractColorsFromCanvas}
              variant="outline"
              size="sm"
              className="h-8 px-2"
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
              className="h-8 px-2"
              title="キャンバスをPNG画像でダウンロード"
            >
              <Download className="w-4 h-4 text-foreground" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-1 pb-4 flex-1 flex flex-col">
        <div className="relative flex-1 flex flex-col">
          <canvas
            ref={canvasRef}
            className={`border border-border rounded-md bg-white ${isFillMode ? 'cursor-pointer' : 'cursor-crosshair'
              }`}
            style={{ 
              width: '100%', 
              height: 'auto',
              touchAction: 'none'
            }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
        </div>
      </CardContent>
    </Card>
  );
};