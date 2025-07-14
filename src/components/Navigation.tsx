import React from 'react';
import { Users, Trophy, BarChart3, History, Eye, Menu, X } from 'lucide-react';
import { useState } from 'react';
import UserMenu from './UserMenu';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'squad', label: 'Squad', icon: Users },
    { id: 'create-match', label: 'Create Match', icon: Trophy },
    { id: 'view-matches', label: 'View Matches', icon: Eye },
    { id: 'statistics', label: 'Statistics', icon: BarChart3 },
    { id: 'simulation', label: 'Simulation', icon: History },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-card/80 backdrop-blur-md border-b border-border/50 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3 animate-fade-in">
            <div className="relative">
              <img 
                src="https://pps.whatsapp.net/v/t61.24694-24/473409892_1299041094506728_9189987459084226587_n.jpg?ccb=11-4&oh=01_Q5Aa1wFGe45tsx-rSrXCp9k21OuheDPRRdErSPAx3hEKsONRLw&oe=68725DEA&_nc_sid=5e03e0&_nc_cat=107"
                alt="HUD FC Logo"
                className="w-10 h-10 rounded-full object-cover border-2 border-primary/20 shadow-md hover-lift"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-card animate-pulse-glow"></div>
            </div>
            <div>
              <h1 className="text-title gradient-text">
                HUD FC
              </h1>
              <p className="text-xs text-muted-foreground font-medium">Tactical Manager</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex space-x-1 bg-muted/50 rounded-lg p-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 group ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground shadow-md scale-105'
                        : 'text-muted-foreground hover:text-foreground hover:bg-card hover:shadow-sm'
                    }`}
                  >
                    <Icon className={`w-4 h-4 transition-transform duration-200 ${
                      activeTab === tab.id ? 'scale-110' : 'group-hover:scale-105'
                    }`} />
                    <span className="hidden lg:block font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
            <UserMenu />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <UserMenu />
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden animate-slide-up">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card/95 backdrop-blur-sm border-t border-border/50">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onTabChange(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-3 w-full px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
