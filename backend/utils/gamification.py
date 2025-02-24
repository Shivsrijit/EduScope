class GamificationSystem:
    def __init__(self):
        self.point_values = {
            "project_completion": 100,
            "tutorial_completion": 50,
            "collaboration": 25,
            "solution_contribution": 75
        }
        
        self.badges = {
            "project_master": {"required_projects": 5, "points": 500},
            "tutorial_expert": {"required_tutorials": 10, "points": 300},
            "team_player": {"collaborations": 3, "points": 200},
            "solution_guru": {"solutions": 5, "points": 400}
        }

    def calculate_project_points(self, completion_time, similarity_score, difficulty):
        """Calculate points based on completion time and similarity"""
        base_points = self.point_values["project_completion"]
        
        # Difficulty multiplier
        difficulty_multiplier = {
            "Beginner": 1.0,
            "Intermediate": 1.5,
            "Advanced": 2.0
        }
        
        # Calculate time bonus (faster = more points)
        time_multiplier = max(0.5, 1 - (completion_time / 3600))  # Time in seconds
        
        # Calculate similarity bonus
        similarity_multiplier = similarity_score / 100
        
        final_points = int(
            base_points * 
            difficulty_multiplier[difficulty] * 
            time_multiplier * 
            similarity_multiplier
        )
        
        return final_points

    def check_achievements(self, user_stats):
        """Check and award new badges based on user statistics"""
        earned_badges = []
        
        for badge, requirements in self.badges.items():
            if self._meets_requirements(user_stats, requirements):
                earned_badges.append({
                    "name": badge,
                    "points": requirements["points"]
                })
                
        return earned_badges

    def _meets_requirements(self, stats, requirements):
        """Check if user meets badge requirements"""
        for key, value in requirements.items():
            if key in stats and stats[key] < value:
                return False
        return True

    def award_badge(self, user_stats, badge_name):
        """Award a new badge to user"""
        if badge_name in self.badges:
            badge_info = self.badges[badge_name]
            if self._meets_requirements(user_stats, badge_info):
                return {
                    "name": badge_name,
                    "points": badge_info["points"],
                    "icon": f"badges/{badge_name.lower()}.png"
                }
        return None

    def get_leaderboard(self):
        """Get global leaderboard data"""
        try:
            # Mock data for demonstration
            return [
                {
                    "username": "TechWizard",
                    "points": 1250,
                    "level": 5,
                    "projects_completed": 8,
                    "badges": ["project_master", "team_player"]
                },
                {
                    "username": "RoboMaster",
                    "points": 980,
                    "level": 4,
                    "projects_completed": 6,
                    "badges": ["tutorial_expert"]
                },
                {
                    "username": "CircuitPro",
                    "points": 750,
                    "level": 3,
                    "projects_completed": 4,
                    "badges": ["solution_guru"]
                }
            ]
        except Exception as e:
            print(f"⚠️ Error getting leaderboard: {e}")
            return []  # Return empty list instead of None 