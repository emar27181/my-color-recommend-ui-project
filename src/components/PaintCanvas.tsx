import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CircleDashed, Palette, Plus, Minus, Eraser, Edit } from 'lucide-react';

interface PaintCanvasProps {
  className?: string;
}

export const PaintCanvas: React.FC<PaintCanvasProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [penSize, setPenSize] = useState(8);
  const [isEraserMode, setIsEraserMode] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
      }
    }
  }, []);

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
    
    setIsDrawing(true);
    const { x, y } = getScaledCoordinates(e.clientX, e.clientY);
    
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
  }, [context, getScaledCoordinates, penSize, isEraserMode]);

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
    
    setIsDrawing(true);
    const touch = e.touches[0];
    const { x, y } = getScaledCoordinates(touch.clientX, touch.clientY);
    
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
  }, [context, getScaledCoordinates, penSize, isEraserMode]);

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
  }, [context, penSize, isEraserMode]);

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
            {/* ペン/消しゴムモード切り替え */}
            <Button
              onClick={() => setIsEraserMode(!isEraserMode)}
              variant={isEraserMode ? "default" : "outline"}
              size="sm"
              className="h-8 px-3"
            >
              {isEraserMode ? (
                <Eraser className="w-4 h-4 text-foreground" />
              ) : (
                <Edit className="w-4 h-4 text-foreground" />
              )}
            </Button>
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
            className="border border-border rounded-md cursor-crosshair bg-white"
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