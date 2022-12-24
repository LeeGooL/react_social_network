import User from "./User.js";
import { createFileStore, observer } from "./index.js";
import Friendship from "./Friendship.js";
import Like from "./Like.js";

export const postsStore = createFileStore();
const store = postsStore;

class Post {
	static async init() {
		await store.init("posts");
	}

	static findOne(template = {}, watcherId) {
		const posts = store.getState();
		const keys = Object.keys(template);

		const post = posts.find((post) => {
			for (let key of keys) {
				if (post[key] !== template[key]) {
					return false;
				}
			}

			return true;
		});

		post.likes = Like.getPostLikes(post.id);
		post.liked = Like.isLiked(watcherId, post.id);
		return post;
	}

	static find(template = {}, watcherId) {
		const posts = store.getState();
		const keys = Object.keys(template);

		return posts
			.filter((post) => {
				for (let key of keys) {
					if (post[key] !== template[key]) {
						return false;
					}
				}

				return true;
			})
			.map((post) => {
				post.likes = Like.getPostLikes(post.id);
				post.liked = Like.isLiked(watcherId, post.id);
				return post;
			});
	}

	static async create(authorId, wallId, content) {
		if (!authorId || !wallId || !content) {
			throw Error("Нужно указать authorId, wallId и content.");
		}

		const authore = User.findOne({ id: authorId });
		if (!authore) {
			throw Error("Автор не найден.");
		}

		const wall = User.findOne({ id: wallId });
		if (!wall) {
			throw Error("Стена не найдена.");
		}

		if (authorId !== wallId) {
			const flag = Friendship.isFriends(authorId, wallId);

			if (!flag) {
				throw Error("Нельзя публиковать посты на странице не друга.");
			}
		}

		const posts = store.getState();
		const id = 1 + Math.max(0, ...posts.map((post) => post.id));
		const post = {
			id,
			authorId,
			wallId,
			content,
			createdAt: Date.now(),
		};
		posts.push(post);
		await store.setState(posts);

		observer.emit("Post.create", post);

		return post;
	}

	static async update(template, patch) {
		if (!template || !patch) {
			throw Error("Нужно указать template и patch");
		}

		if (!Object.hasOwn(patch, "content") || !patch.content) {
			throw Error("patch не соответствует схеме.");
		}

		const keys = Object.keys(template);
		const posts = store.getState();
		const post = posts.find((post) => {
			for (const key of keys) {
				if (post[key] !== template[key]) {
					return false;
				}
			}

			return true;
		});

		if (!post) {
			throw Error(
				"Пост не найден или не хватает прав на редактирование."
			);
		}

		post.content = patch.content;

		observer.emit("Post.update", post);

		await store.setState(posts);
	}

	static async delete(template) {
		if (!template) {
			throw Error("Нужно указать template");
		}

		const keys = Object.keys(template);
		const posts = store.getState();
		const index = posts.findIndex((post) => {
			for (const key of keys) {
				if (post[key] !== template[key]) {
					return false;
				}
			}

			return true;
		});

		if (index === -1) {
			throw Error("Пост не найден или не хватает прав на удаление.");
		}

		const post = posts[index];
		await Like.delete(post.id);

		posts.splice(index, 1);

		observer.emit("Post.delete", post);

		await store.setState(posts);
	}
}

export default Post;
