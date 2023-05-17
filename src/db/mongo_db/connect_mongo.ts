import mongoose from "mongoose";
import SeedData from "./seed/seed";



async function connect(url: string) {
    try {
        await mongoose.connect(url);
        console.log("Connected to MongoDB");
        SeedData();
    } catch (err) {
        console.log(`MongoDB connection error: ${err}`);
    }
}

export default connect;