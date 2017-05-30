import $ from "../client/jquery"

const $app = $("body").find(">#app");
const $modal = $("body").find(">#modal");


export default class Modal {
    $: JQuery
    fullPage: boolean

    constructor(selector: string, fullPage: boolean) {
        this.$ = $modal.find(">#" + selector);
        this.fullPage = fullPage;
    }

    /** Open the modal */
    open() {
        if (this.fullPage) {
            $app.addClass("hide");
            $modal.addClass("full-page");
        } else {
            $app.removeClass("hide");
            $modal.removeClass("full-page");
        }

        this.$.removeClass("hide");
        $modal.removeClass("hide");
    }

    /** Close the modal */
    close() {
        this.$.addClass("hide");
        $modal.addClass("hide");
        $app.removeClass("hide");
    }
}
