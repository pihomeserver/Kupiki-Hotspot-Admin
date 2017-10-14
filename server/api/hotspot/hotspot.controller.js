'use strict';

import * as script from '../../system/system.service';

export function getDefaultConfiguration(req, res) {
  var configuration = [{"field":"interface","value":"wlan0"},
    {"field":"driver","value":"nl80211"},
    {"field":"ssid","value":"pihotspot"},
    {"field":"hw_mode","value":"g"},
    {"field":"channel","value":"6"},
    {"field":"auth_algs","value":"1"},
    {"field":"beacon_int","value":"100"},
    {"field":"dtim_period","value":"2"},
    {"field":"max_num_sta","value":"255"},
    {"field":"rts_threshold","value":"2347"},
    {"field":"fragm_threshold","value":"2346"}];

  res.status(200).json({status: 'success', result: {code: 0, message: configuration }});
}

export function getConfigurationFields(req, res) {
  var hotspotConfFields = {
    interface: {
      display: 'Wifi interface',
      help: 'Interface that will be used to create the Wifi hotspot',
      type: 'select',
      data: [{text:'wlan0', value: 'wlan0'}]
    },
    driver: {
      display: 'Chipset driver',
      help: 'Driver to activate the Wifi chipset',
      type: 'select',
      data: [{text:'nl80211', value: 'nl80211'}]
    },
    ssid: {
      display: 'SSID',
      help: 'Name that will be visible on users\' devices',
      type: 'text'
    },
    hw_mode: {
      display: 'Wifi mode',
      help: 'Operation mode (a = IEEE 802.11a, b = IEEE 802.11b, g = IEEE 802.11g,' +
      'ad = IEEE 802.11ad (60 GHz); a/g options are used with IEEE 802.11n, too, to ' +
      'specify band). Default: IEEE 802.11b',
      type: 'select',
      data: [{text:'a', value: 'a'}, {text:'b', value: 'b'}, {text:'g', value: 'g'}]
    },
    channel: {
      display: 'Channel',
      help: 'Channel number (IEEE 802.11)',
      type: 'number',
      data: {min: 1, max: 14}
    },
    auth_algs: {
      display: 'Authentication',
      help: 'IEEE 802.11 specifies two authentication algorithms. hostapd can be ' +
      'configured to allow both of these or only one. Open system authentication ' +
      'should be used with IEEE 802.1X.',
      type: 'select',
      data: [{text:'no authentication', value: 0}, {text:'wpa', value: 1}, {text:'wep', value: 2}, {text:'both', value: 3}]
    },
    beacon_int: {
      display: 'Beacon interval in kus',
      help: 'Beacon interval in kus (1.024 ms) (default: 100; range 15..65535)',
      type: 'number',
      data: {min: 15, max: 65535}
    },
    dtim_period: {
      display: 'Delivery Traffic Information Message',
      help: 'DTIM (delivery traffic information message) period (range 1..255): ' +
      'number of beacons between DTIMs (1 = every beacon includes DTIM element). (default: 2)',
      type: 'number',
      data: {min: 1, max: 255}
    },
    max_num_sta: {
      display: 'Maximum number of stations',
      help: 'Maximum number of stations allowed in station table. New stations will be ' +
      'rejected after the station table is full. IEEE 802.11 has a limit of 2007 ' +
      'different association IDs, so this number should not be larger than that. ' +
      '(default: 2007)',
      type: 'number',
      data: {min: 1, max: 2007}
    },
    rts_threshold: {
      display: 'RTS/CTS threshold',
      help: 'RTS/CTS threshold; 2347 = disabled (default); range 0..2347. ' +
      'If this field is not included in hostapd.conf, hostapd will not control ' +
      'RTS threshold and \'iwconfig wlan# rts <val>\' can be used to set it.',
      type: 'number',
      data: {min: 0, max: 2347}
    },
    fragm_threshold: {
      display: 'Fragmentation threshold',
      help: 'Fragmentation threshold; 2346 = disabled (default); range 256..2346. ' +
      'If this field is not included in hostapd.conf, hostapd will not control ' +
      'fragmentation threshold and \'iwconfig wlan frag <val>\' can be used to set it.',
      type: 'number',
      data: {min: 256, max: 2346}
    }
  };

  res.status(200).json({status: 'success', result: {code: 0, message: hotspotConfFields }});
}

export function setConfiguration(req, res) {
  if (req.body.configuration) {
    let fields = req.body.configuration;
    let fs = require('fs');
    fs.unlink('/tmp/hostapd.conf', function (error) {
      if (error && error.code !== 'ENOENT') {
        console.log(error);
        res.status(200).json({status: 'failed', result: {code: error.errno, message: error }});
      } else {
        var stream = fs.createWriteStream('/tmp/hostapd.conf');
        stream.once('open', function(fd) {
          for (var i = 0; i < fields.length; i++) {
            stream.write(fields[i].field+'='+fields[i].value+'\n');
          }
          stream.end();
        });
        stream.on('error', function(err) {
          res.status(200).json({status: 'failed', result: {code: -1, message: 'Unable to write the configuration file' }});
        });
        stream.on('close', function(err) {
          script.execPromise('hostapd save')
            .then(function(result) {
              if (req.body.restart) {
                script.execPromise('service hostapd restart')
                  .then(function (result) {
                    res.status(200).json({ status: 'success', result: { code : 0, message : '' }});
                  })
                  .catch(function (error) {
                    res.status(200).json({ status: 'failed', result: { code : error.code, message : error.stderr }});
                  });
                } else {
                  res.status(200).json({ status: 'success', result: { code : 0, message : '' }});
                }
            })
            .catch(function(error) {
              console.log(error);
              res.status(200).json({status: 'failed', result: {code: -1, message: 'Unable to write the configuration file' }});
            });
        });
      }
    });
  } else {
    res.status(200).json({status: 'failed', result: {code: -1, message: 'No configuration found in the request' }});
  }
}

export function getConfiguration(req, res) {
  script.execPromise('hostapd load')
    .then(function (result) {
      var configuration = [];
      result.stdout.split('\n').forEach(function(elt) {
        if (elt.trim().length > 0) {
          var arrTmp = elt.trim().split(/[=]+/);
          configuration.push({
            field: arrTmp[0],
            value: arrTmp[1]
          });
        }
      });
      if (configuration.length === 0) {
        res.status(200).json({status: 'failed', result: {code: -1, message: 'No configuration found' }});
      } else {
        res.status(200).json({status: 'success', result: {code: 0, message: configuration }});
      }
    })
    .catch(function (error) {
      console.log(error);
      res.status(200).json({ status: 'failed', result: { code : error.code, message : error.stderr }});
    });
}
