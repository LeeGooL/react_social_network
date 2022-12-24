import { isEmail } from "../utils.js";
import _pick from "lodash/pick.js";
import { createFileStore, observer } from "./index.js";

export const userStore = createFileStore();
const store = userStore;

class User {
	static async init() {
		await store.init("users");
	}

	static async create(data = {}) {
		if (Object.hasOwn(data, "id")) {
			throw Error("Нельзя создать пользователя с id.");
		}

		for (const field of ["name", "surname", "password", "email"]) {
			if (!Object.hasOwn(data, field) || !data[field]) {
				throw Error("Не хватает данных для создания пользователя.");
			}
		}

		if (data.password.length < 3) {
			throw Error("Пароль должен быть длинной не менее 3 символов");
		}

		if (!isEmail(data.email)) {
			throw Error("Нужно указать email.");
		}

		const users = store.getState();

		const checkUser = users.find((user) => user.email === data.email);
		if (checkUser) {
			throw Error("Пользователь с такой почтой уже есть.");
		}

		const id = 1 + Math.max(0, ...users.map((user) => user.id));

		const user = {
			id,
			email: data.email,
			name: data.name,
			surname: data.surname,
			password: data.password,
			status: "",
			avatar: "/sets/avatar.png",
		};

		users.push(user);
		await store.setState(users);

		delete user.password;
		delete user.email;

		return user;
	}

	static async update(template = {}, data = {}) {
		data = _pick(data, [
			"email",
			"name",
			"surname",
			"password",
			"status",
			"avatar",
		]);
		const dataKyes = Object.keys(data);

		if (!dataKyes.length) {
			throw Error("Нет данных для обнавления.");
		}

		if (Object.hasOwn(data, "email") && !isEmail(data.email)) {
			throw Error("Поле email не соответствует схеме почты.");
		}

		for (const key of ["name", "surname"]) {
			if (Object.hasOwn(data, key) && !data[key]) {
				throw Error("Имя или фамилия пустое поле.");
			}
		}

		if (Object.hasOwn(data, "password") && data.password.length < 3) {
			throw Error("Пароль должен быть длинной не менее 3х символов.");
		}

		const users = store.getState();

		if (Object.hasOwn(data, "email")) {
			for (const user of users) {
				if (user.email === data.email) {
					throw Error("Почта уже используется.");
				}
			}
		}

		const templateKeys = Object.keys(template);

		const user = users.find((user) => {
			for (const key of templateKeys) {
				if (user[key] !== template[key]) {
					return false;
				}
			}

			return true;
		});

		Object.assign(
			user,
			_pick(
				data,
				"email",
				"name",
				"surname",
				"password",
				"status",
				"avatar"
			)
		);

		await store.setState(users);

		observer.emit("User.update", user);
	}

	static find(template = {}) {
		const users = store.getState();
		const keys = Object.keys(template);

		const findeds = users.filter((user) => {
			for (const key of keys) {
				if (user[key] !== template[key]) {
					return false;
				}
			}

			return true;
		});

		findeds.forEach((user) => {
			delete user.password;
			delete user.email;
		});

		return findeds;
	}

	static findOne(template = {}) {
		const users = store.getState();
		const keys = Object.keys(template);

		const user = users.find((user) => {
			for (const key of keys) {
				if (user[key] !== template[key]) {
					return false;
				}
			}

			return true;
		});

		if (user) {
			delete user.password;
			delete user.email;
			return user;
		}
	}

	static getUserPassword(userId) {
		const users = store.getState();
		const user = users.find((user) => user.id === userId);

		if (!user) {
			throw Error("Пользователь не найден.");
		}

		return user.password;
	}

	static getUserEmail(userId) {
		const users = store.getState();
		const user = users.find((user) => user.id === userId);

		if (!user) {
			throw Error("Пользователь не найден.");
		}

		return user.email;
	}
}

export default User;
