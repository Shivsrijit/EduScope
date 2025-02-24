
import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { ArrowLeft, Users, MessageSquare, Target } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

const CollaborationRoom = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [isJoined, setIsJoined] = useState(false);

  // This would typically come from an API
  const room = {
    id: parseInt(id || "1"),
    title: "Smart City Project Hub",
    description: "A collaborative space for developing IoT solutions for urban environments",
    participants: 5,
    messages: 12,
    objectives: [
      "Design sensor network architecture",
      "Develop data collection protocols",
      "Create visualization dashboards"
    ]
  };

  const handleJoin = () => {
    setIsJoined(true);
    toast({
      title: "Successfully Joined",
      description: "You've joined the collaboration room!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black text-white">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24">
        <button 
          onClick={() => navigate('/community')}
          className="flex items-center space-x-2 text-white/70 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Community</span>
        </button>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white/5 rounded-lg p-6 backdrop-blur-lg">
              <h1 className="font-orbitron text-3xl font-bold mb-4">{room.title}</h1>
              <p className="text-white/70 mb-6">{room.description}</p>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <span className="flex items-center px-3 py-1 bg-purple-500/20 rounded-full text-sm">
                  <Users className="w-4 h-4 mr-2" />
                  {room.participants} Members
                </span>
                <span className="flex items-center px-3 py-1 bg-purple-500/20 rounded-full text-sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {room.messages} Messages
                </span>
              </div>

              {!isJoined ? (
                <button
                  onClick={handleJoin}
                  className="w-full py-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg font-montserrat shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Join Collaboration Room
                </button>
              ) : (
                <div className="bg-green-500/20 text-green-300 py-3 px-4 rounded-lg text-center">
                  You're a member of this room
                </div>
              )}
            </div>

            <div className="bg-white/5 rounded-lg p-6 backdrop-blur-lg">
              <h2 className="font-orbitron text-xl mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Project Objectives
              </h2>
              <ul className="space-y-4">
                {room.objectives.map((objective, index) => (
                  <li 
                    key={index}
                    className="flex items-center space-x-3 bg-white/5 p-4 rounded-lg"
                  >
                    <span className="text-purple-400">{index + 1}.</span>
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white/5 rounded-lg p-6 backdrop-blur-lg">
              <h2 className="font-orbitron text-xl mb-4">Active Members</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <span>Alex Chen (Lead)</span>
                </div>
                {/* Add more members as needed */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CollaborationRoom;

