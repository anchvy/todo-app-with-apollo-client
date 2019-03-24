import React from 'react'
import styled from 'styled-components'
import Fab from '@material-ui/core/Fab'
import { compose } from 'react-apollo'

import IconAdd from '@material-ui/icons/Add'
import { SPACING, withDesktopSize, styleHidden } from '../utils/styles'

import { EDITOR_STATE_MUTATION_NAME, composedSetEditorStateMutation } from '../componentsGraphQL/Editor'
import { EDITOR_CREATE_MODE } from '../graphql/resolvers/editor'

const AddTaskButton = styled(Fab)`
  && {
    position: fixed;
    bottom: ${SPACING.MD}px;
    right: ${SPACING.MD}px;
  }

  ${withDesktopSize(styleHidden(true))}
`

const ComposedFloatingAddButton = props => {
  // handle on click new task button event
  const onClickAddTaskButton = () => {
    props[EDITOR_STATE_MUTATION_NAME]({ variables: { isOpen: true, mode: EDITOR_CREATE_MODE } })
  }
  return (
    <AddTaskButton color="default" aria-label="Add" onClick={onClickAddTaskButton}>
      <IconAdd />
    </AddTaskButton>
  )
}

export const FloatingAddButtonWithApollo = compose(composedSetEditorStateMutation)(ComposedFloatingAddButton)
