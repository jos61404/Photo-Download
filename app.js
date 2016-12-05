var fs = require('fs');
var async = require('async');
var request = require('request');
var cheerio = require('cheerio');
var config = require('./config');
var jsonfile = require('jsonfile');
var ora = require('ora');
var spinner = new ora({
	spinner: 'line',
	color: 'white'
});
var imageDownloadStartTime;
var memberImageListData = 1;
var viewType = config.viewType;
var out = process.stdout;
var urlDataArray = [];
var memberUrl = 'http://www.pixiv.net/member_illust.php?id=' + config.memberId;
var jar = request.jar();
var filename = config.fileName + config.memberId + '/';

console.log('畫師ID ：', config.memberId);

// 判斷有無資料夾
if (!fs.existsSync(config.fileName)) {
	fs.mkdirSync(config.fileName, 0777);
}
if (!fs.existsSync(filename)) {
	fs.mkdirSync(filename, 0777);
}

if (fs.existsSync(config.fileName) && fs.existsSync(filename)) {
	console.log('下載目錄： 已創建完成');
}

// 判斷有無 Cookie 沒有就請求在寫入
if (config.Cookie === null) {
	request('https://accounts.pixiv.net/login?lang=zh_tw&source=pc&view_type=page&ref=wwwtop_accounts_index', function(error, response, body) {
		if (!error && response.statusCode == 200) {
			var dataForm = {};
			var cookie = response.headers["set-cookie"].join();
			$ = cheerio.load(body);
			var login = $('#old-login form');
			var formArray = login.serializeArray();
			var form = login.find('input');

			for (var i = 0; i < form.length; i++) {
				var formData = form[i].attribs;
				dataForm[formData.name] = formData.value;
			}

			var loginDiv = login.find('div div').find('input');
			var loginId = loginDiv.eq(0)[0].attribs.name;
			var loginPassword = loginDiv.eq(1)[0].attribs.name;
			dataForm[loginId] = config.loginId;
			dataForm[loginPassword] = config.loginPassword;

			request.post({
				url:'https://accounts.pixiv.net/api/login?lang=zh_tw',
				headers: {
					"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.89 Safari/537.36",
					"Host": "accounts.pixiv.net",
					"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
					"Accept": "application/json, text/javascript, */*; q=0.01",
					"Accept-Language": "zh-TW,zh;q=0.8,en-US;q=0.6,en;q=0.4",
					"Cache-Control": "no-cache",
					"Connection": "Keep-Alive",
					"Referer": "https://accounts.pixiv.net/login?return_to=http%3A%2F%2Fwww.pixiv.net%2F&lang=zh_tw&source=accounts&view_type=page&ref=",
					"Cookie": cookie
				},
				form: dataForm
			}, function(err, textStatus, xhr) {
				if (JSON.parse(xhr).body.validation_errors) {
					return console.log('錯誤訊息： ', JSON.parse(xhr).body.validation_errors);
				}
				textStatus.setEncoding("utf8");
				var cookies = textStatus.headers["set-cookie"];
				var cookiesJoin = cookies.join();
				// console.log('xhr 資料： ', JSON.parse(xhr).body);
				// console.log('cookies 資料： ', cookies);
				// console.log('cookiesJoin 資料： ', cookiesJoin);
				config.Cookie = cookiesJoin;
				jsonfile.writeFileSync('config.json', config);
				var rcookie = request.cookie(config.Cookie);
				memberImageList(memberUrl, rcookie);
			});
		}
	});
} else {
	var rcookie = request.cookie(config.Cookie);
	memberImageList(memberUrl, rcookie);
}


// 圖片列表查詢
function memberImageList(url, cookie) {
	jar.setCookie(cookie, url);
	request({
		url: url,
		headers: {
			'Accept': 'application/json, text/javascript, */*; q=0.01',
			'Accept-Language': 'zh-TW,zh;q=0.8,en-US;q=0.6,en;q=0.4',
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36',
			'Referer': url,
		},
		jar: jar
	}, function(err, res, body){
		$ = cheerio.load(body);
		var imageItems = $('._image-items li');
		spinner.start().text = '目前處理頁數： ' + memberImageListData;
		async.map(imageItems, function(data, cb) {
			var aHrefId = $(data).find('a').attr('href').split('id=')[1];
			var imageUrl = 'http://www.pixiv.net/member_illust.php?mode=medium&illust_id=' + aHrefId;

			requestUrl(imageUrl);

			function requestUrl(imageUrl, type) {
				if(type === 'manga') {
					imageUrl = 'http://www.pixiv.net/member_illust.php?mode=manga&illust_id=' + aHrefId;
				}
				request({
					url: imageUrl,
					headers: {
						'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
						'Accept-Language': 'zh-TW,zh;q=0.8,en-US;q=0.6,en;q=0.4',
						'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.89 Safari/537.36',
						'Referer': 'http://www.pixiv.net/member_illust.php?id=' + config.memberId,
					},
					jar: jar
				},function (error, response, body){
					if (!error && response.statusCode == 200) {
						$ = cheerio.load(body);
						if(type === 'manga') {
							var mangaList = $('#main .manga .item-container');
							var mangaArray = [];
							for (var i = 0; i < mangaList.length; i++) {
								var manga = mangaList.eq(i);
								var mangaUrl = manga.find('img').attr('data-src');
								var len = mangaUrl.split('/');
								var imgName = len[len.length-1];
								mangaArray.push({
									name: imgName,
									url: mangaUrl
								});
							}
							var man = {
								type: 'manga',
								mangaArray: mangaArray
							};
							return cb(null, man);
						} else {
							var illust = $('._illust_modal');
							var imgUrl = illust.find('img').attr('data-src');
							var imgName = illust.find('img').attr('alt');
						}

						if (!imgUrl) {
							requestUrl(imageUrl, 'manga');
						} else {
							var len = imgUrl.split('/');
							var imgName = len[len.length-1];
							var data = {
								type: 'url',
								url: imgUrl,
								name: imgName
							};
							return cb(null, data);
						}
					} else {
						return cb(null, null);
					}
				});
			}
		}, function(err, ret){
			var r = 0;
			for (var i = 0; i < ret.length; i++) {
				if (ret[i] !== null) {
					r++;
					if (ret[i].type === 'manga') {
						for (var a = 0; a < ret[i].mangaArray.length; a++) {
							r++;
							var manga = ret[i].mangaArray[a];
							urlDataArray.push({
								url: manga.url,
								name: manga.name
							});
						}
					} else if (ret[i].type === 'url') {
						urlDataArray.push({
							url: ret[i].url,
							name: ret[i].name
						});
					}
				}
			}
			$ = cheerio.load(body);
			var next = $('.column-order-menu .pager-container .next').find('a').attr('href');
			if (next === undefined) {
				spinner.succeed();
				console.log('總共頁數： ' + memberImageListData);
				console.log('總共數量： ', urlDataArray.length);
				console.log('---------------------------------');
				imageDownloadStartTime = new Date();
				imageDownload(urlDataArray);
			} else {
				spinner.succeed().text = '目前處理頁數： ' + memberImageListData;
				memberImageListData++;
				memberImageList('http://www.pixiv.net/member_illust.php' + next, cookie);
			}
		});
	});
}

