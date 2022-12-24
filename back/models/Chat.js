import User from "./User.js";
import Friendship from "./Friendship.js";
import { createFileStore, observer } from "./index.js";
import cuid from "cuid";

const MAX_MESSAGES_PER_CHAT = 100;

export const chatStore = createFileStore();
const store = chatStore;

class Chat {
	static async init() {
		await store.init("messages");
	}

	static async createMessage(senderId, receiverId, content) {
		if (!senderId || !receiverId || !content) {
			throw Error("Нужно указать senderId, receiverId и content.");
		}

		const fromUser = User.findOne({ id: senderId });
		if (!fromUser) {
			throw Error("Пользвоатель не найден.");
		}

		const toUser = User.findOne({ id: receiverId });
		if (!toUser) {
			throw Error("Пользвоатель не найден.");
		}

		const flag = Friendship.isFriends(senderId, receiverId);
		if (!flag) {
			throw Error("Нельзя отправить сообщение не другу.");
		}

		let messages = store.getState();
		const message = {
			id: cuid(),
			senderId,
			receiverId,
			content,
			createdAt: Date.now(),
			readed: false,
		};

		messages.push(message);

		const chat = messages.filter((message) => {
			if (
				message.senderId === senderId &&
				message.receiverId === receiverId
			) {
				return true;
			}

			if (
				message.senderId === receiverId &&
				message.receiverId === senderId
			) {
				return true;
			}

			return false;
		});

		if (chat.length > MAX_MESSAGES_PER_CHAT) {
			const deprecated = chat
				.sort((a, b) => a.createdAt - b.createdAt)
				.slice(0, -MAX_MESSAGES_PER_CHAT);

			messages = messages.filter(
				(message) => !deprecated.includes(message)
			);
		}

		await store.setState(messages);

		observer.emit("Chat.createMessage", message);

		return message;
	}

	static getChats(userId) {
		if (!userId) {
			throw Error("userid не указан.");
		}

		const messages = store
			.getState()
			.filter(
				(message) =>
					message.senderId === userId || message.receiverId === userId
			);

		const friendIds = messages.reduce((collection, message) => {
			collection.add(message.senderId);
			collection.add(message.receiverId);
			return collection;
		}, new Set());

		friendIds.delete(userId);

		const chats = [];
		for (const friendId of friendIds) {
			const lastMessage = messages
				.filter(
					(message) =>
						message.senderId === friendId ||
						message.receiverId === friendId
				)
				.sort((a, b) => a.createdAt - b.createdAt)
				.at(-1);

			chats.push(lastMessage);
		}

		return chats;
	}

	static getChat(id1, id2) {
		if (!id1 || !id2) {
			throw Error("Нужно указать id1 и id2.");
		}

		return store.getState().filter((message) => {
			if (message.senderId === id1 && message.receiverId === id2) {
				return true;
			}

			if (message.senderId === id2 && message.receiverId === id1) {
				return true;
			}

			return false;
		});
	}

	static async readMessage(messageId) {
		if (!messageId) {
			throw Error("Нужно указать messageId");
		}

		const state = store.getState();
		const message = state.find((message) => message.id === messageId);

		if (!message) {
			throw Error("Message not found.");
		}

		const messages = state.filter(
			(msg) =>
				!msg.readed &&
				msg.senderId === message.senderId &&
				msg.receiverId === message.receiverId &&
				msg.createdAt <= message.createdAt
		);

		messages.forEach((msg) => (msg.readed = true));

		await store.setState(state);

		messages.forEach((msg) => observer.emit("Chat.updateMessage", msg));

		return message;
	}

	static hasUnreaded(userId) {
		const state = store.getState();
		const message = state.find(
			(message) => message.receiverId === userId && !message.readed
		);

		return Boolean(message);
	}
}

export default Chat;
