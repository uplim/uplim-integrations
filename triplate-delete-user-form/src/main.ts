import { postMessage } from "./functions/postMessage";

declare const global: Record<
  string,
  (e: GoogleAppsScript.Events.FormsOnFormSubmit) => void
>;
global.main = main;

function main(e: GoogleAppsScript.Events.FormsOnFormSubmit) {
  const formResponses = e.response.getItemResponses().filter((e) => e);

  const contents = formResponses
    .map((formResponse) => {
      try {
        const question = formResponse.getItem().getTitle();
        const answer = formResponse.getResponse();

        return `${question}: ${answer}`;
      } catch (error) {
        console.log(error);
        return "";
      }
    })
    .filter((line) => line)
    .join("\n");

  const message = `アカウント削除申請が届きました。\n\`\`\`\n${contents}\n\`\`\``;

  postMessage({
    username: "Triplate 削除申請",
    parse: "full",
    avatar_url:
      "https://cdn.discordapp.com/attachments/792765244040675389/921661726863282176/pngegg.png",
    content: message,
  });
}
