import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useExperimentStore, type OrderPattern } from '@/store/experimentStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, User, Palette, Bug } from 'lucide-react';
import {
  EXPERIMENT_ICON_STYLES,
  getButtonClassName,
  getInputClassName,
} from '@/constants/experimentTheme';

/**
 * 実験導入ページ（改良版）
 *
 * モダンでクリーンなUIデザイン
 * - ビジュアル要素の強化
 * - 色分けされた条件カード
 * - より簡潔なテキスト
 * - デバッグモード対応（?debug=true で自動入力）
 */
const ExperimentIntroPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isDebugMode = searchParams.get('debug') === 'true';

  const { setParticipantId, setParticipantInfo, setOrderPattern, startFullExperiment } = useExperimentStore();
  const [inputId, setInputId] = useState(isDebugMode ? 'DEBUG001' : '');
  const [deviceType, setDeviceType] = useState<'PC' | 'tablet' | 'smartphone' | ''>(isDebugMode ? 'PC' : '');
  const [illustrationExperience, setIllustrationExperience] = useState<'beginner' | 'some' | 'hobby' | 'professional' | ''>(isDebugMode ? 'hobby' : '');
  const [ageRange, setAgeRange] = useState<'10s' | '20s' | '30s' | '40s' | '50s' | '60s+' | ''>(isDebugMode ? '20s' : '');

  // URLパラメータからorderを取得してカウンターバランスパターンを設定
  useEffect(() => {
    const orderParam = searchParams.get('order');
    if (orderParam) {
      const orderNumber = parseInt(orderParam, 10);
      if (orderNumber >= 1 && orderNumber <= 4) {
        setOrderPattern(orderNumber as OrderPattern);
        console.log(`Order pattern set to ${orderNumber} from URL parameter`);
      }
    }
  }, [searchParams, setOrderPattern]);

  // 実験開始ハンドラ
  const handleStart = () => {
    if (!inputId.trim()) {
      alert('参加者IDを入力してください');
      return;
    }

    if (!deviceType) {
      alert('使用デバイスを選択してください');
      return;
    }

    if (!illustrationExperience) {
      alert('イラスト経験を選択してください');
      return;
    }

    // 参加者情報を保存
    setParticipantId(inputId.trim());
    setParticipantInfo({
      deviceType,
      illustrationExperience,
      ageRange,
    });

    startFullExperiment();

    // UI1説明ページに遷移（デバッグモードを引き継ぐ）
    const debugParam = isDebugMode ? '&debug=true' : '';
    navigate(`/experiment/instruction?cond=UI1${debugParam}`);
  };


  return (
    <main className="flex-1 pb-8 min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <div className="w-[70%] mx-auto px-4 py-8 overflow-x-hidden">
        {/* デバッグモードインジケーター */}
        {isDebugMode && (
          <div className="mb-4 p-3 bg-orange-100 dark:bg-orange-900 border-2 border-orange-500 rounded-lg">
            <div className="flex items-center gap-2 justify-center">
              <Bug className="w-5 h-5 text-orange-700 dark:text-orange-300" />
              <span className="font-semibold text-orange-700 dark:text-orange-300">
                デバッグモード有効（全フィールド自動入力済み）
              </span>
            </div>
          </div>
        )}

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
                <div>
                  <p className="font-semibold">実験形式</p>
                  <p className="text-sm text-muted-foreground">3つのテストを順番に体験</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 実験フロー - 非表示 */}
        {/* <div className="mb-8 space-y-4">
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
                        <h3>{cond.name}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div> */}

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
            <div>
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

            {/* 使用デバイス選択 */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-foreground">使用デバイス *</Label>
              <Select value={deviceType} onValueChange={(value: string) => setDeviceType(value as 'PC' | 'tablet' | 'smartphone' | '')}>
                <SelectTrigger className={getInputClassName('default')}>
                  <SelectValue placeholder="デバイスを選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PC">PC</SelectItem>
                  <SelectItem value="tablet">タブレット</SelectItem>
                  <SelectItem value="smartphone">スマートフォン</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* イラスト経験選択 */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-foreground">イラスト経験 *</Label>
              <Select value={illustrationExperience} onValueChange={(value: string) => setIllustrationExperience(value as 'beginner' | 'some' | 'hobby' | 'professional' | '')}>
                <SelectTrigger className={getInputClassName('default')}>
                  <SelectValue placeholder="経験レベルを選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">初心者（ほぼ描いたことがない）</SelectItem>
                  <SelectItem value="some">少し経験あり（たまに描く）</SelectItem>
                  <SelectItem value="hobby">趣味レベル（よく描く）</SelectItem>
                  <SelectItem value="professional">プロ・セミプロレベル</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 年齢層選択（オプション） */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-foreground">年齢層（任意）</Label>
              <Select value={ageRange} onValueChange={(value: string) => setAgeRange(value as '10s' | '20s' | '30s' | '40s' | '50s' | '60s+' | '')}>
                <SelectTrigger className={getInputClassName('default')}>
                  <SelectValue placeholder="年齢層を選択（任意）" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10s">10代</SelectItem>
                  <SelectItem value="20s">20代</SelectItem>
                  <SelectItem value="30s">30代</SelectItem>
                  <SelectItem value="40s">40代</SelectItem>
                  <SelectItem value="50s">50代</SelectItem>
                  <SelectItem value="60s+">60代以上</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleStart}
              size="lg"
              className={`w-full text-xl h-16 ${getButtonClassName('action')}`}
            >
              <Play className={EXPERIMENT_ICON_STYLES.large} />
              実験開始（UI1から）
            </Button>

            <Alert className="border-primary/30 bg-primary/5 p-6">
              <AlertDescription className="text-sm leading-relaxed">
                UI1 → UI2 の順で体験します。各テスト終了後、次に進む確認が表示されます。
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default ExperimentIntroPage;
