import React from 'react';
import { Users, Calendar, BarChart3, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserMenu from '@/components/UserMenu';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const navItems = [
    { id: 'squad', label: 'Squad', icon: Users },
    { id: 'create-match', label: 'Matches', icon: Calendar },
    { id: 'tournaments', label: 'Tournaments', icon: Trophy },
    { id: 'statistics', label: 'Statistics', icon: BarChart3 },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center space-x-2">
            <div className="bg-[var(--gradient-primary)] p-1.5 sm:p-2 rounded-lg shadow-md">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-sm flex items-center justify-center">
                <span className="text-primary font-bold text-xs sm:text-sm">⚽</span>
              </div>
            </div>
            <div className="hidden xs:block">
              <h1 className="text-lg sm:text-xl font-bold bg-[var(--gradient-primary)] bg-clip-text text-transparent">
                Hud FC Manager
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Football Management System</p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center space-x-1 sm:space-x-2 transition-all duration-200 relative px-2 sm:px-3 py-1.5 sm:py-2 ${
                    activeTab === item.id
                      ? 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90'
                      : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs sm:text-sm">{item.label}</span>
                </Button>
              );
            })}
          </div>

          <div className="ml-2">
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
