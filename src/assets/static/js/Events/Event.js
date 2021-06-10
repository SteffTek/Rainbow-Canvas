class Event {

    /*
        Init Event
    */
    constructor(payload = {}, model = {}) {
        this.name = this.constructor.toString().split('(' || /s+/)[0].split(' ' || /s+/)[1];
        this.payload = payload;
        this.model = model;
        this.isValid = this.validate();
    }

    /*
        Handle Event
    */
    handle(ws) { }

    /*
        Validation
    */
    validate() {
        var isValid = true;

        function recursion(input, model) {
            for (let key in model) {
                if (!input.hasOwnProperty(key)) {
                    isValid = false;
                    return;
                } else if (typeof model[key] !== typeof input[key]) {
                    isValid = false;
                    return;
                }

                if (typeof model[key] === 'object' && model[key] !== null) {

                    //CHECK IF BOTH ARE OBJECTS OR ARRAYS
                    if (Array.isArray(model[key]) !== Array.isArray(input[key])) {
                        isValid = false;
                        return;
                    }

                    //IF ARRAY => DON'T GO FURTHER DOWN
                    if (!Array.isArray(model[key])) {
                        recursion(input[key], model[key]);
                    }
                }
            }
        }

        //START RECURSION
        recursion(this.payload, this.model);

        return isValid;
    }

    /*
        Import / Export
    */
    json() {
        return this;
    }
}