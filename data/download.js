let debug = require('debug')('debug:data:download');
let async = require('async');
let puppeteer = require('./default_puppeteer');
let _ = require('lodash');
let fs = require('fs');
const filename = `${process.env.fileName}/${process.env.memberId}/`;
let spinner = require('./ora');

let byteFormatter = size => {
	let result
	switch (true) {
		case size === null || size === '' || isNaN(size):
			result = '-'
			break
		case size >= 0 && size < 1024:
			result = size + ' B'
			break
		case size >= 1024 && size < Math.pow(1024, 2):
			result = Math.round((size / 1024) * 100) / 100 + ' K'
			break

		case size >= Math.pow(1024, 2) && size < Math.pow(1024, 3):
			result = Math.round((size / Math.pow(1024, 2)) * 100) / 100 + ' M'
			break
		case size >= Math.pow(1024, 3) && size < Math.pow(1024, 4):
			result = Math.round((size / Math.pow(1024, 3)) * 100) / 100 + ' G'
			break
		default:
			result = Math.round((size / Math.pow(1024, 4)) * 100) / 100 + ' T'
	}
	return result
}

module.exports = (url, page_i) => {
	return new Promise((resolve, reject) => {
		let page = puppeteer.pageArray()[page_i];
		spinner.start().text = `${process.env.spinnerText} 網址： ${url} 開始下載檔案... `;

		// 取得檔案名稱
		let urls = url.split('/');
		let imageName = urls[urls.length - 1];

		// 回傳狀態資料
		let obj = {
			status: '處理中...',
			url: url,
			name: imageName
		}

		// 判斷檔案是否存在
		if (fs.existsSync(`${filename}/${imageName}`)) {
			obj.status = '檔案已存在'
			spinner.start().text = `序列 ： ${process.env.pageImages}   狀態： ${obj.status} 檔案位置： ${filename + imageName} 網址： ${url} `;
			spinner.succeed();
			return resolve(obj);
		}

		async.retry({
			times: 100,
			interval: 10
		}, async (cb) => {
			try {
				// // 下載方式 2
				// 	let responses = null;
				// 	await page.on('response', async resp => {
				// 		if (!!~resp.url().indexOf('pximg') == true) {
				// 			responses = resp;
				// 		}
				// 	});
				// 	await page.on('load', async () => {
				// 		if (responses != null && responses.url().toString() == url.toString()) {
				// 			const headers = await responses.headers();
				// 			const buffer = await responses.buffer();
				// 			await fs.writeFileSync(filename + imageName, buffer);
				// 			obj.status = '已下載完成'
				// 			obj.size = byteFormatter(headers['content-length'])
				// 			spinner.start().text = `下載方式 ： 2 狀態： ${obj.status} 大小： ${obj.size} 位置： ${filename + imageName} 網址： ${url} `;
				// 			spinner.succeed();
				// 			return resolve(obj);
				// 		}
				// 	});

				// 加大限制
				await page._client.send('Network.enable', {
					maxResourceBufferSize: 1024 * 1204 * 100,
					maxTotalBufferSize: 1024 * 1204 * 200,
				})

				let image_page = await page.goto(url, {
					waitUntil: 'networkidle2'
				});

				const buffer = await image_page.buffer();
				await fs.writeFileSync(filename + imageName, await buffer, 'binary');
				obj.status = '已下載完成'
				obj.size = byteFormatter(Buffer.byteLength(buffer, 'binary'))
				spinner.start().text = `序列 ： ${process.env.pageImages}   狀態： ${obj.status} 大小： ${obj.size} 位置： ${filename + imageName} 網址： ${url} `;
				spinner.succeed();
				return resolve(obj);
			} catch (error) {
				debug('下載錯誤', error);
				return cb(error);
			}
		}, (err, ret) => {
			obj.status = '下載失敗'
			spinner.start().text = `序列 ： ${process.env.pageImages}   狀態： ${obj.status} 檔案位置： ${filename + imageName} 網址： ${url} `;
			spinner.succeed();
			return resolve(obj);
		})
	});
};