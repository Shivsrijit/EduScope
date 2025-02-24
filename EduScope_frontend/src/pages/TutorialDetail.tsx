
import { useState } from 'react';
import Navigation from '../components/Navigation';
import { ArrowLeft, BookOpen, Clock, Target, Trophy } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

const TutorialDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);

  // This would typically come from an API
  const tutorial = {
    id: parseInt(id || "1"),
    title: "Build Your First Robot",
    category: "Robotics",
    difficulty: "Beginner",
    description: "Learn the basics of robotics and create your first robot from scratch. This comprehensive tutorial will guide you through each step of the process.",
    duration: "2 hours",
    modules: [
      {
        id: 1,
        title: "Introduction to Robotics",
        duration: "20 mins",
        completed: true
      },
      {
        id: 2,
        title: "Basic Components",
        duration: "30 mins",
        completed: false
      },
      {
        id: 3,
        title: "Assembly Guide",
        duration: "40 mins",
        completed: false
      },
      {
        id: 4,
        title: "Programming Basics",
        duration: "30 mins",
        completed: false
      }
    ],
    requirements: [
      "Basic understanding of electronics",
      "Arduino board",
      "Basic tools set",
      "Computer with Arduino IDE"
    ]
  };

  const startModule = (moduleId: number) => {
    toast({
      title: "Module Started",
      description: "You've started a new module. Good luck!",
    });
    setProgress(prev => Math.min(prev + 25, 100));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black text-white">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24">
        <button 
          onClick={() => navigate('/tutorials')}
          className="flex items-center space-x-2 text-white/70 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Tutorials</span>
        </button>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white/5 rounded-lg p-6 backdrop-blur-lg">
              <h1 className="font-orbitron text-3xl md:text-4xl font-bold mb-4">{tutorial.title}</h1>
              <p className="text-white/70 mb-6">{tutorial.description}</p>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <span className="px-3 py-1 bg-purple-500/20 rounded-full text-sm">
                  {tutorial.category}
                </span>
                <span className="px-3 py-1 bg-purple-500/20 rounded-full text-sm">
                  {tutorial.difficulty}
                </span>
                <span className="px-3 py-1 bg-purple-500/20 rounded-full text-sm flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {tutorial.duration}
                </span>
              </div>

              <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm text-white/70">{progress}% Complete</span>
            </div>

            <div className="bg-white/5 rounded-lg p-6 backdrop-blur-lg">
              <h2 className="font-orbitron text-xl mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Requirements
              </h2>
              <ul className="list-disc list-inside space-y-2 text-white/70">
                {tutorial.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white/5 rounded-lg p-6 backdrop-blur-lg">
              <h2 className="font-orbitron text-xl mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Modules
              </h2>
              <div className="space-y-4">
                {tutorial.modules.map((module) => (
                  <div 
                    key={module.id}
                    className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-orbitron mb-1">{module.title}</h3>
                        <p className="text-sm text-white/70">{module.duration}</p>
                      </div>
                      <button
                        onClick={() => startModule(module.id)}
                        className={`px-4 py-2 rounded-lg font-montserrat transition-colors ${
                          module.completed 
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-purple-500/20 hover:bg-purple-500/30'
                        }`}
                      >
                        {module.completed ? 'Completed' : 'Start Module'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white/5 rounded-lg p-6 backdrop-blur-lg">
              <h2 className="font-orbitron text-xl mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Achievements
              </h2>
              <div className="space-y-4">
                <div className="p-3 bg-white/5 rounded-lg">
                  <h3 className="font-orbitron text-sm mb-1">Quick Learner</h3>
                  <p className="text-xs text-white/70">Complete a module in under 15 minutes</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <h3 className="font-orbitron text-sm mb-1">Perfect Score</h3>
                  <p className="text-xs text-white/70">Score 100% on module quiz</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TutorialDetail;
