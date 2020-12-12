const open = require('open');

function loadQR(qr) {
    url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qr}`
    open(url);
}

module.exports = { loadQR };