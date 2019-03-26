import ApolloClient, { InMemoryCache } from 'apollo-boost'

import { resolvers, defaults } from '../graphql/resolvers'
import { dataIdFromObject } from '../graphql/cache'

// initial apollo cache
const cache = new InMemoryCache({
  // custom cache key
  dataIdFromObject,
})

cache.writeData({
  data: defaults,
})

// create apollo client instance once
const client = new ApolloClient({
  cache,
  clientState: {
    resolvers,
  },
})

export default client
