import _ from 'lodash'
import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { compose } from 'react-apollo'

import Grid from '@material-ui/core/Grid'

import { ItemWithApollo } from './Item'
import { SPACING } from '../utils/styles'
import { GET_TODO_LIST_QUERY_NAME, GetTodoListQuery } from '../componentsGraphQL/TodoList'
import { SIDEBAR_STATE_QUERY_NAME, composedGetSideBarStateQuery } from '../componentsGraphQL/SideBar'
import { STATUS_CONFIGS } from '../configs/todo'

/*----------------------------------------------------------------------------------
 *  STYLED COMPONENTS
 *---------------------------------------------------------------------------------*/

const ItemList = styled.div`
  margin: auto;
  max-width: 1024px;
  width: 100%;
`

/*----------------------------------------------------------------------------------
 *  MAIN COMPONENTS
 *---------------------------------------------------------------------------------*/

const List = props => (
  <GetTodoListQuery status={props.filter}>
    {response => {
      // extract data from todoListQuery
      // const todoListResponse = _.get(response, `${GET_TODO_LIST_QUERY_NAME}`)
      const todoItems = _.get(response, `${GET_TODO_LIST_QUERY_NAME}.todoList.items`, [])
      // const { state: todoListState } = todoListResponse
      return (
        <ItemList>
          <Grid container spacing={SPACING.SM}>
            {todoItems.map(item => (
              <ItemWithApollo key={item.id} item={item} />
            ))}
          </Grid>
        </ItemList>
      )
    }}
  </GetTodoListQuery>
)

const ComposedListStatus = props => {
  // query: sidebar state
  const sideBar = _.get(props, `${SIDEBAR_STATE_QUERY_NAME}.sideBar`, {})
  console.log('>>> [List.js] sideBar : ', sideBar)
  return <List filter={sideBar.selected} />
}

export const ListWithApollo = compose(composedGetSideBarStateQuery)(ComposedListStatus)

List.propTypes = {
  filter: PropTypes.string,
}

List.defaultProps = {
  filter: STATUS_CONFIGS.ALL.query,
}

export default List
