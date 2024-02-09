function createMessage(message: GoogleAppsScript.Gmail.GmailMessage) {
  return (
    `[Date] ${message.getDate()}` +
    `\n[From] ${message.getFrom()}` +
    `\n[Subject] ${message.getSubject()}` +
    `\n[Body]\n${message.getPlainBody()}`
  );
}
