class Ping extends Event {

    /*
        Init Event
    */
    constructor(payload) {
        /*
            Model to validate Payload
        */
        let model = {
            timestamp: 0
        }

        super(payload, model);
    }

    /*
        Handle Event
    */
    async handle() {
        /*
            Keep Connection alive
        */
        tickSystem.executeAfterSeconds(5, () => {
            eventManager.send(new Ping({timestamp: Date.now()}))
        });

        // GET LATENCY
        let latency = Date.now() - this.payload.timestamp;

        // SET PING STATUS
        $("#ping").text(`${latency}ms`);

        // COLOR CODE LATENCIES
        if(latency >= 35 && latency < 69) {
            $("#ping").parent().css("color","var(--orange)");
        } else if(latency >= 70) {
            $("#ping").parent().css("color","var(--red)");
        } else {
            $("#ping").parent().css("color","var(--green)");
        }
    }
}