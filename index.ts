import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import helmet from 'helmet';
import rate_limit from 'express-rate-limit';


const port = process.env.HTTP_PORT || 3001;

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

app.get('/', (req, res) => {
    res.send('Yesssssssss Hello')
})

async function start() {
    try {
        app.listen(port, () => {
            console.log(`Server is listening to port: ${port}...`);
        })
    } catch(error) {
        console.log(`Server error: ${error}`)
    }
}

start();

