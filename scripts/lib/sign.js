var readline = require('readline');
var bitcore = require('bitcore-lib');
var Message = require('bitcore-message');

// Readline is a builtin node module to read a line from the user.
var rl = readline.createInterface();

// Get the message to sign.
rl.question('Message: ', function(msg) {
  // Get the private key.
  rl.question('Private key: ', function(key) {
    // Compute the signature.
    var privateKey = new bitcore.PrivateKey(key);
    var message = new Message(msg);
    var signature = message.sign(privateKey);

    console.log(signature);

    rl.close();
  });
});
