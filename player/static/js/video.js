// Code modified from https://github.com/JZimz/tmi-utils to fit the data received from TwitchDownloader for the next two functions

function getEmoteAsUrl (id, theme = 'light', scale = '1.0') {
    return `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/${theme}/${scale}`;
}

// Split the message into emotes and text by using the emote positions
function parseEmotesInMessage (emotes, msg) {
    const result = [];
    // Don't bother with the rest if there are no emotes
    if (emotes.length == 0) {
        result.push({
            type: 'text', 
            value: msg
        })
        return result;
    }
  
    // Split the message in a unicode-safe way
    const msgArray = Array.from(msg)
    const emotePositions = [];

    for (let i = 0; i < emotes.length; i++) {
        let id = emotes[i]._id;
        let begin = emotes[i].begin;
        let end = emotes[i].end;
        emotePositions.push({id: id, begin: begin, end: end});
    }

    let cursor = 0;

    for (let i = 0; i < emotePositions.length; i++) {
      // Add any text before the first emote.
      if (emotePositions[i].begin > cursor) {
        result.push({
          type: 'text',
          value: msgArray.slice(cursor, emotePositions[i].begin).join('')
        })
      }
  
      result.push({
        type: 'emote',
        raw: msgArray.slice(emotePositions[i].begin, emotePositions[i].end + 1).join(''),
        value: `${emotePositions[i].id}`
      })
      cursor = emotePositions[i].end + 1
    }
  
    // Add any remaining text after the last emote.
    if (cursor < msgArray.length) {
      result.push({
        type: 'text',
        value: msgArray.slice(cursor).join('')
      })
    }

    return result;
};

function postComments(jsonData, video, videoOffset) {
    // Compare time offsets to decide when to post a comment
    const videoTime = videoOffset + Math.floor(video.currentTime);
    const body = document.body;
    for (let i = 0; i < jsonData.comments.length; i++) {
        const commentCreationOffset = jsonData.comments[i].content_offset_seconds;

        if (commentCreationOffset <= videoTime) {
            // add a semicolon before the message 
            const parsedMessage = parseEmotesInMessage(jsonData.comments[i].message.emoticons, jsonData.comments[i].message.body);
            
            const timestamp = document.createElement('span');
            const username = document.createElement('span');
            const message = document.createElement('span');
            // make them fit the theme
            if (body.classList.contains('lightMode')) {
                timestamp.classList.toggle('lightMode');
                username.classList.toggle('lightMode');
                message.classList.toggle('lightMode');
            }

            message.append(': ');
            for (let i = 0; i < parsedMessage.length; i++) {
            //parsedMessage.forEach(({ type, value, raw }) => {
                if (parsedMessage[i].type === 'emote') {
                const img = new Image();
                // Converts the emote id to URL
                img.src = getEmoteAsUrl(parsedMessage[i].value);
                // Raw is the original emote text (e.g. LUL)
                img.alt = parsedMessage[i].raw;
                img.title = parsedMessage[i].raw;
            
                message.append(img);
                } else {
                message.append(parsedMessage[i].value);
                }
            }
            // Actually create and append the comment
            timestamp.innerHTML = '[' + jsonData.comments[i].created_at.slice(11, 19) + '] ';
            username.innerHTML = jsonData.comments[i].commenter.display_name;
            username.style.color = jsonData.comments[i].message.user_color;

            document.getElementById('chatContainer').appendChild(timestamp);
            document.getElementById('chatContainer').appendChild(username);
            document.getElementById('chatContainer').appendChild(message);
            document.getElementById('chatContainer').appendChild(document.createElement('br'));
            document.getElementById('chatContainer').appendChild(document.createElement('br'));
            jsonData.comments.splice(i--, 1);
        }
    }
}

function getVideoTime(jsonData) {
    const video = document.getElementById('video');
    const videoOffset = jsonData.video.start;
    setInterval(postComments, 1000, jsonData, video, videoOffset);
}

// Toggle Fullscreen
document.getElementById('fullScreenButton').onclick = function () {
    const fullElem = document.fullscreenElement;
    const button = document.getElementById('fullScreenButton');
    if (fullElem == null) {
        const elem = document.getElementById('streamContainer');
        if (elem.requestFullscreen) {
        elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
        }
        button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-fullscreen-exit" viewBox="0 0 16 16"><path d="M5.5 0a.5.5 0 0 1 .5.5v4A1.5 1.5 0 0 1 4.5 6h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5m5 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 10 4.5v-4a.5.5 0 0 1 .5-.5M0 10.5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 6 11.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5m10 1a1.5 1.5 0 0 1 1.5-1.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0z"/></svg>'
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
        button.innerHTML = '<svg type="button" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-fullscreen" viewBox="0 0 16 16" id="screenSizeToggle"><path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5M.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5"/></svg>'
    }
}



document.getElementById('modeButton').onclick = function () {
    changeMode();
    if (localStorage.getItem('mode') != 'lightMode') {
        localStorage.setItem('mode', 'lightMode');
    } else {
        localStorage.setItem('mode', 'darkMode');
    }
}

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

    const streamContainer = document.getElementById('streamContainer');
    streamContainer.classList.toggle('lightMode');

    const videoContainer = document.getElementById('videoContainer');
    videoContainer.classList.toggle('lightMode');

    const chatContainer = document.getElementById('chatContainer');
    chatContainer.classList.toggle('lightMode');

    const infoContainer = document.getElementById('infoContainer');
    infoContainer.classList.toggle('lightMode');

    // change all span elements except title
    const spanElements = document.querySelectorAll('span');
    spanElements.forEach(span => {
        if (span.id != 'emberTitle' && span.id != 'archiveTitle') {
            span.classList.toggle('lightMode');
        }
    });
}


/*
deprecated
// https://stackoverflow.com/a/47604112
const checkVideoData = async () => {
    const videoData = await fetch(`../files/chat.json`)
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
    const jsonData = await checkVideoData();
    const videoTitle = jsonData.video.title;
    document.getElementById('time').innerHTML = timeSince(new Date(jsonData.video.created_at.slice(0, 10))) + ' ago';
    document.getElementById('streamer').innerHTML = jsonData.streamer.name;
    document.getElementById('videoTitle').innerHTML = videoTitle;

    document.getElementById('gameTitle').innerHTML = jsonData.video.chapters[0].gameDisplayName;
    document.getElementById('gameImage').src = jsonData.video.chapters[0].gameBoxArtUrl;
    document.title = videoTitle + ' - Ember Archive';
    if (localStorage.getItem('mode') == 'lightMode') { changeMode(); }
}*/