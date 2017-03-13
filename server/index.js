var path = require("path")
var url = require("url")
var querystring = require("querystring")
var fs = require("fs")
var formidable = require("formidable");

var express = require('express')
var port = 8080
var app = express()
var multer = require("multer")()     
var bodyParser = require("body-parser")
var qrImage = require("qr-image")
var mongoose = require("mongoose")
var User = require("./models/user.js")
var Mobile = require("./models/mobile.js")
var Pc = require("./models/pc.js")

mongoose.connect('mongodb://localhost/users')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.listen(port)

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "X-Requested-With")
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS")
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/jsoncharset=utf-8")
    next()
})

//处理formdata提交的post请求
//https://github.com/expressjs/multer
app.post('/login', multer.array(), function(req, res, next){
	var data = {}
	User.find({ 'username':req.body.name, 'password':req.body.password }, function(err, docs) {
		try{
			if (docs.length > 0) {
				data.login = true
				data.user = docs
			}else{
				data.login = false
			}
			res.format({
				json: () => res.json(data)
			})
		}catch(e){
			console.log('err in login:'+e)
		}
	})
})

app.post('/createH5', multer.array(), function(req, res, next) {
	var data = {}
	var _mobile

	Mobile.find({ 'docName': req.body.docname, 'creatorId': req.body.userid }, function(err, docs) {
		try{
			if (docs.length == 1) {

				//创建失败，文档名已经存在
				data.h5 = false
				data.errorMessage = '创建失败，文档名已经存在'
				res.format({
					json: () => res.json(data)
				})

			}else if (docs.length < 1) {

				//文档名不存在，可以创建
				_mobile = new Mobile({
					docname: req.body.docname,
					creatorId: req.body.userid,
					type: "h5",
					status: 0,
					pages: [{}]
				})

				_mobile.save(function(err, mobile){
					if (err) {console.log(err)}
					//更新用户表
					//User.update({_id: userid}, {$addToSet: {tasks: {mobile: {taskid: mobile._id}}}}).exec()
					User.update({_id: req.body.userid}, {$addToSet: {mobile: {taskid: mobile._id, thumbnail: '', url: ''}}}, function(err, docs) {
						if (err) {console.log('update error: ' + err)}

						//创建静态文件目录
						const docDir = __dirname + '/public/h5/' + req.body.docname
						const imgDir = docDir + '/images'
						fs.exists(docDir, function(exists) {
							if (!exists) {
								fs.mkdir(docDir)
								fs.mkdir(imgDir)
							}
						})

						data.h5 = true
						data.taskinfo = mobile
						res.format({
							json: () => res.json(data)
						})
					})
				})

			}else{

				data.h5 = false
				data.errorMessage = '创建失败，数据库错误'
				res.format({
					json: () => res.json(data)
				})
				console.log('an error happened, some h5 task has the same docname!')

			}
		}catch(e) {
			console.log('err in createH5:' + e)
		}
	})
})

app.post('/loadH5', multer.array(), function(req, res, next) {
	var data = {}

	Mobile.findById(req.body.taskid, function(err, docs) {
		if (err) {console.log(err)}

		data.h5 = true
		data.taskinfo = docs
		res.format({
			json: () => res.json(data)
		})
	})
})

app.post('/H5AddPage/:taskid', multer.array(), function(req, res) {
	var taskid = req.params.taskid
	//var pages = req.body.task.pages
	var task = JSON.parse(req.body.task)
	var pages = task.pages
	Mobile.findByIdAndUpdate(taskid, {$set: {pages: pages}}, function(err, docs) {
		Mobile.findByIdAndUpdate(taskid, {$addToSet: {pages: {eles: []}}}, function(err, docs) {
			if (err) {console.log('update error: ' + err)}

			Mobile.findById(taskid, function(err, docs) {
				if (err) {console.log(err)} 

				res.format({
					json: () => res.json(docs)
				})
			})
		})
	})
})

app.post('/H5ImgUpload/:taskid', function(req, res) {
	var taskid = req.params.taskid

	Mobile.findById(taskid, function(err, docs) {
		var docname = docs.docname
		var imgDir = __dirname + '/public/h5/' + docname + '/images/'

		//创建表单上传
	    var form = new formidable.IncomingForm()
	    //设置编辑
	    form.encoding = 'utf-8'
	    //设置文件存储路径
	    form.uploadDir = imgDir
	    //保留后缀
	    form.keepExtensions = true
	    //设置单文件大小限制    
    	form.maxFieldsSize = 2 * 1024 * 1024;

		form.parse(req, function(error, fields, files) {
			var path = files.image.path
			var type = path.substring(path.lastIndexOf('.'))
			var timestamp = +new Date()
			var newPath = imgDir + timestamp + type
			var url = "http://www.kuafuu.com:8080/" + docname + '/images/' + timestamp + type

			fs.rename(path, newPath, function(err) {
				console.log(err)
			})

			Mobile.findByIdAndUpdate(taskid, {$addToSet: {images: url}}, function(err, docs) {
				if (err) {console.log('update error: ' + err)}

				Mobile.findById(taskid, function(err, docs) {
					if (err) {console.log(err)}

					var data = {}
					data.taskinfo = docs
					res.format({
						json: () => res.json(data)
					})
				})
			})
		})

	})
	
})

