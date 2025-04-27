const checkChannelData = async () => {
    let channelData = await fetch(`../files/videos.json`)
        .then((response) => { 
            return response.json().then((data) => {
                console.log(data);
                return data;
            }).catch((err) => {
                console.log(err);
            }) 
        });
    return channelData;
}


const checkVideosData = async () => {
    let channelData = await fetch(`../files/videos.json`)
        .then((response) => { 
            return response.json().then((data) => {
                console.log(data);
                return data;
            }).catch((err) => {
                console.log(err);
            }) 
        });
    return channelData;
}

const generateChannelInfo = async () => {
    const jsonData = await checkChannelData();
    console.log(jsonData.channels.length);
    for (let i = 0; i < jsonData.channels.length; i++) {
        const channel = document.createElement('div');
        channel.innerHTML = '<img src="" class="channelLogo">'
            + '<div class="channelInfoContainer">'
            + '<div class="channelTitle">' + jsonData.channels[i].name + '</div><br>'
            + '<span class="videoCount">' + jsonData.channels[i].video_count + ' videos </span>'
            + '<span class="lastVideo"> latest video ' + timeSince(new Date(jsonData.channels[i].latest_video.slice(0, 10))) + ' ago</span></div>'
            + '<br><br>';
            channel.className = 'channel';
        document.getElementById('channelContainer').appendChild(channel);
    }
}

// Locate the information about videos in the files and use that to populate the channel
const generateVideos = async () => {
    const jsonData = await checkVideosData();
    //const data = JSON.parse(jsonData);
    jsonData.forEach(channel => {
        if (channel['Directory'] == 'Small Streamer') {
            channel.Files.forEach(video => {
                const videoElement = document.createElement('div');
                videoElement.innerHTML = '<img src="" class="videoThumbnail">'
                    + '<div class="videoInfoContainer">'
                    + '<div class="videoTitle">' + video.Title + '</div><br>'
                    + '<span class="videoLength"> ' + video.length + '</span></div>'
                    + '<br><br>';
                    videoElement.className = 'video p-2';
                document.getElementById('videosContainer').appendChild(videoElement);
            });
        }
    });
    if (localStorage.getItem('mode') == 'lightMode') { changeMode(); }
}

generateVideos();

function changeMode() {
    const body = document.body;
    body.classList.toggle('lightMode');

    const modeButton = document.getElementById('modeButton');
    modeButton.classList.toggle('lightMode');
    if (body.classList.contains('lightMode')) {
        modeButton.textContent = 'Dark Mode';
    } else {
        modeButton.textContent = 'Light Mode';
    }

    const videosContainer = document.getElementById('videosContainer');
    videosContainer.classList.toggle('lightMode');

    const videos = document.getElementsByClassName('video');
    for (let i = 0; i < videos.length; i++) {
        videos[i].classList.toggle('lightMode');
    }

    const titles = document.getElementsByClassName('videoTitle');
    for (let i = 0; i < titles.length; i++) {
        titles[i].classList.toggle('lightMode');
    }

    const lengths = document.getElementsByClassName('videoLength');
    for (let i = 0; i < lengths.length; i++) {
        lengths[i].classList.toggle('lightMode');
    }
}

/**
 * Initialize the channel list UI once the HTML document is fully loaded.
 *
 * Listens for DOMContentLoaded to ensure all HTML elements are available and then sends an HTTP GET to `/api/channels` to retrieve channel metadata.
 *
 * Parses the JSON response into a JavaScript object then iterates over each channel in the response and:
 *    1. Creates a new <div> element.
 *    2. Sets its text to "<channel name> (N videos)".
 *    3. Appends it to the container, rendering it on the page.
 *
 * Expected API response format:
 * {
 *   channels: [
 *     { name: string, video_count: number },
 *     ...
 *   ]
 * }
 */
document.addEventListener('DOMContentLoaded', () => {
    // fetch list of channels from backend
    fetch('/api/channel/{{ channel_name }} ')
      .then(res => res.json())
      .then(data => {
        //for each channel in response...
        data.channels.forEach(ch => {
            const channelContainer = document.createElement('div');
            const name = ch.name;
            const trimmedName = name.replace(/[^a-zA-Z0-9]/g, "");
            channelContainer.innerHTML = '<a href="api/channel/' + trimmedName + '">'
                + '<img src="" class="channelLogo">'
                + '<div class="channelInfoContainer">'
                + '<div class="channelTitle">' + name + '</div><br>'
                + '<span class="videoCount">' + ch.video_count + ' videos </span>'
                + '<span class="lastVideo"> latest video ' + timeSince(new Date(ch.latest_video)) + ' ago</span>'
                + '</div></a><br><br>';
                channelContainer.className = 'channel';
            document.getElementById('channelContainer').appendChild(channelContainer);
            // check if user selected light mode and change default
        });
        if (localStorage.getItem('mode') == 'lightMode') { changeMode(); }
      })
      //catch error.
      .catch(err => {
        console.error('Error fetching channels:', err);
      });
  });