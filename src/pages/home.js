import _ from 'lodash'
import React from 'react'
// import PropTypes from 'prop-types'

import { compose } from 'react-apollo'
import { composedGetTodoListQuery, GET_TODO_LIST_QUERY_NAME } from '../componentsGraphQL/TodoList'
import HomeComponent from '../components/PageHome'

// const Wrapper = styled.div``

const Homepage = props => {
  // extract data from todoListQuery
  const todoListResponse = _.get(props, `${GET_TODO_LIST_QUERY_NAME}`)
  const todoItems = _.get(props, `${GET_TODO_LIST_QUERY_NAME}.todoList.items`, [])
  const { state: todoListState } = todoListResponse

  return <HomeComponent isLoadingList={todoListState.isLoading} todoItems={todoItems} />
}

// Homepage.propTypes = {}
// Homepage.defaultProps = {}

export default compose(composedGetTodoListQuery)(Homepage)
