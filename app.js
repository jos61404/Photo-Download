var fs = require('fs');
var path = require('path');
var async = require('async');
var request = require('request');
var cheerio = require('cheerio');

// 單一照片ID
var illust_id = 53149284;

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

		// 執行下載
		// console.log('111網址: ', img); 
		// console.log('111放大網址:', imageurl); ; 
		// console.log('111名子: ', imagename);
		// request(img).pipe(fs.createWriteStream('images/'+name)); 
		// request(imageurl).pipe(fs.createWriteStream('images/'+imagename)); 
		// request(imageurljpg).pipe(fs.createWriteStream('images/'+imagenamejpg)); 
		// fs.appendFile('./'+'img'+'.txt', "網址: " + imageurl + '\n' + "名子: " + imagename +'\n');
		
		// // 呼叫下載
		download(name, img, imagename, imageurl, url, imagenamejpg, imageurljpg);
	
		// 呼叫arry處理
		arrypage(wrapper);
	}
});

// 單一頁面解析
function onepage(url){
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {

			// 開頭---下載處理
	    	$ = cheerio.load(body);
			var wrapper = $('#wrapper');
			var newindex = wrapper.find('.newindex .newindex-inner .newindex-bg-container .cool-work .cool-work-main');
			var imgcontainer = newindex.find('.img-container');
			var img = imgcontainer.find('img').attr('src');
	    	var name = path.basename(img);

	    	// 字串分割
			var imgurl = img.split("/");
			var imgname = imgurl[13].split("_");
			var imagename = imgname[0] + "_p0"  + ".png" ;
			var imagenamejpg = imgname[0] + "_" + imgname[1] + ".jpg" ;
			var imageurl = "http://" + imgurl[2] + "/img-original/img/" + imgurl[7] + "/" + imgurl[8] + "/" + imgurl[9] + "/" + imgurl[10] + "/" + imgurl[11] + "/" + imgurl[12] + "/" + imagename;
			var imageurljpg = "http://" + imgurl[2] + "/img-original/img/" + imgurl[7] + "/" + imgurl[8] + "/" + imgurl[9] + "/" + imgurl[10] + "/" + imgurl[11] + "/" + imgurl[12] + "/" + imagenamejpg;

	    	// 呼叫下載
	    	setTimeout(function(){
	   			download(name, img, imagename, imageurl, url, imagenamejpg, imageurljpg);
	    	}, 1000);

			// 呼叫arry處理
			// arrypage(wrapper);

		}
	});
}

// 執行下載動作
function download(name, img, imagename, imageurl, url, imagenamejpg, imageurljpg){
	// var name = name;
	// var img = img;
	// var imagename= imagename;
	// var imageurl= imageurl;
	// var url= url;
	// var imagenamejpg= imagenamejpg;
	// var imageurljpg= imageurljpg;

	async.series({
	    a: function(callback){
				request(img).pipe(fs.createWriteStream('images/'+name)); 
				console.log('原始圖片來源: ', img); 
				callback(); 
	    },
	    b: function(callback){
				request(imageurl).pipe(fs.createWriteStream('images/'+imagename));
				console.log('放大圖片來源:', imageurl); 	
				callback();
	    }
	   //  c: function(callback){
				// request(imageurljpg).pipe(fs.createWriteStream('images/'+ imagenamejpg), function(){
				// 	callback(); 
				// });
				// console.log('放大圖片來源jpg:', imageurljpg); 
	   //  	   	callback();
	   //  }
	},
	function(err, results) {
		if(err){
			console.log('錯誤: ', err);
		}
	});

	// var a = async.queue(function (task, callback) {
	// 		request(task.img).pipe(fs.createWriteStream('images/'+task.name), function(){
	// 			callback(); 
	// 		}); 
	// 		console.log('原始圖片來源: ', task.img); 
	// }, 2);
	// a.push({name:name, img:img}, function (err) {
	//     if(err){	    
	//     	console.log('finished processing foo');
	// 	}
	// });

	// var b = async.queue(function (task, callback) {
	// 		request(task.imageurl).pipe(fs.createWriteStream('images/'+task.imagename), function(){
	// 			callback();
	// 		});
	// 		console.log('放大圖片來源:', imageurl); 	
	// }, 2);
	// b.push({imagename:imagename, imageurl:imageurl}, function (err) {
	//     if(err){	    
	//     	console.log('finished processing foo');
	// 	}
	// });	

	// var c = async.queue(function (task, callback) {
	// 		request(task.imageurljpg).pipe(fs.createWriteStream('images/'+task.imagenamejpg), function(){
	// 			callback();
	// 		});
	// 		console.log('放大圖片來源jpg:', task.imageurljpg); 
	// }, 2);
	// c.push({ imagenamejpg:imagenamejpg, imageurljpg:imageurljpg}, function (err) {
	//     if(err){	    
	//     	console.log('finished processing foo');
	// 	}
	// });

}



// arry處理
function arrypage(wrapper){
		var coolworksub = wrapper.find('.newindex .newindex-inner .newindex-bg-container .cool-work .cool-work-sub');
		var works = coolworksub.find('.works');
		var ul = works.find('ul');
		var li = ul.find('li');
		for (var i = 0; i <= li.length-1; i++) {
			var workurl = li.eq(i).find('a').attr('href');
			workurl = 'http://www.pixiv.net/' + workurl;
			onepage(workurl);
		};
}



