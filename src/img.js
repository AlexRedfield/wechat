
var express = require('express');
var app     = express();
var fs     = require('fs');
const multer = require('multer');  
let path = require("path");  

var router = express.Router();

var bodyParser = require('body-parser');

var port    = process.env.PORT || 8080;
var urlencodedParser = bodyParser.urlencoded({ extended: false })



//设置最大文件限制
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
  
Img={
  uploadImg: function(router, urlencodedParser){
      router.post('/upload',urlencodedParser,function(req, res){
      //接收前台POST过来的base64
      var base64Data = req.body.imgData;
      //过滤data:URL
      //var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
      var dataBuffer = new Buffer(base64Data, 'base64');
      var filename=`${Date.now()}_${Math.ceil(Math.random() * 1000)}`+'.png';
      fs.writeFile('../img/'+filename, dataBuffer, function(err) {
          if(err){
              console.log(err);
            res.send(err);
          }else{
            res.send(filename);
          }
      });
    });
  }
}


module.exports = Img;
/*
app.use('/', router);

// ---- 啟動伺服器 ----
app.listen(port);*/