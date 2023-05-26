import mongoose from "mongoose";
import SeedData from "./seed/seed";



async function connect(url: string) {
    let environment = process.env.ENVIRONMENT
    try {
        await mongoose.connect(url);
        console.log("Connected to MongoDB");
        if (environment === "development") {
            SeedData();
        }
    } catch (err) {
        console.log(`MongoDB connection error: ${err}`);
    }
}

export default connect;