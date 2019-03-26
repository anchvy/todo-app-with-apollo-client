import _ from 'lodash'
import React from 'react'
import styled from 'styled-components'
import Fab from '@material-ui/core/Fab'
import { compose } from 'react-apollo'

import IconAdd from '@material-ui/icons/Add'
import { SPACING, withDesktopSize, styleHidden } from '../utils/styles'

import { SIDEBAR_STATE_QUERY_NAME, composedGetSideBarStateQuery } from '../componentsGraphQL/SideBar'
import { EDITOR_STATE_MUTATION_NAME, composedSetEditorStateMutation } from '../componentsGraphQL/Editor'
import { EDITOR_CREATE_MODE } from '../graphql/resolvers/editor'
import { COLORS } from '../utils/colors'

const AddTaskButton = styled(({ isSideBarOpen, ...restProps }) => <Fab {...restProps} />)`
  && {
    position: fixed;
    bottom: ${SPACING.MD}px;
    right: ${SPACING.MD}px;
    background: ${COLORS.THEME};
    color: white;

    &:hover {
      background: ${COLORS.BUTTON_THEME_HOVER};
    }
  }

  ${props => props.isSideBarOpen && styleHidden(true)}
  ${withDesktopSize(styleHidden(true))}
`

const ComposedFloatingAddButton = props => {
  // query: sidebar state
  const isSideBarOpen = _.get(props, `${SIDEBAR_STATE_QUERY_NAME}.sideBar.isOpen`)
  // handle on click new task button event
  const onClickAddTaskButton = () => {
    props[EDITOR_STATE_MUTATION_NAME]({ variables: { isOpen: true, mode: EDITOR_CREATE_MODE } })
  }
  return (
    <AddTaskButton isSideBarOpen={isSideBarOpen} color="default" aria-label="Add" onClick={onClickAddTaskButton}>
      <IconAdd />
    </AddTaskButton>
  )
}

export const FloatingAddButtonWithApollo = compose(
  composedSetEditorStateMutation,
  composedGetSideBarStateQuery
)(ComposedFloatingAddButton)
