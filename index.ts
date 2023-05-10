import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.HTTP_PORT || 3001;

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true}))

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

