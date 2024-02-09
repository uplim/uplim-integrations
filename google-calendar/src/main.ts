import { fetchCalendarChanges } from "./functions/fetchCalendarChanges";
import { postMessage } from "./functions/postMessage";

function main({ calendarId }: { calendarId: string }) {
  for (const event of fetchCalendarChanges(calendarId)) {
    console.log(event);

    if (!event.start || !event.end) continue;

    postMessage({
      username: "Google Calendar Notifications",
      parse: "full",
      avatar_url:
        "https://cdn.discordapp.com/attachments/792765244040675389/921661726863282176/pngegg.png",
      content: `予定が${switchState(event.changeState).state}されました。`,
      embeds: [
        {
          title: event.summary,
          url: event.htmlLink,
          color: switchState(event.changeState).color,
          fields: [
            {
              name: ":calendar: 日付",
              value: buildDateTimeString(event.start, event.end),
            },
          ],
        },
      ],
    });
  }
}

function switchState(state: "created" | "updated" | "deleted") {
  if (state === "created") return { state: "作成", color: 0x008000 };
  if (state === "deleted") return { state: "削除", color: 0xff0000 };
  return { state: "変更", color: 0xffff00 };
}

function buildDateTimeString(
  start: GoogleAppsScript.Calendar.Schema.EventDateTime,
  end: GoogleAppsScript.Calendar.Schema.EventDateTime,
): string {
  let text = "";
  // 時間指定の予定
  if (start.dateTime && end.dateTime) {
    text += formatDate(new Date(start.dateTime), "yyyy/MM/dd(A) HH:mm");
    // 同日内の予定
    if (start.dateTime.substring(0, 10) === end.dateTime.substring(0, 10)) {
      text += ` - ${formatDate(new Date(end.dateTime), "HH:mm")}`;
    }
    // 日をまたぐ予定
    else {
      text += ` - ${formatDate(new Date(end.dateTime), "yyyy/MM/dd(A) HH:mm")}`;
    }
  }
  // 終日予定
  else if (start.date && end.date) {
    const startDate = formatDate(new Date(start.date), "yyyy/MM/dd(A)");
    const endDate = formatDate(
      // 1日のみの終日予定であっても end.date は翌日の値が得られてしまうため、1日分戻す
      new Date(Date.parse(end.date) - 60 * 60 * 24 * 1000),
      "yyyy/MM/dd(A)",
    );
    text += startDate;
    if (startDate !== endDate) text += ` - ${endDate}`;
  }
  return text;
}

function formatDate(date: Date, format: string) {
  // パディングを追加するユーティリティ関数
  const pad = (num: number, length = 2) => num.toString().padStart(length, "0");

  // 日付の各部分をマッピング
  const replacements: { [key: string]: string } = {
    yyyy: date.getFullYear().toString(),
    MM: pad(date.getMonth() + 1),
    dd: pad(date.getDate()),
    HH: pad(date.getHours()),
    mm: pad(date.getMinutes()),
    ss: pad(date.getSeconds()),
    SSS: pad(date.getMilliseconds(), 3),
    A: "日月火水木金土"[date.getDay()],
  };

  // フォーマット文字列の置換
  return Object.keys(replacements).reduce(
    (acc, key) => acc.replace(new RegExp(key, "g"), replacements[key]),
    format,
  );
}

declare const global: Record<
  string,
  ({ calendarId }: { calendarId: string }) => void
>;
global.main = main;
