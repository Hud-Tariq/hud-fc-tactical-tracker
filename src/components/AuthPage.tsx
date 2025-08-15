import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, Eye, EyeOff, Star } from 'lucide-react';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      {/* Dynamic gradient background with animated layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-800"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/50 via-transparent to-violet-600/30 animate-pulse"></div>

      {/* Floating orbs for depth */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-violet-600/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-indigo-600/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }}></div>

      {/* Main content container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Floating welcome text with stars */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Star className="w-6 h-6 text-yellow-400 animate-pulse" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent font-poppins tracking-tight">
                Welcome
              </h1>
              <Star className="w-6 h-6 text-yellow-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
            <p className="text-white/70 text-lg font-light tracking-wide">
              Step into excellence
            </p>
          </div>

          {/* Glass morphism form container */}
          <div className="relative group animate-scale-in">
            {/* Glowing border effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-3xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-pulse-glow"></div>

            {/* Main form container */}
            <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl border border-white/20">

              {/* Login Form */}
              <form onSubmit={handleSignIn} className="space-y-8">
                {/* Email Input with icon */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-blue-300/70 group-focus-within:text-blue-300 transition-colors" />
                  </div>
                  <Input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full h-14 bg-white/5 backdrop-blur-sm border-2 border-white/20 rounded-2xl pl-12 pr-4 text-white placeholder:text-white/50 focus:border-blue-400/50 focus:ring-4 focus:ring-blue-400/20 transition-all duration-300 font-poppins text-lg hover:bg-white/10"
                    required
                  />
                </div>

                {/* Password Input with icon and toggle */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-purple-300/70 group-focus-within:text-purple-300 transition-colors" />
                  </div>
                  <Input
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-14 bg-white/5 backdrop-blur-sm border-2 border-white/20 rounded-2xl pl-12 pr-12 text-white placeholder:text-white/50 focus:border-purple-400/50 focus:ring-4 focus:ring-purple-400/20 transition-all duration-300 font-poppins text-lg hover:bg-white/10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/60 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                {/* Login Button with enhanced styling */}
                <Button
                  type="submit"
                  className="w-full h-14 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-700 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-600 text-white font-semibold text-lg rounded-2xl transition-all duration-300 hover:scale-[1.03] transform shadow-2xl shadow-blue-500/25 hover:shadow-blue-400/40 font-poppins tracking-wide relative overflow-hidden group"
                  disabled={loading}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {loading ? (
                    <>
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              {/* Forgot Password Link */}
              <div className="text-center mt-8">
                <button className="text-blue-300/80 hover:text-blue-200 text-sm font-poppins transition-all duration-300 hover:scale-105 underline decoration-dotted underline-offset-4">
                  Forgot Password?
                </button>
              </div>

              {/* Elegant divider */}
              <div className="flex items-center my-10">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                <span className="px-4 text-white/50 text-sm font-light">or</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              </div>

              {/* Sign Up Option with enhanced styling */}
              <div className="text-center space-y-4">
                <p className="text-white/70 text-base font-light tracking-wide">
                  New to our platform?
                </p>
                <Button
                  onClick={() => setEmail('')}
                  variant="ghost"
                  className="text-purple-300 hover:text-purple-200 hover:bg-purple-500/20 font-poppins transition-all duration-300 text-lg px-8 py-3 rounded-2xl border border-purple-400/30 hover:border-purple-300/50 hover:scale-105 tracking-wide"
                >
                  Create Account
                </Button>
              </div>
            </div>
          </div>

          {/* Subtle bottom text */}
          <div className="text-center mt-8 opacity-60">
            <p className="text-white/40 text-sm font-light">
              Secure • Fast • Reliable
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
