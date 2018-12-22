const debug = require('debug')('debug:data:works');
const puppeteer = require('./default_puppeteer');
const image = require('./image');
const download = require('./download');
let spinner = require('./ora');

module.exports = async (url, page_i) => {
	spinner.start().text = process.env.spinnerText;
	let page = puppeteer.pageArray()[page_i];
	await page.goto(url, {
		waitUntil: 'networkidle2'
	});

	// 取得圖片連結
	let imageUrl = await page.$eval('#root ._3NOStiW .CAqyN6E div[role="presentation"] a', el => el.href);

	if (!!~imageUrl.indexOf('pximg') == true) {
		// 點擊放大圖片
		await page.bringToFront(); // 跳到該分頁
		await page.click('#root ._3NOStiW .CAqyN6E div[role="presentation"] a');

		spinner.start().text = process.env.spinnerText = `${process.env.spinnerText} 單一圖片處理`;
		return await download(imageUrl, page_i);
	} else {
		spinner.start().text = process.env.spinnerText = `${process.env.spinnerText} 多圖片處理`;
		return await image(imageUrl, page_i);
	}
}