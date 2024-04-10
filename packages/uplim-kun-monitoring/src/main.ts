import { withTimeout } from "utils";

declare const global: Record<string, () => void>;
global.main = main;

function main() {
  const url = "https://uplim-kun.onrender.com";
  try {
    withTimeout(
      new Promise((resolve) => {
        UrlFetchApp.fetch(url).getResponseCode();
        resolve("");
      }),
      1000,
    );
  } catch {
    // 何もしない
  }
}
