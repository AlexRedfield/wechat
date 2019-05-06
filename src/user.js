var Hello = require("./router1");
//var _app = require("./app");
var Task=require('./task');
var Img=require('./img');
var express=require("express");
var bodyParser = require('body-parser');
var router = express.Router();
var app=express();
var port    = process.env.PORT || 8080;
//引入web3.js
var Web3=require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

var urlencodedParser = bodyParser.urlencoded({ extended: false })

var jHandler=require("./jsonHandler");

var service = require("../mysql/test");

//_app.initWeb3();
//_app.readNote();

hello = new Hello(); 
hello.setName('BYVoid'); 
hello.sayHello(); 
hello.create(router);

//设置最大文件限制
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
//添加上传图片接口
Img.uploadImg(router, urlencodedParser);

router.get("/getMessage",function(req,res){

     //message.methods.getMsg().call(function(error,result){
            //res.send(result);
    web3.eth.getAccounts(function(error, accounts) {
        if (error) {
            console.log(error);
        }
        res.send(accounts);
    });

});




router.get("/sql",function(req,res){

    service.query().then(data=>{
        //console.log(data);
        res.send(data);
    })

});

router.post("/post",urlencodedParser,function(req,res){

    console.log(req.body);
    var num=Number(req.body.value)+1;
    res.send(String(num));
});

router.post("/upload",urlencodedParser,function(req,res){

    console.log(req.body);

});


//发布任务接口
router.post("/postTask",urlencodedParser,function(req,res){
    console.log(req.body);
    let name='"'+req.body.name+'"';
    let flag=parseInt(req.body.flag);
    let price=parseInt(req.body.price);
    let sort='"'+req.body.sort+'"';
    
    let date=parseInt(req.body.date);

    let img='"'+req.body.img+'"';

    let info='"'+req.body.info+'"';
    let nickname='"'+req.body.nickname+'"';
    let phone='"'+req.body.phone+'"';
    let address='"'+req.body.address+'"';
    let account=jHandler.id2Account(req.body.worker);

    //account="0x0302f4512E02b7DF7259fFb373ecfEdfD50DB80E";
    //Task.addTask(account,name,flag,price,sort,date,info);
    Task.getTaskLen(account).then(data=>{
        console.log(parseInt(data));
        account='"'+account+'"';  
        service.insert(parseInt(data),name,account,account,flag,price,sort,
        date,info,img,nickname,phone,address,0);
    });
    console.log(account);
    res.send(account);
});




//module.exports = router;

app.use('/', router);

// ---- 啟動伺服器 ----
app.listen(port);
