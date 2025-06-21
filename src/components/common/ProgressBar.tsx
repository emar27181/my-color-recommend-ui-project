import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export const ProgressBar = ({ 
  value, 
  className, 
  showPercentage = true,
  size = 'md',
  variant = 'default'
}: ProgressBarProps) => {
  const clampedValue = Math.min(100, Math.max(0, value));
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };
  
  const variantClasses = {
    default: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  };

  return (
    <div className={cn('w-full space-y-1', className)}>
      {showPercentage && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">進行状況</span>
          <span className="font-medium text-foreground">{Math.round(clampedValue)}%</span>
        </div>
      )}
      
      <div className={cn(
        'relative overflow-hidden rounded-full bg-muted',
        sizeClasses[size]
      )}>
        <div
          className={cn(
            'h-full transition-all duration-300 ease-out rounded-full',
            variantClasses[variant]
          )}
          style={{ width: `${clampedValue}%` }}
        />
        
        {/* アニメーション効果 */}
        {clampedValue > 0 && clampedValue < 100 && (
          <div 
            className={cn(
              'absolute top-0 h-full w-2 bg-white/30 animate-pulse rounded-full',
              variantClasses[variant]
            )}
            style={{ 
              left: `${Math.max(0, clampedValue - 2)}%`,
              opacity: 0.6
            }}
          />
        )}
      </div>
    </div>
  );
};