
import { useState } from 'react';
import Navigation from '../components/Navigation';
import { Wrench, Star, Clock, Trophy } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface Project {
  id: number;
  title: string;
  difficulty: string;
  duration: string;
  materials: string[];
  steps: string[];
  rating: number;
  description: string;
  image: string;
  points: number;
  completionTime?: number;
  matchingPercent?: number;
}

const DiyProjects = () => {
  const { toast } = useToast();
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [projects] = useState<Project[]>([
    {
      id: 1,
      title: "Smart Home Assistant",
      difficulty: "Intermediate",
      duration: "2-3 hours",
      materials: ["Raspberry Pi", "Sensors", "LED lights", "Jumper wires", "Breadboard"],
      steps: [
        "Set up Raspberry Pi with Raspbian OS - Install the latest version of Raspbian OS on your Raspberry Pi using the Raspberry Pi Imager",
        "Connect LED lights to GPIO pins - Carefully wire the LED lights to specific GPIO pins (e.g., GPIO18, GPIO23, GPIO24) using the jumper wires",
        "Install required libraries - Run 'pip install RPi.GPIO gpiozero python-vlc' to install necessary Python libraries",
        "Program voice recognition - Implement speech recognition using the SpeechRecognition library",
        "Test and calibrate sensors - Verify sensor readings and adjust sensitivity as needed"
      ],
      rating: 4.8,
      description: "Build your own smart home assistant that can control lights and monitor room conditions.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      points: 100
    },
    {
      id: 2,
      title: "Mini Robot",
      difficulty: "Beginner",
      duration: "1-2 hours",
      materials: ["Arduino Nano", "DC Motors", "Battery pack", "Wheels", "Chassis"],
      steps: [
        "Assemble the chassis - Connect the base plate and motor mounts according to the diagram",
        "Connect motors to motor driver - Wire the DC motors to the L298N motor driver module",
        "Wire up the Arduino - Connect the motor driver to Arduino pins 5,6,9,10",
        "Upload movement code - Flash the provided Arduino sketch for basic movement control",
        "Test basic movements - Verify forward, backward, and turning functionality"
      ],
      rating: 4.5,
      description: "Create a simple robot that can move around and avoid obstacles.",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
      points: 75
    },
    {
      id: 3,
      title: "AI Plant Monitor",
      difficulty: "Advanced",
      duration: "4-5 hours",
      materials: ["ESP32", "Moisture sensor", "OLED Display", "Temperature sensor", "Solar panel"],
      steps: [
        "Set up ESP32 development environment - Install Arduino IDE and ESP32 board support",
        "Connect sensors to board - Wire the moisture and temperature sensors to appropriate GPIO pins",
        "Program monitoring logic - Implement sensor reading and data processing algorithms",
        "Set up WiFi connectivity - Configure ESP32 to connect to local network and send data",
        "Create mobile app interface - Develop a simple app to display plant monitoring data"
      ],
      rating: 4.9,
      description: "Build an intelligent plant monitoring system that tracks moisture, light, and temperature.",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      points: 150
    }
  ]);

  const [userPoints, setUserPoints] = useState(0);

  const handleStartProject = (projectId: number) => {
    setSelectedProject(projectId);
    const project = projects.find(p => p.id === projectId);
    const startTime = Date.now();
    
    toast({
      title: `Starting ${project?.title}`,
      description: "Project guide has been loaded. Gather your materials to begin!",
    });

    // Store start time in localStorage
    localStorage.setItem(`project_${projectId}_start`, startTime.toString());
  };

  const handleCompleteProject = (projectId: number, matchingPercent: number) => {
    const project = projects.find(p => p.id === projectId);
    const startTime = parseInt(localStorage.getItem(`project_${projectId}_start`) || '0');
    const completionTime = (Date.now() - startTime) / 1000; // Convert to seconds
    
    // Calculate points based on completion time and matching percentage
    const timeBonus = Math.max(0, project!.points * (1 - completionTime / 7200)); // 2 hours baseline
    const matchingBonus = project!.points * (matchingPercent / 100);
    const totalPoints = Math.round(timeBonus + matchingBonus);
    
    setUserPoints(prev => prev + totalPoints);
    
    toast({
      title: "Project Completed! 🎉",
      description: `You earned ${totalPoints} points! Time: ${Math.round(completionTime)}s, Matching: ${matchingPercent}%`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black text-white">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-orbitron text-3xl md:text-4xl font-bold animate-slideDown">
            Explore DIY Ideas
          </h1>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
            <Trophy className="text-yellow-400" />
            <span className="font-montserrat">{userPoints} Points</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`group bg-white/5 rounded-lg p-6 backdrop-blur-lg hover:bg-white/10 transition-all duration-300 animate-scale ${
                selectedProject === project.id ? 'ring-2 ring-purple-400' : ''
              }`}
            >
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <Wrench className="w-8 h-8 mb-4 text-purple-400" />
              <h3 className="font-orbitron text-xl mb-2">{project.title}</h3>
              
              <p className="font-montserrat text-white/70 mb-4">
                {project.description}
              </p>

              <div className="flex items-center space-x-2 mb-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="font-montserrat text-white/70">{project.rating}</span>
              </div>
              
              <div className="flex items-center space-x-2 mb-4">
                <Clock className="w-4 h-4 text-purple-400" />
                <span className="font-montserrat text-white/70">{project.duration}</span>
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="font-montserrat text-white/70">{project.points} Points</span>
              </div>

              <div className="mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-montserrat ${
                  project.difficulty === 'Beginner' ? 'bg-green-500/20' :
                  project.difficulty === 'Intermediate' ? 'bg-yellow-500/20' :
                  'bg-red-500/20'
                }`}>
                  {project.difficulty}
                </span>
              </div>

              <h4 className="font-montserrat text-sm text-white/70 mb-2">Materials needed:</h4>
              <ul className="font-montserrat text-white/70 text-sm mb-4">
                {project.materials.map((material, index) => (
                  <li key={index} className="flex items-center">
                    <span className="mr-2">•</span>
                    {material}
                  </li>
                ))}
              </ul>

              {selectedProject === project.id && (
                <div className="mt-4 mb-4">
                  <h4 className="font-montserrat text-sm text-white/70 mb-2">Steps:</h4>
                  <ol className="list-decimal list-inside font-montserrat text-white/70 text-sm space-y-2">
                    {project.steps.map((step, index) => (
                      <li key={index} className="pl-2">{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              <div className="flex gap-2">
                <button 
                  onClick={() => handleStartProject(project.id)}
                  className={`flex-1 px-4 py-2 rounded-lg font-montserrat transition-colors ${
                    selectedProject === project.id
                    ? 'bg-purple-500 text-white hover:bg-purple-600'
                    : 'bg-purple-500/20 hover:bg-purple-500/30'
                  }`}
                >
                  {selectedProject === project.id ? 'View Steps' : 'Start Project'}
                </button>
                
                {selectedProject === project.id && (
                  <button 
                    onClick={() => handleCompleteProject(project.id, Math.random() * 30 + 70)} // Random matching % between 70-100
                    className="px-4 py-2 rounded-lg font-montserrat bg-green-500 hover:bg-green-600 transition-colors"
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DiyProjects;

