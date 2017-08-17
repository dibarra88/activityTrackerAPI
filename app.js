const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const authenticate = require("./middleware/authorization")

//Routes
const user = require('./routes/user')
const activity = require('./routes/activity')

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use('/api', user)
app.use('/api', authenticate, activity)

app.listen(3000, function(){
  console.log("App running on port 3000")
})
