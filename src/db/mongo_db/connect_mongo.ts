import mongoose from "mongoose";



async function connect(url: string) {
    try {
        await mongoose.connect(url);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.log(`MongoDB connection error: ${err}`);
    }
}

export default connect;