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

  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [spotlightPosition, setSpotlightPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const currentStepData = getCurrentStep();

  useEffect(() => {
    if (!isActive || !currentStepData?.targetElement) {
      setTargetElement(null);
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
    }
  }, [isActive, currentStep, currentStepData]);

  const getTooltipPosition = () => {
    // 全てのステップで画面中央に表示し、安定した位置に固定
    return {
      position: 'fixed' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '90vw',
      maxWidth: '800px',
      maxHeight: '80vh',
      zIndex: 9999
    };
  };

  if (!isActive) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      {/* 背景オーバーレイ */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* スポットライト効果 */}
      {targetElement && currentStepData?.targetElement && (
        <div
          className="absolute border-4 border-primary/80 rounded-lg shadow-lg shadow-primary/30 bg-transparent pointer-events-none transition-all duration-300"
          style={{
            left: spotlightPosition.x - 8,
            top: spotlightPosition.y - 8,
            width: spotlightPosition.width + 16,
            height: spotlightPosition.height + 16,
          }}
        />
      )}

      {/* チュートリアル説明カード */}
      {currentStepData && (
        <Card
          className="shadow-2xl border-2 overflow-auto"
          style={getTooltipPosition()}
        >
          <CardContent className="p-6 md:p-8 lg:p-10">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1 mr-4">
                <h3 className="font-bold text-2xl md:text-3xl mb-4 text-foreground leading-tight">{currentStepData.title}</h3>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  {currentStepData.description}
                </p>
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
            <div className="flex justify-center mb-6">
              <div className="flex gap-2">
                {Array.from({ length: totalSteps }, (_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* ナビゲーションボタン */}
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                onClick={skipTutorial}
                className="text-muted-foreground hover:text-foreground text-base"
              >
                <SkipForward className="h-5 w-5 mr-2" />
                スキップ
              </Button>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="text-base px-6 py-3"
                >
                  <ChevronLeft className="h-5 w-5 mr-2" />
                  戻る
                </Button>
                <Button
                  onClick={nextStep}
                  className="text-base px-6 py-3"
                >
                  {currentStep === totalSteps - 1 ? '完了' : '次へ'}
                  {currentStep < totalSteps - 1 && <ChevronRight className="h-5 w-5 ml-2" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>,
    document.body
  );
};