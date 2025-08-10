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
          size="sm" 
          className="flex items-center space-x-2 text-on-dark-muted hover:text-on-dark hover:bg-white/10 border border-white/20 rounded-xl backdrop-blur"
        >
          <User className="w-4 h-4" />
          <span className="hidden sm:inline text-sm">{user?.email?.split('@')[0]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="glass-card-strong border-white/20 text-on-dark rounded-xl"
      >
        <DropdownMenuItem 
          onClick={handleSignOut} 
          className="cursor-pointer hover:bg-white/10 text-on-dark-muted hover:text-on-dark rounded-lg"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
