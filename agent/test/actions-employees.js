import Agent from '@indigoframework/agent';
import actions from '../lib/actions-employees';

describe('actions-employees', () => {

    // Transform our actions into a process before every test
    let map;
    beforeEach(() => {
        map = Agent.processify(actions);
    });

    describe('#init()', () => {
        it('sets the state correctly', () => {
            return map
                .init('storage1')
                .then(link => {
                    link.state.warehouse.should.be.exactly('storage1');
                });
        });
    });

    describe('#enter()', () => {
        it('correctly stores the employee', () => {
            return map
                .init('storage1')
                .then(link => {
                    return map.enter('john');
                })
                .then(link => {
                    link.state.employees['john'].should.have.length(1);
                    link.state.employees['john'][0].activity.should.be.exactly('enter');
                });
        });

        it('requires the employee name', () => {
            return map
                .init('storage1')
                .then(link => {
                    return map.enter(null);
                })
                .then(link => {
                    throw new Error('link should not have been created');
                })
                .catch(err => {
                    err.message.should.be.exactly('employee name is required');
                });
        });

        it('correctly stores multiple employees', () => {
            return map
                .init('storage1')
                .then(link => {
                    return map.enter('bob');
                })
                .then(link => {
                    return map.enter('jim');
                })
                .then(link => {
                    link.state.employees['bob'].should.have.length(1);
                    link.state.employees['jim'].should.have.length(1);
                });
        });
    });

    describe('#leave()', () => {
        it('correctly stores the employee activity', () => {
            return map
                .init('storage1')
                .then(link => {
                    return map.enter('patrick');
                })
                .then(link => {
                    return map.leave('patrick');
                })
                .then(link => {
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
