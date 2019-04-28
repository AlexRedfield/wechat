var noteContract_artifacts = require('../build/contracts/TaskManage.json')
var Web3 = require('web3');
var contract = require('truffle-contract')
const HOST = "http://localhost:8080";


Task={

    web3Provider: null,
    contracts: {},
    account: null,
    noteInstance: null,
    noteLength : 0,
  
    initWeb3:  function(account) {
      Task.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(Task.web3Provider);

      //web3.eth.defaultAccount = web3.eth.accounts[0];

      Task.account=account;
      web3.eth.getAccounts(function(error, accounts) {
        //Task.account = accounts[0];
        //console.log("account: " + Task.account);
      });

      Task.contracts.noteContract = contract(noteContract_artifacts);
      Task.contracts.noteContract.setProvider(Task.web3Provider);

      Task.contracts.noteContract.deployed().then(function(instance) {
        Task.noteInstance = instance;

      }).catch(function(e) {
        console.log(e.message);
      });
      //console.log("App.noteIntance: " + App.noteIntance);
      },


    addTask: function(account,name,flag,price,sort,date,info){
        Task.initWeb3(account);

        Task.contracts.noteContract.deployed().then(function(instance) {
        Task.noteInstance = instance;

        Task.noteInstance.createTask(name,flag,price,sort,date,info, {from: account}).then(function(result) { 
            console.log(result);
        }).catch(function (err) {
            console.log(err.message);
        }); 
        }).catch(function(e) {
        console.log(e.message);
        });

    },

    getTask: function(account){
      Task.initWeb3(account);
        Task.contracts.noteContract.deployed().then(function(instance) {
            Task.noteInstance = instance;
    
            Task.noteInstance.allTasks(account,0).then(function(task) { 
                console.log(task.info+'\n');
            }).catch(function (err) {
                console.log(err.message);
            }); 
            }).catch(function(e) {
            console.log(e.message);
            });
    },

    getTaskLen: function(account){
      Task.initWeb3(account);
      var promise = new Promise(function (resolve, reject) {
      Task.contracts.noteContract.deployed().then(function(instance) {
          Task.noteInstance = instance;
  
          Task.noteInstance.getTasksLen(account).then(function(res) { 
              resolve(res);
          }).catch(function (err) {
              console.log(err.message);
          }); 
          }).catch(function(e) {
          console.log(e.message);
          });
        });
      promise.then(function (value) {
        //console.log(parseInt(value)+2);
        return value;
        // success
        }, function (err) {
        // failure
        return err;
      });
      return promise;
  }
}

//Task.initWeb3();

message={
name:"扫地",
flag:0,
price:20,
sort:"保洁清洗",
date:0,
info:"第一条家务"
}


//Task.addTask("0xaEE2013804e59f10bE75AB5944D9d6E416c5CfBe","扫地",0,20,"保洁清洗",0,"第一条家务");
//Task.getTask("0x0302f4512E02b7DF7259fFb373ecfEdfD50DB80E");
module.exports = Task;

