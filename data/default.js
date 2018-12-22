const debug = require('debug')('debug:data:default');
let fs = require('fs');
let config = require('../config');
let spinner = require('./ora');

module.exports = () => {
	return new Promise((resolve, reject) => {
		spinner.start().text = '初始化...';

		// 開啟分頁數
		process.env.pageLength = process.env.pageLength || config.pageLength;

		// 判斷有無輸入 畫師 Id
		let memberId = process.env.memberId = process.env.memberId || config.memberId;
		if (memberId == null) {
			spinner.start().text = '請輸入畫師 Id，可用 memberId';
			spinner.fail();
			return reject();
		} else {
			spinner.start().text = `畫師 Id： ${memberId}`;
			spinner.succeed();
		}

		// 判斷有無輸入 檔案目錄
		let file_name = process.env.fileName = process.env.fileName || config.fileName;
		if (file_name == null) {
			spinner.start().text = '請設定檔案目錄，可用 fileName';
			spinner.fail();
			return reject();
		} else {
			spinner.start().text = `檔案目錄 ： ${file_name}`;
			spinner.succeed();
		}

		// 判斷有無輸入 使用者帳號
		let loginName = process.env.loginName = process.env.loginName || config.loginName;
		if (loginName == null) {
			spinner.start().text = '請設定使用者帳號，可用 loginName';
			spinner.fail();
			return reject();
		} else {
			spinner.start().text = `使用者帳號 ： ${loginName}`;
			spinner.succeed();
		}

		// 判斷有無輸入 使用者密碼
		let loginPassword = process.env.loginPassword = process.env.loginPassword || config.loginPassword;
		if (loginPassword == null) {
			spinner.start().text = '請設定使用者密碼，可用 loginPassword';
			spinner.fail();
			return reject();
		} else {
			spinner.start().text = `使用者密碼 ： ${loginPassword}`;
			spinner.succeed();
		}

		// 檢查 下載資料夾
		spinner.start().text = `檔案： ${file_name} 查詢`;
		if (!fs.existsSync(file_name)) {
			spinner.start().text = `檔案： ${file_name} 建立中...`;
			fs.mkdirSync(file_name, 0777);
			spinner.start().text = `檔案： ${file_name} 建立完成`;
			spinner.succeed();
		} else {
			spinner.start().text = `檔案： ${file_name} 已存在`;
			spinner.succeed();
		}

		// 檢查 畫師下載資料夾
		const download_file_name = `${file_name}/${memberId}/`;
		spinner.start().text = `檔案： ${download_file_name} 查詢`;
		if (!fs.existsSync(download_file_name)) {
			spinner.start().text = `檔案： ${download_file_name} 建立中...`;
			fs.mkdirSync(download_file_name, 0777);
			spinner.start().text = `檔案： ${download_file_name} 建立完成`;
			spinner.succeed();
		} else {
			spinner.start().text = `檔案： ${download_file_name} 已存在`;
			spinner.succeed();
		}

		// 檢查 log 資料夾
		spinner.start().text = `檔案： log 查詢`;
		if (!fs.existsSync('log')) {
			spinner.start().text = `檔案： log 建立中...`;
			fs.mkdirSync('log', 0777);
			spinner.start().text = `檔案： log 建立完成`;
			spinner.succeed();
		} else {
			spinner.start().text = `檔案： log 已存在`;
			spinner.succeed();
		}

		// 檢查 cookie 檔案
		spinner.start().text = `檔案： cookie.json 查詢`;
		if (!fs.existsSync('cookie.json')) {
			spinner.start().text = `檔案： cookie.json 建立中...`;
			fs.writeFileSync('cookie.json', 'null', 'utf8');
			spinner.start().text = `檔案： cookie.json 建立完成`;
			spinner.succeed();
		} else {
			spinner.start().text = `檔案： cookie.json 已存在`;
			spinner.succeed();
		}

		return resolve();
	});
}