import os
from minio import Minio
import boto3
from botocore.client import Config

def get_s3_client():
    """
    Get S3 client based on environment configuration.
    Returns either MinIO client for local development or boto3 S3 client for production.
    """
    endpoint_url = os.getenv('S3_ENDPOINT_URL', 'https://s3.amazonaws.com')
    access_key = os.getenv('AWS_ACCESS_KEY_ID')
    secret_key = os.getenv('AWS_SECRET_ACCESS_KEY')
    region = os.getenv('AWS_DEFAULT_REGION', 'us-east-1')

    if 'minio' in endpoint_url:
        # Local development with MinIO
        return Minio(
            endpoint_url.replace('http://', '').replace('https://', ''),
            access_key=access_key,
            secret_key=secret_key,
            secure=False
        )
    else:
        # Production with AWS S3
        return boto3.client(
            's3',
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            region_name=region,
            config=Config(signature_version='s3v4')
        )

def ensure_bucket_exists(bucket_name):
    """
    Ensure the specified bucket exists, create it if it doesn't.
    """
    client = get_s3_client()
    
    if isinstance(client, Minio):
        if not client.bucket_exists(bucket_name):
            client.make_bucket(bucket_name)
    else:
        try:
            client.head_bucket(Bucket=bucket_name)
        except:
            client.create_bucket(Bucket=bucket_name)

def upload_to_s3(local_path, bucket, s3_key):
    """
    Upload a file to S3/MinIO
    """
    client = get_s3_client()
    
    if isinstance(client, Minio):
        client.fput_object(bucket, s3_key, local_path)
    else:
        client.upload_file(local_path, bucket, s3_key)

def download_from_s3(bucket, s3_key, local_path):
    """
    Download a file from S3/MinIO
    """
    client = get_s3_client()
    
    if isinstance(client, Minio):
        client.fget_object(bucket, s3_key, local_path)
    else:
        client.download_file(bucket, s3_key, local_path)