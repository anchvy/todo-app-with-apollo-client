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
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'

import IconAdd from '@material-ui/icons/Add'
import IconClose from '@material-ui/icons/Close'

import { STATUS_CONFIGS } from '../configs/todo'
import { SPACING, withDesktopSize, styleHidden, isDesktopSize } from '../utils/styles'
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

/*----------------------------------------------------------------------------------
 *  MAIN COMPONENT
 *---------------------------------------------------------------------------------*/

const SideBar = props => {
  // handle click away

  return (
    <Paper isOpen={props.isOpen}>
      <CloseButton onClick={props.onClickCloseButton}>
        <IconClose />
      </CloseButton>
      <TitleBox>
        <Title>TODO APP</Title>
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
        {Object.values(STATUS_CONFIGS).map(menu => (
          <MenuItem key={menu.query} onClick={props.onClickMenuItem}>
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
  const isSideBarOpen = _.get(props, `${SIDEBAR_STATE_QUERY_NAME}.sideBar.isOpen`)
  // handle on click close button event
  const onClickCloseMenuButton = () => {
    props[SIDEBAR_STATE_MUTATION_NAME]({ variables: { isOpen: false } })
  }
  // handle on click new task button event
  const onClickAddTaskButton = () => {
    onClickCloseMenuButton()
    props[EDITOR_STATE_MUTATION_NAME]({ variables: { isOpen: true, mode: EDITOR_CREATE_MODE } })
  }

  return (
    <SideBar isOpen={isSideBarOpen} onClickCloseButton={onClickCloseMenuButton} onClickNewTask={onClickAddTaskButton} />
  )
}

export const SideBarWithApollo = compose(
  composedGetSideBarStateQuery,
  composedSetSideBarStateMutation,
  composedSetEditorStateMutation
)(ComposedSideBar)

SideBar.propTypes = {
  isOpen: PropTypes.bool,
  onClickCloseButton: PropTypes.func,
  onClickMenuItem: PropTypes.func,
  onClickNewTask: PropTypes.func,
}

SideBar.defaultProps = {
  isOpen: false,
  onClickCloseButton: EMPTY_FUNCTION,
  onClickMenuItem: EMPTY_FUNCTION,
  onClickNewTask: EMPTY_FUNCTION,
}

export default SideBar
