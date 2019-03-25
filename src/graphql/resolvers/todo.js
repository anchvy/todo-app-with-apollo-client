import _ from 'lodash'

import { getTodoList, upsertNewTodoItem, deleteTodoItem, updateTodoItemStatus } from '../models/todo'
import { STATUS_CONFIGS } from '../../configs/todo'
import { composeTypenameFactory } from '../../utils/graphql'

// Define typename
export const TODO_LIST_TYPE_NAME = 'TodoList'
export const TODO_ITEM_TYPE_NAME = 'TodoItem'

export const composeTodoListTypename = composeTypenameFactory(TODO_LIST_TYPE_NAME)
export const composeTodoItemTypename = composeTypenameFactory(TODO_ITEM_TYPE_NAME)

const makeSortedItemList = (itemList, sortBy = 'id', isAscending = true) =>
  composeTodoListTypename({
    items: sortTodoListBy(itemList, sortBy, isAscending).map(item =>
      composeTodoItemTypename({
        ...item,
      })
    ),
  })

// Define resolvers
export const resolvers = {
  Query: {
    todoList: () => {
      const itemList = getTodoList()
      return makeSortedItemList(itemList)
    },
  },
  Mutation: {
    doneTodo: (_src, { id }) => {
      // change task status to 'done'
      const newItemList = updateTodoItemStatus(id, STATUS_CONFIGS.DONE.query)
      return makeSortedItemList(newItemList)
    },
    deleteTodo: (_src, { id }) => {
      // delete item from store
      const newItemList = deleteTodoItem(id)
      return makeSortedItemList(newItemList)
    },
    upsertTodo: (_src, args) => {
      const { id } = args
      // manage upsert task data
      const upsertTask = {
        ...args,
        dueDate: new Date(args.dueDate).getTime(),
      }
      // add meta data for new task
      if (!id) {
        const timestamp = new Date().getTime()
        upsertTask.id = String(timestamp)
        upsertTask.createdAt = timestamp
        upsertTask.status = STATUS_CONFIGS.IN_PROGRESS.query
      }
      // add new task to storage
      const newItemList = upsertNewTodoItem(upsertTask)
      return makeSortedItemList(newItemList)
    },
  },
}

/*----------------------------------------------------------------------------------
 *  UTILITY FUNCTION
 *---------------------------------------------------------------------------------*/

/**
 * sort todo list with given options
 * @param {Array|Object} key
 * @param {string} [key = 'id']
 * @param {boolean} [isDescending = true]
 * @return {Array}
 */
function sortTodoListBy(items, key = 'id', isDescending = true) {
  const sortItems = _.isArray(items) ? items : _.isObject(items) ? Object.values(items) : []
  if (isDescending) {
    return sortItems.sort((a, b) => b[key] - a[key])
  } else {
    return sortItems.sort((a, b) => a[key] - b[key])
  }
}
