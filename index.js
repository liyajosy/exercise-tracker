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
    if(data){
       res.json(data);
    }else{
       res.json(err);
    }
  })
  
});

const createExercise = require('./myapp.js').createExercise;
app.post('/api/users/:_id/exercises',(req, res)=>{
 // console.log("id ::"+req.params._id);
  createExercise(req.params._id, req.body, ( data)=>{
    if(data){
      const stringDate = new Date(data.date).toDateString()
      console.log(data.username)
       res.json({
        _id:data._id,
        username: data.username, 
        date: stringDate,
        duration: Number (data.duration), 
        description :data.description   
                        
        });      
    }else{
       res.json({error :"error"});
    }
  })
});

const getLogs = require('./myapp.js').getLogs;
app.get('/api/users/:_id/logs',(req, res)=>{
  
  getLogs(req.params._id, req.query, (data)=>{
  
    if(data){
      
      const logDetails = data.logs.map((item)=>{
        const stringDate = new Date(item.date).toDateString()
        console.log("type ::"+typeof stringDate)
        return ({
          description: item.description,
          duration :item.duration,
          date : stringDate
         })          
      })      
        res.json( { _id:data.user._id, username:data.user.username , count : data.logs.length, log: logDetails})
              
  } 
  else{
    console.log("---errr----")
    res.json({err :"error"})
  } 
  
  })
})

const getUsers = require('./myapp.js').getUsers;
app.get('/api/users', (req, res) => {
  getUsers((err, data)=>{
    if(data){
       res.json(data);
    }else{
       res.json(err);
    }
   })
  
});



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
