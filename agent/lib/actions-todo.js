module.exports = {

  /**
   * Creates a new TODO list.
   * @param {string} title - a name for the list
   */
  init: function(title) {
    // Validate parameters.
    if (!title) {
      return this.reject('title required');
    }

    // Save the title and initialize an empty map of list items.
    this.state.title = title;
    this.state.items = {};

    // Create the first segment.
    this.append();
  },

  /**
   * Adds an item to the TODO list.
   * @param {string} id - a unique identifier for the item
   * @param {string} description - a description of the item
   */
  addItem: function(id, description) {
    // Validate parameters.
    if (!id) {
      return this.reject('ID required');
    }
    if (!description) {
      return this.reject('description required');
    }

    // Make sure ID doesn't already exist.
    if (this.state.items[id]) {
      return this.reject('item already exists')
    }

    // Insert new item.
    this.state.items[id] = {
      description: description,
      complete: false
    };

    // Append the new segment.
    this.append();
  },

  /**
   * Completes an item in the TODO list.
   * @param {string} id - the unique identifier of the item
   */
  completeItem: function(id) {
    // Validate parameter.
    if (!id) {
      return this.reject('ID required');
    }

    // Find the item.
    var item = this.state.items[id];

    // Make sure the item exists.
    if (!item) {
      return this.reject('item not found');
    }

    // Make sure the item isn't already complete.
    if (item.complete) {
      return this.reject('item already complete')
    }

    // Update item.
    item.complete = true;

    // Append the new segment.
    this.append();
  }
};
