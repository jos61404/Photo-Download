# Photo-Download

## 版本： v2.0.0

由於喜歡動漫並且也喜歡相關插圖,某一天在網上無聊逛逛看見了**pixiv**,並且發現喜歡的插圖於是就收藏了一番,礙於久了手會有點殘所以就想懶一點,為什麼我不讓他自己來呢？

## 執行環境 :

- Node.js **v8.14.1** （官方網站：<https://nodejs.org/en/>）

## 目前功能 :

- 保存該畫師全部作品

- 預設保存在 **images** (可定義)

- 設定檔全部可用 **env** 設定

- 自動判斷 (**檔案** / **資料夾**) 是否存在，如不存在自動建立

- 顯示瀏覽器畫面(可定義)

## 使用方法 :

##### 1.檔案下載：

    1.直接下載或是複製網址使用 git clone

##### 2.必要程式安裝：

    1.下載 Node.js 安裝程式，並且安裝

    2.使用終端機，在檔案目錄下輸入 npm install （自動安裝套件）

##### 3.使用說明：

    1.編輯 config.js

    2.輸入帳號 (loginName)與密碼 (loginPassword)

    3.輸入畫師 Id (memberId)

    4.終端機輸入 node app.js
    
## 4.設定檔 (config.js)

##### 檔案名稱 (fileName):
Type: ```string``` <br/>
Default: ```null```

##### 畫師 ID (memberId):
Type: ```string``` <br/>
Default: ```null```

##### 使用者登入帳號 (loginName):
Type: ```string``` <br/>
Default: ```null```

##### 使用者登入密碼 (loginPassword):
Type: ```string``` <br/>
Default: ```null```

##### 限制分頁數量 (pageLength):
Type: ```number ``` <br/>
Default: ```3```

## 已知問題

- 小機率性發生下載錯誤，可能與使用 Puppeteer 有關西

## 預定開發

- Puppeteer 分頁使用方式變更

- 升級或拋棄 Async 套件

- 本地端資料庫

- 使用 Docker 打包

- 使用 Electron 開發桌面程式

## 注意

### v2.0.0 以前版本全失效

## 歷史更新

#### v2.0.0

- 升級 Node.js 版本至 **v8.14.1**

- 升級部分套件

- 使用 Puppeteer 重新編寫

- 修改說明文件

#### v1.0.0

- 使用 async/await 重新編寫

- 新增確認檔案是否存在

- 新增畫師 ID 可用 NODE_ENV 輸入

#### v0.1.4

- 新增加載動畫

- 新增顯示資訊選擇

- 修正動圖錯誤(暫時略過)

- 代碼優化

#### v0.1.3

- 修正 Windows 無法執行問題

#### v0.1.2

- 修復已知錯誤

- 部分代碼更新

#### v0.1.1

- 修正判斷有無資料夾方式

- 系統優化

#### v0.1.0

- 新增設定檔

- 功能模組化

- 系統優化

#### v0.0.5

- 新增單頁下載完成

- 新增失敗自動重試

#### v0.0.3

- 新增模擬登入

#### v0.0.1

- 新增基礎功能＋設定
