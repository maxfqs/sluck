import $ from "../client/jquery"
import {Model} from "../interface/client-model"
import {socket} from "../client/socket"


const $channelContent = $("body").find(">#app >#chat >#channel-content");
const $messageContainer = $channelContent.find(">#template >.message-container");

let containers: { [id: number] : MessageContainer} = {};


export default class MessageContainer {
    private $: JQuery
    private chanID: number

    constructor(chanID: number) {
        this.$ = $messageContainer.clone();
        this.chanID = chanID;

        containers[chanID] = this;
        $channelContent.append(this.$);
    }

    /** Open the container */
    open() {
        this.$.removeClass("hide");
    }

    /** Close the container */
    close() {
        this.$.addClass("hide");
    }

    /** Append message */
    appendMessage(message: Model<"message">) {
        this.$.append("<p>" + message.text + "</p>");
        this.$.scrollTop(this.$.prop("scrollHeight"));
    }
}


socket.on("newMessage", function(message) {
    let id = message.channel;
    containers[id].appendMessage(message);
})
