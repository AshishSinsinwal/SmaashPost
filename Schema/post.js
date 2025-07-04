const mongoose = require("mongoose");
const DB_URL = 'mongodb://127.0.0.1:27017/Smaash-Posts';


const postsSchema = new  mongoose.Schema({
    username:{
        type:String,
        required : true,
    },
    title: {
        type: String,
        required: true,
        trim: true
    },

    content :{
        type:String,
        reuired : true,
    },
    owner:{
        type : mongoose.Types.ObjectId,
        ref : "User",
        required : true,
    },
},
{
    timestamps : true
   });

const Post = new mongoose.model("Post" , postsSchema);

let newPost = new Post({username : "kavishka" , content : "in wowwwwwww"});

async function initData () {
    await newPost.save();
}

async function connectDB (){
    await mongoose.connect(DB_URL);
}
// initData();
// connectDB();

module.exports = Post;