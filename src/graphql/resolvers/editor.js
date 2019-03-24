// import { TODO_ITEM_TYPE_NAME } from './todo'
// import { GET_TODO_ITEM } from '../../componentsGraphQL/TodoList'

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
    __typename: EDITOR_TYPE_NAME,
  },
}

// Define resolvers
export const resolvers = {
  Query: {
    editingTask: src => {
      console.error('>>> [editor.js:23] sssssssssss editingTask src', src)
      return {}
    },
  },
  Mutation: {
    setEditorState: (_src, { isOpen, mode = EDITOR_CREATE_MODE, editingTaskId = null }, { cache }) => {
      // let editingTask
      // if args.editingTaskId, then get data from cache
      if (editingTaskId) {
        // const data = cache.readFragment({ query: GET_TODO_ITEM, variables: { id: editingTaskId } })
        // console.log('>>> [editor.js] data : ', data)
      }

      console.log('>>> [editor.js] editingTaskId : ', editingTaskId)
      console.log('>>> [editor.js] cache : ', cache)

      return {
        isOpen,
        mode,
        editingTaskId,
        __typename: EDITOR_TYPE_NAME,
      }
    },
  },
}
