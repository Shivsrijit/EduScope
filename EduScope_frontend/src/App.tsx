import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Tutorials from "./pages/Tutorials";
import TutorialDetail from "./pages/TutorialDetail";
import ModuleContent from "./pages/ModuleContent";
import Community from "./pages/Community";
import CollaborationRoom from "./pages/CollaborationRoom";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import LearningGoals from "./pages/LearningGoals";
import Leaderboard from "./pages/Leaderboard";
import ObjectIdentification from "./pages/ObjectIdentification";
import DiyProjects from "./pages/DiyProjects";
import ProjectDetail from "./pages/ProjectDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tutorials" element={<Tutorials />} />
          <Route path="/tutorial/:id" element={<TutorialDetail />} />
          <Route path="/module/:id" element={<ModuleContent />} />
          <Route path="/community" element={<Community />} />
          <Route path="/collaboration-room/:id" element={<CollaborationRoom />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />
          <Route path="/profile/learning-goals" element={<LearningGoals />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/object-identification" element={<ObjectIdentification />} />
          <Route path="/diy-projects" element={<DiyProjects />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> 3e144e4 (Finalll Changes)
