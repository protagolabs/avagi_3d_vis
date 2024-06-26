from fastapi import FastAPI, File, UploadFile
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import time
from utils.AvartarUtils import *
import uuid
from utils.S3Utils import S3Client
from pydantic import BaseModel
from utils.enums.FileTypeEnum import FileType
import os
from fastapi import Form


app = FastAPI()
s3_storage = S3Client()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "your public ipv4 address:8999"],  # Allows access from your React app
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class AvatarResponse(BaseModel):
    is_succeed: bool
    avatar_s3_link: str = None
    error_msg: str = None

class DownloadResponse(BaseModel):
    is_succeed: bool
    local_path: str = None
    error_msg: str = None

@app.post("/avagi/generate")
async def handle_event(frontFacing: UploadFile = File(...), leftFacing: UploadFile = File(...), rightFacing: UploadFile = File(...)):

    front_content = await frontFacing.read()
    left_content = await leftFacing.read()
    right_content = await rightFacing.read()

    file_name = f'{str(uuid.uuid4())}.glb'

    user_id = create_user()
    response = create_new_avatar(user_id)
    if response is None:
        return AvatarResponse(is_succeed=False, error_msg='failed to create new avatar')

    avatar_id, upload_url = response
    upload_image(upload_url, front_content, left_content, right_content)

    while True:
        response = list_created_avatars(user_id)
        if response is not None and len(response) > 0:
            break
        time.sleep(10) 
    avatars_data = response

    while True:
        export_data = export_avatar(avatars_data)
        if export_data is not None:
            status = export_data['status']
            if status == 'ready':
                url = export_data['url']
                file_content = download_from_url(url)
                break
        time.sleep(2)

    with open(file_name, 'wb') as file:
        file.write(file_content)

    extract_head(file_name)

    with open(file_name, 'rb') as file:
        file_content = file.read()

    file_key = await s3_storage.upsert_file_another(prefix=FileType.AVAGI, file_name=file_name, file_content=file_content)

    delete_user_avatar(user_id, avatar_id)
    delete_user(user_id)
    os.remove(file_name)

    download_s3_link = await s3_storage.generate_download_link(file_key=file_key)

    return AvatarResponse(is_succeed=True, avatar_s3_link=download_s3_link)


@app.post("/avagi/download")
async def download_local(s3_download_link: str = Form(...), local_file_path: str = Form(...)):

    data = await s3_storage.filter_file(file_path=s3_download_link)
    file_binary_content, file_name = data['content'][0], data['name'][0]

    local_file_path = os.path.join(local_file_path, file_name)

    if not os.path.exists(local_file_path):
        with open(local_file_path, "wb") as f:
            f.write(file_binary_content)
        
    return DownloadResponse(is_succeed=True, local_path=local_file_path)
    

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8999)
