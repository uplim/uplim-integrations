import { postMessage } from "./utils/postMessage";

function sendNotificationToDiscord(e: GoogleAppsScript.Events.FormsOnFormSubmit) {
  const formResponses = e.response.getItemResponses();
  const email = e.response.getRespondentEmail();

  let contents = "";
  // 項目を繰り返す
  for (let i = 0; i < formResponses.length; i++) {
    const formResponse = formResponses[i];

    try {
      const question = formResponse.getItem().getTitle();
      const answer = formResponse.getResponse();

      contents += `${question}: ${answer}`;
    } catch (e) {
      console.log(e);
    }

    if (i+1 !== formResponses.length) contents += "\n";
  }

  const message = `${email}からお問い合わせです。\n\`\`\`\n${contents}\n\`\`\``;

  postMessage({
    username: "Triplate Contact",
    parse: "full",
    avatar_url:
      "https://cdn.discordapp.com/attachments/792765244040675389/921661726863282176/pngegg.png",
    content: message,
  });
}

declare const global: any;
global.sendNotificationToDiscord = sendNotificationToDiscord;
