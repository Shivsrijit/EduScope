
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Github } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Authentication logic will be added later
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black/20 border border-white/10 backdrop-blur-xl">
        <div className="p-6">
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 p-0.5">
              <div className="w-full h-full rounded-full bg-black/50 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login" className="font-montserrat">Login</TabsTrigger>
              <TabsTrigger value="signup" className="font-montserrat">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-white/50" />
                    <Input
                      type="email"
                      placeholder="Email"
                      className="pl-10 bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-white/50" />
                    <Input
                      type="password"
                      placeholder="Password"
                      className="pl-10 bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2 text-white/70">
                    <input type="checkbox" className="rounded border-white/20 bg-white/5" />
                    <span>Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-purple-400 hover:text-purple-300">
                    Forgot password?
                  </Link>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white font-montserrat"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-white/50" />
                  <Input
                    type="text"
                    placeholder="Full Name"
                    className="pl-10 bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-white/50" />
                  <Input
                    type="email"
                    placeholder="Email"
                    className="pl-10 bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-white/50" />
                  <Input
                    type="password"
                    placeholder="Password"
                    className="pl-10 bg-white/5 border-white/10 text-white"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white font-montserrat"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black/20 text-white/70">Or continue with</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full mt-4 bg-white/5 border-white/10 text-white hover:bg-white/10"
            >
              <Github className="mr-2 h-4 w-4" />
              Github
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};


export default Auth;

