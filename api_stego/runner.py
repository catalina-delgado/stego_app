import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs
from generate_map import Map  
import os    

class RequestHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        parsed_path = urlparse(self.path)
        if parsed_path.path == '/api/generate_gradcam':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            post_params = parse_qs(post_data.decode('utf-8'))

            model_name = query_params.get('model_name', [None])[0]
            image_src = query_params.get('image_src', [None])[0]
            
            if not model_name:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "model_name parameter is required"}).encode())
                return
            
            if not image_src:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "image_src parameter is required"}).encode())
                return

            map = Map(model_name, image_src)
            gradcam_data = map.generate_gradcam()
            
            with open('api_data.json', 'w') as json_file:
                json.dump(gradcam_data, json_file)

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(gradcam_data).encode())
        elif parsed_path.path == '/api/models':
            models_dir = os.path.join(os.path.dirname(__file__), 'models')
            if not os.path.exists(models_dir):
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": f"Directory '{models_dir}' does not exist"}).encode())
                return
            
            models = [name for name in os.listdir(models_dir) if name.endswith('.hdf5')]
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(models).encode())
        else:
            self.send_response(404)
            self.end_headers()

def run(server_class=HTTPServer, handler_class=RequestHandler, port=8000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f'Starting server on port {port}...')
    httpd.serve_forever()

if __name__ == '__main__':
    run()