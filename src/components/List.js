import _ from 'lodash'
import React from 'react'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'
import { compose } from 'react-apollo'

import Grid from '@material-ui/core/Grid'

import { ItemWithApollo } from './Item'
import EmptyState from './EmptyState'
import { COLORS } from '../utils/colors'
import { SPACING, withMobileSize, withDesktopSize } from '../utils/styles'
import {
  GET_TODO_LIST_QUERY_NAME,
  GetTodoListQuery,
  composedGetSelectedTodoItemsQuery,
  GET_SELECTED_TODO_ITEMS_QUERY_NAME,
} from '../componentsGraphQL/TodoList'
import { SIDEBAR_STATE_QUERY_NAME, composedGetSideBarStateQuery } from '../componentsGraphQL/SideBar'
import { STATUS_CONFIGS } from '../configs/todo'

/*----------------------------------------------------------------------------------
 *  STYLED COMPONENTS
 *---------------------------------------------------------------------------------*/

const ItemList = styled.div`
  margin: auto;
  width: 100%;
`
// Progress Bar
const PROGRESS_BAR_HEIGHT = 30

const ProgressContainer = styled.div`
  margin: ${SPACING.LG}px 0;
`
const ProgressBox = styled.div`
  position: relative;
  height: ${PROGRESS_BAR_HEIGHT}px;
`
const ProgressBarTemplate = styled.div`
  display: flex;
  align-items: center;

  position: absolute;
  border-radius: 30px;
  height: ${PROGRESS_BAR_HEIGHT}px;
  background-image: linear-gradient(120deg, #b0bec5, ${COLORS.THEME});
`
const ProgressActive = styled(ProgressBarTemplate)`
  color: white;
  justify-content: flex-end;

  ${props =>
    props.percent &&
    css`
      width: ${props.percent}%;

      // mobile only
      ${withMobileSize(`
          font-size: 12px;
          &:after {
            content: ' ';
            margin: ${SPACING.XS}px;
          }
      `)}
      
      // desktop only
      ${withDesktopSize(`
        &:after {
          content: '${` Done `}';
          margin: ${SPACING.SM}px;
        }
      `)}
    `};
`
const ProgressBackground = styled(ProgressBarTemplate)`
  width: 100%;
  color: ${COLORS.THEME};
  justify-content: center;
  opacity: 0.3;
`

/*----------------------------------------------------------------------------------
 *  MAIN COMPONENTS
 *---------------------------------------------------------------------------------*/

const ProgressBar = ({ percent }) => (
  <ProgressContainer>
    <ProgressBox>
      <ProgressActive percent={percent}>{percent ? `${percent} % ` : ''}</ProgressActive>
      <ProgressBackground>{`${percent ? '' : 'STOP WISHING, START DOING!'}`}</ProgressBackground>
    </ProgressBox>
  </ProgressContainer>
)

const List = props => (
  <GetTodoListQuery status={props.filter} fetchPolicy="cache-and-network">
    {response => {
      // extract data from todoListQuery
      const todoItems = _.get(response, `${GET_TODO_LIST_QUERY_NAME}.todoList.items`, [])
      // handle progress bar
      let progressPercent = 0
      const isShowProgressBar = props.filter === STATUS_CONFIGS.ALL.query

      if (isShowProgressBar) {
        const doneItems = todoItems.filter(({ status }) => status === STATUS_CONFIGS.DONE.query)
        progressPercent = Math.floor((doneItems.length * 100) / todoItems.length)
      }

      return !_.isEmpty(todoItems) ? (
        <ItemList>
          {isShowProgressBar && <ProgressBar percent={progressPercent} />}
          <Grid container spacing={SPACING.SM}>
            {todoItems.map(item => (
              <ItemWithApollo
                key={item.id}
                item={item}
                isSelectedCheckbox={!!_.find(props.selectedItems, { id: item.id })}
              />
            ))}
          </Grid>
        </ItemList>
      ) : (
        <EmptyState />
      )
    }}
  </GetTodoListQuery>
)

/*----------------------------------------------------------------------------------
 *  COMPONENTS WITH APOLLO
 *---------------------------------------------------------------------------------*/

const ComposedListStatus = props => {
  // query: selected items
  const selectedItems = _.get(props, `${GET_SELECTED_TODO_ITEMS_QUERY_NAME}.selectedItems`, [])
  // query: sidebar state
  const sideBar = _.get(props, `${SIDEBAR_STATE_QUERY_NAME}.sideBar`, {})
  return <List selectedItems={selectedItems} filter={sideBar.selected} />
}

export const ListWithApollo = compose(
  composedGetSideBarStateQuery,
  composedGetSelectedTodoItemsQuery
)(ComposedListStatus)

List.propTypes = {
  selectedItems: PropTypes.array,
  filter: PropTypes.string,
}

List.defaultProps = {
  selectedItems: [],
  filter: STATUS_CONFIGS.ALL.query,
}

ProgressBar.propTypes = {
  percent: PropTypes.number,
}

ProgressBar.defaultProps = {
  percent: 0,
}

export default List
