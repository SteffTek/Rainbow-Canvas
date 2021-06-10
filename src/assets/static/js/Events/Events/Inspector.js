class Inspector extends Event {

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
                r: []
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
        console.log(this.payload.pixel.r);
    }
}