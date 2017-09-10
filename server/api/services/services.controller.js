'use strict';

export function index(req, res) {
  var services = [];

  var dummyData = `
    [ - ]  alsa-utils
    [ + ]  atd
    [ + ]  avahi-daemon
    [ + ]  bluetooth
    [ + ]  chilli
    [ + ]  collectd
    [ - ]  console-setup.sh
    [ + ]  cron
    [ + ]  dbus
    [ - ]  dhcpcd
    [ + ]  dphys-swapfile
    [ + ]  exim4
    [ + ]  fake-hwclock
    [ + ]  freeradius
    [ + ]  hostapd
    [ - ]  hwclock.sh
    [ - ]  keyboard-setup.sh
    [ + ]  kmod
    [ - ]  lvm2
    [ + ]  lvm2-lvmetad
    [ + ]  lvm2-lvmpolld
    [ + ]  mysql
    [ + ]  networking
    [ - ]  nfs-common
    [ + ]  nginx
    [ - ]  paxctld
    [ + ]  php7.0-fpm
    [ - ]  plymouth
    [ - ]  plymouth-log
    [ + ]  procps
    [ + ]  raspi-config
    [ - ]  rpcbind
    [ - ]  rsync
    [ + ]  rsyslog
    [ + ]  ssh
    [ - ]  sudo
    [ + ]  triggerhappy
    [ + ]  udev
    [ - ]  x11-common`;

  dummyData.split('\n').forEach(function(elt){
    if (elt.trim().length > 0) {
      var arrTmp = elt.trim().split(/[\s\t]+/);
      services.push({
        name: arrTmp[3],
        status: (arrTmp[1] === '+' ? true : false)
      });
    }
  });
  res.status(200).json(services);
}
