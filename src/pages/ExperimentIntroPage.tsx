import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useExperimentStore, type OrderPattern } from '@/store/experimentStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, User, Palette, Bug, CheckCircle } from 'lucide-react';
import {
  EXPERIMENT_ICON_STYLES,
  EXPERIMENT_TEXT_STYLES,
  getButtonClassName,
  getInputClassName,
} from '@/constants/experimentTheme';
import { ExperimentInstructionsModal } from '@/components/ExperimentInstructionsModal';

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

  const { setParticipantId, setParticipantInfo, setOrderPattern, startFullExperiment, orderPattern } = useExperimentStore();
  const [deviceType, setDeviceType] = useState<'PC' | 'tablet' | 'smartphone' | ''>(isDebugMode ? 'PC' : '');
  const [illustrationExperience, setIllustrationExperience] = useState<'beginner' | 'some' | 'hobby' | 'professional' | ''>(isDebugMode ? 'hobby' : '');
  const [inputDevice, setInputDevice] = useState<'マウス' | 'タブレットペン' | 'ペンタブ' | '液タブ' | ''>(isDebugMode ? 'マウス' : '');
  const [instructionsChecked, setInstructionsChecked] = useState(isDebugMode ? true : false);

  // 最初に実験するUIを判定（パターン1はUI1、パターン2はUI2）
  const firstUI = orderPattern === 1 ? 'UI1' : 'UI2';

  // URLパラメータからorder/uiOrderを取得してカウンターバランスパターンを設定
  useEffect(() => {
    // orderパラメータが指定されている場合はそれを優先
    const orderParam = searchParams.get('order');
    if (orderParam) {
      const orderNumber = parseInt(orderParam, 10);
      if (orderNumber >= 1 && orderNumber <= 2) {
        setOrderPattern(orderNumber as OrderPattern);
        console.log(`Order pattern set to ${orderNumber} from URL parameter 'order'`);
        return;
      }
    }

    // uiOrderパラメータが指定されている場合、それに基づいてパターンを選択
    const uiOrderParam = searchParams.get('uiOrder');
    if (uiOrderParam === 'UI1' || uiOrderParam === 'UI2') {
      // UI1先行: パターン1、UI2先行: パターン2（TaskA→B固定）
      const pattern = uiOrderParam === 'UI1' ? 1 : 2;
      setOrderPattern(pattern as OrderPattern);
      console.log(`Order pattern set to ${pattern} from URL parameter 'uiOrder=${uiOrderParam}'`);
    }
  }, [searchParams, setOrderPattern]);

  // 実験開始ハンドラ
  const handleStart = () => {
    if (!deviceType) {
      alert('使用デバイスを選択してください');
      return;
    }

    if (!illustrationExperience) {
      alert('イラスト経験を選択してください');
      return;
    }

    if (!inputDevice) {
      alert('入力デバイスを選択してください');
      return;
    }

    if (!instructionsChecked) {
      alert('指示書を確認してチェックを入れてください');
      return;
    }

    // 参加者情報を保存（IDは常に"noname"）
    setParticipantId('noname');
    setParticipantInfo({
      deviceType,
      illustrationExperience,
      inputDevice,
    });

    startFullExperiment();

    // 最初のUI説明ページに遷移（デバッグモードを引き継ぐ）
    const debugParam = isDebugMode ? '&debug=true' : '';
    navigate(`/experiment/instruction?cond=${firstUI}${debugParam}`);
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
                  <p className="text-base font-semibold">所要時間</p>
                  <p className="text-sm text-muted-foreground">約 15〜20 分</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <div>
                  <p className="text-base font-semibold">実験形式</p>
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
            <CardTitle className={`${EXPERIMENT_TEXT_STYLES.cardTitle} flex items-center gap-2 mb-4`}>
              <User className="w-6 h-6" />
              実験を開始
            </CardTitle>
            <CardDescription className={EXPERIMENT_TEXT_STYLES.description}>
              以下の情報を選択して実験を開始してください
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-16 pb-16 px-8 space-y-10">
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

            {/* 入力デバイス選択 */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-foreground">入力デバイス *</Label>
              <Select value={inputDevice} onValueChange={(value: string) => setInputDevice(value as 'マウス' | 'タブレットペン' | 'ペンタブ' | '液タブ' | '')}>
                <SelectTrigger className={getInputClassName('default')}>
                  <SelectValue placeholder="入力デバイスを選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="マウス">マウス</SelectItem>
                  <SelectItem value="タブレットペン">タブレットペン</SelectItem>
                  <SelectItem value="ペンタブ">ペンタブ</SelectItem>
                  <SelectItem value="液タブ">液タブ</SelectItem>
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

            {/* 指示書確認 */}
            <div className="space-y-3">
              <div className="flex flex-col gap-3 p-4 border-2 border-primary/30 rounded-lg bg-primary/5">
                <div className="flex items-center gap-2">
                  {instructionsChecked ? (
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 fill-green-600 dark:fill-green-400" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                  )}
                  <Label className="text-base font-semibold text-foreground">
                    指示書を確認する *
                  </Label>
                </div>
                <ExperimentInstructionsModal
                  variant="outline"
                  size="sm"
                  onOpen={() => setInstructionsChecked(true)}
                />
                {!instructionsChecked && (
                  <p className="text-sm text-muted-foreground">
                    指示書を開いて確認してください
                  </p>
                )}
              </div>
            </div>

            <Button
              onClick={handleStart}
              size="lg"
              className={`w-full text-xl h-16 ${getButtonClassName('action')}`}
            >
              <Play className={EXPERIMENT_ICON_STYLES.large} />
              実験開始（{firstUI}から）
            </Button>

            <Alert className="border-primary/30 bg-primary/5 p-6">
              <AlertDescription className="text-sm leading-relaxed">
                {firstUI === 'UI1' ? 'UI1 → UI2' : 'UI2 → UI1'} の順で体験します。各テスト終了後、次に進む確認が表示されます。
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default ExperimentIntroPage;
