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
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 flex items-stretch sm:items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-md my-auto">
        {/* Main card with diagonal cut - Enhanced for mobile */}
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[90vh] sm:min-h-0 flex flex-col">
          {/* Diagonal purple section - Responsive */}
          <div className="absolute top-0 right-0 w-24 sm:w-32 h-full bg-gradient-to-bl from-purple-500 to-purple-600 transform skew-x-12 origin-top-right translate-x-3 sm:translate-x-4"></div>

          {/* Content - Enhanced vertical layout */}
          <div className="relative z-10 p-8 sm:p-12 flex-1 flex flex-col justify-center">
            {/* Welcome Section */}
            <div className="text-center mb-12">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center shadow-lg">
                <Lock className="w-10 h-10 text-purple-600" />
              </div>
              <h1 className="text-4xl sm:text-3xl font-bold text-gray-800 mb-3">Welcome Back</h1>
              <p className="text-gray-500 text-lg">Sign in to continue</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSignIn} className="space-y-8">
              {/* Email Input */}
              <div className="relative">
                <Label htmlFor="signin-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full h-14 pl-12 pr-4 border-2 border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 transition-all duration-300 text-lg"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="relative">
                <Label htmlFor="signin-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-14 pl-12 pr-12 border-2 border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 transition-all duration-300 text-lg"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                  <span className="ml-2 text-gray-600">Remember me</span>
                </label>
                <button type="button" className="text-purple-600 hover:text-purple-700 font-medium">
                  Forgot password?
                </button>
              </div>

              {/* Login Button - Enhanced */}
              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold text-lg rounded-xl transition-all duration-300 hover:scale-[1.02] transform shadow-lg shadow-purple-500/25 flex items-center justify-center group"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Signing you in...
                  </>
                ) : (
                  <>
                    Sign In
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </Button>
            </form>

            {/* Sign Up Section */}
            <div className="text-center mt-10 pt-8 border-t border-gray-200">
              <p className="text-gray-600 mb-4">Don't have an account?</p>
              <Button
                onClick={() => setEmail('')}
                variant="outline"
                className="w-full h-12 border-2 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 font-medium rounded-xl transition-all duration-300"
              >
                Create Account
              </Button>
            </div>
          </div>

          {/* Decorative elements in purple area */}
          <div className="absolute bottom-8 right-8 text-white text-xs opacity-60">
            <div className="flex space-x-2">
              <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                <Lock className="w-3 h-3" />
              </div>
              <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                <Star className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
