import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { createQueryComponent, formatComposedComponentProps } from '../utils/graphql'

export const GET_TODO_LIST_QUERY_NAME = 'todoListQuery'
export const UPSERT_TODO_ITEM_MUTATION_NAME = 'upsertTodoMutation'
export const DELETE_TODO_ITEM_MUTATION_NAME = 'deleteTodoMutation'
export const DONE_TODO_ITEM_MUTATION_NAME = 'doneTodoMutation'

// reusable fragment without parameter
export const TODO_ITEM_FRAGMENT = `
  id
  title
  priority
  dueDate
  createdAt
  status
`

const GET_TODO_LIST = gql`
  query GetTodoList($status: String) {
    todoList(status: $status) @client{
      items @client {
        ${TODO_ITEM_FRAGMENT}
      }
    }
  }
`

const ADD_TODO_ITEM = gql`
  mutation UpsertTodoItem($title: String!, $dueDate: Date!, $priority: String!, $id: String) {
    upsertTodo(title: $title, dueDate: $dueDate, priority: $priority, id: $id) @client {
      items @client {
        ${TODO_ITEM_FRAGMENT}
      }
    }
  }
`

const DELETE_TODO_ITEM = gql`
  mutation DeleteTodoItem($id: String!) {
    deleteTodo(id: $id) @client {
      items @client {
        ${TODO_ITEM_FRAGMENT}
      }
    }
  }
`

const DONE_TODO_ITEM = gql`
  mutation DoneTodoItem($id: String!) {
    doneTodo(id: $id) @client {
      items @client {
        ${TODO_ITEM_FRAGMENT}
      }
    }
  }
`

export const GetTodoListQuery = createQueryComponent(GET_TODO_LIST, GET_TODO_LIST_QUERY_NAME)

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

export const composedDoneTodoItemMutation = graphql(DONE_TODO_ITEM, {
  name: DONE_TODO_ITEM_MUTATION_NAME,
})
