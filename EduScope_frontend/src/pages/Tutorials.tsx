import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { BookOpen, Search, Loader } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const ALL_TUTORIALS = [
  { 
    id: 1, 
    title: "Build Your First Robot", 
    category: "Robotics", 
    difficulty: "Beginner",
    description: "Learn the basics of robotics and create your first robot",
    duration: "2 hours",
    modules: 5,
    keywords: ["robotics", "arduino", "electronics", "programming"]
  },
  { 
    id: 2, 
    title: "Digital Art Masterclass", 
    category: "Art", 
    difficulty: "Intermediate",
    description: "Master digital art techniques and tools",
    duration: "3 hours",
    modules: 7,
    keywords: ["digital art", "illustration", "design", "creative"]
  },
  { 
    id: 3, 
    title: "Smart Home Automation", 
    category: "DIY Projects", 
    difficulty: "Advanced",
    description: "Build your own smart home automation system",
    duration: "4 hours",
    modules: 6,
    keywords: ["automation", "IoT", "smart home", "electronics"]
  },
  { 
    id: 4, 
    title: "AI Basics", 
    category: "Science", 
    difficulty: "Beginner",
    description: "Introduction to artificial intelligence concepts",
    duration: "2.5 hours",
    modules: 4,
    keywords: ["AI", "machine learning", "programming", "data science"]
  },
  { 
    id: 5, 
    title: "3D Printing Guide", 
    category: "DIY Projects", 
    difficulty: "Intermediate",
    description: "Learn 3D printing from basics to advanced techniques",
    duration: "3.5 hours",
    modules: 8,
    keywords: ["3D printing", "modeling", "design", "fabrication"]
  },
  { 
    id: 6, 
    title: "Circuit Design", 
    category: "Robotics", 
    difficulty: "Advanced",
    description: "Master electronic circuit design and implementation",
    duration: "5 hours",
    modules: 10,
    keywords: ["electronics", "circuits", "design", "engineering"]
  },
  { 
    id: 7, 
    title: "DIY Smart Garden", 
    category: "DIY Projects", 
    difficulty: "Intermediate",
    description: "Create an automated garden monitoring system",
    duration: "3 hours",
    modules: 6,
    keywords: ["IoT", "gardening", "automation"]
  },
  { 
    id: 8, 
    title: "Machine Learning Basics", 
    category: "Science", 
    difficulty: "Advanced",
    description: "Introduction to machine learning concepts",
    duration: "4 hours",
    modules: 8,
    keywords: ["AI", "ML", "data science"]
  }
];

const ITEMS_PER_PAGE = 6;

const Tutorials = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  
  const categories = ['All', 'Art', 'Robotics', 'Science', 'DIY Projects'];

  const filteredTutorials = ALL_TUTORIALS.filter(tutorial => {
    const matchesCategory = selectedCategory === 'all' || 
      tutorial.category.toLowerCase() === selectedCategory.toLowerCase();
    
    const matchesSearch = searchQuery === '' || 
      tutorial.keywords.some(keyword => 
        keyword.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const visibleTutorials = filteredTutorials.slice(0, displayCount);
  const hasMore = visibleTutorials.length < filteredTutorials.length;

  const handleLoadMore = () => {
    setIsLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setDisplayCount(prev => prev + ITEMS_PER_PAGE);
      setIsLoading(false);
    }, 800);
  };

  const handleTutorialClick = (tutorialId: number) => {
    navigate(`/tutorial/${tutorialId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black text-white">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24">
        <h1 className="font-orbitron text-3xl md:text-4xl font-bold mb-8 animate-slideDown">
          Master Skills with AI-Powered Tutorials
        </h1>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
          <input
            type="text"
            placeholder="Search tutorials by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 rounded-lg font-montserrat focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
        </div>

        {/* Filter Bar */}
        <div className="mb-8 flex flex-wrap gap-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category.toLowerCase())}
              className={`px-4 py-2 rounded-lg font-montserrat transition-all duration-300 ${
                selectedCategory === category.toLowerCase()
                ? 'bg-purple-500 text-white'
                : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Tutorials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleTutorials.map((tutorial) => (
            <div
              key={tutorial.id}
              onClick={() => handleTutorialClick(tutorial.id)}
              className="group bg-white/5 rounded-lg p-6 backdrop-blur-lg hover:bg-white/10 transition-all duration-300 animate-scale cursor-pointer"
            >
              <BookOpen className="w-8 h-8 mb-4 text-purple-400" />
              <h3 className="font-orbitron text-xl mb-2">{tutorial.title}</h3>
              <p className="font-montserrat text-white/70 mb-2">{tutorial.category}</p>
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-sm font-montserrat mb-4">
                {tutorial.difficulty}
              </span>
              <p className="text-white/70 mb-4">{tutorial.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {tutorial.keywords.map((keyword, index) => (
                  <span 
                    key={index}
                    className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-white/60">Duration: {tutorial.duration}</span>
                <span className="text-sm text-white/60">{tutorial.modules} modules</span>
              </div>
              <button 
                className="w-full px-4 py-2 bg-purple-500/20 rounded-lg font-montserrat hover:bg-purple-500/30 transition-colors"
              >
                Start Tutorial
              </button>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center mt-12">
            <button 
              onClick={handleLoadMore}
              disabled={isLoading}
              className="px-8 py-3 bg-white/10 rounded-lg font-montserrat hover:bg-white/20 transition-colors animate-float flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <span>Load More</span>
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Tutorials;
