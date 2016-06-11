import moment from 'moment'

moment.locale('zh-TW')

export function format (value, longDateFormat = 'L') {
  return moment(value).format(longDateFormat)
}

export function to (startDate, endDate) {
  return moment(startDate).to(endDate, true)
}

const networkObj = {
  'YouTube': 'youtube play',
  'website': 'linkify',
  'iOS': 'apple'
}

export function icon (network) {
  return (network in networkObj) ? networkObj[network] : network.toLowerCase()
}
