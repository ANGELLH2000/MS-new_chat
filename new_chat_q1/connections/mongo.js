import mongoose from "mongoose";
import config from "../config/config.js";
export async function connectDB() {
    const { mongoUri } = config;
    try {
        await mongoose.connect(mongoUri);
        console.log("[✔] Conectado a MongoDB");
    } catch (error) {
        console.error("[❌] Error conectando a MongoDB:", error);
        process.exit(1);
    }
}

