import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { formatComposedComponentProps } from '../utils/graphql'

export const SIDEBAR_STATE_QUERY_NAME = 'sideBarQuery'
export const SIDEBAR_STATE_MUTATION_NAME = 'sideBarStateMutation'

export const GET_SIDEBAR_STATE = gql`
  query GetSideBarState {
    sideBar @client {
      selected
      isOpen
    }
  }
`

const SET_SIDEBAR_STATE = gql`
  mutation SetSideBarState($isOpen: Bool!, $selected: String) {
    setSideBarState(isOpen: $isOpen, selected: $selected) @client {
      selected
      isOpen
    }
  }
`

export const composedGetSideBarStateQuery = graphql(GET_SIDEBAR_STATE, {
  name: SIDEBAR_STATE_QUERY_NAME,
  props: props => formatComposedComponentProps(props, SIDEBAR_STATE_QUERY_NAME),
})

export const composedSetSideBarStateMutation = graphql(SET_SIDEBAR_STATE, {
  name: SIDEBAR_STATE_MUTATION_NAME,
})
