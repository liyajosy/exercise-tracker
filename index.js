const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser');

app.use(cors())
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const createUser = require('./myapp.js').createUser;
app.post('/api/users', (req, res)=>{
  createUser(req.body.username, (err, data)=>{
    if(err){
      return res.json(err);
    }else{
      return res.json(data);
    }
  })
  
});

const createExercise = require('./myapp.js').createExercise;
app.post('/api/users/:_id/exercises',(req, res)=>{
  console.log("id ::"+req.params._id);
  createExercise(req.params._id, req.body, (err, data)=>{
    if(err){
      return res.json(err);
    }else{
      return res.json(data);
    }
  })
});

const getLogs = require('./myapp.js').getLogs;
app.get('/api/users/:_id/logs',(req, res)=>{
  console.log("id ::"+req.params._id);
  getLogs(req.params._id, (err, data)=>{
    if(err){
      return res.json(err);
    }else{
      return res.json(data);
    }
  })
})

const getUsers = require('./myapp.js').getUsers;
app.get('/api/users', (req, res) => {
  getUsers((err, data)=>{
    if(err){
      return res.json(err);
    }else{
      return res.json(data);
    }
   })
  
});



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
