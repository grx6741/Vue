import flask

app = flask.Flask(__name__)

@app.route('/')
def home():
    return "<h1>Server is UP and RUNNING</h1>"
