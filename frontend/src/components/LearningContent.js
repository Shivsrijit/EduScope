function LearningContent({ topic }) {
    // ... existing code ...
    
    return (
        <div className="learning-container">
            <div className="learning-modules">
                <h2>Learning Modules</h2>
                {/* ... existing learning modules code ... */}
            </div>
            
            <div className="project-ideas">
                <h2>Project Ideas</h2>
                {content.project_ideas.map((project, index) => (
                    <div key={index} className="project-card">
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>
                        <div className="project-meta">
                            <span className={`difficulty ${project.difficulty.toLowerCase()}`}>
                                {project.difficulty}
                            </span>
                            <span className="estimated-time">
                                Estimated time: {project.estimated_time} hours
                            </span>
                        </div>
                        <div className="technologies">
                            {project.technologies.map((tech, i) => (
                                <span key={i} className="tech-tag">{tech}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 