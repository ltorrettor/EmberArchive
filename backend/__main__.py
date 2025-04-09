import cli
from __init__ import create_app
from flask import Flask
import scanner

app = Flask(__name__)


if __name__ == '__main__':
    # create the parser
    parser = cli.create_parser()
    # read arguments from the cli
    arguments = parser.parse_args()
    # parse arguments into variables
    directory = arguments.directory
    host = arguments.bind
    port = arguments.PORT
    print('Visit http://localhost:8000/index.html for the player demo')
    # dictionary of channels with the key being channel name and the value being a channel object
    channels = scanner.get_file_list(directory)
    for channel_name in channels:
        print(f"{channel_name}: ")
        channel = channels[channel_name]
        video_list = channel.get_video_list()
        for video in video_list:
            print(f"Title: {video.get_title()}\nPath: {video.get_file_path()}")
    app = create_app()
    app.run(host='0.0.0.0', port=8000, debug=False)
