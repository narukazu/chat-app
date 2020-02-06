/*Socket.IO　練習 */

var http   = require('http');
var fs     = require('fs'); //htmlを読み込むため
var server = http.createServer();

server.on("request",(req,res)=>{
   var stream = fs.createReadStream("sample-index.html"); //createReadStream について後で調べる
   res.writeHead(200, {"Content-Type":"text/html"});
   stream.pipe(res); //streamのpipe()メソッドについても後で調べる
});

server.listen(8080);　//ローカル8080にて接続
console.log("読み込み中");

/*わかったこと
　dataName3としてhtmlにもうひとつsocket.onしたがunderfind　
 */

//socket.io読み込み
var io = require("socket.io").listen(server); //サーバーから読み込む

// サーバーへのアクセスを監視。アクセスがあったらコールバックが実行
io.sockets.on("connection",function(socket){
  const dataToClient = { msg:"誰かが入室しました" }; //クライアントに送信するデータの例

　socket.emit("dataName1",dataToClient); //接続元のクライアントだけに送信
　socket.broadcast.emit("dataName1",dataToClient); //接続元のクライアント　以外　にデータ送信 スペルミス。socket つまり自分以外にデータを送信
　
　//クライアント　から　のデータ受信
　socket.on("dataName2", function(dataFromClient) {
   console.log(dataFromClient.text);
  });
 

});
