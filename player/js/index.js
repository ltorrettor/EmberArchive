const checkChannelData = async () => {
    let channelData = await fetch(`./files/channels.json`)
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

function timeSince(date) {

    var seconds = Math.floor((new Date(Date.now()) - date) / 1000);
    var interval = seconds / 31536000;
  
    if (interval > 1) {
      return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
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
}

generateChannels();