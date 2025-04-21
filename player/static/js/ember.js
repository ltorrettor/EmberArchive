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