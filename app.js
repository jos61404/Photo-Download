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
//
//
//






var j = request.jar();
// var cookiesJoin = cookies.join();
// console.log('cookiesJoin', cookiesJoin);
// var rcookie = request.cookie('p_ab_id=8; _ga=GA1.2.2071423881.1474355586; device_token=e7f20a7cb2122d886a6fd2c064fb36ff; a_type=0; is_sensei_service_user=1; login_ever=yes; PHPSESSID=14556077_7436532862f11da0c95adc3ebcf3e5b7; module_orders_mypage=%5B%7B%22name%22%3A%22hot_entries%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22everyone_new_illusts%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22sensei_courses%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22spotlight%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22featured_tags%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22contests%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22following_new_illusts%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22mypixiv_new_illusts%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22booth_follow_items%22%2C%22visible%22%3Atrue%7D%5D; ki_t=1474356283748%3B1474356283748%3B1474359976073%3B1%3B4; ki_r=; __lfcc=1; __utma=235335808.2071423881.1474355586.1474355636.1474359783.2; __utmb=235335808.2.10.1474359783; __utmc=235335808; __utmz=235335808.1474355636.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utmv=235335808.|2=login%20ever=yes=1^3=plan=normal=1^5=gender=male=1^6=user_id=14556077=1');
// var rcookie = request.cookie('PHPSESSID=14556077_bfc492913aeb855b26720d64380a07c5; expires=Thu, 20-Oct-2016 09:29:17 GMT; Max-Age=2592000; path=/; domain=.pixiv.net');
var rcookie = request.cookie('PHPSESSID=16694242_026bdfc53325bf00d1b200fe91444ad9; expires=Thu, 20-Oct-2016 14:57:30 GMT; Max-Age=2592000; path=/; domain=.pixiv.net,device_token=015dc43c0dd1eed90f0c5d11d6bc269d; expires=Thu, 20-Oct-2016 14:57:30 GMT; Max-Age=2592000; path=/; domain=.pixiv.net');
j.setCookie(rcookie, 'http://www.pixiv.net/member_illust.php?id=163551&type=all&p=2');
request({
	url:'http://www.pixiv.net/member_illust.php?id=163551&type=all&p=2',
	headers: {
		'Referer': 'http://www.pixiv.net/',
		'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.89 Safari/537.36',
	},
	jar: j
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
		console.log('aHref', aHrefId);

		var imageUrl = 'http://www.pixiv.net/member_illust.php?mode=medium&illust_id=' + aHrefId;
		request({
			url: imageUrl,
			headers: {
				'Referer': 'http://www.pixiv.net/',
				'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.89 Safari/537.36',
				// 'cookies': cookies
			},
			jar: j
		},function (error, response, body){
			if (!error && response.statusCode == 200) {
				$ = cheerio.load(body);
				var illust = $('._illust_modal');
				// console.log('illust', illust);
				var imgUrl = illust.find('img').attr('data-src');
				var imgName = illust.find('img').attr('alt');
				console.log('imgUrl', imgUrl);
				if (!imgUrl) {
					return console.log('幹你娘');
				}
				var len = imgUrl.split('/');
				var imgName = len[len.length-1];
				// console.log('imgName', imgName);
				var data = {
					url: imgUrl,
					name: imgName
				};
				cb(null, data);

			}
		});
	}, function(err, ret){
		// console.log('ret', ret);
		ret.forEach(function(retData){

			var down = request({
				url: retData.url,
				headers: {
					'Referer': 'http://www.pixiv.net/',
					'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.89 Safari/537.36',
				},
				jar: j
			});
			down.on('error', function(err){
				console.log('err', err);
			});
			down.pipe(fs.createWriteStream(filename + retData.name));

			// var download = wget.download(retData.url, filename + retData.name, {
			// 	headers: {
			// 		'Referer': 'http://www.pixiv.net/',
			// 		'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.89 Safari/537.36',
			// 	},
			// 	jar: j
			// });
			// download.on('error', function(err) {
			//     console.log('err', err);
			//
			// });
			// download.on('end', function(output) {
			//     console.log('output', output);
			// });
			// download.on('progress', function(progress) {
			// 	// console.log('progress', progress);
			//     // code to show progress bar
			// });


		});
	});
});
























