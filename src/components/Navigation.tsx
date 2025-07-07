
import React from 'react';
import { Users, Calendar, BarChart, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const tabs = [
    { id: 'squad', label: 'Squad', icon: Users },
    { id: 'matches', label: 'Matches', icon: Calendar },
    { id: 'stats', label: 'Statistics', icon: BarChart },
    { id: 'history', label: 'History', icon: Trophy }
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-16">
          <div className="flex items-center space-x-3 mr-8">
            <img 
              src="/lovable-uploads/8a2c4cdf-03e5-4be7-8042-dab0c10d3f49.png" 
              alt="Hud FC Logo" 
              className="w-10 h-10"
            />
            <span className="text-white font-bold text-xl">Hud FC</span>
          </div>
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    activeTab === tab.id
                      ? "bg-teal-600 text-white"
                      : "text-slate-300 hover:text-white hover:bg-slate-700"
                  )}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