app.post('/H5UpdateTask/:taskid', multer.array(), function(req, res) {
	var taskid = req.params.taskid
	var task = JSON.parse(req.body.task)
	var pages = task.pages

	Mobile.findByIdAndUpdate(taskid, {$set: {pages: pages}}, function(err, docs) {
		Mobile.findById(taskid, function(err, docs) {
			if (err) {console.log(err)} 

			res.format({
				json: () => res.json(docs)
			})
		})
	})
})

app.post('/H5MakeFile/:taskid', multer.array(), function(req, res) {
	var taskid = req.params.taskid
	var task = JSON.parse(req.body.task)
	var pages = task.pages

	Mobile.findByIdAndUpdate(taskid, {$set: {pages: pages}}, function(err, docs) {
		Mobile.findById(taskid, function(err, docs) {
			if (err) {console.log(err)}

			var docName = docs.docname
			var URL = 'http://www.kuafuu.com:8080/' + docName
			var dir = __dirname + '/public/h5/' + docName
			var jquerySrc = __dirname + '/common/jquery-2.1.4.min.js'
			var slideSrc = __dirname + '/common/slide.js'
			var jqueryDst = __dirname + '/public/h5/' + docName + '/jquery.js'
			var slideDst = __dirname + '/public/h5/' + docName + '/slide.js'
			var cssSrc = __dirname + '/common/common.css'
			var cssDst = __dirname + '/public/h5/' + docName + '/common.css'

			fs.exists(dir, function(exists) {
				if (exists) {
					var pages = ''
					docs.pages.map(function(val, ind) {
						pages += '<div id="page' + ind + '" class="page">\n'
						val.eles.map(function(val, ind) {
							var width = val.width * 2 / 15, top = val.top * 2 / 15, left =  val.left * 2 / 15
							console.log(val.animation)
							if (!val.animation) {
								pages += '<img src="' + val.url + '" style="width:' + width + 'vw; top:' + top + 'vw; left:' + left + 'vw;"/>\n'
							}else{
								var ani = val.animation
								var animation = ani.name + " " + ani.duration + "s ease " + ani.delay + "s " + ani.times
								pages += '<img src="' + val.url + '" style="width:' + width + 'vw; top:' + top + 'vw; left:' + left + 'vw; animation:' + animation + ';"/>\n'
							}
						})

						pages += '</div>\n' 
					})

					var html = '<!DOCTYPE html>\n' +
								'<html lang="en">\n' +
								'<head>\n' + 
								'<meta charset="utf-8">\n' +
								'<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>\n' +
								'<link rel="stylesheet" type="text/css" href="common.css">\n' +
								'<title></title>\n' +
								'</head>\n' +
								'<body>\n' +
									pages +
									'<script src="jquery.js"></script>\n' +
									'<script src="slide.js"></script>\n'
								'</body>\n' +
								'</html>\n'

					var wsHtml = fs.createWriteStream(dir + '/index.html')
					wsHtml.write(html, function(err) {
						if (err) {
							console.log('html write error:' + err)
						}
						fs.writeFileSync(jqueryDst, fs.readFileSync(jquerySrc));
						fs.writeFileSync(slideDst, fs.readFileSync(slideSrc));
						fs.writeFileSync(cssDst, fs.readFileSync(cssSrc));

						res.format({
							json: () => res.json({publish: true})
						})
					})
					wsHtml.on('drain', function() {
						wsHtml.end()
					})
				}
			})
		})
	})
})

app.get('/qrcode', function(req, res) {
	console.log(req.query)
	var text = req.query.text
	if (text) {
		var temp_qrcode = qrImage.image(text)
		res.type('png')
		temp_qrcode.pipe(res)
	}
})

