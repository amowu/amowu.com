import moment from 'moment'

moment.locale('zh-TW')

export default {
  install: Vue => {
    Vue.filter('format', (value, longDateFormat = 'L') => moment(value).format(longDateFormat))
    Vue.filter('to', (startDate, endDate) => moment(startDate).to(endDate, true))
    Vue.filter('icon', network => {
      if (network === 'YouTube') return 'youtube play'
      if (network === 'website') return 'linkify'
      if (network === 'iOS') return 'apple'
      return network.toLowerCase()
    })
  }
}
