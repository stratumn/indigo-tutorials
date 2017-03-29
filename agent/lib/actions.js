var Message = require('bitcore-message');

module.exports = {

  /**
   * Creates a new TODO list.
   * @param {string} title - a name for the list
   * @param {string} adminUsername - a username for the admin
   * @param {string} adminAddress - the cryptographic address for the admin
   */
  init: function(title, adminUsername, adminAddress) {
    // Validate parameters.
    if (!title) {
      return this.reject('title required');
    }
    if (!adminUsername) {
      return this.reject('admin username required');
    }
    if (!adminAddress) {
      return this.reject('admin address required');
    }

    // Save the title and initialize an empty map of list items.
    this.state.title = title;
    this.state.items = {};

    // Create the user.
    this.state.users = {};
    this.state.users[adminUsername] = { address: adminAddress };

    // Make the user the admin.
    this.state.admin = adminUsername;

    // Create the first segment.
    this.append();
  },

  /**
   * Adds a user to the TODO list.
   * The cryptographic signature of the admin should be for the message:
   *   prevLinkHash addUser username address
   * @param {string} username - a name for the user
   * @param {string} userAddress - a cryptographic address for the user
   * @param {string} adminSignature - the cryptographic signature of the admin
   */
  addUser: function(username, userAddress, adminSignature) {
    // Validate parameters.
    if (!username) {
      return this.reject('username required');
    }
    if (!userAddress) {
      return this.reject('user address required');
    }
    if (!adminSignature) {
      return this.reject('admin signature required');
    }

    // Make sure user doesn't already exist.
    if (this.state.users[username]) {
      return this.reject('user already exists');
    }

    // This is what must be signed by the admin.
    var challenge = this.meta.prevLinkHash + ' addUser ' + username + ' ' + userAddress;

    // Verify signature.
    var adminAddress = this.state.users[this.state.admin].address;

    try {
      var verified = new Message(challenge).verify(adminAddress, adminSignature);
      if (!verified) {
        return this.reject('invalid admin signature');
      }
    } catch(err) {
      return this.reject('invalid admin signature');
    }

    // Insert new user.
    this.state.users[username] = { address: userAddress };

    // Save signature as proof.
    this.meta.signature = adminSignature;

    // Append the new segment.
    this.append();
  },

  /**
   * Adds an item to the TODO list.
   * The cryptographic signature of the admin should be for the message:
   *   prevLinkHash addItem itemId description assignedUser
   * @param {string} itemId - a unique identifier for the item
   * @param {string} description - a description of the item
   * @param {string} assignedUser - the username of the assigned user
   * @param {string} adminSignature - the cryptographic signature of the admin
   */
  addItem: function(itemId, description, assignedUser, adminSignature) {
    // Validate parameters.
    if (!itemId) {
      return this.reject('item ID required');
    }
    if (!description) {
      return this.reject('description required');
    }
    if (!assignedUser) {
      return this.reject('assigned user required');
    }
    if (!adminSignature) {
      return this.reject('admin signature required');
    }

    // Make sure ID doesn't already exist.
    if (this.state.items[itemId]) {
      return this.reject('item already exists');
    }

    // Make sure the assigned user exists.
    if (!this.state.users[assignedUser]) {
      return this.reject('assigned user not found');
    }

    // This is what must be signed by the admin.
    var challenge = this.meta.prevLinkHash + ' addItem ' + itemId + ' ' + description + ' ' + assignedUser;

    // Verify signature.
    var adminAddress = this.state.users[this.state.admin].address;

    try {
      var verified = new Message(challenge).verify(adminAddress, adminSignature);
      if (!verified) {
        return this.reject('invalid admin signature');
      }
    } catch(err) {
      return this.reject('invalid admin signature');
    }

    // Insert new item.
    this.state.items[itemId] = {
      description: description,
      assignedUser: assignedUser,
      complete: false
    };

    // Save signature as proof.
    this.meta.signature = adminSignature;

    // Append the new segment.
    this.append();
  },

  /**
   * Completes an item in the TODO list.
   * The cryptographic signature of the assigned user should be for the message:
   *   prevLinkHash completeItem itemId
   * @param {string} itemId - the unique identifier of the item
   * @param {string} adminSignature - the cryptographic signature of the assigned user
   */
  completeItem: function(itemId, assignedUserSignature) {
    // Validate parameter.
    if (!itemId) {
      return this.reject('item ID required');
    }
    if (!assignedUserSignature) {
      return this.reject('assigned user signature required');
    }

    // Find the item.
    var item = this.state.items[itemId];

    // Make sure the item exists.
    if (!item) {
      return this.reject('item not found');
    }

    // Make sure the item isn't already complete.
    if (item.complete) {
      return this.reject('item already complete');
    }

    // This is what must be signed by the assigned user.
    var challenge = this.meta.prevLinkHash + ' completeItem ' + itemId;

    // Verify signature.
    var userAddress = this.state.users[item.assignedUser].address;

    try {
      var verified = new Message(challenge).verify(userAddress, assignedUserSignature);
      if (!verified) {
        return this.reject('invalid assigned user signature');
      }
    } catch(err) {
      return this.reject('invalid assigned user signature');
    }

    // Update item.
    item.complete = true;

    // Save signature as proof.
    this.meta.signature = assignedUserSignature;

    // Append the new segment.
    this.append();
  }
};
