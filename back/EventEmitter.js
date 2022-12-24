class EventEmitter {
	handlers = new Map();

	addEventListener(name, handler) {
		if (!this.handlers.has(name)) {
			this.handlers.set(name, new Set());
		}

		const handlers = this.handlers.get(name);
		handlers.add(handler);
	}

	on(...args) {
		return this.addEventListener(...args);
	}

	emit(name, arg) {
		setTimeout(() => {
			if (this.handlers.has(name)) {
				const handlers = this.handlers.get(name);

				for (const handler of handlers) {
					handler(arg);
				}
			}
		});
	}
}

export default EventEmitter;
