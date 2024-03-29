require('dotenv').config();
const mongoose = require('mongoose');

const password = encodeURIComponent(process.env.PASSWORD);

let uri= `mongodb+srv://liyajosy:${password}@cluster0.tqxxhi5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
mongoose.connect(uri);
//mongoose.connect(uri,  { useNewUrlParser: true , useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    username:{
        type : String,
        required: true
    }
})

const User = mongoose.model("User", userSchema);

const exerciseSchema = new mongoose.Schema({
   
    userId : String,
    description:{
        type : String,
        required: true
    },
    duration:{
        type : Number,
        required: true
    },
    date :Date

});

const Exercise = mongoose.model("Exercise", exerciseSchema);


const createUser =async (name, done)=>{
    if(name && name.length !==0){
        const newUser = new User({username:name})
        const person =  await newUser.save();
        if(person){
           return   done(null, person)
        }else{
            return  done({err :"Error"}, null);
        }
    }else{
       return   done({err :"USer name is required"}, null);
    }
}


const getUsers = async (done)=>{
    const users= await User.find()
    if(users){
        return  done(null, users)
    }else{
         return done({err :"Not found"}, null);
    }

}

const createExercise= async(userid, info, done) =>{
    
    const user = await User.findById( userid) 
    let  newdate    
    if(user){  
        let isValid = Date.parse(info.date);
        if(isNaN(isValid)){
            newdate = new Date()
        }else{
            newdate = new Date(info.date+" GMT-5")
        }
        //newdate = info.date ? new Date(info.date): new Date()
        console.log("----------------------------")
        console.log("info date:"+info.date)  
              console.log("newdate:"+newdate)     
        const exercise = new Exercise({
            userId : userid,
            description : info.description,
            duration : info.duration,
            date: newdate
        })
       const exer = await  exercise.save()
     console.log("user:"+user)
     console.log("exer:"+exer)
        return  done(  {
            _id:user._id,
            username: user.username, 
            description :exer.description,        
            duration: exer.duration, 
            date: exer.date.toDateString(),
            })
    }else{
        return  done( null)
    }
    
}

const getLogs = async (userId, query, done)=>{
    let logs;
         
    const user = await  User.findById(userId);
  
    if( query.limit){
        logs = await Exercise.find({userId :userId}).limit(query.limit);
    }else{
        logs = await Exercise.find({userId:userId});
    }    
    
    return done( {user:user, logs:logs})
  

}

exports.getLogs = getLogs;
exports.createUser = createUser;
exports.getUsers = getUsers;
exports.createExercise = createExercise;