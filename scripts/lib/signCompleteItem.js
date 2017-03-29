var readline = require('readline');
var bitcore = require('bitcore-lib');
var Message = require('bitcore-message');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Previous Link Hash: ', function(prevLinkHash) {
  rl.question('Item ID: ', function(id) {
    rl.question('Assigned User Private key: ', function(key) {
      var challenge = prevLinkHash + ' completeItem ' + id;
      var privateKey = new bitcore.PrivateKey(key);
      var message = new Message(challenge);
      var signature = message.sign(privateKey);

      console.log(signature);

      rl.close();
    });
  });
});
