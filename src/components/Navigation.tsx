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
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="bg-[var(--gradient-primary)] p-2 rounded-lg shadow-md">
              <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                <span className="text-primary font-bold text-sm">⚽</span>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-[var(--gradient-primary)] bg-clip-text text-transparent">
                FUTBALMANIA
              </h1>
              <p className="text-xs text-muted-foreground">Football Management System</p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center space-x-2 transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-[var(--gradient-primary)] text-white shadow-md'
                      : 'hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              );
            })}
          </div>

          <UserMenu />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
