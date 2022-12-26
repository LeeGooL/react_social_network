import express from "express";
import _omit from "lodash/omit.js";
import Like from "../models/Like.js";
import Post from "../models/Post.js";
import { authenticated, receivers } from "./index.js";

const postRouter = express.Router();

/**
 * Посты пользователя
 * @typedef {object} Post
 * @property {number} id
 * @property {string} wallId
 * @property {string} authorId
 * @property {string} content
 * @property {number} createdAt
 * @property {number} likes
 * @property {boolean} liked
 */

/**
 * GET /api/posts/user/{userId}
 * @tags Posts
 * @summary Посты пользователя
 * @param {string} userId.path.required - id пользователя
 * @return {array<Post>} 200 - success response - application/json
 * @return {string} 400 - rejected response - plain/text
 */
postRouter.get("/posts/user/:userId", async (req, res, next) => {
	try {
		const userId = parseInt(req.params.userId, 10);
		const posts = Post.find(
			{ wallId: userId },
			req?.session?.user?.id
		).sort((a, b) => b.createdAt - a.createdAt);
		res.json(posts).end();
	} catch (error) {
		next(error);
	}
});

/**
 * Данные для создания нового поста
 * @typedef {object} PostCreatePayload
 * @property {string} content.required - Контент
 */

/**
 * POST /api/posts/user/{userId}
 * @tags Posts
 * @summary Создать новый пост
 * @param {number} userId.path.required - id пользователя
 * @param {PostCreatePayload} request.body.required
 * @return {Post} 200 - success response - application/json
 * @return {string} 400 - rejected response - plain/text
 */
postRouter.post(
	"/posts/user/:userId",
	authenticated,
	receivers,
	async (req, res, next) => {
		try {
			const wallId = parseInt(req.params.userId);
			const post = await Post.create(
				req.session.user.id,
				wallId,
				req.body.content
			);
			res.json(post).end();
		} catch (error) {
			next(error);
		}
	}
);

/**
 * Данные для обновления поста
 * @typedef {object} PostUpdatePayload
 * @property {string} content.required - Контент
 */

/**
 * PATCH /api/posts/{postId}
 * @tags Posts
 * @summary Изменить содержимое поста
 * @param {number} postId.path.required - postId поста
 * @param {PostUpdatePayload} request.body.required
 * @return {Post} 200 - success response
 * @return {string} 400 - rejected response - plain/text
 */
postRouter.patch(
	"/posts/:postId",
	authenticated,
	receivers,
	async (req, res, next) => {
		try {
			const postId = parseInt(req.params.postId, 10);

			await Post.update(
				{
					id: postId,
					authorId: req.session.user.id,
				},
				req.body
			);

			const post = Post.findOne({ id: postId });

			res.json(post).end();
		} catch (error) {
			next(error);
		}
	}
);

/**
 * DELETE /api/posts/{postId}
 * @tags Posts
 * @summary Удалить пост
 * @param {number} postId.path.required - postId поста
 * @return 200 - success response
 * @return {string} 400 - rejected response - plain/text
 */
postRouter.delete("/posts/:postId", authenticated, async (req, res, next) => {
	try {
		const postId = parseInt(req.params.postId, 10);
		const post = Post.findOne({ id: postId });

		if (
			post.authorId === req.session.user.id ||
			post.wallId === req.session.user.id
		) {
			await Post.delete({ id: postId });
		} else {
			throw Error("Не хватает прав на удаление поста.");
		}

		res.status(200).end();
	} catch (error) {
		next(error);
	}
});

/**
 * PATCH /api/posts/like/{postId}
 * @tags Posts
 * @summary Поставить или снять лайк
 * @param {number} postId.path.required - postId поста
 * @return {Post} 200 - success response
 * @return {string} 400 - rejected response - plain/text
 */
postRouter.patch(
	"/posts/like/:postId",
	authenticated,
	receivers,
	async (req, res, next) => {
		try {
			const postId = parseInt(req.params.postId, 10);
			await Like.toggle(req.session.user.id, postId);
			const post = Post.findOne({ id: postId });
			res.json(post).end();
		} catch (error) {
			next(error);
		}
	}
);

export default postRouter;
