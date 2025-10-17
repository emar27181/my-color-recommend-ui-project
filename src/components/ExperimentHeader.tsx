import { useState } from 'react';
import { useExperimentStore } from '@/store/experimentStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Square, Download, User, Activity } from 'lucide-react';

// 条件の説明
const CONDITION_DESCRIPTIONS = {
  C0: '推薦なし（通常のカラーピッカーのみ）',
  C1: '色相推薦のみ',
  C2: 'トーン推薦のみ',
  C3: '二段階推薦（色相＋トーン）',
};

export const ExperimentHeader = () => {
  const {
    participantId,
    condition,
    isExperimentRunning,
    events,
    deviceInfo,
    setParticipantId,
    startExperiment,
    endExperiment,
    exportLog,
    resetExperiment,
  } = useExperimentStore();

  const [inputId, setInputId] = useState(participantId);
  const [showInstructions, setShowInstructions] = useState(true);

  // 実験開始ハンドラ
  const handleStart = () => {
    if (!inputId.trim()) {
      alert('参加者IDを入力してください');
      return;
    }
    setParticipantId(inputId.trim());
    startExperiment();
    setShowInstructions(false);
  };

  // 実験終了ハンドラ
  const handleEnd = () => {
    if (window.confirm('実験を終了してログをダウンロードしますか？')) {
      endExperiment();
      // 少し遅延してからログをエクスポート（終了時刻を確実に記録するため）
      setTimeout(() => {
        exportLog();
      }, 100);
    }
  };

  // リセットハンドラ
  const handleReset = () => {
    if (window.confirm('実験データをリセットしますか？（保存されていないデータは失われます）')) {
      resetExperiment();
      setShowInstructions(true);
    }
  };

  return (
    <Card className="mb-4 border-2 border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg">実験モード</CardTitle>
            <Badge variant="outline" className="font-mono text-base px-3 py-1">
              {condition}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {CONDITION_DESCRIPTIONS[condition]}
            </span>
          </div>

          {/* デバイス情報 */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Activity className="w-4 h-4" />
            <span>{deviceInfo.type}</span>
            <span>•</span>
            <span>{deviceInfo.screenWidth}x{deviceInfo.screenHeight}</span>
          </div>
        </div>
        {showInstructions && (
          <CardDescription className="mt-2">
            参加者IDを入力して「開始」ボタンを押すと、実験が開始されます。
            すべての操作が記録され、終了時にJSONファイルとしてダウンロードされます。
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center gap-3">
          {/* 参加者ID入力 */}
          {!isExperimentRunning && (
            <div className="flex items-center gap-2 flex-1 max-w-xs">
              <User className="w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="参加者ID（例: U001）"
                value={inputId}
                onChange={(e) => setInputId(e.target.value)}
                disabled={isExperimentRunning}
                className="font-mono"
              />
            </div>
          )}

          {/* 参加者ID表示（実験中） */}
          {isExperimentRunning && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <Badge variant="secondary" className="font-mono">
                {participantId}
              </Badge>
            </div>
          )}

          {/* 開始ボタン */}
          {!isExperimentRunning && (
            <Button onClick={handleStart} className="gap-2">
              <Play className="w-4 h-4" />
              開始
            </Button>
          )}

          {/* 終了ボタン */}
          {isExperimentRunning && (
            <Button onClick={handleEnd} variant="destructive" className="gap-2">
              <Square className="w-4 h-4" />
              終了してダウンロード
            </Button>
          )}

          {/* イベント数表示 */}
          {isExperimentRunning && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-muted">
              <Activity className="w-4 h-4" />
              <span className="text-sm font-mono">
                {events.length} イベント記録中
              </span>
            </div>
          )}

          {/* ログダウンロードボタン（実験終了後） */}
          {!isExperimentRunning && events.length > 0 && (
            <>
              <Button onClick={exportLog} variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                ログ再ダウンロード
              </Button>
              <Button onClick={handleReset} variant="ghost" size="sm">
                リセット
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
