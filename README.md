
# Ember Archive

Software Engineering II project at UMass Lowell, Spring 2025
(Currently in development)

Ember Archive is a self-hosted video-on-demand platform designed to help archival hobbyists share collections of livestream videos.
It is primarily designed to help host full videos downloaded using the TwitchDownloader found at https://github.com/lay295/TwitchDownloader/.
Other media files may be hosted but have not been thoroughly tested.



## Setup & Tests

0. Ensure a valid Python (>= v3.10) interpreter and pip is installed in your environment and available on your PATH
1. Clone this GitHub repository and `cd` into it
2. Install the requirements with `pip install -r requirements.txt`
3. Run the tests with `python -m pytest`
4. Run the demo program with `python -m backend -d {directorypath}` where directory path is the path on your computer to the folder the media you want to show is located in.
5. Visit http://localhost:80 (or any other port you wish to host from) to access your website.

### System dependencies
0. ffmpeg: version 7.1.1
    for system tool ffprobe
