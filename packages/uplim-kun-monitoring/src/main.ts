global.main = main;

function main() {
  const url = "https://uplim-kun.onrender.com";
  UrlFetchApp.fetch(url).getContentText();
}
