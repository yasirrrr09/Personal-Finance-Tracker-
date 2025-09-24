const { MongoClient, ServerApiVersion } = require('mongodb');

// Using your real password
const uri = "mongodb+srv://abhiaj371_db_user:abhishek123@cluster0.k8zds0t.mongodb.net/financeDB?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("financeDB").command({ ping: 1 });
    console.log("✅ Pinged your deployment. Successfully connected to MongoDB!");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
