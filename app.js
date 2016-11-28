var fs = require('fs');
var path = require('path');
var async = require('async');
var request = require('request');
var cheerio = require('cheerio');
var wget = require('wget');
var http = require('http');
// 預設資料夾名稱 images
var filename = 'images/';

var url = 'https://accounts.pixiv.net/login?lang=zh_tw&source=pc&view_type=page&ref=wwwtop_accounts_index';
var dataForm = {};
var headers = {
	"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.89 Safari/537.36",
	"Host": "accounts.pixiv.net",
	'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8",
	// "Content-Length": postData.length,
	"Accept": "application/json, text/javascript, */*; q=0.01",
	"Accept-Language": "zh-TW,zh;q=0.8,en-US;q=0.6,en;q=0.4",
	"Cache-Control": "no-cache",
	"Connection": "Keep-Alive",
	"Referer": "https://accounts.pixiv.net/login?return_to=http%3A%2F%2Fwww.pixiv.net%2F&lang=zh_tw&source=accounts&view_type=page&ref=",
};
//
// request(url, function(error, response, body) {
// 	if (!error && response.statusCode == 200) {
// 		var cookie = response.headers["set-cookie"].join();
// 		headers.Cookie = cookie;
//
// 		$ = cheerio.load(body);
// 		var login = $('#old-login form');
// 		var formArray = login.serializeArray();
// 		var form = login.find('input');
//
// 		for (var i = 0; i < form.length; i++) {
// 			var formData = form[i].attribs;
// 			dataForm[formData.name] = formData.value;
// 			// console.log('formData', formData);
// 		}
// 		// console.log('form', form);
// 		// console.log('dataForm', dataForm);
// 		var loginDiv = login.find('div div').find('input');
// 		var loginId = loginDiv.eq(0)[0].attribs.name;
// 		var loginPassword = loginDiv.eq(1)[0].attribs.name;
// 		dataForm[loginId] = 'ggggggg'; //帳號
// 		dataForm[loginPassword] = 'hhhhhh'; //密碼
//
// 		// console.log('dataForm 22222', dataForm);
//
// 		// var querystring = require("querystring");
// 		// var postData = querystring.stringify(dataForm);
//
// 		request.post({
// 			url:'https://accounts.pixiv.net/api/login?lang=zh_tw',
// 			// host: "accounts.pixiv.net",
// 			// path: "/api/login?lang=zh",
// 			headers: headers,
// 			form: dataForm
// 		}, function(err, textStatus, xhr) {
// 			if (JSON.parse(xhr).body.validation_errors) {
// 				return console.log('xhr.body', JSON.parse(xhr).body.validation_errors);
// 			}
// 			textStatus.setEncoding("utf8");
//
// 			var cookies = textStatus.headers["set-cookie"];
// 			// console.log('data', data);
// 			// console.log('textStatus', textStatus);
// 			console.log('xhr', JSON.parse(xhr).body);
// 			console.log('cookies', cookies);
// 			// console.log('xhr', xhr);
// 			// headers.cookie = cookies;
// 			var j = request.jar();
// 			var cookiesJoin = cookies.join();
// 			console.log('cookiesJoin', cookiesJoin);
// 			// var rcookie = request.cookie('p_ab_id=8; _ga=GA1.2.2071423881.1474355586; device_token=e7f20a7cb2122d886a6fd2c064fb36ff; a_type=0; is_sensei_service_user=1; login_ever=yes; PHPSESSID=14556077_7436532862f11da0c95adc3ebcf3e5b7; module_orders_mypage=%5B%7B%22name%22%3A%22hot_entries%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22everyone_new_illusts%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22sensei_courses%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22spotlight%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22featured_tags%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22contests%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22following_new_illusts%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22mypixiv_new_illusts%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22booth_follow_items%22%2C%22visible%22%3Atrue%7D%5D; ki_t=1474356283748%3B1474356283748%3B1474359976073%3B1%3B4; ki_r=; __lfcc=1; __utma=235335808.2071423881.1474355586.1474355636.1474359783.2; __utmb=235335808.2.10.1474359783; __utmc=235335808; __utmz=235335808.1474355636.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utmv=235335808.|2=login%20ever=yes=1^3=plan=normal=1^5=gender=male=1^6=user_id=14556077=1');
// 			// var rcookie = request.cookie('PHPSESSID=14556077_bfc492913aeb855b26720d64380a07c5; expires=Thu, 20-Oct-2016 09:29:17 GMT; Max-Age=2592000; path=/; domain=.pixiv.net');
// 			var rcookie = request.cookie('PHPSESSID=16694242_d7e650c86858f854f25f7991193430f0; expires=Thu, 20-Oct-2016 14:52:25 GMT; Max-Age=2592000; path=/; domain=.pixiv.net,device_token=49709bf7124702e9c06ff7f939572149; expires=Thu, 20-Oct-2016 14:52:25 GMT; Max-Age=2592000; path=/; domain=.pixiv.net');
// 			j.setCookie(rcookie, 'http://www.pixiv.net/member.php?id=163551');
// 			request({
// 				url:'http://www.pixiv.net/member.php?id=163551',
// 				headers: {
// 					'Referer': 'http://www.pixiv.net/',
// 					'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.89 Safari/537.36',
// 					// 'cookies': cookies
// 				},
// 				jar: j
// 			}, function(err,res,body){
// 				console.log('err', err);
// 				// console.log('body', body);
//
// 				// console.log('res', res);
// 				// console.log('body', JSON.parse(body));
// 				$ = cheerio.load(body);
// 				var worksIllust = $('.works-illust');
// 				var imageItems = worksIllust.find('._image-items .image-item');
//
// 				console.log('imageItems', imageItems.html());
// 				// console.log('imageItems', JSON.parse(imageItems));
// 				console.log('imageItems', imageItems.length);
// 			});
// 		});
// 	}
// });

