import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { withClientState } from 'apollo-link-state'

import { resolvers, defaults } from '../graphql/resolvers'
import { dataIdFromObject } from '../graphql/cache'

// initial apollo cache
const cache = new InMemoryCache({
  // custom cache key
  dataIdFromObject,
})

// local state link
const stateLink = withClientState({
  cache,
  defaults,
  resolvers,
})

// create apollo client instance once
const client = new ApolloClient({
  link: stateLink,
  cache,
})

export default client
