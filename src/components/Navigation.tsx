import React, { useState } from 'react';
import { Users, Calendar, BarChart3, Menu, X } from 'lucide-react';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import UserMenu from '@/components/UserMenu';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'squad', label: 'Squad', icon: 'squad', isCustom: true },
    { id: 'create-match', label: 'Matches', icon: 'lightning-forward', isCustom: true },
    { id: 'tournaments', label: 'Tournaments', icon: 'trophy', isCustom: true },
    { id: 'statistics', label: 'Statistics', icon: 'statistics', isCustom: true },
  ];

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 p-2 sm:p-4 lg:p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="glass-nav rounded-2xl px-3 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
          <div className="flex items-center justify-between">
            {/* Logo Section - Responsive */}
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 flex-shrink-0">
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl overflow-hidden shadow-lg">
                  <img
                    src="/src/assets/images/logo.png"
                    alt="Hud FC Manager Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 opacity-30 blur animate-pulse"></div>
              </div>
              <div className="hidden xs:block">
                <h1 className="text-sm sm:text-lg lg:text-2xl font-bold text-on-dark font-poppins">
                  Hud FC Manager
                </h1>
                <p className="text-xs lg:text-sm text-on-dark-subtle hidden sm:block">Football Management System</p>
              </div>
            </div>

            {/* Navigation Items - Desktop */}
            <div className="hidden lg:flex items-center space-x-4">
              {navItems.map((item, index) => {
                const isActive = activeTab === item.id;

                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    size="lg"
                    onClick={() => onTabChange(item.id)}
                    className={`
                      relative flex items-center space-x-3 px-6 py-4 rounded-xl transition-all duration-300 h-auto focus:outline-none focus:ring-0
                      ${isActive
                        ? 'bg-gradient-to-r from-pink-500/20 to-purple-600/20 text-on-dark border border-pink-400/30 shadow-lg'
                        : 'text-on-dark-muted hover:text-on-dark hover:bg-white/10'
                      }
                    `}
                  >
                    {item.isCustom ? (
                      <Icon name={item.icon as any} size={20} className="w-5 h-5" />
                    ) : (
                      React.createElement(item.icon as any, { className: "w-5 h-5" })
                    )}
                    <span className="font-medium text-base">{item.label}</span>

                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/5 to-purple-600/5"></div>
                    )}
                  </Button>
                );
              })}
            </div>

            {/* Navigation Items - Tablet & Small Desktop */}
            <div className="hidden sm:flex lg:hidden items-center space-x-1 md:space-x-2">
              {navItems.map((item, index) => {
                const isActive = activeTab === item.id;

                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => onTabChange(item.id)}
                    className={`
                      relative flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-2 md:py-3 rounded-xl transition-all duration-300 text-xs md:text-sm
                      ${isActive
                        ? 'bg-gradient-to-r from-pink-500/20 to-purple-600/20 text-on-dark border border-pink-400/30 shadow-lg'
                        : 'text-on-dark-muted hover:text-on-dark hover:bg-white/10'
                      }
                    `}
                  >
                    {item.isCustom ? (
                      <Icon name={item.icon as any} size={16} className="w-4 h-4" />
                    ) : (
                      React.createElement(item.icon as any, { className: "w-4 h-4" })
                    )}
                    <span className="font-medium hidden md:inline">{item.label}</span>

                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-600/10 animate-pulse"></div>
                    )}
                  </Button>
                );
              })}
            </div>

            {/* Desktop User Menu */}
            <div className="hidden sm:flex items-center flex-shrink-0">
              <UserMenu />
            </div>

            {/* Mobile Hamburger Menu Button - Top Right */}
            <div className="sm:hidden flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-on-dark hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="sm:hidden mt-4 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-2xl">
              <div className="space-y-4">
                {/* Navigation Items */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-on-dark-muted uppercase tracking-wide mb-3">Navigation</h3>
                  {navItems.map((item) => {
                    const isActive = activeTab === item.id;

                    return (
                      <Button
                        key={item.id}
                        variant="ghost"
                        onClick={() => handleTabChange(item.id)}
                        className={`
                          w-full flex items-center justify-start space-x-3 px-4 py-4 rounded-xl transition-all duration-300
                          ${isActive
                            ? 'bg-gradient-to-r from-pink-500/20 to-purple-600/20 text-on-dark border border-pink-400/30'
                            : 'text-on-dark-muted hover:text-on-dark hover:bg-white/10'
                          }
                        `}
                      >
                        {item.isCustom ? (
                          <Icon name={item.icon as any} size={20} className="w-5 h-5" />
                        ) : (
                          React.createElement(item.icon as any, { className: "w-5 h-5" })
                        )}
                        <span className="font-medium text-base">{item.label}</span>
                      </Button>
                    );
                  })}
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 my-4"></div>

                {/* Profile Section */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-on-dark-muted uppercase tracking-wide mb-3">Account</h3>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <UserMenu />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
