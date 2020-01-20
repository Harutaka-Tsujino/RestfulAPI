let g_webGLContext;
let g_frame;

window.addEventListener("load", () => {
	g_mouse = new Mouse();

	g_webGLContext = new WebGLContext("canvas");

	g_webGLContext.CreateShader("vs");
	g_webGLContext.CreateShader("fs");
	g_webGLContext.CreateProgram();

	let vertexColors = [
		1, 1, 1, 1,
		1, 1, 1, 1,
		1, 1, 1, 1,
		1, 1, 1, 1
	];
	g_webGLContext.SetAttributeParameter("vertexColor", vertexColors, 4)

	g_frame = 0;
	RunMainLoop();
});

let g_mouse;
let g_mat;
let g_vMat;
let g_pMat;
let g_vpMat;
let g_hex = "11CD00";

const RunMainLoop = () => {
	g_webGLContext.InitContext();

	InitVPMat();

	DrawBar();

	DrawSquares();

	g_webGLContext.Redraw();

	++g_frame

	setTimeout(RunMainLoop, 1000 / 60);
};

const InitVPMat = () => {
	g_mat = new matIV();
	g_vpMat = g_mat.identity(g_mat.create());
	g_vMat = g_mat.identity(g_mat.create());
	g_pMat = g_mat.identity(g_mat.create());
	g_mat.lookAt([0, 0, 3], [0, 0, -1], [0, 1, 0], g_vMat);
	g_mat.perspective(
		60,
		g_webGLContext.ResolutionWidth /
		g_webGLContext.ResolutionHeight,
		0.1, 100, g_pMat);

	g_mat.multiply(g_pMat, g_vMat, g_vpMat);
};

const DrawBar = () => {
	let vertexPositions = [
		-1.0, 1.0, 0.0,
		1.0, 1.0, 0.0,
		1.0, -1.0, 0.0,
		-1.0, -1.0, 0.0
	];
	g_webGLContext.SetAttributeParameter("position", vertexPositions, 3);

	let indices = [
		0, 1, 3,
		1, 2, 3
	];
	g_webGLContext.SetIndexBuffer(indices);

	let hex = g_hex;
	let rgb = [
		parseInt(hex.slice(0, 2), 16) / 256,
		parseInt(hex.slice(2, 4), 16) / 256,
		parseInt(hex.slice(4, 6), 16) / 256
	];

	let color = [rgb[0], rgb[1], rgb[2], 0.4 * Math.abs(Math.sin(g_frame * 0.1)) + 0.2];
	g_webGLContext.SetUniformFloat4("color", color, 4);

	let mMatrix = g_mat.identity(g_mat.create());
	g_mat.translate(mMatrix, [0, 0, -1], mMatrix);
	g_mat.rotate(mMatrix, 3.14159 / 4, [0, 0, 1], mMatrix);
	let scale = 4.4 * Math.abs(Math.sin(g_frame * 0.002));
	g_mat.scale(mMatrix, [scale, scale, 1], mMatrix);
	let mvpMatrix = g_mat.identity(g_mat.create());
	g_mat.multiply(g_vpMat, mMatrix, mvpMatrix);
	g_webGLContext.SetUniformMatrix4x4("mvpMatrix", mvpMatrix);

	g_webGLContext.DrawElementByAngles(6);
};

let g_buttonStateInPrevFrame;
let g_randomIndexSet;

