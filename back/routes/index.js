import bodyParser from "body-parser";
import multer from "multer";
import { resolve, join } from "path";

const __dirname = resolve();
export const upload = multer({ dest: join(__dirname, "public/sets") });

export const receivers = [
	bodyParser.json(),
	bodyParser.urlencoded({ extended: false }),
	upload.none(),
];

export function authenticated(req, res, next) {
	if (req.session.isAuthenticated) {
		next();
	} else {
		res.status(401).end();
	}
}