// 開始下載圖片
function imageDownload(urlDataArray , time) {
	var tm = time || config.downloadTime;
	var d = 1;
	var type = false;
	async.mapLimit(urlDataArray, 1, function(urlData, ck){
		if (urlData === null) {
			return ck(null, null);
		}

		var retry = true;
		var retryData = 1;
		async.retry({
			times: 100,
			interval: config.downloadTimeRetry
		}, function(cb, result) {
			setTimeout(function(){
				var startTime = Date.now();
				var down = request({
					url: urlData.url,
					headers: {
						'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36',
						'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
						'Accept-Ranges': 'bytes',
						'Referer': urlData.url,
						'Accept-Encoding': 'gzip, deflate, sdch',
						'Accept-Language': 'zh-TW,zh;q=0.8,en-US;q=0.6,en;q=0.4',
						'Cache-Control': 'no-cache',
						'Connection': 'keep-alive',
						'Upgrade-Insecure-Requests': '1',
					},
					jar: jar,
					encoding: 'binary'
				});

				setTimeout(function() {
					if (retry) {
						if (viewType) {
							spinner.start().text = '剩餘數量： ' + (urlDataArray.length - d) + ' | 檔案名稱 ：' + urlData.name + ' | 下載中...';
						} else {
							console.log('總共： ' + urlDataArray.length + ' 目前： ' + d);
							console.log('圖片網址： ', urlData.url);
							console.log('路徑 ：', filename);
							console.log('檔案名稱 ：', urlData.name);
							spinner.start().text = '下載狀態： 下載中...';
						}
					}

					down.on('error', function(err){
						if (!type) {
							spinner.fail();
						}
						if (viewType) {
							spinner.start().text = '下載狀態： 重試中...   第' + retryData + '次重試';
						} else {
							spinner.start().text = '下載狀態： 重試中...   第' + retryData + '次重試';
						}
						type = true;
						retry = false;
						retryData++;
						return cb({
							name: urlData.name,
							url: urlData.url
						}, {
							name: urlData.name,
							url: urlData.url
						});
					});
					down.on('response', function(response) {
						down.pipe(fs.createWriteStream(filename + urlData.name, 'binary'));
						var endTime = Date.now();
						out.clearLine();
						out.cursorTo(0);
						if (!retry) {
							spinner.succeed();
						}
						if (viewType) {
							spinner.start().text = '剩餘數量： ' + (urlDataArray.length - d) + ' | 檔案名稱：' + urlData.name + ' | 下載時間 ： ' + (endTime - startTime) / 1000 + '秒 | 下載完成';
							spinner.succeed();
						} else {
							console.log('下載時間 ： ' + (endTime - startTime) / 1000 + '秒。');
							spinner.start().text = '下載狀態： 已完成';
							spinner.succeed();
						}
						console.log('-------------------------------------------------------------------------------------------');
						d++;
						return ck(null, null);
					});
				}, 1);
			}, tm);
		}, function(err, result) {
			ck(null, {
				name: urlData.name,
				url: urlData.url
			});
		});
	}, function(err, gty){
		var ar = [];
		for (var i = 0; i < gty.length; i++) {
			gty[i];
			if (gty[i] !== null) {
				ar.push(gty[i]);
			}
		}
		if (type === true) {
			return imageDownload(ar, config.downloadTimeRetry);
		}
		// var imageDownloadEndTime = new Date();
		// var timeData = new Date(imageDownloadEndTime - imageDownloadStartTime);
		// console.log('總共用時 ： ' + timeData.getMinutes() + '分 ' +timeData.getSeconds() + '秒');
		return console.log('下載已結束～');
	});
}
