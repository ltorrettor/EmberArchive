import argparse
import re

def validate_bind_format(input: str) -> str:
    """Given an input this function will validate the input is correctly formatted to be stored as the bind attribute for the cli"""
    valid_ip = r"\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}$"
    if not re.match(valid_ip, input):
        raise argparse.ArgumentTypeError(f"Invalid IP address format: {input}")
    else:
        return input


def create_parser():
    """Create a argument parser that will take arguments passed through the CLI"""
    # creates a parser which will parse commands entered through the CLI
    parser = argparse.ArgumentParser(description = 'Parser that will parse the command arguments for a CLI')

    # a list of arguments passed through the cli

    # binding flag
    # a flag which will bind the web server to the str argument (address) that is given
    parser.add_argument(
        '-b', '--bind', 
        help='binds the web server to the given interface which by default is "0.0.0.0"',
        type=validate_bind_format,
        default='0.0.0.0'
    )

    # port flag
    # a flag that will bind the web server to the given int argument (port)
    parser.add_argument(
        '-P', '--PORT',
        help='binds the web server to a given port',
        type=int,
        required=True,
    )

    # directory flag
    # a required flag which will specify to Ember Archive which directory to scan for video and chat files
    parser.add_argument(
        '-d', '--directory',
        help='specifies the directory for Ember Archive to scan and monitor for video and chat files',
        type=str,
        required=True
    )

    return parser
