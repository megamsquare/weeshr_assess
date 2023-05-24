import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import helmet from 'helmet';
import rate_limit from 'express-rate-limit';
// Database
import db from './src/db/mongo_db/connect_mongo';
import routers from './src/routes';


const port = process.env.HTTP_PORT || 3001;
const mongo_db = process.env.MONGO_URL || 'mongodb://localhost:27017/test'

const app = express();

// Rate limiting
app.set('trust proxy', 1);
app.use(
    rate_limit({
        windowMs: 15 * 60 * 1000,
        max: 1000,
        message: "You can't make any more request at the moment, try again later"
    })
);

app.use(express.json());

// app.use(express.urlencoded({ extended: true}));

app.use(helmet());

// Routers
app.get('/api', routers)

async function start() {
    try {
        await db(mongo_db)
        app.listen(port, () => {
            console.log(`Server is listening to port: ${port}...`);
        })
    } catch(error) {
        console.log(`Server error: ${error}`)
    }
}

start();

