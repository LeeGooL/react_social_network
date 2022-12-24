import { join, resolve } from "path";
import { existsSync, mkdirSync } from "fs";
import { readFile, rm, writeFile } from "fs/promises";
import cloneDeep from "lodash/cloneDeep.js";
import EventEmitter from "../EventEmitter.js";

const __dirname = resolve();
const databasePath = join(__dirname, "database");

export function createFileStore(initState = []) {
	let path = null;
	let state = cloneDeep(initState);

	async function init(name) {
		path = join(databasePath, `${name}.json`);

		if (!existsSync(databasePath)) {
			mkdirSync(databasePath);
		}

		if (!existsSync(path)) {
			await writeFile(path, JSON.stringify(initState), "utf-8");
			return;
		}

		try {
			const json = await readFile(path, "utf-8");
			state = JSON.parse(json);
		} catch (error) {
			await rm(path);

			await writeFile(path, JSON.stringify(state, null, "\t"), "utf-8");
		}
	}

	function getState() {
		return cloneDeep(state);
	}

	async function setState(nextState) {
		if (!path || !existsSync(path)) {
			throw Error("База данных не инициализирована.");
		}

		state = cloneDeep(nextState);

		await rm(path);
		await writeFile(path, JSON.stringify(state, null, "\t"), "utf-8");
	}

	return { init, getState, setState };
}

export const observer = new EventEmitter();
