var readline = require('readline');
var bitcore = require('bitcore-lib');
var Message = require('bitcore-message');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Previous Link Hash: ', function(prevLinkHash) {
  rl.question('Username: ', function(username) {
    rl.question('User Address: ', function(address) {
      rl.question('Admin Private key: ', function(key) {
        var challenge = prevLinkHash + ' addUser ' + username + ' ' + address;
        var privateKey = new bitcore.PrivateKey(key);
        var message = new Message(challenge);
        var signature = message.sign(privateKey);

        console.log(signature);

        rl.close();
      });
    });
  });
});
