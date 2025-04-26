from pathlib import Path
from backend.Channel import Channel
from backend.Video import Video

# avoid spawning ffprobe
Video.set_duration = lambda self, f: 0

ch = Channel("quick")
v1 = Video(Path("foo-01-01-2020.mp4"))
v2 = Video(Path("bar-12-31-2021.mp4"))

ch.add_video(v1)
ch.add_video(v2)

print("Most recent date:", ch.get_most_recent().get_date())
