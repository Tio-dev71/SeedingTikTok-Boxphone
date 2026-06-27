from fastapi import APIRouter, BackgroundTasks, HTTPException
from typing import List
from pydantic import BaseModel
from app.services.adb_service import get_connected_devices, send_comment_via_adb, run_adb_command

router = APIRouter()

from typing import Optional

class CommentPayload(BaseModel):
    device_id: str
    text: str
    tap_x: Optional[int] = None
    tap_y: Optional[int] = None

@router.get("/devices/scan", response_model=List[str])
def scan_devices():
    try:
        devices = get_connected_devices()
        return devices
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/devices/send-comment")
def send_comment(payload: CommentPayload, background_tasks: BackgroundTasks):
    if not payload.device_id or not payload.text:
        raise HTTPException(status_code=400, detail="Missing device_id or text")
    
    background_tasks.add_task(send_comment_via_adb, payload.device_id, payload.text, payload.tap_x, payload.tap_y)
    return {"status": "sending in background", "device_id": payload.device_id}

@router.post("/devices/setup-keyboard")
def setup_keyboard():
    devices = get_connected_devices()
    for device in devices:
        run_adb_command(["shell", "ime", "enable", "com.android.adbkeyboard/.AdbIME"], device)
        run_adb_command(["shell", "ime", "set", "com.android.adbkeyboard/.AdbIME"], device)
    return {"status": "success", "devices_configured": len(devices)}
