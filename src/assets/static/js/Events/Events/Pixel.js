class Pixel extends Event {

    /*
        Init Event
    */
    constructor(payload) {
        /*
            Model to validate Payload
        */
        let model = {
            session: "",
            pixel: {
                x: 0,
                y: 0,
                c: 0
            }
        }

        super(payload, model);
    }

    /*
        Handle Event
    */
    async handle() {
        /*
            Set's Pixel on Canvas
        */
    }
}