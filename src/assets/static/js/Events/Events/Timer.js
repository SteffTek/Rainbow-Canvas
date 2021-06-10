class Timer extends Event {

    /*
        Init Event
    */
    constructor(payload) {
        /*
            Model to validate Payload
        */
        let model = {
            time: 0
        }

        super(payload, model);
    }

    /*
        Handle Event
    */
    async handle() {
        /*
            Set's Timer
        */
        room.setTimer(this.payload.time);
    }
}