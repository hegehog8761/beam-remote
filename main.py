import os, sys, platform, ctypes, atexit, server, address_register

original_hostname = "some-device"

def exit_program():
    print("Exiting...")
    if platform.platform() == "Linux":
        address_register.linux()
    sys.exit(0)

atexit.register(exit_program)

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
    exit_program()

exit_program()


# print(base_hosts)
    

