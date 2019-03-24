import _ from 'lodash'
import { getTodoList, addNewTodoItem } from '../models/todo'
import { STATUS_CONFIGS } from '../../configs/todo'

// Define typename
export const TODO_LIST_TYPE_NAME = 'TodoList'
export const TODO_ITEM_TYPE_NAME = 'TodoItem'

// Define resolvers
export const resolvers = {
  Query: {
    todoList: () => {
      const items = getTodoList()
      const sortedItemList = sortTodoListBy(items, 'id', false)

      return {
        items: sortedItemList.map(item => ({
          ...item,
          __typename: TODO_ITEM_TYPE_NAME,
        })),
        __typename: TODO_LIST_TYPE_NAME,
      }
    },
  },
  Mutation: {
    addTodo: (_src, args) => {
      // manage new task data
      const timestamp = new Date().getTime()
      const newTask = {
        ...args,
        dueDate: new Date(args.dueDate).getTime(),
        createdAt: timestamp,
        id: String(timestamp), // unique id
        status: STATUS_CONFIGS.inProgress.query,
        __typename: TODO_ITEM_TYPE_NAME,
      }
      // add new task to storage
      const newItemList = addNewTodoItem(newTask)
      const sortedItemList = sortTodoListBy(newItemList, 'id', false)
      return {
        items: sortedItemList.map(item => ({
          ...item,
          __typename: TODO_ITEM_TYPE_NAME,
        })),
        __typename: TODO_LIST_TYPE_NAME,
      }
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
