import express from "express";
import _omit from "lodash/omit.js";
import Friendship from "../models/Friendship.js";
import FriendshipRequest from "../models/FriendshipRequest.js";

import { authenticated } from "./index.js";

const relationshipRouter = express.Router();

/**
 * GET /api/relationship/{userId}
 * @tags Relationship
 * @param {number} userId.path.required - userId поста
 * @summary Отношвение к персонажу
 * @return {string} 200 - success response - plain/text
 * @return {string} 400 - rejected response - plain/text
 */
relationshipRouter.get(
	"/relationship/:userId",
	authenticated,
	async (req, res, next) => {
		try {
			const userId = parseInt(req.params.userId, 10);

			const isOwn = userId === req.session.user.id;

			const isFriend = Friendship.isFriends(req.session.user.id, userId);

			const hasRequestTo = FriendshipRequest.hasRequest(
				req.session.user.id,
				userId
			);

			const hasRequestFrom = FriendshipRequest.hasRequest(
				userId,
				req.session.user.id
			);

			const data = {
				isOwn,
				isFriend,
				hasRequestTo,
				hasRequestFrom,
			};

			res.json(data).end();
		} catch (error) {
			next(error);
		}
	}
);

export default relationshipRouter;
