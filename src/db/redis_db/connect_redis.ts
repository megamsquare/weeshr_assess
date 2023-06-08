import { createClient } from 'redis';

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = 6379;

const redis_client = createClient({
    legacyMode: true,
    socket: {
        host: redisHost,
        port: redisPort,
    }
});

async function connect_redis() {
    redis_client.on('error', (error) => console.error(`Error from connecting to redis: ${error}`));

    try {
        await redis_client.connect();
        console.log('Successfully connect to Redis');
    } catch (err) {
        console.error(`Redis connection error: ${err}`);
    }
}

const redis_connect = {
    redis_client,
    connect_redis
}

export default redis_connect;