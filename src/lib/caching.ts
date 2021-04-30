import apicache from 'apicache'

apicache.options({
  respectCacheControl: true,
  defaultDuration: '2 min',
})

export const cache = apicache.middleware()
