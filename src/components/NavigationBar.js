import _ from 'lodash'
import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { compose } from 'react-apollo'

import DefaultAppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'

import IconMenu from '@material-ui/icons/Menu'
import IconDoneOutline from '@material-ui/icons/DoneOutline'
import IconDeleteOutline from '@material-ui/icons/DeleteOutline'
import IconClear from '@material-ui/icons/Clear'

import { COLORS } from '../utils/colors'
import { EMPTY_FUNCTION, EMPTY_ARRAY } from '../utils/constant'

import {
  SIDEBAR_STATE_MUTATION_NAME,
  SIDEBAR_STATE_QUERY_NAME,
  composedSetSideBarStateMutation,
  composedGetSideBarStateQuery,
} from '../componentsGraphQL/SideBar'
import { MAX_WIDTH as SIDEBAR_MAX_WIDTH } from './SideBar'
import { withDesktopSize, styleHidden, SPACING } from '../utils/styles'
import { MENU_STATUS_CONFIGS, APP_NAME, STATUS_CONFIGS } from '../configs/todo'

import {
  DONE_TODO_ITEMS_MUTATION_NAME,
  DELETE_TODO_ITEMS_MUTATION_NAME,
  composedDeleteTodoItemsMutation,
  composedDoneTodoItemsMutation,
  composedGetSelectedTodoItemsQuery,
  GET_SELECTED_TODO_ITEMS_QUERY_NAME,
  composedResetSelectedTodoItemsMutation,
  RESET_SELECTED_ITEMS_MUTATION_NAME,
} from '../componentsGraphQL/TodoList'

/*----------------------------------------------------------------------------------
 *  STYLED COMPONENTS
 *---------------------------------------------------------------------------------*/

const AppBar = styled(DefaultAppBar)`
  && {
    position: fixed;
    background: ${COLORS.THEME};
  }
`
const Container = styled.div`
  display: flex;
  width: 100%;
  margin: auto;
  font-size: 18px;
  justify-content: space-between;

  ${withDesktopSize(`
  padding-left: ${SIDEBAR_MAX_WIDTH}px;
`)}
`
const MenuButton = styled(IconButton)`
  ${withDesktopSize(styleHidden(false))}
`
const Section = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
const ActionBarButton = styled(IconButton)`
  && {
    padding: ${SPACING.SM}px;
  }
`

/*----------------------------------------------------------------------------------
 *  MAIN COMPOENTNS
 *---------------------------------------------------------------------------------*/

const ActionBar = props => {
  const { selectedItems } = props
  // hide if empty selected items
  if (_.isEmpty(selectedItems)) return null
  // done button state, show if any of selected items is in-progress
  const isShowDoneButton = props.selectedItems.some(({ status }) => status === STATUS_CONFIGS.IN_PROGRESS.query)

  return (
    <Section>
      {isShowDoneButton && (
        <ActionBarButton color="inherit" aria-label="Done Selected Items" onClick={props.onClickDoneButton}>
          <IconDoneOutline />
        </ActionBarButton>
      )}
      <ActionBarButton color="inherit" aria-label="Delete Selected Items" onClick={props.onClickDeleteButton}>
        <IconDeleteOutline />
      </ActionBarButton>
      <ActionBarButton color="inherit" aria-label="Clear Selected Items" onClick={props.onClickClearButton}>
        <IconClear />
      </ActionBarButton>
    </Section>
  )
}

ActionBar.propTypes = {
  selectedItems: PropTypes.array,
  onClickDeleteButton: PropTypes.func,
  onClickDoneButton: PropTypes.func,
  onClickClearButton: PropTypes.func,
}

ActionBar.defaultProps = {
  selectedItems: EMPTY_ARRAY,
  onClickDeleteButton: EMPTY_FUNCTION,
  onClickDoneButton: EMPTY_FUNCTION,
  onClickClearButton: EMPTY_FUNCTION,
}

/*---------------------------------------------------------------------------------*/

const NavigationBar = props => {
  const { selectedItems } = props
  // find selected items length to define title component
  const itemsLength = selectedItems.length
  const titleComponent = itemsLength > 0 ? `${props.selectedItems.length} SELECTED` : props.title

  return (
    <AppBar>
      <Toolbar>
        <Container>
          <Section>
            <MenuButton color="inherit" aria-label="Menu" onClick={props.onClickMenuButton}>
              <IconMenu />
            </MenuButton>
            {titleComponent}
          </Section>
          <ActionBarWithApollo selectedItems={props.selectedItems} />
        </Container>
      </Toolbar>
    </AppBar>
  )
}

NavigationBar.propTypes = {
  selectedItems: PropTypes.array,
  title: PropTypes.string,
  onClickMenuButton: PropTypes.func,
}

NavigationBar.defaultProps = {
  selectedItems: EMPTY_ARRAY,
  title: APP_NAME,
  onClickMenuButton: EMPTY_FUNCTION,
}

/*----------------------------------------------------------------------------------
 *  COMPONENTS WITH APOLLO
 *---------------------------------------------------------------------------------*/

const ComposedActionBar = props => {
  const { selectedItems } = props
  // handle on click done button on navbar event
  const onClickDoneButton = () => {
    props[DONE_TODO_ITEMS_MUTATION_NAME]({ variables: { ids: selectedItems.map(({ id }) => id) } })
  }
  // handle on click delete button on navbar event
  const onClickDeleteButton = () => {
    props[DELETE_TODO_ITEMS_MUTATION_NAME]({ variables: { ids: selectedItems.map(({ id }) => id) } })
  }
  // handle on click clear button on navbar event
  const onClickClearButton = () => {
    props[RESET_SELECTED_ITEMS_MUTATION_NAME]()
  }
  return (
    <ActionBar
      selectedItems={props.selectedItems}
      onClickDoneButton={onClickDoneButton}
      onClickDeleteButton={onClickDeleteButton}
      onClickClearButton={onClickClearButton}
    />
  )
}

export const ActionBarWithApollo = compose(
  composedDeleteTodoItemsMutation,
  composedDoneTodoItemsMutation,
  composedResetSelectedTodoItemsMutation
)(ComposedActionBar)

ComposedActionBar.propTypes = {
  selectedItems: PropTypes.array,
}

ComposedActionBar.defaultProps = {
  selectedItems: EMPTY_ARRAY,
}

/*---------------------------------------------------------------------------------*/

const ComposedNavigationBar = props => {
  // query: current selected items
  const selectedItems = _.get(props, `${GET_SELECTED_TODO_ITEMS_QUERY_NAME}.selectedItems`, [])
  // query: sidebar state
  const sideBar = _.get(props, `${SIDEBAR_STATE_QUERY_NAME}.sideBar`, {})
  const activeMenu = _.find(MENU_STATUS_CONFIGS, status => status.query === sideBar.selected)
  // handle on click menu button event
  const onClickMenuButton = () => {
    props[SIDEBAR_STATE_MUTATION_NAME]({ variables: { isOpen: true } })
  }
  return (
    <NavigationBar
      title={activeMenu && activeMenu.label}
      activeMeny={activeMenu}
      onClickMenuButton={onClickMenuButton}
      selectedItems={selectedItems}
    />
  )
}

export const NavigationBarWithApollo = compose(
  composedSetSideBarStateMutation,
  composedGetSideBarStateQuery,
  composedGetSelectedTodoItemsQuery
)(ComposedNavigationBar)

export default NavigationBar
