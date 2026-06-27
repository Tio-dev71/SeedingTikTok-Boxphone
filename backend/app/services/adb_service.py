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
import time
import re

def get_screen_size(device_id: str):
    try:
        output = run_adb_command(["shell", "wm", "size"], device_id)
        if output:
            match = re.search(r'(\d+)x(\d+)', output)
            if match:
                return int(match.group(1)), int(match.group(2))
    except Exception as e:
        logger.error(f"Could not get screen size for {device_id}: {e}")
    return 1080, 1920 # Default fallback

def send_comment_via_adb(device_id: str, text: str, tap_x: int = None, tap_y: int = None):
    logger.info(f"Sending comment to {device_id}: {text}")
    
    # Auto-calculate coordinates if not provided properly (e.g. user leaves it 150/1800 but it's a long screen)
    # Actually, let's always auto-calculate if tap_x is very small or we can just calculate a good default
    width, height = get_screen_size(device_id)
    
    # If user provided default 150/1800, override it with smart calculation based on actual height
    if tap_x == 150 and tap_y == 1800:
        tap_x = int(width * 0.2)
        tap_y = int(height * 0.92) # 92% down is usually safe for the chat box, avoiding the bottom nav bar
    elif tap_x is None or tap_y is None:
        tap_x = int(width * 0.2)
        tap_y = int(height * 0.92)

    logger.info(f"Tapping chat box at X:{tap_x} Y:{tap_y} for device {device_id} (Resolution: {width}x{height})")
    run_adb_command(["shell", "input", "tap", str(tap_x), str(tap_y)], device_id)
    time.sleep(0.5) # Wait for keyboard/textbox to focus
    
    # Use ADBKeyboard base64 broadcast to safely transmit Vietnamese characters
    # This bypasses all Windows/adb shell encoding issues
    encoded_text = base64.b64encode(text.encode('utf-8')).decode('utf-8')
    run_adb_command(["shell", "am", "broadcast", "-a", "ADB_INPUT_B64", "--es", "msg", encoded_text], device_id)
    
    # Send ENTER keyevent (keycode 66) to submit the comment in TikTok
    run_adb_command(["shell", "input", "keyevent", "66"], device_id)
