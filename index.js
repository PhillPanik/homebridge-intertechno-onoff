var Service, Characteristic, HomebridgeAPI;

module.exports = function (homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  HomebridgeAPI = homebridge;

  homebridge.registerAccessory(
    "homebridge-intertechno-on-off",
    "IntertechnoOnOff",
    IntertechnoOnOff
  );
};

function IntertechnoOnOff(log, config) {
  this.log = log;
  this.name = config["name"];
  this.host = config["host"];
  this.port = config["port"] || 49880;
  this.code = config["code"];
  this.state = config["state"] || "true";

  this.cacheDirectory = HomebridgeAPI.user.persistPath();
  this.storage = require("node-persist");
  this.storage.initSync({ dir: this.cacheDirectory, forgiveParseErrors: true });

  this.service = new Service.Switch(this.name);
  this.service
    .getCharacteristic(Characteristic.On)
    .on("set", this._setOn.bind(this))
    .on("get", this._getOn.bind(this));

  var cachedState = this.storage.getItemSync(this.name);
  if (cachedState === undefined || cachedState === false) {
    this.service.setCharacteristic(Characteristic.On, false);
  } else {
    this.service.setCharacteristic(Characteristic.On, true);
  }
}

IntertechnoOnOff.prototype.getServices = function () {
  return [this.service];
};

IntertechnoOnOff.prototype._getOn = function (callback) {
  callback(null, this.state === "true");
};

IntertechnoOnOff.prototype._setOn = function (_on, callback) {
  this.log("Setting Intertechno " + this.name + " to " + this.state);

  const h = "4,12,12,4,"; // 1
  const l = "4,12,4,12,"; // 0

  this.log(this.code);
  a = (this.code.charCodeAt(0) - "A".charCodeAt(0)).toString(2).padStart(4, 0);
  b = (this.code.charCodeAt(1) - "1".charCodeAt(0)).toString(2).padStart(4, 0);

  var master = "";
  var slave = "";
  var toggle = this.state === "true" ? h + h : h + l;
  for (var i = 3; i >= 0; i--) {
    master += a[i] === "1" ? h : l;
    slave += b[i] === "1" ? h : l;
  }
  var msg =
    "0,0,6,11125,89,26,0," + master + slave + (l + h) + toggle + "1,125,0";

  const dgram = require("dgram");
  const client = dgram.createSocket("udp4");
  client.send(msg, this.port, this.host, (err) => {
    client.close();
  });

  this.storage.setItemSync(this.name, this.state === "true");

  callback();
};
