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
      {/* Background with FUTBALMANIA gradient */}
      <div className="absolute inset-0 bg-[var(--gradient-hero)]"></div>

      {/* Geometric shapes background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/20 rotate-45 rounded-xl"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-secondary/20 rotate-12 rounded-lg"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-accent/30 -rotate-12 rounded-lg"></div>
      </div>

      {/* Player silhouette */}
      <div className="absolute right-0 top-0 h-full w-1/2 hidden lg:block">
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2Fe00e12e7935d4ce5a38c8aa2b83fb3d6%2Ff3cc9f4cf28148f0acdcfa9943565c8e?format=webp&width=800"
          alt="Football Player"
          className="h-full w-full object-cover object-left opacity-90"
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-start p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
          {/* FUTBALMANIA Branding */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2 tracking-tight">
              HUD FC MANAGER
            </h1>
            <h2 className="text-lg sm:text-xl lg:text-2xl text-white/90 font-medium mb-3 sm:mb-4">
              ONLINE MEMBER LOGIN
            </h2>
            <h3 className="text-base sm:text-lg text-white/80 font-medium">
              FOR PLAYERS
            </h3>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-md border border-white/20">
                <TabsTrigger value="signin" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-6 mt-6">
                <form onSubmit={handleSignIn} className="space-y-6">
                  <div>
                    <Label htmlFor="signin-email" className="text-white/90 text-sm uppercase tracking-wide">
                      NAME
                    </Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/60 h-12"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signin-password" className="text-white/90 text-sm uppercase tracking-wide">
                      PASSWORD
                    </Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/60 h-12"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 bg-white/20 hover:bg-white/30 text-white font-semibold uppercase tracking-wide backdrop-blur-md border border-white/30 transition-all duration-200"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        SUBMITTING...
                      </>
                    ) : (
                      'SUBMIT'
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <p className="text-white/60 text-sm">Forgot password?</p>
                  <p className="text-white/80 text-sm mt-4">
                    Play and win exciting prizes and incredible fight!
                  </p>
                  <p className="text-accent text-sm font-semibold">Register here!</p>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-6 mt-6">
                <form onSubmit={handleSignUp} className="space-y-6">
                  <div>
                    <Label htmlFor="signup-email" className="text-white/90 text-sm uppercase tracking-wide">
                      EMAIL
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/60 h-12"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-password" className="text-white/90 text-sm uppercase tracking-wide">
                      PASSWORD
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      className="bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/60 h-12"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 bg-white/20 hover:bg-white/30 text-white font-semibold uppercase tracking-wide backdrop-blur-md border border-white/30 transition-all duration-200"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        CREATING ACCOUNT...
                      </>
                    ) : (
                      'CREATE ACCOUNT'
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <p className="text-white/80 text-sm">
                    Join FUTBALMANIA and compete with players worldwide!
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
