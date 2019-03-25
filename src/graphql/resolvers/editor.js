import _ from 'lodash'
import { composeTodoItemTypename } from './todo'
import { getTodoItem } from '../models/todo'
import { composeTypenameFactory } from '../../utils/graphql'

// Define typename
export const EDITOR_TYPE_NAME = 'EditorDialog'
export const composeEditorTypename = composeTypenameFactory(EDITOR_TYPE_NAME)

// Define initial state
export const EDITOR_CREATE_MODE = 'create'
export const EDITOR_EDIT_MODE = 'edit'

export const defaults = {
  editor: composeEditorTypename({
    isOpen: false,
    mode: EDITOR_CREATE_MODE,
    editingTaskId: null,
    editingTask: composeTodoItemTypename({
      id: null,
      title: null,
      priority: null,
      dueDate: null,
      status: null,
      createdAt: null,
    }),
  }),
}

// Define resolvers
export const resolvers = {
  [EDITOR_TYPE_NAME]: {
    editingTask: ({ editingTaskId }) => {
      const editingTask = getTodoItem(editingTaskId)
      return !_.isEmpty(editingTask) ? composeTodoItemTypename(editingTask) : null
    },
  },
  Mutation: {
    setEditorState: (_src, { isOpen, mode = EDITOR_CREATE_MODE, editingTaskId }) =>
      composeEditorTypename({
        isOpen,
        mode,
        editingTaskId,
      }),
  },
}
