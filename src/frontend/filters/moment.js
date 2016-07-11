import moment from 'moment'

moment.locale('zh-TW')

export function locale (value, longDateFormat = 'L') {
  return moment(value).format(longDateFormat)
}

export function total (startDate, endDate) {
  return moment(startDate).to(endDate, true)
}
