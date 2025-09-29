#!/usr/bin/env python
"""
Simple startup script for Railway deployment
"""
import os
import subprocess
import sys

def main():
    # Get port from environment variable, default to 8000
    port = os.environ.get('PORT', '8000')
    
    # Build gunicorn command
    cmd = [
        'gunicorn',
        'stock_api.wsgi:application',
        '--bind', f'0.0.0.0:{port}',
        '--workers', '3',
        '--timeout', '120'
    ]
    
    print(f"Starting server on port {port}")
    print(f"Command: {' '.join(cmd)}")
    
    # Execute gunicorn
    try:
        subprocess.run(cmd, check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error starting server: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
