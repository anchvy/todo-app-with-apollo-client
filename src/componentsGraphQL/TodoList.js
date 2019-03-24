import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { formatComposedComponentProps } from '../utils/graphql'

export const GET_TODO_LIST_QUERY_NAME = 'todoListQuery'
export const GET_TODO_ITEM_QUERY_NAME = 'todoItemQuery'
export const ADD_TODO_ITEM_MUTATION_NAME = 'addTodoMutation'

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

export const GET_TODO_ITEM = gql`
  query GetTodoItem($id: String!) {
    todoItem(id: $id) @client {
      id
      title
      priority
      dueDate
      createdAt
    }
  }
`

const ADD_TODO_ITEM = gql`
  mutation AddToDoItem($title: String!, $dueDate: Date!, $priority: String!) {
    addTodo(title: $title, dueDate: $dueDate, priority: $priority) @client {
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

export const composedGetTodoItemQuery = graphql(GET_TODO_ITEM, {
  name: GET_TODO_ITEM_QUERY_NAME,
  props: props => formatComposedComponentProps(props, GET_TODO_ITEM_QUERY_NAME),
})

export const composedAddTodoItemMutation = graphql(ADD_TODO_ITEM, {
  name: ADD_TODO_ITEM_MUTATION_NAME,
})
