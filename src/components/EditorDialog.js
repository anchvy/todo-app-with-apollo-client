import _ from 'lodash'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import dateformat from 'dateformat'
import { compose } from 'react-apollo'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import DefaultDialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import DefaultRadio from '@material-ui/core/Radio'

import { PRIORITY_CONFIGS } from '../configs/todo'
import { isDesktopSize, SPACING } from '../utils/styles'
import { EMPTY_FUNCTION, EMPTY_OBJECT } from '../utils/constant'

import {
  composedSetEditorStateMutation,
  composedGetEditorStateQuery,
  EDITOR_STATE_QUERY_NAME,
  EDITOR_STATE_MUTATION_NAME,
} from '../componentsGraphQL/Editor'

import { UPSERT_TODO_ITEM_MUTATION_NAME, composedUpsertTodoItemMutation } from '../componentsGraphQL/TodoList'
import { EDITOR_CREATE_MODE, EDITOR_EDIT_MODE } from '../graphql/resolvers/editor'

/*----------------------------------------------------------------------------------
 *  STYLED COMPONENTS
 *---------------------------------------------------------------------------------*/

const Wrapper = styled.div``
const ContentBox = styled.div`
  margin: ${SPACING.LG}px 0;
`
const RadioBox = styled(Grid)`
  display: flex;
  align-items: center;
`
const RadioContainer = styled(Grid)`
  display: flex;
`
const RadioTitle = styled.label``
const Radio = styled(DefaultRadio)`
  && {
    padding: ${SPACING.XS}px;
  }
`
const Dialog = styled(DefaultDialog)`
  min-height: 70wh;
`

/*----------------------------------------------------------------------------------
 *  MAIN COMPONENTS
 *---------------------------------------------------------------------------------*/

const useOnChangeInput = initialValue => {
  const [value, setValue] = useState(`${initialValue}`)
  // handle on change event
  const onChangeValue = event => {
    setValue(event.target.value)
  }
  // on update state
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return { value, setValue, onChangeValue }
}

const PRIORITY_CONFIGS_VALUES = Object.values(PRIORITY_CONFIGS)
const DEFAULT_PRIORITY = PRIORITY_CONFIGS_VALUES[Math.floor(PRIORITY_CONFIGS_VALUES.length / 2)].value

