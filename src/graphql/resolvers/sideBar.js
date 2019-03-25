import { isDesktopSize } from '../../utils/styles'
import { composeTypenameFactory } from '../../utils/graphql'

// Define typename
export const SIDEBAR_TYPE_NAME = 'SideBar'
export const composeSideBarTypename = composeTypenameFactory(SIDEBAR_TYPE_NAME)

// Define initial state
export const defaults = {
  sideBar: composeSideBarTypename({
    isOpen: isDesktopSize(),
  }),
}

// Define resolvers
export const resolvers = {
  Mutation: {
    setSideBarState: (_src, { isOpen }) => {
      return composeSideBarTypename({
        isOpen: isDesktopSize() || isOpen,
      })
    },
  },
}
