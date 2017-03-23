var fs = require('fs');
var config = require('../config');
var memberId = process.env.NODE_ENV || config.memberId;
var filename = config.fileName + memberId + '/';

if (!fs.existsSync(config.fileName)) {
	fs.mkdirSync(config.fileName, 0777);
}
if (!fs.existsSync(filename)) {
	fs.mkdirSync(filename, 0777);
}
if (!fs.existsSync('cookie.json')) {
	fs.writeFileSync('cookie.json', 'null', 'utf8');
}
if (fs.existsSync(config.fileName) && fs.existsSync(filename)) {
	console.log('下載目錄： 已創建');
}
