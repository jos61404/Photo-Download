var fs = require('fs');
var path = require('path');
var async = require('async');
var request = require('request');
var cheerio = require('cheerio');
var wget = require('wget');

// 單一照片ID
var illust_id = 53374756;

// 預設資料夾名稱 images
var filename = 'images/';

var url = 'http://www.pixiv.net/member_illust.php?mode=medium&illust_id='+ illust_id;
request(url, function (error, response, body) {
	if (!error && response.statusCode == 200) {

		// 開頭---下載處理
    	$ = cheerio.load(body);
		var wrapper = $('#wrapper');
		var newindex = wrapper.find('.newindex .newindex-inner .newindex-bg-container .cool-work .cool-work-main');
		var imgcontainer = newindex.find('.img-container');
		var img = imgcontainer.find('img').attr('src');
		// 檔案名字讀取
    	var name = path.basename(img);
	
    	// 字串分割
		var imgurl = img.split("/");
		var imgname = imgurl[13].split("_");
		var imagename = imgname[0] + "_" + imgname[1] + ".png" ;
		var imagenamejpg = imgname[0] + "_" + imgname[1] + ".jpg" ;
		var imageurl = "http://" + imgurl[2] + "/img-original/img/" + imgurl[7] + "/" + imgurl[8] + "/" + imgurl[9] + "/" + imgurl[10] + "/" + imgurl[11] + "/" + imgurl[12] + "/" + imagename;
		var imageurljpg = "http://" + imgurl[2] + "/img-original/img/" + imgurl[7] + "/" + imgurl[8] + "/" + imgurl[9] + "/" + imgurl[10] + "/" + imgurl[11] + "/" + imgurl[12] + "/" + imagenamejpg;

    	// var list = {
    	// 	name: name, 
    	// 	url:url, 
    	// 	img:img, 
    	// 	imagename:imagename, 
    	// 	imageurl:imageurl, 
    	// 	imagenamejpg:imagenamejpg, 
    	// 	imageurljpg:imageurljpg
    	// };

		// 呼叫下載
		// console.log('圖片網址list：', list);
		// download(list);

		// 呼叫arry處理
		arrypage(wrapper);
	}
});


// 單一頁面解析
function onepage(arryurl){

	var a = 0;
	var imagelist = new Array();
	// console.log('單一解析：', arryurl);

	async.each(arryurl,function(topic, callback) {

		request(topic, function (error, response, body) {
			if (!error && response.statusCode == 200) {

				// 開頭---下載處理
		    	$ = cheerio.load(body);
				var wrapper = $('#wrapper');
				var newindex = wrapper.find('.newindex .newindex-inner .newindex-bg-container .cool-work .cool-work-main');
				var imgcontainer = newindex.find('.img-container');
				var img = imgcontainer.find('img').attr('src');
				// 檔案名字讀取
		    	var name = path.basename(img);

		    	// 字串分割
				var imgurl = img.split("/");
				var imgname = imgurl[13].split("_");
				var imagename = imgname[0] + "_p0"  + ".png" ;
				var imagenamejpg = imgname[0] + "_" + imgname[1] + ".jpg" ;
				var imageurl = "http://" + imgurl[2] + "/img-original/img/" + imgurl[7] + "/" + imgurl[8] + "/" + imgurl[9] + "/" + imgurl[10] + "/" + imgurl[11] + "/" + imgurl[12] + "/" + imagename;
				var imageurljpg = "http://" + imgurl[2] + "/img-original/img/" + imgurl[7] + "/" + imgurl[8] + "/" + imgurl[9] + "/" + imgurl[10] + "/" + imgurl[11] + "/" + imgurl[12] + "/" + imagenamejpg;

		    	// 呼叫下載
		    	var list = {
		    		id: a,
		    		url:topic,
 		    		name: name, 
		    		img:img, 
		    		imagename:imagename, 
		    		imageurl:imageurl, 
		    		imagenamejpg:imagenamejpg, 
		    		imageurljpg:imageurljpg
		    	};

				// console.log('圖片網址list：', list);
				download(list);
				// imagelist[a] = list;
				// console.log('A數值：', a);
				// console.log('圖片網址：', imagelist);

				if (a == 11){
					callback(imagelist);
				}
		    	a++;

				// 呼叫arry處理 此處開啟迴圈
				// console.log('迴圈網址： ', wrapper);
				// arrypage(wrapper);
			}
		});			
	},function(list){
		// console.log('圖片網址：', list[1].img);
		// download(list);
	});
}


// 執行下載動作
function download(list){	
	var index = list;
	var	id = index.id;
	var name = index.name;
	var img = index.img; 
	var	imagename = index.imagename; 
	var	imageurl = index.imageurl;
	var	url = index.url; 
	var	imagenamejpg = index.imagenamejpg; 
	var	imageurljpg = index.imageurljpg;

	// console.log('原始地址： ', imageurl);

	async.series({
		a: function(callback){
			var downa = wget.download(img,filename+name);
			downa.on('error', function(err){
				// console.log('err', err);
				callback(null, err);
			});
			downa.on('progress', function(progress){
				if(progress == 1){
					downa.on('end', function(output){
						console.log('結果：', output);
						callback(null, progress);
					});
					// console.log('進度條： 100% ');
				}
			});
		},
		b: function(callback){
			var downc = wget.download(imageurljpg,filename+imagenamejpg);
			downc.on('error', function(err){
				// console.log('第三err', err);
				callback(null, err);
			});
			downc.on('progress', function(progress){
				if(progress == 1){
					downc.on('end', function(output){
						console.log('第二結果：', output);
						callback(null, progress);
					});
					// console.log('第三進度條： 100% ');
				}
			});				
		},
		c: function(callback){
			var downb = wget.download(imageurl,filename+imagename);
			downb.on('error', function(err){
				// console.log('第二err', err);
				callback(null, err);
			});
			downb.on('progress', function(progress){
				if(progress == 1){
					downb.on('end', function(output){
						console.log('第三結果：', output);
						callback(null, progress);
					});
					// console.log('第二進度條： 100% ');
				}
			});				
		}
	},function(err,res){
		// console.log('最後的ＥＲＲ： ', err);
		console.log('最後的ＲＥＳ： ', res);
	});

	// request(img).pipe(fs.createWriteStream(filename+name)); 
	// console.log('原始圖片來源: ', img); 

	// request(imageurl).pipe(fs.createWriteStream(filename+imagename));
	// console.log('放大圖片來源:', imageurl); 	

	// request(imageurljpg).pipe(fs.createWriteStream('images/'+ imagenamejpg));
	// console.log('放大圖片來源jpg:', imageurljpg); 

}

// arry處理
function arrypage(wrapper){
		var arryurl = new Array();
		var coolworksub = wrapper.find('.newindex .newindex-inner .newindex-bg-container .cool-work .cool-work-sub');
		var works = coolworksub.find('.works');
		var ul = works.find('ul');
		var li = ul.find('li');
		for (var i = 0; i <= li.length-1; i++) {
			var workurl = li.eq(i).find('a').attr('href');
			arryurl[i] = 'http://www.pixiv.net/' + workurl;
		};
		onepage(arryurl);
}