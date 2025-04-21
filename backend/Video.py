import re
import subprocess
from moviepy import VideoFileClip
from pathlib import Path

class Video:
    def __init__(self, file):
        # convert the path into a string
        self.__file_path = file
        # strip the file name to the title and the date
        file_name = file.name.removesuffix(file.suffix)
        # accepted formats for the date 
        date_format = r"\d{1,2}-\d{1,2}-\d{4}"
        # ===================I would like to be able to get a format for usernames and titles as well but idk how we would seperate them===================
        # ===================if we do find a way to seperate them in a way where the title doesn't accidentally mess up the formatting we have to put it in the readme===================
        # ===================currently what I have is the user names the file "title date" in a folder of the creator I felt that was easiest to parse the info===================
        # parse the date in the given file name
        date = re.search(date_format, file_name)
        # if there is a date set the date field if not set as unknown
        if date:
            self.__date = date.group()
        else:
            self.__date = "Unknown"
        # Unknown might be in the title so don't wanna remove it if it is
        if (self.__date != "Unknown"):
            self.__title = file_name.replace(self.__date, "")
        else:
            self.__title = file_name
        # get the duration of the video in seconds
        # self.__duration = VideoFileClip(file).duration
        self.__duration = self.set_duration(file)
    
    # set of getters
    def get_file_path(self):
        return self.__file_path
    
    def get_duration(self):
        return self.__duration

    def set_duration(self, file):
        #runs ffprobe to get the length of video file in seconds
        duration = subprocess.run(["ffprobe", "-v", "error", "-show_entries",
                             "format=duration", "-of",
                             "default=noprint_wrappers=1:nokey=1", file],
                            stdout=subprocess.PIPE,
                            stderr=subprocess.STDOUT)
        return float(duration.stdout)

    
    def get_date(self):
        return self.__date
    
    def get_title(self):
        return self.__title
