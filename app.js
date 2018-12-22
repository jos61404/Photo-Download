let debug = require('debug')('debug:app');
let fs = require('fs');
let moment = require('moment');

let obj = {
	default: require('./data/default'),
	default_puppeteer: require('./data/default_puppeteer'),
	login: require('./data/login'),
	page: require('./data/page'),
	default: require('./data/default'),
	works: require('./data/works'),
	image: require('./data/image'),
	download: require('./data/download'),
};

(async () => {
	try {
		// 資料初始化
		await obj.default();

		// 初始化瀏覽器
		await obj.default_puppeteer.init();
		let puppeteer_browser = await obj.default_puppeteer.browser();
		let puppeteer_pageArray = await obj.default_puppeteer.pageArray();
		await puppeteer_pageArray[0].goto('https://www.pixiv.net', {
			waitUntil: 'networkidle2'
		});

		// 啟動登入
		await obj.login();

		// 解析頁面並下載
		let pageList = await obj.page();

		// 儲存下載資訊
		fs.writeFileSync(`log/${moment().format('YYYYMMDD_HHmmss')}.json`, JSON.stringify(pageList), 'utf8');

		return await puppeteer_browser.close();
	} catch (error) {
		return debug('錯誤訊息 ：', error);
	}
})()