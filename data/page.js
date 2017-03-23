var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var jar = request.jar();

module.exports = {
	pageList: (url, cookie, spinner) => {
		return new Promise((resolve, reject) => {
			spinner.start().text = '解析頁數網址 --- 處理中...';
			var urlList = new Array();
			jar.setCookie(cookie, url);
			async.forever(function(callback) {
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
					if (!err && res.statusCode == 200) {
						urlList.push(url);
						$ = cheerio.load(body);
						var next = $('.column-order-menu .pager-container .next').find('a').attr('href');
						if (next === undefined) {
							return callback(true, url);
						} else {
							url = 'http://www.pixiv.net/member_illust.php' + next;
							return callback(null, url);
						}
					}
				});
			}, function(err, n) {
				spinner.start().text = '解析頁數網址 --- 完成 --- 頁數 --- ' + urlList.length;
				spinner.succeed();
				return resolve(urlList);
			});
		});
	}
};
