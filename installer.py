import os, platform, ctypes, sys

if platform.platform() == "Linux" or "Linux" in platform.platform():
    if os.getuid() != 0:
        # Request admin as not already ran
        os.execvp('sudo', ['sudo', sys.executable] + sys.argv)
    os.system("sudo apt install avahi-daemon -y")

    """

    os.system(f"cd {os.path.dirname(os.path.realpath(__file__))}")
    os.system("python3 -m venv ./beam-remote-venv")
    os.system("source ./beam-remote-venv/bin/activate")
    os.system("pip install -r requirements.txt")

    """ # This doesn't work :(
elif platform.platform() == "Windows" or "Windows" in platform.platform():
    if not ctypes.windll.shell32.IsUserAnAdmin():
        ctypes.windll.shell32.ShellExecuteW(None, "runas", sys.executable, " ".join(sys.argv), None, 1)
    # Check if bonjour downloaded, if not install it
    
