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
    directory = arguments.directory.replace(" ", "_")
    host = arguments.bind
    port = arguments.PORT
    print('Visit http://localhost:8000/index.html for the player demo')
    scanner.get_file_list(directory)
    app = create_app()
    app.run(host='0.0.0.0', port=8000, debug=False)
