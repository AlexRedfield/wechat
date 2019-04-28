var noteContract_artifacts = require('../build/contracts/NoteContract.json')
var Web3 = require('web3');
var contract = require('truffle-contract')
const HOST = "http://localhost:8080";



App = {
    web3Provider: null,
    contracts: {},
    account: null,
    noteInstance: null,
    noteLength : 0,
  
    initWeb3:  function() {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);

      web3.eth.defaultAccount = web3.eth.accounts[0];

      web3.eth.getAccounts(function(error, accounts) {
        App.account = accounts[0];
        console.log("account: " + App.account);
      });

      App.contracts.noteContract = contract(noteContract_artifacts);
      App.contracts.noteContract.setProvider(App.web3Provider);

      App.contracts.noteContract.deployed().then(function(instance) {
        App.noteInstance = instance;

      }).catch(function(e) {
        console.log(e.message);
      });
      //console.log("App.noteIntance: " + App.noteIntance);
      },

      addNote: function(message){
        App.contracts.noteContract.deployed().then(function(instance) {
          App.noteInstance = instance;
          //message="This is a good new note!";
          App.noteInstance.addNote(message, {from: App.account}).then(function(result) { 

            for (var i = 0; i < result.logs.length; i++) {
              var log = result.logs[i];
              if (log.event == "NewNote") {
                console.log("reload"); 
                break;
              }
            }
          }).catch(function (err) {
            console.log(err.message);
          }); 
        }).catch(function(e) {
          console.log(e.message);
        });

      },

      readNote:function(){
        App.contracts.noteContract.deployed().then(function(instance) {
          App.noteInstance = instance;
          
          App.noteInstance.getNotesLen(App.account).then(function(len) {
          console.log(len + "条笔记");
          App.noteLength = len;
            App.noteInstance.notes(App.account, len-1).then(function(note) {
            console.log(note+'\n');
            }).catch(function(err) {
              console.log(err.message);
            });
          
            }).catch(function(err) {
              console.log(err.message);
        });
      });
          
      }

      

    


    
  };

  //App.initWeb3();
  //App.addNote("This is a good new note!");
  //App.readNote();

  module.exports = App;