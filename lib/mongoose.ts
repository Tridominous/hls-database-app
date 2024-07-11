// import mongoose from 'mongoose';

// let isConnected: boolean = false;

// export const connectToDatabase = async () => {
//     mongoose.set('strictQuery', true);

//     if(!process.env.MONGODB_URL){
//         return console.log('Missing MONGODB_URL')
//     }
//     if(isConnected){
//         console.log('MongoDB is already connected!')
//         return;
//     }

//     try {
//         await mongoose.connect(process.env.MONGODB_URL, {
//             dbName: 'HLSDB'
//         })
//         isConnected = true;
//         console.log('MongoDB is connected!')
//     } catch (error) {
//         console.log('MongoDB connection failed', error)
//     } finally {
//         mongoose.disconnect();
//     }
        
// }




// import mongoose from "mongoose";
// import { ServerApiVersion } from 'mongodb';

// const mongoUrl: string = process.env.MONGODB_URL as string;

// const clientOptions = { serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true } };

// export async function connectToDatabase() {

//     if (!mongoUrl) {
//         throw new Error('MONGODB_URL environment variable is not defined');
//       }

//     if(isConnected){
//         console.log('MongoDB is already connected!')
//         return;
//     }

//   try {
//     // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
//     console.log('Attempting to connect to MongoDB...');
//     await mongoose.connect(mongoUrl, clientOptions);
//     console.log('MongoDB is connected!');
//     isConnected = true;

//     if (mongoose.connection.readyState === 1) {
//       await mongoose.connection.db.admin().command({ ping: 1 });
//       console.log('MongoDB connection is active');
//       console.log("Pinged your deployment. You successfully connected to MongoDB!");
//       return;
//     } else {
//       console.error('MongoDB connection is not active');
//     }
    
  
//   } catch (error) {
//     console.log("MongoDB connection failed", error);
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await mongoose.disconnect();
//   }
// }
// connectToDatabase().catch(console.dir);

// mongoose.connection.on('error', err => {
//   console.error(`MongoDB connection error: ${err}`);
// });

// mongoose.connection.on('disconnected', () => {
//   console.log('MongoDB disconnected');
// });


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





import mongoose from 'mongoose';
import { ServerApiVersion } from 'mongodb';

const mongoUrl: string = process.env.MONGODB_URL as string;

const clientOptions = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

if (!mongoUrl) {
  throw new Error('MONGODB_URL environment variable is not defined');
}

export const connectToDatabase = async (retries = 5, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log('Attempting to connect to MongoDB...');
      await mongoose.connect(mongoUrl, {
        ...clientOptions,
        dbName: "HLSDB",
      });
      console.log('MongoDB connected successfully');
      
      // Check if the connection is ready and access the admin method
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log('MongoDB connection is active');
        return;
      } else {
        console.error('MongoDB connection is not active');
      }
    } catch (error) {
      console.error(`MongoDB connection attempt ${i + 1} failed:`, error);

      // If it's the last retry, throw the error
      if (i === retries - 1) {
        throw new Error('MongoDB connection failed after multiple attempts');
      }

      // Wait for a specified delay before the next retry
      await new Promise(res => setTimeout(res, delay));
    }
  }
};


