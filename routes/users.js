var express = require('express');
var router = express.Router();
let { dataUser, dataRole } = require('../data2');

// GET all users
router.get('/', function (req, res, next) {
  res.json(dataUser);
});

// GET user by username
router.get('/:username', function (req, res, next) {
  let username = req.params.username;
  let result = dataUser.find(user => user.username === username);
  
  if (result) {
    res.json(result);
  } else {
    res.status(404).json({ message: "User NOT FOUND" });
  }
});

// CREATE new user
router.post('/', function (req, res, next) {
  let { username, password, email, fullName, role } = req.body;
  
  // Validation
  if (!username || !password || !email || !fullName) {
    return res.status(400).json({ 
      message: "username, password, email and fullName are required" 
    });
  }
  
  // Check if username exists
  if (dataUser.find(u => u.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }
  
  // Check if email exists
  if (dataUser.find(u => u.email === email)) {
    return res.status(400).json({ message: "Email already exists" });
  }
  
  // Check if role exists
  let selectedRole = dataRole.find(r => r.id === role);
  if (!selectedRole && !role) {
    selectedRole = dataRole.find(r => r.id === 'r3'); // Default role
  } else if (!selectedRole) {
    return res.status(404).json({ message: "Role NOT FOUND" });
  }
  
  let newUser = {
    username: username,
    password: password,
    email: email,
    fullName: fullName,
    avatarUrl: "https://i.sstatic.net/l60Hf.png",
    status: true,
    loginCount: 0,
    role: {
      id: selectedRole.id,
      name: selectedRole.name,
      description: selectedRole.description
    },
    creationAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  dataUser.push(newUser);
  res.status(201).json(newUser);
});

// UPDATE user
router.put('/:username', function (req, res, next) {
  let username = req.params.username;
  let userIndex = dataUser.findIndex(user => user.username === username);
  
  if (userIndex === -1) {
    return res.status(404).json({ message: "User NOT FOUND" });
  }
  
  let { password, email, fullName, avatarUrl, status, role } = req.body;
  
  // Check email uniqueness if updating email
  if (email && email !== dataUser[userIndex].email) {
    if (dataUser.find(u => u.email === email)) {
      return res.status(400).json({ message: "Email already exists" });
    }
  }
  
  if (password) dataUser[userIndex].password = password;
  if (email) dataUser[userIndex].email = email;
  if (fullName) dataUser[userIndex].fullName = fullName;
  if (avatarUrl) dataUser[userIndex].avatarUrl = avatarUrl;
  if (status !== undefined) dataUser[userIndex].status = status;
  
  if (role) {
    let selectedRole = dataRole.find(r => r.id === role);
    if (!selectedRole) {
      return res.status(404).json({ message: "Role NOT FOUND" });
    }
    dataUser[userIndex].role = {
      id: selectedRole.id,
      name: selectedRole.name,
      description: selectedRole.description
    };
  }
  
  dataUser[userIndex].updatedAt = new Date().toISOString();
  
  res.json(dataUser[userIndex]);
});

// DELETE user
router.delete('/:username', function (req, res, next) {
  let username = req.params.username;
  let userIndex = dataUser.findIndex(user => user.username === username);
  
  if (userIndex === -1) {
    return res.status(404).json({ message: "User NOT FOUND" });
  }
  
  let deletedUser = dataUser.splice(userIndex, 1);
  res.json({ message: "User deleted successfully", data: deletedUser[0] });
});

module.exports = router;
