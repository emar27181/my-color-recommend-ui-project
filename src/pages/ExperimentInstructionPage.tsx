import { useNavigate, useSearchParams } from 'react-router-dom';
import { useExperimentStore } from '@/store/experimentStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Play } from 'lucide-react';
import {
  EXPERIMENT_TEXT_STYLES,
  EXPERIMENT_ICON_STYLES,
  getButtonClassName,
} from '@/constants/experimentTheme';
import { useEffect } from 'react';

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
  const { condition, participantId } = useExperimentStore();
  const isDebugMode = searchParams.get('debug') === 'true';

  // 参加者IDが未設定の場合は導入ページにリダイレクト
  useEffect(() => {
    if (!participantId) {
      navigate('/experiment');
    }
  }, [participantId, navigate]);

  // 条件ごとの説明内容
  const instructions = {
    Test1: {
      title: 'Test1: 大量の色を一度に表示',
      description: '色相とトーンの組み合わせで大量の色を一覧表示します。',
      videoUrl: 'https://www.youtube.com/embed/PLACEHOLDER_T1', // Test1の動画URL（動画準備中）
      imageUrl: '/images/UI_test/image_T1.png',
      steps: [
        '画面に表示されている色グリッドから、好きな色をクリックして選択します',
        '選択した色がキャンバスの描画色として設定されます',
        'キャンバス上で描画して配色を試してみてください',
      ],
    },
    Test2: {
      title: 'Test2: 色相→トーンの二段階で選択',
      description: 'ベース色を選択すると、配色技法に基づいた推薦色が表示されます。',
      videoUrl: 'https://www.youtube.com/embed/Sr1CyI3407c',
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
    <main className="flex-1 pb-8 min-h-screen flex flex-col bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* タイトル */}
        <div className="text-center mb-8">
          <h1 className={`${EXPERIMENT_TEXT_STYLES.pageTitle} mb-3`}>
            {condition}
          </h1>
        </div>

        {/* 説明とデモ動画 */}
        <div className="mb-6">
          <div className="space-y-6">
            {/* 使い方説明 */}
            <Card>
              <CardHeader>
                <CardTitle>使い方</CardTitle>
                <CardDescription>以下の手順で操作してください</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {currentInstruction.steps.map((step, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </span>
                      <span className="flex-1 pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            {/* デモ動画・UIプレビュー */}
            {currentInstruction.videoUrl ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className={EXPERIMENT_ICON_STYLES.default} />
                    デモ動画
                  </CardTitle>
                  <CardDescription>操作方法を動画で確認できます</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-10 gap-6">
                    {/* 左側：動画（7割） */}
                    <div className="col-span-7 flex flex-col">
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
                    {/* 右側：UIプレビュー（3割） */}
                    <div className="col-span-3 flex flex-col">
                      <div className="flex items-center justify-center p-4">
                        <img
                          src={currentInstruction.imageUrl}
                          alt={`${condition} UI画像`}
                          className="w-4/5 h-auto object-contain rounded-lg shadow-md border border-border"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center py-8">
                    <img
                      src={currentInstruction.imageUrl}
                      alt={`${condition} UI画像`}
                      className="w-4/5 h-auto max-w-[256px] object-contain rounded-lg shadow-lg border border-border"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
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
