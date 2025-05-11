//login

//register


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Auth = require('../model/authModel');
require('dotenv').config();

const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await Auth.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Auth({ username, email, password: hashedPassword });
    await newUser.save();

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      username: newUser.username
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Auth.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      username: user.username
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
