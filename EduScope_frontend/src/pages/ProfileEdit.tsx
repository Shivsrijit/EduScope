
import { useState } from 'react';
import Navigation from '../components/Navigation';
import { Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "Ansh",
    email: "ansh@pickme",
    bio: "Passionate about technology and innovation"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would make an API call to update the profile
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
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

        <h1 className="font-orbitron text-3xl font-bold mb-8">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
          <div>
            <label htmlFor="name" className="block font-montserrat mb-2">Name</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 bg-white/5 rounded-lg border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-montserrat mb-2">Email</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 bg-white/5 rounded-lg border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block font-montserrat mb-2">Bio</label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              className="w-full p-3 bg-white/5 rounded-lg border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg font-montserrat shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Save className="w-5 h-5 inline-block mr-2" />
            Save Changes
          </button>
        </form>
      </main>
    </div>
  );
};

export default ProfileEdit;

