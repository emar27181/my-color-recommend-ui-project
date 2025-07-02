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
    <div className={`relative ${className}`}>
      {/* Hamburger Menu Button */}
      <button
        onClick={toggleMenu}
        className="p-2 rounded-lg bg-transparent border-none hover:bg-muted/50 transition-colors"
        aria-label="メニューを開く"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-foreground" />
        ) : (
          <Menu className="w-6 h-6 text-foreground" />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={toggleMenu}
          />

          {/* Menu Content */}
          <div className="fixed top-[68px] right-0 z-50 w-16 bg-background border border-border rounded-lg shadow-lg overflow-hidden">
            <nav className="p-2 flex flex-col gap-1">
              <button
                onClick={() => {
                  startTutorial();
                  setIsOpen(false);
                }}
                className="p-3 hover:bg-muted/50 transition-colors rounded-lg flex items-center justify-center"
                title="チュートリアル"
              >
                <Play className="w-5 h-5" />
              </button>
              <Link
                to="/swipe"
                className="p-3 hover:bg-muted/50 transition-colors rounded-lg flex items-center justify-center"
                onClick={toggleMenu}
                title="スワイプ推薦"
              >
                <ClipboardPenLine className="w-5 h-5" />
              </Link>
              <Link
                to="/help"
                className="p-3 hover:bg-muted/50 transition-colors rounded-lg flex items-center justify-center"
                onClick={toggleMenu}
                title="ヘルプ"
              >
                <HelpCircle className="w-5 h-5" />
              </Link>
              <div className="p-3 border-t border-border flex items-center justify-center">
                <ThemeToggle />
              </div>
            </nav>
          </div>
        </>
      )}
    </div>
  );
};