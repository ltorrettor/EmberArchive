import pytest
from pathlib import Path
from backend import Video, Channel, cli

# tests for the cli

def test_given_all_args():
    parser = cli.create_parser()
    parser.parse_args(['-b', "192.0.2.5", '-P', 8000, '-d', '.\\test_videos'])
    # the following are the expected values
    expected_bind = "192.0.2.5"
    expected_port = 8000
    expected_directory = ".\\test_videos"
    
    assert parser.bind == expected_bind
    assert parser.PORT == expected_port
    assert parser.directory == expected_directory

def test_directory_is_required():
    parser = cli.create_parser()
    
    with pytest.raises(SystemExit):
        parser.parse_args([])

def test_default_bind_and_port():
    parser = cli.create_parser()
    parser.parse_args(['-d', '.\\test_videos'])

    expected_bind = '0.0.0.0'
    expected_port = 80

    assert parser.bind == expected_bind
    assert parser.PORT == expected_port

def test_attribute_types():
    parser = cli.create_parser()
    parser.parse_args(['-b', "192.0.2.5", '-P', 8000, '-d', '.\\test_videos'])
    
    assert isinstance(parser.bind, str)
    assert isinstance(parser.PORT, int)
    assert isinstance(parser.directory, str)
    

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
        parser.parse_args(['-b', "this.is.an.error", '-P', 8000, '-d', '.\\test_videos'])
    

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

# tests for the Channel Class