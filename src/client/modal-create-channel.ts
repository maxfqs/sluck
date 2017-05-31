import $ from "../client/jquery"
import Channel from "../client/channel"
import {emit} from "../client/socket"
import Modal from "../client/modal"


const $channelHeader = $("#app").find("#channel-list #channel-header");

const modal = new Modal("create-channel", true);
const $name = modal.$.find(">#name");
const $autoJoin = modal.$.find(">label >#auto-join");
const $create = modal.$.find(">#create");
const $close = modal.$.find(">#close");

let createdID: number = null;


/** Open the create channel modal */
function openModal() {
    // Reset Val
    $name.val("");
    $autoJoin.prop("checked", false);

    modal.open();
}

async function createChannel() {
    let name: string = $name.val().trim();
    let autoJoin: boolean = $autoJoin.prop("checked");

    if (name == "") {
        return false;
    }

    let result = await emit("createChannel", {
        name: name,
        auto_join: autoJoin
    })

    if (result == false) {
        return false;
    }

    createdID = result;
}


$channelHeader.on("click", function() {
    openModal();
})

$close.on("click", function() {
    modal.close();
})

$create.on("click", function() {
    createChannel();
})


Channel.on("create", function(chan) {
    if (createdID == null) {
        return false;
    }

    if (chan.getID() != createdID) {
        return false;
    }

    modal.close();
    chan.open();
    createdID = null;
})
