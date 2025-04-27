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

/*
obsolete
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
*/