import { isDesktopSize } from '../../utils/styles'

// Define typename
export const SIDEBAR_TYPE_NAME = 'SideBar'

// Define initial state
export const defaults = {
  sideBar: {
    isOpen: isDesktopSize(),
    __typename: SIDEBAR_TYPE_NAME,
  },
}

// Define resolvers
export const resolvers = {
  Mutation: {
    setSideBarState: (_src, { isOpen }) => {
      return {
        isOpen: isDesktopSize() || isOpen,
        __typename: SIDEBAR_TYPE_NAME,
      }
    },
  },
}
