import os
from zeroconf import ServiceInfo, Zeroconf
import socket
zeroconf = None

def linux():
    os.system("sudo hostnamectl set-hostname beam-remote")
    with open("/etc/hosts", "a") as hosts:
        hosts.write("\n127.0.1.1    beam-remote")
    os.system("sudo systemctl restart avahi-daemon")


def linux_revert(original_hostname):
    os.system(f"sudo hostnamectl set-hostname {original_hostname}")
    with open("/etc/hosts", "r") as hosts_read:
        host_lines = hosts_read.readlines()
    with open("/etc/hosts", "w") as hosts_write:
        for line in host_lines:
            if not "beam-remote" in line:
                hosts_write.write(line)
    os.system("sudo systemctl restart avahi-daemon")
        

def windows():
    ip = socket.inet_aton(socket.gethostbyname(socket.gethostname()))
    info = ServiceInfo(
        "_http._tcp.local.",
        "beam-remote._http._tcp.local.",
        addresses=[ip],
        port=80,
        properties={}
    )
    zeroconf = Zeroconf()
    zeroconf.register_service(info)

def windows_revert():
    ip = socket.inet_aton(socket.gethostbyname(socket.gethostname()))
    info = ServiceInfo(
        "_http._tcp.local.",
        "beam-remote._http._tcp.local.",
        addresses=[ip],
        port=80,
        properties={}
    )
    zeroconf.unregister_service(info)
    zeroconf.close()