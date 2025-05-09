const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'vaidyaCare';
const appointmentsCollection = 'appointments';
const usersCollection = 'users';

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const appointments = await db.collection(appointmentsCollection).find({}).toArray();
    let updatedCount = 0;
    for (const appointment of appointments) {
      if (appointment.patientId) {
        const user = await db.collection(usersCollection).findOne({ _id: new ObjectId(appointment.patientId) });
        if (user && user.name && appointment.patientName !== user.name) {
          await db.collection(appointmentsCollection).updateOne(
            { _id: appointment._id },
            { $set: { patientName: user.name } }
          );
          updatedCount++;
          console.log(`Updated appointment ${appointment._id}: patientName set to '${user.name}'`);
        }
      }
    }
    console.log(`Done. Updated ${updatedCount} appointment(s).`);
  } catch (err) {
    console.error('Error fixing patient names:', err);
  } finally {
    await client.close();
  }
}

main(); 