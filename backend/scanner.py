import json
import sys
import subprocess
import Video
import Channel
from datetime import datetime
from pathlib import Path

VIDEO_EXTENSIONS = {".mp4", ".mov", ".webm", ".mkv", ".avi", ".wmv", ".flv"}

def get_duration(filename):
    #runs ffprobe to get the length of video file in seconds
    duration = subprocess.run(["ffprobe", "-v", "error", "-show_entries",
                             "format=duration", "-of",
                             "default=noprint_wrappers=1:nokey=1", filename],
                            stdout=subprocess.PIPE,
                            stderr=subprocess.STDOUT)
    return float(duration.stdout)


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
def get_file_list(directory, output_filename = "video_list.json" ):
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
            