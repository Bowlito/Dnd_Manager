import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;

        if (!uri) {
            throw new Error(
                "ERREUR FATALE: La variable MONGO_URI n'est pas définie dans le .env"
            );
        }

        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connecté: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`Erreur: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
