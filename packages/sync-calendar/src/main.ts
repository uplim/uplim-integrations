export {};

function main() {
  // スプレッドシートのIDとシート名を設定
  const spreadsheetId = "1-Hy-8r_Qoruq_LwpIg1Uxwn0mlixL_X40wXXgW3RHCA";
  const sheetName = "シート1"; // シート名を入力

  // スプレッドシートを開いてデータを取得
  const sheet =
    SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  const data = sheet?.getDataRange().getValues(); // シートの全データを取得

  // ヘッダーを除くデータ部分を処理
  const rows = data?.slice(1); // 1行目（ヘッダー）を除外

  if (rows === undefined) {
    return null;
  }

  for (const row of rows) {
    const name = row[0];
    const workCalendarId = row[1];
    const personalCalendarId = row[2];

    try {
      // 同期対象期間（今月と来月）
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const firstDayOfNextMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        1,
      );
      const firstDayOfFollowingMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 2,
        1,
      );

      // カレンダーオブジェクトを取得
      const workCal = CalendarApp.getCalendarById(workCalendarId);
      const personalCal = CalendarApp.subscribeToCalendar(personalCalendarId);

      if (!workCal || !personalCal) {
        throw new Error("カレンダーが見つかりません");
      }

      // 今月と来月のプライベート予定を削除
      const existingEvents = workCal.getEvents(
        firstDayOfMonth,
        firstDayOfFollowingMonth,
      );
      for (const event of existingEvents) {
        if (event.getTitle().startsWith("不在")) {
          event.deleteEvent();
        }
      }

      // 個人カレンダーの予定を取得
      const personalEvents = personalCal.getEvents(
        firstDayOfMonth,
        firstDayOfFollowingMonth,
      );

      // 個人カレンダーの予定を社用カレンダーにコピー
      for (const event of personalEvents) {
        const title = "不在"; // ユニークなタイトルを生成

        // 社用カレンダーに予定を作成
        const newEvent = workCal.createEvent(
          title,
          event.getStartTime(),
          event.getEndTime(),
          {
            description: "この予定は個人用カレンダーから同期されています。",
          },
        );

        // イベントをプライベートに設定
        newEvent.setVisibility(CalendarApp.Visibility.PRIVATE);
      }

      // ログに出力（デバッグ用）
      Logger.log(`同期完了: ${name}`);
    } catch (error) {
      Logger.log(`エラー発生 (${name}): ${error}`);
    }
  }
}

declare const global: Record<string, () => void>;
global.main = main;
