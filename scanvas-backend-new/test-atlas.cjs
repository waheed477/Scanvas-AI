// Use the compiled JavaScript file (after build)
const { connectToDatabase, getDb } = require('./lib/db');

async function testConnection() {
  try {
    console.log('🔍 Testing MongoDB connection...');
    await connectToDatabase();
    const db = getDb();
    
    const collections = await db.listCollections().toArray();
    console.log(' Connected! Collections:', collections.map(c => c.name).join(', '));
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed:', error.message);
    process.exit(1);
  }
}

testConnection();