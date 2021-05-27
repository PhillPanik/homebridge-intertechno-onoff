const dgram = require("dgram")
const nodePersist = require("node-persist")

var Service, Characteristic, HomebridgeAPI

module.exports = function (homebridge) {
  Service = homebridge.hap.Service
  Characteristic = homebridge.hap.Characteristic
  HomebridgeAPI = homebridge

  homebridge.registerAccessory(
    "homebridge-intertechno-onoff",
    "IntertechnoOnOff",
    IntertechnoOnOff
  )
}

function IntertechnoOnOff(log, config) {
  this.log = log
  this.name = config["name"]
  this.host = config["host"]
  this.port = config["port"] || 49880
  this.code = config["code"]
  this.stay = config["stay"]

  switch (this.stay) {
    case "on":
    case "On":
    case "ON":
      this.state = true
      break
    case "off":
    case "Off":
    case "OFF":
      this.state = false
      break
    default:
      this.state = false
      break
  }

  this.cacheDirectory = HomebridgeAPI.user.persistPath()
  this.storage = nodePersist
  this.storage.initSync({ dir: this.cacheDirectory, forgiveParseErrors: true })

  this.service = new Service.Switch(this.name)
  this.service
    .getCharacteristic(Characteristic.On)
    .on("set", this.setOn.bind(this))
    .on("get", this.getOn.bind(this))

  var cachedState = this.storage.getItemSync(this.name)
  if (cachedState === undefined || cachedState === false) {
    this.service.setCharacteristic(Characteristic.On, false)
  } else {
    this.service.setCharacteristic(Characteristic.On, true)
  }
}

IntertechnoOnOff.prototype.getServices = function () {
  return [this.service]
}

IntertechnoOnOff.prototype.getOn = function (callback) {
  callback(null, this.state)
}

IntertechnoOnOff.prototype.setOn = function (on, callback) {
  if (!this.stay) this.state = on

  this.log(`Setting Intertechno ${this.name} to ${this.state ? "On" : "Off"}`)

  const h = "4,12,12,4," // 1
  const l = "4,12,4,12," // 0

  this.log(this.code)
  var a = (this.code.charCodeAt(0) - "A".charCodeAt(0))
    .toString(2)
    .padStart(4, 0)
  var b = (this.code.charCodeAt(1) - "1".charCodeAt(0))
    .toString(2)
    .padStart(4, 0)

  var master = ""
  var slave = ""
  var toggle = this.state ? h + h : h + l
  for (var i = 3; i >= 0; i--) {
    master += a[i] === "1" ? h : l
    slave += b[i] === "1" ? h : l
  }
  var msg =
    "0,0,6,11125,89,26,0," + master + slave + (l + h) + toggle + "1,125,0"

  const client = dgram.createSocket("udp4")
  client.send(msg, this.port, this.host, (_err) => {
    client.close()
  })

  this.storage.setItemSync(this.name, this.state)

  callback()
}
