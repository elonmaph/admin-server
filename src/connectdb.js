const mongoose = require('mongoose');

const server = process.env.dbserver;
const database = process.env.database;      
const dbusername = process.env.dbusername;      
const dbpsw = process.env.dbpsw;   

const connectDB = async () => {
    try {
        let uri = `mongodb://${server}/${database}`;
        if (dbusername) {
            uri = `mongodb://${dbusername}:${dbpsw}@${server}/${database}`;
            console.log(uri);
        }
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB connected!!');
    } catch (err) {
        console.log('Failed to connect to MongoDB', err);
    }
};

module.exports = connectDB;
