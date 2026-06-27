import subprocess
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

def run_adb_command(args, device_id=None):
    cmd = [settings.ADB_PATH]
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

def send_comment_via_adb(device_id: str, text: str):
    # This uses ADBKeyboard broadcast to support Vietnamese characters
    # If ADBKeyboard is not installed, this will fail silently on the device side
    # A robust production version would check for the keyboard or fallback to base64 encoding tricks.
    logger.info(f"Sending comment to {device_id}: {text}")
    
    # Using ADBKeyboard broadcast
    escaped_text = text.replace('"', '\\"').replace("'", "\\'")
    run_adb_command(["shell", "am", "broadcast", "-a", "ADB_INPUT_TEXT", "--es", "msg", f'"{escaped_text}"'], device_id)
    
    # Send ENTER keyevent (keycode 66) to submit the comment in TikTok
    run_adb_command(["shell", "input", "keyevent", "66"], device_id)
