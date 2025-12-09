import React, { useState, useEffect } from 'react';
import { LiveKitRoom, useTracks, VideoTrack, useRoomContext, RoomAudioRenderer, useIsSpeaking, StartAudio } from '@livekit/components-react';
import { Track } from 'livekit-client';
import {
    Mic, MicOff, Video, VideoOff, PhoneOff, Loader2, Sparkles, FileText,
    MoreVertical, Settings, Radio, Activity, Cpu, Wifi
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Import asset components
import ResumeUploader from '../components/ResumeUploader';
import GithubInput from '../components/GithubInput';
import ParticleBackground from '../components/ParticleBackground';

const SERVER_URL = 'wss://practerview-qgcp05tt.livekit.cloud';

const InterviewRoom = () => {
    const [token, setToken] = useState("");
    const navigate = useNavigate();
    const { type } = useParams();
    const hasFetched = React.useRef(false);

    // Ordered 10-Step Sequence
    const loadingSteps = [
        { title: "INITIALIZING SESSION WORKSPACE", sub: "Allocating secure environment resources..." },
        { title: "ESTABLISHING SECURE UPLINK", sub: "Verifying encrypted handshake protocols..." },
        { title: "LOADING ASSESSMENT MODULES", sub: "Retrieving role-specific evaluation criteria..." },
        { title: "SYNCHRONIZING CONTEXT ENGINE", sub: "Injecting resume data and technical parameters..." },
        { title: "CALIBRATING AI MODELS", sub: "Optimizing neural response latency..." },
        { title: "CONFIGURING AUDIO STREAMS", sub: "Setting up noise cancellation inputs..." },
        { title: "GENERATING INTERVIEW GRAPH", sub: "Building dynamic question logic pathways..." },
        { title: "VERIFYING SYSTEM INTEGRITY", sub: "Running final diagnostic checks..." },
        { title: "BUFFERING ASSETS", sub: "Pre-loading high-fidelity interface elements..." },
        { title: "LAUNCHING SEQUENCED PROTOCOL", sub: "Activating live simulation interface..." }
    ];

    const [currentStep, setCurrentStep] = useState(0);
    const [tokenReady, setTokenReady] = useState(null);

    // 1. Fetch Token Immediately (Background)
    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchToken = async () => {
            try {
                const response = await fetch(`http://localhost:3000/getToken?type=${type || 'default'}`);
                const data = await response.json();
                setTokenReady(data.token);
            } catch (error) {
                console.error("Failed to fetch token:", error);
            }
        };
        fetchToken();
    }, [type]);

    // 2. Run Sequence Animation
    useEffect(() => {
        if (currentStep < loadingSteps.length - 1) {
            const timer = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, 600); // 600ms per step = ~6 seconds total
            return () => clearTimeout(timer);
        } else if (currentStep === loadingSteps.length - 1) {
            // Sequence done. Check if token is ready.
            if (tokenReady) {
                // Add a small delay for the final step to be readable before switching
                const finalDelay = setTimeout(() => {
                    setToken(tokenReady);
                }, 800);
                return () => clearTimeout(finalDelay);
            }
            // If token not ready yet, it will wait here until tokenReady changes
        }
    }, [currentStep, tokenReady]);

    const activeStep = loadingSteps[currentStep];
    const progress = ((currentStep + 1) / loadingSteps.length) * 100;

    if (!token) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#030014] text-foreground relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="perspective-grid" />
                    <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] rounded-full bg-indigo-600/20 blur-[100px] animate-pulse-slow" />
                </div>
                <motion.div
                    key="loader"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center gap-8 z-10 glass-panel p-12 rounded-3xl border-white/10 shadow-2xl relative w-full max-w-xl"
                >
                    <div className="absolute inset-0 z-0 pointer-events-none rounded-3xl overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-border-beam" />
                    </div>

                    <div className="relative">
                        <div className="w-24 h-24 rounded-full border-r-2 border-t-2 border-indigo-500 animate-spin" />
                        <div className="absolute inset-0 rounded-full border-l-2 border-b-2 border-purple-500 animate-[spin_1.5s_linear_infinite_reverse]" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Cpu className="w-8 h-8 text-white animate-pulse" />
                        </div>
                    </div>

                    <div className="text-center space-y-4 w-full">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeStep.title} // Triggers animation on change
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-2"
                            >
                                <h2 className="text-2xl font-display font-bold tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                                    {activeStep.title}
                                </h2>
                                <p className="text-indigo-400 font-mono text-xs tracking-widest uppercase">
                                    {activeStep.sub}
                                </p>
                            </motion.div>
                        </AnimatePresence>

                        {/* Progress Bar */}
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-6">
                            <motion.div
                                className="h-full bg-indigo-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5, ease: "linear" }}
                            />
                        </div>
                        <div className="flex justify-between text-[10px] font-mono text-muted uppercase">
                            <span>Step {currentStep + 1}/{loadingSteps.length}</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <LiveKitRoom
            video={true}
            audio={true}
            token={token}
            serverUrl={SERVER_URL}
            data-lk-theme="default"
            className="h-screen w-full bg-[#030014] overflow-hidden relative font-sans"
            onDisconnected={() => navigate('/')}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="absolute inset-0 z-0"
            />

            {/* Ambient Background & Grid */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <ParticleBackground />
                <div className="perspective-grid opacity-30" />
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px]" />
            </div>

            <RoomContent />
            <RoomAudioRenderer />
            <StartAudio label="Click to allow audio playback" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-indigo-600 text-white px-6 py-3 rounded-full font-bold shadow-2xl hover:bg-indigo-700 transition-colors" />
        </LiveKitRoom>
    );
};


