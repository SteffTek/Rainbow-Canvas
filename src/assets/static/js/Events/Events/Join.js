class Join extends Event {

    /*
        Init Event
    */
    constructor(payload) {
        /*
            Model to validate Payload
        */
        let model = {
            imageData: "",
            timer: 0
        }

        super(payload, model);
    }

    /*
        Handle Event
    */
    async handle() {
        /*
            Inform User about past session
        */
        room.setImage(this.payload.imageData);
        room.setTimer(this.payload.timer);
    }
}