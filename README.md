# homebridge-intertechno-onoff
Homebridge plugin for Intertechno WLAN-Switch ITGW-433 Gateway.
Can toggle On and off or be set to only send On or Off commands.
_________________________________________

## IntertechnoOnOff Configuration Params

Example configuration:
```
{
          "accessory": "IntertechnoOnOff",
          "name": "On Switch",
          "host": "192.168.0.37",
          "code": "B2",
          "stay": "on"
}
```

## Configuration Params

|             Parameter            |                       Description                       | 
| -------------------------------- | ------------------------------------------------------- |
| `name`                           | Name of the accessory                                   |
| `host`                           | IP of WLAN-Switch ITGW-433 Gateway                      |
| `port`                           | 49880 (default)                                         |
| `code`                           | [A-P][1-9]                                              |
| `stay` (optional)                | 'on' or 'off'                                           |


## Help

Code is composed of a capital letter [A-P] and a number [1-9]. 
The code for your switch is setup using the WLAN Switch app from Intertechno.
If you set `stay` to `on` the switch will always send an On command and setting it to `off` will always send an Off command.  If you do not set `stay` the switch will toggle between On and Off.

## Installation

1. Install homebridge using: `npm install -g homebridge`
2. Install homebridge-intertechno-onoff using: `npm install -g homebridge-intertechno-onoff`
3. Update your config file
