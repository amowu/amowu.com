import moment from 'moment'

moment.locale('zh-TW')

const networkObj = {
  'blog': 'rss',
  'email': 'mail',
  'iOS': 'apple',
  'website': 'linkify',
  'YouTube': 'youtube play'
}

export function format (value, longDateFormat = 'L') {
  return moment(value).format(longDateFormat)
}

export function to (startDate, endDate) {
  return moment(startDate).to(endDate, true)
}

export function icon (network) {
  return (network in networkObj) ? networkObj[network] : network.toLowerCase()
}
