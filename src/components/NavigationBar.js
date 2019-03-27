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

import { COLORS } from '../utils/colors'
import { EMPTY_FUNCTION, EMPTY_ARRAY } from '../utils/constant'

import {
  SIDEBAR_STATE_MUTATION_NAME,
  SIDEBAR_STATE_QUERY_NAME,
  composedSetSideBarStateMutation,
  composedGetSideBarStateQuery,
} from '../componentsGraphQL/SideBar'
import { MAX_WIDTH as SIDEBAR_MAX_WIDTH } from './SideBar'
import { withDesktopSize, styleHidden } from '../utils/styles'
import { MENU_STATUS_CONFIGS, APP_NAME } from '../configs/todo'

import {
  DONE_TODO_ITEMS_MUTATION_NAME,
  DELETE_TODO_ITEMS_MUTATION_NAME,
  composedDeleteTodoItemsMutation,
  composedDoneTodoItemsMutation,
  composedGetSelectedTodoItemsQuery,
  GET_SELECTED_TODO_ITEMS_QUERY_NAME,
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

/*----------------------------------------------------------------------------------
 *  MAIN COMPOENTNS
 *---------------------------------------------------------------------------------*/

const ActionBar = props => {
  console.log('>>> [NavigationBar.js] props : ', props)

  return (
    <Section>
      <IconButton color="inherit" aria-label="Done Selected Items" onClick={props.onClickDoneButton}>
        <IconDoneOutline />
      </IconButton>
      <IconButton color="inherit" aria-label="Delete Selected Items" onClick={props.onClickDeleteButton}>
        <IconDeleteOutline />
      </IconButton>
    </Section>
  )
}

ActionBar.propTypes = {
  selectedItemIds: PropTypes.arrayOf(PropTypes.string),
  onClickDeleteButton: PropTypes.func,
  onClickDoneButton: PropTypes.func,
}

ActionBar.defaultProps = {
  selectedItemIds: EMPTY_ARRAY,
  onClickDeleteButton: EMPTY_FUNCTION,
  onClickDoneButton: EMPTY_FUNCTION,
}

/*---------------------------------------------------------------------------------*/

const NavigationBar = props => (
  <AppBar>
    <Toolbar>
      <Container>
        <Section>
          <MenuButton color="inherit" aria-label="Menu" onClick={props.onClickMenuButton}>
            <IconMenu />
          </MenuButton>
          {props.title}
        </Section>
        <ActionBarWithApollo />
      </Container>
    </Toolbar>
  </AppBar>
)

NavigationBar.propTypes = {
  title: PropTypes.string,
  onClickMenuButton: PropTypes.func,
}

NavigationBar.defaultProps = {
  title: APP_NAME,
  onClickMenuButton: EMPTY_FUNCTION,
}

/*----------------------------------------------------------------------------------
 *  COMPONENTS WITH APOLLO
 *---------------------------------------------------------------------------------*/

const ComposedActionBar = props => {
  // query: current selected items
  const selectedItemIds = _.get(props, `${GET_SELECTED_TODO_ITEMS_QUERY_NAME}.selectedItems`, [])
  // handle on click done button on list item event
  const onClickDoneButton = item => {
    props[DONE_TODO_ITEMS_MUTATION_NAME]({ variables: { id: item.id } })
  }
  // handle on click delete button on list item event
  const onClickDeleteButton = item => {
    props[DELETE_TODO_ITEMS_MUTATION_NAME]({ variables: { id: item.id } })
  }
  return (
    <ActionBar
      items={selectedItemIds}
      onClickDoneButton={onClickDoneButton}
      onClickDeleteButton={onClickDeleteButton}
    />
  )
}

export const ActionBarWithApollo = compose(
  composedDeleteTodoItemsMutation,
  composedDoneTodoItemsMutation,
  composedGetSelectedTodoItemsQuery
)(ComposedActionBar)

/*---------------------------------------------------------------------------------*/

const ComposedNavigationBar = props => {
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
    />
  )
}

export const NavigationBarWithApollo = compose(
  composedSetSideBarStateMutation,
  composedGetSideBarStateQuery
)(ComposedNavigationBar)

export default NavigationBar
