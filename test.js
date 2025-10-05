// test-db.js
import pkg from "pg";
const { Client } = pkg;

const client = new Client({
  host: "167.235.158.202",
  port: 8001,
  database: "n8n",
  user: "ZW8k1uNJDvYVQCxn",
  password: "vVkByQq7nmx1rZ3hLs1w220MT35YStW4",
  ssl: false,
});

async function testConnection() {
  try {
    console.log("Attempting to connect...");
    await client.connect();
    console.log("✓ Connected successfully!");

    const result = await client.query("SELECT NOW()");
    console.log("✓ Query executed:", result.rows[0]);

    await client.end();
    console.log("✓ Connection closed");
  } catch (error) {
    console.error("✗ Connection failed:", error.message);
    console.error("Error code:", error.code);
    process.exit(1);
  }
}

testConnection();
