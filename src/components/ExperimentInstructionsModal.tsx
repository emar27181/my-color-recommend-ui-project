import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { EXPERIMENT_INSTRUCTIONS } from '@/constants/experimentInstructions';

interface ExperimentInstructionsModalProps {
  /**
   * コンポーネントマウント時に自動でモーダルを開くかどうか
   */
  autoOpen?: boolean;
  /**
   * ボタンのバリアント（トリガーボタンがある場合）
   */
  variant?: 'default' | 'outline' | 'ghost';
  /**
   * ボタンのサイズ
   */
  size?: 'default' | 'sm' | 'lg';
  /**
   * モーダルが開かれたときのコールバック
   */
  onOpen?: () => void;
}

/**
 * 実験指示書モーダル
 *
 * - autoOpen=true で初回表示時に自動的にモーダルを開く
 * - トリガーボタンから手動で開くことも可能
 * - マークダウン風のテキストを整形して表示
 */
export const ExperimentInstructionsModal = ({
  autoOpen = false,
  variant = 'outline',
  size = 'default',
  onOpen,
}: ExperimentInstructionsModalProps) => {
  const [open, setOpen] = useState(false);

  // autoOpenがtrueの場合、初回マウント時にモーダルを開く
  useEffect(() => {
    if (autoOpen) {
      setOpen(true);
    }
  }, [autoOpen]);

  // モーダルが開かれたときにコールバックを実行
  useEffect(() => {
    if (open && onOpen) {
      onOpen();
    }
  }, [open, onOpen]);

  // マークダウン風のテキストをHTMLに変換（簡易版）
  const formatInstructions = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        // 見出し1 (# )
        if (line.startsWith('# ')) {
          return (
            <h1 key={index} className="text-2xl font-bold mt-6 mb-4 text-foreground">
              {line.replace('# ', '')}
            </h1>
          );
        }
        // 見出し2 (## )
        if (line.startsWith('## ')) {
          return (
            <h2 key={index} className="text-xl font-semibold mt-5 mb-3 text-foreground">
              {line.replace('## ', '')}
            </h2>
          );
        }
        // 見出し3 (### )
        if (line.startsWith('### ')) {
          return (
            <h3 key={index} className="text-lg font-semibold mt-4 mb-2 text-foreground">
              {line.replace('### ', '')}
            </h3>
          );
        }
        // 水平線 (---)
        if (line.trim() === '---') {
          return <hr key={index} className="my-4 border-border" />;
        }
        // 番号リスト (1. )
        if (/^\d+\.\s/.test(line)) {
          return (
            <li key={index} className="ml-6 mb-2 text-foreground list-decimal">
              {line.replace(/^\d+\.\s/, '')}
            </li>
          );
        }
        // 箇条書き (- )
        if (line.startsWith('- ')) {
          return (
            <li key={index} className="ml-6 mb-2 text-foreground list-disc">
              {line.replace('- ', '')}
            </li>
          );
        }
        // 引用 (> )
        if (line.startsWith('> ')) {
          return (
            <blockquote
              key={index}
              className="border-l-4 border-primary pl-4 italic text-muted-foreground my-3"
            >
              {line.replace('> ', '')}
            </blockquote>
          );
        }
        // 空行
        if (line.trim() === '') {
          return <div key={index} className="h-2" />;
        }
        // 太字・強調 (**text**)
        const boldPattern = /\*\*(.*?)\*\*/g;
        if (boldPattern.test(line)) {
          const parts = line.split(boldPattern);
          return (
            <p key={index} className="mb-2 text-foreground leading-relaxed">
              {parts.map((part, i) =>
                i % 2 === 1 ? (
                  <strong key={i} className="font-bold text-primary">
                    {part}
                  </strong>
                ) : (
                  part
                )
              )}
            </p>
          );
        }
        // 通常のテキスト
        return (
          <p key={index} className="mb-2 text-foreground leading-relaxed">
            {line}
          </p>
        );
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className="rounded-lg text-gray-900 dark:text-gray-900">
          <FileText className="w-4 h-4 mr-2 text-gray-900 dark:text-gray-900" />
          指示書を表示
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[70vw] max-w-none max-h-[80vh] overflow-y-auto">
        <DialogHeader className="pr-16">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2 max-w-[calc(100%-3rem)]">
            <FileText className="w-6 h-6" />
            実験指示書（参加者向け）
          </DialogTitle>
          <DialogDescription>
            実験の詳細なルールとタスクの説明をご確認ください
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-1">{formatInstructions(EXPERIMENT_INSTRUCTIONS)}</div>
      </DialogContent>
    </Dialog>
  );
};
