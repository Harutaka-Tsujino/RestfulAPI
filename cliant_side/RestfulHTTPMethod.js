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
	RequestAsync("POST", URL + "/" + key_textbox.value, LoadResponceText, hex_textbox.value);
};

const GetHex = () => {
	RequestAsync("GET", URL + "/" + key_textbox.value, LoadResponceText);
};

const UpdateHex = () => {
	RequestAsync("PUT", URL + "/" + key_textbox.value, LoadResponceText, hex_textbox.value);
};

const DeleteHex = () => {
	RequestAsync("DELETE", URL + "/" + key_textbox.value, LoadResponceText);
};

// 非同期でリクエストを投げる
//                    メソッド名POST等 URL 読み込み時に呼び出す関数のポインタ リクエストボディ
const RequestAsync = (openMethodName, url, onLoadEventHandler, data = null) => {
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
		inputForm.innerHTML = xhr.responseText;
	} else {
		console.error(xhr.responseText);
	}
};
