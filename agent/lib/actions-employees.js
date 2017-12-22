export default {
    /**
     * Creates a new warehouse employees tracker.
     * @param {string} warehouse - the name of the warehouse
     */
    init(warehouse) {
        // Save the warehouse and initialize an empty map of employee activity.
        this.state.warehouse = warehouse;
        this.state.employees = {};

        // Create the first segment.
        return this.append();
    },

    /**
     * Enter the warehouse.
     * @param {string} employee - the name of the employee
     */
    enter(employee) {
        if (!employee) {
            return this.reject('employee name is required');
        }

        // Initialize the employee activity record if needed
        if (!this.state.employees[employee]) {
            this.state.employees[employee] = [];
        }

        // Insert the current time.
        this.state.employees[employee].push({
            activity: "enter",
            date: Date.now()
        });

        // Append the new segment.
        return this.append();
    },

    /**
     * Leave the warehouse.
     * @param {string} employee - the name of the employee
     */
    leave(employee) {
        if (!employee) {
            return this.reject('employee name is required');
        }

        // Initialize the employee activity record if needed
        if (!this.state.employees[employee]) {
            this.state.employees[employee] = [];
        }

        // Insert the current time.
        this.state.employees[employee].push({
            activity: "leave",
            date: Date.now()
        });

        // Append the new segment.
        return this.append();
    },
};
