var Web3=require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
var fs=require("fs");

web3.eth.getAccounts(function(error, accounts) {
    if (error) {
        console.log(error);
    }
    
    //console.log(accounts);
});

Handler={
    params:{
        "openid":"okHw75K-R_uRWWXxvwvfXMHKSZf8",
        "account":"0xE14ea2c52946Bf720ec4A0cf475bA5Fcdbd78912"
    },

    writeJson: function(params){
        data=fs.readFileSync('../data/user.json', 'utf8')
        var user=data.toString();   //将二进制的数据转换为字符串
        user=JSON.parse(user);      //将字符串转换为json对象
        user.data.push(Handler.params);
        user.total=user.data.length;
        var str = JSON.stringify(user);
        fs.writeFile('../data/user.json',str,function(err){
            if(err){
                console.error(err);
            }
            console.log('----------新增成功-------------');
        })
    },


//根据openid返回账户地址，没有就分配一个
    id2Account:function(openid){

        data=fs.readFileSync('../data/user.json', 'utf8')
        var user=data.toString();  
        user=JSON.parse(user);     
        for(var i=0;i<user.data.length;i++){
            if(openid==user.data[i].openid){
                console.log('该openid已存在');
                console.log(user.data[i].account);
                return user.data[i].account;
            }
        }
                   
        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
                console.log(error);
            }
            Handler.params.account=accounts[user.data.length+1];
            Handler.params.openid=openid;
            Handler.writeJson(Handler.params);
        });
        return Handler.params.account;

    },

    //根据账户地址返回openid
    account2Id:function(account){

        data=fs.readFileSync('../data/user.json', 'utf8')
        var user=data.toString();  
        user=JSON.parse(user); 
        
        for(var i=0;i<user.data.length;i++){
            if(account==user.data[i].account){
                console.log(user.data[i].openid);
                return user.data[i].openid;
            }
        }
        console.log('0');
        return 0;

    }

};

module.exports = Handler;

//Handler.id2Account('okHw75K-R_uRWWXxvwvfXMHKSZf8');

//id2Account('66666');


