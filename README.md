# homebridge-intertechno-switch
Homebridge plugin for Intertechno WLAN-Switch ITGW-433 Gateway.
Sends only On or Off commands.
_________________________________________

## IntertechnoSwitch Configuration Params

Example configuration:
```
{
          "accessory": "IntertechnoSwitch",
          "name": "Pompa Aer",
          "host": "192.168.0.1",
          "code": "B2"
          "state": "true"
}
```

## Configuration Params

|             Parameter            |                       Description                       | 
| -------------------------------- | ------------------------------------------------------- |
| `name`                           | Name of the accessory                                   |
| `host`                           | IP of WLAN-Switch ITGW-433 Gateway                      |
| `port`                           | 49880 (default)                                         |
| `code`                           | [A-P][1-9]                                              |
| `state`                          | 'true' | 'false'                                        |


## Help

Code is composed of a capital letter [A-P] and a number [1-9]. 
The code for your switch is setup using the WLAN Switch app from Intertechno.

## Installation

1. Install homebridge using: `npm install -g homebridge`
2. Install homebridge-intertechno-onoff using: `npm install -g homebridge-intertechno-onoff`
3. Update your config file
