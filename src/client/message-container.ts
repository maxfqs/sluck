import $ from "../client/jquery"
import {Model} from "../interface/client-model"
import moment from "../client/moment"
import {socket, emit} from "../client/socket"
import User from "../client/user"


const DAY_FORMAT = "MM DD, YYYY";
const HOUR_FORMAT = "h:mm A";
const MONTHS = {
    "01": "january", "02": "february", "03": "march",
    "04": "april", "05": "may", "06": "june",
    "07": "july", "08": "august", "09": "september",
    "10": "october", "11": "november", "12": "december"
}

const $channelContent = $("body").find(">#app >#chat >#channel-content");
const $messageContainer = $channelContent.find(">#template >.message-container");
const $message = $channelContent.find(">#template >.message");
const $dayContainer = $channelContent.find(">#template >.day-container");


class DayContainerManager {
    private days: { [date: string]: JQuery }
    private messageContainer: JQuery

    constructor(mc: JQuery) {
        this.days = {};
        this.messageContainer = mc;
    }

    /** Create a day container */
    create(date: string) {
        let container = $dayContainer.clone();
        let day = container.find(">.day");

        // Add the date text
        let month = MONTHS[date.substring(0,2)];
        let formatedDate = month + " " + date.substring(3);
        day.html(formatedDate);

        // The container need to be added in chronological order.
        // To do so we loop through the stored containers to find the one
        // just after our new date so we can use it to prepend.
        // We need to check each one as JS does not guarantee property order on Object.
        let targetDate = null;
        Object.keys(this.days).forEach( function(dayDate) {
            if (date < dayDate) {
                if (targetDate == null) {
                    targetDate = dayDate;
                } else if (dayDate < targetDate) {
                    targetDate = dayDate;
                }
            }
        })

        let target = this.days[targetDate] || null;
        if (target != null) {
            target.before(container);
        } else {
            this.messageContainer.append(container);
        }

        this.days[date] = container;
        return container;
    }

    /** Return a day container by date */
    get(date: string) {
        return this.days[date] || this.create(date);
    }
}


export default class MessageContainer {
    private static containers: { [id: number] : MessageContainer} = {};
    private $: JQuery
    private chanID: number
    private dcm: DayContainerManager
    private init: boolean
    private firstID: number
    private lastID: number

    constructor(chanID: number) {
        this.$ = $messageContainer.clone();
        this.chanID = chanID;
        this.dcm = new DayContainerManager(this.$);
        this.init = false;

        MessageContainer.containers[chanID] = this;
        $channelContent.append(this.$);

        let self = this;
        this.$.scroll(function() {
            self.onScroll();
        })
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

    /** Add a message to the approriate day container */
    addMessage(message: Model<"message">, mode: "append" | "prepend") {
        let dayDate = moment(message.date, "X", true).format(DAY_FORMAT);
        let dayMessages = this.dcm.get(dayDate).find(">.messages");
        let messageDiv = createMessage(message);

        switch (mode) {
            case "append":
                dayMessages.append(messageDiv);
                this.$.scrollTop(this.$.prop("scrollHeight"));
                this.lastID = message.id;
                break;
            case "prepend":
                dayMessages.prepend(messageDiv);
                this.firstID = message.id;
                break;
        }
    }

    /** Load the channel history */
    async loadHistory() {
        let messages = await emit("getMessagesRecent", this.chanID);
        let self = this;
        messages.forEach( function(message) {
            self.addMessage(message, "prepend");
        })

        this.$.scrollTop(this.$.prop("scrollHeight"));
        this.init = true;
    }

    /** Get messages before the first message ID */
    async getMessagesBefore() {
        let self = this;
        let messages = await emit("getMessagesBefore", {channel: this.chanID, message: this.firstID});

        messages.forEach( function(message) {
            self.addMessage(message, "prepend");
        })

        // Scroll to the most recent message added
        let $div = this.findMessage(messages[0].id);
        this.$.scrollTop($div.offset().top - $div.outerHeight(true));
    }

    /** Return a message inside the container by ID */
    findMessage(id: number) {
        let message = this.$.find(".message").filter( function() {
            return $(this).data("id") == id;
        })
        return message;
    }

    /** On scroll event handler */
    onScroll() {
        if (this.$.scrollTop() == 0) {
            this.getMessagesBefore();
        }
    }
}


/** Create a message div */
function createMessage(data: Model<"message">) {
    let clone = $message.clone();
    let formatedMessage = data.text.replace(/\r?\n/g, "<br />");
    let name = User.get(data.user).getName();
    let date = moment(data.date, "X", true).format(HOUR_FORMAT);

    clone.find(">.header >.user").text(name);
    clone.find(">.header >.date").text(date);
    clone.find(">.text").html(formatedMessage);

    clone.data("id", data.id);

    return clone;
}


socket.on("newMessage", function(message) {
    let id = message.channel;
    MessageContainer.get(id).addMessage(message, "append");
})
