import json
import time
import subprocess
import platform
import socket
import psutil

def collect_host_info():
    uname = platform.uname()
    vm = psutil.virtual_memory()
    disk = psutil.disk_usage("/")

    return {
        "timestamp":       time.time(),
        "hostname":        socket.gethostname(),
        "os": {
            "system":     uname.system,
        },
        "cpu_usage_pct":   psutil.cpu_percent(interval=0.1),
        "memory": {
            "total":      vm.total,
            "available":  vm.available,
        },
        "disk": {
            "total":      disk.total,
            "free":       disk.free,
        },
    }

def dump_host_info(path="host_info.json"):
    data = collect_host_info()
    tmp = path + ".tmp"
    with open(tmp, "w") as f:
        json.dump(data, f, indent=2)
    # atomic replace
    import os; os.replace(tmp, path)