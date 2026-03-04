var express = require('express');
var router = express.Router();
let { dataRole, dataUser } = require('../data2');

// GET all roles
router.get('/', function (req, res, next) {
  res.json(dataRole);
});

// GET role by ID
router.get('/:id', function (req, res, next) {
  let id = req.params.id;
  let result = dataRole.find(role => role.id === id);
  if (result) {
    res.json(result);
  } else {
    res.status(404).json({ message: "Role ID NOT FOUND" });
  }
});

// GET all users in a role
router.get('/:id/users', function (req, res, next) {
  let roleId = req.params.id;
  let roleExists = dataRole.find(role => role.id === roleId);
  if (!roleExists) {
    return res.status(404).json({ message: "Role ID NOT FOUND" });
  }
  let result = dataUser.filter(user => user.role.id === roleId);
  res.json(result);
});

// CREATE new role
router.post('/', function (req, res, next) {
  let { name, description } = req.body;
  
  if (!name) {
    return res.status(400).json({ message: "Role name is required" });
  }
  
  // Generate new ID
  let newId = 'r' + (Math.max(...dataRole.map(r => parseInt(r.id.substring(1)))) + 1);
  
  let newRole = {
    id: newId,
    name: name,
    description: description || '',
    creationAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  dataRole.push(newRole);
  res.status(201).json(newRole);
});

// UPDATE role
router.put('/:id', function (req, res, next) {
  let id = req.params.id;
  let roleIndex = dataRole.findIndex(role => role.id === id);
  
  if (roleIndex === -1) {
    return res.status(404).json({ message: "Role ID NOT FOUND" });
  }
  
  let { name, description } = req.body;
  
  if (name) dataRole[roleIndex].name = name;
  if (description) dataRole[roleIndex].description = description;
  dataRole[roleIndex].updatedAt = new Date().toISOString();
  
  res.json(dataRole[roleIndex]);
});

// DELETE role
router.delete('/:id', function (req, res, next) {
  let id = req.params.id;
  let roleIndex = dataRole.findIndex(role => role.id === id);
  
  if (roleIndex === -1) {
    return res.status(404).json({ message: "Role ID NOT FOUND" });
  }
  
  let deletedRole = dataRole.splice(roleIndex, 1);
  res.json({ message: "Role deleted successfully", data: deletedRole[0] });
});

module.exports = router;
