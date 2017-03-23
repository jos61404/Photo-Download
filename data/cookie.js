var cookieData = require('../cookie');
var request = require('request');
var jsonfile = require('jsonfile');
var cheerio = require('cheerio');
var config = require('../config');
module.exports = {
	findCookie: () => {
		return new Promise((resolve, reject) => {
			if (cookieData == null) {
				request('https://accounts.pixiv.net/login?lang=zh_tw&source=pc&view_type=page&ref=wwwtop_accounts_index', (error, response, body) => {
					if (!error && response.statusCode == 200) {
						var dataForm = {};
						var cookie = response.headers["set-cookie"].join();
						$ = cheerio.load(body);
						var login = $('#old-login form');
						var formArray = login.serializeArray();
						var form = login.find('input');

						for (var i = 0; i < form.length; i++) {
							var formData = form[i].attribs;
							dataForm[formData.name] = formData.value;
						}

						var loginDiv = login.find('div div').find('input');
						var loginId = loginDiv.eq(0)[0].attribs.name;
						var loginPassword = loginDiv.eq(1)[0].attribs.name;
						dataForm[loginId] = config.loginId;
						dataForm[loginPassword] = config.loginPassword;

						request.post({
							url: 'https://accounts.pixiv.net/api/login?lang=zh_tw',
							headers: {
								"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.89 Safari/537.36",
								"Host": "accounts.pixiv.net",
								"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
								"Accept": "application/json, text/javascript, */*; q=0.01",
								"Accept-Language": "zh-TW,zh;q=0.8,en-US;q=0.6,en;q=0.4",
								"Cache-Control": "no-cache",
								"Connection": "Keep-Alive",
								"Referer": "https://accounts.pixiv.net/login?return_to=http%3A%2F%2Fwww.pixiv.net%2F&lang=zh_tw&source=accounts&view_type=page&ref=",
								"Cookie": cookie
							},
							form: dataForm
						}, (err, textStatus, xhr) => {
							if (JSON.parse(xhr).body.validation_errors) {
								return reject('錯誤訊息： ', JSON.parse(xhr).body.validation_errors);
							}

							textStatus.setEncoding("utf8");
							var cookies = textStatus.headers["set-cookie"];
							var cookiesJoin = cookies.join();
							jsonfile.writeFileSync('Cookie.json', cookiesJoin);
							var rcookie = request.cookie(cookiesJoin);
							return resolve(rcookie);
						});
					}
				});
			} else {
				var rcookie = request.cookie(cookieData);
				return resolve(rcookie);
			}
		});
	}
};
