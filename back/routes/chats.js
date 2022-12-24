import express from "express";
import _omit from "lodash/omit.js";
import Chat from "../models/Chat.js";
import { authenticated } from "./index.js";

const chatRouter = express.Router();

/**
 * Сообщение чата
 * @typedef {object} Message
 * @property {string} id
 * @property {number} senderId
 * @property {number} receiverId
 * @property {number} createdAt
 * @property {string} content
 * @property {boolean} readed
 */

/**
 * GET /chats
 * @tags Chats
 * @summary Пользователи с которыми есть переписка
 * @return {array<Message>} 200 - success response - application/json
 * @return {string} 400 - rejected response - plain/text
 */
chatRouter.get("/chats", authenticated, async (req, res, next) => {
	try {
		const chats = Chat.getChats(req.session.user.id);
		res.json(chats).end();
	} catch (error) {
		next(error);
	}
});

/**
 * GET /chats/{id}
 * @tags Chats
 * @summary Переписку с пользователем
 * @param {string} id.path.required - id пользователя
 * @return {array<Message>} 200 - success response - application/json
 * @return {string} 400 - rejected response - plain/text
 */
chatRouter.get("/chats/:id", authenticated, async (req, res, next) => {
	try {
		const id = parseInt(req.params.id, 10);
		const chat = Chat.getChat(req.session.user.id, id);
		res.json(chat).end();
	} catch (error) {
		next(error);
	}
});

export default chatRouter;
