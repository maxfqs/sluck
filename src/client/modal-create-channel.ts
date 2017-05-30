import $ from "../client/jquery"
import Modal from "../client/modal"

const modal = new Modal("create-channel", true);


$("body").find(">#app >#left-panel >#channel-list >#header").on("click", function() {
    modal.open();
})

modal.$.find(">#close").on("click", function() {
    modal.close();
})
