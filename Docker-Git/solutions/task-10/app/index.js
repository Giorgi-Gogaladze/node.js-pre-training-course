const { MongoClient} = require('mongodb');

const url = "mongodb://admin:secret@mongo:27017"
const client = new MongoClient(url);

async function main (){
    await client.connect();
    console.log("Connected to MongoDB by service name 'mongo'");

    const col = client.db("demo").collection("visits");
    await col.insertOne({ at: new Date() });
    const count = await col.countDocuments();
    console.log(`Total visits stored: ${count}`);

    await client.close();
}

main().catch((e) => {
    console.error("connection failed", e.message);
    process.exit(1);
});