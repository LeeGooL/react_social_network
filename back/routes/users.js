import express from "express";
import User from "../models/User.js";
import _pick from "lodash/pick.js";
import { authenticated, receivers, upload } from "./index.js";
import { extname, resolve } from "path";
import { rename } from "fs/promises";

const userRouter = express.Router();

/**
 * Пользователь
 * @typedef {object} User
 * @property {number} id
 * @property {string} email
 * @property {string} name
 * @property {string} surname
 * @property {string} status
 * @property {string} avatar
 */

/**
 * GET /users
 * @tags Users
 * @summary Массив пользователей
 * @return {array<User>} 200 - success response - application/json
 * @return {string} 400 - rejected response - plain/text
 */
userRouter.get("/users", async (req, res, next) => {
	try {
		const users = await User.find();

		if (req.session.isAuthenticated) {
			for (const user of users) {
				if (user.id === req.session.user.id) {
					user.email = User.getUserEmail(user.id);
					break;
				}
			}
		}

		res.json(users).end();
	} catch (error) {
		next(error);
	}
});

/**
 * GET /users/{id}
 * @tags Users
 * @summary Пользователь
 * @param {number} id.path - id пользователя
 * @return {User} 200 - success response - application/json
 * @return {string} 400 - rejected response - plain/text
 */
userRouter.get("/users/:id", async (req, res, next) => {
	try {
		const id = parseInt(req.params.id, 10);
		const user = await User.findOne({ id });

		if (!user) {
			throw Error("Пользователь не найден");
		}

		if (req.session.isAuthenticated && req.session.user.id === user.id) {
			user.email = User.getUserEmail(user.id);
		}

		res.json(user).end();
	} catch (error) {
		next(error);
	}
});

/**
 * Данные для регистрации нового пользователя
 * @typedef {object} UserCreatePayload
 * @property {string} email.required - Почта
 * @property {string} name.required - Контрагент
 * @property {string} surname.required - Телефон
 * @property {string} password.required - Пароль
 */

/**
 * POST /users
 * @tags Users
 * @summary Регистрация пользователя
 * @param {UserCreatePayload} request.body.required - Данные нового клиента
 * @return {User} 200 - success response - application/json
 * @return {string} 400 - rejected response - plain/text
 */
userRouter.post("/users", receivers, async (req, res, next) => {
	try {
		const user = await User.create(req.body);

		if (!user) {
			throw Error("Что-то пошло не так.");
		}

		res.json(user).end(200);
	} catch (error) {
		next(error);
	}
});

/**
 * Данные для регистрации нового пользователя
 * @typedef {object} UserUpdatePayload
 * @property {string} email - Почта
 * @property {string} name - Контрагент
 * @property {string} surname - Телефон
 * @property {string} password - Пароль
 * @property {string} status - Пароль
 */

/**
 * PATCH /users
 * @tags Users
 * @summary Обновление данных авторизованного пользователя
 * @param {UserUpdatePayload} request.body.required - Данные нового клиента
 * @return {User} 200 - success response - application/json
 * @return {string} 400 - rejected response - plain/text
 */
userRouter.patch("/users", authenticated, receivers, async (req, res, next) => {
	try {
		delete req.body.id;
		await User.update({ id: req.session.user.id }, req.body);
		res.status(200).end();
	} catch (error) {
		next(error);
	}
});

/**
 * PATCH /users
 * @tags Users
 * @summary Обновление данных авторизованного пользователя
 * @param {UserUpdatePayload} request.body.required - Данные нового клиента
 * @return {User} 200 - success response - application/json
 * @return {string} 400 - rejected response - plain/text
 */
userRouter.patch(
	"/users/avatar",
	authenticated,
	upload.single("avatar"),
	async (req, res, next) => {
		try {
			if (!req.file) {
				throw Error("File not found");
			}

			const { file } = req;

			const ext = extname(file.originalname);
			const fromPath = file.path;
			const toPath = resolve(file.destination, `${file.filename}${ext}`);
			await rename(fromPath, toPath);

			await User.update(
				{ id: req.session.user.id },
				{
					avatar: `/sets/${file.filename}${ext}`,
				}
			);

			req.session.user = await User.findOne({ id: req.session.user.id });
			res.status(200).end();
		} catch (error) {
			next(error);
		}
	}
);

export default userRouter;
