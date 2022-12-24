import config from "config";

import server from "./server.js";
import initModels from "./initModels.js";

import "./wss.js";

const PORT = config.get("port");

main();

async function main() {
	if (!(await initModels())) {
		return;
	}

	server.listen(PORT, () => console.log(`Сервер запущен на ${PORT} порту.`));
}
