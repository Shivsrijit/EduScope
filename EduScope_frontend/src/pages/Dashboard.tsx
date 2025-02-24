import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { Rocket, Users, BookOpen } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [projects] = useState([
    { 
      id: 1, 
      title: "AI Robot Assistant", 
      progress: 75,
      description: "Build an AI-powered robot assistant using machine learning and robotics",
      tasks: ["Design robot architecture", "Implement ML algorithms", "Test interactions"],
      team: ["Alice", "Bob", "Charlie"]
    },
    { 
      id: 2, 
      title: "Smart Home Hub", 
      progress: 45,
      description: "Create a central hub to control all smart home devices",
      tasks: ["Setup IoT network", "Design user interface", "Integration testing"],
      team: ["David", "Eve", "Frank"]
    },
    { 
      id: 3, 
      title: "Eco Energy Monitor", 
      progress: 90,
      description: "Monitor and optimize energy consumption in real-time",
      tasks: ["Sensor implementation", "Data visualization", "Energy analysis"],
      team: ["Grace", "Henry", "Ivy"]
    }
  ]);

  const [rooms] = useState([
    { 
      id: 1, 
      name: "Robotics Lab", 
      members: 5,
      description: "Collaborate on robotics projects and share ideas",
      currentTopic: "AI Integration in Robotics",
      activeMembers: ["John", "Sarah", "Mike"]
    },
    { 
      id: 2, 
      name: "Creative Studio", 
      members: 8,
      description: "Design and brainstorm innovative solutions",
      currentTopic: "UX Design Patterns",
      activeMembers: ["Emma", "James", "Lisa"]
    },
    { 
      id: 3, 
      name: "Innovation Hub", 
      members: 12,
      description: "Discuss and develop cutting-edge technologies",
      currentTopic: "Future of AR/VR",
      activeMembers: ["Shiv", "Ansh", "Aditya"]
    }
  ]);

  const handleViewDetails = (projectId: number) => {
    navigate(`/project/${projectId}`);
  };

  const handleJoinRoom = (roomId: number) => {
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black text-white">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24">
        <h1 className="font-orbitron text-3xl md:text-4xl font-bold mb-8 animate-slideDown">
          Hi User, Ready to Explore?
        </h1>

        {/* Progress Tracker */}
        <section className="mb-12">
          <h2 className="font-orbitron text-2xl mb-6">Progress Tracker</h2>
          <div className="grid gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white/5 rounded-lg p-4 backdrop-blur-lg">
                <div className="flex justify-between mb-2">
                  <span className="font-montserrat">{project.title}</span>
                  <span className="font-montserrat">{project.progress}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Ongoing Projects */}
        <section className="mb-12">
          <h2 className="font-orbitron text-2xl mb-6">Ongoing Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group bg-white/5 rounded-lg p-6 backdrop-blur-lg hover:bg-white/10 transition-all duration-300"
              >
                <Rocket className="w-8 h-8 mb-4 text-purple-400" />
                <h3 className="font-orbitron text-xl mb-2">{project.title}</h3>
                <p className="text-white/70 mb-4">{project.description}</p>
                <div className="mb-4">
                  <h4 className="font-orbitron text-sm mb-2">Team Members:</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.team.map((member) => (
                      <span key={member} className="px-2 py-1 bg-purple-500/20 rounded-full text-sm">
                        {member}
                      </span>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => handleViewDetails(project.id)}
                  className="mt-4 px-4 py-2 bg-purple-500/20 rounded-lg font-montserrat hover:bg-purple-500/30 transition-colors"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Collaboration Rooms */}
        <section className="mb-12">
          <h2 className="font-orbitron text-2xl mb-6">Collaboration Rooms</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="group bg-white/5 rounded-lg p-6 backdrop-blur-lg hover:bg-white/10 transition-all duration-300"
              >
                <Users className="w-8 h-8 mb-4 text-purple-400" />
                <h3 className="font-orbitron text-xl mb-2">{room.name}</h3>
                <p className="font-montserrat text-white/70 mb-2">
                  {room.members} members active
                </p>
                <p className="text-white/70 mb-4">{room.description}</p>
                <div className="mb-4">
                  <h4 className="font-orbitron text-sm mb-2">Current Topic:</h4>
                  <p className="text-purple-400">{room.currentTopic}</p>
                </div>
                <div className="mb-4">
                  <h4 className="font-orbitron text-sm mb-2">Active Members:</h4>
                  <div className="flex flex-wrap gap-2">
                    {room.activeMembers.map((member) => (
                      <span key={member} className="px-2 py-1 bg-purple-500/20 rounded-full text-sm">
                        {member}
                      </span>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => handleJoinRoom(room.id)}
                  className="px-4 py-2 bg-purple-500/20 rounded-lg font-montserrat hover:bg-purple-500/30 transition-colors"
                >
                  Join Room
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Floating Action Button */}
        <button className="fixed bottom-8 right-8 px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full font-montserrat shadow-lg hover:shadow-xl transition-all duration-300 animate-float">
          Start a New Project
        </button>
      </main>
    </div>
  );
};

export default Dashboard;
