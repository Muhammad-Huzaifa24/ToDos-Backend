import express from "express";
import { router as toDoListRoutes } from "./src/components/toDoList/routes.js";
import { router as userRoutes } from "./src/components/user/routes.js";
import dotenv from "dotenv";
import { connectDB } from "./src/db/index.js";
import cors from "cors"
import { createTestAccount } from "./src/utils/test-user.js"
import { errorHandler } from "./src/middleware/error.middleware.js"

// configuration
dotenv.config();
// express app
const app = express();
//port
const port = process.env.PORT || 5000;

// middlewares
// app.use(cors());

app.use(
	cors({
		origin: "*",
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);


// **TESTING ROUTE**
app.get("/test", (req, res) => {
	res.json({ message: "Test route is working!" });
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api", toDoListRoutes);
app.use("/api/user", userRoutes);


app.use(errorHandler);  // ✅ This ensures all errors are handled properly


// error handler
(async () => {
	try {
		// Connect to the database
		await connectDB();
		// createTestAccount();
		// Start the server
		app.listen(port, () => {
			console.log(`Server is running on port ${port}`);
		});
	} catch (error) {
		console.log("Failed to start the application. Exiting...");
		process.exit(1);
	}
})();


