// https://stackoverflow.com/a/47604112
const checkVideoData = async () => {
    let videoData = await fetch(`./examplevidchat.json`)
        .then((response) => { 
            return response.json().then((data) => {
                return data;
            }).catch((err) => {
                console.log(err);
            }) 
        });
    return videoData;
}
   
const displayVideoData = async () => {
    let jsonData = await checkVideoData();
    document.getElementById('time').innerHTML = timeSince(new Date(jsonData.video.created_at.slice(0, 10))) + ' ago';
    document.getElementById('streamer').innerHTML = jsonData.streamer.name;
    document.getElementById('videoTitle').innerHTML = jsonData.video.title;
}

// https://stackoverflow.com/a/3177838
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

const getVideoTime = async () => {
    let jsonData = await checkVideoData();
    let video = document.getElementById('video');
    /*let currentTime = video.currentTime;
    let currentTimeMs = currentTime * 1000;
    let videoCreationDateTime = new Date(String(jsonData.video.created_at.slice(0, 10) + ' ' + jsonData.video.created_at.slice(11, 19)));
    let videoCreationMs = videoCreationDateTime.getTime()
    console.log(videoCreationMs);
    console.log(currentTimeMs);
    console.log(videoCreationMs + currentTimeMs)
    for (let i = 0; i < jsonData.comments.length; i++) {
        let commentCreationDateTime = jsonData.comments[i].
        jsonData.comments[i].commenter
    };*/
    let videoOffset = jsonData.video.start;
    let videoTime = videoOffset + Math.floor(video.currentTime);
    for (let i = 0; i < jsonData.comments.length; i++) {
        let commentCreationOffset = jsonData.comments[i].content_offset_seconds;
        console.log(videoTime);
        if (commentCreationOffset == videoTime) {
            let message = document.createElement('p');
            message.innerHTML = '[' + jsonData.comments[i].created_at.slice(11, 19) + '] ' + jsonData.comments[i].commenter.display_name + ': ' + jsonData.comments[i].message.body;
            document.getElementById('chatlog').appendChild(message);
        }
    }
}

displayVideoData();
setInterval(getVideoTime, 1000);

/*document.getElementById('fullvidplay').onclick = function () {
    document.getElementById('chatplay').click();
};

document.getElementById('fullchatplay').onclick = function () {
    document.getElementById('vidplay').click();
};

document.getElementById('vidplay').onclick = function () {
        document.getElementById('chatplay').click();
};

document.getElementById('centervidplay').onclick = function () {
    document.getElementById('chatplay').click();
};

document.getElementById('vidback').onclick = function () {
    document.getElementById('chatback').click();
};

document.getElementById('vidfwd').onclick = function () {
    document.getElementById('chatfwd').click();
};

document.getElementById('vidmute').onclick = function () {
    document.getElementById('chatmute').click();
};

document.getElementById('vidrate').onclick = function () {
    document.getElementById('chatrate').click();
};
            <media-controller id="vid" class="p-2">
                <video slot="media" id="video" src="examplevid.mp4"></video>
                <!--<media-play-button slot="centered-chrome" id="centervidplay"></media-play-button>-->
                <media-loading-indicator slot="centered-chrome"></media-loading-indicator>
                <media-playback-rate-menu rates="0.25 0.5 0.75 1 1.25 1.5 2 4" hidden anchor="auto"></media-playback-rate-menu>
                <media-control-bar>
                    <media-play-button id="vidplay"></media-play-button>
                    <media-seek-backward-button id="vidback"></media-seek-backward-button>
                    <media-seek-forward-button id="vidfwd"></media-seek-forward-button>
                    <media-mute-button id="vidmute"></media-mute-button>
                    <media-volume-range></media-volume-range>
                    <media-time-display></media-time-display>
                    <p></p>
                    <media-duration-display></media-duration-display>
                    <media-time-range id="vidtime"></media-time-range>
                    <media-playback-rate-menu-button id="vidrate"></media-playback-rate-menu-button>
                    <media-fullscreen-button id="vidfull"></media-fullscreen-button>
                </media-control-bar>
            </media-controller>

            <!--<media-controller id="chat" class="p-2">
                <video slot="media" id="fullchatplay" play src="examplevidchat.mp4"></video>
                <media-control-bar id="chatctrl">
                    <media-play-button id="chatplay"></media-play-button>
                    <media-seek-backward-button id="chatback"></media-seek-backward-button>
                    <media-seek-forward-button id="chatfwd"></media-seek-forward-button>
                    <media-mute-button id="chatmute"></media-mute-button>
                    <media-time-range id="chattime"></media-time-range>
                    <media-playback-rate-button id="chatrate"></media-playback-rate-button>
                </media-control-bar>
            </media-controller>-->
            
*/

