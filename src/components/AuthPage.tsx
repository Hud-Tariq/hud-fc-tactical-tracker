import React, { useState } from 'react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "Check your email for verification link",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Redirect will happen automatically via auth state change
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Muse gradient background - deep purple to muted pink */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0b2e] via-[#2d1b69] to-[#7a4f8a]"></div>

      {/* Centered login container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-in">
          {/* Form container with translucent dark panel */}
          <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10">

            {/* Welcome Back heading */}
            <div className="text-center mb-8">
              <h1 className="text-[32px] font-bold text-white/95 font-poppins tracking-tight">
                Welcome Back
              </h1>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSignIn} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <Input
                  id="signin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full h-12 bg-transparent border border-pink-300/40 rounded-lg px-4 text-white placeholder:text-white/60 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all duration-200 font-poppins"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Input
                  id="signin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-12 bg-transparent border border-pink-300/40 rounded-lg px-4 text-white placeholder:text-white/60 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all duration-200 font-poppins"
                  required
                />
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-[1.02] transform shadow-lg font-poppins"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Forgot Password Link */}
            <div className="text-center mt-6">
              <button className="text-pink-300/80 hover:text-pink-200 text-sm font-poppins transition-colors duration-200">
                Forgot Password?
              </button>
            </div>

            {/* Sign Up Option */}
            <div className="text-center mt-8 pt-6 border-t border-white/10">
              <p className="text-white/60 text-sm font-poppins mb-2">
                Don't have an account?
              </p>
              <Button
                onClick={() => setEmail('')}
                variant="ghost"
                className="text-pink-300 hover:text-pink-200 hover:bg-pink-500/10 font-poppins transition-all duration-200"
              >
                Create Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
