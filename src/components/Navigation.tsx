import React, { useState } from 'react';
import { Users, Calendar, BarChart3, Menu, X, ChevronRight, User, LogOut } from 'lucide-react';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import UserMenu from '@/components/UserMenu';
import { useAuth } from '@/hooks/useAuth';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mobile User Menu Component
  const MobileUserMenu = () => {
    const { user, signOut } = useAuth();

    const handleSignOut = async () => {
      await signOut();
      setIsMobileMenuOpen(false);
    };

    return (
      <div className="bg-white/10 rounded-xl p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">{user?.email?.split('@')[0]}</p>
              <p className="text-white/60 text-xs">Signed in</p>
            </div>
          </div>
          <Button
            onClick={handleSignOut}
            variant="ghost"
            size="sm"
            className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-3 py-1.5 text-sm transition-all duration-200"
          >
            <LogOut className="w-4 h-4 mr-1" />
            Sign Out
          </Button>
        </div>
      </div>
    );
  };

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
              <div className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl overflow-hidden shadow-lg">
                <img
                  src="/images/logo.png"
                  alt="Hud FC Manager Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="block">
                <h1 className="text-sm sm:text-lg lg:text-2xl font-bold text-on-dark font-poppins gradient-text-light">
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
                      no-focus-ring relative flex items-center space-x-3 px-6 py-4 rounded-xl transition-all duration-300 h-auto
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
                      no-focus-ring relative flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-2 md:py-3 rounded-xl transition-all duration-300 text-xs md:text-sm
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
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/5 to-purple-600/5"></div>
                    )}
                  </Button>
                );
              })}
            </div>

            {/* Desktop User Menu */}
            <div className="hidden sm:flex items-center flex-shrink-0">
              <UserMenu />
            </div>

            {/* Mobile Hamburger Menu Button - Enhanced */}
            <div className="sm:hidden flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`relative p-3 rounded-xl transition-all duration-300 border-2 ${
                  isMobileMenuOpen
                    ? 'bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/30 text-white'
                    : 'border-white/20 text-on-dark hover:text-white hover:bg-white/10 hover:border-white/30'
                }`}
              >
                <div className="relative w-6 h-6 flex items-center justify-center">
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6 animate-in spin-in-180 duration-300" />
                  ) : (
                    <Menu className="w-6 h-6 animate-in fade-in duration-300" />
                  )}
                </div>
                {/* Notification dot */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-primary to-secondary rounded-full border-2 border-gray-900"></div>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Dropdown - Clean & Solid */}
          {isMobileMenuOpen && (
            <div className="sm:hidden mt-4 animate-in slide-in-from-top-2 duration-300">
              <div className="bg-gray-900 rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-secondary p-4 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg overflow-hidden">
                        <img
                          src="/images/logo.png"
                          alt="Logo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white font-poppins">Menu</h2>
                        <p className="text-white/80 text-sm">Navigate your team</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setIsMobileMenuOpen(false)}
                      variant="ghost"
                      size="sm"
                      className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Navigation Items */}
                <div className="p-4 space-y-1">
                  {navItems.map((item, index) => {
                    const isActive = activeTab === item.id;

                    return (
                      <Button
                        key={item.id}
                        variant="ghost"
                        onClick={() => handleTabChange(item.id)}
                        className={`
                          no-focus-ring w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group h-auto
                          ${isActive
                            ? 'bg-primary text-white shadow-lg'
                            : 'text-white/80 hover:text-white hover:bg-white/10'
                          }
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                            isActive
                              ? 'bg-white/20'
                              : 'bg-white/10 group-hover:bg-white/20'
                          }`}>
                            {item.isCustom ? (
                              <Icon name={item.icon as any} size={20} className="w-5 h-5" />
                            ) : (
                              React.createElement(item.icon as any, { className: "w-5 h-5" })
                            )}
                          </div>
                          <div className="text-left">
                            <span className="font-semibold text-base block">{item.label}</span>
                            <span className="text-xs text-white/60">
                              {item.id === 'squad' && 'Manage players'}
                              {item.id === 'create-match' && 'Create matches'}
                              {item.id === 'tournaments' && 'Tournament system'}
                              {item.id === 'statistics' && 'View stats'}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${
                          isActive ? 'text-white' : 'text-white/40 group-hover:text-white/60'
                        }`} />
                      </Button>
                    );
                  })}
                </div>

                {/* User Profile Section */}
                <div className="p-4 border-t border-white/10 bg-gray-800">
                  <MobileUserMenu />
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
