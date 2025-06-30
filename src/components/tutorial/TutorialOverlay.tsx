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

  const currentStepData = getCurrentStep();

  useEffect(() => {
    if (!isActive || !currentStepData?.targetElement) {
      setTargetElement(null);
      setWaitingForAction(false);
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
    const tooltipWidth = Math.min(400, window.innerWidth - 32);
    const margin = 16;

    let top = 0;
    let left = 0;
    let transform = '';

    switch (currentStepData.position) {
      case 'top':
        top = rect.top - margin;
        left = rect.left + rect.width / 2;
        transform = 'translate(-50%, -100%)';
        break;
      case 'bottom':
        top = rect.bottom + margin;
        left = rect.left + rect.width / 2;
        transform = 'translate(-50%, 0)';
        break;
      case 'left':
        top = rect.top + rect.height / 2;
        left = rect.left - margin;
        transform = 'translate(-100%, -50%)';
        break;
      case 'right':
        top = rect.top + rect.height / 2;
        left = rect.right + margin;
        transform = 'translate(0, -50%)';
        break;
      default:
        // フォールバック: bottom
        top = rect.bottom + margin;
        left = rect.left + rect.width / 2;
        transform = 'translate(-50%, 0)';
    }

    // 画面外に出ないように調整
    if (left - tooltipWidth / 2 < margin) {
      left = margin + tooltipWidth / 2;
    } else if (left + tooltipWidth / 2 > window.innerWidth - margin) {
      left = window.innerWidth - margin - tooltipWidth / 2;
    }

    if (top < margin) {
      top = rect.bottom + margin;
      transform = transform.includes('translate(-50%') ? 'translate(-50%, 0)' : transform.replace('-100%', '0');
    } else if (top > window.innerHeight - 200) {
      top = rect.top - margin;
      transform = transform.includes('translate(-50%') ? 'translate(-50%, -100%)' : transform.replace('0,', '-100%,');
    }

    return {
      position: 'fixed' as const,
      top: `${top}px`,
      left: `${left}px`,
      transform,
      width: `${tooltipWidth}px`,
      maxHeight: '400px',
      zIndex: 9999
    };
  };

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
          className="shadow-2xl border-2 overflow-auto pointer-events-auto"
          style={getTooltipPosition()}
        >
          <CardContent className="p-4 md:p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1 mr-4">
                <h3 className="font-bold text-lg md:text-xl mb-3 text-foreground leading-tight">{currentStepData.title}</h3>
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