import boto3
from botocore.exceptions import ClientError
from fastapi import UploadFile
# import magic

from utils.enums.FileTypeEnum import FileType
from typing import List


class S3Client():
    def __init__(self) -> None:

        self.SUPPORTED_FILE_TYPES = {
            FileType.AVAGI: 'model/gltf-binary'
        }

        # connect to the hragent bucket in S3
        session = boto3.Session(
            aws_access_key_id='your_access_key',
            aws_secret_access_key= 'your_secret_key',
            region_name='eu-west-2'  # change to the location of your s3 bucket
        )
        self.s3_client = session.client('s3')
        self.s3_resource = session.resource('s3')
        self.bucket = self.s3_resource.Bucket('your s3 bucket name here')

    async def upsert_file(
            self, 
            prefix: FileType, 
            uploaded_file: UploadFile) -> str:
        
        file_content = await uploaded_file.read()

        # check if the file type has matched document type
        #if not magic.from_buffer(buffer=file_content, mime=True) == self.SUPPORTED_FILE_TYPES[prefix]:
        #    raise Exception('the uploaded file has unsupported format')
            
        # construct the complete S3 storage key
        file_name = prefix.value + uploaded_file.filename

        # put the document onto S3
        self.bucket.put_object(Key=file_name, Body=file_content)
        return file_name
    

    async def upsert_file_another(
            self, 
            prefix: FileType, 
            file_name,
            file_content) -> str:

        # check if the file type has matched document type
        #if not magic.from_buffer(buffer=file_content, mime=True) == self.SUPPORTED_FILE_TYPES[prefix]:
        #    raise Exception('the uploaded file has unsupported format')
            
        # construct the complete S3 storage key
        file_name = prefix.value + file_name

        # put the document onto S3
        self.bucket.put_object(Key=file_name, Body=file_content)
        return file_name


    def delete_file(
            self, 
            file_path_list: List[str]) -> bool:
        
        deleted_count = 0
        try:
            response = self.bucket.delete_objects(
                Delete={"Objects": [{"Key": file_path} for file_path in file_path_list]}
            )
            if "Deleted" in response:
                deleted_count = len(response['"Deleted"'])
        except ClientError:
            raise Exception("Couldn't delete any objects from bucket %s.", self.bucket.name)
        else:
            return len(file_path_list) == deleted_count


    async def filter_file(self, file_path: str):
        
        try:
            objects = self.bucket.objects.filter(Prefix=file_path)
        except ClientError:
            raise Exception("Couldn't get objects for bucket '%s'.", self.bucket.name)
        else:
            file_name_list, file_content_list = [], []
            for object in objects:
                file_name_list.append(object.key)
                file_content_list.append(object.get()['Body'].read())

            return {'name': file_name_list, 'content': file_content_list}


    async def generate_download_link(self, file_key, expires=3600):
        return self.s3_client.generate_presigned_url('get_object',
                                        Params={'Bucket': 'your s3 bucket name here',
                                                'Key': file_key},
                                                ExpiresIn=expires)
