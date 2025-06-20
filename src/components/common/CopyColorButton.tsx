import { useState } from 'react';
import { Copy, Check, Palette } from 'lucide-react';
import { copyToClipboard } from '@/lib/clipboard';
import { useToastContext } from '@/contexts/ToastContext';

interface CopyColorButtonProps {
  color: string;
  variant?: 'minimal' | 'compact' | 'full';
  showColorCode?: boolean;
  className?: string;
}

/**
 * おしゃれなカラーコード専用コピーボタン
 */
export const CopyColorButton = ({ 
  color, 
  variant = 'compact',
  showColorCode = false,
  className = '' 
}: CopyColorButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const { showToast } = useToastContext();

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // #を除いた6桁の英数字のみを抽出
    const colorWithoutHash = color.replace('#', '');
    
    const result = await copyToClipboard(colorWithoutHash);
    
    if (result.success) {
      setIsCopied(true);
      showToast(`${colorWithoutHash} をコピーしました`, 'success');
      setTimeout(() => setIsCopied(false), 2000);
    } else {
      showToast('コピーに失敗しました', 'error');
    }
  };

  // Minimal variant - アイコンのみ
  if (variant === 'minimal') {
    return (
      <button
        onClick={handleCopy}
        className={`p-1.5 rounded-md bg-transparent border-transparent 
                   hover:bg-background/10 hover:scale-105 
                   transition-all duration-200 
                   ${className.includes('opacity') ? className : `opacity-80 hover:opacity-100 ${className}`}`}
        title={`${color.replace('#', '')} をコピー`}
      >
        {isCopied ? (
          <Check className="w-4 h-4 text-emerald-500" />
        ) : (
          <Copy className="w-4 h-4 text-muted-foreground hover:text-foreground" />
        )}
      </button>
    );
  }

  // Compact variant - アイコン + 小さいラベル
  if (variant === 'compact') {
    return (
      <button
        onClick={handleCopy}
        className={`px-2 py-1.5 rounded-md bg-transparent border-transparent 
                   hover:bg-background/10 hover:scale-105 
                   transition-all duration-200 
                   flex items-center gap-2 ${className.includes('opacity') ? className : `opacity-80 hover:opacity-100 ${className}`}`}
        title={`${color.replace('#', '')} をコピー`}
      >
        {isCopied ? (
          <Check className="w-4 h-4 text-emerald-500" />
        ) : (
          <Copy className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
    );
  }

  // Full variant - フルサイズボタン
  return (
    <button
      onClick={handleCopy}
      className={`px-3 py-1.5 rounded-lg bg-transparent border-transparent 
                 hover:bg-background/10 hover:scale-105 
                 transition-all duration-200 
                 flex items-center gap-2 ${className}`}
      title={`${color} をコピー`}
    >
      <div className="flex items-center gap-2">
        <Palette className="w-4 h-4 text-muted-foreground" />
        {showColorCode && (
          <span className="font-mono text-sm text-muted-foreground">{color}</span>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {isCopied ? (
          <Check className="w-4 h-4 text-emerald-500" />
        ) : (
          <Copy className="w-4 h-4 text-muted-foreground" />
        )}
      </div>
    </button>
  );
};