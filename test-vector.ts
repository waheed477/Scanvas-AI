import { getVectorStore, initializeVectorCollection } from './lib/vector-store/client';
import dotenv from 'dotenv';

dotenv.config();

async function test() {
  console.log('🧪 Testing vector store connection...');
  console.log('📁 Database:', process.env.MONGODB_DB_NAME);
  console.log('📁 Collection:', process.env.MONGODB_COLLECTION);
  
  try {
    const { db } = await getVectorStore();
    console.log('✅ Database connected:', db.databaseName);
    
    const collections = await db.listCollections().toArray();
    console.log('📊 Collections:', collections.map(c => c.name));
    
    const hasIndex = await initializeVectorCollection();
    console.log('📊 Vector index exists:', hasIndex);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

test();