import redis from 'redis';

const redis_client = redis.createClient();

async function connect_redis() {
    redis_client.on('error', (error) => console.error(`Error from connecting to redis: ${error}`));

    try {
        const res = await redis_client.connect();
        console.log("Successfully connect to Redis.");
    } catch (err) {
        console.error(`Redis connection error: ${err}`);
    }
}

const redis_connect = {
    redis_client,
    connect_redis
}

export default redis_connect;