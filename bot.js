const { Client, Util } = require('whatsapp-web.js');
const { loadQR } = require('./login');
const fs = require('fs');
var Jimp = require("jimp");

function saveSession(session) {
    fs.writeFile('qr.json', JSON.stringify(session, null, 2), function (err) {
        if (err) return console.log(err);
    });
}

function readSession() {
    try {
        let rawData = fs.readFileSync('qr.json');
        return JSON.parse(rawData);
    }
    catch (error) {
        return null;
    }

}

async function onMsg(msg) {
    if (msg.type == "image") {
        var media = await msg.downloadMedia();
        var readFile = await Jimp.read(Buffer.from(media.data, 'base64'));
        var font = await Jimp.loadFont(Jimp.FONT_SANS_128_BLACK);

        readFile = await readFile.print(font, 200, 100, msg.body);
        readFile.getBase64(Jimp.MIME_JPEG, (error, jimp) => {
            jimp = jimp.replace("data:image/jpeg;base64,", "");
            media.data = jimp;
            msg.reply(media, undefined, { sendMediaAsSticker: true, media });
            console.log("image: ", msg.body);
        });
        //var asSticker = await Util.formatImageToWebpSticker(media);

    }
    else if (msg.type == "chat") {
        console.log("msg: ", msg.body);
    }
    else {
        console.log("don't react to the case of the type:", msg.type);
    }
}

function botMain() {
    console.log("start")

    const session = readSession();

    const client = new Client({
        puppeteer: {
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
            ],
        },
        session,
    });

    client.on('qr', (qr) => {
        // Generate and scan this code with your phone
        console.log('QR RECEIVED', qr);
        loadQR(qr);
    });

    client.on('authenticated', session => {
        saveSession(session);
    });

    client.on('ready', () => {
        console.log('Client is ready!');
    });

    client.on('message', (msg) => {
        onMsg(msg);
    });

    // client.on('MessageMedia', (mimetype, data, filename) => {
    //     console.log('image data: ' + data);
    //     console.log('image type: ' + mimetype);
    //     console.log('image name: ' + filename);
    // });

    client.initialize();
}


module.exports = { botMain };