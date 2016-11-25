var fs = require('fs');
var path = require('path');
var async = require('async');
var request = require('request');
var cheerio = require('cheerio');
var wget = require('wget');
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
var rcookie = request.cookie('PHPSESSID=16694242_974b0877e6a78c8c4394a4a2bc1b4f67; expires=Tue, 20-Dec-2016 01:21:19 GMT; Max-Age=2592000; path=/; domain=.pixiv.net; HttpOnly,device_token=c347c4c211c13b1e54865fc457450897; expires=Tue, 20-Dec-2016 01:21:19 GMT; Max-Age=2592000; path=/; domain=.pixiv.net');
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
		request({
			url: imageUrl,
			headers: {
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
				'Referer': 'http://www.pixiv.net/',
				'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.89 Safari/537.36',
				// 'cookies': cookies
			},
			jar: jar
		},function (error, response, body){
			if (!error && response.statusCode == 200) {
				$ = cheerio.load(body);
				var illust = $('._illust_modal');
				// console.log('illust', illust);
				var imgUrl = illust.find('img').attr('data-src');
				var imgName = illust.find('img').attr('alt');
				// console.log('imgUrl', imgUrl);
				if (!imgUrl) {
					// return console.log('幹你娘');
					cb(null, false);
				}else {
					var len = imgUrl.split('/');
					var imgName = len[len.length-1];
					// console.log('imgName', imgName);
					var data = {
						url: imgUrl,
						name: imgName
					};
					cb(null, data);
				}


			}
		});
	}, function(err, ret){
		// console.log('ret', ret);

		return console.log('ret', ret);

		ret.forEach(function(retData){
			if (retData) {
				// setTimeout(function(){
					// var down = request.get({
					// 	url: retData.url,
					// 	headers: {
					// 		'Referer': 'http://www.pixiv.net/',
					// 		'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.89 Safari/537.36',
					// 		'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
					// 		'base64': 'base64',
					// 		// 'Content-type': 'image/jpg',
					// 	},
					// 	jar: jar
					// });

					// // down.encoding('binary');
					// down.on('error', function(err){
					// 	console.log('err', err);
					// });
					// down.on('response', function(response) {
					// 		console.log('---------------------------------');
					// 		console.log(response.statusCode) // 200
					// 		console.log(response.headers['content-type']) // 'image/png'
					// 		down.pipe(fs.createWriteStream(filename + retData.name, 'binary'));
					// 		console.log('下載：', filename + retData.name);
					// 		console.log('---------------------------------');
					//
					// });
				// }, 2000);
			}
		});
	});
});
