require('dotenv').config()
const{ MongoClient, ServerApiVersion} = require("mongodb");

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/"

const options = {
    serverAPI : {
        version : ServerApiVersion.v1,
        strict : true,
        deprecationError : true,
    }
};

let client; 
const connectToMongoDB = async() => {
    if(!client){
        try{
            client = await MongoClient.connect(uri, options);
            console.log("connected to monogodb");
        }catch(error){
            console.log(error);
        }
    }
    return client;
}

const getConnectedClient = () => client;

module.exports = {connectToMongoDB, getConnectedClient};