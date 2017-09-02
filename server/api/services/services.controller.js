'use strict';

export function index(req, res) {
  var services = [
    { name: "MariaDB", status: "up"},
    { name: "Coova Chilli", status: "down"},
    { name: "Freeradius", status: "up"}];

  res.status(200).json(services);
}
