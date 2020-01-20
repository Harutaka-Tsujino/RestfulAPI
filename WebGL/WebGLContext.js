class WebGLContext {
	constructor (canvasId, resolutionWidth = 1920, resolutionHeight = 1080) {
		this.Canvas = document.querySelector(`#${canvasId}`);
		this.ResolutionWidth = resolutionWidth;
		this.ResolutionHeight = resolutionHeight;

		this.FetchContext();
		this.ClearColor = { "r": 0.0, "g": 0.0, "b": 0.0, "a": 0.0 };
	}

	FetchContext() {
		this.Context = this.Canvas.getContext("webgl") ||
			this.Canvas.getContext("experimental-webgl");
	}

	InitContext() {
		this.Context.clearColor(
			this.ClearColor["r"],
			this.ClearColor["g"],
			this.ClearColor["b"],
			this.ClearColor["a"]);

		this.Context.clearDepth(1.0);
		this.Context.clear(
			this.Context.COLOR_BUFFER_BIT |
			this.Context.DEPTH_BUFFER_BIT);
	}

	CreateShader(shaderId) {
		let scriptElement = document.querySelector(`#${shaderId}`);
		if (!scriptElement) return;

		let shader;
		let isVertexShader = true;

		switch (scriptElement.type) {
			case "x-shader/x-vertex":
				shader = this.Context.createShader(this.Context.VERTEX_SHADER);
				isVertexShader = true;
				break;
			case "x-shader/x-fragment":
				shader = this.Context.createShader(this.Context.FRAGMENT_SHADER);
				isVertexShader = false;
				break;
			default:
				return;
		}

		this.Context.shaderSource(shader, scriptElement.text);
		this.Context.compileShader(shader);

		if (this.Context.getShaderParameter(shader, this.Context.COMPILE_STATUS)) {
			if (isVertexShader) {
				this.VertexShader = shader;
			} else {
				this.FragmentShader = shader;
			}
		}
		else {
			alert(this.Context.getShaderInfoLog(shader));
		}
	}

	CreateProgram() {
		let program = this.Context.createProgram();

		this.Context.attachShader(program, this.VertexShader);
		this.Context.attachShader(program, this.FragmentShader);
		this.Context.linkProgram(program);

		if (this.Context.getProgramParameter(program, this.Context.LINK_STATUS)) {
			this.Context.useProgram(program);
			this.Program = program;
		}
		else {
			alert(this.Context.getProgramInfoLog(program));
		}
	}

	CreateVBO(data) {
		let vbo = this.Context.createBuffer();
		this.Context.bindBuffer(this.Context.ARRAY_BUFFER, vbo);
		this.Context.bufferData(this.Context.ARRAY_BUFFER, new Float32Array(data), this.Context.STATIC_DRAW);

		// バッファのバインド解除
		this.Context.bindBuffer(this.Context.ARRAY_BUFFER, null);

		return vbo;
	}

	CreateIBO(data) {
		let ibo = this.Context.createBuffer();
		this.Context.bindBuffer(this.Context.ELEMENT_ARRAY_BUFFER, ibo);
		this.Context.bufferData(this.Context.ELEMENT_ARRAY_BUFFER, new Int16Array(data), this.Context.STATIC_DRAW);

		this.Context.bindBuffer(this.Context.ELEMENT_ARRAY_BUFFER, null);

		return ibo;
	}

	SetAttributeParameter(propertyName, data, stride) {
		let vbo = this.CreateVBO(data, this.Context);
		this.Context.bindBuffer(this.Context.ARRAY_BUFFER, vbo);

		let attLocation = this.Context.getAttribLocation(this.Program, propertyName);
		this.Context.enableVertexAttribArray(attLocation);
		this.Context.vertexAttribPointer(attLocation, stride, this.Context.FLOAT, false, 0, 0);
	}

	SetIndexBuffer(data) {
		let ibo = this.CreateIBO(data);
		this.Context.bindBuffer(this.Context.ELEMENT_ARRAY_BUFFER, ibo);
	}

	SetUniformMatrix4x4(propertyName, data) {
		let uniLocation = this.Context.getUniformLocation(this.Program, propertyName);
		this.Context.uniformMatrix4fv(uniLocation, false, data);
	}

	SetUniformFloat4(propertyName, data) {
		let uniLocation = this.Context.getUniformLocation(this.Program, propertyName);
		this.Context.uniform4fv(uniLocation, data);
	}

	DrawArraysByAngles(count) {
		this.Context.drawArrays(this.Context.TRIANGLES, 0, count);
	}

	DrawElementByAngles(length) {
		this.Context.drawElements(this.Context.TRIANGLES, length, this.Context.UNSIGNED_SHORT, 0);
	}

	Redraw() {
		this.Context.flush();
	}

	get Canvas() {
		return this.canvas;
	}
	set Canvas(value) {
		this.canvas = value;
	}

	get Context() {
		return this.context;
	}
	set Context(value) {
		this.context = value;
	}

	get ClearColor() {
		return this.clearColor;
	}
	set ClearColor({ r, g, b, a }) {
		this.clearColor = { "r": r, "g": g, "b": b, "a": a };
		this.InitContext();
	}

	get Program() {
		return this.program;
	}
	set Program(value) {
		this.program = value;
	}

	get VertexShader() {
		return this.vertexShader;
	}
	set VertexShader(value) {
		this.vertexShader = value;
	}

	get FragmentShader() {
		return this.fragmentShader;
	}
	set FragmentShader(value) {
		this.fragmentShader = value;
	}

	get ResolutionWidth() {
		return this.resolutionWidth;
	}
	set ResolutionWidth(value) {
		this.resolutionWidth = value;
		this.Canvas.width = this.ResolutionWidth;
	}

	get ResolutionHeight() {
		return this.resolutionHeight;
	}
	set ResolutionHeight(value) {
		this.resolutionHeight = value;
		this.Canvas.height = this.ResolutionHeight;
	}
};