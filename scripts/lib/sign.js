var readline = require('readline');
var bitcore = require('bitcore-lib');
var Message = require('bitcore-message');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Message to sign: ', function(msg) {

  rl.question('Private key: ', function(key) {
    var privateKey = new bitcore.PrivateKey(key);
    var message = new Message(msg);
    var signature = message.sign(privateKey);

    console.log(signature);

    rl.close();
  });
});
