import flask
import flask_cors
from .anime_api import *
import random
import string
import json
import base64

app = flask.Flask(__name__)
app.config['SECRET_KEY'] = 'dafoiadqoe8u3q4678279389ihfhds6f536879480902kcsdb'
flask_cors.CORS(app, resources={r"/*": {"origins": "*", "allow_headers": "*", "expose_headers": "*"}})
API = API()

current_anime = {
    "name" : "",
    "link" : ""
}

def _get_comments():
    try:
        with open('back_end/database/comments.json', 'r') as f:
            data = f.read()
            if not data:
                return {}  # Initialize with an empty dictionary if the file is empty
            return json.loads(data)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}

'''
{
    anime_name : {
        id : {
            user_name : '',
            comment : ''
        }
    }
}
'''

def _add_comments(anime_name, user_name, comment):
    comments = _get_comments()
    if anime_name not in comments:
        comments[anime_name] = []
    anime_comments = comments[anime_name]
    anime_comments.insert(0, {
        'user_name' : user_name,
        'comment' : comment
    })
    with open('back_end/database/comments.json', 'w') as f:
        f.write(json.dumps(comments))

@app.route('/getComments/<string:anime_name>')
def getComments(anime_name):
    comms = _get_comments()
    if anime_name not in comms:
        return []
    return comms[anime_name]

@app.route('/addComment/<string:anime_name>/<string:user_name>/<string:comment>')
def addComment(anime_name, user_name, comment):
    _add_comments(anime_name, user_name, comment)
    return {'success' : 'true'}

def _get_users():
    with open('back_end/database/users.json') as f:
        content = f.read()
        print(content)
        if content != '':
            users = json.load(f)
        else:
            users = {'len' : 0}
    return users

def _add_users(name, details):
    users = _get_users()
    if name in users:
        return False
    users[name] = details
    with open('back_end/database/users.json', 'w') as f:
        f.write(json.dumps(users))
    return True

@app.route('/signup/', methods=["POST"])
def signup():
    data = flask.request.get_json()
    name = data["name"]
    email = data["email"]
    password = data["pass"]
    image = data["img"].replace("data:image/jpeg;base64,", "")

    with open(f'back_end/database/images/{name}.jpeg', 'wb') as file:
        file.write(base64.decodebytes(bytes(image, encoding='utf-8')))

    if _add_users(name, {"email" : email, "password" : password, "image" : f'back_end/database/images/{name}.jpeg'}):
        return {"success" : True, "msg" : "Account Created"}
    return {"success" : False, "msg" : "Username already exists"}

@app.route('/signin/<string:name>/<string:key>')
def signin(name, key):
    users = _get_users()
    if name in users:
        return {"success" : True, name : users[name]}
    return {"success" : False, "msg" : "Account Does Not Exist"}

@app.route('/getAnimeInfo/<string:link>')
def getAnimeInfo(link):
    print(link)
    return API.getAnimeInfo(link)

@app.route('/getAnime/<string:name>')
def getAnime(name):
    print(name)
    return API.getAnime(name)

@app.route('/getAnimeName/')
def getAnimeName():
    print("2", current_anime)
    return current_anime

@app.route("/getAnimeVideoURL/<string:link>/<int:ep_num>")
def getAnimeVideoURL(link, ep_num):
    url = API.getAnimeVideoURL(link, ep_num)
    print(link, url)
    return url

@app.route('/setAnime', methods=['POST'])
def setAnime():
    global current_anime
    if flask.request.method == 'POST':
        current_anime = flask.request.get_json()
        print("1", current_anime, type(current_anime))
        if current_anime["name"] == "":
            return {"success" : "false"}
        return {"success" : "true"}
    return ''
