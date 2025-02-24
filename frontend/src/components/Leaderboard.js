class Leaderboard {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.leaderboardData = [
            {
                id: 1,
                username: "TechMaster2024",
                score: 2850,
                badges: ["Component Expert", "Team Player"],
                contributions: 156
            },
            {
                id: 2,
                username: "UIWizard",
                score: 2340,
                badges: ["Quick Learner", "Mentor"],
                contributions: 128
            },
            {
                id: 3,
                username: "DesignPro",
                score: 2100,
                badges: ["Design Expert"],
                contributions: 98
            }
        ];
        this.render();
    }

    render() {
        const html = `
            <div class="leaderboard-container">
                <h2>Top Contributors</h2>
                <div class="leaderboard-list">
                    ${this.leaderboardData.map(user => `
                        <div class="leaderboard-item">
                            <div class="rank">${user.id}</div>
                            <div class="user-info">
                                <h3>${user.username}</h3>
                                <div class="badges">
                                    ${user.badges.map(badge => `
                                        <span class="badge">${badge}</span>
                                    `).join('')}
                                </div>
                            </div>
                            <div class="stats">
                                <div class="score">${user.score} pts</div>
                                <div class="contributions">${user.contributions} contributions</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        this.container.innerHTML = html;
    }
} 