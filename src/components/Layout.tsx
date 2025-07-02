import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { NavigationMenu } from '@/components/NavigationMenu';
import { ToastContainer } from '@/components/ToastContainer';
import { TutorialOverlay } from '@/components/tutorial/TutorialOverlay';

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
}

export const Layout = ({ children, showHeader = true }: LayoutProps) => {

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      {showHeader && (
        <header className="border-b border-border bg-background flex-shrink-0">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center relative">
              <Link
                to="/"
                className="p-2 rounded-lg bg-background/50 border-none hover:bg-muted/50 transition-colors backdrop-blur-sm"
                title="ホームページ"
              >
                <Home className="w-5 h-5 text-foreground" />
              </Link>
              <div className="relative">
                <NavigationMenu />
              </div>
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