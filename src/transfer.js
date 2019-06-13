var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

/*
web3.eth.sendTransaction({
    to:"0x0302f4512E02b7DF7259fFb373ecfEdfD50DB80E",
    from:"0xE14ea2c52946Bf720ec4A0cf475bA5Fcdbd78912",
    value:20000000000000000000
});
*/
/*
var trans=function(from, to, amount){
    web3.eth.sendTransaction({
        from:from,
        to:to,
        value:web3.utils.toWei(amount, 'ether')
    }).then(function(receipt){
        console.log(receipt);
    });
}*/

var trans=function(from, to, amount){
    web3.eth.sendTransaction({
        from:from,
        to:to,
        value:amount*1000000000000000000
    })
}
exports.trans=trans;
