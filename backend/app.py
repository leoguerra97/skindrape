from flask import Flask, send_from_directory
from routes import configure_routes
from flask_cors import CORS

app = Flask(__name__)
#CORS(app)  # This will enable CORS for all routes, for a production environment, you should configure CORS more restrictively
#CORS(app, resources={r"/api/*": {"origins": "http://localhost:5000"}})
CORS(app, resources={r"/*": {"origins": "*"}})

# Configure routes
configure_routes(app)

if __name__ == '__main__':
    app.run(debug=True)
