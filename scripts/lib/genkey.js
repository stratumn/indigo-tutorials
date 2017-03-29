var bitcore = require('bitcore-lib');

var privateKey = new bitcore.PrivateKey();
var publicKey = bitcore.PublicKey(privateKey);
var address = privateKey.toAddress();

console.log('Address:\t', address.toString());
console.log('Public key:\t', publicKey.toString());
console.log('Private key:\t', privateKey.toString());
