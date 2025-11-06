import os, system

if platform.platform() == "Linux" or "Linux" in platform.platform():
    if os.getuid() != 0:
        # Request admin as not already ran
        os.execvp('sudo', ['sudo', sys.executable] + sys.argv)
      os.system("sudo apt install hostnamectl -y")
elif platform.platform() == "Windows" or "Windows" in platform.platform():
    if not ctypes.windll.shell32.IsUserAnAdmin():
        ctypes.windll.shell32.ShellExecuteW(None, "runas", sys.executable, " ".join(sys.argv), None, 1)
    # Check if bonjour downloaded, if not install it
    
