// https://stackoverflow.com/a/3177838
function timeSince(date) {

    var seconds = Math.floor((new Date(Date.now()) - date) / 1000);
    var interval = seconds / 31536000;
    var text = '';

    if (interval > 1) {
        text = ' year';
        if (Math.floor(interval) != 1)
            text += 's';
        return Math.floor(interval) + text;
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        text = ' month';
        if (Math.floor(interval) != 1)
            text += 's';
        return Math.floor(interval) + text;
    }
    interval = seconds / 86400;
    if (interval > 1) {
        text = ' day';
        if (Math.floor(interval) != 1)
            text += 's';
        return Math.floor(interval) + text;
    }
    interval = seconds / 3600;
    if (interval > 1) {
        text = ' hour';
        if (Math.floor(interval) != 1)
            text += 's';
        return Math.floor(interval) + text;
    }
    interval = seconds / 60;
    if (interval > 1) {
        text = ' minute';
        if (Math.floor(interval) != 1)
            text += 's';
        return Math.floor(interval) + text;
    }
        text = ' second';
        if (Math.floor(interval) != 1)
            text += 's';
        return Math.floor(seconds) + text;
}


document.getElementById('modeButton').onclick = function () {
    changeMode();
    if (localStorage.getItem('mode') != 'lightMode') {
        localStorage.setItem('mode', 'lightMode');
    } else {
        localStorage.setItem('mode', 'darkMode');
    }
}

// *************************************************
// FOLLOWING FUNCTIONS INCLUDED FOR TESTING PURPOSES:
// *************************************************

function getEmoteAsUrl(id, theme = 'light', scale = '1.0') {
    return `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/${theme}/${scale}`;
  }

function parseEmotesInMessage(emotes, msg) {
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
}