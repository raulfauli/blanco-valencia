import express from "express";
import session from "express-session";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";

// Middleware
app.use(cors());
app.use(express.json());
app.use(
	session({
		secret: "are-you-a-bot-secret-key",
		resave: false,
		saveUninitialized: true,
		cookie: { secure: isProduction },
	}),
);

// Serve static files
app.use(
	express.static(path.join(path.dirname(fileURLToPath(import.meta.url)))),
);

// API endpoint to get IP and visit count
app.get("/api/info", (req, res) => {
	// Get IP address
	const ip =
		req.ip ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		"unknown";

	// Get or initialize visit count for this session
	if (!req.session.visitCount) {
		req.session.visitCount = 0;
	}
	req.session.visitCount += 1;

	res.json({
		ip: ip,
		visitCount: req.session.visitCount,
	});
});

app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
