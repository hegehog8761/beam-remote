# from flask import *



# app = Flask(__name__)

# @app.route("/")
# def home():
#     return "homepage"

# app.run(host="beamcontroller.local")

import os, sys, platform, ctypes
from pynput.keyboard import Key, Controller
import server, address_register

original_hostname = "somedevice"

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


if platform.platform() == "Linux" or "Linux" in platform.platform():
    if os.getuid() != 0:
        # Request admin as not already ran
        os.execvp('sudo', ['sudo', sys.executable] + sys.argv)
    # Try to reserve beamremote.local
    original_hostname = os.popen("hostnamectl status").read().split("\n")[0].split("Static hostname: ")[1]
    address_register.linux()
elif platform.platform() == "Windows" or "Windows" in platform.platform():
    if not ctypes.windll.shell32.IsUserAnAdmin():
        ctypes.windll.shell32.ShellExecuteW(None, "runas", sys.executable, " ".join(sys.argv), None, 1)
    # Try to reserve beamremote.local
elif platform.platform() == "Darwin" or "Darwin" in platform.platform():
    print("MacOS functionality not implemented yet")
else:
    print("Unknown OS identified, this tool only supports Windows, MacOS (OS X) and Linux")
    sys.exit(1)

try:
    server.run()
except KeyboardInterrupt:
    print("Exiting...")
    if platform.platform() == "Linux":
        address_register.linux()
    sys.exit(0)

print("Exiting...")
if platform.platform() == "Linux" or "Linux" in platform.platform():
    address_register.linux_revert(original_hostname)

# print(base_hosts)
    

