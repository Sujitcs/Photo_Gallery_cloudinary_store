const usermodel = require('../models/User.model');
const express = require('express');
const userrouter = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();
//const connectDB = require('./middlewares/db');
// Register User
userrouter.post('/signup', (req, res) => {
  const { email, password , name } = req.body;
  let user = new usermodel({ email, password, name});
  user.save()
      .then((user) => {
          res.status(201).json({ message: 'User created successfully', user });
      })
      .catch((err) => {
          res.status(500).json({ error: err.message });
      });
});

// Login User
userrouter.post('/signin', (req, res) => {
  const { email, password } = req.body;
  //console.log(email,password);
  usermodel.findOne({ email:email })
      .then((user) => {
          // console.log(user,"user")
          if (user && user.password == password)  {
              const token = jwt.sign({ Id: user._id }, process.env.SECRET_KEY, { expiresIn: '1hr' });
              res.status(200).json({ message: 'Signin successful', token,user });
          } else {
              res.status(400).json({ error: 'Signin failed' });
          }
      })
      .catch((err) => {
          res.status(500).json({ error: err.message });
      });
});
userrouter.get('/userlist', async (req, res) => {
    try {
      const user = await usermodel.find({});
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  });
module.exports = userrouter;
console.log('User router is ready');
