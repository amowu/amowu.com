const networkIcon = {
  'blog': 'rss',
  'email': 'mail',
  'iOS': 'apple',
  'website': 'linkify',
  'YouTube': 'youtube play'
}

export default function (network) {
  return (network in networkIcon) ? networkIcon[network] : network.toLowerCase()
}
