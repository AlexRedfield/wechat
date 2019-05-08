/*
var mysql  = require('mysql');  
 
var connection = mysql.createConnection({     
  host     : 'localhost',       
  user     : 'root',              
  password : 'alexdb',       
  port: '3306',                   
  database: 'chat' 
}); 
 
connection.connect();
 
var  sql = 'SELECT * FROM websites';
//查
connection.query(sql,function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
          return;
        }
 
       console.log('--------------------------SELECT----------------------------');
       console.log(result);
       console.log('------------------------------------------------------------\n\n');  
});
 */ 
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'alexdb',
    port: '3306',
    database: 'chat'
});
connection.connect();


var query = function (sql) {
  var promise = new Promise(function (resolve, reject) {

  connection.query(
      //"SELECT * FROM task",
      sql,
      function selectCb(err, results) {
          if (results) {
              //console.log(results);
              resolve(results);
          }
          if (err) {
              console.log(err);
          }
          //connection.end();
      }
    );
  });
  promise.then(function (value) {
    //console.log(value);
    return value;
    // success
    }, function (err) {
    // failure
    return err;
  });
  return promise;
};


var insert=function(id,name,worker,customer,flag,price,sort,date,info,img,nickname,phone,address,avatar,status){
  var  sql = "INSERT INTO task VALUES ("+id+", "+name+", "+worker+", "+customer+", "+flag+", "
  +price+", "+sort+", "+date+", "+info+", "+img+", "+nickname+", "+phone+", "
  +address+", "+avatar+", "+status+")";
  connection.query(sql,function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
          return;
        }
       console.log(result);
       console.log('------------------------------------------------------------\n\n');  
});
}


var insertInfo=function(userid, nickname, phone, address){
  var  sql = "INSERT INTO user VALUES ("+userid+", "+nickname+", "+phone+", "+address+")";
  connection.query(sql,function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
          return;
        }
       console.log(result);
       console.log('------------------------------------------------------------\n\n');  
});
}

exports.query=query;
exports.insert=insert;
exports.insertInfo=insertInfo;