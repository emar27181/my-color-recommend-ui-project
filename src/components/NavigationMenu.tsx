import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ClipboardList, Info, FlaskConical, TestTube2 } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

interface NavigationMenuProps {
  className?: string;
}

export const NavigationMenu = ({ className = '' }: NavigationMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`flex items-center gap-5 ${className}`}>
      {/* Navigation Icons */}
      {/* チュートリアルボタン - 表示オフ
      <button
        onClick={() => {
          startTutorial();
        }}
        className="p-2 rounded-lg bg-background/50 border-none hover:bg-muted/50 transition-colors backdrop-blur-sm text-foreground"
        title="チュートリアル"
      >
        <Play className="w-5 h-5 [&>path]:fill-none [&>path]:stroke-current" />
      </button>
      */}
      {/* スワイプ推薦ボタン - 表示オフ
      <Link
        to="/swipe"
        className="p-2 rounded-lg bg-background/50 border-none hover:bg-muted/50 transition-colors backdrop-blur-sm text-foreground"
        title="スワイプ推薦"
      >
        <ScrollText className="w-5 h-5" />
      </Link>
      */}
      <Link
        to="/sns-analysis"
        className="p-2 rounded-lg bg-background/50 border-none hover:bg-muted/50 transition-colors backdrop-blur-sm text-foreground"
        title="SNS嗜好分析"
      >
        <FlaskConical className="w-5 h-5" />
      </Link>
      <Link
        to="/ui-test"
        className="p-2 rounded-lg bg-background/50 border-none hover:bg-muted/50 transition-colors backdrop-blur-sm text-foreground"
        title="UIテスト"
      >
        <TestTube2 className="w-5 h-5" />
      </Link>
      <Link
        to="/experiment"
        className="p-2 rounded-lg bg-background/50 border-none hover:bg-muted/50 transition-colors backdrop-blur-sm text-foreground"
        title="実験ページ"
      >
        <ClipboardList className="w-5 h-5" />
      </Link>
      <div className="w-4"></div>
      <Link
        to="/info"
        className="p-2 rounded-lg bg-background/50 border-none hover:bg-muted/50 transition-colors backdrop-blur-sm text-foreground"
        title="サイト情報"
      >
        <Info className="w-5 h-5" />
      </Link>
      {/* ヘルプボタン - 表示オフ
      <Link
        to="/help"
        className="p-2 rounded-lg bg-background/50 border-none hover:bg-muted/50 transition-colors backdrop-blur-sm text-foreground"
        title="ヘルプ"
      >
        <HelpCircle className="w-5 h-5" />
      </Link>
      */}
      <div className="p-2 rounded-lg bg-background/50 backdrop-blur-sm">
        <ThemeToggle />
      </div>
      
      {/* Hamburger Menu Button */}
      <button
        onClick={toggleMenu}
        className="p-2 rounded-lg bg-background/50 border-none hover:bg-muted/50 transition-colors backdrop-blur-sm text-foreground"
        aria-label="メニューを開く"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Dropdown Menu (placeholder for future use) */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={toggleMenu}
          />

          {/* Menu Content - Empty for now */}
          <div className="fixed top-[68px] right-0 z-50 w-48 bg-background border border-border rounded-lg shadow-lg overflow-hidden">
            <nav className="p-2">
              <p className="text-sm text-muted-foreground p-2">追加メニュー項目</p>
            </nav>
          </div>
        </>
      )}
    </div>
  );
};