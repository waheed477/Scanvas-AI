import { MongoClient, Db } from 'mongodb';

// ⚠️ FINAL WORKING SOLUTION - Standard Connection String

const MONGODB_URI = 'mongodb+srv://grayman69:osman69@grayman.dtzhoye.mongodb.net/scanvas?retryWrites=true&w=majority&appName=grayman';
const DB_NAME = 'scanvas';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase() {
  if (client && db) {
    return { client, db };
  }

  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    // Password hidden karke log karo
    const logUri = MONGODB_URI.replace(/:[^:@]*@/, ':****@');
    console.log('🔗 Using URI:', logUri);
    
    client = new MongoClient(MONGODB_URI, {
      connectTimeoutMS: 30000,
      serverSelectionTimeoutMS: 30000,
      // Ye options DNS SRV lookup ko handle karne mein madad karte hain
      directConnection: false,
      ssl: true,
      tls: true
    });
    
    await client.connect();
    db = client.db(DB_NAME);
    
    // Test the connection
    await db.command({ ping: 1 });
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log('📁 Database:', DB_NAME);
    
    return { client, db };
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

export function getDb(): Db {
  if (!db) {
    throw new Error('Database not connected. Call connectToDatabase first.');
  }
  return db;
}

export async function closeDatabase() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('🔒 Database connection closed');
  }
}

// Helper function to get a collection
export function getCollection(collectionName: string) {
  const database = getDb();
  return database.collection(collectionName);
}