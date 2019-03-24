import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { formatComposedComponentProps } from '../utils/graphql'

export const GET_TODO_LIST_QUERY_NAME = 'todoListQuery'
export const UPSERT_TODO_ITEM_MUTATION_NAME = 'upsertTodoMutation'
export const DELETE_TODO_ITEM_MUTATION_NAME = 'deleteTodoMutation'

const GET_TODO_LIST = gql`
  query GetTodoList {
    todoList @client {
      items {
        id
        title
        priority
        dueDate
        createdAt
      }
    }
  }
`

const ADD_TODO_ITEM = gql`
  mutation UpsertTodoItem($title: String!, $dueDate: Date!, $priority: String!, $id: String) {
    upsertTodo(title: $title, dueDate: $dueDate, priority: $priority, id: $id) @client {
      items {
        id
        title
        priority
        dueDate
        createdAt
      }
    }
  }
`

const DELETE_TODO_ITEM = gql`
  mutation DeleteTodoItem($id: String!) {
    deleteTodo(id: $id) @client {
      items {
        id
        title
        priority
        dueDate
        createdAt
      }
    }
  }
`

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
