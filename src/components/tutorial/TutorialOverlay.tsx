import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTutorial } from '@/contexts/TutorialContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, X, SkipForward } from 'lucide-react';

interface TutorialOverlayProps {}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = () => {
  const {
    isActive,
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    closeTutorial,
    skipTutorial,
    getCurrentStep
  } = useTutorial();

  const [waitingForAction, setWaitingForAction] = useState(false);

  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [spotlightPosition, setSpotlightPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  // ドラッグ機能の状態
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [tooltipOffset, setTooltipOffset] = useState({ x: 0, y: 0 });
  const [initialTooltipPos, setInitialTooltipPos] = useState({ x: 0, y: 0 });

  const currentStepData = getCurrentStep();

  useEffect(() => {
    if (!isActive || !currentStepData?.targetElement) {
      setTargetElement(null);
      setWaitingForAction(false);
      // ステップ変更時にドラッグ状態とオフセットをリセット
      setIsDragging(false);
      setTooltipOffset({ x: 0, y: 0 });
      return;
    }

    const element = document.querySelector(currentStepData.targetElement) as HTMLElement;
    if (element) {
      setTargetElement(element);
      const rect = element.getBoundingClientRect();
      setSpotlightPosition({
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height
      });
      
      // 自動進行のステップかどうかをチェック
      setWaitingForAction(currentStepData.autoAdvance === true && currentStepData.position !== 'center');
      
      // ステップ変更時にドラッグオフセットをリセット
      setTooltipOffset({ x: 0, y: 0 });
    }
  }, [isActive, currentStep, currentStepData]);

  const getTooltipPosition = () => {
    if (!targetElement || !currentStepData?.targetElement || currentStepData.position === 'center') {
      // センター表示の場合は従来通り
      return {
        position: 'fixed' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90vw',
        maxWidth: '600px',
        maxHeight: '80vh',
        zIndex: 9999
      };
    }

    const rect = targetElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const margin = 16;
    
    // レスポンシブなツールチップサイズ
    const tooltipWidth = Math.min(
      viewportWidth < 768 ? 320 : 400, // モバイルでは小さく
      viewportWidth - (margin * 2)
    );
    
    // 推定ツールチップ高さ（コンテンツに基づく）
    const estimatedHeight = Math.min(
      280 + (waitingForAction ? 30 : 0), // 基本高さ + 待機メッセージ分
      viewportHeight * 0.5 // 画面の50%以下に制限
    );
    
    // UI要素との安全な距離を確保
    const safeMargin = Math.max(margin, 24); // 最低24pxのマージン

    let top = 0;
    let left = 0;
    let transform = '';
    let finalPosition = currentStepData.position;

    // UI要素と重ならない初期位置計算
    switch (currentStepData.position) {
      case 'top':
        top = rect.top - safeMargin;
        left = rect.left + rect.width / 2;
        transform = 'translate(-50%, -100%)';
        break;
      case 'bottom':
        top = rect.bottom + safeMargin;
        left = rect.left + rect.width / 2;
        transform = 'translate(-50%, 0)';
        break;
      case 'left':
        top = rect.top + rect.height / 2;
        left = rect.left - safeMargin;
        transform = 'translate(-100%, -50%)';
        break;
      case 'right':
        top = rect.top + rect.height / 2;
        left = rect.right + safeMargin;
        transform = 'translate(0, -50%)';
        break;
      default:
        top = rect.bottom + safeMargin;
        left = rect.left + rect.width / 2;
        transform = 'translate(-50%, 0)';
        finalPosition = 'bottom';
    }

    // 垂直方向の画面外チェックと自動調整（UI要素との重なり防止）
    if (finalPosition === 'top') {
      const requiredTopSpace = estimatedHeight + safeMargin;
      if (rect.top < requiredTopSpace) {
        // 上に十分なスペースがない場合は下に変更
        top = rect.bottom + safeMargin;
        transform = 'translate(-50%, 0)';
        finalPosition = 'bottom';
      }
    } else if (finalPosition === 'bottom') {
      const requiredBottomSpace = estimatedHeight + safeMargin;
      if (viewportHeight - rect.bottom < requiredBottomSpace) {
        // 下に十分なスペースがない場合は上に変更
        top = rect.top - safeMargin;
        transform = 'translate(-50%, -100%)';
        finalPosition = 'top';
      }
    }

    // 水平方向の画面外チェックと調整（UI要素との重なり防止）
    if (finalPosition === 'left') {
      const requiredLeftSpace = tooltipWidth + safeMargin;
      if (rect.left < requiredLeftSpace) {
        // 左に十分なスペースがない場合は右に変更
        left = rect.right + safeMargin;
        transform = 'translate(0, -50%)';
        finalPosition = 'right';
      }
    } else if (finalPosition === 'right') {
      const requiredRightSpace = tooltipWidth + safeMargin;
      if (viewportWidth - rect.right < requiredRightSpace) {
        // 右に十分なスペースがない場合は左に変更
        left = rect.left - safeMargin;
        transform = 'translate(-100%, -50%)';
        finalPosition = 'left';
      }
    }

    // 上下配置の水平位置調整（UI要素との重なり防止）
    if (finalPosition === 'top' || finalPosition === 'bottom') {
      const halfWidth = tooltipWidth / 2;
      
      // 左端を超えないように調整
      if (left - halfWidth < safeMargin) {
        left = safeMargin + halfWidth;
      }
      // 右端を超えないように調整
      else if (left + halfWidth > viewportWidth - safeMargin) {
        left = viewportWidth - safeMargin - halfWidth;
      }
      
      // UI要素との水平重なりをチェック
      const tooltipLeft = left - halfWidth;
      const tooltipRight = left + halfWidth;
      
      if (tooltipLeft < rect.right + 20 && tooltipRight > rect.left - 20) {
        // ツールチップがUI要素と水平に重なる場合の調整
        if (rect.left + rect.width / 2 < viewportWidth / 2) {
          // UI要素が左寄りならツールチップを右に
          left = Math.min(rect.right + halfWidth + 20, viewportWidth - safeMargin - halfWidth);
        } else {
          // UI要素が右寄りならツールチップを左に
          left = Math.max(rect.left - halfWidth - 20, safeMargin + halfWidth);
        }
      }
    }

    // 左右配置の垂直位置調整（UI要素との重なり防止）
    if (finalPosition === 'left' || finalPosition === 'right') {
      const halfHeight = estimatedHeight / 2;
      
      // 上端を超えないように調整
      if (top - halfHeight < safeMargin) {
        top = safeMargin + halfHeight;
      }
      // 下端を超えないように調整
      else if (top + halfHeight > viewportHeight - safeMargin) {
        top = viewportHeight - safeMargin - halfHeight;
      }
      
      // UI要素との垂直重なりをチェック
      const tooltipTop = top - halfHeight;
      const tooltipBottom = top + halfHeight;
      
      if (tooltipTop < rect.bottom + 20 && tooltipBottom > rect.top - 20) {
        // ツールチップがUI要素と垂直に重なる場合の調整
        if (rect.top + rect.height / 2 < viewportHeight / 2) {
          // UI要素が上寄りならツールチップを下に
          top = Math.min(rect.bottom + halfHeight + 20, viewportHeight - safeMargin - halfHeight);
        } else {
          // UI要素が下寄りならツールチップを上に
          top = Math.max(rect.top - halfHeight - 20, safeMargin + halfHeight);
        }
      }
    }

    // 最終的な位置の安全性チェック
    const finalTop = Math.max(safeMargin, Math.min(viewportHeight - estimatedHeight - safeMargin, top));
    const finalLeft = Math.max(safeMargin, Math.min(viewportWidth - tooltipWidth - safeMargin, left));

    // ドラッグオフセットを適用
    const adjustedTop = finalTop + tooltipOffset.y;
    const adjustedLeft = finalLeft + tooltipOffset.x;
    
    // ドラッグ後も画面内に収まるように制限
    const constrainedTop = Math.max(safeMargin, Math.min(viewportHeight - estimatedHeight - safeMargin, adjustedTop));
    const constrainedLeft = Math.max(safeMargin, Math.min(viewportWidth - tooltipWidth - safeMargin, adjustedLeft));

    return {
      position: 'fixed' as const,
      top: `${constrainedTop}px`,
      left: `${constrainedLeft}px`,
      transform,
      width: `${tooltipWidth}px`,
      maxHeight: `${Math.min(estimatedHeight, viewportHeight - safeMargin * 2)}px`,
      zIndex: 9999
    };
  };

  // ドラッグイベントハンドラー
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // 左クリックのみ
    
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    
    // 現在のツールチップ位置を記録
    const tooltipPos = getTooltipPosition();
    setInitialTooltipPos({ 
      x: parseFloat(tooltipPos.left.replace('px', '')), 
      y: parseFloat(tooltipPos.top.replace('px', '')) 
    });
    
    e.preventDefault();
  };

