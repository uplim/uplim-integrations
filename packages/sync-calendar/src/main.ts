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
    const name = row[0]; // 名前
    const workCalendarId = row[1]; // org_id
    const personalCalendarId = row[2]; // personal_id

    try {
      // 同期対象期間（過去1日から未来30日まで）
      const now = new Date();
      const startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 過去1日
      const endTime = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 未来30日

      // カレンダーオブジェクトを取得
      const workCal = CalendarApp.getCalendarById(workCalendarId);
      const personalCal = CalendarApp.getCalendarById(personalCalendarId);

      Logger.log(workCal);
      Logger.log(personalCal);
      if (!workCal || !personalCal) {
        throw new Error("カレンダーが見つかりません");
      }

      // 個人カレンダーの予定を取得
      const personalEvents = personalCal.getEvents(startTime, endTime);

      // 社用カレンダーの予定を確認して既存の予定を取得
      const workEvents = workCal.getEvents(startTime, endTime);

      // 社用カレンダーにコピー済みの予定を識別するための識別子（タイトルにタグを追加）
      const SYNC_TAG = "[Synced]";

      // 既存の社用カレンダーの予定タイトルを収集
      const workEventTitles = new Set(
        workEvents.map((event) => event.getTitle()),
      );

      // 個人カレンダーの予定を社用カレンダーにコピー
      for (const event of personalEvents) {
        const title = `${SYNC_TAG} ${event.getTitle() || "プライベート予定"}`;

        // 同じタイトルの予定が既に社用カレンダーに存在するか確認
        if (workEventTitles.has(title)) {
          return; // 既存の場合はスキップ
        }

        // 社用カレンダーに予定を作成
        workCal.createEvent(title, event.getStartTime(), event.getEndTime(), {
          description: "この予定は個人用カレンダーから同期されています。",
          visibility: CalendarApp.Visibility.PRIVATE,
        });
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
