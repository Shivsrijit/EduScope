
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { ArrowLeft, Calendar, CheckCircle2, Users } from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock project data - in a real app, this would come from an API or database
  const projects = [
    { 
      id: 1, 
      title: "AI Robot Assistant", 
      progress: 75,
      description: "Build an AI-powered robot assistant using machine learning and robotics",
      tasks: ["Design robot architecture", "Implement ML algorithms", "Test interactions"],
      team: ["Alice", "Bob", "Charlie"],
      startDate: "2024-01-15",
      endDate: "2024-04-15",
      status: "In Progress",
      objectives: [
        "Create a responsive AI system",
        "Implement natural language processing",
        "Design user-friendly interface"
      ],
      milestones: [
        { title: "Initial Design", completed: true },
        { title: "Core AI Implementation", completed: true },
        { title: "Testing Phase", completed: false },
        { title: "Final Deployment", completed: false }
      ]
    },
    { 
      id: 2, 
      title: "Smart Home Hub", 
      progress: 45,
      description: "Create a central hub to control all smart home devices",
      tasks: ["Setup IoT network", "Design user interface", "Integration testing"],
      team: ["David", "Eve", "Frank"],
      startDate: "2024-02-01",
      endDate: "2024-05-01",
      status: "In Progress",
      objectives: [
        "Develop IoT integration system",
        "Create mobile control interface",
        "Implement security protocols"
      ],
      milestones: [
        { title: "Architecture Planning", completed: true },
        { title: "IoT Integration", completed: false },
        { title: "UI Development", completed: false },
        { title: "Security Testing", completed: false }
      ]
    },
    { 
      id: 3, 
      title: "Eco Energy Monitor", 
      progress: 90,
      description: "Monitor and optimize energy consumption in real-time",
      tasks: ["Sensor implementation", "Data visualization", "Energy analysis"],
      team: ["Grace", "Henry", "Ivy"],
      startDate: "2024-01-01",
      endDate: "2024-03-31",
      status: "Near Completion",
      objectives: [
        "Real-time energy monitoring",
        "Data visualization dashboard",
        "Optimization recommendations"
      ],
      milestones: [
        { title: "Sensor Network Setup", completed: true },
        { title: "Data Collection System", completed: true },
        { title: "Analysis Dashboard", completed: true },
        { title: "Final Testing", completed: false }
      ]
    }
  ];

  const project = projects.find(p => p.id === Number(id));

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black text-white">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Project Overview */}
          <div className="md:col-span-2 bg-white/5 rounded-lg p-6 backdrop-blur-lg">
            <h1 className="font-orbitron text-3xl mb-4">{project.title}</h1>
            <p className="text-white/70 mb-6">{project.description}</p>
            
            <div className="flex items-center space-x-4 mb-6">
              <Calendar className="w-5 h-5 text-purple-400" />
              <span className="text-white/70">
                {project.startDate} - {project.endDate}
              </span>
            </div>

            <div className="mb-6">
              <h3 className="font-orbitron text-xl mb-3">Progress</h3>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <span className="text-sm text-white/70 mt-2">{project.progress}% Complete</span>
            </div>

            <div className="mb-6">
              <h3 className="font-orbitron text-xl mb-3">Objectives</h3>
              <ul className="space-y-2">
                {project.objectives.map((objective, index) => (
                  <li key={index} className="flex items-center space-x-2 text-white/70">
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Team and Milestones */}
          <div className="space-y-6">
            <div className="bg-white/5 rounded-lg p-6 backdrop-blur-lg">
              <h3 className="font-orbitron text-xl mb-4">Team Members</h3>
              <div className="space-y-3">
                {project.team.map((member, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-purple-400" />
                    <span className="text-white/70">{member}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-6 backdrop-blur-lg">
              <h3 className="font-orbitron text-xl mb-4">Milestones</h3>
              <div className="space-y-3">
                {project.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle2 
                      className={`w-5 h-5 ${milestone.completed ? 'text-green-400' : 'text-white/30'}`} 
                    />
                    <span className={`${milestone.completed ? 'text-white' : 'text-white/50'}`}>
                      {milestone.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetail;
