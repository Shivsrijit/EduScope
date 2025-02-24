
import { useState } from 'react';
import Navigation from '../components/Navigation';
import { ArrowLeft, Play, CheckCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

const ModuleContent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [isCompleted, setIsCompleted] = useState(false);

  // This would typically come from an API
  const module = {
    id: parseInt(id || "1"),
    title: "Programming Basics",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual video
    duration: "30 mins",
    steps: [
      "Understanding basic programming concepts",
      "Setting up your development environment",
      "Writing your first program",
      "Testing and debugging basics"
    ]
  };

  const handleComplete = () => {
    setIsCompleted(true);
    toast({
      title: "Module Completed!",
      description: "Congratulations on completing this module!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black text-white">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24">
        <button 
          onClick={() => navigate('/tutorial/4')}
          className="flex items-center space-x-2 text-white/70 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Tutorial</span>
        </button>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white/5 rounded-lg p-6 backdrop-blur-lg">
              <h1 className="font-orbitron text-3xl font-bold mb-4">{module.title}</h1>
              <div className="aspect-w-16 aspect-h-9 mb-6">
                <iframe 
                  src={module.videoUrl}
                  className="w-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-6 backdrop-blur-lg">
              <h2 className="font-orbitron text-xl mb-4">Module Steps</h2>
              <div className="space-y-4">
                {module.steps.map((step, index) => (
                  <div 
                    key={index}
                    className="flex items-center space-x-3 bg-white/5 p-4 rounded-lg"
                  >
                    <span className="text-purple-400">{index + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleComplete}
                disabled={isCompleted}
                className={`w-full mt-8 py-3 rounded-lg font-montserrat shadow-lg transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-gradient-to-r from-purple-400 to-pink-400 hover:shadow-xl'
                }`}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle className="w-5 h-5 inline-block mr-2" />
                    Module Completed
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 inline-block mr-2" />
                    Complete Module
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 rounded-lg p-6 backdrop-blur-lg">
              <h2 className="font-orbitron text-xl mb-4">Module Info</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Duration:</span>
                  <span>{module.duration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Status:</span>
                  <span className={isCompleted ? 'text-green-300' : 'text-yellow-300'}>
                    {isCompleted ? 'Completed' : 'In Progress'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ModuleContent;

