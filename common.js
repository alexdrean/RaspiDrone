
global.DESKTOP_IP = '88.182.38.228';

global.PORT_GENERAL = 1000;

global.net = require('net');
global.carrier = require('carrier');
global.msp = require('msp');
global.protocol = new msp.Protocol();

if (typeof String.prototype.startsWith != 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str){
    return this.indexOf(str) === 0;
  };
}
