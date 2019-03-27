import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { createQueryComponent, formatComposedComponentProps } from '../utils/graphql'

export const GET_TODO_LIST_QUERY_NAME = 'todoListQuery'
export const GET_SELECTED_TODO_ITEMS_QUERY_NAME = 'selectedTodoItemsQuery'

export const SET_SELECTED_TODO_ITEMS_MUTATION_NAME = 'selectedTodoItemsMutation'
export const UPSERT_TODO_ITEM_MUTATION_NAME = 'upsertTodoMutation'
export const DELETE_TODO_ITEM_MUTATION_NAME = 'deleteTodoMutation'
export const DONE_TODO_ITEM_MUTATION_NAME = 'doneTodoMutation'
export const DELETE_TODO_ITEMS_MUTATION_NAME = 'deleteMultipleTodoMutation'
export const DONE_TODO_ITEMS_MUTATION_NAME = 'doneMultipleTodoMutation'
export const RESET_SELECTED_ITEMS_MUTATION_NAME = 'resetSelectedTodoItemsMutation'

// reusable fragment without parameter
export const TODO_ITEM_FRAGMENT = `
  id
  title
  priority
  dueDate
  createdAt
  status
`

const TODO_LIST_DEFAULT_QUERY = `
  items {
    ${TODO_ITEM_FRAGMENT}
  }
`

export const GET_SELECTED_TODO_ITEMS = gql`
  query GetSelectedTodoItems {
    selectedItems @client {
      ${TODO_ITEM_FRAGMENT}
    }
  }
`
const SET_SELECTED_TODO_ITEMS = gql`
  mutation SetSelectedTodoItems($id: String!) {
    toggleSelectedItems(id: $id) @client {
      ${TODO_ITEM_FRAGMENT}
    }
  }
`
const RESET_SELECTED_TODO_ITEMS = gql`
  mutation ResetSelectedTodoItems {
    resetSelectedItems @client {
      ${TODO_ITEM_FRAGMENT}
    }
  }
`
const GET_TODO_LIST = gql`
  query GetTodoList($status: String) {
    todoList(status: $status) @client {
      ${TODO_LIST_DEFAULT_QUERY}
    }
  }
`
const ADD_TODO_ITEM = gql`
  mutation UpsertTodoItem($title: String!, $dueDate: Date!, $priority: String!, $id: String) {
    upsertTodo(title: $title, dueDate: $dueDate, priority: $priority, id: $id) @client {
      ${TODO_LIST_DEFAULT_QUERY}
    }
  }
`
const DELETE_TODO_ITEM = gql`
  mutation DeleteTodoItem($id: String!) {
    deleteTodo(id: $id) @client {
      ${TODO_LIST_DEFAULT_QUERY}
    }
  }
`
const DONE_TODO_ITEM = gql`
  mutation DoneTodoItem($id: String!) {
    doneTodo(id: $id) @client {
      ${TODO_LIST_DEFAULT_QUERY}
    }
  }
`
const DELETE_TODO_ITEMS = gql`
  mutation DeleteTodoItems($ids: [String!]!) {
    deleteMultipleTodo(ids: $ids) @client {
      ${TODO_LIST_DEFAULT_QUERY}
    }
  }
`
const DONE_TODO_ITEMS = gql`
  mutation DoneTodoItems($ids: [String!]!) {
    doneMultipleTodo(ids: $ids) @client {
      ${TODO_LIST_DEFAULT_QUERY}
    }
  }
`

export const GetTodoListQuery = createQueryComponent(GET_TODO_LIST, GET_TODO_LIST_QUERY_NAME)

export const composedGetSelectedTodoItemsQuery = graphql(GET_SELECTED_TODO_ITEMS, {
  name: GET_SELECTED_TODO_ITEMS_QUERY_NAME,
  props: props => formatComposedComponentProps(props, GET_SELECTED_TODO_ITEMS_QUERY_NAME),
})

export const composedSetSelectedTodoItemsMutation = graphql(SET_SELECTED_TODO_ITEMS, {
  name: SET_SELECTED_TODO_ITEMS_MUTATION_NAME,
})

export const composedResetSelectedTodoItemsMutation = graphql(RESET_SELECTED_TODO_ITEMS, {
  name: RESET_SELECTED_ITEMS_MUTATION_NAME,
})

export const composedGetTodoListQuery = graphql(GET_TODO_LIST, {
  name: GET_TODO_LIST_QUERY_NAME,
  props: props => formatComposedComponentProps(props, GET_TODO_LIST_QUERY_NAME),
})

export const composedUpsertTodoItemMutation = graphql(ADD_TODO_ITEM, {
  name: UPSERT_TODO_ITEM_MUTATION_NAME,
})

export const composedDeleteTodoItemMutation = graphql(DELETE_TODO_ITEM, {
  name: DELETE_TODO_ITEM_MUTATION_NAME,
})

export const composedDeleteTodoItemsMutation = graphql(DELETE_TODO_ITEMS, {
  name: DELETE_TODO_ITEMS_MUTATION_NAME,
})

export const composedDoneTodoItemMutation = graphql(DONE_TODO_ITEM, {
  name: DONE_TODO_ITEM_MUTATION_NAME,
})

export const composedDoneTodoItemsMutation = graphql(DONE_TODO_ITEMS, {
  name: DONE_TODO_ITEMS_MUTATION_NAME,
})
