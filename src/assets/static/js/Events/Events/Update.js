class Update extends Event {

    /*
        Init Event
    */
    constructor(payload) {
        /*
            Model to validate Payload
        */
        let model = {
            users: 0,
            timer: 0,
            pixels: 0,
        }

        super(payload, model);
    }

    /*
        Handle Event
    */
    async handle(ws) {
        /*
            Update Information
        */
        room.setUsers(this.payload.users);
        room.setTimer(this.payload.timer);
        room.setPixels(this.payload.pixels);
    }
}