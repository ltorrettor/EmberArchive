import json
import sys
import subprocess
from . import Video
from . import Channel
from datetime import datetime
from pathlib import Path

VIDEO_EXTENSIONS = {".mp4", ".mov", ".webm", ".mkv", ".avi", ".wmv", ".flv"}

"""
{
"Directory": "root",
    "Files": 
    [
        {
        "Title": 
        "size": 
        "filetype": 
        "length":
        }
        {
        "Title": 
        "size": 
        "filetype": 
        "length":
        }
    ]
}
"""
def get_file_list(directory):
    path = Path(directory)
    # empty dictionary which will contain the channel_names and channel class
    channels = {}
    # Collect file data on all files directly in root folder
    for file in path.rglob("*"):
        # if statement to check for correct files
        if file.suffix.lower() in VIDEO_EXTENSIONS:
            # get the channel name
            channel_name = file.parent.name
            # add channel to dict if not in it already
            if channel_name not in channels:
                channels[channel_name] = Channel.Channel(channel_name)
            # create a temp var for the video
            cur_video = Video.Video(file)
            # add video to the channel
            channels[channel_name].add_video(cur_video)
    return channels
            