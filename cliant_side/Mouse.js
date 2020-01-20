class Mouse {
	constructor () {
		this.Position = { "x": 0, "y": 0 };
		this.ButtonState = false;

		document.onmousemove = (e) => {
			var position = { "x": e.clientX, "y": e.clientY };
			this.Position = position;
		};

		document.onmousedown = () => {
			this.ButtonState = true;
			this.DragInitPositon = this.Position;
		};

		document.onmouseup = () => {
			this.ButtonState = false;
			this.DragDestPositon = this.Position;
		};
	}

	get DragDistance() {
		if (this.ButtonState && this.DragInitPositon) {
			return {
				x: this.Position.x - this.DragInitPositon.x,
				y: this.Position.y - this.DragInitPositon.y
			};
		}
		else {
			return { x: 0, y: 0 };
		}
	}

	get DragInitPositon() {
		return this.dragInitPosition;
	}
	set DragInitPositon({ x, y }) {
		this.dragInitPosition = { "x": x, "y": y };
	}

	get ButtonState() {
		return this.buttonState;
	}
	set ButtonState(value) {
		this.buttonState = value;
	}

	get Position() {
		return this.position;
	}
	set Position({ x, y }) {
		this.position = { "x": x, "y": y };
	}

	set OnButtonDown(value) {
		document.onmousedown = value;
	}
};
