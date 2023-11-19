import { postMessage } from './utils/postMessage'

function triplateContact(e: GoogleAppsScript.Events.FormsOnFormSubmit) {
  const formResponses = e.response.getItemResponses()
  const email = e.response.getRespondentEmail();

  let contents = ''
  // 項目を繰り返す
  for (let i = 0; i < formResponses.length; i++) {
    const formResponse = formResponses[i]

    try {
      const question = formResponse.getItem().getTitle();
      const answer = formResponse.getResponse();

      contents += question + " : " + answer + "\n";
    } catch (e) {
      console.log(e)
    }
  }

  const message = `
  ${email}からお問い合わせです。
  \`\`\`
  ${contents}
  \`\`\`
  `

  // データを作って投げる
  postMessage(message)
}

declare const global: any
global.triplateContact = triplateContact
