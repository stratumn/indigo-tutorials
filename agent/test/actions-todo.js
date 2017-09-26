var processify = require('stratumn-agent').processify;
var actions = require('../lib/actions-todo');

describe('actions-todo', function() {

  // Transform our actions into a process before every test
  var map;
  beforeEach(function() {
    map = processify(actions);
  });

  describe('#init()', function() {

    it('sets the state correctly', function() {
      return map
        .init('TODO')
        .then(function(link) {
          link.state.title.should.be.exactly('TODO');
          link.state.items.should.be.an.Object();
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

    it('updates the state correctly', function() {
      return map
        .init('TODO')
        .then(function(link) {
          return map.addItem('laundry', 'Do laundry!');
        })
        .then(function(link) {
          link.state.items.should.deepEqual({
            laundry: {
              description: 'Do laundry!',
              complete: false
            }
          });
        });
    });

    it('requires an ID', function() {
      return map
        .init('TODO!')
        .then(function(link) {
          return map.addItem(null, 'Do laundry!');
        })
        .then(function(link) {
          throw new Error('link should not have been created');
        })
        .catch(function(err) {
          err.message.should.be.exactly('ID required');
        });
    });

    it('requires a description', function() {
      return map
        .init('TODO!')
        .then(function(link) {
          return map.addItem('laundry');
        })
        .then(function(link) {
          throw new Error('link should not have been created');
        })
        .catch(function(err) {
          err.message.should.be.exactly('description required');
        });
    });

    it('requires a unique ID', function() {
      return map
        .init('TODO!')
        .then(function(link) {
          return map.addItem('laundry', 'Do laundry!');
        })
        .then(function(link) {
          return map.addItem('laundry', 'Do laundry again!');
        })
        .then(function(link) {
          throw new Error('link should not have been created');
        })
        .catch(function(err) {
          err.message.should.be.exactly('item already exists');
        });
    });

  });

  describe('#completeItem()', function() {

    it('updates the state correctly', function() {
      return map
        .init('TODO')
        .then(function(link) {
          return map.addItem('laundry', 'Do laundry!');
        })
        .then(function(link) {
          return map.completeItem('laundry');
        })
        .then(function(link) {
          link.state.items.should.deepEqual({
            laundry: {
              description: 'Do laundry!',
              complete: true
            }
          });
        });
    });

    it('requires an ID', function() {
      return map
        .init('TODO!')
        .then(function(link) {
          return map.completeItem();
        })
        .then(function(link) {
          throw new Error('link should not have been created');
        })
        .catch(function(err) {
          err.message.should.be.exactly('ID required');
        });
    });

    it('requires the item to exist', function() {
      return map
        .init('TODO!')
        .then(function(link) {
          return map.completeItem('laundry');
        })
        .then(function(link) {
          throw new Error('link should not have been created');
        })
        .catch(function(err) {
          err.message.should.be.exactly('item not found');
        });
    });

    it('requires the item not to be complete', function() {
      return map
        .init('TODO!')
        .then(function(link) {
          return map.addItem('laundry', 'Do laundry!');
        })
        .then(function(link) {
          return map.completeItem('laundry');
        })
        .then(function(link) {
          return map.completeItem('laundry');
        })
        .then(function(link) {
          throw new Error('link should not have been created');
        })
        .catch(function(err) {
          err.message.should.be.exactly('item already complete');
        });
    });

  });

});