/*************PC*****************/
app.post('/createPC', multer.array(), function(req, res, next) {
	var data = {}
	var _pc

	Pc.find({ 'docName': req.body.docname, 'creatorId': req.body.userid }, function(err, docs) {
		try{
			if (docs.length == 1) {

				data.pc = false
				data.errorMessage = '创建失败，文档名已经存在'
				res.format({
					json: () => res.json(data)
				})
				console.log(docs)

			}else if(docs.length < 1) {

				_pc = new Pc({
					docname: req.body.docname,
					creatorId: req.body.userid,
					type: "pc",
					status: 0,
					blocks: [{}]
				})

				_pc.save(function(err, pc) {
					if (err) {console.log(err)}

					User.update({_id: req.body.userid}, {$addToSet: {pc: {taskid: pc._id, thumbnail: '', url: ''}}}, function(err, docs) {
						if (err) {console.log('update error:' + err)}

						const docDir = __dirname + '/public/pc/' + req.body.docname
						const imgDir = docDir + '/images'
						fs.exists(docDir, function(exists) {
							if (!exists) {
								fs.mkdir(docDir)
								fs.mkdir(imgDir)
							}
						})

						data.pc = true
						data.taskinfo = pc
						res.format({
							json: () => res.json(data)
						})
					})
				})
			}else {

				data.pc = false
				data.errorMessage = '创建失败，数据库错误'
				res.format({
					json: () => res.json(data)
				})
				console.log('an error happened, some PC task has the same docname!')
			}
		}catch(e) {
			console.log('err in createPC:' + e)
		}
	})
})

app.post('/PCLoad', multer.array(), function(req, res, next) {
	var data = {}
	Pc.findById(req.body.taskid, function(err, docs) {
		if (err) {console.log(err)}
		console.log(docs)
		data.pc = true
		data.taskinfo = docs
		res.format({
			json: () => res.json(data)
		})
	})
})

app.post('/PCAddBlock/:taskid', multer.array(), function(req, res) {
	var taskid = req.params.taskid
	//var pages = req.body.task.pages
	var task = JSON.parse(req.body.task)
	var blocks = task.blocks

	Pc.findByIdAndUpdate(taskid, {$set: {blocks: blocks}}, function(err, docs) {
		Pc.findByIdAndUpdate(taskid, {$addToSet: {blocks: {eles: []}}}, function(err, docs) {
			if (err) {console.log(err)}

			Pc.findById(taskid, function(err, docs) {
				if (err) {console.log(err)} 

				console.log(docs)
				var data = {}
				data.taskinfo = docs
				res.format({
					json: () => res.json(data)
				})
			})
		})
	})
})

app.post('/PCImgUpload/:taskid', function(req, res) {
	var taskid = req.params.taskid

	Pc.findById(taskid, function(err, docs) {
		var docname = docs.docname
		var imgDir = __dirname + '/public/pc/' + docname + '/images/'

		//创建表单上传
	    var form = new formidable.IncomingForm()
	    //设置编辑
	    form.encoding = 'utf-8'
	    //设置文件存储路径
	    form.uploadDir = imgDir
	    //保留后缀
	    form.keepExtensions = true
	    //设置单文件大小限制    
    	form.maxFieldsSize = 2 * 1024 * 1024;

    	form.parse(req, function(error, fields, files) {
    		var path = files.image.path
    		var type = path.substring(path.lastIndexOf('.'))
			var timestamp = +new Date()
			var newPath = imgDir + timestamp + type
			var url = "http://www.kuafuu.com:8080/pc/" + docname + '/images/' + timestamp + type

			fs.rename(path, newPath, function(err) {
				console.log(err)
			})

			Pc.findByIdAndUpdate(taskid, {$addToSet: {images: url}}, function(err, docs) {
				if (err) {console.log('update error: ' + err)}

				Pc.findById(taskid, function(err, docs) {
					if (err) {console.log(err)}

					var data = {}
					data.taskinfo = docs
					res.format({
						json: () => res.json(data)
					})
				})
			})
    	})
	})
})

app.post('/PCUpdateTask/:taskid', multer.array(), function(req, res) {
	var taskid = req.params.taskid
	var task = JSON.parse(req.body.task)
	var blocks = task.blocks

	Pc.findByIdAndUpdate(taskid, {$set: {blocks: blocks}}, function(err, docs) {
		Pc.findById(taskid, function(err, docs) {
			if (err) {console.log(err)} 

			var data = {}
			data.taskinfo = docs
			res.format({
				json: () => res.json(data)
			})
		})
	})
})

