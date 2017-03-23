var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var jar = request.jar();
var memberImageListData = 1;

module.exports = {
	worksList: (urlArray, cookie, spinner) => {
		return new Promise((resolve, reject) => {
			spinner.start().text = '解析作品網址 --- 處理中...';
			async.mapLimit(urlArray, 1, (url, cbk) => {
				jar.setCookie(cookie, url);
				request({
					url: url,
					headers: {
						'Accept': 'application/json, text/javascript, */*; q=0.01',
						'Accept-Language': 'zh-TW,zh;q=0.8,en-US;q=0.6,en;q=0.4',
						'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36',
						'Referer': url
					},
					jar: jar
				}, (err, res, body) => {
					$ = cheerio.load(body);
					var imageItems = $('._image-items li');
					async.mapLimit(imageItems, 1, (data, cb) => {
						var aHrefId = $(data).find('a').attr('href').split('id=')[1];
						var imageUrl = 'http://www.pixiv.net/member_illust.php?mode=medium&illust_id=' + aHrefId;
						return cb(null, imageUrl);
					}, (err, ret) => {
						return cbk(null, ret);
					});
				});
			}, (err, urlData) => {
				var ary = new Array();
				for (var i = 0; i < urlData.length; i++) {
					var urlAry = urlData[i];
					for (var a = 0; a < urlAry.length; a++) {
						ary.push(urlAry[a]);
					}
				}
				spinner.start().text = '解析作品網址 --- 完成 --- 作品數 --- ' + ary.length;
				spinner.succeed();
				return resolve(ary);
			});
		});
	}
};
