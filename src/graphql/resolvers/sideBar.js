import { isDesktopSize } from '../../utils/styles'
import { composeTypenameFactory } from '../../utils/graphql'
import { STATUS_CONFIGS } from '../../configs/todo'
import { GET_SIDEBAR_STATE } from '../../componentsGraphQL/SideBar'

// Define typename
export const SIDEBAR_TYPE_NAME = 'SideBar'
export const composeSideBarTypename = composeTypenameFactory(SIDEBAR_TYPE_NAME)

// Define initial state
export const defaults = {
  sideBar: composeSideBarTypename({
    selected: STATUS_CONFIGS.ALL.query,
    isOpen: isDesktopSize(),
  }),
}

// Define resolvers
export const resolvers = {
  Mutation: {
    setSideBarState: (_src, { isOpen, selected }, { cache }) => {
      const { sideBar } = cache.readQuery({ query: GET_SIDEBAR_STATE })

      return {
        ...sideBar,
        selected: selected || sideBar.selected,
        isOpen: isDesktopSize() || isOpen,
      }
    },
  },
}

/**
 * get sidebar state
 * caller: another resolver
 * @param {*} cache
 * @return {Object}
 */
export function getSideBarCache(cache) {
  const { sideBar } = cache.readQuery({ query: GET_SIDEBAR_STATE })
  return sideBar
}

/**
 * set sidebar state
 * caller: another resolver
 * @param {*} cache
 * @return {null}
 */
export function setSideBarCache(cache, updateData) {
  // get existing data
  const sideBar = getSideBarCache(cache)
  // update cache directly
  cache.writeData({
    data: {
      sideBar: {
        ...sideBar,
        ...updateData,
      },
    },
  })

  return null
}
