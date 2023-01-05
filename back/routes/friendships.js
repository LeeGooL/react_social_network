import express from "express";
import _omit from "lodash/omit.js";
import Friendship from "../models/Friendship.js";
import { authenticated } from "./index.js";

const friendshipRouter = express.Router();

/**
 * GET /api/friendships
 * @tags Friendships
 * @summary Массив друзей
 * @return {array<User>} 200 - success response - application/json
 * @return {string} 400 - rejected response - plain/text
 */
friendshipRouter.get("/friendships", authenticated, async (req, res, next) => {
	try {
		const friends = await Friendship.getFriends(req.session.user.id);
		res.json(friends).end();
	} catch (error) {
		next(error);
	}
});

/**
 * DELETE /api/friendships/{id}
 * @tags Friendships
 * @summary Удалить друга
 * @param {string} id.path.required - id пользователя
 * @return 200 - success response
 * @return {string} 400 - rejected response - plain/text
 */
friendshipRouter.delete(
	"/friendships/:id",
	authenticated,
	async (req, res, next) => {
		try {
			const friendId = parseInt(req.params.id, 10);
			const flag = await Friendship.deleteFriendship(
				req.session.user.id,
				friendId
			);

			if (!flag) {
				throw Error("Дружбы не найдено.");
			}

			res.status(200).end();
		} catch (error) {
			next(error);
		}
	}
);

export default friendshipRouter;
