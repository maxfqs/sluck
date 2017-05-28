/**
* Small implementation of the Node.js
* EventEmitter Class to use in the front-end.
* Typings is voluntary generic, it's on the consumer to declare it
*/
export default class EventEmitter {
    private events: {
        [event: string] : Function[]
    }

    constructor() {
        this.events = {};
    }

    /** Register a callback for that event */
    on(e: string, cb: Function) {
        if (this.events[e] == null) {
            this.events[e] = [];
        }

        this.events[e].push(cb);
    }

    /** Trigger the callbacks attached to that event */
    emit(e: string, args: any) {
        this.events[e].forEach( function(cb) {
            cb(args);
        })
    }
}
