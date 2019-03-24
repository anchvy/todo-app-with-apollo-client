import _ from 'lodash'

import { getTodoList, upsertNewTodoItem, deleteTodoItem } from '../models/todo'
import { STATUS_CONFIGS } from '../../configs/todo'

// Define typename
export const TODO_LIST_TYPE_NAME = 'TodoList'
export const TODO_ITEM_TYPE_NAME = 'TodoItem'

const makeSortedItemList = (itemList, sortBy = 'id', isAscending = true) => ({
  items: sortTodoListBy(itemList, sortBy, isAscending).map(item => ({
    ...item,
    __typename: TODO_ITEM_TYPE_NAME,
  })),
  __typename: TODO_LIST_TYPE_NAME,
})

// Define resolvers
export const resolvers = {
  Query: {
    todoList: () => {
      const itemList = getTodoList()
      return makeSortedItemList(itemList, 'id', false)
    },
  },
  Mutation: {
    deleteTodo: (_src, { id }) => {
      // delete item from store
      const newItemList = deleteTodoItem(id)
      return makeSortedItemList(newItemList, 'id', false)
    },
    upsertTodo: (_src, args) => {
      const { id } = args
      // manage upsert task data
      const upsertTask = {
        ...args,
        dueDate: new Date(args.dueDate).getTime(),
        status: STATUS_CONFIGS.inProgress.query,
      }
      // add meta data for new task
      if (!id) {
        const timestamp = new Date().getTime()
        upsertTask.id = String(timestamp)
        upsertTask.createdAt = timestamp
      }
      // add new task to storage
      const newItemList = upsertNewTodoItem(upsertTask)
      return makeSortedItemList(newItemList, 'id', false)
    },
  },
}

/*----------------------------------------------------------------------------------
 *  UTILITY FUNCTION
 *---------------------------------------------------------------------------------*/

/**
 * sort todo list with given options
 * @param {Array|Object} key
 * @param {string} key
 * @param {boolean} [isAscending = true]
 * @return {Array}
 */
function sortTodoListBy(items, key, isAscending = true) {
  const sortItems = _.isArray(items) ? items : _.isObject(items) ? Object.values(items) : []
  if (isAscending) {
    return sortItems.sort((a, b) => a[key] - b[key])
  } else {
    return sortItems.sort((a, b) => b[key] - a[key])
  }
}
