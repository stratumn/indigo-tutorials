import Agent from "@stratumn/agent";
import actions from "../lib/actions-todo";

describe("actions-todo", () => {
  // Transform our actions into a process before every test
  let map;

  beforeEach(() => {
    map = Agent.processify(actions);
  });

  describe("#init()", () => {
    it("sets the state correctly", () => {
      return map.init("TODO").then(link => {
        link.state.title.should.be.exactly("TODO");
        link.state.items.should.be.an.Object();
      });
    });
  });

  describe("#addItem()", () => {
    it("updates the state correctly", () => {
      return map
        .init("TODO")
        .then(link => {
          return map.addItem("laundry", "Do laundry!");
        })
        .then(link => {
          link.state.items.should.deepEqual({
            laundry: {
              description: "Do laundry!",
              complete: false
            }
          });
        });
    });

    it("requires a unique ID", () => {
      return map
        .init("TODO!")
        .then(link => {
          return map.addItem("laundry", "Do laundry!");
        })
        .then(link => {
          return map.addItem("laundry", "Do laundry again!");
        })
        .then(link => {
          throw new Error("link should not have been created");
        })
        .catch(err => {
          err.message.should.be.exactly("item already exists");
        });
    });
  });

  describe("#completeItem()", () => {
    it("updates the state correctly", () => {
      return map
        .init("TODO")
        .then(link => {
          return map.addItem("laundry", "Do laundry!");
        })
        .then(link => {
          return map.completeItem("laundry");
        })
        .then(link => {
          link.state.items.should.deepEqual({
            laundry: {
              description: "Do laundry!",
              complete: true
            }
          });
        });
    });

    it("requires the item to exist", () => {
      return map
        .init("TODO!")
        .then(link => {
          return map.completeItem("laundry");
        })
        .then(link => {
          throw new Error("link should not have been created");
        })
        .catch(err => {
          err.message.should.be.exactly("item not found");
        });
    });

    it("requires the item not to be complete", () => {
      return map
        .init("TODO!")
        .then(link => {
          return map.addItem("laundry", "Do laundry!");
        })
        .then(link => {
          return map.completeItem("laundry");
        })
        .then(link => {
          return map.completeItem("laundry");
        })
        .then(link => {
          throw new Error("link should not have been created");
        })
        .catch(err => {
          err.message.should.be.exactly("item already complete");
        });
    });
  });
});
