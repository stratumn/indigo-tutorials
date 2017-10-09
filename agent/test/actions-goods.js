var processify = require('stratumn-agent').processify;
var actions = require('../lib/actions-goods');

describe('actions-goods', function () {

    // Transform our actions into a process before every test
    var map;
    beforeEach(function () {
        map = processify(actions);
    });

    describe('#init()', function () {

        it('sets the state correctly', function () {
            return map
                .init('storage1')
                .then(function (link) {
                    link.state.warehouse.should.be.exactly('storage1');
                });
        });

    });

    describe('#storeItem()', function () {

        it('updates the state correctly', function () {
            return map
                .init('storage1')
                .then(function (link) {
                    return map.storeItem('box', 'a big box');
                })
                .then(function (link) {
                    link.state.items['box'].should.deepEqual({
                        description: 'a big box'
                    });
                });
        });

        it('requires an id', function () {
            return map
                .init('faulty-storage')
                .then(function (link) {
                    return map.storeItem(null, 'unknown item');
                })
                .then(function (link) {
                    throw new Error('link should not have been created');
                })
                .catch(function (err) {
                    err.message.should.be.exactly('id is required');
                });
        });

        it('requires a description', function () {
            return map
                .init('faulty-storage')
                .then(function (link) {
                    return map.storeItem('uninteresting-box', null);
                })
                .then(function (link) {
                    throw new Error('link should not have been created');
                })
                .catch(function (err) {
                    err.message.should.be.exactly('description is required');
                });
        });

        it('cannot store the same item twice', function () {
            return map
                .init('storage1')
                .then(function (link) {
                    return map.storeItem('box', 'a big box');
                })
                .then(function (link) {
                    return map.storeItem('box', 'the same big box');
                })
                .then(function (link) {
                    throw new Error('link should not have been created');
                })
                .catch(function (err) {
                    err.message.should.be.exactly('this item is already inside the warehouse');
                });
        });

    });

});
