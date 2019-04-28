var express=require("express");
var router = express.Router();

function Hello() { 
    var name; 
    this.setName = function(thyName) { 
        name = thyName; 
    }; 
    this.sayHello = function() { 
        console.log('Hello ' + name); 
    }; 

    this.create=function(router){
        router.get("/routerTest",function(req,res){
            res.send("test");   
       });
    }
}; 

module.exports=Hello;