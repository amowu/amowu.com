import { locale, total } from '../../../../src/frontend/filters/moment'

describe('moment.filter', () => {
  it('should return correct locale date format', () => {
    expect(locale('2011-04-11')).to.equal('2011年4月11日')
  })
  it('should return correct elapsed time when given start and end date', () => {
    expect(total('2011-04-11', '2014-08-29')).to.match(/^3(\s?)年$/)
  })
})
