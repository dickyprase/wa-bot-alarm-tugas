const { create } = require('@open-wa/wa-automate')
const { color } = require('./util')
const clientOptions = require('./util').options
const msgHandler = require('./msgHandler/message')

const wa = require('@open-wa/wa-automate');

wa.create({
  sessionId: "SESSION",
  multiDevice: true, //required to enable multiDevice support
  authTimeout: 60, //wait only 60 seconds to get a connection with the host account device
  blockCrashLogs: true,
  disableSpins: true,
  headless: true,
  hostNotificationLang: 'PT_BR',
  logConsole: false,
  popup: true,
  qrTimeout: 0, //0 means it will wait forever for you to scan the qr code
}).then(client => start(client));

function start(client) {
  client.onMessage(async message => {
    msgHandler(client, message);
  });
}

