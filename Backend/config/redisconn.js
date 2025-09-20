const { createClient } = require("redis");

const redisClient = async () => {
  const redisClient = createClient({
    url: "redis://localhost:6379",
  });
  redisClient.on("error", (err) => console.log("Redis Client Error", err));
  redisClient.on("connect", () => console.log("Redis Client Connected"));

  await redisClient.connect();

  return redisClient;
};

module.exports = redisClient;
