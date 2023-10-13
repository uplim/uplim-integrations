import { fetchCalendarChanges } from './calendar'
import { postMessage } from './discord'

function main({ calendarId }: { calendarId: string }) {
  fetchCalendarChanges(calendarId).forEach((event) => {
    console.log(event)

    postMessage({
      username: 'Google Calendar Notifications',
      parse: 'full',
      avatar_url:
        'https://cdn.discordapp.com/attachments/792765244040675389/921661726863282176/pngegg.png',
      content: `予定が${switchState(event.changeState).state}されました。`,
      embeds: [
        {
          title: event.summary,
          url: event.htmlLink,
          color: switchState(event.changeState).color,
          fields: [
            {
              name: ':calendar: 日付',
              value: buildDateTimeString(event.start!, event.end!),
            },
          ],
        },
      ],
    })
  })
}

function switchState(state: 'created' | 'updated' | 'deleted') {
  if (state === 'created')
    return { state: '作成', color: parseInt('008000', 16) }
  else if (state === 'deleted')
    return { state: '削除', color: parseInt('FF0000', 16) }
  else return { state: '変更', color: parseInt('FFFF00', 16) }
}

function buildDateTimeString(
  start: GoogleAppsScript.Calendar.Schema.EventDateTime,
  end: GoogleAppsScript.Calendar.Schema.EventDateTime
): string {
  let text = ''
  // 時間指定の予定
  if (start.dateTime && end.dateTime) {
    text += formatDate(new Date(start.dateTime), 'yyyy/MM/dd(A) HH:mm')
    // 同日内の予定
    if (start.dateTime.substring(0, 10) === end.dateTime.substring(0, 10)) {
      text += ' - ' + formatDate(new Date(end.dateTime), 'HH:mm')
    }
    // 日をまたぐ予定
    else {
      text += ' - ' + formatDate(new Date(end.dateTime), 'yyyy/MM/dd(A) HH:mm')
    }
  }
  // 終日予定
  else if (start.date && end.date) {
    const startDate = formatDate(new Date(start.date), 'yyyy/MM/dd(A)')
    const endDate = formatDate(
      // 1日のみの終日予定であっても end.date は翌日の値が得られてしまうため、1日分戻す
      new Date(Date.parse(end.date) - 60 * 60 * 24 * 1000),
      'yyyy/MM/dd(A)'
    )
    text += startDate
    if (startDate !== endDate) text += ' - ' + endDate
  }
  return text
}

function formatDate(date: Date, format: string): string {
  format = format.replace(/yyyy/g, date.getFullYear().toString())
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2))
  format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2))
  format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2))
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2))
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2))
  format = format.replace(/SSS/g, ('00' + date.getMilliseconds()).slice(-3))
  format = format.replace(/A/g, '日月火水木金土'[date.getDay()])
  return format
}

declare let global: any
global.main = main
