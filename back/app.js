import expressJSDocSwagger from "express-jsdoc-swagger";
import path, { resolve, join } from "path";
import express from "express";
import config from "config";

import sessionMiddleware from "./sessionMiddleware.js";

import chatRouter from "./routes/chats.js";
import friendshipRouter from "./routes/friendships.js";
import friendshipRequestsRouter from "./routes/friendshipRequests.js";
import postsRouter from "./routes/posts.js";
import sessionRouter from "./routes/session.js";
import usersRouter from "./routes/users.js";

import User from "./models/User.js";
import relationshipRouter from "./routes/relationship.js";

const __dirname = resolve();
const app = express();

if (config.get("NODE_ENV") === "development" && config.get("delay")) {
	app.use((req, res, next) => {
		setTimeout(() => next(), config.get("delay"));
	});
}

app.set("trust proxy", 1);

app.use(sessionMiddleware);

if (
	process.env.NODE_ENV === "development" ||
	config.get("NODE_ENV") === "development"
) {
	app.use(async (req, res, next) => {
		if (!Object.hasOwn(req.session, "isAuthenticated")) {
			req.session.isAuthenticated = false;
			req.session.user = null;

			if (config.get("autosign")) {
				const user = await User.findOne(config.get("user"));

				if (user) {
					req.session.isAuthenticated = true;
					req.session.user = user;
				}
			}
		}

		next();
	});
}

app.use("/api", [
	chatRouter,
	friendshipRouter,
	friendshipRequestsRouter,
	postsRouter,
	sessionRouter,
	usersRouter,
	relationshipRouter,
]);

app.use((err, req, res, next) => {
	if (err) {
		console.error(err);
		res.status(400).send(err.message).end();
	}
});

app.use(express.static(join(__dirname, "/public/")));
app.use(express.static(join(__dirname, "/build/")));

expressJSDocSwagger(app)({
	info: {
		version: "1.0.0",
		title: "Albums store",
		license: {
			name: "MIT",
		},
	},
	filesPattern: "./routes/*",
	baseDir: __dirname,
});

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "/build/index.html"));
});

export default app;
