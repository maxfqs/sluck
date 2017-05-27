import $ from "../client/jquery"
import {Shema} from "../interface/database"


const channelContent = $("body").find(">#app >#chat >#channel-content");
const template = channelContent.find(">#template >.message-container");


export default class MessageContainer {
    $: JQuery

    constructor() {
        this.$ = template.clone();
        channelContent.append(this.$);
    }

    open() {
        this.$.removeClass("hide");
    }

    close() {
        this.$.addClass("hide");
    }

    addMessage(message: Shema<"messages">) {
        this.$.append("<p>" + message.text + "</p>");
    }
}
