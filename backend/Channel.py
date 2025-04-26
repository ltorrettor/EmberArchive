from .Video import Video
from datetime import datetime

class Channel:
    def __init__(self, name):
        self.__name = name
        self.__video_list = []

    
    def add_video(self, video):
        """ Add a Video object to the channel """
        self.__video_list.append(video)

    def get_video_list(self):
        return self.__video_list
    
    def get_name(self):
        return self.__name
    
    # return the video with the newest date
    # If none have a valid date, returns the last-added video.
    def get_most_recent(self) -> Video | None:
        # if empty list...
        if not self.__video_list:
            return None
        
        # get a list of only videos that are properly dated
        has_date = [video for video in self.__video_list if video.get_date() != "Unknown"]
        
        # if we find any dates, compare them as dates using datetime
        if has_date:
            # lamda assigns v as a datetime object to be able to compare them against each other.
            return max(has_date, key=Video.get_datetime)

        # else return last item in list
        else:
            return self.__video_list[-1]
        
        
