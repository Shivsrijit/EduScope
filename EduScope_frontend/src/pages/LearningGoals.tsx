
import { useState } from 'react';
import Navigation from '../components/Navigation';
import { ArrowLeft, Plus, Target, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

const LearningGoals = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [goals, setGoals] = useState(['']);

  const addGoal = () => {
    setGoals([...goals, '']);
  };

  const updateGoal = (index: number, value: string) => {
    const updatedGoals = [...goals];
    updatedGoals[index] = value;
    setGoals(updatedGoals);
  };

  const removeGoal = (index: number) => {
    const updatedGoals = goals.filter((_, i) => i !== index);
    setGoals(updatedGoals);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validGoals = goals.filter(goal => goal.trim() !== '');
    if (validGoals.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one learning goal.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Goals Updated",
      description: "Your AI learning goals have been saved.",
    });
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black text-white">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24">
        <button 
          onClick={() => navigate('/profile')}
          className="flex items-center space-x-2 text-white/70 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Profile</span>
        </button>

        <div className="max-w-2xl mx-auto">
          <h1 className="font-orbitron text-3xl font-bold mb-8 flex items-center">
            <Target className="w-8 h-8 mr-3" />
            Set AI Learning Goals
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {goals.map((goal, index) => (
              <div key={index} className="flex items-center gap-4">
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => updateGoal(index, e.target.value)}
                  placeholder="Enter your learning goal..."
                  className="flex-1 p-3 bg-white/5 rounded-lg border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                />
                {goals.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeGoal(index)}
                    className="p-3 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addGoal}
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Another Goal
            </button>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg font-montserrat shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Save className="w-5 h-5 inline-block mr-2" />
              Save Goals
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default LearningGoals;

