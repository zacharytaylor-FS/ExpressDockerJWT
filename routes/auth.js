const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
require('dotenv').config()
const router = express.Router();

const users = [];

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Store new user
    const user = new User({ username, email, password: hashedPassword});
      await user.save();
    // users.push( {username, password: hashedPassword});
      res.status(201).json({ message: `User registered successfully`})
  } catch (error) {
    res.status(500).json({ error: `Registration failed`})
  }
 
});

// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  //Find User
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials'});
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials'})
  };

  // Create a JWT
  const token = jwt.sign({ username: user.username}, process.env.JWT_TOKEN, { expiresIn: '1hr'})

  res.send({ token })
});

router.get('/protected', (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    res.status(401).json({ message: 'No token provided'})
  };

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    res.json({ message: `Protected route`, user: decoded });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token'})
  }
});

module.exports = router