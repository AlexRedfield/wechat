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
var transfer=require('./transfer');
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
//Img.uploadAva(router, urlencodedParser);

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

function getLocalTime(nS) {     
    return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');     
 }

router.post("/sql", urlencodedParser, function(req,res){
    let sort='"'+req.body.sort+'"';
    let flag=parseInt(req.body.flag);
    let sql="select * from task where flag="+flag+" and sort="+sort+" and status="+0;
    service.query(sql).then(data=>{
        res.send(data);
    })
});

router.post("/order1", urlencodedParser, function(req,res){
    console.log(req.body);
    let customer=jHandler.id2Account(req.body.user);
    customer='"'+customer+'"';
    let status=parseInt(req.body.status);
    let sql="select * from task where flag=0"+" and customer="+customer+" and status="+status;

    service.query(sql).then(data=>{
        res.send(data);
    })
});

//开放预约接口
router.post("/order", urlencodedParser, function(req,res){
    console.log(req.body);
    let date='"'+getLocalTime(req.body.date)+'"';
    console.log(date);
    let customers=jHandler.id2Account(req.body.customer);
    customer1='"'+customers+'"';  
    console.log(customers);

    let address='"'+req.body.address+'"';
    let flag=parseInt(req.body.flag);
    let index='"'+req.body.index+'"';
    let status=1;

    service.changeStatus(index, date, address, flag, customer1, status);
    res.send("success");
    let admin="0x0302f4512E02b7DF7259fFb373ecfEdfD50DB80E";
    transfer.trans(customers, admin, 5)
    
});

router.post("/cancel",urlencodedParser,function(req,res){

    console.log(req.body);
    let index='"'+req.body.whatever+'"';
    let customers=jHandler.id2Account(req.body.user);
    let customer1=null;  
    let date=null;
    let address=null;
    let flag=0;
    let status=0;
    service.changeStatus(index, date, address, flag, customer1, status);
    res.send("success");
    let admin="0x0302f4512E02b7DF7259fFb373ecfEdfD50DB80E";
    transfer.trans(admin, customers, 5)
});

//支付服务
router.post("/pay",urlencodedParser,function(req,res){

    console.log(req.body);
    let index='"'+req.body.whatever+'"';
    let customers=jHandler.id2Account(req.body.user);

    let status=3;
    service.onlyChangeStatus(index, status);
    res.send("success");
    let sql="select price,worker from task where whatever="+index;

    service.query(sql).then(data=>{

        results = JSON.stringify(data);//把results对象转为字符串，去掉RowDataPacket
        results = JSON.parse(results);//把results字符串转为json对象

        transfer.trans(customers, results[0].worker, results[0].price)
    })

});

//删除订单
router.post("/delete",urlencodedParser,function(req,res){

    let index='"'+req.body.whatever+'"';
    let status=-1;
    service.onlyChangeStatus(index, status);
    res.send("success");
});

//获取用户余额
router.post("/balance",urlencodedParser,function(req,res){

    let address=jHandler.id2Account(req.body.user);

    let result=web3.eth.getBalance(address)
    result/=1000000000000000000;
    result=result.toFixed(2);
    /*
    .then(data=>{
        console.log(address+"\t"+data); //地址 余额
        res.send(data);  
    }); */
    res.send(String(result));  
});

router.post("/post",urlencodedParser,function(req,res){

    console.log(req.body);
    var num=Number(req.body.value)+1;
    res.send(String(num));
});


//发布任务接口
router.post("/postTask",urlencodedParser,function(req,res){
    console.log(req.body);
    let name='"'+req.body.name+'"';
    let flag=parseInt(req.body.flag);
    let price=parseInt(req.body.price);
    let sort='"'+req.body.sort+'"';
    

    let date='"'+getLocalTime(req.body.date)+'"';

    let img='"'+req.body.img+'"';

    let info='"'+req.body.info+'"';
    let nickname='"'+req.body.nickname+'"';
    let phone='"'+req.body.phone+'"';
    let address='"'+req.body.address+'"';
    let avatar='"'+req.body.avatar+'"';

    let account=jHandler.id2Account(req.body.worker);
    let index='"'+`${Date.now()}_${Math.ceil(Math.random() * 1000)}`+'"';
    account="0x0302f4512E02b7DF7259fFb373ecfEdfD50DB80E";
    Task.addTask(account,name,flag,price,sort,0,info);
    Task.getTaskLen(account).then(data=>{
        console.log(parseInt(data));
        account='"'+account+'"';  
        service.insert(parseInt(data),name,account,account,flag,price,sort,
        date,info,img,nickname,phone,address,avatar,0,index);
    });
    console.log(account);
    res.send(account);
});


//module.exports = router;

app.use('/', router);

// ---- 啟動伺服器 ----
app.listen(port);
