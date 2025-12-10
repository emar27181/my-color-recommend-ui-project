import { useNavigate, useSearchParams } from 'react-router-dom';
import { useExperimentStore } from '@/store/experimentStore';
import { useExperimentQuery } from '@/hooks/useQueryParams';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Play } from 'lucide-react';
import {
  EXPERIMENT_TEXT_STYLES,
  EXPERIMENT_ICON_STYLES,
  getButtonClassName,
} from '@/constants/experimentTheme';
import { useEffect, useState, useRef } from 'react';

/**
 * 実験説明ページ
 *
 * 各テストの前に使い方を説明するページ
 * - 簡単な使い方の説明
 * - デモ動画（YouTube埋め込み）
 * - 「次へ」ボタンでタスクページへ
 */
const ExperimentInstructionPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // URLから条件を読み取り、ストアを更新
  useExperimentQuery();

  const { condition, participantId, currentConditionIndex, experimentPatterns } = useExperimentStore();
  const isDebugMode = searchParams.get('debug') === 'true';

  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const mainRef = useRef<HTMLDivElement>(null);

  // 現在のパターン名を取得（例: U1A, U2B）
  const currentPattern = experimentPatterns[currentConditionIndex];

  console.log('ExperimentInstructionPage - condition from store:', condition, 'currentPattern:', currentPattern);

  // 参加者IDが未設定の場合は導入ページにリダイレクト
  useEffect(() => {
    console.log('ExperimentInstructionPage useEffect - participantId:', participantId);
    if (!participantId) {
      console.warn('ExperimentInstructionPage: participantId is missing, redirecting to /experiment');
      navigate('/experiment');
    }
  }, [participantId, navigate]);

  // 画面サイズを取得・更新
  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);

    return () => {
      window.removeEventListener('resize', updateScreenSize);
    };
  }, []);

  // スケールを計算（画面サイズに応じて最大化）
  useEffect(() => {
    if (!mainRef.current || screenSize.width === 0 || screenSize.height === 0) return;

    const contentWidth = mainRef.current.scrollWidth;
    const contentHeight = mainRef.current.scrollHeight;

    if (contentWidth === 0 || contentHeight === 0) return;

    // 画面サイズに対する比率を計算（余白を考慮して95%まで）
    const widthRatio = (screenSize.width * 0.95) / contentWidth;
    const heightRatio = (screenSize.height * 0.95) / contentHeight;

    // 小さい方の比率を採用（縦横どちらかが幅いっぱいになる）
    const newScale = Math.min(widthRatio, heightRatio, 1.2); // 最大120%まで

    setScale(newScale);
  }, [screenSize]);

  // 条件ごとの説明内容
  const instructions = {
    UI1: {
      title: 'UI1: 大量の色を一度に表示',
      description: '色相とトーンの組み合わせで大量の色を一覧表示します。',
      videoUrl: 'https://www.youtube.com/embed/eKne5u4Cx-M',
      imageUrl: '/images/UI_test/image_T1.png',
      steps: [
        '画面に表示されている色グリッドから、好きな色をクリックして選択します',
        '選択した色がキャンバスの描画色として設定されます',
        'キャンバス上で描画して配色を試してみてください',
      ],
    },
    UI2: {
      title: 'UI2: 色相→トーンの二段階で選択',
      description: 'ベース色を選択すると、配色技法に基づいた推薦色が表示されます。',
      videoUrl: 'https://www.youtube.com/embed/0mkxgfSK7rg',
      imageUrl: '/images/UI_test/image_T3.png',
      steps: [
        'ベース色を選択します（カラーピッカーまたは画像アップロード）',
        '色相推薦から配色技法を選択します',
        '表示された推薦色やトーン推薦から好きな色を選んでください',
      ],
    },
  };

  const currentInstruction = instructions[condition as keyof typeof instructions];

  if (!currentInstruction) {
    return null;
  }

  // タスクページへ進む
  const handleNext = () => {
    const debugParam = isDebugMode ? '&debug=true' : '';
    navigate(`/experiment/task?cond=${condition}${debugParam}`);
  };

  return (
    <main
      ref={mainRef}
      className="flex-1 pb-8 min-h-screen flex flex-col bg-background origin-top"
      style={{ transform: `scale(${scale})` }}
    >
      <div className="container mx-auto px-2 sm:px-4 py-6 max-w-[95vw]">
        {/* タイトル */}
        <div className="text-center mb-6">
          <h1 className={`${EXPERIMENT_TEXT_STYLES.pageTitle} mb-3`}>
            {currentPattern}
          </h1>
        </div>

        {/* デモ動画 */}
        <div className="mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-3xl font-bold flex items-center gap-2">
                <Play className={EXPERIMENT_ICON_STYLES.default} />
                デモ動画(音声付き)
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2 sm:px-3 pb-3">
              <div className="w-full">
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-lg border border-border"
                    src={currentInstruction.videoUrl}
                    title={`${condition} デモ動画`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 次へボタン */}
        <div className="flex justify-center">
          <Button
            onClick={handleNext}
            size="lg"
            className={`${getButtonClassName('action')} text-lg px-8`}
          >
            タスクを開始
            <ArrowRight className={EXPERIMENT_ICON_STYLES.default} />
          </Button>
        </div>
      </div>
    </main>
  );
};

export default ExperimentInstructionPage;
