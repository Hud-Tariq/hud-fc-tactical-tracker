import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const UserMenu = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center space-x-2 lg:space-x-3 text-on-dark-muted hover:text-white hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-600/20 border border-white/20 rounded-xl backdrop-blur px-3 lg:px-4 py-2 lg:py-3 h-auto transition-all duration-300"
        >
          <div className="w-6 h-6 lg:w-7 lg:h-7 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
            <User className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
          </div>
          <span className="hidden sm:inline text-sm lg:text-base font-medium">{user?.email?.split('@')[0]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-black/80 backdrop-blur-xl border-2 border-red-400/30 text-white rounded-xl min-w-48 p-2 shadow-2xl shadow-red-500/20"
      >
        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer hover:bg-gradient-to-r hover:from-red-500/30 hover:to-pink-500/30 text-white hover:text-red-100 rounded-lg px-3 py-3 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 border border-transparent hover:border-red-400/50"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
            <LogOut className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-white">Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
