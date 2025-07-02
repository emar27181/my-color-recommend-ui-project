import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Play, ClipboardPenLine, Home } from 'lucide-react';
import { NavigationMenu } from '@/components/NavigationMenu';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ToastContainer } from '@/components/ToastContainer';
import { TutorialOverlay } from '@/components/tutorial/TutorialOverlay';
import { useTutorial } from '@/contexts/TutorialContext';

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
}

export const Layout = ({ children, showHeader = true }: LayoutProps) => {
  const { startTutorial } = useTutorial();

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      {showHeader && (
        <header className="border-b border-border bg-background flex-shrink-0">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Link
                  to="/"
                  className="p-2 rounded-lg bg-background/50 border-none hover:bg-muted/50 transition-colors backdrop-blur-sm"
                  title="ホームページ"
                >
                  <Home className="w-5 h-5 text-foreground" />
                </Link>
                <button
                  onClick={startTutorial}
                  className="p-2 rounded-lg bg-background/50 border-none hover:bg-muted/50 transition-colors backdrop-blur-sm"
                  title="チュートリアルを開始"
                >
                  <Play className="w-5 h-5 text-foreground" />
                </button>
                <Link
                  to="/swipe"
                  className="p-2 rounded-lg bg-background/50 border-none hover:bg-muted/50 transition-colors backdrop-blur-sm"
                  title="スワイプ推薦"
                >
                  <ClipboardPenLine className="w-5 h-5 text-foreground" />
                </Link>
                <Link
                  to="/help"
                  className="p-2 rounded-lg bg-background/50 border-none hover:bg-muted/50 transition-colors backdrop-blur-sm"
                  title="ヘルプページ"
                >
                  <HelpCircle className="w-5 h-5 text-foreground" />
                </Link>
                <ThemeToggle />
              </div>
              <NavigationMenu />
            </div>
          </div>
        </header>
      )}
      
      {children}
      
      <ToastContainer />
      <TutorialOverlay />
    </div>
  );
};