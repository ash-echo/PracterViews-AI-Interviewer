from http.server import BaseHTTPRequestHandler, HTTPServer
from livekit import api
import json
import os
from dotenv import load_dotenv

load_dotenv()

LIVEKIT_URL = os.environ.get("LIVEKIT_URL")
LIVEKIT_API_KEY = os.environ.get("LIVEKIT_API_KEY")
LIVEKIT_API_SECRET = os.environ.get("LIVEKIT_API_SECRET")

class TokenHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        if self.path.startswith('/getToken'):
            try:
                # Parse query parameters
                from urllib.parse import urlparse, parse_qs
                query_components = parse_qs(urlparse(self.path).query)
                interview_type = query_components.get('type', ['default'])[0]

                # Create a token
                token = api.AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET)
                
                # Give the user a random identity and name
                import uuid
                participant_identity = f"user-{str(uuid.uuid4())[:8]}"
                participant_name = "Candidate"

                # Create metadata JSON
                metadata = json.dumps({"type": interview_type})
                
                # Generate room name based on interview type
                # This makes it easier for the agent to know the context!
                room_name = f"{interview_type}-interview"
                
                print(f"[TOKEN_SERVER] Generating token for room: {room_name}, type: {interview_type}")

                token.with_identity(participant_identity) \
                    .with_name(participant_name) \
                    .with_metadata(metadata) \
                    .with_grants(api.VideoGrants(
                        room_join=True,
                        room=room_name,  # Dynamic room based on type!
                    ))

                jwt_token = token.to_jwt()

                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                response = {
                    "token": jwt_token,
                    "url": LIVEKIT_URL,
                    "identity": participant_identity,
                    "type": interview_type,
                    "room": room_name
                }
                self.wfile.write(json.dumps(response).encode())
            except Exception as e:
                print(f"Error generating token: {str(e)}")
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                error_response = {"error": str(e)}
                self.wfile.write(json.dumps(error_response).encode())

def run(server_class=HTTPServer, handler_class=TokenHandler, port=3000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f'Token server running on port {port}')
    httpd.serve_forever()

if __name__ == '__main__':
    run()
