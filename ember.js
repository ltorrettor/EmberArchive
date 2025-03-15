// https://stackoverflow.com/a/47604112
const checkVideoData = async () => {
    let videoData = await fetch(`./chat.json`)
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

// Code modified from https://github.com/JZimz/tmi-utils to fit the data gotten from TwitchDownloader for the next two functions

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
                // add a semicolon before the message 
                const parsedMessage = parseEmotesInMessage(jsonData.comments[i].message.emoticons, jsonData.comments[i].message.body);
                const timestamp = document.createElement('span');
                const username = document.createElement('span');
                const message = document.createElement('span');

                message.append(': ');
                for (let i = 0; i < parsedMessage.length; i++) {
                    console.log(parsedMessage[i].value);
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

                timestamp.innerHTML = '[' + jsonData.comments[i].created_at.slice(11, 19) + '] ';
                username.innerHTML = jsonData.comments[i].commenter.display_name;
                username.style.color = jsonData.comments[i].message.user_color;

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

document.getElementById('video').src = './video.mp4';
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

