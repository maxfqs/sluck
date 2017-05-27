import $ from "../client/jquery"

const chat = $("body").find("> #app > #chat");
const channelName = chat.find("> #topbar > #channel-name");


export function openChannel(name: string) {
    channelName.text(name);
}
