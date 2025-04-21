from . import Video
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
    