// // 單一照片ID
// var illust_id = 53374756;
//

//
// var url = 'http://www.pixiv.net/member_illust.php?mode=medium&illust_id='+ illust_id;
// request(url, function (error, response, body) {
// 	if (!error && response.statusCode == 200) {
//
// 		// 開頭---下載處理
//     	$ = cheerio.load(body);
// 		var wrapper = $('#wrapper');
// 		var newindex = wrapper.find('.newindex .newindex-inner .newindex-bg-container .cool-work .cool-work-main');
// 		var imgcontainer = newindex.find('.img-container');
// 		var img = imgcontainer.find('img').attr('src');
// 		// 檔案名字讀取
//     	var name = path.basename(img);
//
//     	// 字串分割
// 		var imgurl = img.split("/");
// 		var imgname = imgurl[13].split("_");
// 		var imagename = imgname[0] + "_" + imgname[1] + ".png" ;
// 		var imagenamejpg = imgname[0] + "_" + imgname[1] + ".jpg" ;
// 		var imageurl = "http://" + imgurl[2] + "/img-original/img/" + imgurl[7] + "/" + imgurl[8] + "/" + imgurl[9] + "/" + imgurl[10] + "/" + imgurl[11] + "/" + imgurl[12] + "/" + imagename;
// 		var imageurljpg = "http://" + imgurl[2] + "/img-original/img/" + imgurl[7] + "/" + imgurl[8] + "/" + imgurl[9] + "/" + imgurl[10] + "/" + imgurl[11] + "/" + imgurl[12] + "/" + imagenamejpg;
//
//     	// var list = {
//     	// 	name: name,
//     	// 	url:url,
//     	// 	img:img,
//     	// 	imagename:imagename,
//     	// 	imageurl:imageurl,
//     	// 	imagenamejpg:imagenamejpg,
//     	// 	imageurljpg:imageurljpg
//     	// };
//
// 		// 呼叫下載
// 		// console.log('圖片網址list：', list);
// 		// download(list);
//
// 		// 呼叫arry處理
// 		arrypage(wrapper);
// 	}
// });
//
//
// // 單一頁面解析
// function onepage(arryurl){
//
// 	var a = 0;
// 	var imagelist = new Array();
// 	// console.log('單一解析：', arryurl);
//
// 	async.each(arryurl,function(topic, callback) {
//
// 		request(topic, function (error, response, body) {
// 			if (!error && response.statusCode == 200) {
//
// 				// 開頭---下載處理
// 		    	$ = cheerio.load(body);
// 				var wrapper = $('#wrapper');
// 				var newindex = wrapper.find('.newindex .newindex-inner .newindex-bg-container .cool-work .cool-work-main');
// 				var imgcontainer = newindex.find('.img-container');
// 				var img = imgcontainer.find('img').attr('src');
// 				// 檔案名字讀取
// 		    	var name = path.basename(img);
//
// 		    	// 字串分割
// 				var imgurl = img.split("/");
// 				var imgname = imgurl[13].split("_");
// 				var imagename = imgname[0] + "_p0"  + ".png" ;
// 				var imagenamejpg = imgname[0] + "_" + imgname[1] + ".jpg" ;
// 				var imageurl = "http://" + imgurl[2] + "/img-original/img/" + imgurl[7] + "/" + imgurl[8] + "/" + imgurl[9] + "/" + imgurl[10] + "/" + imgurl[11] + "/" + imgurl[12] + "/" + imagename;
// 				var imageurljpg = "http://" + imgurl[2] + "/img-original/img/" + imgurl[7] + "/" + imgurl[8] + "/" + imgurl[9] + "/" + imgurl[10] + "/" + imgurl[11] + "/" + imgurl[12] + "/" + imagenamejpg;
//
// 		    	// 呼叫下載
// 		    	var list = {
// 		    		id: a,
// 		    		url:topic,
//  		    		name: name,
// 		    		img:img,
// 		    		imagename:imagename,
// 		    		imageurl:imageurl,
// 		    		imagenamejpg:imagenamejpg,
// 		    		imageurljpg:imageurljpg
// 		    	};
//
// 				// console.log('圖片網址list：', list);
// 				download(list);
// 				// imagelist[a] = list;
// 				// console.log('A數值：', a);
// 				// console.log('圖片網址：', imagelist);
//
// 				if (a == 11){
// 					callback(imagelist);
// 				}
// 		    	a++;
//
// 				// 呼叫arry處理 此處開啟迴圈
// 				// console.log('迴圈網址： ', wrapper);
// 				// arrypage(wrapper);
// 			}
// 		});
// 	},function(list){
// 		// console.log('圖片網址：', list[1].img);
// 		// download(list);
// 	});
// }
//
//
// // 執行下載動作
// function download(list){
// 	var index = list;
// 	var	id = index.id;
// 	var name = index.name;
// 	var img = index.img;
// 	var	imagename = index.imagename;
// 	var	imageurl = index.imageurl;
// 	var	url = index.url;
// 	var	imagenamejpg = index.imagenamejpg;
// 	var	imageurljpg = index.imageurljpg;
//
// 	// console.log('原始地址： ', imageurl);
//
// 	async.series({
// 		a: function(callback){
// 			var downa = wget.download(img,filename+name);
// 			downa.on('error', function(err){
// 				// console.log('err', err);
// 				callback(null, err);
// 			});
// 			downa.on('progress', function(progress){
// 				if(progress == 1){
// 					downa.on('end', function(output){
// 						console.log('結果：', output);
// 						callback(null, progress);
// 					});
// 					// console.log('進度條： 100% ');
// 				}
// 			});
// 		},
// 		b: function(callback){
// 			var downc = wget.download(imageurljpg,filename+imagenamejpg);
// 			downc.on('error', function(err){
// 				// console.log('第三err', err);
// 				callback(null, err);
// 			});
// 			downc.on('progress', function(progress){
// 				if(progress == 1){
// 					downc.on('end', function(output){
// 						console.log('第二結果：', output);
// 						callback(null, progress);
// 					});
// 					// console.log('第三進度條： 100% ');
// 				}
// 			});
// 		},
// 		c: function(callback){
// 			var downb = wget.download(imageurl,filename+imagename);
// 			downb.on('error', function(err){
// 				// console.log('第二err', err);
// 				callback(null, err);
// 			});
// 			downb.on('progress', function(progress){
// 				if(progress == 1){
// 					downb.on('end', function(output){
// 						console.log('第三結果：', output);
// 						callback(null, progress);
// 					});
// 					// console.log('第二進度條： 100% ');
// 				}
// 			});
// 		}
// 	},function(err,res){
// 		// console.log('最後的ＥＲＲ： ', err);
// 		console.log('最後的ＲＥＳ： ', res);
// 	});
//
// 	// request(img).pipe(fs.createWriteStream(filename+name));
// 	// console.log('原始圖片來源: ', img);
//
// 	// request(imageurl).pipe(fs.createWriteStream(filename+imagename));
// 	// console.log('放大圖片來源:', imageurl);
//
// 	// request(imageurljpg).pipe(fs.createWriteStream('images/'+ imagenamejpg));
// 	// console.log('放大圖片來源jpg:', imageurljpg);
//
// }
//
// // arry處理
// function arrypage(wrapper){
// 		var arryurl = new Array();
// 		var coolworksub = wrapper.find('.newindex .newindex-inner .newindex-bg-container .cool-work .cool-work-sub');
// 		var works = coolworksub.find('.works');
// 		var ul = works.find('ul');
// 		var li = ul.find('li');
// 		for (var i = 0; i <= li.length-1; i++) {
// 			var workurl = li.eq(i).find('a').attr('href');
// 			arryurl[i] = 'http://www.pixiv.net/' + workurl;
// 		};
// 		onepage(arryurl);
// }
