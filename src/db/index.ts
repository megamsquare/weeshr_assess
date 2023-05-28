import mongo_db from './mongo_db/connect_mongo';
import caching from './redis_db/connect_redis';

const DB = {
    mongo_db,
    caching
}

export default DB;