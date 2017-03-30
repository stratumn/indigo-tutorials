var bitcore = require('bitcore-lib');
var Message = require('bitcore-message');
var mockAgent = require('stratumn-mock-agent').mockAgent;
var actions = require('../lib/actions');

// Test addresses and signatures.
var aliceAddress = '15z7Ts1v72yEoC7tp8gvMogdBgeEP7AQCX';
var aliceKey = 'a7bbd165ac54394f90112708bda94140493b7415c778b7b5515c9da22e80d701';
var bobAddress = '18kHBf7vDxAWeqpMHNs3KDC6VSTL2gKAN5';
var bobKey = '40f37e063ff176e3282ce6508d229938a0983503bc41af3974280aac9c97a942';

// Helpers to generate signatures.
function aliceSign(msg) {
  var privateKey = new bitcore.PrivateKey(aliceKey);
  var message = new Message(msg);
  return message.sign(privateKey);
}
function bobSign(msg) {
  var privateKey = new bitcore.PrivateKey(bobKey);
  var message = new Message(msg);
  return message.sign(privateKey);
}

describe('actions', function() {

  // Mock our agent before every test.
  var map;
  beforeEach(function() {
    map = mockAgent(actions);
  });

  describe('#init()', function() {

    it('sets the state and meta correctly', function() {
      return map
        .init('TODO', aliceAddress)
        .then(function(link) {
          link.state.should.deepEqual({
            title: 'TODO',
            adminAddress: aliceAddress
          });
          link.meta.tags.should.deepEqual(['list']);
        });
    });

    it('requires a title', function() {
      return map
        .init()
        .then(function(link) {
          throw new Error('link should not have been created');
        })
        .catch(function(err) {
          err.message.should.be.exactly('title required');
        });
    });

    it('requires an admin adress', function() {
      return map
        .init('TODO')
        .then(function(link) {
          throw new Error('link should not have been created');
        })
        .catch(function(err) {
          err.message.should.be.exactly('admin address required');
        });
    });
  });

  describe('#addItem()', function() {

    it('updates the state and meta correctly', function() {
      var signature;
      return map
        .init('TODO', aliceAddress)
        .then(function(link) {
          signature = aliceSign('abc addItem Do laundry! ' + bobAddress);
          link.meta.prevLinkHash = 'abc';
          return mockAgent(actions, link).addItem('Do laundry!', bobAddress, signature);
        })
        .then(function(link) {
          link.state.should.deepEqual({
            description: 'Do laundry!',
            assigneeAddress: bobAddress,
            adminSignature: signature
          });
          link.meta.tags.should.deepEqual(['item']);
        });
    });

    it('requires a description', function() {
      return map
        .init('TODO!', aliceAddress)
        .then(function(link) {
          return map.addItem();
        })
        .then(function(link) {
          throw new Error('link should not have been created');
        })
        .catch(function(err) {
          err.message.should.be.exactly('description required');
        });
    });

    it('requires an assignee address', function() {
      return map
        .init('TODO!', aliceAddress)
        .then(function(link) {
          return map.addItem('Do laundry!');
        })
        .then(function(link) {
          throw new Error('link should not have been created');
        })
        .catch(function(err) {
          err.message.should.be.exactly('assignee address required');
        });
    });

    it('requires an admin signature', function() {
      return map
        .init('TODO!', aliceAddress)
        .then(function(link) {
          return map.addItem('Do laundry!', bobAddress);
        })
        .then(function(link) {
          throw new Error('link should not have been created');
        })
        .catch(function(err) {
          err.message.should.be.exactly('admin signature required');
        });
    });

    it('must append a list segment', function() {
      return map
        .init('TODO!', aliceAddress)
        .then(function(link) {
          var signature = aliceSign('abc addItem Do laundry! ' + bobAddress);
          link.meta.prevLinkHash = 'abc';
          return mockAgent(actions, link).addItem('Do laundry!', bobAddress, signature);
        })
        .then(function(link) {
          var signature = aliceSign('123 addItem Do laundry again! ' + bobAddress);
          link.meta.prevLinkHash = '123';
          return mockAgent(actions, link).addItem('Do laundry again!', bobAddress, signature)
        })
        .then(function(link) {
          throw new Error('link should not have been created');
        })
        .catch(function(err) {
          err.message.should.be.exactly('not a list');
        });
    });

    it('requires a valid admin signature', function() {
      return map
        .init('TODO', aliceAddress)
        .then(function(link) {
          var signature = bobSign('abc addItem Do laundry! ' + bobAddress);
          link.meta.prevLinkHash = 'abc';
          return mockAgent(actions, link).addItem('Do laundry!', bobAddress, signature);
        })
        .then(function(link) {
          throw new Error('link should not have been created')
        })
        .catch(function(err) {
          err.message.should.be.exactly('invalid admin signature');
        });
    });

  });

  describe('#completeItem()', function() {

    it('updates the state and meta correctly', function() {
      var signature;
      return map
        .init('TODO', aliceAddress)
        .then(function(link) {
          signature = aliceSign('abc addItem Do laundry! ' + bobAddress);
          link.meta.prevLinkHash = 'abc';
          return map.addItem('Do laundry!', bobAddress, signature);
        })
        .then(function(link) {
          signature = bobSign('123 completeItem');
          link.meta.prevLinkHash = '123';
          return map.completeItem(signature);
        })
        .then(function(link) {
          link.state.should.deepEqual({
            assigneeSignature: signature
          });
          link.meta.tags.should.deepEqual(['completion']);
        });
    });

    it('requires an assignee signature', function() {
      return map
        .init('TODO!', aliceAddress)
        .then(function(link) {
          var signature = aliceSign('abc addItem Do laundry! ' + bobAddress);
          link.meta.prevLinkHash = 'abc';
          return map.addItem('Do laundry!', bobAddress, signature);
        })
        .then(function(link) {
          return map.completeItem();
        })
        .then(function(link) {
          throw new Error('link should not have been created');
        })
        .catch(function(err) {
          err.message.should.be.exactly('assignee signature required');
        });
    });

    it('must append an item segment', function() {
      return map
        .init('TODO!', aliceAddress)
        .then(function(link) {
          var signature = bobSign('123 completeItem');
          link.meta.prevLinkHash = '123';
          return map.completeItem(signature);
        })
        .then(function(link) {
          throw new Error('link should not have been created');
        })
        .catch(function(err) {
          err.message.should.be.exactly('not an item');
        });
    });

    it('requires a valid assignee signature', function() {
      return map
        .init('TODO', aliceAddress)
        .then(function(link) {
          var signature = aliceSign('abc addItem Do laundry! ' + bobAddress);
          link.meta.prevLinkHash = 'abc';
          return map.addItem('Do laundry!', bobAddress, signature);
        })
        .then(function(link) {
          var signature = aliceSign('123 completeItem');
          link.meta.prevLinkHash = '123';
          return map.completeItem(signature);
        })
        .then(function(link) {
          throw new Error('link should not have been created');
        })
        .catch(function(err) {
          err.message.should.be.exactly('invalid assignee signature');
        });
    });

  });

});
