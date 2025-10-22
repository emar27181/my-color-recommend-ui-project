import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExperimentStore } from '@/store/experimentStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon, Play, User, Clock, Palette, Sparkles, Layers } from 'lucide-react';
import {
  EXPERIMENT_BUTTON_STYLES,
  EXPERIMENT_INPUT_STYLES,
  EXPERIMENT_CARD_STYLES,
  EXPERIMENT_CONDITION_COLORS,
  EXPERIMENT_LAYOUT,
  EXPERIMENT_TEXT_STYLES,
  EXPERIMENT_ICON_STYLES,
  getButtonClassName,
  getInputClassName,
  getCardClassName,
  getConditionCardColors,
} from '@/constants/experimentTheme';

/**
 * 実験導入ページ（改良版）
 *
 * モダンでクリーンなUIデザイン
 * - ビジュアル要素の強化
 * - 色分けされた条件カード
 * - より簡潔なテキスト
 */
const ExperimentIntroPage = () => {
  const navigate = useNavigate();
  const { setParticipantId, startFullExperiment } = useExperimentStore();
  const [inputId, setInputId] = useState('');

  // 実験開始ハンドラ
  const handleStart = () => {
    if (!inputId.trim()) {
      alert('参加者IDを入力してください');
      return;
    }

    setParticipantId(inputId.trim());
    startFullExperiment();

    // Test1実験ページに遷移
    navigate('/experiment/task?cond=Test1');
  };

  // 条件データ
  const conditions = [
    {
      id: 'Test1' as const,
      name: '既存カラーパレット方式',
      description: '全色相×複数トーンの大量の色を一度に表示',
      icon: Palette,
    },
    {
      id: 'Test2' as const,
      name: '色相環＋トーンスライダー方式',
      description: '色相環とトーンスライダーで自由に色を作成',
      icon: Layers,
    },
    {
      id: 'Test3' as const,
      name: '二段階推薦方式',
      description: '色相推薦→トーン推薦の二段階で選択（提案手法）',
      icon: Sparkles,
    }
  ];

  return (
    <main className="flex-1 pb-8 min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <div className="w-[70%] mx-auto px-4 py-8 overflow-x-hidden">
        {/* ヘッダー */}
        <div className="text-center mb-10">
          <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
            <Palette className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            色推薦UI評価実験
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            イラスト配色支援ツールの主観評価実験にご協力ください
          </p>
        </div>

        {/* 実験概要 - コンパクト版 */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">所要時間</p>
                  <p className="text-sm text-muted-foreground">約 15〜20 分</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <InfoIcon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">実験形式</p>
                  <p className="text-sm text-muted-foreground">3つのテストを順番に体験</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 実験フロー */}
        <div className="mb-8 space-y-4">
          {/* 実験の流れ - タイトルカード */}
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-xl font-bold mb-2">実験の流れ</h2>
                <p className="text-muted-foreground">
                  3つの異なる方式で同じタスクを実施します
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 条件カードグリッド */}
          <div className="grid md:grid-cols-2 gap-4">
            {conditions.map((cond) => {
              const Icon = cond.icon;
              const colors = getConditionCardColors(cond.id);
              return (
                <div
                  key={cond.id}
                  className={`p-4 rounded-lg border-2 ${colors.bg} ${colors.border}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 ${colors.badge} rounded-lg flex-shrink-0`}>
                      <Icon className={`${EXPERIMENT_ICON_STYLES.default} text-white`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={`${colors.badge} text-white font-mono px-3 py-1`}>
                          {cond.id}
                        </Badge>
                        <h3 className="font-semibold">{cond.name}</h3>
                      </div>
                      <p className={EXPERIMENT_TEXT_STYLES.description}>
                        {cond.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 参加者ID入力と開始 */}
        <Card className="border-2 border-primary/30 shadow-lg">
          <CardHeader className="bg-primary/5 pt-10 pb-10 px-8">
            <CardTitle className="flex items-center gap-2 text-xl mb-4">
              <User className="w-6 h-6" />
              実験を開始
            </CardTitle>
            <CardDescription className="text-base">
              参加者IDを入力して実験を開始してください
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-16 pb-16 px-8 space-y-10">
            <div className="space-y-6">
              <label className={EXPERIMENT_TEXT_STYLES.label}>参加者ID</label>
              <Input
                type="text"
                placeholder="例: U001"
                value={inputId}
                onChange={(e) => setInputId(e.target.value)}
                className={getInputClassName('large')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleStart();
                  }
                }}
              />
            </div>

            <Button
              onClick={handleStart}
              size="lg"
              className={`w-full text-xl h-16 ${getButtonClassName('action')}`}
            >
              <Play className={EXPERIMENT_ICON_STYLES.large} />
              実験開始（Test1から）
            </Button>

            <Alert className="border-primary/30 bg-primary/5 p-6">
              <InfoIcon className="h-5 w-5 text-primary" />
              <AlertDescription className="text-sm leading-relaxed ml-2">
                Test1 → Test2 → Test3 の順で体験します。各テスト終了後、次に進む確認が表示されます。
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default ExperimentIntroPage;
