import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, Palette } from 'lucide-react';

interface PaintCanvasProps {
  className?: string;
}

export const PaintCanvas: React.FC<PaintCanvasProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  // キャンバスの初期化
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // キャンバスサイズを設定（1/4サイズ）
        canvas.width = 100;
        canvas.height = 75;
        
        // 描画設定
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#000000'; // 黒色固定
        ctx.lineWidth = 5; // 太さ5px（1/4サイズ）
        
        // 背景を白に設定
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        setContext(ctx);
      }
    }
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
    context.strokeStyle = '#000000';
    context.lineWidth = 5;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    
    context.beginPath();
    context.moveTo(x, y);
  }, [context, getScaledCoordinates]);

  // 描画中
  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context || !canvasRef.current) return;
    
    const { x, y } = getScaledCoordinates(e.clientX, e.clientY);
    
    context.lineTo(x, y);
    context.stroke();
  }, [isDrawing, context, getScaledCoordinates]);

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
    context.strokeStyle = '#000000';
    context.lineWidth = 5;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    
    context.beginPath();
    context.moveTo(x, y);
  }, [context, getScaledCoordinates]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing || !context || !canvasRef.current) return;
    
    const touch = e.touches[0];
    const { x, y } = getScaledCoordinates(touch.clientX, touch.clientY);
    
    context.lineTo(x, y);
    context.stroke();
  }, [isDrawing, context, getScaledCoordinates]);

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
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // 描画設定を再設定
    context.strokeStyle = '#000000';
    context.lineWidth = 5;
    context.lineCap = 'round';
    context.lineJoin = 'round';
  }, [context]);

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-1 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Palette className="w-4 h-4" />
            試し塗りキャンバス
          </h3>
          <Button
            onClick={clearCanvas}
            variant="outline"
            size="sm"
            className="h-8 px-2"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-1 pb-4">
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="border border-border rounded-md cursor-crosshair bg-white w-full"
            style={{ maxWidth: '100%', height: 'auto' }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
          <div className="mt-2 text-xs text-muted-foreground text-center">
            クリックまたはタッチしてドラッグで描画できます（黒色・太さ5px）
          </div>
        </div>
      </CardContent>
    </Card>
  );
};