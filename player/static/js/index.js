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
    
    const channelContainer = document.getElementById('channelContainer');
    channelContainer.classList.toggle('lightMode');

    const channels = document.getElementsByClassName('channel');
    for (let i = 0; i < channels.length; i++) {
        channels[i].classList.toggle('lightMode');
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
    // fetch list of chanels from backend
    fetch('/api/channels')
        .then(res => res.json())
        .then(data => {
            //for each channel in response...
            data.channels.forEach(ch => {
                const channelContainer = document.createElement('div');
                const name = ch.name;
                // potentially to avoid naming issues
                const trimmedName = name.replace(/[^a-zA-Z0-9]/g, "");
                channelContainer.innerHTML = '<a href="channel/' + name + '">'
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


/*
obsolete
const checkChannelData = async () => {
    let channelData = await fetch(`../files/channels.json`)
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

// Populate the website with a box for each channel
const generateChannels = async () => {
    const jsonData = await checkChannelData();
    jsonData.channels.forEach (channel=> {
        const channelContainer = document.createElement('div');
        channelContainer.innerHTML = '<img src="" class="channelLogo">'
            + '<div class="channelInfoContainer">'
            + '<div class="channelTitle">' + channel.name + '</div><br>'
            + '<span class="videoCount">' + channel.video_count + ' videos </span>'
            + '<span class="lastVideo"> latest video ' + timeSince(new Date(channel.latest_video.slice(0, 10))) + ' ago</span></div>'
            + '<br><br>';
            channelContainer.className = 'channel';
        document.getElementById('channelContainer').appendChild(channelContainer);
    });
    // check if user selected light mode and change default
    if (localStorage.getItem('mode') == 'lightMode') { changeMode(); }
}
*/