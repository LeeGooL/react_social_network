import FriendshipRequest from "./models/FriendshipRequest.js";
import Friendship from "./models/Friendship.js";
import Like from "./models/Like.js";
import Chat from "./models/Chat.js";
import Post from "./models/Post.js";
import User from "./models/User.js";

export default async function initModels() {
	try {
		await FriendshipRequest.init();
		await Friendship.init();
		await Like.init();
		await Chat.init();
		await Post.init();
		await User.init();

		console.log("База данных инициализирована.");

		return true;
	} catch (error) {
		console.log(error);

		return false;
	}
}
