import cli
from __init__ import create_app
from flask import Flask
import scanner

app = Flask(__name__)


if __name__ == '__main__':
    print('Visit http://localhost:8000/index.html for the player demo')
    scanner.get_file_list("./temp_video")
    app = create_app()
    app.run(host='0.0.0.0', port=8000, debug=False)
