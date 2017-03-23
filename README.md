# Photo-Download

## 版本： v1.0.0

由於喜歡動漫並且也喜歡相關插圖,某一天在網上無聊逛逛看見了**pixiv**,並且發現喜歡的插圖於是就收藏了一番,礙於久了手會有點殘所以就想懶一點,為什麼我不讓他自己來呢？

### 執行環境 :

* Node.js v7.6.0 （官方網站：<https://nodejs.org/en/>）

### 目前功能 :

* 保存該畫師全部作品

* 預設保存在**images**(可定義)

* 自動判斷檔案是否存在

* 顯示資訊可選擇(精簡(true)/完整(false))

### 使用方法 :
##### 1.檔案下載：

	直接下載或是複製網址使用git clone

##### 2.必要程式安裝：

	1.下載Node.js安裝程式，並且安裝

	2.使用終端機,在檔案目錄下輸入 npm install （自動安裝套件）


##### 3.使用說明：

	1.編輯config.json

	2.輸入帳號(loginId)與密碼(loginPassword)

	3.輸入畫師Id(memberId)或使用NODE_ENV

	4.顯示資訊(viewType)

		精簡: true (預設)

		完整: false

	5.終端機輸入 node app.js

### 已知問題

* ~~圖片下載失敗~~

* ~~R18相關(待處理)~~

* 動圖暫時略過(待處理)

### 歷史更新

#### v1.0.0

* 使用async/await重新編寫

* 新增確認檔案是否存在

* 新增畫師ID可用NODE_ENV輸入

#### v0.1.4

* 新增加載動畫

* 新增顯示資訊選擇

* 修正動圖錯誤(暫時略過)

* 代碼優化

#### v0.1.3

* 修正Windows無法執行問題

#### v0.1.2

* 修復已知錯誤

* 部分代碼更新

#### v0.1.1

* 修正判斷有無資料夾方式

* 系統優化

#### v0.1.0

* 新增設定檔

* 功能模組化

* 系統優化

#### v0.0.5

* 新增單頁下載完成

* 新增失敗自動重試

#### v0.0.3

* 新增模擬登入

#### v0.0.1

* 新增基礎功能＋設定
