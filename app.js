var config = require('./config');
var memberId = process.env.NODE_ENV || config.memberId;
var memberUrl = 'http://www.pixiv.net/member_illust.php?id=' + memberId;
var ora = require('ora');
var spinner = new ora({
	spinner: 'line',
	color: 'white'
});

if (memberId === '' || memberId === undefined) {
	return console.log('請輸入畫師ＩＤ，可用NODE_ENV=ID');
} else {
	console.log('畫師ID ：', memberId);
}

// 判斷有無資料夾
require('./data/findfile');

run();

async function run(){
	// 判斷有無Cookie
	var cookie = await require('./data/cookie').findCookie(spinner);

	// 解析頁數網址
	var pageList = await require('./data/page').pageList(memberUrl, cookie, spinner);

	// 解析作品網址
	var worksList = await require('./data/works').worksList(pageList, cookie, spinner);

	// 解析圖片原始地址
	var imageList = await require('./data/image').imageList(worksList, cookie, spinner);

	// 開始下載圖片
	var download = await require('./data/download').imageDownload(imageList, cookie, spinner);
	console.log('檔案數量', imageList.length);
	console.log(download);
}
