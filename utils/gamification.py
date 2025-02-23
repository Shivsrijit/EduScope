# utils/gamification.py
from datetime import datetime, timedelta
import json

class GamificationSystem:
    def __init__(self):
        self.points_system = {
            'complete_lesson': 50,
            'attempt_exercise': 20,
            'correct_answer': 30,
            'daily_streak': 25,
            'share_project': 40,
            'help_peer': 35
        }
        
        self.badges = {
            'explorer': {
                'name': 'Explorer',
                'description': 'Complete lessons in 5 different categories',
                'icon': '🌟',
                'required_score': 250
            },
            'scientist': {
                'name': 'Scientist',
                'description': 'Complete 3 lab experiments',
                'icon': '🔬',
                'required_score': 300
            },
            'artist': {
                'name': 'Creative Artist',
                'icon': '🎨',
                'description': 'Complete 5 art projects',
                'required_score': 250
            },
            'engineer': {
                'name': 'Master Engineer',
                'icon': '⚡',
                'description': 'Build 3 electronic projects',
                'required_score': 350
            }
        }
        
    def calculate_points(self, user_id, activity_type, details=None):
        """Calculate points for an activity"""
        base_points = self.points_system.get(activity_type, 0)
        bonus_points = self._calculate_bonus(user_id, activity_type)
        return base_points + bonus_points
        
    def award_badge(self, user_id, category_progress):
        """Check and award badges based on progress"""
        earned_badges = []
        
        for badge_id, badge_info in self.badges.items():
            if self._check_badge_eligibility(user_id, badge_id, category_progress):
                earned_badges.append({
                    'badge_id': badge_id,
                    'name': badge_info['name'],
                    'icon': badge_info['icon'],
                    'description': badge_info['description']
                })
                
        return earned_badges
        
    def _calculate_bonus(self, user_id, activity_type):
        """Calculate bonus points based on user's history"""
        # This would typically check a database for user's streak and history
        return 0  # Placeholder
        
    def _check_badge_eligibility(self, user_id, badge_id, progress):
        """Check if user is eligible for a badge"""
        if badge_id not in self.badges:
            return False
            
        badge = self.badges[badge_id]
        required_score = badge['required_score']
        
        # Check if user's progress meets badge requirements
        if progress.get(badge_id, 0) >= required_score:
            return True
            
        return False

class UserProgress:
    def __init__(self, user_id):
        self.user_id = user_id
        self.points = 0
        self.badges = []
        self.activities = []
        self.last_activity = None
        self.streak = 0
        
    def add_activity(self, activity_type, points, timestamp=None):
        """Record a new activity"""
        if timestamp is None:
            timestamp = datetime.now()
            
        self.activities.append({
            'type': activity_type,
            'points': points,
            'timestamp': timestamp
        })
        
        self.points += points
        self._update_streak(timestamp)
        
    def _update_streak(self, timestamp):
        """Update daily streak"""
        if self.last_activity is None:
            self.streak = 1
        else:
            time_diff = timestamp - self.last_activity
            if time_diff.days == 1:
                self.streak += 1
            elif time_diff.days > 1:
                self.streak = 1
                
        self.last_activity = timestamp
        
    def get_level(self):
        """Calculate user's level based on points"""
        return 1 + (self.points // 1000)  # Level up every 1000 points
        
    def get_progress_to_next_level(self):
        """Calculate progress to next level"""
        points_to_next = 1000 * (self.get_level() + 1) - self.points
        return {
            'current_level': self.get_level(),
            'points_to_next': points_to_next,
            'progress_percentage': (self.points % 1000) / 10  # Convert to percentage
        }