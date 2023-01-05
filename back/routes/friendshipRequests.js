import express from "express";
import _omit from "lodash/omit.js";
import FriendshipRequest from "../models/FriendshipRequest.js";
import { authenticated } from "./index.js";

const friendshipRequestsRouter = express.Router();

/**
 * Заявки
 * @typedef {object} FriendshipRequest
 * @property {array<User>} toUsers
 * @property {array<User>} fromUsers
 */

/**
 * GET /api/friendshipRequests
 * @tags Friendship Requests
 * @summary Массив заявок в друзья
 * @return {FriendshipRequest} 200 - success response - application/json
 * @return {string} 400 - rejected response - plain/text
 */
friendshipRequestsRouter.get(
	"/friendshipRequests",
	authenticated,
	async (req, res, next) => {
		try {
			const data = await FriendshipRequest.getRequests(
				req.session.user.id
			);

			res.json(data).end();
		} catch (error) {
			next(error);
		}
	}
);

/**
 * POST /api/friendshipRequests/{id}
 * @tags Friendship Requests
 * @summary Создать заявку в друзья (или принять при взаимной заявки)
 * @param {string} id.path.required - id пользователя
 * @return 200 - success response
 * @return {string} 400 - rejected response - plain/text
 */
friendshipRequestsRouter.post(
	"/friendshipRequests/:id",
	authenticated,
	async (req, res, next) => {
		try {
			const toId = parseInt(req.params.id, 10);
			await FriendshipRequest.createRequest(req.session.user.id, toId);
			res.end();
		} catch (error) {
			next(error);
		}
	}
);

/**
 * DELETE /api/friendshipRequests/{id}
 * @tags Friendship Requests
 * @summary Убрать заявку в друзья
 * @param {string} id.path.required - id пользователя
 * @return 200 - success response
 * @return {string} 400 - rejected response - plain/text
 */
friendshipRequestsRouter.delete(
	"/friendshipRequests/:id",
	authenticated,
	async (req, res, next) => {
		try {
			const toId = parseInt(req.params.id, 10);
			// await FriendshipRequest.createRequest(req.session.user.id, toId);
			await FriendshipRequest.removeRequest(req.session.user.id, toId);
			res.end();
		} catch (error) {
			next(error);
		}
	}
);

export default friendshipRequestsRouter;
