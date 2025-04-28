### This the main program for running the EmberArchive back-end

from flask import Flask, Response, request, abort, send_from_directory, jsonify, render_template
from .scanner import get_file_list
import json
import os
import sys


def create_app(scan_dir):
    CHUNK_SIZE = 1024 * 1024 # CHUNK_SIZE set to 1mb default, may help to adjust this for performance/memory
    DEBUG_MODE = True

    # compute absolute paths
    PROJECT_ROOT   = os.getcwd()
    TEMPLATES_DIR  = os.path.join(PROJECT_ROOT, 'player', 'templates')
    STATIC_DIR     = os.path.join(PROJECT_ROOT, 'player', 'static')

    # pass static folder to flask 
    app = Flask(
        __name__,
        template_folder = TEMPLATES_DIR,
        static_folder = STATIC_DIR,
        static_url_path = '/static'
    )
    
    @app.route('/', defaults={'path': 'index.html'})
    @app.route('/<path:path>')
    
    def serve(path):
        return send_from_directory(TEMPLATES_DIR, path)
     
        
    
    """
        retrieve all channels and their respective video counts.

        Scans the configured directory for channel data, builds a summary for each channel, and returns the result as a JSON payload.

        Returns:
            flask.wrappers.Response: A JSON response with the structure:
            {
                "channels": [
                    {
                        "name": <str>,         # the channel’s name
                        "video_count": <int>   # Number of videos in  channel
                    },
                    ...
                ]
            }
    """
    @app.route('/api/channels')
    def send_channels():
       
        # scan the filesystem directory (from the -d flag)
        channels = get_file_list(scan_dir)

        # build a list of simple dicts from the Channel objects, extracting only the data the front end needs.
        data = {
            "channels": [
                {
                    "name": ch.get_name(),
                    "video_count": len(ch.get_video_list()),
                    "latest_video": (
                        ch.get_most_recent().get_date()
                        if ch.get_most_recent() is not None
                        else None )
                }
                for ch in channels.values()
            ]
        }

        # uses Flask’s jsonify helper to serialize to JSON, set the
        # Content-Type header, and return an HTTP 200 response.
        return jsonify(data)

    @app.route('/api/<channel_name>')
    def send_videos(channel_name):
        channels = get_file_list(scan_dir)
        
        ch = channels.get(channel_name)

        if ch is None:
            return jsonify({"error": "Channel not found"}), 404

        data = {
            "videos": [
                {
                    "title": video.get_title(),
                    "date": video.get_date(),
                    "duration": video.get_duration(),
                    "filepath": str(video.get_file_path()), # Have to pass as string. path type is "non-jsonable" 
                }
                for video in ch.get_video_list()
            ]
        }
        
        
        return jsonify(data)
    
    @app.route('/channel/<channel_name>')
    def show_channel_page(channel_name):
        return render_template('channel.html', channel_name=channel_name)

    """
    path: file location
    start: starting byte position of video
    end: final byte position of video
    """
    def generate_video_stream(path, start, end):

        # open file
        with open(path, 'rb') as video:
            video.seek(start)
            # Calculate how many bytes to read 
            remaining = end - start + 1
            while remaining > 0:
                # read a chunk at a time
                chunk = video.read(min(CHUNK_SIZE, remaining))
                if not chunk:
                    break
                remaining -= len(chunk)

                # When Flask sees 'yield' it treats the function response as a streaming response and will iterate the return value and stream the data in chunks.
                #
                # A custom generator can be designed but yield works well for our purposes here.
                #
                # Yields:
                #     bytes: a chunk of data with the size defined with the CHUNK_SIZE global variable.

                yield chunk

    # Application Target - app will be set to use stream_video()
    @app.route('/video.mp4')
    def stream_video():

        # Default testing path ********************
        video_path = '././temp_video/video.mp4'


        # Its 10 P.M... Do you know where are your files are or who they gave permissions to?..
        # Im trying to have fun, sue me.

        # Check if the file exists
        if not os.path.exists(video_path):
            print(f"FILE DOES NOT EXIST")
            sys.exit(404)
        # check for file permission
        if not os.access(video_path, os.R_OK):
            print(f"INSUFFICIENT FILE PERMISSIONS")
            sys.exit(403)


        # Get the total size of video
        file_size = os.path.getsize(video_path)

        start, end = 0, file_size - 1

        # Get range header from client for determining what part of video to send
        range_header = request.headers.get('Range', None)
        #
        # DEBUGGING
        if DEBUG_MODE:
            print(request.headers)

        # exit if no header return
        if not range_header:
            # ERROR FLAG INVALID RANGE
            # print(f"INVALID RANGE HEADER")
            # sys.exit(416)
            content_length = end - start + 1

            # Create a Flask Response object that will iterate gnerate_video_stream() until file stream is complete
            # HTTP status 206 indicates partial data sent
            response = Response(
                generate_video_stream(video_path, start, end),
                status=206,
                mimetype='video/mp4'
            )

            response.headers.add('Content-Length', str(content_length))

            return response


        # Remove the "bytes=" prefix and split the range into start and end.
        # range_value = "bytes=X-Y"
        # split range into 2 parts via the '-'
        # #bytes=start-end -> parts[start, end]
        range_value = range_header.strip().split('=')[1]
        parts = range_value.split('-')

        # replace start if parts[0] > 0
        if parts[0]:
            start = int(parts[0])
        # update end if provided AND end < total file size. may be left out to signal EOF
        if parts[1] and (int(parts[1]) < file_size - 1):
            end = int(parts[1])

        # Calculate the content length based on the range.
        content_length = end - start + 1

        # Create a Flask Response object that will iterate gnerate_video_stream() until file stream is complete
        # HTTP status 206 indicates partial data sent
        response = Response(
            generate_video_stream(video_path, start, end),
            status=206,
            mimetype='video/mp4'
        )

        # Set the necessary headers for range requests.
        response.headers.add('Content-Range', f'bytes {start}-{end}/{file_size}')
        response.headers.add('Accept-Ranges', 'bytes')
        response.headers.add('Content-Length', str(content_length))

        return response

    # dynamic error handling prototype WIP
    # def error_call(error_num):

    #     error_messages = {
    #         416: "INVALID RANGE HEADER",
    #         403: "INSUFFICIENT FILE PERMISSIONS",
    #         404: "FILE DOES NOT EXIST",
    #         400: "

    #     }
    #     message = error_messages.get(error_num, f"{error_num}")
    #     abort(400, description=message)
    
    PLAYER_DIR = os.path.join(os.getcwd(), 'player')
    
    print("\nRegistered routes:\n", app.url_map, "\n")

    
    return app


