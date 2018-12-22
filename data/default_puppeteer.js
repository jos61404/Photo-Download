let debug = require('debug')('debug:data:default_puppeteer');
const puppeteer = require('puppeteer');
let browser = null;
let pageArray = [];

let init = async () => {
	debug('初始化頁面');
	browser = await puppeteer.launch({
		// headless: false, // 開啟瀏覽器
		// devtools: true, // 開啟開發者工具
		// executablePath: '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome', // 設定自己的瀏覽器路徑
		args: [
			'--no-sandbox',
			'--disable-setuid-sandbox',
		],
	});

	for (let i = 0; i < process.env.pageLength; i++) {
		pageArray[i] = await browser.newPage();
	}
	return;
}

module.exports = {
	pageArray: () => pageArray,
	browser: () => browser,
	init: init
};;