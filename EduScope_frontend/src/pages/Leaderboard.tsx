
import Navigation from '../components/Navigation';
import { Trophy, Award, Medal } from 'lucide-react';

const Leaderboard = () => {
  const leaderboardData = [
    { rank: 2, name: "RAMA", points: 18, projects: 2 },
    { rank: 1, name: "RAHUL", points: 25, projects: 4 },
    { rank: 4, name: "SWATHI", points: 15, projects: 2 },
    { rank: 2, name: "ADII", points: 20, projects: 5 },
    { rank: 5, name: "PADMA", points: 0, projects: 0 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black text-white">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24">
        <h1 className="font-orbitron text-3xl md:text-4xl font-bold mb-8 text-center animate-slideDown">
          Innovation Leaderboard
        </h1>

        {/* Top 3 Podium */}
        <div className="flex justify-center items-end mb-16 space-x-4">
          {/* Second Place */}
          <div className="text-center">
            <div className="w-24 h-32 bg-white/5 rounded-t-lg backdrop-blur-lg flex items-center justify-center mb-2">
              <Award className="w-12 h-12 text-gray-300" />
            </div>
            <p className="font-orbitron">{leaderboardData[1].name}</p>
            <p className="font-montserrat text-white/70">{leaderboardData[1].points} pts</p>
          </div>

          {/* First Place */}
          <div className="text-center">
            <div className="w-24 h-40 bg-gradient-to-t from-purple-400 to-pink-400 rounded-t-lg backdrop-blur-lg flex items-center justify-center mb-2">
              <Trophy className="w-16 h-16 text-white" />
            </div>
            <p className="font-orbitron text-xl">{leaderboardData[0].name}</p>
            <p className="font-montserrat text-white/70">{leaderboardData[0].points} pts</p>
          </div>

          {/* Third Place */}
          <div className="text-center">
            <div className="w-24 h-28 bg-white/5 rounded-t-lg backdrop-blur-lg flex items-center justify-center mb-2">
              <Medal className="w-10 h-10 text-amber-600" />
            </div>
            <p className="font-orbitron">{leaderboardData[2].name}</p>
            <p className="font-montserrat text-white/70">{leaderboardData[2].points} pts</p>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white/5 rounded-lg backdrop-blur-lg">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="font-orbitron text-xl">Top Innovators</h2>
          </div>
          <div className="divide-y divide-white/10">
            {leaderboardData.map((user) => (
              <div
                key={user.rank}
                className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <span className="font-montserrat text-2xl font-bold text-white/50">
                    #{user.rank}
                  </span>
                  <div>
                    <p className="font-orbitron">{user.name}</p>
                    <p className="font-montserrat text-white/70">{user.projects} projects</p>
                  </div>
                </div>
                <p className="font-montserrat font-bold">{user.points} pts</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;


