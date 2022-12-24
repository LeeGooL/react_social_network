import User from "./User.js";
import { createFileStore } from "./index.js";

export const friendshipStore = createFileStore();
const store = friendshipStore;

class Friendship {
	static async init() {
		await store.init("friendships");
	}

	static async create(id1, id2) {
		if (!id1 || !id2) {
			throw Error("Нужно указать 2 id.");
		}

		if (id1 === id2) {
			throw Error("Нужно указать 2 разных id.");
		}

		const friendships = store.getState();

		const exists = friendships.findIndex(
			([id3, id4]) =>
				(id1 === id3 && id2 === id4) || (id1 === id4 && id2 === id3)
		);

		if (exists !== -1) {
			throw Error("Пара друзей уже существует");
		}

		friendships.push([id1, id2]);
		await store.setState(friendships);
	}

	static getFriends(id) {
		if (!id) {
			throw Error("Нужно указать id пользователя.");
		}

		const friendships = store.getState();
		const friendIds = [];

		for (const [id1, id2] of friendships) {
			if (id1 === id) {
				friendIds.push(id2);
			} else if (id2 === id) {
				friendIds.push(id1);
			}
		}

		const friends = friendIds.map((friendId) =>
			User.findOne({ id: friendId })
		);
		return friends.filter((friend) => friend);
	}

	static async deleteFriendship(id1, id2) {
		if (!id1 || !id2) {
			throw Error("Нужно указать id пользователей.");
		}

		const friendships = store.getState();
		let index = null;

		for (let i = 0; i < friendships.length; i++) {
			const [id3, id4] = friendships[i];

			const flag =
				(id3 === id1 && id4 === id2) || (id3 === id2 && id4 === id1);

			if (flag) {
				index = i;
				break;
			}
		}

		if (index === null) {
			return false;
		}

		friendships.splice(index, 1);
		await store.setState(friendships);

		return true;
	}

	static isFriends(id1, id2) {
		const friendships = store.getState();

		for (const [id3, id4] of friendships) {
			if (id1 === id3 && id2 === id4) {
				return true;
			}

			if (id1 === id4 && id2 === id3) {
				return true;
			}
		}

		return false;
	}
}

export default Friendship;
