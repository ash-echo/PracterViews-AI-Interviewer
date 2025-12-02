import os
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
from livekit import api
from dotenv import load_dotenv

load_dotenv()

LIVEKIT_URL = os.getenv("LIVEKIT_URL")
LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET")

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

                token.with_identity(participant_identity) \
                    .with_name(participant_name) \
                    .with_metadata(metadata) \
                    .with_grants(api.VideoGrants(
                        room_join=True,
                        room="playground-8sOe-iyTl", 
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
                    "type": interview_type
                }
                self.wfile.write(json.dumps(response).encode())
            except Exception as e:
                self.send_response(500)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode())
        else:
            self.send_response(404)
            self.end_headers()

def run(server_class=HTTPServer, handler_class=TokenHandler, port=3000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f"Token server running on port {port}")
    httpd.serve_forever()

if __name__ == '__main__':
    run()
