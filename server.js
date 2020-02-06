/**チャットアプリ */
var fs = require("fs");
var http = require("http");
var server = http.createServer();
server.on("request", function(request, response){
	//HTMLファイルをストリームで読み込む
	var stream = fs.createReadStream("index.html");
	response.writeHead(200, {"Content-Type":"text/html"});
	stream.pipe(response);
});
server.listen(8080);

// HTTPをWebSocketにUpgradeする
var io = require("socket.io").listen(server);

// ユーザ管理ハッシュ
var userHash = {};

// チャットアプリに接続した時に実行される
io.on("connection", function(socket){

	/** socketは接続しているブラウザで、以下のコードは接続直後にイベントを登録していく **/

	// ブラウザ毎の接続開始周り。
	socket.on("connected", function(name){
		var msg = name + "が入室しました";
		userHash[socket.id] = name;
		io.emit("pushlish", {value: msg});
	});

	// メッセージ送信のイベント
	socket.on("publish", function(data){
		io.emit("publish", {value:data.value});
	});

	// ブラウザを閉じた等で退出イベント
	socket.on("disconnect", function(){
		if(userHash[socket.id]){
			var msg = userHash[socket.id] + "が退出しました";
			delete userHash[socket.id];
			io.emit("publish", {value: msg});
		}
	});
});