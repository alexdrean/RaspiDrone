require('./common.js');

var serialport = require("serialport");
var general = {failed:0};
var sp = new serialport.SerialPort('/dev/ttyS0', {
  parser: serialport.parsers.readline("\n"),
  baudrate: 115200
});
var client;

function connectGeneral() {

  client = new global.net.Socket();
  client.setNoDelay(true);
  client.connect(PORT_GENERAL, DESKTOP_IP, function() {
    console.log("GENERAL TCP " + PORT_GENERAL + " CONNECTED");
    client.write("Hello world!");

    general.failed = 0;
  });

  client.on('data', function(data) {
    var str = typeof data !== "undefined" ? data.toString() : '';
    var t = 'trame';
    if (str.startsWith(t)) {
      str.substring(t.length, str.length-t.length);
    } else if (str.startsWith('$M')) {
      if (sp.isOpen()) sp.write(data);
    } else {
      console.log('GENERAL TCP ' + PORT_GENERAL + ' - ' + data);
    }
  });

  client.on('close', function() {
    if (general.failed < 2) {
      console.log('GENERAL TCP ' + PORT_GENERAL + " DISCONNECTED");
      console.log('Trying to reconnect');
    }
    connectGeneral();
  });

  client.on('error', function(e) {
    if (general.failed < 2) console.log(e);
    general.failed++;
  });
}
sp.on('open', connectGeneral);
sp.on('data', function(data) {
  if (typeof client !== "undefined" && client && !client.destroyed) {
    client.write(data);
  }
});
// connectGeneral();
