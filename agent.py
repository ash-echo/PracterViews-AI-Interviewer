from dotenv import load_dotenv

from livekit import agents, rtc
from livekit.agents import AgentServer, AgentSession, Agent, room_io
from livekit.plugins import (
    google,
    noise_cancellation,
)
from prompts import INTERVIEW_PROMPTS
from livekit.plugins import tavus
import os
import json

load_dotenv(".env")

class Assistant(Agent):
    def __init__(self, interview_type="default") -> None:
        instructions = INTERVIEW_PROMPTS.get(interview_type, INTERVIEW_PROMPTS["default"])
        super().__init__(instructions=instructions)

server = AgentServer()

@server.rtc_session()
async def my_agent(ctx: agents.JobContext):
    session = AgentSession(
        llm=google.realtime.RealtimeModel(
            voice="Aoede",  # Female voice
            model="gemini-2.5-flash-native-audio-preview-09-2025"
        )
    )

    @session.on("conversation_item_added")
    def on_item_added(event: agents.ConversationItemAddedEvent):
        item = event.item
        if item.type == "message":
            if item.role == "assistant" and item.text_content:
                print(f"Agent: {item.text_content}")
            elif item.role == "user" and item.text_content:
                print(f"User: {item.text_content}")

    # Determine interview type from participant metadata
    interview_type = "default"
    
    # Check existing participants (if any)
    for p in ctx.room.remote_participants.values():
        if p.metadata:
            try:
                meta = json.loads(p.metadata)
                if "type" in meta:
                    interview_type = meta["type"]
                    print(f"Found existing participant with type: {interview_type}")
                    break
            except:
                pass

    # Also listen for new participants joining (in case agent joins first)
    @session.on("participant_joined")
    def on_participant_joined(participant: rtc.RemoteParticipant):
        nonlocal interview_type
        if participant.metadata:
            try:
                meta = json.loads(participant.metadata)
                if "type" in meta:
                    interview_type = meta["type"]
                    print(f"Participant joined with type: {interview_type}")
            except:
                pass

    avatar = tavus.AvatarSession(
        replica_id=os.environ.get("REPLICA_ID"),
        persona_id=os.environ.get("PERSONA_ID"),
        api_key=os.environ.get("TAVUS_API_KEY"),
    )
    
    try:
        await avatar.start(session, room=ctx.room)
    except Exception as e:
        print(f"Avatar failed to start: {e}")

    await session.start(
        room=ctx.room,
        agent=Assistant(interview_type=interview_type),
        room_options=room_io.RoomOptions(
            audio_input=room_io.AudioInputOptions(
                noise_cancellation=lambda params: noise_cancellation.BVCTelephony() if params.participant.kind == rtc.ParticipantKind.PARTICIPANT_KIND_SIP else noise_cancellation.BVC(),
            ),
        ),
    )

    await session.generate_reply(
        instructions="Greet the candidate professionally based on the context of the interview. You should only primary speak in english and speak in other languages only when the user asks you to do so."
    )


if __name__ == "__main__":
    agents.cli.run_app(server)