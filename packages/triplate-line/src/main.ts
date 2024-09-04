import { postMessage } from "utils";

function doPost(e: GoogleAppsScript.Events.DoPost) {
  const postData = JSON.parse(e.postData.contents).events[0];
  const lineMessageText = postData.message.text;

  postMessage({
    username: "LINE Bot",
    parse: "full",
    avatar_url:
      "https://cdn.discordapp.com/attachments/792765244040675389/921661726863282176/pngegg.png",
    content: JSON.stringify(lineMessageText),
  });

  return ContentService.createTextOutput(
    JSON.stringify({
      message: "Message received",
    }),
  ).setMimeType(ContentService.MimeType.JSON);
}

declare const global: Record<
  string,
  (e: GoogleAppsScript.Events.DoPost) => void
>;
global.doPost = doPost;
