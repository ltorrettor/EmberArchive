// https://stackoverflow.com/a/47604112
const checkVideoData = async () => {
    let videoData = await fetch(`./examplevidchat.json`)
        .then((response) => { 
            return response.json().then((data) => {
                console.log(data);
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

// Compare time offsets to decide when to post a comment
const getVideoTime = async () => {
    let jsonData = await checkVideoData();
    let video = document.getElementById('video');
    let videoOffset = jsonData.video.start;
    // Make this for only while the video is playing or something
    setInterval(function() {
        let videoTime = videoOffset + Math.floor(video.currentTime);

        for (let i = 0; i < jsonData.comments.length; i++) {
            let commentCreationOffset = jsonData.comments[i].content_offset_seconds;

            if (commentCreationOffset <= videoTime) {
                let timestamp = document.createElement('span');
                let username = document.createElement('span');
                let message = document.createElement('span');
                timestamp.innerHTML = '[' + jsonData.comments[i].created_at.slice(11, 19) + '] ';
                username.innerHTML = jsonData.comments[i].commenter.display_name;
                username.style.color = jsonData.comments[i].message.user_color;
                message.innerHTML = ': ' + jsonData.comments[i].message.body;
                document.getElementById('chatContainer').appendChild(timestamp);
                document.getElementById('chatContainer').appendChild(username);
                document.getElementById('chatContainer').appendChild(message);
                document.getElementById('chatContainer').appendChild(document.createElement('br'));
                document.getElementById('chatContainer').appendChild(document.createElement('br'));
                jsonData.comments.splice(i, 1);
            }
        }
    }, 1000);
}

displayVideoData();
getVideoTime();

/*
document.getElementById('fullvidplay').onclick = function () {
    document.getElementById('chatplay').click();
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
*/

