const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const conn = require('../lib/db')
const user = require('../models/user');


/**
 * Allows user to login.
 * METHOD: POST
 * URL: /api/login
 * BODY PARAMS:
 *    username: string,
 *    password: string
 * RESPONSE:
 *    status: string,
 *    message: string,
 *    token: string
 */
router.post("/login", function(req, res, next){
  const username = req.body.username;
  const password = req.body.password;

  user.login(username, password, function(success,response){
      if(!success){
          res.status(401).json(response);
      }else{
          res.json(response);
      }
  })
})

/**
 * Allows user to create a new account.
 * METHOD: POST
 * URL: /api/register
 * BODY PARAMS:
 *    username: string,
 *    password: string
 * RESPONSE:
 *    status: string,
 *    message: string,
 *    token: string
 */
router.post('/register', function(req, res, next){
  const username = req.body.username
  const password = req.body.password
  user.createUser(username, password, function(success,response){
      if(!success){
          res.status(401).json(response)
      }else{
        res.json(response);
      }
  })
})

router.get("/", function(req, res, next){
  res.json({
    message: 'This is the home route'
  })
})

module.exports = router