export default {
  events: {
    didSave(segment) {
      console.log(`Segment ${segment.meta.linkHash} was saved!`);
    }
  },

  name: "TODO list",

  init(title) {
    console.log("action", title);
    if (!title) {
      return this.reject("a title is required");
    }

    this.state = {
      title: title
    };

    return this.append();
  },

  addItem(item) {
    this.state = {
      item: item
    };

    return this.append();
  },

  completeItem() {
    return this.append();
  }
};
