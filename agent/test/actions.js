var mockAgent = require('stratumn-mock-agent').mockAgent;
var actions = require('../lib/actions');

describe('actions', function() {

  // Mock our agent before every test.
  var map;
  beforeEach(function() {
    map = mockAgent(actions);
  });

  describe('#init()', function() {

    it('sets the state and meta correctly', function() {
      return map
        .init('TODO')
        .then(function(link) {
          link.state.title.should.be.exactly('TODO');
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

  });

  describe('#addItem()', function() {

    it('updates the state and meta correctly', function() {
      return map
        .init('TODO')
        .then(function(link) {
          return map.addItem('Do laundry!');
        })
        .then(function(link) {
          link.state.should.deepEqual({
            description: 'Do laundry!'
          });
          link.meta.tags.should.deepEqual(['item']);
        });
    });

    it('requires a description', function() {
      return map
        .init('TODO!')
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

    it('must append a list segment', function() {
      return map
        .init('TODO!')
        .then(function(link) {
          return map.addItem('Do laundry!');
        })
        .then(function(link) {
          return map.addItem('Do laundry again!');
        })
        .then(function(link) {
          throw new Error('link should not have been created');
        })
        .catch(function(err) {
          err.message.should.be.exactly('not a list');
        });
    });

  });

  describe('#completeItem()', function() {

    it('updates the state and meta correctly', function() {
      return map
        .init('TODO')
        .then(function(link) {
          return map.addItem('Do laundry!');
        })
        .then(function(link) {
          return map.completeItem();
        })
        .then(function(link) {
          link.state.should.deepEqual({});
          link.meta.tags.should.deepEqual(['completion']);
        });
    });

    it('must append an item segment', function() {
      return map
        .init('TODO!')
        .then(function(link) {
          return map.completeItem();
        })
        .then(function(link) {
          throw new Error('link should not have been created');
        })
        .catch(function(err) {
          err.message.should.be.exactly('not an item');
        });
    });

  });

});
