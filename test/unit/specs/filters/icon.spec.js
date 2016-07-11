import icon from '../../../../src/frontend/filters/icon'

describe('icon.filter', () => {
  it('should return correct icon class when resume.network match', () => {
    expect(icon('blog')).to.equal('rss')
    expect(icon('email')).to.equal('mail')
    expect(icon('iOS')).to.equal('apple')
    expect(icon('website')).to.equal('linkify')
    expect(icon('YouTube')).to.equal('youtube play')
  })
  it('should return lower case icon class when resume.network not match', () => {
    expect(icon('Android')).to.equal('android')
    expect(icon('SlideShare')).to.equal('slideshare')
    expect(icon('Twitter')).to.equal('twitter')
  })
})
