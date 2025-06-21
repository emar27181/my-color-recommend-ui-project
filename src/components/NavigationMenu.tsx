import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

interface NavigationMenuProps {
  className?: string;
}

export const NavigationMenu = ({ className = '' }: NavigationMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { label: 'ホーム', href: '/', isActive: true },
    { label: 'ダミーページ1', href: '/page1' },
    { label: 'ダミーページ2', href: '/page2' },
    { label: 'ダミーページ3', href: '/page3' },
    { label: 'ヘルプ', href: '/help' },
  ];

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
          <div className="absolute top-12 left-0 z-50 min-w-48 bg-background border border-border rounded-lg shadow-lg overflow-hidden">
            <nav className="py-2">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className={`block px-4 py-3 text-sm transition-colors hover:bg-muted ${item.isActive
                      ? 'text-primary font-medium bg-primary/10'
                      : 'text-foreground'
                    }`}
                  onClick={toggleMenu}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </div>
  );
};