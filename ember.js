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
   
const getActivity = async () => {
    let jsonData = await checkVideoData();
    document.getElementById('time').innerHTML = timeSince(new Date(jsonData.video.created_at.slice(0, 10))) + ' ago';
    document.getElementById('streamer').innerHTML = jsonData.streamer.name;
    document.getElementById('videoTitle').innerHTML = jsonData.video.title;
}

getActivity();

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
};*/

