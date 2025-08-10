import React from 'react';
import { Users, Calendar, BarChart3, Trophy, LogOut } from 'lucide-react';
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
    <nav className="sticky top-0 z-50 p-4 lg:p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="glass-nav rounded-2xl px-4 lg:px-8 py-4 lg:py-6">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="relative">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg lg:text-xl">⚽</span>
                </div>
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 opacity-30 blur animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-lg lg:text-2xl font-bold text-on-dark font-poppins">
                  Hud FC Manager
                </h1>
                <p className="text-xs lg:text-sm text-on-dark-subtle">Football Management System</p>
              </div>
            </div>

            {/* Navigation Items - Desktop */}
            <div className="hidden lg:flex items-center space-x-4">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    size="lg"
                    onClick={() => onTabChange(item.id)}
                    className={`
                      relative flex items-center space-x-3 px-6 py-4 rounded-xl transition-all duration-300 h-auto
                      ${isActive
                        ? 'bg-gradient-to-r from-pink-500/20 to-purple-600/20 text-on-dark border border-pink-400/30 shadow-lg'
                        : 'text-on-dark-muted hover:text-on-dark hover:bg-white/10'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium text-base">{item.label}</span>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-600/10 animate-pulse"></div>
                    )}
                  </Button>
                );
              })}
            </div>

            {/* Navigation Items - Tablet */}
            <div className="hidden md:flex lg:hidden items-center space-x-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => onTabChange(item.id)}
                    className={`
                      relative flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300
                      ${isActive
                        ? 'bg-gradient-to-r from-pink-500/20 to-purple-600/20 text-on-dark border border-pink-400/30 shadow-lg'
                        : 'text-on-dark-muted hover:text-on-dark hover:bg-white/10'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{item.label}</span>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-600/10 animate-pulse"></div>
                    )}
                  </Button>
                );
              })}
            </div>

            {/* Mobile Navigation Menu */}
            <div className="md:hidden flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => onTabChange(item.id)}
                    className={`
                      relative p-2 rounded-lg transition-all duration-300
                      ${isActive
                        ? 'bg-gradient-to-r from-pink-500/20 to-purple-600/20 text-on-dark border border-pink-400/30'
                        : 'text-on-dark-muted hover:text-on-dark hover:bg-white/10'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {isActive && (
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-500/10 to-purple-600/10 animate-pulse"></div>
                    )}
                  </Button>
                );
              })}
            </div>

            {/* User Menu */}
            <div className="flex items-center">
              <UserMenu />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
