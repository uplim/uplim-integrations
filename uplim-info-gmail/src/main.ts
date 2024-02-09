import { postMessage } from "./functions/postMessage";

declare const global: Record<
  string,
  (e: GoogleAppsScript.Events.FormsOnFormSubmit) => void
>;
global.main = main;

function main() {
  const threads = GmailApp.search("in:Inbox is:Unread", 0, 100);

  for (const thread of threads) {
    for (const message of thread.getMessages()) {
      if (!message.isUnread()) return;
      const text = createMessage(message);
      postMessage({
        username: "Uplim Info Gmail",
        parse: "full",
        avatar_url:
          "https://cdn.discordapp.com/attachments/792765244040675389/921661726863282176/pngegg.png",
        content: text,
      });
      message.markRead();
    }
  }
}
