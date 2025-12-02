import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Layers, Smartphone, Layout, User } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();

    const interviews = [
        {
            id: 'frontend',
            title: 'Frontend Developer',
            icon: <Layout className="w-10 h-10 text-blue-400" />,
            date: 'Technical',
            score: '---',
            description: "React, CSS, Performance, Accessibility.",
            type: 'Technical',
            tech: ['React', 'CSS']
        },
        {
            id: 'backend',
            title: 'Backend Developer',
            icon: <Layers className="w-10 h-10 text-green-400" />,
            date: 'Technical',
            score: '---',
            description: "Node.js, Databases, API Design, Scalability.",
            type: 'Technical',
            tech: ['Node', 'SQL']
        },
        {
            id: 'fullstack',
            title: 'Full Stack Developer',
            icon: <Code className="w-10 h-10 text-purple-400" />,
            date: 'Technical',
            score: '---',
            description: "End-to-end system design, Integration.",
            type: 'Technical',
            tech: ['MERN', 'System']
        },
        {
            id: 'devops',
            title: 'DevOps Engineer',
            icon: <Layers className="w-10 h-10 text-orange-400" />,
            date: 'Technical',
            score: '---',
            description: "CI/CD, Docker, Kubernetes, Cloud.",
            type: 'Technical',
            tech: ['Docker', 'AWS']
        },
        {
            id: 'aiml',
            title: 'AI/ML Engineer',
            icon: <Smartphone className="w-10 h-10 text-red-400" />,
            date: 'Technical',
            score: '---',
            description: "Models, RAG, Python, Deployment.",
            type: 'Technical',
            tech: ['Python', 'ML']
        },
        {
            id: 'hr',
            title: 'HR / Behavioral',
            icon: <User className="w-10 h-10 text-yellow-400" />,
            date: 'Behavioral',
            score: '---',
            description: "Culture fit, Soft skills, Leadership.",
            type: 'HR',
            tech: ['Soft Skills']
        }
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <header className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <span className="text-black font-bold">P</span>
                    </div>
                    <span className="text-xl font-bold">PrepWise</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
                </div>
            </header>

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-3xl p-12 mb-16 relative overflow-hidden">
                <div className="max-w-2xl relative z-10">
                    <h1 className="text-4xl font-bold mb-4">Get Interview-Ready with AI-Powered Practice & Feedback</h1>
                    <p className="text-gray-300 mb-8">Practice real interview questions & get instant feedback</p>
                    <button
                        onClick={() => navigate('/interview/general')}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
                    >
                        Start an Interview
                    </button>
                </div>

                {/* Decorative Elements (Robot) */}
                <div className="absolute right-10 bottom-0 w-1/3 opacity-80 hidden md:block">
                    <div className="text-9xl">🤖</div>
                </div>
            </div>

            {/* Your Interviews Section */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Your Interviews</h2>
                <p className="text-gray-400">You haven't taken any interviews yet</p>
            </div>

            {/* Take Interviews Section */}
            <div>
                <h2 className="text-2xl font-bold mb-6">Take Interviews</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {interviews.map((interview) => (
                        <div key={interview.id} className="bg-card border border-gray-800 rounded-xl p-6 hover:border-indigo-500 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-gray-900 rounded-lg">
                                    {interview.icon}
                                </div>
                                <span className="bg-gray-800 text-xs px-2 py-1 rounded text-gray-300">{interview.type}</span>
                            </div>

                            <h3 className="text-xl font-bold mb-2">{interview.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                                <span>📅 {interview.date}</span>
                                <span>⭐ {interview.score}/100</span>
                            </div>

                            <p className="text-gray-400 text-sm mb-6">
                                {interview.description}
                            </p>

                            <div className="flex justify-between items-center mt-auto">
                                <div className="flex gap-2">
                                    {interview.tech.map((t, i) => (
                                        <span key={i} className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs" title={t}>
                                            {t[0]}
                                        </span>
                                    ))}
                                </div>
                                <button
                                    onClick={() => navigate(`/interview/${interview.id}`)}
                                    className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                                >
                                    View Interview
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
