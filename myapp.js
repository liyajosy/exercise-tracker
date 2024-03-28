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
    username:{
        type : String,
        required: true
    },
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

const logSchema = new mongoose.Schema({
    username:{
        type : String,
        required: true
    },
    count : Number,
    log :[exerciseSchema]
});
const Log = mongoose.model("Log", logSchema);

const createUser =async (name, done)=>{
    if(name && name.length !==0){
        const newUser = new User({username:name})
        const person =  await newUser.save();
        if(person){
            return done(null, person)
        }else{
            return done({err :"Error"}, null);
        }
    }else{
        return done({err :"USer name is required"}, null);
    }
}


const getUsers = async (done)=>{
    const users= await User.find()
    if(users){
        return done(null, users)
    }else{
        return done({err :"Not found"}, null);
    }

}
const createExercise= async(userid, info, done) =>{
    console.log(info)
    const user = await User.findById( userid)
    if(user){
        console.log("user:"+user)
        const exercise = new Exercise({
            username : user.username,
            userId : userid,
            description : info.description,
            duration : info.duration,
            date: info.date
        })
       const exer = await  exercise.save()
       console.log("exer:"+exer)
       if(exer){
        const l = await Log.findById(userid)
        if(l){
            const num = await Log.countDocuments({username: user.username})
            l.log.push(exer)
            l.count = num + 1
            await l.save();
        }else{
            const newLog = new Log({
                username :user.username,
                _id: userid,
                log : exercise,
                count: 1
            })
            await newLog.save();
        }
        return  done( null,exer)
       }
    }
    done( {err : "error"}, null)
}

const getLogs = async (userId, done)=>{
    const logs = await Log.findById(userId);
    if(logs){
        return done(null, logs)
    }else{
        return done({err :error}, null)
    }

}

exports.getLogs = getLogs;
exports.createUser = createUser;
exports.getUsers = getUsers;
exports.createExercise = createExercise;