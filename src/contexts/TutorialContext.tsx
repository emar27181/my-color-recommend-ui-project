import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetElement: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  autoAdvance?: boolean;
  actionType?: 'click' | 'change' | 'upload';
}

interface TutorialContextType {
  isActive: boolean;
  currentStep: number;
  totalSteps: number;
  startTutorial: () => void;
  nextStep: () => void;
  prevStep: () => void;
  closeTutorial: () => void;
  skipTutorial: () => void;
  getCurrentStep: () => TutorialStep | null;
  onUserAction: (actionType: string, targetElement?: string) => void;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'チュートリアルへようこそ！',
    description: 'このアプリでは、色の組み合わせを簡単に見つけることができます。基準となる色から、美しい配色を自動生成します。一緒に使い方を学んでいきましょう！',
    targetElement: '',
    position: 'center'
  },
  {
    id: 'color-picker',
    title: 'まずはじめに：ベースカラーを選択',
    description: 'ここのカラーパレットアイコンをクリックして、基準となる色を選んでください。この色をもとに、相性の良い色の組み合わせを生成します。',
    targetElement: '[data-tutorial="color-picker"]',
    position: 'bottom',
    autoAdvance: true,
    actionType: 'click'
  },
  {
    id: 'image-upload',
    title: '次に：画像からの色抽出も可能',
    description: 'お好みの画像をここにドラッグ&ドロップまたはクリックしてアップロードすると、画像から主要な色を自動抽出できます。写真の色味を参考にしたい時に便利です。スキップして配色技法の選択に進むこともできます。',
    targetElement: '[data-tutorial="image-upload"]',
    position: 'bottom'
  },
  {
    id: 'color-schemes',
    title: '配色技法を選択しましょう',
    description: 'このドロップダウンボタンをクリックして、様々な配色技法から選択できます。「ダイアード配色」「トライアド配色」など、プロが使う配色理論に基づいた組み合わせが生成されます。',
    targetElement: '[data-tutorial="color-schemes"]',
    position: 'top',
    autoAdvance: true,
    actionType: 'click'
  },
  {
    id: 'color-wheel',
    title: '色相環で関係性を確認',
    description: '配色技法の項目にマウスカーソルを合わせると、色相環が表示されます。選んだ色同士がどのような関係にあるかを視覚的に確認できます。',
    targetElement: '[data-tutorial="color-schemes"]',
    position: 'top'
  },
  {
    id: 'recommended-colors',
    title: '生成された推薦色を活用',
    description: 'ここに表示された色をクリックすると、カラーコードが自動的にクリップボードにコピーされます。デザインソフトなどで即座に使用できます。色をクリックしてみてください。',
    targetElement: '[data-tutorial="recommended-colors"]',
    position: 'top',
    autoAdvance: true,
    actionType: 'click'
  },
  {
    id: 'tone-variations',
    title: '最後に：トーン推薦で微調整',
    description: '推薦色をクリックすると、ここにその色の明度・彩度を変化させたバリエーションが表示されます。より細かい色調整が可能になります。',
    targetElement: '[data-tutorial="tone-variations"]',
    position: 'top'
  }
];

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const TutorialProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [waitingForAction, setWaitingForAction] = useState(false);

  const startTutorial = () => {
    setIsActive(true);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      closeTutorial();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const closeTutorial = () => {
    setIsActive(false);
    setCurrentStep(0);
  };

  const skipTutorial = () => {
    closeTutorial();
  };

  const getCurrentStep = (): TutorialStep | null => {
    return tutorialSteps[currentStep] || null;
  };

  const onUserAction = (actionType: string, targetElement?: string) => {
    if (!isActive || !waitingForAction) return;
    
    const currentStepData = getCurrentStep();
    if (!currentStepData?.autoAdvance) return;

    // アクションタイプとターゲット要素がマッチするかチェック
    const actionMatches = currentStepData.actionType === actionType;
    const targetMatches = !targetElement || 
      !currentStepData.targetElement || 
      document.querySelector(currentStepData.targetElement)?.contains(document.querySelector(targetElement) as Node);

    if (actionMatches && targetMatches) {
      setWaitingForAction(false);
      // 少し遅延してから次のステップに進む
      setTimeout(() => {
        nextStep();
      }, 1500);
    }
  };

  // ステップが変わったときに自動進行の状態をセット
  useEffect(() => {
    if (!isActive) {
      setWaitingForAction(false);
      return;
    }

    const currentStepData = getCurrentStep();
    if (currentStepData?.autoAdvance && currentStepData.position !== 'center') {
      setWaitingForAction(true);
    } else {
      setWaitingForAction(false);
    }
  }, [currentStep, isActive]);

  return (
    <TutorialContext.Provider
      value={{
        isActive,
        currentStep,
        totalSteps: tutorialSteps.length,
        startTutorial,
        nextStep,
        prevStep,
        closeTutorial,
        skipTutorial,
        getCurrentStep,
        onUserAction,
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = (): TutorialContextType => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
};