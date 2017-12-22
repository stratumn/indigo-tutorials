import Agent from '@indigoframework/agent';
import actions from '../lib/actions-goods';

describe('actions-goods', () => {

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

    describe('#storeItem()', () => {
        it('updates the state correctly', () => {
            return map
                .init('storage1')
                .then(link => {
                    return map.storeItem('box', 'a big box');
                })
                .then(link => {
                    link.state.items['box'].should.deepEqual({
                        description: 'a big box'
                    });
                });
        });

        it('requires an id', () => {
            return map
                .init('faulty-storage')
                .then(link => {
                    return map.storeItem(null, 'unknown item');
                })
                .then(link => {
                    throw new Error('link should not have been created');
                })
                .catch(err => {
                    err.message.should.be.exactly('id is required');
                });
        });

        it('requires a description', () => {
            return map
                .init('faulty-storage')
                .then(link => {
                    return map.storeItem('uninteresting-box', null);
                })
                .then(link => {
                    throw new Error('link should not have been created');
                })
                .catch(err => {
                    err.message.should.be.exactly('description is required');
                });
        });

        it('cannot store the same item twice', () => {
            return map
                .init('storage1')
                .then(link => {
                    return map.storeItem('box', 'a big box');
                })
                .then(link => {
                    return map.storeItem('box', 'the same big box');
                })
                .then(link => {
                    throw new Error('link should not have been created');
                })
                .catch(err => {
                    err.message.should.be.exactly('this item is already inside the warehouse');
                });
        });
    });
});
