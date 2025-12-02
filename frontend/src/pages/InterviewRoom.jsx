import React, { useState, useEffect } from 'react';
import { LiveKitRoom, useTracks, VideoTrack, useRoomContext, RoomAudioRenderer, useIsSpeaking } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const SERVER_URL = 'wss://practerview-qgcp05tt.livekit.cloud';

const InterviewRoom = () => {
    const [token, setToken] = useState("");
    const navigate = useNavigate();
    const { type } = useParams();

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await fetch(`http://localhost:3000/getToken?type=${type || 'default'}`);
                const data = await response.json();
                setToken(data.token);
            } catch (error) {
                console.error("Failed to fetch token:", error);
            }
        };
        fetchToken();
    }, [type]);

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-white">
                <div className="animate-pulse">Loading Interview Environment...</div>
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
            className="h-screen w-full bg-background overflow-hidden"
            onDisconnected={() => navigate('/')}
        >
            <RoomContent />
            <RoomAudioRenderer />
        </LiveKitRoom>
    );
};

// Sub-component to handle participant logic safely
const ParticipantTile = ({ track, participant, isLocal }) => {
    const isSpeaking = useIsSpeaking(participant);

    return (
        <div className={`relative bg-card rounded-2xl overflow-hidden border-2 transition-all duration-100 ease-in-out flex flex-col items-center justify-center ${isSpeaking ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'border-gray-800'
            }`}>
            {track ? (
                <VideoTrack trackRef={track} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                    {/* Placeholder if track is muted/missing but participant exists */}
                    <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
                        <span className="text-2xl font-bold">{isLocal ? "You" : "AI"}</span>
                    </div>
                </div>
            )}

            <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-full text-sm">
                {isLocal ? "Adrian (You)" : "AI Interviewer"}
            </div>
        </div>
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

    const leaveRoom = () => {
        room.disconnect();
    };

    // Separate tracks into local (User) and remote (AI Agent)
    const localTrack = tracks.find(t => t.participant.isLocal);
    const remoteTracks = tracks.filter(t => !t.participant.isLocal);

    // Assuming the first remote track is the AI agent
    const agentTrack = remoteTracks.length > 0 ? remoteTracks[0] : null;
    const agentParticipant = agentTrack?.participant;

    return (
        <div className="h-full flex flex-col p-6">
            {/* Header */}
            <header className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <span className="text-black font-bold">P</span>
                    </div>
                    <span className="text-xl font-bold">PrepWise</span>
                </div>
                <div className="text-sm text-gray-400">Interview in progress</div>
            </header>

            {/* Main Content Area - Split Screen */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                {/* Left: AI Interviewer */}
                {agentParticipant ? (
                    <ParticipantTile
                        track={agentTrack}
                        participant={agentParticipant}
                        isLocal={false}
                    />
                ) : (
                    // Placeholder while waiting for agent to join
                    <div className="relative bg-card rounded-2xl overflow-hidden border border-gray-800 flex flex-col items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-32 h-32 rounded-full bg-indigo-900/50 flex items-center justify-center animate-pulse">
                                <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center">
                                    <span className="text-4xl">🤖</span>
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold">AI Interviewer</h3>
                            <p className="text-gray-400 text-sm">Connecting...</p>
                        </div>
                        <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-full text-sm">
                            AI Interviewer
                        </div>
                    </div>
                )}

                {/* Right: User (You) */}
                {room.localParticipant ? (
                    <ParticipantTile
                        track={localTrack}
                        participant={room.localParticipant}
                        isLocal={true}
                    />
                ) : (
                    <div className="flex items-center justify-center border border-gray-800 rounded-2xl">
                        Loading Camera...
                    </div>
                )}

            </div>

            {/* Bottom Controls */}
            <div className="flex justify-center items-center gap-4">
                <button
                    onClick={toggleMic}
                    className={`p-4 rounded-full transition-colors ${isMicOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'}`}
                >
                    {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                </button>

                <button
                    onClick={toggleCam}
                    className={`p-4 rounded-full transition-colors ${isCamOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'}`}
                >
                    {isCamOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                </button>

                <button
                    onClick={leaveRoom}
                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-full font-medium transition-colors flex items-center gap-2"
                >
                    <PhoneOff className="w-5 h-5" />
                    End Interview
                </button>
            </div>
        </div>
    );
};

export default InterviewRoom;
