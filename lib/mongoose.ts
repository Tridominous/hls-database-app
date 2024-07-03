import mongoose from 'mongoose';

let isConnected: boolean = false;

export const connectToDatabase = async () => {
    mongoose.set('strictQuery', true);

    if(!process.env.MONGODB_URL){
        return console.log('Missing MONGODB_URL')
    }
    if(isConnected){
        console.log('MongoDB is already connected!')
        return mongoose.connection.db
    }

    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            dbName: 'HLSDB'
        })
        isConnected = true;
        console.log('MongoDB is connected!')
    } catch (error) {
        console.log('MongoDB connection failed', error)
    }
        
}




// const mongoose = require('mongoose');
// const uri = "mongodb+srv://jamesmou:DvEjOFIN6PoOieZ4@cluster0.cbi0nlz.mongodb.net/?appName=Cluster0";

// const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

// async function run() {
//   try {
//     // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
//     await mongoose.connect(uri, clientOptions);
//     await mongoose.connection.db.admin().command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await mongoose.disconnect();
//   }
// }
// run().catch(console.dir);




// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://jamesmou:DvEjOFIN6PoOieZ4@cluster0.cbi0nlz.mongodb.net/?appName=Cluster0";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);
