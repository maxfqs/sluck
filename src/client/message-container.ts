import $ from "../client/jquery"
import {Model} from "../interface/client-model"
import {socket} from "../client/socket"
import User from "../client/user"


const $channelContent = $("body").find(">#app >#chat >#channel-content");
const $messageContainer = $channelContent.find(">#template >.message-container");
const $message = $channelContent.find(">#template >.message");


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
        let div = createMessage(message);
        this.$.append(div);
        this.$.scrollTop(this.$.prop("scrollHeight"));
    }
}


/** Create a message div */
function createMessage(data: Model<"message">) {
    let clone = $message.clone();
    let formatedMessage = data.text.replace(/\r?\n/g, "<br />");
    let name = User.get(data.user).getName();

    clone.find(">.user").text(name);
    clone.find(">.text").html(formatedMessage);

    clone.data("id", data.id);

    return clone;
}


socket.on("newMessage", function(message) {
    let id = message.channel;
    MessageContainer.get(id).appendMessage(message);
})
