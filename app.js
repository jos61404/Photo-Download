var fs = require('fs');
var async = require('async');
var request = require('request');
var cheerio = require('cheerio');
var config = require('./config');
var jsonfile = require('jsonfile');
var urlDataArray = [];
var memberUrl = 'http://www.pixiv.net/member_illust.php?id=' + config.memberId;
var jar = request.jar();

var filename = config.fileName + config.memberId + '/';
// 判斷有無資料夾
if (!fs.existsSync(filename)) {
	fs.mkdirSync(filename, 0777);
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
			'Referer': 'http://www.pixiv.net/',
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.89 Safari/537.36',
		},
		jar: jar
	}, function(err, res, body){
		$ = cheerio.load(body);
		var imageItems = $('._image-items li');
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
						'Referer': 'http://www.pixiv.net/',
						'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.89 Safari/537.36',
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
					}
				});
			}
		}, function(err, ret){
			var r = 0;
			for (var i = 0; i < ret.length; i++) {
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
			$ = cheerio.load(body);
			var next = $('.next').eq(0).find('a').attr('href');
			console.log('數量 ： ', r);
			if (next === undefined) {
				console.log('下一頁網址 ： 最後一頁');
				console.log('總共數量： ', urlDataArray.length);
				console.log('---------------------------------');
				imageDownload(urlDataArray);
			} else {
				console.log('下一頁網址 ： ', next);
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
		async.retry({
			times: 100,
			interval: config.downloadTimeRetry
		}, function(cb, result) {
			setTimeout(function(){
				console.log('總共： ' + urlDataArray.length + ' 目前： ' + d);
				console.log('圖片網址： ', urlData.url);
				var down = request({
					url: urlData.url,
					headers: {
						'Referer': 'http://www.pixiv.net/',
						'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36',
						'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
						'Content-Type': 'image/jpeg',
						'Accept-Ranges': 'bytes',
						'Host': 'i2.pixiv.net',
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

				down.on('error', function(err){
					type = true;
					console.log('錯誤： ', err);
					return cb({
						name: urlData.name,
						url: urlData.url
					}, {
						name: urlData.name,
						url: urlData.url
					});
				});
				down.on('response', function(response) {
					console.log('路徑 ：', filename + urlData.name);
					console.log('狀態 ： ',response.statusCode);
					down.pipe(fs.createWriteStream(filename + urlData.name, 'binary'));
					console.log('---------------------------------');
					d++;
					return ck(null, null);
				});
			}, tm);
		}, function(err, result) {
			ck(null, {
				name: urlData.name,
				url: urlData.url
			});
		});
	}, function(err, gty){
		console.log('下載已結束～');
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
	});
}
