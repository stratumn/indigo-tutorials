var bitcore = require('bitcore-lib');

// Generate random private key.
var privateKey = new bitcore.PrivateKey();

// Derive address from the private key.
var address = privateKey.toAddress();

console.log('Address:\t', address.toString());
console.log('Private key:\t', privateKey.toString());
