import Friendship from "./Friendship.js";
import { createFileStore } from "./index.js";
import User from "./User.js";

export const friendshipRequestStore = createFileStore();
const store = friendshipRequestStore;

class FriendshipRequest {
	static async init() {
		store.init("friendshipRequests");
	}

	static async createRequest(fromId, toId) {
		if (!fromId || !toId) {
			throw Error("Нужно указать fromId и toId.");
		}

		if (fromId === toId) {
			throw Error("Нельзя завести дружбу с самим сабой.");
		}

		const friendshipRequests = store.getState();
		const findIndex = friendshipRequests.findIndex(
			(fr) => fr.fromId === fromId && fr.toId === toId
		);

		if (findIndex !== -1) {
			throw Error("Заявка с такими параметрами уже существует.");
		}

		if (Friendship.isFriends(fromId, toId)) {
			throw Error("Пользователи уже друзья.");
		}

		const friendIndex = friendshipRequests.findIndex(
			(fr) => fr.fromId === toId && fr.toId === fromId
		);

		if (friendIndex !== -1) {
			await Friendship.create(fromId, toId);
			friendshipRequests.splice(friendIndex, 1);
			await store.setState(friendshipRequests);
			return FriendshipRequest.CREATED;
		}

		friendshipRequests.push({
			fromId,
			toId,
			createdAt: Date.now(),
		});

		await store.setState(friendshipRequests);
		return FriendshipRequest.FRIENDED;
	}

	static async removeRequest(fromId, toId) {
		if (!fromId || !toId) {
			throw Error("Нужно указать fromId и toId.");
		}

		if (fromId === toId) {
			throw Error("Нельзя завести дружбу с самим сабой.");
		}

		const friendshipRequests = store.getState();
		const findIndex = friendshipRequests.findIndex(
			(fr) => fr.fromId === fromId && fr.toId === toId
		);

		if (findIndex === -1) {
			throw Error("Заявка с такими параметрами не существует.");
		}

		if (Friendship.isFriends(fromId, toId)) {
			throw Error("Пользователи друзья.");
		}

		friendshipRequests.splice(findIndex, 1);

		await store.setState(friendshipRequests);
		return FriendshipRequest.DELETED;
	}

	static getRequests(id) {
		if (!id) {
			throw Error("Нужно указать id.");
		}

		const friendshipRequests = store.getState();

		const toUsers = friendshipRequests
			.filter((fr) => fr.fromId === id)
			.sort((a, b) => a.createdAt - b.createdAt)
			.map((fr) => User.findOne({ id: fr.toId }));

		const fromUsers = friendshipRequests
			.filter((fr) => fr.toId === id)
			.sort((a, b) => a.createdAt - b.createdAt)
			.map((fr) => User.findOne({ id: fr.fromId }));

		return {
			toUsers,
			fromUsers,
		};
	}

	static hasRequest(fromId, toId) {
		if (!fromId || !toId) {
			throw Error("Нужно указать fromId и toId.");
		}

		const friendshipRequests = store.getState();

		for (const fq of friendshipRequests) {
			if (fq.toId === toId && fq.fromId === fromId) {
				return true;
			}
		}

		return false;
	}

	static CREATED = 0;
	static FRIENDED = 1;
	static DELETED = 2;
}

export default FriendshipRequest;
