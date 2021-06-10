class Canvas extends Event {

    /*
        Init Event
    */
    constructor(payload) {
        /*
            Model to validate Payload
        */
        let model = {
            imageData: ""
        }

        super(payload, model);
    }

    /*
        Handle Event
    */
    async handle() {
        /*
            Handles Image Data
        */
        room.setImage(this.payload.imageData);
    }
}