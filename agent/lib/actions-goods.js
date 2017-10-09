module.exports = {
    events: {
        didSave: function (segment) {
            console.log('Segment ' + segment.meta.linkHash + ' was saved!');
        }
    },

    /**
     * Creates a new warehouse goods tracker.
     * @param {string} warehouse - the name of the warehouse
     */
    init: function (warehouse) {
        // Save the warehouse and initialize an empty map of items.
        this.state.warehouse = warehouse;
        this.state.items = {};

        // Create the first segment.
        this.append();
    },

    /**
       * Store a new item inside the warehouse.
       * @param {string} id - a unique identifier for the item
       * @param {string} description - a description of the item
       */
    storeItem: function (id, description) {
        if (!id) {
            return this.reject('id is required');
        }
        if (!description) {
            return this.reject('description is required');
        }

        // Make sure ID doesn't already exist.
        if (this.state.items[id]) {
            return this.reject('this item is already inside the warehouse');
        }

        // Insert new item.
        this.state.items[id] = {
            description: description
        };

        // Append the new segment.
        this.append();
    },
};
