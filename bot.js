const { Client, ClientOptions } = require('whatsapp-web.js');
const { loadQR } = require('./login');



const client = new Client({
    puppeteer: {
        args: [
            '--no-sandbox',
        ],
    },
});


client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
    loadQR(qr);
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', msg => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
    if (msg.body == "נודר") {
        if (Math.random() > 0.5) {

            msg.reply('נדר');
        }
        else {
            msg.reply('מלשינים דוקר');
        }
    }
});

function botMain() {
    console.log("start")

    client.initialize();
}


module.exports = { botMain };