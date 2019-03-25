import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'

import { resolvers, defaults } from '../graphql/resolvers'
import { dataIdFromObject } from '../graphql/cache'

// initial apollo cache
const cache = new InMemoryCache({
  // custom cache key
  dataIdFromObject,
})

// create apollo client instance once
const client = new ApolloClient({
  cache,
  resolvers,
  defaults,
})

export default client
