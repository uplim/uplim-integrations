import { postMessage } from "utils";
import { createMessage } from "./functions/createMessage";

function main() {
  const threads = GmailApp.search(
    "in:Inbox is:Unread to:info@uplim.co.jp",
    0,
    100,
  );
  const label = GmailApp.getUserLabelByName("isNotified");

  for (const thread of threads) {
    const isLabeled = thread
      .getLabels()
      .some((threadLabel) => threadLabel.getName() === label.getName());

    if (isLabeled) continue;

    let hasUnreadMessage = false;
    for (const message of thread.getMessages()) {
      if (message.isUnread()) {
        hasUnreadMessage = true;
        const text = createMessage(message);

        const cutText =
          text.length > 2000 ? `${text.substring(0, 1995)}...` : text;

        // biome-ignore lint/style/useTemplate: エスケープめっちゃ必要でむしろ読みにくくなるので
        const codeBlock = "```\n" + cutText + "\n```";

        postMessage({
          username: "info@uplim.co.jp",
          parse: "full",
          avatar_url:
            "https://cdn.discordapp.com/attachments/792765244040675389/921661726863282176/pngegg.png",
          content: codeBlock,
        });
      }
    }

    if (hasUnreadMessage) {
      thread.addLabel(label);
    }
  }
}

declare const global: Record<string, () => void>;
global.main = main;
