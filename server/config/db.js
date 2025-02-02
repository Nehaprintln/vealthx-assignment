
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async()=> {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');
    }catch(error){
        console.log('Error connecting to MongoDB;', error)
    }
};

module.exports = connectDB;


// const mongoose = require('mongoose');

// const connectDB = async()=> {
//     try{
//         await mongoose.connect('mongodb+srv://ray93gupta:sjgb1muRzHXJkHJU@personalcluster0.myfou.mongodb.net/claimsDB?retryWrites=true&w=majority&appName=PersonalCluster0');
//         console.log('MongoDB connected');
//     }catch(error){
//         console.log('Error connecting to MongoDB;', error)
//     }
// };

// module.exports = connectDB;