const DrawSquares = () => {
	let vertexPositions = [
		0.0, 1.0, 0.0,
		1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0,
		0.0, -1.0, 0.0
	];
	g_webGLContext.SetAttributeParameter("position", vertexPositions, 3);

	let indices = [
		0, 1, 2,
		1, 3, 2
	];
	g_webGLContext.SetIndexBuffer(indices);

	if (g_mouse.ButtonState || g_buttonStateInPrevFrame == undefined) {
		if (!g_buttonStateInPrevFrame) {
			g_randomIndexSet = {
				x: Math.floor(Math.random() * 18) - 9,
				y: Math.floor(Math.random() * 14) - 7
			};

			g_buttonStateInPrevFrame = true;
		}
	}

	g_buttonStateInPrevFrame = g_mouse.ButtonState;

	for (let x = -11; x <= 11; ++x) {
		for (let y = -9; y <= 9; ++y) {
			let mvpMatrix = g_mat.identity(g_mat.create());
			g_mat.multiply(g_pMat, g_vMat, mvpMatrix);

			let isEdge_vertical = y == -8 || 8 == y ? true : false;

			let color;

			if (isEdge_vertical) {
				color = [0.08, 0.08, 0.08, 0.8];
			} else {
				if ((g_randomIndexSet.x == x && g_randomIndexSet.y == y)) {
					color = [0.1, 0.1, 0.0, Math.random()];
				} else {
					color = [0.0, 0.0, 0.0, 0.8];
				}
			}

			g_webGLContext.SetUniformFloat4("color", color, 4);

			let sizeDif = (x <= 0 ? 1 : -1) * x * 0.125 +
				(y <= 0 ? 1 : -1) * y * 0.125;
			let sizeRate = Math.cos(g_frame * 0.05 + sizeDif);
			let size = sizeRate * 0.00218 + 0.12;
			let mMatrix_scale = g_mat.identity(g_mat.create());
			g_mat.scale(mMatrix_scale, [size * 0.5, size, 1], mMatrix_scale);
			let isEven_vertical = y % 2 == 0 ? true : false;
			let posDif = 0.12;
			let pos_x = x * posDif + (isEven_vertical ? 0 : posDif / 2);
			let mMatrix = g_mat.identity(g_mat.create());
			g_mat.translate(mMatrix, [pos_x, y * posDif, 0], mMatrix);
			g_mat.multiply(mMatrix, mMatrix_scale, mvpMatrix);
			g_webGLContext.SetUniformMatrix4x4("mvpMatrix", mvpMatrix);

			g_webGLContext.DrawElementByAngles(6);

			let textElement = document.querySelector("#centerText");
			let colorCode = "#FFFFFF" + Number(Math.floor((1 - sizeRate) * 200 + 50)).toString(16);
			textElement.style.color = colorCode;

		}
	}
};

// URL各自ポート等書き換えてください
const URL = "http://localhost:33333/chat_tool/Hex";

// HTMLの中身を全部上書きする用
let inputForm;

let key_textbox;
let hex_textbox;
let delete_textbox;

// Windowのロードが終わる前にHTMLの要素を抜き出そうとしてもまだ生成されていない
// 各種ボタンが押された時に関数を実行するように登録
window.addEventListener("load", () => {
	inputForm = document.getElementById("inputForm");

	key_textbox = document.getElementById("key_textbox");
	hex_textbox = document.getElementById("hex_textbox");

	post_button = document.getElementById("post_button");
	post_button.onclick = CreateHex;

	get_button = document.getElementById("get_button");
	get_button.onclick = GetHex;

	put_button = document.getElementById("put_button");
	put_button.onclick = UpdateHex;

	delete_button = document.getElementById("delete_button");
	delete_button.onclick = DeleteHex;
});

// ++++++++++++++++++インターフェイスの統一がされている(POST、GET、PUT、DELETE)++++++++++++++++++
// ++++++++++++++++++アドレス指定可能なURLで公開されている++++++++++++++++++
const CreateHex = () => {
	RequestAsync("POST", URL + "/" + key_textbox.value, null, hex_textbox.value);
};

const GetHex = () => {
	RequestAsync("GET", URL + "/" + key_textbox.value, LoadResponceText);
};

const UpdateHex = () => {
	RequestAsync("PUT", URL + "/" + key_textbox.value, null, hex_textbox.value);
};

const DeleteHex = () => {
	RequestAsync("DELETE", URL + "/" + key_textbox.value);
};

// 非同期でリクエストを投げる
//                    メソッド名POST等 URL 読み込み時に呼び出す関数のポインタ リクエストボディ
const RequestAsync = (openMethodName, url, onLoadEventHandler = null, data = null) => {
	// ++++++++++++++++++ステートレス++++++++++++++++++
	let xhr = new XMLHttpRequest();
	xhr.open(openMethodName, url, true);

	xhr.onload = onLoadEventHandler;

	xhr.send(data);
};

// HTMLをリスポンステキストで上書きする
//                        XMLHttpRequest(xhr)のProgressEvent xhrのonloadで自動的に渡される
const LoadResponceText = (progressEvent) => {
	let xhr = progressEvent.srcElement;

	// ++++++++++++++++++RESTの処理結果がHTTPステータスコードで通知される++++++++++++++++++
	if (xhr.readyState == 4 && xhr.status == "200") {
		g_hex = xhr.responseText;
	} else {
		console.error(xhr.responseText);
	}
};
