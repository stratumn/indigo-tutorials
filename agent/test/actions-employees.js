var processify = require('stratumn-agent').processify;
var actions = require('../lib/actions-employees');

describe('actions-employees', function () {

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

    describe('#enter()', function () {

        it('correctly stores the employee', function () {
            return map
                .init('storage1')
                .then(function (link) {
                    return map.enter('john');
                })
                .then(function (link) {
                    link.state.employees['john'].should.have.length(1);
                    link.state.employees['john'][0].activity.should.be.exactly('enter');
                });
        });

        it('correctly stores multiple employees', function () {
            return map
                .init('storage1')
                .then(function (link) {
                    return map.enter('bob');
                })
                .then(function (link) {
                    return map.enter('jim');
                })
                .then(function (link) {
                    link.state.employees['bob'].should.have.length(1);
                    link.state.employees['jim'].should.have.length(1);
                });
        });
    });

    describe('#leave()', function () {

        it('correctly stores the employee activity', function () {
            return map
                .init('storage1')
                .then(function (link) {
                    return map.enter('patrick');
                })
                .then(function (link) {
                    return map.leave('patrick');
                })
                .then(function (link) {
                    link.state.employees['patrick'].should.have.length(2);
                    var enterActivity = link.state.employees['patrick'][0];
                    var leaveActivity = link.state.employees['patrick'][1];
                    enterActivity.activity.should.be.exactly('enter');
                    leaveActivity.activity.should.be.exactly('leave');
                    (enterActivity.date <= leaveActivity.date).should.be.true();
                });
        });

    });

});
