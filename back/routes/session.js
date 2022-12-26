import express from "express";
import User from "../models/User.js";
import { receivers } from "./index.js";
import { isEmail } from "../utils.js";

const sessionRouter = express.Router();

/**
 * GET /api/session
 * @tags Session
 * @summary Данные авторизованного пользователя
 * @return {User} 200 - success response - application/json
 * @return {string} 400 - rejected response - plain/text
 */
sessionRouter.get("/session", async (req, res, next) => {
	try {
		if (req.session.isAuthenticated) {
			const user = Object.assign({}, req.session.user);
			user.email = User.getUserEmail(user.id);

			res.send(user);
		} else {
			res.status(401).end();
		}
	} catch (error) {
		next(error);
	}
});

/**
 * Данные для регистрации нового пользователя
 * @typedef {object} SigninPayload
 * @property {string} email.required - Почта
 * @property {string} password.required - Пароль
 */

/**
 * POST /api/signin
 * @tags Session
 * @summary Авторизация
 * @param {SigninPayload} request.body.required
 * @return {User} 200 - success response - application/json
 * @return {string} 400 - rejected response - plain/text
 */
sessionRouter.post("/signin", receivers, async (req, res, next) => {
	try {
		for (const key of ["email", "password"]) {
			if (!Object.hasOwn(req.body, key) || !req.body[key]) {
				throw Error("Не указанны почта и пароль.");
			}
		}

		if (!isEmail(req.body.email)) {
			throw Error("Поле email не соотвутствует схеме почты.");
		}

		const user = await User.findOne({ email: req.body.email });
		user.email = User.getUserEmail(user.id);

		if (!user) {
			throw Error("Пользователь не найден.");
		}

		const password = User.getUserPassword(user.id);

		if (password !== req.body.password) {
			throw Error("Пароль не подходит.");
		}

		req.session.isAuthenticated = true;
		req.session.user = user;

		res.send(user).end();
	} catch (error) {
		next(error);
	}
});

/**
 * POST /api/signout
 * @tags Session
 * @summary Разлогинивание
 * @return 200 - success response
 * @return {string} 400 - rejected response - plain/text
 */
sessionRouter.post("/signout", async (req, res, next) => {
	try {
		req.session.isAuthenticated = false;
		req.session.user = null;
		res.end();
	} catch (error) {
		next(error);
	}
});

export default sessionRouter;
