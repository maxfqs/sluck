import $ from "../client/jquery"
import {Model} from "../interface/client-model"
import {socket} from "../client/socket"


const $channelContent = $("body").find(">#app >#chat >#channel-content");
const $messageContainer = $channelContent.find(">#template >.message-container");


export default class MessageContainer {
    private static containers: { [id: number] : MessageContainer} = {};
    private $: JQuery
    private chanID: number

    constructor(chanID: number) {
        this.$ = $messageContainer.clone();
        this.chanID = chanID;

        MessageContainer.containers[chanID] = this;
        $channelContent.append(this.$);
    }

    /** Static - Return a channel by id */
    static get(id: number) {
        return MessageContainer.containers[id];
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
    MessageContainer.get(id).appendMessage(message);
})
