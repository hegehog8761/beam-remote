import os, platform, ctypes, sys

if platform.platform() == "Linux" or "Linux" in platform.platform():
    if os.getuid() != 0:
        # Request admin as not already ran
        os.execvp('sudo', ['sudo', sys.executable] + sys.argv)
    os.system("sudo apt install avahi-daemon python3-tk python3-dev -y")

    

    os.system(f"cd {os.path.dirname(os.path.realpath(__file__))}")
    if os.path.exists(f"{os.path.dirname(os.path.realpath(__file__))}/linux-venv"):
        print("This tool already appears to be set up!")
        exit(0)
    os.system("python3 -m venv linux-venv")
    os.system("./linux-venv/bin/pip install -r requirements.txt")
    user_folder = "/home"
    users = [f for f in os.listdir(user_folder) if os.path.isdir(os.path.join(user_folder, f))]
    

    # Find beamng directory / ask for it to be given
elif platform.platform() == "Windows" or "Windows" in platform.platform():
    if not ctypes.windll.shell32.IsUserAnAdmin():
        ctypes.windll.shell32.ShellExecuteW(None, "runas", sys.executable, " ".join(sys.argv), None, 1)
    # Check if bonjour downloaded, if not install it
    
