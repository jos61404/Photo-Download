var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var fs = require('fs');
var config = require('../config');
var viewType = config.viewType;
var memberId = process.env.NODE_ENV || config.memberId;
var filename = config.fileName + memberId + '/';
var jar = request.jar();

module.exports = {
	imageDownload: (urlDataArray, cookie, spinner) => {
		return new Promise((resolve, reject) => {
			var tm = config.downloadTime;
			var d = 0;
			var type = false;
			async.mapLimit(urlDataArray, 1, (urlData, ck) => {
				if (urlData === null) {
					return ck(null, null);
				}

				if (fs.existsSync(filename + urlData.name)) {
					d++;
					spinner.start().text = '剩餘數量： ' + (urlDataArray.length - d) + ' | 檔案名稱：' + urlData.name + ' | 檔案已存在';
					spinner.succeed();
					return ck(null, null);
				}

				var retry = true;
				var retryData = 1;
				async.retry({
					times: 100,
					interval: config.downloadTimeRetry
				}, (cb, result) => {
					setTimeout(() => {
						var startTime = Date.now();
						var down = request({
							url: urlData.url,
							headers: {
								'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36',
								'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
								'Accept-Ranges': 'bytes',
								'Referer': urlData.url,
								'Accept-Encoding': 'gzip, deflate, sdch',
								'Accept-Language': 'zh-TW,zh;q=0.8,en-US;q=0.6,en;q=0.4',
								'Cache-Control': 'no-cache',
								'Connection': 'keep-alive',
								'Upgrade-Insecure-Requests': '1'
							},
							jar: jar,
							encoding: 'binary'
						});

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

						down.on('error', (err) => {
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

						down.on('response', (response) => {
							down.pipe(fs.createWriteStream(filename + urlData.name, 'binary'));
							var endTime = Date.now();
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

					}, tm);
				}, (err, result) => {
					ck(null, {
						name: urlData.name,
						url: urlData.url
					});
				});
			}, (err, gty) => {
				var ar = [];
				for (var i = 0; i < gty.length; i++) {
					gty[i];
					if (gty[i] !== null) {
						ar.push(gty[i]);
					}
				}
				if (type === true) {
					console.log('資料：', ar);
					return resolve('下載未完成');
				}
				return resolve('下載已結束～');
			});
		});
	}
};