app.post('/PCMakeFile/:taskid', multer.array(), function(req, res) {	
	var taskid = req.params.taskid
	var task = JSON.parse(req.body.task)
	var blocks = task.blocks

	Pc.findByIdAndUpdate(taskid, {$set: {blocks: blocks}}, function(err, docs) {
		Pc.findById(taskid, function(err, docs) {
			if (err) {console.log(err)}

			var docName = docs.docname
			var URL = 'http://www.kuafuu.com:8080/' + docName
			var dir = __dirname + '/public/pc/' + docName
			fs.exists(dir, function(exists) {
				if (exists) {
					var blocks = ''
					docs.blocks.map(function(val, ind) {
						blocks += '<div class="block">\n'
						val.eles.map(function(val, ind) {
							switch(val.eletype){
								case 'bg':
									var src = val.url.slice(val.url.indexOf('images/'))
									blocks += '<img src="'+ src +'" class="block_bg">\n'
									return
								case 'btn':
								case 'carousel':
									blocks += '<div id="fj-wrapper" style="width:' + val.width + 'px;height:' + val.height + 'px;top:' + val.top + 'px;left:' + val.left + 'px">\n<div id="fj-carousel">\n'
									val.imgs.map(function(va, ind){
										var src = va.slice(va.indexOf('images/'))
										blocks += '<img src="'+ src +'" style="width:' + val.width +'px;height:' + val.height +'px"/>\n'
									})
									blocks += '</div>\n<div id="fj-pager"></div>\n</div>\n'
									return
							}
						})
						blocks += '</div>\n'
					})


					var html = '<!DOCTYPE html>\n' + 
								'<html lang="en">\n' +
								'<head>\n' + 
								'<meta http-equiv="content-type" content="text/html;charset=utf-8">\n' +
								'<title></title>\n' +
								'<style type="text/css">\n' +
								'*{font-size:12px; list-style:none; font-family:Microsoft YaHei,SimSun; margin:0; padding:0;}\n' +
								'#BG{width: 100%; height: auto; overflow: hidden; margin: auto;}\n' +
								'#content{width: 1440px; height: auto; margin-left: 50%; left: -720px; position: relative;}\n' +
								'.block_bg{width: 100%; display: block;}\n' +
								'img{border: none;}\n' +
								'a#Top{width:50px; height:50px; display:block; right:20px; bottom:120px; background:url(images/top.png) no-repeat 0 0; opacity: 0.7;}\n' +
								'a#Top:hover{background-position: -50px 0;}\n' +
								'#fj-wrapper {position: absolute; overflow: hidden; padding: 0; background-color:rgb(255,255,255); border-radius: 0;}\n' +
								'#fj-carousel{overflow: hidden;}\n' +
								'#fj-carousel img {display: block;float: left;border: 0;}\n' +
								'#fj-pager {text-align: center;position: absolute;}\n' +
								'#fj-pager a {background: transparent url(http://mat1.gtimg.com/cd/zhangmin/zt2015/smhgg/page.png) no-repeat;text-decoration: none;text-indent: -999px;display: inline-block;overflow: hidden;width: 8px;height: 8px;margin: 0 10px 0 0;}\n' +
								'#fj-pager a.selected {background: transparent url(http://mat1.gtimg.com/cd/zhangmin/zt2015/smhgg/page_selected.png) no-repeat;text-decoration: underline;}\n' +
								'</style>\n' +
								'<script src="http://cd.qq.com/zhangmin/lzh/mbyd/jquery-1.8.2.min.js"></script>\n' +
								'<script src="http://cd.qq.com/zhangmin/zt2013/holiday/top.js" type="text/javascript"></script>\n' +
								'<script src="http://cd.qq.com//cm/zh/2015zt/linz/jquery.carouFredSel-6.2.1-packed.js" type="text/javascript"></script>\n' +
								'</head>\n' +
								'<body>\n' +
								'<div id="BG">\n' +
								'<div id="content">\n' +
									blocks +
								'</div>\n' +
								'</div>\n' +
								'<script type="text/javascript">\n' +
								'(new GoTop()).init({pageWidth:1000,nodeId:"Top",nodeWidth:50,distanceToBottom:120,hideRegionHeight:300,text:""});\n' +
								'$(function() {$("#fj-carousel").carouFredSel({items: 1,pagination: "#fj-pager",scroll: 1,auto: {duration: 1250,timeoutDuration: 2500}});});\n' +
								'</script>\n' +
								'</body>\n' +
								'</html>\n'

					var wsHtml = fs.createWriteStream(dir + '/index.html')
					wsHtml.write(html, function(err) {
						if (err) {
							console.log('html write error:' + err)
						}

						var data = {}
						data.taskinfo = docs
						data.publish = true
						res.format({
							json: () => res.json(data)
						})
					})
					wsHtml.on('drain', function() {
						wsHtml.end()
					})
				}
			})
		})
	})	
})

                                             
console.log("server start on port " + port)
