import { useState } from 'react';
import Navigation from '../components/Navigation';
import { Users, MessageSquare, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Community = () => {
  const navigate = useNavigate();
  const [projects] = useState([
    {
      id: 1,
      title: "Smart City Project",
      author: "Alex Chen",
      description: "Developing IoT solutions for urban environments",
      comments: 12,
      collaborators: 5
    },
    {
      id: 2,
      title: "AI Art Generator",
      author: "Maria Garcia",
      description: "Creating an AI that generates unique artwork",
      comments: 8,
      collaborators: 3
    },
    {
      id: 3,
      title: "Eco Sensor Network",
      author: "James Wilson",
      description: "Building a network of environmental sensors",
      comments: 15,
      collaborators: 7
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black text-white">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24">
        <h1 className="font-orbitron text-3xl md:text-4xl font-bold mb-8 animate-slideDown">
          Connect, Collaborate, Create — Join the Futuristic GenZ Community
        </h1>

        {/* Project Feed */}
        <div className="grid gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white/5 rounded-lg p-6 backdrop-blur-lg hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-orbitron text-xl mb-2">{project.title}</h3>
                  <p className="font-montserrat text-white/70">by {project.author}</p>
                </div>
                <button 
                  className="px-4 py-2 bg-purple-500/20 rounded-lg font-montserrat hover:bg-purple-500/30 transition-colors"
                  onClick={() => navigate('/community-details')}
                >
                  Join Collaboration
                </button>
              </div>
              <p className="font-montserrat text-white/80 mb-4">{project.description}</p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-purple-400" />
                  <span className="font-montserrat text-white/70">{project.comments}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span className="font-montserrat text-white/70">{project.collaborators}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Action Button */}
        <button className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-float">
          <Plus className="w-6 h-6" />
        </button>
      </main>
    </div>
  );
};

export default Community;
