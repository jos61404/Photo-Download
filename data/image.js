var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var jar = request.jar();

module.exports = {
	imageList: (listUrlArray, cookie, spinner) => {
		return new Promise((resolve, reject) => {
			spinner.start().text = '解析圖片原始地址 --- 處理中...';
			var k = 0;
			async.mapLimit(listUrlArray, 1, (url, cb) => {
				k++;
				spinner.start().text = '解析圖片原始地址 --- 處理中... --- 第 --- ' + k;
				async.waterfall([
					// 判斷處理類型
					(callback) => {
						jar.setCookie(cookie, url);
						request({
							url: url,
							headers: {
								'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
								'Accept-Language': 'zh-TW,zh;q=0.8,en-US;q=0.6,en;q=0.4',
								'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.89 Safari/537.36',
								'Referer': url
							},
							jar: jar
						}, (error, response, body) => {
							if (!error && response.statusCode == 200) {
								$ = cheerio.load(body);
								var illust = $('._illust_modal');
								var imgUrl = illust.find('img').attr('data-src');

								if (imgUrl) {
									return callback(null, 'url', illust);
								} else {
									return callback(null, 'manga', illust);
								}
							} else {
								return callback(true, 'err');
							}
						});
					},
					//處理普通URL
					(type, data, callback) => {
						if (type != 'url') {
							return callback(null, type, data);
						}
						var imgUrl = data.find('img').attr('data-src');
						var imgName = data.find('img').attr('alt');
						var len = imgUrl.split('/');
						var imgName = len[len.length - 1];
						var ret = {
							type: 'url',
							url: imgUrl,
							name: imgName
						};
						return callback(null, type, ret);
					},
					//處理多圖URL_1
					(type, data, callback) => {
						if (type != 'manga') {
							return callback(null, type, data);
						}
						var aHrefId = url.split('id=')[1];
						var imageUrl = 'http://www.pixiv.net/member_illust.php?mode=manga&illust_id=' + aHrefId;
						jar.setCookie(cookie, imageUrl);
						request({
							url: imageUrl,
							headers: {
								'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
								'Accept-Language': 'zh-TW,zh;q=0.8,en-US;q=0.6,en;q=0.4',
								'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.89 Safari/537.36',
								'Referer': imageUrl
							},
							jar: jar
						}, (error, response, body) => {
							if (!error && response.statusCode == 200) {
								$ = cheerio.load(body);
								var mangaList = $('#main .manga .item-container');
								var mangaArray = [];
								for (var i = 0; i < mangaList.length; i++) {
									var manga = mangaList.eq(i);
									var mangaUrl = manga.find('a').attr('href');
									mangaArray.push('http://www.pixiv.net' + mangaUrl);
								}
								return callback(null, 'manga', mangaArray);
							} else {
								return callback(true, 'err');
							}
						});
					},
					// 多圖處理_2
					(type, data, callback) => {
						if (type != 'manga') {
							return callback(null, data);
						}
						async.mapLimit(data, 1, (url, urlcb) => {
							jar.setCookie(cookie, url);
							request({
								url: url,
								headers: {
									'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
									'Accept-Language': 'zh-TW,zh;q=0.8,en-US;q=0.6,en;q=0.4',
									'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.89 Safari/537.36',
									'Referer': url
								},
								jar: jar
							}, (error, response, body) => {
								if (!error && response.statusCode == 200) {
									$ = cheerio.load(body);
									var illust = $('img');
									var imgUrl = illust.attr('src');
									var len = imgUrl.split('/');
									var imgName = len[len.length - 1];
									return urlcb(null, {
										name: imgName,
										url: imgUrl
									});
								} else {
									return urlcb(true, 'err');
								}
							});
						}, (err, results) => {
							var ret = {
								type: 'manga',
								mangaArray: results
							}
							return callback(null, ret);
						});
					}
				], (err, result) => {
					return cb(null, result);
				});
			}, (err, ret) => {
				var urlDataArray = [];
				for (var i = 0; i < ret.length; i++) {
					if (ret[i] !== null) {
						if (ret[i].type === 'manga') {
							for (var a = 0; a < ret[i].mangaArray.length; a++) {
								var manga = ret[i].mangaArray[a];
								urlDataArray.push({url: manga.url, name: manga.name});
							}
						} else if (ret[i].type === 'url') {
							urlDataArray.push({url: ret[i].url, name: ret[i].name});
						}
					}
				}
				spinner.start().text = '解析圖片原始地址 --- 完成 --- 圖片數 ---' + urlDataArray.length;
				spinner.succeed();
				return resolve(urlDataArray);
			});
		});
	}
};
