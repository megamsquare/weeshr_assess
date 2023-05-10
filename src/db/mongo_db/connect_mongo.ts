import mongoose from "mongoose";

function connect(url: string) {
    return mongoose.connect(url)
        .then(() => {
            console.log("Connected to MongoDB")
        })
        .catch((err) => {
            console.log(`MongoDB connection error: ${err}`);
        })
}

export default connect;