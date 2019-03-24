import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { formatComposedComponentProps } from '../utils/graphql'
import { TODO_ITEM_FRAGMENT } from './TodoList'

export const EDITOR_STATE_QUERY_NAME = 'editorQuery'
export const EDITOR_STATE_MUTATION_NAME = 'editorMutation'

const GET_SIDEBAR_STATE = gql`
  query GetEditorState {
    editor @client {
      isOpen
      mode
      editingTask @client {
        ${TODO_ITEM_FRAGMENT}
      }
    }
  }
`

const SET_SIDEBAR_STATE = gql`
  mutation SetEditorState($isOpen: Bool!, $mode: String!, $editingTaskId: String) {
    setEditorState(isOpen: $isOpen, mode: $mode, editingTaskId: $editingTaskId) @client {
      isOpen
      mode
      editingTaskId
      editingTask @client {
        ${TODO_ITEM_FRAGMENT}
      }
    }
  }
`

export const composedGetEditorStateQuery = graphql(GET_SIDEBAR_STATE, {
  name: EDITOR_STATE_QUERY_NAME,
  props: props => formatComposedComponentProps(props, EDITOR_STATE_QUERY_NAME),
})

export const composedSetEditorStateMutation = graphql(SET_SIDEBAR_STATE, {
  name: EDITOR_STATE_MUTATION_NAME,
})
