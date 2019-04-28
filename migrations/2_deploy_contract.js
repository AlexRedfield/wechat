var Note = artifacts.require("./NoteContract.sol");
var Task = artifacts.require("./TaskManage.sol");
module.exports = function(deployer) {
  deployer.deploy(Note);
  deployer.deploy(Task);
};