const ParticipantTile = ({ track, participant, isLocal }) => {
    const isSpeaking = useIsSpeaking(participant);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
            className={`relative w-full aspect-video rounded-[2rem] overflow-hidden border transition-all duration-300 isolate group ${isSpeaking
                ? 'border-indigo-500/50 shadow-[0_0_50px_-10px_rgba(99,102,241,0.5)]'
                : 'border-white/5 hover:border-white/10'
                } bg-black/40 backdrop-blur-sm`}
        >
            {/* Corner Accents (HUD style) */}
            <div className={`absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 rounded-tl-xl transition-colors duration-300 ${isSpeaking ? 'border-indigo-500' : 'border-white/10'}`} />
            <div className={`absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 rounded-br-xl transition-colors duration-300 ${isSpeaking ? 'border-indigo-500' : 'border-white/10'}`} />

            {track ? (
                <VideoTrack trackRef={track} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full bg-[#05050a] flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

                    <div className={`w-40 h-40 rounded-full flex items-center justify-center relative z-10 transition-transform duration-300 ${isSpeaking ? "scale-110" : "scale-100"}`}>
                        {/* Complex Audio Ripple */}
                        {isSpeaking && (
                            <>
                                <div className="absolute inset-0 rounded-full border border-indigo-500/30 animate-[ping_1.5s_ease-out_infinite]" />
                                <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 animate-[ping_2s_ease-out_infinite] delay-75" />
                                <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-xl animate-pulse" />
                            </>
                        )}

                        <div className={`w-32 h-32 rounded-full flex items-center justify-center ${isLocal ? 'bg-zinc-900 border border-white/10' : 'bg-gradient-to-tr from-indigo-600 to-purple-600'} shadow-2xl relative overflow-hidden`}>
                            {!isLocal && <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay" />}
                            <span className="text-5xl filter drop-shadow-lg z-10">{isLocal ? "👤" : "🤖"}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Name Tag HUD */}
            <div className="absolute bottom-6 left-8 z-20">
                <div className="glass-panel px-5 py-2.5 rounded-full flex items-center gap-3 border-white/10">
                    <div className={`relative w-2.5 h-2.5 flex items-center justify-center`}>
                        <div className={`absolute inset-0 rounded-full ${isSpeaking ? "bg-green-500 animate-ping opacity-75" : ""}`} />
                        <div className={`relative w-2 h-2 rounded-full ${isSpeaking ? "bg-green-500" : "bg-zinc-500"}`} />
                    </div>
                    <span className="text-sm font-bold tracking-wider text-white">{isLocal ? "CANDIDATE" : "AI INTERVIEWER"}</span>
                    {!isLocal && (
                        <div className="flex items-center gap-1.5 ml-2 px-1.5 py-0.5 bg-indigo-500/20 border border-indigo-500/30 rounded text-[10px] font-mono text-indigo-300">
                            <Wifi className="w-3 h-3" />
                            LIVE
                        </div>
                    )}
                </div>
            </div>

            {/* Audio Visualizer (Simulated) */}
            {isSpeaking && !isLocal && (
                <div className="absolute top-8 right-8 flex gap-1 items-end h-8">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div
                            key={i}
                            className="w-1.5 bg-indigo-400 rounded-full animate-[pulse_0.4s_ease-in-out_infinite]"
                            style={{
                                height: `${Math.random() * 60 + 40}%`,
                                animationDelay: `${i * 0.05}s`,
                                opacity: 0.8
                            }}
                        />
                    ))}
                </div>
            )}
        </motion.div>
    );
};

