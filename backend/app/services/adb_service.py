import subprocess
import logging
import os
from app.core.config import settings

logger = logging.getLogger(__name__)

# Fix python-dotenv escaping Windows paths (e.g. \a becomes \x07)
CLEAN_ADB_PATH = settings.ADB_PATH.replace("\x07", "a").replace("\u0007", "a").replace("\t", "t").replace("\n", "n").replace("\r", "r")

# If the parsed path doesn't exist but the literal hardcoded one does, use the literal one
if not os.path.exists(CLEAN_ADB_PATH) and os.path.exists(r"C:\Program Files (x86)\xiaowei\tools\adb.exe"):
    CLEAN_ADB_PATH = r"C:\Program Files (x86)\xiaowei\tools\adb.exe"

def run_adb_command(args, device_id=None):
    if not os.path.exists(CLEAN_ADB_PATH):
        raise Exception(f"ADB file not found at: '{CLEAN_ADB_PATH}'. Please check your .env file.")
    
    cmd = [CLEAN_ADB_PATH]
    if device_id:
        cmd.extend(["-s", device_id])
    cmd.extend(args)
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        logger.error(f"ADB command failed: {e.stderr}")
        return None

def get_connected_devices():
    output = run_adb_command(["devices"])
    if not output:
        return []
    
    devices = []
    lines = output.splitlines()
    for line in lines[1:]: # Skip the "List of devices attached" header
        if line.strip():
            parts = line.split()
            if len(parts) >= 2 and parts[1] == "device":
                devices.append(parts[0])
    return devices

import base64

def send_comment_via_adb(device_id: str, text: str):
    logger.info(f"Sending comment to {device_id}: {text}")
    
    # Use ADBKeyboard base64 broadcast to safely transmit Vietnamese characters
    # This bypasses all Windows/adb shell encoding issues
    encoded_text = base64.b64encode(text.encode('utf-8')).decode('utf-8')
    run_adb_command(["shell", "am", "broadcast", "-a", "ADB_INPUT_B64", "--es", "msg", encoded_text], device_id)
    
    # Send ENTER keyevent (keycode 66) to submit the comment in TikTok
    run_adb_command(["shell", "input", "keyevent", "66"], device_id)
