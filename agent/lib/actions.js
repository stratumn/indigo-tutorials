var Message = require('bitcore-message');

/**
 * Helper that validates a signature.
 * @param {string} message - the message that was signed
 * @param {string} address - the address of the signee
 * @param {string} signature - the signature
 */
function verify(message, address, signature) {
  try {
    return new Message(message).verify(address, signature);
  } catch(err) {
    return false;
  }
}

module.exports = {

  /**
   * Creates a new TODO list.
   * @param {string} title - a name for the list
   * @param {string} adminAddress - the cryptographic address of the admin
   */
  init: function(title, adminAddress) {
    // Validate parameters.
    if (!title) {
      return this.reject('title required');
    }
    if (!adminAddress) {
      return this.reject('admin address required');
    }

    // Save the list info.
    this.state = {
      title: title,
      adminAddress: adminAddress
    };

    // Set the `list` tag.
    this.meta.tags = ['list'];

    // Create the first segment.
    this.append();
  },

  /**
   * Adds an item to the TODO list.
   * @param {string} description - a description of the item
   * @param {string} assigneeAddress - the cryptographic address of the user assigned to the item
   * @param {string} adminSignature - a signature of `{prevLinkHash} addItem {description} {assignedAddress}` by the admin
   */
  addItem: function(description, assigneeAddress, adminSignature) {
    // Validate parameters.
    if (!description) {
      return this.reject('description required');
    }
    if (!assigneeAddress) {
      return this.reject('assignee address required');
    }
    if (!adminSignature) {
      return this.reject('admin signature required');
    }

    // Make sure we are appending a list segment. It should have the `list` tag.
    if (this.meta.tags.indexOf('list') < 0) {
      return this.reject('not a list')
    }

    // This is what must be signed by the admin.
    var challenge = this.meta.prevLinkHash + ' addItem ' + description + ' ' + assigneeAddress;

    // Verify signature.
    if (!verify(challenge, this.state.adminAddress, adminSignature)) {
      return this.reject('invalid admin signature');
    }

    // Save the item info.
    this.state = {
      description: description,
      assigneeAddress: assigneeAddress,
      adminSignature: adminSignature
    };

    // Set the `item` tag.
    this.meta.tags = ['item'];

    // Append the new segment.
    this.append();
  },

  /**
   * Completes an item in the TODO list.
   * @param {string} assigneeSignature - a signature of `{prevLinkHash} completeItem` by the assignee
   */
  completeItem: function(assigneeSignature) {
    // Validate parameters.
    if (!assigneeSignature) {
      return this.reject('assignee signature required');
    }

    // Make sure we are appending an item segment. It should have the `item` tag.
    if (this.meta.tags.indexOf('item') < 0) {
      return this.reject('not an item')
    }

    // This is what must be signed by the assignee.
    var challenge = this.meta.prevLinkHash + ' completeItem';

    // Verify signature.
    if (!verify(challenge, this.state.assigneeAddress, assigneeSignature)) {
      return this.reject('invalid assignee signature');
    }

    // Save the signature as proof.
    this.state = {
      assigneeSignature: assigneeSignature
    };

    // Set the `completion` tag.
    this.meta.tags = ['completion'];

    // Append the new segment.
    this.append();
  }
};
