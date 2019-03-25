import { defaultDataIdFromObject } from 'apollo-cache-inmemory'
import { TODO_LIST_TYPE_NAME } from './resolvers/todo'
import { SIDEBAR_TYPE_NAME } from './resolvers/sideBar'
import { EDITOR_TYPE_NAME } from './resolvers/editor'

export function dataIdFromObject(object) {
  switch (object.__typename) {
    case SIDEBAR_TYPE_NAME:
    case EDITOR_TYPE_NAME:
      return object.__typename
    default:
      return defaultDataIdFromObject(object)
  }
}
