let debug = require('debug')('debug:data:image');
let async = require('async');
let puppeteer = require('./default_puppeteer');
let download = require('./download');
let spinner = require('./ora');

module.exports = async (url, page_i) => {
	return new Promise(async (resolve, reject) => {
		spinner.start().text = `${process.env.spinnerText} 處理中... `;
		let page = puppeteer.pageArray()[page_i];
		await page.goto(url, {
			waitUntil: 'networkidle2'
		});

		// 取得圖片原始檔列表
		let images = await page.$$eval('#main > section > div > a', el => el.map(val => val.href));

		let image_i = 1;
		async.mapLimit(images, 1, async (image, cb) => {
			spinner.start().text = `${process.env.spinnerText} 第 ${image_i} 組圖 `;
			await page.waitFor(1000);

			await page.goto(image, {
				waitUntil: 'networkidle2'
			});

			// 取得下載 url
			let imageUrl = await page.$eval('body > img', el => el.src);

			// 執行下載
			let image_download = await download(imageUrl, page_i)

			// 設定當前累積作品數
			if (image_i > 1) process.env.pageImages++;

			image_i++;
			return cb(null, image_download)
		}, (err, ret) => {
			return resolve(ret);
		})
	});
};