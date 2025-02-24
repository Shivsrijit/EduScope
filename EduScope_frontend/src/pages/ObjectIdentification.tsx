import { useState, useRef, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { Camera, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ObjectIdentification = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const { toast } = useToast();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsStreaming(true);
          togglePopup();
        };
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

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  const togglePopup = () => {
    setIsPopupOpen(prev => !prev);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black text-white">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24">
        <h1 className="font-orbitron text-3xl md:text-4xl font-bold mb-8 animate-slideDown">
          Object Identification
        </h1>

        <div className="max-w-2xl mx-auto">
          {isStreaming ? (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full rounded-lg"
              />
              <button
                onClick={stopCamera}
                className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          ) : (
            <div className="text-center">
              <button
                onClick={startCamera}
                className="px-8 py-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg font-montserrat shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Camera className="w-6 h-6 inline-block mr-2" />
                Start Camera
              </button>
              <p className="mt-4 text-white/70">
                Please allow camera access when prompted
              </p>
            </div>
          )}

          {isPopupOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="relative bg-white p-4 rounded-lg">
                <h2 className="font-bold">Scan Object</h2>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full rounded-lg"
                />
                <div className="absolute inset-0 border-2 border-dashed border-blue-500 pointer-events-none">
                  <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-green-500"></div>
                </div>
                <button onClick={togglePopup} className="mt-2 bg-blue-500 text-white rounded px-4 py-2">
                  Close
                </button>
              </div>
            </div>
          )}

          <p className="mt-6 text-center font-montserrat text-white/70">
            Point your camera at an object to identify it. Make sure the object is well-lit and centered in the frame.
          </p>
        </div>
      </main>
    </div>
  );
};

export default ObjectIdentification;
