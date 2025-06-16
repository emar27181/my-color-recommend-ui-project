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
    
    const result = await copyToClipboard(color);
    
    if (result.success) {
      setIsCopied(true);
      showToast(`${color} をコピーしました`, 'success');
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
        className={`p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 
                   hover:bg-background hover:border-border hover:scale-105 
                   transition-all duration-200 shadow-sm hover:shadow-md 
                   ${className.includes('opacity') ? className : `opacity-80 hover:opacity-100 ${className}`}`}
        title={`${color} をコピー`}
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
        className={`px-3 py-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50 
                   hover:bg-background hover:border-border hover:scale-105 
                   transition-all duration-200 shadow-sm hover:shadow-md 
                   flex items-center gap-2 ${className.includes('opacity') ? className : `opacity-80 hover:opacity-100 ${className}`}`}
        title={`${color} をコピー`}
      >
        {isCopied ? (
          <>
            <Check className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-medium text-emerald-500">Done!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Copy</span>
          </>
        )}
      </button>
    );
  }

  // Full variant - フルサイズボタン
  return (
    <button
      onClick={handleCopy}
      className={`px-4 py-2 rounded-xl bg-gradient-to-r from-background/90 to-background/80 
                 backdrop-blur-sm border border-border/50 hover:border-border 
                 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md 
                 flex items-center gap-3 ${className}`}
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
          <>
            <Check className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-500">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Copy Code</span>
          </>
        )}
      </div>
    </button>
  );
};