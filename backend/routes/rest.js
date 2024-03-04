const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyToken = require('../middleware/authMiddleware');
const saltRounds = 10;

const restRouter = express.Router();
restRouter.use(bodyParser.json());

restRouter.post('/signup', async (req, res) => {
  const { firstName, lastName, email, phoneNumber, username, password } = req.body;
  
  try {
    // Check if the email is already in use
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'Email is already in use' });
    }

    // Check if the username is already in use
    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
      return res.status(400).json({ success: false, message: 'Username is already in use' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      username,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    res.json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

restRouter.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: 'No such user found' });
    }

    // Compare the provided password with the hashed password in the database
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, 'secretKey', { expiresIn: '1h' });

    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

restRouter.get('/users', verifyToken, async (req, res) => {
  try {
    const users = await User.find({}, 'username');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = restRouter;
