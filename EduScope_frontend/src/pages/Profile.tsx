
import { useState } from 'react';
import Navigation from '../components/Navigation';
import { User, Edit, Trophy, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [user] = useState({
    name: "Ansh",
    email: "ansh@example.com",
    bio: "Passionate about technology and innovation",
    achievements: [
      { id: 1, title: "Project Master", description: "Completed 10 projects" },
      { id: 2, title: "Collaboration Star", description: "Joined 5 team projects" },
      { id: 3, title: "Innovation Leader", description: "Created 3 unique solutions" }
    ],
    projects: [
      { id: 1, title: "AI Assistant", status: "Completed" },
      { id: 2, title: "Smart Home Hub", status: "Completed" },
      { id: 3, title: "Robot Friend", status: "Ongoing" }
    ]
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black text-white">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24">
        {/* Profile Header */}
        <div className="relative mb-12 text-center">
          <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 p-1">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
              <User className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="font-orbitron text-3xl font-bold mb-2">{user.name}</h1>
          <p className="font-montserrat text-white/70 mb-4">{user.bio}</p>
          <button
            onClick={() => navigate('/profile/edit')}
            className="inline-flex items-center px-4 py-2 bg-white/10 rounded-lg font-montserrat hover:bg-white/20 transition-colors"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
        </div>

        {/* Achievements */}
        <section className="mb-12">
          <h2 className="font-orbitron text-2xl mb-6">Achievements</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {user.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="bg-white/5 rounded-lg p-6 backdrop-blur-lg hover:bg-white/10 transition-all duration-300"
              >
                <Trophy className="w-8 h-8 mb-4 text-purple-400" />
                <h3 className="font-orbitron text-xl mb-2">{achievement.title}</h3>
                <p className="font-montserrat text-white/70">{achievement.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="mb-12">
          <h2 className="font-orbitron text-2xl mb-6">Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.projects.map((project) => (
              <div
                key={project.id}
                className="bg-white/5 rounded-lg p-6 backdrop-blur-lg hover:bg-white/10 transition-all duration-300"
              >
                <h3 className="font-orbitron text-xl mb-2">{project.title}</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-montserrat ${
                  project.status === 'Completed' ? 'bg-green-500/20' : 'bg-purple-500/20'
                }`}>
                  {project.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Set Goals Button */}
        <div className="text-center">
          <button 
            onClick={() => navigate('/profile/learning-goals')}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg font-montserrat shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Target className="w-5 h-5 mr-2" />
            Set AI Learning Goals
          </button>
        </div>
      </main>
    </div>
  );
};

export default Profile;

