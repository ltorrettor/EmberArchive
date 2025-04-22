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

generateChannels();

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


document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/channels')
      .then(res => res.json())
      .then(data => {
        const container = document.getElementById('channelContainer');
        data.channels.forEach(ch => {
          const el = document.createElement('div');
          el.textContent = `${ch.name} (${ch.video_count} videos)`;
          container.appendChild(el);
        });
      })
      .catch(console.error);
  });