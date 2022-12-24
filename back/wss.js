// observer.emit("Chat.createMessage", message);
// observer.emit("Chat.updateMessage", message);
// observer.emit("Like.toggle", postId);
// observer.emit("Like.delete", postId);
// observer.emit("Post.create", post);
// observer.emit("Post.update", post);
// observer.emit("Post.delete", post);
// observer.emit("User.update", user);

import sessionMiddleware from "./sessionMiddleware.js";
import { Server } from "socket.io";
import server from "./server.js";
import User from "./models/User.js";

import { throttle } from "throttle-debounce";
import config from "config";
import { observer } from "./models/index.js";
import Chat from "./models/Chat.js";
import Post from "./models/Post.js";

const online = new Map();

const profileSubscribers = new Map();
const postSubscribers = new Map();
const wallSubscribers = new Map();

const wss = new Server(server);

// Максимальное количество отслеживаемых соединений
wss.setMaxListeners(250);
wss.use((socket, next) => {
	socket.setMaxListeners(250);
	next();
});

// Забираем информация сессии
wss.use((socket, next) => sessionMiddleware(socket.request, {}, next));

// Проводим стартовую инициализацию сессии
wss.use(async (socket, next) => {
	if (!Object.hasOwn(socket.request.session, "isAuthenticated")) {
		socket.request.session.isAuthenticated = false;
		socket.request.session.user = null;

		if (config.get("autosign")) {
			const user = await User.findOne(config.get("user"));

			if (user) {
				socket.request.session.isAuthenticated = true;
				socket.request.session.user = user;
			}
		}
	}

	next();
});

// Следим за тем, что бы пользователь был онлайн (когда он действительно онлайн)
wss.use((socket, next) => {
	if (socket.request.session.isAuthenticated) {
		if (!online.has(socket.request.session.user.id)) {
			online.set(socket.request.session.user.id, new Set());
		}

		online.get(socket.request.session.user.id).add(socket);

		socket.on("disconnect", () => {
			const collection = online.get(socket.request.session.user.id);
			collection.delete(socket);

			if (!collection.size) {
				online.delete(socket.request.session.user.id);
			}

			sendOnline();
		});
	}

	next();
});

wss.on("connection", (socket) => {
	if (socket.request.session.isAuthenticated) {
		// Оповещаем всех о списке людей онлайн
		sendOnline();
	}

	if (socket.request.session.isAuthenticated) {
		socket.emit(
			"unreaded",
			Chat.hasUnreaded(socket.request.session.user.id)
		);

		socket.on("message", async (data, listener = () => {}) => {
			try {
				const { user } = socket.request.session;
				const message = await Chat.createMessage(
					user.id,
					data.chatId,
					data.content
				);

				listener(message);
			} catch (error) {
				listener(error.message);
			}
		});

		socket.on("read", async (messageId) => {
			await Chat.readMessage(messageId);
		});

		socket.on("unreaded", async (callback) => {
			callback(Chat.hasUnreaded(socket.request.session.user.id));
		});
	}

	socket.on("subscribe", (data, listener = () => {}) => {
		try {
			const { type, payload } = data;

			if (type === "post") {
				subscribe(postSubscribers, socket, payload);
				return listener(true);
			}

			if (type === "profile") {
				subscribe(profileSubscribers, socket, payload);
				return listener(true);
			}

			if (type === "wall") {
				subscribe(wallSubscribers, socket, payload);
				return listener(true);
			}

			throw Error("Неопеределен тип подписки.");
		} catch (error) {
			listener(error.message);
		}
	});

	socket.on("unsubscribe", (data, listener = () => {}) => {
		try {
			const { type, payload } = data;

			if (type === "post") {
				unsubscribe(postSubscribers, socket, payload);
				return listener(true);
			}

			if (type === "profile") {
				unsubscribe(profileSubscribers, socket, payload);
				return listener(true);
			}

			if (type === "wall") {
				unsubscribe(wallSubscribers, socket, payload);
				return listener(true);
			}

			throw Error("Неопределен тип отписки.");
		} catch (error) {
			listener(error.message);
		}
	});

	socket.on("online", (callback) => {
		const userIds = Array.from(online.keys());
		callback(userIds);
	});
});

const sendOnline = throttle(100, () => {
	const userIds = Array.from(online.keys());
	wss.emit("online", userIds);
});

const subscribe = (collection, socket, payload) => {
	if (!collection.has(socket)) {
		collection.set(socket, new Set());
	}

	if (!collection.has(payload)) {
		collection.set(payload, new Set());
	}

	const col1 = collection.get(socket);
	col1.add(payload);

	const col2 = collection.get(payload);
	col2.add(socket);

	socket.on("disconnect", () => unsubscribe(collection, socket, payload));
};

const unsubscribe = (collection, socket, payload) => {
	if (collection.has(socket) && collection.get(socket).has(payload)) {
		const col1 = collection.get(socket);
		const col2 = collection.get(payload);

		col1.delete(payload);
		if (!col1.size) {
			collection.delete(socket);
		}

		col2.delete(socket);
		if (!col2.size) {
			collection.delete(payload);
		}
	}
};

observer.on("Chat.createMessage", async (message) => {
	const { receiverId, senderId } = message;

	for (const [id, socket] of wss.sockets.sockets) {
		const { isAuthenticated, user } = socket.request.session;

		if (
			isAuthenticated &&
			(user.id === receiverId || user.id === senderId)
		) {
			socket.emit("message", message);
		}
	}

	if (online.has(receiverId)) {
		const sockets = online.get(receiverId);

		for (const socket of sockets) {
			socket.emit("unreaded", Chat.hasUnreaded(receiverId));
		}
	}
});

observer.on("Like.toggle", likeChangeHandler);
observer.on("Like.delete", likeChangeHandler);

async function likeChangeHandler(postId) {
	if (postSubscribers.has(postId)) {
		const post = await Post.findOne({ id: postId });

		if (post) {
			const sockets = postSubscribers.get(postId);
			for (const socket of sockets) {
				const post = await Post.findOne(
					{ id: postId },
					socket.request.session.user.id
				);
				socket.emit("update", { type: "post", payload: post });
			}
		}
	}
}

observer.on("Post.create", wallUpdateHandler);
observer.on("Post.delete", wallUpdateHandler);

observer.on("Post.update", (post) => {
	if (postSubscribers.has(post.id)) {
		const sockets = postSubscribers.get(post.id);

		for (const socket of sockets) {
			socket.emit("update", { type: "post", payload: post });
		}
	}
});

function wallUpdateHandler(post) {
	const { wallId } = post;

	if (wallSubscribers.has(wallId)) {
		const sockets = wallSubscribers.get(wallId);

		for (const socket of sockets) {
			socket.emit("update", { type: "wall", payload: wallId });
		}
	}
}

observer.on("User.update", (user) => {
	if (profileSubscribers.has(user.id)) {
		const sockets = profileSubscribers.get(user.id);
		for (const socket of sockets) {
			socket.emit("update", { type: "profile", payload: user });
		}
	}
});

observer.on("Chat.updateMessage", (message) => {
	for (const userId of [message.senderId, message.receiverId]) {
		if (online.has(userId)) {
			const sockets = online.get(userId);

			for (const socket of sockets) {
				socket.emit("messageUpdated", message);
			}
		}
	}

	if (online.has(message.receiverId)) {
		const sockets = online.get(message.receiverId);

		for (const socket of sockets) {
			socket.emit("unreaded", Chat.hasUnreaded(message.receiverId));
		}
	}
});
