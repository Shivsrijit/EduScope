import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Scan, Box, Lightbulb, Trophy, User, Mail, Lock, Github } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CameraPopup from '../components/CameraPopup';

const Index = () => {
  const [isHovered, setIsHovered] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const features = [
    {
      id: 'identify',
      title: 'Identify Objects',
      icon: Box,
      path: '/object-identification',
      description: 'Scan and learn about objects around you',
      animation: 'animate-slideRight'
    },
    {
      id: 'explore',
      title: 'Explore DIY Ideas',
      icon: Lightbulb,
      path: '/diy-projects',
      description: 'Discover exciting DIY projects',
      animation: 'animate-scale'
    },
    {
      id: 'leaderboard',
      title: 'View Leaderboard',
      icon: Trophy,
      path: '/leaderboard',
      description: 'See top creators and innovators',
      animation: 'animate-slideLeft'
    }
  ];

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions and try again.",
        variant: "destructive"
      });
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageDataURL = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageDataURL);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setShowCamera(false);
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleOpenCamera = () => {
    setIsCameraOpen(true);
  };

  const handleCloseCamera = () => {
    setIsCameraOpen(false);
  };

  const handleCapture = (imageData: string) => {
    console.log("Captured image data:", imageData);
    setCapturedImage(imageData);
    handleCloseCamera();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black text-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-orbitron text-4xl md:text-6xl font-bold mb-6 animate-slideDown">
            Welcome to Futuristic GenZ
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Innovate, Create, Learn
            </span>
          </h1>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
            {!showAuth && (
              <Button
                onClick={() => setShowAuth(true)}
                className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white font-montserrat"
              >
                Get Started
              </Button>
            )}
            
            {/* Auth Card */}
            {showAuth && (
              <Card className="w-full max-w-md bg-black/20 border border-white/10 backdrop-blur-xl">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-8">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 p-0.5">
                      <div className="w-full h-full rounded-full bg-black/50 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => setShowAuth(false)}
                      className="text-white/70 hover:text-white"
                    >
                      Close
                    </Button>
                  </div>

                  <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                      <TabsTrigger value="login" className="font-montserrat">Login</TabsTrigger>
                      <TabsTrigger value="signup" className="font-montserrat">Sign Up</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                      <form onSubmit={handleAuthSubmit} className="space-y-4">
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
                      <form onSubmit={handleAuthSubmit} className="space-y-4">
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
            )}
          </div>
          
          {/* Camera Section */}
          <div className="relative mt-8">
            <button
              onClick={handleOpenCamera}
              className="group relative px-8 py-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-lg transition-all duration-300 hover:bg-white/20 animate-float"
              onMouseEnter={() => setIsHovered('scan')}
              onMouseLeave={() => setIsHovered('')}
            >
              <div className="flex items-center space-x-3">
                <Scan className="w-6 h-6" />
                <span className="font-montserrat text-lg">Scan an Object</span>
              </div>
              <div
                className={`absolute inset-0 rounded-xl bg-purple-500/20 transition-opacity duration-300 ${
                  isHovered === 'scan' ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Link
              key={feature.id}
              to={feature.path}
              className={group relative p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-lg transition-all duration-300 hover:bg-white/10 ${feature.animation}}
              onMouseEnter={() => setIsHovered(feature.id)}
              onMouseLeave={() => setIsHovered('')}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <feature.icon className="w-8 h-8" />
                <h3 className="font-orbitron text-xl font-semibold">{feature.title}</h3>
                <p className="font-montserrat text-white/70">{feature.description}</p>
              </div>
              <div
                className={`absolute inset-0 rounded-xl bg-purple-500/20 transition-opacity duration-300 ${
                  isHovered === feature.id ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-6 mb-4 md:mb-0">
            <Link to="/help" className="font-montserrat text-white/70 hover:text-white transition-colors">Help</Link>
            <Link to="/support" className="font-montserrat text-white/70 hover:text-white transition-colors">Support</Link>
            <Link to="/feedback" className="font-montserrat text-white/70 hover:text-white transition-colors">Feedback</Link>
          </div>
          <p className="font-montserrat text-white/50">© 2024 Futuristic GenZ. All rights reserved.</p>
        </div>
      </footer>

      {/* Camera Popup */}
      <CameraPopup 
        isOpen={isCameraOpen} 
        onClose={handleCloseCamera} 
        onCapture={handleCapture} 
      />
    </div>
  );
};

export default Index;
