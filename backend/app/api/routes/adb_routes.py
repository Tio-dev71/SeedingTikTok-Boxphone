from fastapi import APIRouter, BackgroundTasks, HTTPException
from typing import List
from pydantic import BaseModel
from app.services.adb_service import get_connected_devices, send_comment_via_adb, run_adb_command

router = APIRouter()

class CommentPayload(BaseModel):
    device_id: str
    text: str

@router.get("/devices/scan", response_model=List[str])
def scan_devices():
    try:
        devices = get_connected_devices()
        return devices
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/devices/send-comment")
def send_comment(payload: CommentPayload, background_tasks: BackgroundTasks):
    devices = get_connected_devices()
    if payload.device_id not in devices:
        raise HTTPException(status_code=404, detail="Device not found or not connected via ADB")
    
    background_tasks.add_task(send_comment_via_adb, payload.device_id, payload.text)
    return {"status": "sending in background", "device_id": payload.device_id}

@router.post("/devices/setup-keyboard")
def setup_keyboard():
    devices = get_connected_devices()
    for device in devices:
        run_adb_command(["shell", "ime", "enable", "com.android.adbkeyboard/.AdbIME"], device)
        run_adb_command(["shell", "ime", "set", "com.android.adbkeyboard/.AdbIME"], device)
    return {"status": "success", "devices_configured": len(devices)}
