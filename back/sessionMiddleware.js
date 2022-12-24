import session from "express-session";

const sessionMiddleware = session({
	secret: Date.now().toString(),
	resave: true,
	saveUninitialized: true,
	cookie: {
		// secure: true,
		maxAge: 10080000,
	},
});

export default sessionMiddleware;
