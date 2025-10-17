import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExperimentStore } from '@/store/experimentStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon, Play, User, AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * 実験導入ページ
 *
 * C0~C3の条件説明と参加者ID入力を行う
 * 開始ボタンでC0実験ページに遷移
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

    // C0実験ページに遷移
    navigate('/experiment/task?cond=C0');
  };

  return (
    <main className="flex-1 pb-8 min-h-screen flex flex-col bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* タイトル */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3">色推薦UI評価実験</h1>
          <p className="text-muted-foreground text-lg">
            イラスト配色支援ツールの主観評価にご協力ください
          </p>
        </div>

        {/* 実験概要 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <InfoIcon className="w-5 h-5 text-primary" />
              実験について
            </CardTitle>
            <CardDescription>
              本実験では、4つの異なる推薦条件（C0~C3）を体験していただきます
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              イラスト配色支援ツールの異なる推薦機能が、ユーザー体験や作業効率にどのような影響を与えるかを調査します。
              各条件で同じタスクを実施し、操作内容と所要時間を記録します。
            </p>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>所要時間：</strong>約15～20分（4条件 × 3～5分程度）<br />
                <strong>データ収集：</strong>すべての操作が自動記録されます（個人情報は含まれません）
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* 実験条件の説明 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>実験条件（C0 → C1 → C2 → C3の順で実施）</CardTitle>
            <CardDescription>
              各条件で利用できる機能が異なります
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* C0 */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="font-mono text-base px-3 py-1">
                  C0
                </Badge>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">推薦なし</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    通常のカラーピッカーのみで色を選択します
                  </p>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">カラーピッカー・画像抽出・キャンバス描画が利用可能</span>
                  </div>
                </div>
              </div>
            </div>

            {/* C1 */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="font-mono text-base px-3 py-1">
                  C1
                </Badge>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">色相推薦のみ</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    ベース色から色相に基づく推薦色が表示されます（補色・類似色など）
                  </p>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">C0の機能 + 色相推薦機能</span>
                  </div>
                </div>
              </div>
            </div>

            {/* C2 */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="font-mono text-base px-3 py-1">
                  C2
                </Badge>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">トーン推薦のみ</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    選択した色からトーンに基づく推薦色が表示されます（明度・彩度バリエーション）
                  </p>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">C0の機能 + トーン推薦機能</span>
                  </div>
                </div>
              </div>
            </div>

            {/* C3 */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="font-mono text-base px-3 py-1">
                  C3
                </Badge>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">二段階推薦</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    色相とトーンの両方に基づく推薦色が表示されます
                  </p>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">C0の機能 + 色相推薦 + トーン推薦（すべて利用可能）</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 参加者ID入力と開始 */}
        <Card className="mb-6 border-2 border-primary/20">
          <CardHeader>
            <CardTitle>実験を開始</CardTitle>
            <CardDescription>
              参加者IDを入力して「実験開始」ボタンを押してください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <User className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <Input
                type="text"
                placeholder="参加者ID（例: U001）"
                value={inputId}
                onChange={(e) => setInputId(e.target.value)}
                className="font-mono flex-1"
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
              className="w-full gap-2 text-lg py-6"
            >
              <Play className="w-5 h-5" />
              実験開始（C0から）
            </Button>

            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertDescription className="text-sm">
                実験開始後、C0 → C1 → C2 → C3 の順で各条件を体験していただきます。
                各条件終了後、次の条件に進む前に確認メッセージが表示されます。
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default ExperimentIntroPage;
