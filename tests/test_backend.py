import pytest
from pathlib import Path
from backend import Video, Channel, cli

# tests for the cli

def test_given_all_args():
    parser = cli.create_parser()
    args = parser.parse_args(['-b', "192.0.2.5", '-P', '8000', '-d', '.\\test_videos'])
    # the following are the expected values
    expected_bind = "192.0.2.5"
    expected_port = 8000
    expected_directory = ".\\test_videos"
    
    assert args.bind == expected_bind
    assert args.PORT == expected_port
    assert args.directory == expected_directory

def test_directory_is_required():
    parser = cli.create_parser()
    
    with pytest.raises(SystemExit):
        parser.parse_args([])

def test_default_bind_and_port():
    parser = cli.create_parser()
    args = parser.parse_args(['-d', '.\\test_videos'])

    expected_bind = '0.0.0.0'
    expected_port = 80

    assert args.bind == expected_bind
    assert args.PORT == expected_port

def test_attribute_types():
    parser = cli.create_parser()
    args = parser.parse_args(['-b', "192.0.2.5", '-P', '8000', '-d', '.\\test_videos'])
    
    assert isinstance(args.bind, str)
    assert isinstance(args.PORT, int)
    assert isinstance(args.directory, str)
    

def test_error_given_wrong_type():
    # port is expected to be an int
    parser = cli.create_parser()
    
    # give the parser a string instead of int port should raise an error
    with pytest.raises(SystemExit):
        parser.parse_args(['-b', "192.0.2.5", '-P', 'hi', '-d', '.\\test_videos'])

def test_bind_incorrect_format():
    # the bind parameter must be the following formatted as n.n.n.n
    parser = cli.create_parser()
    
    # incorrect formatted bind is passed therefore there should be an error thrown
    with pytest.raises(SystemExit):
        parser.parse_args(['-b', "this.is.an.error", '-P', '8000', '-d', '.\\test_videos'])
    

# tests for the Video Class

# test a video file with the date in the file name will parse the correct date and store the correct title and date
def test_video_with_date():
    file = Path(".\\test_video\\video_01-01-2025.mp4")
    
    vid = Video.Video(file)
    
    assert vid.get_date == "01-01-2025"
    assert vid.get_title == "video_"
    
def test_video_with_no_date():
    file = Path(".\\test_video\\Unknown_video.mp4")
    
    vid = Video.Video(file)
    
    assert vid.get_date == "Unknown"
    assert vid.get_title == "Unknown_video"

def test_video_duration_no_chapters():
    # test the video duration is correctly stored if there is no meta data of chapters
    file = Path(".\\test_video\\Unkown_video.mp4")
    
    vid = Video.Video(file)
    expected_duration = 59
    
    # the vid duration will be within 1 second of the expected duration of the video file's duration
    # a variable that is True if it is within 1 second of the expected duration
    duration_difference = abs(expected_duration - vid.get_duration)
    assert duration_difference > 1
    
def test_video_duration_with_chapters():
    # test if a video's duration is correctly stored if the file has chapter meta data
    file = Path(".\\test_video\\video_01-01-2025.mp4")
    
    vid = Video.Video(file)
    expected_duration = 330
    
    duration_difference = abs(expected_duration - vid.get_duration)
    assert duration_difference > 1
    
def test_video_file_path():
    # test if the file path is stored correctly
    # test if a video's duration is correctly stored if the file has chapter meta data
    file = Path(".\\test_video\\video_chapters.mp4")
    
    vid = Video.Video(file)
    
    assert vid.get_file_path == file
    
# tests for the Channel Class

def channel_naming():
    # test if the channel is takes the name parameter and correctly stores it
    chan = Channel.Channel("test_video")
    expected_name = "test_video"
    
    assert chan.get_name() == expected_name
    
def channel_adds_video():
    # test to check if the add_video adds a video object to the video_list in the channel object
    chan = Channel.Channel("test_video")
    initial_channel_vid_list = []
    
    assert chan.get_video_list == initial_channel_vid_list
    
    file = Path(".\\test_video\\video_01-01-2025.mp4")
    vid = Video.Video(file)
    chan.add_video(vid)
    new_channel_vid_list = [vid]
    
    assert chan.get_video_list == new_channel_vid_list