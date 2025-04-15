import pytest
from pathlib import Path
from backend import Video, Channel, cli

# tests for the cli

def test_given_all_args():
    parser = cli.create_parser()
    parser.parse_args(['-b', "192.0.2.5", '-P', 8000, '-d', './test_videos'])
    # the following are the expected values
    expected_bind = "192.0.2.5"
    expected_port = 8000
    expected_directory = "./test_videos"
    
    assert parser.bind == expected_bind
    assert parser.PORT == expected_port
    assert parser.directory == expected_directory

def test_directory_is_required():
    parser = cli.create_parser()
    
    with pytest.raises(SystemError):
        parser.parse_args([])

def test_default_bind_and_port():
    parser = cli.create_parser()
    parser.parse_args(['-d', './test_videos'])

    expected_bind = '0.0.0.0'
    expected_port = 80

    assert parser.bind == expected_bind
    assert parser.PORT == expected_port

def test_error_given_wrong_type():
    # port is expected to be an int
    parser = cli.create_parser()
    
    # give the parser a string instead of int port should raise an error
    with pytest.raises(SystemError):
        parser.parse_args(['-b', "192.0.2.5", '-P', 'hi', '-d', './test_videos'])


# tests for the Video Class

# tests for the Channel Class