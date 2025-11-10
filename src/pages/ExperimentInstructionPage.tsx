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
      videoUrl: '', // Test1の動画URL（後で追加）
      imageUrl: '/images/UI_test/image_T1.png',
      steps: [
        '画面に表示されている色グリッドから、好きな色をクリックして選択します',
        '選択した色がキャンバスの描画色として設定されます',
        'キャンバス上で描画して配色を試してみてください',
      ],
    },
    Test3: {
      title: 'Test3: 色相→トーンの二段階で選択',
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

            {/* デモ動画 */}
            {currentInstruction.videoUrl && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className={EXPERIMENT_ICON_STYLES.default} />
                    デモ動画
                  </CardTitle>
                  <CardDescription>操作方法を動画で確認できます</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {/* 左側：動画 */}
                    <div className="h-[60vh] aspect-[16/9]">
                      <iframe
                        width="100%"
                        height="100%"
                        src={currentInstruction.videoUrl}
                        title={`${condition} デモ動画`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-lg"
                      ></iframe>
                    </div>
                    {/* 右側：UIプレビュー */}
                    <div className="h-[60vh] flex flex-col items-center justify-center">
                      <h3 className="text-sm font-semibold mb-4 text-muted-foreground">UIプレビュー</h3>
                      <img
                        src={currentInstruction.imageUrl}
                        alt={`${condition} UI画像`}
                        className="max-w-full h-auto rounded-lg shadow-md object-contain"
                      />
                    </div>
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
