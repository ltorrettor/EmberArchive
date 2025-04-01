import argparse
from pathlib import Path

# creates a parser which will parse commands entered through the CLI
parser = argparse.ArgumentParser(description = 'Parser that will parse the command arguments for a CLI')

# a list of arguments passed through the cli

# binding flag
# a flag which will bind the web server to the str argument (address) that is given
parser.add_argument(
    '-b', '--bind', 
    help='binds the web server to the given address which by default is "0.0.0.0"',
    type=str,
    default='0.0.0.0'
)

# port flag
# a flag that will bind the web server to the given int argument (port)
parser.add_argument(
    '-P', '--PORT',
    help='binds the web server to a given port which by default is 80',
    type=int,
    default=80
)

# directory flag
# a required flag which will specify to Ember Archive which directory to scan for video and chat files
parser.add_argument(
    '-d', '--directory',
    help='specifies the directory for Ember Archive to scan and monitor for video and chat files',
    type=str,
    required=True
)

# parses the arguments
arguments = parser.parse_args()

# stores the directory path into  a path variable
path = Path(arguments.directory)

# a set of all the files we actually care about
file_extensions = {".mp4", ".mkv", ".avi", ".mov", ".flv", ".wmv", ".webm", "json"}

# list comprension to sort the files in the directory to only be the accepted file extensions
ea_files = [file for file in path.rglob("*") if file.suffix.lower() in file_extensions]