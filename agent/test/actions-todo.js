import Agent from "@stratumn/agent";
import actions from "../lib/actions-todo";

describe("actions-todo", () => {
  // Transform our actions into a process before every test
  let map;

  beforeEach(() => {
    map = Agent.processify(actions);
  });

  describe("#init()", () => {
    it("sets the state and meta correctly", () => {
      return map.init("TODO").then(link => {
        link.state.title.should.be.exactly("TODO");
        link.meta.tags.should.deepEqual(["list"]);
      });
    });
  });

  describe("#addItem()", () => {
    it("updates the state and meta correctly", () => {
      return map
        .init("TODO")
        .then(link => {
          return map.addItem("Do laundry!");
        })
        .then(link => {
          link.state.should.deepEqual({
            description: "Do laundry!"
          });
          link.meta.tags.should.deepEqual(["item"]);
        });
    });

    it("must append a list segment", () => {
      return map
        .init("TODO!")
        .then(link => {
          return map.addItem("Do laundry!");
        })
        .then(link => {
          return map.addItem("Do laundry again!");
        })
        .then(link => {
          throw new Error("link should not have been created");
        })
        .catch(err => {
          err.message.should.be.exactly("not a list");
        });
    });
  });

  describe("#completeItem()", () => {
    it("updates the state and meta correctly", () => {
      return map
        .init("TODO")
        .then(link => {
          return map.addItem("Do laundry!");
        })
        .then(link => {
          return map.completeItem();
        })
        .then(link => {
          link.state.should.deepEqual({});
          link.meta.tags.should.deepEqual(["completion"]);
        });
    });

    it("must append an item segment", () => {
      return map
        .init("TODO!")
        .then(link => {
          return map.completeItem();
        })
        .then(link => {
          throw new Error("link should not have been created");
        })
        .catch(err => {
          err.message.should.be.exactly("not an item");
        });
    });
  });
});
