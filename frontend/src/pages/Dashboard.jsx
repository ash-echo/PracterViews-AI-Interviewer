import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Layers, Smartphone, Layout, User, Sparkles, ArrowRight, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    const interviews = [
        {
            id: 'frontend',
            title: 'Frontend Developer',
            icon: <Layout className="w-8 h-8 text-blue-400" />,
            date: 'Technical',
            score: '---',
            description: "React, CSS, Performance, Accessibility.",
            type: 'Technical',
            tech: ['React', 'CSS'],
            gradient: "from-blue-500/20 to-cyan-500/20",
            border: "group-hover:border-blue-500/50"
        },
        {
            id: 'backend',
            title: 'Backend Developer',
            icon: <Layers className="w-8 h-8 text-green-400" />,
            date: 'Technical',
            score: '---',
            description: "Node.js, Databases, API Design, Scalability.",
            type: 'Technical',
            tech: ['Node', 'SQL'],
            gradient: "from-green-500/20 to-emerald-500/20",
            border: "group-hover:border-green-500/50"
        },
        {
            id: 'fullstack',
            title: 'Full Stack Developer',
            icon: <Code className="w-8 h-8 text-purple-400" />,
            date: 'Technical',
            score: '---',
            description: "End-to-end system design, Integration.",
            type: 'Technical',
            tech: ['MERN', 'System'],
            gradient: "from-purple-500/20 to-pink-500/20",
            border: "group-hover:border-purple-500/50"
        },
        {
            id: 'devops',
            title: 'DevOps Engineer',
            icon: <Layers className="w-8 h-8 text-orange-400" />,
            date: 'Technical',
            score: '---',
            description: "CI/CD, Docker, Kubernetes, Cloud.",
            type: 'Technical',
            tech: ['Docker', 'AWS'],
            gradient: "from-orange-500/20 to-red-500/20",
            border: "group-hover:border-orange-500/50"
        },
        {
            id: 'aiml',
            title: 'AI/ML Engineer',
            icon: <Smartphone className="w-8 h-8 text-red-400" />,
            date: 'Technical',
            score: '---',
            description: "Models, RAG, Python, Deployment.",
            type: 'Technical',
            tech: ['Python', 'ML'],
            gradient: "from-red-500/20 to-rose-500/20",
            border: "group-hover:border-red-500/50"
        },
        {
            id: 'hr',
            title: 'HR / Behavioral',
            icon: <User className="w-8 h-8 text-yellow-400" />,
            date: 'Behavioral',
            score: '---',
            description: "Culture fit, Soft skills, Leadership.",
            type: 'HR',
            tech: ['Soft Skills'],
            gradient: "from-yellow-500/20 to-amber-500/20",
            border: "group-hover:border-yellow-500/50"
        },
        {
            id: 'hackathon',
            title: 'Hackathon Review',
            icon: <Trophy className="w-8 h-8 text-yellow-500" />,
            date: 'Project',
            score: '---',
            description: "Pitch practice, Innovation check, Technical deep-dive.",
            type: 'Review',
            tech: ['Pitch', 'Demo'],
            gradient: "from-yellow-600/20 to-orange-600/20",
            border: "group-hover:border-yellow-600/50"
        }
    ];

    return (
        <div className="min-h-screen bg-[#09090b] text-white p-8 overflow-x-hidden">
            <motion.div
                className="max-w-7xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header */}
                <header className="flex justify-between items-center mb-12">
                    <motion.div
                        className="flex items-center gap-3"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <span className="text-white font-bold text-xl">P</span>
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">PracterViews</span>
                    </motion.div>
                </header>

                {/* Hero Section */}
                <motion.div
                    className="relative bg-gradient-to-r from-indigo-900/40 to-purple-900/40 rounded-[2rem] p-12 mb-16 overflow-hidden border border-white/10 backdrop-blur-sm"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    {/* Animated Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 blur-3xl opacity-30 animate-pulse" />

                    <div className="max-w-2xl relative z-10">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-6">
                                <Sparkles className="w-4 h-4" />
                                AI-Powered Interview Practice
                            </span>
                        </motion.div>

                        <motion.h1
                            className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            Master Your Next <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Interview</span>
                        </motion.h1>

                        <motion.p
                            className="text-gray-300 text-lg mb-8 max-w-lg"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            Practice real-time with our advanced AI avatars. Get instant feedback on your technical skills and communication.
                        </motion.p>

                        <motion.button
                            onClick={() => navigate('/interview/general')}
                            className="group bg-white text-black px-8 py-4 rounded-full font-bold text-lg transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Start Practice
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </div>

                    {/* Floating 3D Element (Simulated) */}
                    <motion.div
                        className="absolute right-0 bottom-0 w-1/2 h-full hidden md:flex items-end justify-end pointer-events-none"
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        <motion.div
                            className="text-[12rem] leading-none filter drop-shadow-2xl"
                            animate={{ y: [0, -20, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        >
                            🤖
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Interviews Grid */}
                <motion.div variants={containerVariants}>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold">Select Role</h2>
                        <div className="text-sm text-gray-400">Choose your path</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {interviews.map((interview) => (
                            <motion.div
                                key={interview.id}
                                variants={itemVariants}
                                className={`group relative bg-[#121214] border border-white/5 rounded-2xl p-6 hover:bg-[#18181b] transition-all duration-300 cursor-pointer overflow-hidden ${interview.border}`}
                                onClick={() => navigate(`/interview/${interview.id}`)}
                                whileHover={{ y: -5 }}
                            >
                                {/* Hover Gradient Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${interview.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:scale-110 transition-transform duration-300">
                                            {interview.icon}
                                        </div>
                                        <span className="bg-white/5 border border-white/10 text-xs font-medium px-3 py-1 rounded-full text-gray-300">
                                            {interview.type}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">{interview.title}</h3>

                                    <p className="text-gray-400 text-sm mb-6 line-clamp-2 group-hover:text-gray-300 transition-colors">
                                        {interview.description}
                                    </p>

                                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                        <div className="flex -space-x-2">
                                            {interview.tech.map((t, i) => (
                                                <div key={i} className="w-8 h-8 rounded-full bg-[#27272a] border border-[#121214] flex items-center justify-center text-[10px] text-gray-300 font-medium" title={t}>
                                                    {t[0]}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-1 text-sm font-medium text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                                            Start
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
