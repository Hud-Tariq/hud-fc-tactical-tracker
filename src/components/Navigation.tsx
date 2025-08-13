
import React from 'react';
import { Users, Calendar, BarChart3, Trophy, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserMenu from '@/components/UserMenu';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const navItems = [
    { id: 'squad', label: 'Squad', icon: Users },
    { id: 'create-match', label: 'Matches', icon: Zap },
    { id: 'tournaments', label: 'Tournaments', icon: Trophy },
    { id: 'statistics', label: 'Statistics', icon: BarChart3 },
  ];

  return (
    <nav className="sticky top-0 z-50 p-2 sm:p-3 md:p-4 lg:p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="glass-nav rounded-xl sm:rounded-2xl px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-5 lg:py-6">
          <div className="flex items-center justify-between gap-2 sm:gap-3 md:gap-4">
            
            {/* Logo Section - Fully Responsive */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              <div className="relative">
                <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl overflow-hidden shadow-lg">
                  <img
                    src="https://ibb.co/zHfV2CJk"
                    alt="Hud FC Manager Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -inset-1 rounded-lg sm:rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 opacity-30 blur animate-pulse"></div>
              </div>
              <div className="hidden xs:block">
                <h1 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-on-dark font-poppins leading-tight">
                  Hud FC Manager
                </h1>
                <p className="text-xs sm:text-xs md:text-sm lg:text-sm text-on-dark-subtle hidden sm:block">
                  Football Management System
                </p>
              </div>
            </div>

            {/* Navigation Items - Desktop (XL and up) */}
            <div className="hidden xl:flex items-center space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    size="lg"
                    onClick={() => onTabChange(item.id)}
                    className={`
                      relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 h-auto
                      ${isActive
                        ? 'bg-gradient-to-r from-pink-500/20 to-purple-600/20 text-on-dark border border-pink-400/30 shadow-lg'
                        : 'text-on-dark-muted hover:text-on-dark hover:bg-white/10'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{item.label}</span>
                    {isActive && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-600/10 animate-pulse"></div>
                    )}
                  </Button>
                );
              })}
            </div>

            {/* Navigation Items - Large Desktop (LG) */}
            <div className="hidden lg:flex xl:hidden items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => onTabChange(item.id)}
                    className={`
                      relative flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 text-sm
                      ${isActive
                        ? 'bg-gradient-to-r from-pink-500/20 to-purple-600/20 text-on-dark border border-pink-400/30 shadow-lg'
                        : 'text-on-dark-muted hover:text-on-dark hover:bg-white/10'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-500/10 to-purple-600/10 animate-pulse"></div>
                    )}
                  </Button>
                );
              })}
            </div>

            {/* Navigation Items - Tablet (MD) */}
            <div className="hidden md:flex lg:hidden items-center space-x-1">
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
                      relative flex flex-col items-center px-2 py-2 rounded-lg transition-all duration-300
                      ${isActive
                        ? 'bg-gradient-to-r from-pink-500/20 to-purple-600/20 text-on-dark border border-pink-400/30 shadow-lg'
                        : 'text-on-dark-muted hover:text-on-dark hover:bg-white/10'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span className="text-xs font-medium">{item.label}</span>
                    {isActive && (
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-500/10 to-purple-600/10 animate-pulse"></div>
                    )}
                  </Button>
                );
              })}
            </div>

            {/* Navigation Items - Small Tablet (SM) */}
            <div className="hidden sm:flex md:hidden items-center space-x-1 flex-1 justify-center max-w-sm">
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
                      relative p-2 rounded-lg transition-all duration-300 flex-1 max-w-14
                      ${isActive
                        ? 'bg-gradient-to-r from-pink-500/20 to-purple-600/20 text-on-dark border border-pink-400/30'
                        : 'text-on-dark-muted hover:text-on-dark hover:bg-white/10'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 mx-auto" />
                    {isActive && (
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-500/10 to-purple-600/10 animate-pulse"></div>
                    )}
                  </Button>
                );
              })}
            </div>

            {/* Navigation Items - Mobile (< SM) */}
            <div className="flex sm:hidden items-center space-x-0.5 flex-1 justify-center max-w-xs">
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
                      relative p-1.5 rounded-md transition-all duration-300 flex-1 max-w-12
                      ${isActive
                        ? 'bg-gradient-to-r from-pink-500/20 to-purple-600/20 text-on-dark border border-pink-400/30'
                        : 'text-on-dark-muted hover:text-on-dark hover:bg-white/10'
                      }
                    `}
                  >
                    <Icon className="w-3.5 h-3.5 mx-auto" />
                    {isActive && (
                      <div className="absolute inset-0 rounded-md bg-gradient-to-r from-pink-500/10 to-purple-600/10 animate-pulse"></div>
                    )}
                  </Button>
                );
              })}
            </div>

            {/* User Menu */}
            <div className="flex items-center flex-shrink-0">
              <UserMenu />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
