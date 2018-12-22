let debug = require('debug')('debug:data:page');
let _ = require('lodash');
let async = require('async');
let puppeteer = require('./default_puppeteer');
let spinner = require('./ora');
let works = require('./works');
const memberId = process.env.memberId;

module.exports = async () => {
	return new Promise((resolve, reject) => {
		spinner.start().text = '處理頁面中...';
		let page = puppeteer.pageArray()[0];
		let url = `https://www.pixiv.net/member_illust.php?id=${memberId}`;
		let urlList = new Array();
		let pageImageMax = null;
		process.env.pageImages = 0; // 累積作品數
		let pageNumber = 0; // 當前頁面數

		async.forever(async (callback) => {
			debug('開啟網址： ', url);

			await page.goto(url, {
				waitUntil: 'networkidle2'
			});
			let spinnerText = '';
			spinner.start().text = spinnerText = `解析頁面： ${url}`;

			// 檢查作品最大數
			if (pageImageMax == null) {
				let pageMax = await page.$eval('#root > div._3NOStiW > div > div.g4R-bsH > div._10zSGz7 > div.gdzJXyP > div.sc-kafWEX.eQrbzD', el => el.innerHTML);
				pageImageMax = parseInt(pageMax);
			}

			// 讀取頁面作品數
			let pageUrls = await page.$$eval('#root > div._3NOStiW > div > div.g4R-bsH > div._10zSGz7 > ul > li > div > div > div > a', el => el.map(val => val.href));

			// 測試用
			// let pageUrls = [
			// 	'https://www.pixiv.net/member_illust.php?mode=medium&illust_id=67862553',
			// 	'https://www.pixiv.net/member_illust.php?mode=medium&illust_id=66342274'
			// ];

			// 設定當前頁數
			pageNumber++;

			// 頁數沒作品直接中止
			if (pageUrls.length == 0) return callback(true);

			let page_i = 1; // 判斷使用哪一個分頁處理
			let imageUrlNumber = 1; // 當前處理頁面的累積數量
			async.mapLimit(pageUrls, 1, async (imageUrl, cb) => {
				process.env.spinnerText = `${spinnerText} 第 ${pageNumber} 頁 第 ${imageUrlNumber} 組圖`;

				// 頁面處理
				let image_works = await works(imageUrl, page_i);

				// 先跳下一個分頁，在判斷超過上限跳回初始值
				page_i++;
				if (page_i >= process.env.pageLength) page_i = 1;

				// 設定當前累積作品數
				process.env.pageImages++;
				imageUrlNumber++;

				return cb(null, image_works);
			}, async (err, ret) => {
				// 處理回傳值，會有 Object或 Array ，需要重新處理
				for (let i = 0; i < ret.length; i++) {
					if (_.isArray(ret[i]) == true) {
						urlList = urlList.concat(ret[i]);
					} else {
						urlList.push(ret[i]);
					}
				}

				// 判斷當前作品數是否小於最大數
				if (process.env.pageImages < pageImageMax) {
					url = await page.$$eval('#root > div._3NOStiW > div > div.g4R-bsH > div._1xhxS-H > a', el => el[el.length - 1].href);
					return callback(null);
				} else {
					return callback(true);
				}
			})
		}, (err) => {
			spinner.start().text = `處理完成 總頁數： ${pageNumber} 總下載： ${process.env.pageImages}`;
			spinner.succeed();
			return resolve(urlList);
		});
	});
};