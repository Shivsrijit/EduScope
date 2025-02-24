import React, { useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

class ProgressTracker {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.progress = {
            overallProgress: 65,
            moduleProgress: {
                "UI Basics": 100,
                "Component Detection": 80,
                "Advanced Patterns": 45,
                "Team Projects": 35
            },
            recentActivities: [
                {
                    date: "2024-03-15",
                    activity: "Completed UI Basics Module",
                    points: 100
                },
                {
                    date: "2024-03-14",
                    activity: "Detected 15 components successfully",
                    points: 75
                },
                {
                    date: "2024-03-13",
                    activity: "Started Advanced Patterns",
                    points: 25
                }
            ]
        };
        this.render();
    }

    createProgressCircle(percentage) {
        const radius = 40;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage / 100) * circumference;
        
        return `
            <svg class="progress-circle" width="100" height="100" viewBox="0 0 100 100">
                <circle
                    class="progress-circle-bg"
                    cx="50"
                    cy="50"
                    r="${radius}"
                    stroke="#eee"
                    stroke-width="8"
                    fill="none"
                />
                <circle
                    class="progress-circle-path"
                    cx="50"
                    cy="50"
                    r="${radius}"
                    stroke="#4CAF50"
                    stroke-width="8"
                    fill="none"
                    stroke-dasharray="${circumference}"
                    stroke-dashoffset="${offset}"
                    transform="rotate(-90 50 50)"
                />
                <text x="50" y="50" text-anchor="middle" dominant-baseline="middle" class="progress-text">
                    ${percentage}%
                </text>
            </svg>
        `;
    }

    render() {
        const html = `
            <div class="progress-tracker">
                <div class="overall-progress">
                    <h2>Your Progress</h2>
                    <div class="progress-circle-container">
                        ${this.createProgressCircle(this.progress.overallProgress)}
                    </div>
                </div>

                <div class="module-progress">
                    <h3>Module Progress</h3>
                    ${Object.entries(this.progress.moduleProgress).map(([module, percent]) => `
                        <div class="module-item">
                            <div class="module-name">${module}</div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${percent}%"></div>
                            </div>
                            <div class="percent">${percent}%</div>
                        </div>
                    `).join('')}
                </div>

                <div class="recent-activities">
                    <h3>Recent Activities</h3>
                    ${this.progress.recentActivities.map(activity => `
                        <div class="activity-item">
                            <div class="activity-date">${activity.date}</div>
                            <div class="activity-desc">${activity.activity}</div>
                            <div class="activity-points">+${activity.points} pts</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        this.container.innerHTML = html;
    }
}

export default ProgressTracker; 