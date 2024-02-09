import { postMessage } from "./functions/postMessage";

declare const global: Record<
  string,
  (e: GoogleAppsScript.Events.FormsOnFormSubmit) => void
>;
global.main = main;

function main(e: GoogleAppsScript.Events.FormsOnFormSubmit) {
  const formResponses = e.response.getItemResponses();
  const email = e.response.getRespondentEmail();

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

  const message = `${email}からお問い合わせです。\n\`\`\`\n${contents}\n\`\`\``;

  postMessage({
    username: "Triplate Contact",
    parse: "full",
    avatar_url:
      "https://cdn.discordapp.com/attachments/792765244040675389/921661726863282176/pngegg.png",
    content: message,
  });
}