const RoomContent = () => {
    const tracks = useTracks([
        { source: Track.Source.Camera, withPlaceholder: true },
        { source: Track.Source.ScreenShare, withPlaceholder: false },
    ]);

    const room = useRoomContext();
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCamOn, setIsCamOn] = useState(true);
    const [showAssets, setShowAssets] = useState(false);

    const toggleMic = async () => {
        if (room.localParticipant) {
            const newState = !isMicOn;
            await room.localParticipant.setMicrophoneEnabled(newState);
            setIsMicOn(newState);
        }
    };

    const toggleCam = async () => {
        if (room.localParticipant) {
            const newState = !isCamOn;
            await room.localParticipant.setCameraEnabled(newState);
            setIsCamOn(newState);
        }
    };

    const leaveRoom = () => room.disconnect();

    const localTrack = tracks.find(t => t.participant.isLocal);
    const remoteTracks = tracks.filter(t => !t.participant.isLocal);
    const agentTrack = remoteTracks.length > 0 ? remoteTracks[0] : null;
    const agentParticipant = agentTrack?.participant;

    return (
        <div className="h-full flex flex-col relative z-10 p-4 md:p-6">
            {/* Top Bar HUD */}
            <header className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity" />
                            <span className="text-white font-black text-xl tracking-tighter">PV</span>
                        </div>
                        <div>
                            <h1 className="font-display font-bold text-lg tracking-tight leading-none">PracterViews</h1>
                            <span className="text-[10px] font-mono text-indigo-400 tracking-widest uppercase">Simulation Room 01</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/20 border border-white/5 text-xs text-muted font-mono">
                        <Activity className="w-3 h-3 text-green-500" />
                        <span>{agentParticipant ? "SYSTEM: STABLE" : "SYSTEM: WAITING"}</span>
                    </div>

                    <motion.button
                        onClick={() => setShowAssets(!showAssets)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`
                            flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all
                            border backdrop-blur-md shadow-lg
                            ${showAssets
                                ? 'bg-indigo-500 text-white border-indigo-400 shadow-indigo-500/20'
                                : 'glass-panel text-white hover:bg-white/10'
                            }
                        `}
                    >
                        <FileText className="w-4 h-4" />
                        <span>Assets</span>
                    </motion.button>
                </div>
            </header>

            {/* Main Stage - Discord Grid Layout */}
            <div className="flex-1 flex flex-col justify-center min-h-0 relative z-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full max-h-[80vh]">

                    {/* Agent View (Left/Top) */}
                    <div className="relative w-full h-full min-h-[300px] flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            {agentParticipant ? (
                                <ParticipantTile key="agent" track={agentTrack} participant={agentParticipant} isLocal={false} />
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-full max-w-4xl aspect-video rounded-[1.5rem] border border-white/5 bg-[#0a0a0f] flex flex-col items-center justify-center gap-6 relative overflow-hidden group shadow-inner"
                                >
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay" />
                                    <div className="relative z-10 flex flex-col items-center gap-4">
                                        <div className="w-24 h-24 rounded-full border border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-center">
                                            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                                        </div>
                                        <div className="text-center">
                                            <h3 className="text-lg font-medium text-white">Connecting to Agent...</h3>
                                            <p className="text-indigo-400/60 text-xs font-mono tracking-widest">ESTABLISHING UPLINK</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* User View (Right/Bottom) */}
                    <div className="relative w-full h-full min-h-[300px] flex items-center justify-center">
                        {room.localParticipant ? (
                            <ParticipantTile track={localTrack} participant={room.localParticipant} isLocal={true} />
                        ) : (
                            <div className="w-full max-w-4xl aspect-video rounded-[1.5rem] bg-[#0a0a0f] border border-white/5 flex items-center justify-center text-gray-500">
                                <Loader2 className="w-8 h-8 animate-spin" />
                            </div>
                        )}
                    </div>
                </div>


            </div>

            {/* Float Dock Controls */}
            <div className="flex justify-center mt-6 mb-2">
                <motion.div
                    className="glass-panel px-8 py-4 rounded-full flex items-center gap-8 shadow-2xl shadow-indigo-900/20 border border-white/10 bg-black/40 backdrop-blur-xl"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                >
                    <div className="flex items-center gap-4">
                        <ControlButton
                            onClick={toggleMic}
                            isActive={isMicOn}
                            onIcon={<Mic />}
                            offIcon={<MicOff />}
                            activeClass="bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                            inactiveClass="bg-red-500/20 text-red-500 border border-red-500/30"
                        />
                        <ControlButton
                            onClick={toggleCam}
                            isActive={isCamOn}
                            onIcon={<Video />}
                            offIcon={<VideoOff />}
                            activeClass="bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                            inactiveClass="bg-red-500/20 text-red-500 border border-red-500/30"
                        />
                    </div>

                    <div className="w-px h-10 bg-white/10" />

                    <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: "#ef4444" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={leaveRoom}
                        className="px-8 py-4 bg-red-600/90 text-white rounded-full font-bold text-sm flex items-center gap-2 shadow-lg shadow-red-500/20 transition-all border border-red-500/50"
                    >
                        <PhoneOff className="w-4 h-4" />
                        TERMINATE
                    </motion.button>
                </motion.div>
            </div>
            {/* Assets Panel Overlay */}
            <AnimatePresence>
                {showAssets && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAssets(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ x: "100%", opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: "100%", opacity: 0 }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0a0a0f] border-l border-white/10 p-8 flex flex-col gap-6 z-50 shadow-2xl"
                        >
                            <div className="flex items-center justify-between pb-6 border-b border-white/5">
                                <h3 className="font-display font-bold text-xl flex items-center gap-3 text-white">
                                    <div className="p-2 rounded-lg bg-indigo-500/20">
                                        <FileText className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    Context Assets
                                </h3>
                                <button
                                    onClick={() => setShowAssets(false)}
                                    className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-10 pr-2 custom-scrollbar">
                                <section>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-1.5 h-6 bg-indigo-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
                                        <div>
                                            <h4 className="text-sm font-bold text-white tracking-wide uppercase">Resume Data</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">Upload PDF for AI analysis</p>
                                        </div>
                                    </div>
                                    <ResumeUploader />
                                </section>

                                <section>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-1.5 h-6 bg-purple-600 rounded-full shadow-[0_0_10px_rgba(147,51,234,0.5)]" />
                                        <div>
                                            <h4 className="text-sm font-bold text-white tracking-wide uppercase">GitHub Profile</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">Link repositories for technical context</p>
                                        </div>
                                    </div>
                                    <GithubInput />
                                </section>
                            </div>

                            <div className="pt-6 border-t border-white/5">
                                <p className="text-xs text-center text-gray-600">
                                    Uploaded assets are processed securely in real-time.
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

const ControlButton = ({ onClick, isActive, onIcon, offIcon, activeClass, inactiveClass }) => (
    <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? activeClass : inactiveClass}`}
    >
        {isActive ? React.cloneElement(onIcon, { size: 24 }) : React.cloneElement(offIcon, { size: 24 })}
    </motion.button>
);

export default InterviewRoom;
