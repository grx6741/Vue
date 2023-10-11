import flask
import flask_cors
from .anime_api import *

app = flask.Flask(__name__)
flask_cors.CORS(app, resources={r"/*": {"origins": "*", "allow_headers": "*", "expose_headers": "*"}})
API = API()

@app.route('/')
def home():
    return "<h1>Server is UP and RUNNING</h1>"

@app.route('/getAnimeInfo/<string:link>')
def getAnimeInfo(link):
    return API.getAnimeInfo(link)

@app.route('/getAnime/<string:name>')
def getAnime(name):
    print(name)
    return API.getAnime(name)
