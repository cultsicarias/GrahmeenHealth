const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'; // Update if needed
const dbName = 'vaidyaCare';
const collectionName = 'appointments';

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collections = await db.listCollections({ name: collectionName }).toArray();
    if (collections.length === 0) {
      await db.createCollection(collectionName);
      await db.collection(collectionName).insertOne({ init: true });
      console.log(`Database '${dbName}' and collection '${collectionName}' created.`);
    } else {
      console.log(`Collection '${collectionName}' already exists in database '${dbName}'.`);
    }
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    await client.close();
  }
}

main(); 