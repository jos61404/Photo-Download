let debug = require('debug')('debug:data:login');
let puppeteer = require('./default_puppeteer');
let spinner = require('./ora');
let fs = require('fs');

module.exports = () => {
    return new Promise(async (resolve, reject) => {
        let cookieData = require('../cookie');
        const page = puppeteer.pageArray()[0];
        spinner.start().text = '登入中...';

        const loginName = process.env.loginName;
        const loginPassword = process.env.loginPassword;
        if (loginName == null) {
            spinner.start().text = '請設定使用者帳號，可用 loginName';
            spinner.fail();
            return reject();
        }
        if (loginPassword == null) {
            spinner.start().text = '請設定使用者密碼，可用 loginPassword';
            spinner.fail();
            return reject();
        }

        if (cookieData == null) {
            // 轉址
            await page.goto('https://accounts.pixiv.net/login?lang=zh_tw&source=pc&view_type=page&ref=wwwtop_accounts_index', {
                waitUntil: 'networkidle2'
            });

            // 輸入登入資料
            await page.bringToFront(); // 跳到該分頁
            await page.type('#LoginComponent > form > div.input-field-group > div:nth-child(1) > input[type="text"]', loginName);
            await page.type('#LoginComponent > form > div.input-field-group > div:nth-child(2) > input[type="password"]', loginPassword);
            await page.click('#LoginComponent > form > button');
            await page.waitForNavigation({
                waitUntil: 'networkidle2'
            });

            // 讀取 cookie 保存
            let cookies = await page.cookies();
            fs.writeFileSync('cookie.json', JSON.stringify(cookies), 'utf8');
            spinner.start().text = '登入完成 --- 已保存 Cookie';
            spinner.succeed();
            return resolve();
        } else {
            // 依照順序加入 cookie
            await Promise.all(cookieData.map(async (val) => {
                return await page.setCookie(val);
            }));
            await page.goto('https://www.pixiv.net/', {
                waitUntil: 'networkidle2'
            });
            spinner.start().text = '登入完成 --- 已讀取 Cookie';
            spinner.succeed();
            return resolve();
        }
    });
}