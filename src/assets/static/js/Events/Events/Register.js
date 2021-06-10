class Register extends Event {

    /*
        Init Event
    */
    constructor(payload) {
        /*
            Model to validate Payload
        */
        let model = {
            ident: "",
            session: "",
        }

        super(payload, model);
    }

    /*
        Handle Event
    */
    async handle() {
        /*
            Registers Instance on Server
        */
        var payload = this.payload;
        payload.session = sessionID;

        eventManager.send(new Register(payload));
    }
}