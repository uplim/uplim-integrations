export function postMessage(data: Record<string, unknown>) {
  const properties = PropertiesService.getScriptProperties();
  const url = properties.getProperty("DISCORD_INCOMING_WEBHOOK_URL");
  if (!url)
    throw new Error(
      "Script property DISCORD_INCOMING_WEBHOOK_URL is not defined",
    );

  UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(data),
  });
}
