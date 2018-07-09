var http = require('http');
var Accessory, Service, Characteristic, UUIDGen;
//-------------------------------
var Teletask = require('node-teletask');
var HOST = '192.168.1.5';
var PORT = 55957;
var teletask = new Teletask.connect(HOST,PORT);
//-------------------------------
module.exports = function (homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  UUIDGen = homebridge.hap.uuid;

homebridge.registerPlatform("DCteletask-switch-plugin", "DCteletask-Switch", DCteletask, true);
};
//----------------------------------------------------



//-------------------------------------
function DCteletask-Switch(log, config, api) {
  log("DCteletask-Switch Init");
  var platform = this;
  this.log = log;
  this.config = config;
  this.accessories = [];
//----------------------------------------

Switch.prototype = {
  getServices: function () {
    let informationService = new Service.AccessoryInformation();
    informationService
      .setCharacteristic(Characteristic.Manufacturer, "My switch manufacturer")
      .setCharacteristic(Characteristic.Model, "My switch model")
      .setCharacteristic(Characteristic.SerialNumber, "123-456-789");
 
    let switchService = new Service.Switch("My switch");
    switchService
      .getCharacteristic(Characteristic.On)
        .on('get', this.getSwitchOnCharacteristic.bind(this))
        .on('set', this.setSwitchOnCharacteristic.bind(this));
 
    this.informationService = informationService;
    this.switchService = switchService;
    return [informationService, switchService];
  }
  -----------------------------------------------------
  const request = require('request');
const url = require('url');
 
function mySwitch(log, config) {
  this.log = log;
  this.getUrl = url.parse(config['getUrl']);
  this.postUrl = url.parse(config['postUrl']);
}
 
mySwitch.prototype = {
 
  getSwitchOnCharacteristic: function (next) {
    const me = this;
    request({
        url: me.getUrl,
        method: 'GET',
    }, 
    function (error, response, body) {
      if (error) {
        me.log('STATUS: ' + response.statusCode);
        me.log(error.message);
        return next(error);
      }
      return next(null, body.currentState);
    });
  },
   
  setSwitchOnCharacteristic: function (on, next) {
    const me = this;
    request({
      url: me.postUrl,
      body: {'targetState': on},
      method: 'POST',
      headers: {'Content-type': 'application/json'}
    },
    function (error, response) {
      if (error) {
        me.log('STATUS: ' + response.statusCode);
        me.log(error.message);
        return next(error);
      }
      return next();
    });
  }
};
