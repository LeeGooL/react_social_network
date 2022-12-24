import { createFileStore, observer } from "./index.js";
import Post from "./Post.js";
import User from "./User.js";

export const likeStore = createFileStore();
const store = likeStore;

class Like {
	static async init() {
		await store.init("likes");
	}

	static async toggle(userId, postId) {
		if (!userId || !postId) {
			throw Error("Нужно указать userId и postId");
		}

		const user = User.findOne({ id: userId });
		if (!user) {
			throw Error("Пользователь не найден.");
		}

		const post = Post.findOne({ id: postId });
		if (!post) {
			throw Error("Пост не найден");
		}

		const likes = store.getState();
		const index = likes.findIndex(
			(like) => like.userId === userId && like.postId === postId
		);

		if (index === -1) {
			const like = { userId, postId, createdAt: Date.now() };
			likes.push(like);
		} else {
			likes.splice(index, 1);
		}

		observer.emit("Like.toggle", postId);

		await store.setState(likes);
	}

	static getPostLikes(id) {
		if (!id) {
			throw Error("Нужно указать id");
		}

		const likes = store.getState();

		let counter = 0;
		for (const like of likes) {
			if (like.postId === id) {
				counter += 1;
			}
		}

		return counter;
	}

	static isLiked(userId, postId) {
		if (!userId || !postId) {
			return false;
		}

		const likes = store.getState();

		for (const like of likes) {
			if (like.postId === postId && like.userId === userId) {
				return true;
			}
		}

		return false;
	}

	static async delete(postId) {
		if (!postId) {
			throw Error("postId не указан.");
		}

		const likes = store.getState();
		const nextLikes = likes.filter((like) => like.postId !== postId);

		observer.emit("Like.delete", postId);

		await store.setState(nextLikes);
	}
}

export default Like;
