import mongoose from "mongoose";

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("✅ Connected to the database");

	} catch (error) {
		console.error("❌ Database connection failed:", error);
		throw error;
	}
};

export { connectDB };
