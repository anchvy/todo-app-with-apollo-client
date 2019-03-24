import { TODO_ITEM_TYPE_NAME } from './todo'
import { getTodoItem } from '../models/todo'

// Define typename
export const EDITOR_TYPE_NAME = 'EditorDialog'

// Define initial state
export const EDITOR_CREATE_MODE = 'create'
export const EDITOR_EDIT_MODE = 'edit'

export const defaults = {
  editor: {
    isOpen: false,
    mode: EDITOR_CREATE_MODE,
    editingTaskId: null,
    editingTask: {
      id: null,
      title: null,
      priority: null,
      dueDate: null,
      __typename: TODO_ITEM_TYPE_NAME,
    },
    __typename: EDITOR_TYPE_NAME,
  },
}

// Define resolvers
export const resolvers = {
  Mutation: {
    setEditorState: (_src, { isOpen, mode = EDITOR_CREATE_MODE, editingTaskId = null }) => {
      let editingTask
      // if args.editingTaskId, then get data from cache
      if (mode === EDITOR_EDIT_MODE && editingTaskId) {
        editingTask = getTodoItem(editingTaskId)
        editingTask.__typename = TODO_ITEM_TYPE_NAME
      }

      return {
        isOpen,
        mode,
        editingTaskId,
        editingTask,
        __typename: EDITOR_TYPE_NAME,
      }
    },
  },
}
