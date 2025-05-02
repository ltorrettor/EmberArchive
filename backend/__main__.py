from . import cli
from . import create_app
from flask import Flask
from . import scanner
from .host_data import dump_host_info

app = Flask(__name__)


if __name__ == '__main__':
    # create the parser
    parser = cli.create_parser()
    # read arguments from the cli
    arguments = parser.parse_args()
    # parse arguments into variables
    directory = arguments.directory
    ip = arguments.bind
    port = arguments.PORT
    #parser = create_parser()
    
    # collect and dump host_data
    # dump_host_info()

    print('Visit http://localhost:8000/index.html for the player demo')
    # dictionary of channels with the key being channel name and the value being a channel object
    channels = scanner.get_file_list(directory)
    for channel_name in channels:
        print(f"{channel_name}: ")
        channel = channels[channel_name]
        video_list = channel.get_video_list()
        for video in video_list:
            print(f"Title: {video.get_title()}\nPath: {video.get_file_path()}\nDuration: {video.get_duration()}")
    app = create_app(directory)
    app.run(host=ip, port=port, debug=False)
