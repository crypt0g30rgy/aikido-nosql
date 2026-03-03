const { MongoClient } = require('mongodb');

const url = process.env.MONGO_URI;
const client = new MongoClient(url);

let db;

async function connectDB() {
    if (db) return db;
    try {
        await client.connect();
        console.log('Connected to MongoDB via Native Driver');
        db = client.db();
        return db;
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
}

module.exports = { connectDB };
