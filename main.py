# from flask import *



# app = Flask(__name__)

# @app.route("/")
# def home():
#     return "homepage"

# app.run(host="beamcontroller.local")

import os, signal, sys, ujson, flask, time, pyautogui
from pynput.keyboard import Key, Controller

"""
if os.name == "posix":
    if os.getuid() != 0:
        # Request admin as not already ran
        print("This application requires admin privilidges")
        os.execvp('sudo', ['sudo', sys.executable] + sys.argv)
    # Set up beamremote.local as ip address
    base_hosts = open("/etc/hosts").read()
    if "127.0.0.1 beamremote.local" not in base_hosts:
        open("/etc/hosts", "a").write("\n127.0.0.1 beamremote.local\n")
    else:
        print("The address used for the remote is already registered to this device, it will automatically be de-registered when this script stops")
elif os.name == "nt":
    print("Windows setup is not complete yet, exiting...")
    sys.exit(1)
""" # Removed as couldn't get beamremote.local to work for now

print("Started")
if os.getuid() != 0:
    # Request admin as not already ran
    os.execvp('sudo', ['sudo', sys.executable] + sys.argv)
    print("After")

app = flask.Flask(__name__)
#pyautogui = Controller()

def tap_key(key):
    pyautogui.keyDown(key)
    time.sleep(0.1)
    pyautogui.keyUp(key)


@app.route("/")
def home():
    return flask.send_file("index.html")

@app.route("/settings")
def settings():
    return flask.send_file("settings.html")

@app.route("/style.css")
def style():
    return flask.send_file("style.css")

@app.route("/icons/<path:path>")
def icon(path):
    if os.path.exists(f"icons/{path}"):
        return flask.send_file(f"icons/{path}")
    return flask.send_file("404.html"), 404

@app.route("/scripts/<path:path>")
def home_script(path):
    if os.path.exists(f"scripts/{path}"):
        return flask.send_file(f"scripts/{path}")
    return flask.send_file("404.html"), 404

@app.route("/404")
def not_found():
    return flask.send_file("404.html")

@app.route("/get_settings", methods=['GET'])
def get_settings():
    return flask.jsonify(ujson.load(open("profile.json")))

@app.route("/set_settings", methods=['POST'])
def set_settings():
    payload = flask.request.get_json(force=True)
    ujson.dump(payload, open("profile.json", "w"), indent=4)
    return "OK", 200

@app.route("/press_key", methods=['POST'])
def press_key():
    payload = flask.request.get_json(force=True)
    tap_key(payload["keyCode"])
    return "OK", 200

@app.route("/key_down", methods=['POST'])
def key_down():
    payload = flask.request.get_json(force=True)
    pyautogui.keyDown(payload["keyCode"])
    return "OK", 200

@app.route("/key_up", methods=['POST'])
def key_up():
    payload = flask.request.get_json(force=True)
    pyautogui.keyUp(payload["keyCode"])
    return "OK", 200

@app.route("/get_bind_locales", methods=['GET'])
def get_bind_locales():
    return flask.jsonify(ujson.load(open("bind_locales.json")))

@app.route("/<path:path>")
def unknown(path):
    return flask.redirect("/404", 404)

app.run(host="0.0.0.0", port=80)

# print(base_hosts)
    

