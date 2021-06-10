class EventManager {

    constructor() {
        this.ident = null;
        console.log("Event System loaded!");
    }

    /*
        Sending & Receiving
    */
    handle(json) {
        try {
            //CHECK IF UUID MATCHES => ABORT
            if(json.ident == this.ident) {
                return;
            }

            let event = this.decode(json);
            //CHECK IF EVENT EXISTS
            if(event == null) {
                return;
            }

            //RECALCULATE VALIDITY
            event.isValid = event.validate();

            //ONLY EXECUTE EVENT IF VALID
            if(event.isValid) {
                event.handle();
            }

        } catch(e) {
            console.log(e);
        }
    }

    send(event) {

        //DECODING JSON
        let json = this.encode(event);

        //APPENDING IDENT
        json.ident = this.ident;

        if(ws.readyState != 1) {
            return;
        }

        //SENDING EVENT
        ws.send(JSON.stringify(json));
    }

    /*
        Event Encoding
    */
    encode(event) {
        return event.json();
    }

    decode(json) {
        if(!json.name) {
            return null;
        }

        if(!events[json.name]) {
            return null;
        }

        return Object.assign(new events[json.name], json);
    }

}