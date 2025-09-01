import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Play, ClipboardPenLine, HelpCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTutorial } from '@/contexts/TutorialContext';

interface NavigationMenuProps {
  className?: string;
}

export const NavigationMenu = ({ className = '' }: NavigationMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { startTutorial } = useTutorial();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Navigation Icons */}
      <button
        onClick={() => {
          startTutorial();
        }}
        className="p-2 rounded-lg bg-background/50 border-none hover:bg-muted/50 transition-colors backdrop-blur-sm text-foreground"
        title="チュートリアル"
      >
        <Play className="w-5 h-5 [&>path]:fill-none [&>path]:stroke-current" />
      </button>
      <Link
        to="/swipe"
        className="p-2 rounded-lg bg-background/50 border-none hover:bg-muted/50 transition-colors backdrop-blur-sm text-foreground"
        title="スワイプ推薦"
      >
        <ClipboardPenLine className="w-5 h-5" />
      </Link>
      <div className="w-4"></div>
      <Link
        to="/help"
        className="p-2 rounded-lg bg-background/50 border-none hover:bg-muted/50 transition-colors backdrop-blur-sm text-foreground"
        title="ヘルプ"
      >
        <HelpCircle className="w-5 h-5" />
      </Link>
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