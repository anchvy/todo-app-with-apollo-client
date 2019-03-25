import _ from 'lodash'
import React from 'react'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'
import { compose } from 'react-apollo'

import DefaultPaper from '@material-ui/core/Paper'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import MenuList from '@material-ui/core/MenuList'
import DefaultMenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'

import IconAdd from '@material-ui/icons/Add'
import IconClose from '@material-ui/icons/Close'

import { MENU_STATUS_CONFIGS, STATUS_CONFIGS, APP_NAME } from '../configs/todo'
import { SPACING, withDesktopSize, styleHidden } from '../utils/styles'
import { EMPTY_FUNCTION } from '../utils/constant'

import {
  SIDEBAR_STATE_QUERY_NAME,
  SIDEBAR_STATE_MUTATION_NAME,
  composedGetSideBarStateQuery,
  composedSetSideBarStateMutation,
} from '../componentsGraphQL/SideBar'
import { EDITOR_STATE_MUTATION_NAME, composedSetEditorStateMutation } from '../componentsGraphQL/Editor'
import { EDITOR_CREATE_MODE } from '../graphql/resolvers/editor'

/*----------------------------------------------------------------------------------
 *  STYLED COMPONENTS
 *---------------------------------------------------------------------------------*/

export const MAX_WIDTH = 320

const Paper = styled(({ isOpen, ...restProps }) => <DefaultPaper {...restProps} />)`
  && {
    position: fixed;
    z-index: 1300;
    height: 100vh;
    width: 100vw;
    max-width: ${MAX_WIDTH}px;
    border-radius: 0;
    transition: all 0.5s ease;
    left: -${MAX_WIDTH}px;

    ${props =>
      props.isOpen &&
      css`
        transition: all 0.5s ease;
        left: 0px;
      `}

    // works only in desktop
    ${withDesktopSize(`
      left: 0px;
    `)}
  }
`
const TitleBox = styled.div``
const Title = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px;
  font-weight: bold;
  font-size: 20px;
`
const PoweredByTitle = styled.div`
  text-align: center;
  font-size: 10px;
  opacity: 0.3;
`
const CloseButton = styled(IconButton)`
  && {
    right: ${SPACING.SM}px;
    top: ${SPACING.SM}px;
    float: right;

    ${withDesktopSize(styleHidden(true))}
  }
`
const MenuItem = styled(({ isSelected, ...restProps }) => <DefaultMenuItem {...restProps} />)`
  ${props =>
    props.isSelected &&
    css`
      && {
        font-style: italic;
        background: #eeeeee;
      }
    `}
`

/*----------------------------------------------------------------------------------
 *  MAIN COMPONENT
 *---------------------------------------------------------------------------------*/

const SideBar = props => {
  // handle on click status item event
  const onClickMenuItem = event => {
    props.onClickMenuItem(event, event.currentTarget.getAttribute('query'))
  }

  return (
    <Paper isOpen={props.isOpen}>
      <CloseButton onClick={props.onClickCloseButton}>
        <IconClose />
      </CloseButton>
      <TitleBox>
        <Title>{APP_NAME}</Title>
      </TitleBox>
      {/* static menu */}
      <MenuList>
        <Divider disabled />
        <MenuItem onClick={props.onClickNewTask}>
          <ListItemIcon>
            <IconAdd />
          </ListItemIcon>
          <ListItemText primary="New Task" />
        </MenuItem>
        <Divider disabled />
        {/* another menu */}
        {MENU_STATUS_CONFIGS.map(menu => (
          <MenuItem
            key={menu.query}
            onClick={onClickMenuItem}
            isSelected={props.selectedMenu === menu.query}
            query={menu.query}
          >
            <ListItemIcon>{menu.icon}</ListItemIcon>
            <ListItemText primary={menu.label} />
          </MenuItem>
        ))}
        <Divider />
      </MenuList>
      <PoweredByTitle>Powered By Woravan Suthatar</PoweredByTitle>
    </Paper>
  )
}

/*----------------------------------------------------------------------------------
 *  COMPONENT WITH APOLLO
 *---------------------------------------------------------------------------------*/

const ComposedSideBar = props => {
  // query: sidebar state
  const sideBar = _.get(props, `${SIDEBAR_STATE_QUERY_NAME}.sideBar`, {})
  // handle on click menu button event
  const onClickMenuItem = (event, selected) => {
    onClickCloseMenuButton(event, selected)
  }
  // handle on click close button event
  const onClickCloseMenuButton = (_event, closeWithSelected) => {
    props[SIDEBAR_STATE_MUTATION_NAME]({ variables: { isOpen: false, selected: closeWithSelected } })
  }
  // handle on click new task button event
  const onClickAddTaskButton = () => {
    onClickCloseMenuButton()
    props[EDITOR_STATE_MUTATION_NAME]({ variables: { isOpen: true, mode: EDITOR_CREATE_MODE } })
  }

  return (
    <SideBar
      isOpen={sideBar.isOpen}
      selectedMenu={sideBar.selected}
      onClickCloseButton={onClickCloseMenuButton}
      onClickNewTask={onClickAddTaskButton}
      onClickMenuItem={onClickMenuItem}
    />
  )
}

export const SideBarWithApollo = compose(
  composedGetSideBarStateQuery,
  composedSetSideBarStateMutation,
  composedSetEditorStateMutation
)(ComposedSideBar)

SideBar.propTypes = {
  isOpen: PropTypes.bool,
  selectedMenu: PropTypes.string,
  onClickCloseButton: PropTypes.func,
  onClickMenuItem: PropTypes.func,
  onClickNewTask: PropTypes.func,
}

SideBar.defaultProps = {
  isOpen: false,
  selectedMenu: STATUS_CONFIGS.ALL.query,
  onClickCloseButton: EMPTY_FUNCTION,
  onClickMenuItem: EMPTY_FUNCTION,
  onClickNewTask: EMPTY_FUNCTION,
}

export default SideBar
