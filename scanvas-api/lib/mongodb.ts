import { MongoClient, Db } from 'mongodb';

// Grayman Cluster Connection String
const MONGODB_URI = 'mongodb+srv://grayman69:osman69@grayman.dtzhoye.mongodb.net/?appName=grayman';
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

console.log('🔄 Connecting to grayman cluster...');

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI, options);
    global._mongoClientPromise = client.connect()
      .then((client) => {
        console.log('✅ Connected to grayman cluster');
        return client;
      })
      .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
        throw err;
      });
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode
  client = new MongoClient(MONGODB_URI, options);
  clientPromise = client.connect()
    .then((client) => {
      console.log('✅ Connected to grayman cluster');
      return client;
    })
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err.message);
      throw err;
    });
}

export default clientPromise;

export async function getDb(): Promise<Db> {
  try {
    const client = await clientPromise;
    return client.db('scanvas');
  } catch (error) {
    console.error('❌ Failed to get database connection:', error);
    throw new Error('Database connection failed');
  }
}