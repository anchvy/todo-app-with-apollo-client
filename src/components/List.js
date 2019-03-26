import _ from 'lodash'
import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { compose } from 'react-apollo'

import Grid from '@material-ui/core/Grid'

import { ItemWithApollo } from './Item'
import EmptyState from './EmptyState'
import { SPACING } from '../utils/styles'
import { GET_TODO_LIST_QUERY_NAME, GetTodoListQuery } from '../componentsGraphQL/TodoList'
import { SIDEBAR_STATE_QUERY_NAME, composedGetSideBarStateQuery } from '../componentsGraphQL/SideBar'
import { STATUS_CONFIGS } from '../configs/todo'

/*----------------------------------------------------------------------------------
 *  STYLED COMPONENTS
 *---------------------------------------------------------------------------------*/

const ItemList = styled.div`
  margin: auto;
  width: 100%;
`

/*----------------------------------------------------------------------------------
 *  MAIN COMPONENTS
 *---------------------------------------------------------------------------------*/

const List = props => (
  <GetTodoListQuery status={props.filter} fetchPolicy="cache-and-network">
    {response => {
      // extract data from todoListQuery
      const todoItems = _.get(response, `${GET_TODO_LIST_QUERY_NAME}.todoList.items`, [])

      return !_.isEmpty(todoItems) ? (
        <ItemList>
          <Grid container spacing={SPACING.SM}>
            {todoItems.map(item => (
              <ItemWithApollo key={item.id} item={item} />
            ))}
          </Grid>
        </ItemList>
      ) : (
        <EmptyState />
      )
    }}
  </GetTodoListQuery>
)

const ComposedListStatus = props => {
  // query: sidebar state
  const sideBar = _.get(props, `${SIDEBAR_STATE_QUERY_NAME}.sideBar`, {})
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
