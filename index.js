//First, we need to inject our plugin within homebridge. DCteletask is the javascript object that will contain our control logic
var Accessory, Service, Characteristic, UUIDGen;
//-------------------------------
var Teletask = require('node-teletask');

//-------------------------------
module.exports = function (homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  UUIDGen = homebridge.hap.uuid;
  homebridge.registerAccessory("DCteletask-switch-plugin", "DCteletask-Switch", DCteletask);
};
//---------------

Switch.prototype = {
  getServices: function () {
    let informationService = new Service.AccessoryInformation();
    informationService
      .setCharacteristic(Characteristic.Manufacturer, "DC")
      .setCharacteristic(Characteristic.Model, "DCteletask")
      .setCharacteristic(Characteristic.SerialNumber, "123-456-789");
 
    let switchService = new Service.Switch("RELE");
    switchService
      .getCharacteristic(Characteristic.On)
        .on('get', this.getSwitchOnCharacteristic.bind(this))
        .on('set', this.setSwitchOnCharacteristic.bind(this));
 
    this.informationService = informationService;
    this.switchService = switchService;
    return [informationService, switchService];
  }
//  -----------------------------------------------------
var HOST = '192.168.1.5';
var PORT = 55957;
var teletask = new Teletask.connect(HOST,PORT);

function DCteletask(log, config) {
  this.log = log;
  this.get = teletask.get(Teletask.functions.relay, 1, function(report){console.log("Relay 21 is " + report.value.name);});
  this.set = teletask.set(Teletask.functions.relay, 1, Teletask.settings.toggle);
}


DCteletask.prototype = {
 
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
// -------------  

 
function DCteletask(log, config) {
  this.log = log;
  this.getUrl = url.parse(config['getUrl']);
  this.postUrl = url.parse(config['postUrl']);
}
 
DCteletask.prototype = {
 
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
