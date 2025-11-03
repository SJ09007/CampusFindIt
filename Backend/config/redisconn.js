const { createClient } = require("redis");

const client  = createClient({
    url: "redis://localhost:6379",
})

client.on("error", (err) => console.error("Redis Client Error", err));
client.on("connect", () => console.log("✅ Redis Client Connected"));

const connectRedis = async () => {
  if (!client.isOpen) {
    await client.connect();
  }
  return client;
};

module.exports = { client, connectRedis };