  // ドラッグイベントのグローバルリスナー
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      setTooltipOffset({ x: deltaX, y: deltaY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none'; // テキスト選択を無効化
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, dragStart.x, dragStart.y]);

  if (!isActive) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      {/* 背景オーバーレイ（クリック可能な領域を維持） */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        style={{
          // ターゲット要素以外の領域をクリック可能にする
          pointerEvents: targetElement && currentStepData?.targetElement && currentStepData.position !== 'center' ? 'none' : 'auto'
        }}
      />
      
      {/* スポットライト効果とインタラクティブ領域 */}
      {targetElement && currentStepData?.targetElement && (
        <>
          {/* ハイライト枠 */}
          <div
            className="absolute border-4 border-primary/90 rounded-lg shadow-lg shadow-primary/40 bg-primary/5 transition-all duration-300 animate-pulse"
            style={{
              left: spotlightPosition.x - 8,
              top: spotlightPosition.y - 8,
              width: spotlightPosition.width + 16,
              height: spotlightPosition.height + 16,
              pointerEvents: 'none'
            }}
          />
          {/* インタラクティブ領域 */}
          {currentStepData.position !== 'center' && (
            <div
              className="absolute bg-transparent"
              style={{
                left: spotlightPosition.x - 4,
                top: spotlightPosition.y - 4,
                width: spotlightPosition.width + 8,
                height: spotlightPosition.height + 8,
                pointerEvents: 'auto',
                zIndex: 10000
              }}
              onClick={(e) => {
                e.stopPropagation();
                // ターゲット要素のクリックイベントを転送
                if (targetElement) {
                  targetElement.click();
                }
              }}
            />
          )}
        </>
      )}

      {/* チュートリアル説明カード */}
      {currentStepData && (
        <Card
          className={`shadow-2xl border-2 overflow-hidden pointer-events-auto transition-shadow duration-200 ${
            isDragging ? 'shadow-3xl cursor-grabbing' : 'cursor-grab'
          }`}
          style={getTooltipPosition()}
          onMouseDown={handleMouseDown}
        >
          <CardContent className="p-4 md:p-6 select-none">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1 mr-4">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-bold text-lg md:text-xl text-foreground leading-tight">{currentStepData.title}</h3>
                  {isDragging && (
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      ドラッグ中
                    </span>
                  )}
                </div>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3">
                  {currentStepData.description}
                </p>
                {waitingForAction && (
                  <div className="flex items-center gap-2 text-primary text-sm font-medium">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    上記の要素をクリックしてみてください
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeTutorial}
                className="ml-2 h-8 w-8 p-0"
                onMouseDown={(e) => e.stopPropagation()} // ドラッグを無効化
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* ステップインジケーター */}
            <div className="flex justify-center mb-4">
              <div className="flex gap-1.5">
                {Array.from({ length: totalSteps }, (_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* ナビゲーションボタン */}
            <div className="flex justify-between items-center">
              {!waitingForAction && (
              <Button
                variant="ghost"
                onClick={skipTutorial}
                className="text-muted-foreground hover:text-foreground text-base"
                onMouseDown={(e) => e.stopPropagation()} // ドラッグを無効化
              >
                <SkipForward className="h-4 w-4 mr-1" />
                スキップ
              </Button>
              )}
              {waitingForAction && <div />}

              <div className="flex gap-2">
                {!waitingForAction && (
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    size="sm"
                    className="text-sm px-4 py-2"
                    onMouseDown={(e) => e.stopPropagation()} // ドラッグを無効化
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    戻る
                  </Button>
                )}
                {!waitingForAction && (
                  <Button
                    onClick={nextStep}
                    size="sm"
                    className="text-sm px-4 py-2"
                    onMouseDown={(e) => e.stopPropagation()} // ドラッグを無効化
                  >
                    {currentStep === totalSteps - 1 ? '完了' : '次へ'}
                    {currentStep < totalSteps - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
                  </Button>
                )}
                {waitingForAction && (
                  <Button
                    variant="outline"
                    onClick={nextStep}
                    size="sm"
                    className="text-sm px-4 py-2 text-muted-foreground"
                    onMouseDown={(e) => e.stopPropagation()} // ドラッグを無効化
                  >
                    スキップして次へ
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>,
    document.body
  );
};