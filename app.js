var express = require('express'),
    app = express();

var server = app.listen(process.env.PORT || 8000, function(){
    console.log("Node.js is listening to PORT:" + server.address().port);
});

var fs = require('fs')
    , path = require('path')

var list = [];
var getFile = function(p, callback){
	var results = [];

	fs.readdir(p, function (err, files) {
		if (err) throw err;

		var pending = files.length;
		if (!pending) return callback(null, results); //全てのファイル取得が終わったらコールバックを呼び出す

		files.map(function (file) { //リスト取得
			return path.join(p, file);
		}).filter(function (file) {
			if(fs.statSync(file).isDirectory()) getFile(file, function(err, res) { //ディレクトリだったら再帰
				results.push({name:path.basename(file), children:res}); //子ディレクトリをchildrenインデックス配下に保存
				if (!--pending) callback(null, results);
			 });
			return fs.statSync(file).isFile();
		}).forEach(function (file) { //ファイル名を保存
			var stat = fs.statSync(file);
			results.push({file:path.basename(file), size:stat.size});
            if(file.match(/\.(png|jpeg|jpg|gif)$/)) {
                list.push(file);
            }
			if (!--pending) callback(null, results);
		});

	});
}


// var Tesseract = require('tesseract.js') //ブラウザで使う場合はこの項目は必要ありません
// console.log(__dirname + '/img/img.png')
//
// Tesseract
//   // (読み込む画像, 言語) jpeg || png
//   .recognize(__dirname + '/img/img.png', {lang: 'jpn'}) //exp: jpn, eng
//   //.ImageLike('media', lang)  //* browser only img || video || canvas
//   // .progress(function(p) {
//   //   // 進歩状況の表示
//   //   // console.log('progress', p)
//   // })
//   // 結果のコールバック
// //  .catch(err => console.error(err))
//   .then(result => console.log(result.text))
// //  .finally(resultOrError => console.log(resultOrError)));

app.set('view engine', 'ejs');
app.get('/', function(req, res, next){
    list = [];
    getFile('public/checkImage', function(err, results) {
    	if (err) throw err;
    	var data = results;
    	console.log(list); //一覧出力
        res.render('index', {
            img: list
        });
    });

});
app.use('/static', express.static(__dirname + '/public'));
app.post('search',function (req,res, next){
    //
})
