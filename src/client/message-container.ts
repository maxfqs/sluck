import $ from "../client/jquery"
import {Model} from "../interface/client-model"
import {socket, emit} from "../client/socket"
import User from "../client/user"


const $channelContent = $("body").find(">#app >#chat >#channel-content");
const $messageContainer = $channelContent.find(">#template >.message-container");
const $message = $channelContent.find(">#template >.message");


export default class MessageContainer {
    private static containers: { [id: number] : MessageContainer} = {};
    private $: JQuery
    private chanID: number
    private init: boolean

    constructor(chanID: number) {
        this.$ = $messageContainer.clone();
        this.chanID = chanID;
        this.init = false;

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

        if (!this.init) {
            this.loadHistory();
        }
    }

    /** Close the container */
    close() {
        this.$.addClass("hide");
    }

    /** Prepend message */
    prependMessage(message: Model<"message">) {
        let div = createMessage(message);
        this.$.prepend(div);
    }

    /** Append message */
    appendMessage(message: Model<"message">) {
        let div = createMessage(message);
        this.$.append(div);
        this.$.scrollTop(this.$.prop("scrollHeight"));
    }

    /** Load the channel history */
    async loadHistory() {
        let messages = await emit("getMessagesRecent", this.chanID);
        let self = this;
        messages.forEach( function(message) {
            self.prependMessage(message);
        })

        this.$.scrollTop(this.$.prop("scrollHeight"));
        this.init = true;
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
