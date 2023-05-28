import mongo_db from './mongo_db/connect_mongo';
import redis_db from './redis_db/connect_redis';

const DB = {
    mongo_db,
    redis_db
}

export default DB;