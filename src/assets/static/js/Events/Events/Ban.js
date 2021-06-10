class Ban extends Event {

    /*
        Init Event
    */
    constructor(payload) {
        /*
            Model to validate Payload
        */
        let model = {
            session: "",
            userID: "",
            reason: "",
            result: ""
        }

        super(payload, model);
    }

    /*
        Handle Event
    */
    async handle() {
        /*
            Logs Result of Ban
        */
        console.log(this.payload.result);
    }
}