const EditorDialog = props => {
  const today = new Date()
  // define internal variable
  const { mode, editingTask } = props
  const isEditing = mode !== EDITOR_CREATE_MODE
  // initial value
  // add: set duedate tomorrow as default
  // add: set middle priority value as default
  const activeTitle = isEditing ? editingTask.title : ''
  const activeDueDate = isEditing ? new Date(editingTask.dueDate).getTime() : today.setDate(today.getDate() + 1)
  const activePriority = isEditing ? editingTask.priority : DEFAULT_PRIORITY
  // handle state
  const [isTitleError, setIsTitleError] = useState(false)
  const { value: priority, setValue: setPriority, onChangeValue: onChangePriority } = useOnChangeInput(activePriority)
  const { value: title, setValue: setTitle, onChangeValue: onChangeTitle } = useOnChangeInput(activeTitle)
  const { value: dueDate, setValue: setDueDate, onChangeValue: onChangeDueDate } = useOnChangeInput(
    dateformat(activeDueDate, 'yyyy-mm-dd')
  )
  // error handling
  const onClickAddButton = () => {
    // validate title value
    const cleanTitle = title.replace(/(<script>|<\/script>)/g, '').trim()
    if (cleanTitle.length === 0) {
      setIsTitleError(true)
      return false
    }
    // re-initial default value
    setTitle('')
    setPriority(DEFAULT_PRIORITY)
    setDueDate(dateformat(today.setDate(today.getDate() + 1), 'yyyy-mm-dd'))
    // validate passed
    props.onClickAddButton({ id: editingTask.id, title: cleanTitle, dueDate, priority })
  }

  return (
    <Wrapper>
      <Dialog
        open={props.isOpen}
        onClose={props.onClickCloseButton}
        aria-labelledby="Task Editor"
        maxWidth="xl"
        fullWidth
        fullScreen={!isDesktopSize()}
        PaperProps={{ style: { height: '100%' } }}
      >
        {/* header */}
        <DialogTitle>{!isEditing ? `+ Add Task` : `Edit Task`}</DialogTitle>
        <Divider />
        {/* content */}
        <DialogContent>
          <ContentBox>
            <Grid container spacing={SPACING.LG}>
              <Grid item xs={12}>
                <TextField
                  required
                  autoFocus
                  fullWidth
                  label="Title"
                  multiline
                  value={title}
                  onChange={onChangeTitle}
                  error={isTitleError}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  label="Due Date"
                  type="date"
                  onChange={onChangeDueDate}
                  defaultValue={dueDate}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <RadioContainer item xs={12}>
                <Grid container spacing={SPACING.MD}>
                  {PRIORITY_CONFIGS_VALUES.map(priorityItem => (
                    <RadioBox key={priorityItem.value} item xs={12} sm={6 / PRIORITY_CONFIGS_VALUES.length}>
                      <Radio
                        checked={priority === priorityItem.value}
                        onChange={onChangePriority}
                        value={priorityItem.value}
                        name="radio-priority"
                        aria-label={priorityItem.value}
                        id={`priority-${priorityItem.value}`}
                        style={{ color: priorityItem.color }}
                      />
                      <RadioTitle htmlFor={`priority-${priorityItem.value}`}>{priorityItem.label}</RadioTitle>
                    </RadioBox>
                  ))}
                </Grid>
              </RadioContainer>
            </Grid>
          </ContentBox>
        </DialogContent>
        <Divider />
        {/* footer */}
        <DialogActions>
          <Button onClick={props.onClickCloseButton} color="default">
            Cancel
          </Button>
          <Button onClick={onClickAddButton} color="default">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Wrapper>
  )
}

/*----------------------------------------------------------------------------------
 *  COMPONENT WITH APOLLO
 *---------------------------------------------------------------------------------*/

const ComposedEditorDialog = props => {
  // query: editor state
  const editor = _.get(props, `${EDITOR_STATE_QUERY_NAME}.editor`, {})
  // mutation: update editor  state
  const onCancelState = () => {
    props[EDITOR_STATE_MUTATION_NAME]({ variables: { isOpen: false } })
  }
  // mutation: add todo task
  const onAddNewTask = async newTask => {
    const response = await props[UPSERT_TODO_ITEM_MUTATION_NAME]({ variables: newTask })
    const error = _.get(response, `data.error`)
    // handle response
    if (!error) {
      props[EDITOR_STATE_MUTATION_NAME]({ variables: { isOpen: false } })
    } else {
      console.log(error)
    }
  }

  return (
    <EditorDialog
      isOpen={editor.isOpen}
      mode={editor.mode}
      editingTask={editor.editingTask || EMPTY_OBJECT}
      onClickCloseButton={onCancelState}
      onClickAddButton={onAddNewTask}
    />
  )
}

export const EditorDialogWithApollo = compose(
  composedSetEditorStateMutation,
  composedGetEditorStateQuery,
  composedUpsertTodoItemMutation
)(ComposedEditorDialog)

EditorDialog.propTypes = {
  editingTask: PropTypes.object,
  mode: PropTypes.string,
  isOpen: PropTypes.bool,
  onClickCloseButton: PropTypes.func,
  onClickAddButton: PropTypes.func,
}

EditorDialog.defaultProps = {
  editingTask: {},
  mode: PropTypes.oneOf([EDITOR_CREATE_MODE, EDITOR_EDIT_MODE]),
  isOpen: false,
  onClickCloseButton: EMPTY_FUNCTION,
  onClickAddButton: EMPTY_FUNCTION,
}

export default EditorDialog
