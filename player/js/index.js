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


const generateChannels = async () => {
    const jsonData = await checkChannelData();
    console.log(jsonData.channels.length);
    for (let i = 0; i < jsonData.channels.length; i++) {
        const channel = document.createElement('div');
        channel.innerHTML = '<div class="channelTitle">' + jsonData.channels[i].name + '</div><br>'
            + '<span class="videoCount">' + jsonData.channels[i].video_count + ' videos </span>'
            + '<span class="lastVideo"> latest video ' + timeSince(new Date(jsonData.channels[i].latest_video.slice(0, 10))) + ' ago</span>'
            + '<br><br>';
            channel.className = 'channel';
        document.getElementById('channelContainer').appendChild(channel);
    }
}

generateChannels();