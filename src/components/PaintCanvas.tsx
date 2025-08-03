import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CircleDashed, Palette, Plus, Minus, Eraser, Edit, PaintBucket, Undo, Redo } from 'lucide-react';

interface PaintCanvasProps {
  className?: string;
}

export const PaintCanvas: React.FC<PaintCanvasProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [penSize, setPenSize] = useState(8);
  const [isEraserMode, setIsEraserMode] = useState(false);
  const [isFillMode, setIsFillMode] = useState(false);
  const [fillColor, setFillColor] = useState('#000000');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Undo/Redo履歴管理
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const maxHistorySize = 50; // 最大履歴保存数

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
        }, 200);
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
        return newHistory;
      }
      
      // インデックスを更新
      setHistoryIndex(newHistory.length - 1);
      console.log('New history index:', newHistory.length - 1);
      return newHistory;
    });
  }, [historyIndex, maxHistorySize]);

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
        context.strokeStyle = '#000000'; // 通常は黒色
      }
    }
  }, [context, isEraserMode]);

  // フラッドフィル（塗りつぶし）アルゴリズム
  const floodFill = useCallback((startX: number, startY: number, newColor: string) => {
    if (!context || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
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
    
    // 同じ色の場合は何もしない
    if (startR === newR && startG === newG && startB === newB && startA === newA) {
      return;
    }
    
    // スタックベースのフラッドフィル
    const stack: { x: number; y: number }[] = [{ x: Math.floor(startX), y: Math.floor(startY) }];
    
    while (stack.length > 0) {
      const { x, y } = stack.pop()!;
      
      if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;
      
      const index = (y * canvas.width + x) * 4;
      
      // 現在のピクセルが開始色と同じかチェック
      if (pixels[index] === startR && 
          pixels[index + 1] === startG && 
          pixels[index + 2] === startB && 
          pixels[index + 3] === startA) {
        
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

  // コンポーネントアンマウント時のクリーンアップ
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
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
      // 塗りつぶし前の状態を履歴に保存
      saveToHistory();
      floodFill(x, y, fillColor);
      return;
    }
    
    // 描画開始前の状態を履歴に保存
    saveToHistory();
    
    setIsDrawing(true);
    
    // 描画設定を確実に適用
    context.globalCompositeOperation = 'source-over'; // 常に通常描画モード
    if (isEraserMode) {
      context.strokeStyle = '#ffffff'; // 消しゴムは白色で描画
    } else {
      context.strokeStyle = '#000000'; // 通常は黒色
    }
    context.lineWidth = penSize;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    
    context.beginPath();
    context.moveTo(x, y);
  }, [context, getScaledCoordinates, penSize, isEraserMode, isFillMode, fillColor, floodFill]);

  // 描画中
  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context || !canvasRef.current) return;
    
    const { x, y } = getScaledCoordinates(e.clientX, e.clientY);
    
    // 描画設定を確実に維持
    context.globalCompositeOperation = 'source-over';
    if (isEraserMode) {
      context.strokeStyle = '#ffffff'; // 消しゴムは白色で描画
    } else {
      context.strokeStyle = '#000000'; // 通常は黒色
    }
    
    context.lineTo(x, y);
    context.stroke();
  }, [isDrawing, context, getScaledCoordinates, isEraserMode]);

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
      // 塗りつぶし前の状態を履歴に保存
      saveToHistory();
      floodFill(x, y, fillColor);
      return;
    }
    
    // 描画開始前の状態を履歴に保存
    saveToHistory();
    
    setIsDrawing(true);
    
    // 描画設定を確実に適用
    context.globalCompositeOperation = 'source-over'; // 常に通常描画モード
    if (isEraserMode) {
      context.strokeStyle = '#ffffff'; // 消しゴムは白色で描画
    } else {
      context.strokeStyle = '#000000'; // 通常は黒色
    }
    context.lineWidth = penSize;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    
    context.beginPath();
    context.moveTo(x, y);
  }, [context, getScaledCoordinates, penSize, isEraserMode, isFillMode, fillColor, floodFill]);

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
      context.strokeStyle = '#000000'; // 通常は黒色
    }
    
    context.lineTo(x, y);
    context.stroke();
  }, [isDrawing, context, getScaledCoordinates, isEraserMode]);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!context) return;
    setIsDrawing(false);
    context.closePath();
  }, [context]);

  // キャンバスをクリア
  const clearCanvas = useCallback(() => {
    if (!context || !canvasRef.current) return;
    
    // クリア前の状態を履歴に保存
    saveToHistory();
    
    // 背景をクリア
    context.save();
    context.globalCompositeOperation = 'source-over';
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    context.restore();
    
    // 描画設定を再設定
    context.globalCompositeOperation = 'source-over';
    context.strokeStyle = isEraserMode ? '#ffffff' : '#000000';
    context.lineWidth = penSize;
    context.lineCap = 'round';
    context.lineJoin = 'round';
  }, [context, penSize, isEraserMode, saveToHistory]);

  // ペンサイズ変更関数
  const increasePenSize = useCallback(() => {
    setPenSize(prev => Math.min(prev + 2, 200)); // 最大200px
  }, []);

  const decreasePenSize = useCallback(() => {
    setPenSize(prev => Math.max(prev - 2, 2)); // 最小2px
  }, []);

  // 長押し開始
  const startLongPress = useCallback((increment: boolean) => {
    // 最初の1回を即座に実行
    if (increment) {
      increasePenSize();
    } else {
      decreasePenSize();
    }
    
    // 300ms後から連続実行開始
    const timeoutId = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        if (increment) {
          setPenSize(prev => Math.min(prev + 2, 200));
        } else {
          setPenSize(prev => Math.max(prev - 2, 2));
        }
      }, 100); // 100ms間隔で連続実行
    }, 300);

    return timeoutId;
  }, [increasePenSize, decreasePenSize]);

  // 長押し終了
  const stopLongPress = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  return (
    <Card className={`w-full h-full flex flex-col bg-background border-transparent ${className}`}>
      <CardHeader className="pb-1 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Palette className="w-4 h-4" />
            試し塗りキャンバス
          </h3>
          <div className="flex items-center gap-2">
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
                <Edit className="w-4 h-4 text-foreground" />
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
            {/* 塗りつぶし色選択（塗りつぶしモード時のみ表示） */}
            {isFillMode && (
              <div className="flex items-center gap-1">
                <input
                  type="color"
                  value={fillColor}
                  onChange={(e) => setFillColor(e.target.value)}
                  className="w-8 h-8 rounded border-2 border-border cursor-pointer"
                  title="塗りつぶし色"
                />
              </div>
            )}
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
                onMouseDown={() => startLongPress(false)}
                onMouseUp={stopLongPress}
                onMouseLeave={stopLongPress}
                onTouchStart={() => startLongPress(false)}
                onTouchEnd={stopLongPress}
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={penSize <= 2}
              >
                <Minus className="w-3 h-3 text-foreground" />
              </Button>
              <span className="text-xs font-mono text-foreground min-w-[24px] text-center">
                {penSize}
              </span>
              <Button
                onClick={increasePenSize}
                onMouseDown={() => startLongPress(true)}
                onMouseUp={stopLongPress}
                onMouseLeave={stopLongPress}
                onTouchStart={() => startLongPress(true)}
                onTouchEnd={stopLongPress}
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
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-1 pb-4 flex-1 flex flex-col">
        <div className="relative flex-1 flex flex-col">
          <canvas
            ref={canvasRef}
            className={`border border-border rounded-md bg-white ${
              isFillMode ? 'cursor-pointer' : 'cursor-crosshair'
            }`}
            style={{ width: '100%', height: 'auto' }}
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