var jar = request.jar();
// var cookiesJoin = cookies.join();
// console.log('cookiesJoin', cookiesJoin);
// var rcookie = request.cookie('p_ab_id=8; _ga=GA1.2.2071423881.1474355586; device_token=e7f20a7cb2122d886a6fd2c064fb36ff; a_type=0; is_sensei_service_user=1; login_ever=yes; PHPSESSID=14556077_7436532862f11da0c95adc3ebcf3e5b7; module_orders_mypage=%5B%7B%22name%22%3A%22hot_entries%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22everyone_new_illusts%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22sensei_courses%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22spotlight%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22featured_tags%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22contests%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22following_new_illusts%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22mypixiv_new_illusts%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22booth_follow_items%22%2C%22visible%22%3Atrue%7D%5D; ki_t=1474356283748%3B1474356283748%3B1474359976073%3B1%3B4; ki_r=; __lfcc=1; __utma=235335808.2071423881.1474355586.1474355636.1474359783.2; __utmb=235335808.2.10.1474359783; __utmc=235335808; __utmz=235335808.1474355636.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utmv=235335808.|2=login%20ever=yes=1^3=plan=normal=1^5=gender=male=1^6=user_id=14556077=1');
// var rcookie = request.cookie('PHPSESSID=14556077_bfc492913aeb855b26720d64380a07c5; expires=Thu, 20-Oct-2016 09:29:17 GMT; Max-Age=2592000; path=/; domain=.pixiv.net');
var rcookie = request.cookie('PHPSESSID=16694242_0df8dc83c444ad8749482cb011d6164c; expires=Sun, 25-Dec-2016 17:39:33 GMT; Max-Age=2592000; path=/; domain=.pixiv.net; HttpOnly,device_token=32bb1584795b09f3857d2707c1314b3e; expires=Sun, 25-Dec-2016 17:39:33 GMT; Max-Age=2592000; path=/; domain=.pixiv.net');
jar.setCookie(rcookie, 'http://www.pixiv.net/member_illust.php?id=163551&type=all&p=2');
request({
	url:'http://www.pixiv.net/member_illust.php?id=163551&type=all&p=2',
	headers: {
		'Referer': 'http://www.pixiv.net/',
		'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.89 Safari/537.36',
	},
	jar: jar
}, function(err, res, body){
	console.log('err', err);
	// console.log('body', body);

	// console.log('res', res);
	// console.log('body', JSON.parse(body));
	$ = cheerio.load(body);
	var imageItems = $('._image-items li');
	// var imageItems = worksIllust.find('._image-items .image-item');
	// imageItems.foreach(function(data) {
	// 	console.log('data', data);
	// });
	// console.log('imageItems', imageItems.html());
	// var aHrefId = '56732041';
	async.map(imageItems, function(data, cb) {
		var aHrefId = $(data).find('a').attr('href').split('id=')[1];
		// console.log('aHref', aHrefId);

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
						// console.log('mangaList', mangaList.html());
						var mangaArray = [];
						for (var i = 0; i < mangaList.length; i++) {
							var manga = mangaList.eq(i);
							var mangaUrl = manga.find('img').attr('data-src');
							var len = mangaUrl.split('/');
							var imgName = len[len.length-1];
							console.log('imgName', imgName);
							// var mangaUrl = manga.pixiv.context.images[1];
							// console.log('manga', mangaUrl);
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
						// console.log('imgUrl', imgUrl);
						// return console.log('幹你娘');
						requestUrl(imageUrl, 'manga');
					} else {
						var len = imgUrl.split('/');
						var imgName = len[len.length-1];
						// console.log('imgName', imgName);
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
		// console.log('ret', ret);
		var urlDataArray = [];
		for (var i = 0; i < ret.length; i++) {
			if (ret[i].type === 'manga') {
				for (var a = 0; a < ret[i].mangaArray.length; a++) {
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

		// console.log('urlDataArray', urlDataArray);
		// return console.log('ret', ret);
		imageDown(urlDataArray);

		function imageDown(urlDataArray , time) {
			var tm = time || 1000;
			var d = 1;
			var type = false;
			async.mapLimit(urlDataArray, 1, function(urlData, ck){
				if (urlData === null) {
					return ck(null, null);
				}
				setTimeout(function(){
					console.log('---------------------------------');
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

					// down.encoding('binary');
					down.on('error', function(err){
						type = true;
						console.log('err', err);
						return ck(null, {
							name: urlData.name,
							url: urlData.url});
					});
					down.on('response', function(response) {
							console.log(response.statusCode) // 200
							console.log(response.headers['content-type']) // 'image/png'
							down.pipe(fs.createWriteStream(filename + urlData.name, 'binary'));
							// down.pipe(fs.createWriteStream(filename + urlData.name));
							console.log('下載：', filename + urlData.name);
							console.log('---------------------------------');
							d++;
							down.end();
							return ck(null, null);
					});
				}, tm);
			}, function(err, gty){
				console.log('結束了～');
				console.log('err', err);
				console.log('gty', gty);
				var ar = [];
				for (var i = 0; i < gty.length; i++) {
					gty[i];
					if (gty[i] !== null) {
						ar.push(gty[i]);
					}
				}
				console.log('ar', ar);
				if (type === true) {
					return imageDown(ar, 2000);
				}
			});
		}



		// ret.forEach(function(retData){
		// 	if (retData) {
		// 		// setTimeout(function(){
		// 			// var down = request.get({
		// 			// 	url: retData.url,
		// 			// 	headers: {
		// 			// 		'Referer': 'http://www.pixiv.net/',
		// 			// 		'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.89 Safari/537.36',
		// 			// 		'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
		// 			// 		'base64': 'base64',
		// 			// 		// 'Content-type': 'image/jpg',
		// 			// 	},
		// 			// 	jar: jar
		// 			// });
		//
		// 			// // down.encoding('binary');
		// 			// down.on('error', function(err){
		// 			// 	console.log('err', err);
		// 			// });
		// 			// down.on('response', function(response) {
		// 			// 		console.log('---------------------------------');
		// 			// 		console.log(response.statusCode) // 200
		// 			// 		console.log(response.headers['content-type']) // 'image/png'
		// 			// 		down.pipe(fs.createWriteStream(filename + retData.name, 'binary'));
		// 			// 		console.log('下載：', filename + retData.name);
		// 			// 		console.log('---------------------------------');
		// 			//
		// 			// });
		// 		// }, 2000);
		// 	}
		// });
	});
});
