import _ from 'lodash'

import { getTodoList, upsertNewTodoItem, deleteTodoItem, updateTodoItemStatus } from '../models/todo'
import { STATUS_CONFIGS } from '../../configs/todo'
import { composeTypenameFactory } from '../../utils/graphql'
import { getSideBarCache, setSideBarCache } from './sideBar'

// Define typename
export const TODO_LIST_TYPE_NAME = 'TodoList'
export const TODO_ITEM_TYPE_NAME = 'TodoItem'

export const composeTodoListTypename = composeTypenameFactory(TODO_LIST_TYPE_NAME)
export const composeTodoItemTypename = composeTypenameFactory(TODO_ITEM_TYPE_NAME)

/**
 * sort and filter list with given options
 * @param {Object} itemList
 * @param {Object} [options]
 * @returns {Object}
 */
const makeSortedItemList = (itemList, options) =>
  composeTodoListTypename({
    items: makeTodoListBy(itemList, options).map(item =>
      composeTodoItemTypename({
        ...item,
      })
    ),
  })

// Define resolvers
export const resolvers = {
  Query: {
    todoList: (_src, { status = STATUS_CONFIGS.ALL.query }) => {
      const itemList = getTodoList()
      return makeSortedItemList(itemList, { status })
    },
  },
  Mutation: {
    doneTodo: (_src, { id }, { cache }) => {
      const sideBar = getSideBarCache(cache)
      // change task status to 'done'
      const newItemList = updateTodoItemStatus(id, STATUS_CONFIGS.DONE.query)
      return makeSortedItemList(newItemList, { status: sideBar.selected })
    },
    deleteTodo: (_src, { id }, { cache }) => {
      const sideBar = getSideBarCache(cache)
      // delete item from store
      const newItemList = deleteTodoItem(id)
      return makeSortedItemList(newItemList, { status: sideBar.selected })
    },
    upsertTodo: (_src, args, { cache }) => {
      // if id exist, then update
      // if is not exist, then insert
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
      if (!id) {
        // if insert, reset filter
        setSideBarCache(cache, { selected: STATUS_CONFIGS.ALL.query })
        return makeSortedItemList(newItemList)
      } else {
        // if update, use current filter
        const sideBar = getSideBarCache(cache)
        return makeSortedItemList(newItemList, { status: sideBar.selected })
      }
    },
  },
}

/*----------------------------------------------------------------------------------
 *  UTILITY FUNCTION
 *---------------------------------------------------------------------------------*/

const DEFAULT_TODO_LIST_OPTIONS = { status: STATUS_CONFIGS.ALL.query, sortBy: 'id', isDescending: true }

/**
 * sort todo list with given options
 * @param {Array|Object} key
 * @param {string} [options.status = STATUS_CONFIGS.ALL.query]
 * @param {string} [options.sortBy = 'id']
 * @param {boolean} [options.isDescending = true]
 * @return {Array}
 */
function makeTodoListBy(items, options = DEFAULT_TODO_LIST_OPTIONS) {
  const validateItems = _.isArray(items) ? items : _.isObject(items) ? Object.values(items) : []
  if (_.isEmpty(validateItems)) return []
  // merge options to make new todo list
  const mergedOptions = { ...DEFAULT_TODO_LIST_OPTIONS, ...options }
  const { status, sortBy, isDescending } = mergedOptions
  // filter section
  let filteredItems = validateItems
  if (status !== STATUS_CONFIGS.ALL.query) {
    // mutate variable, if we need to filter
    filteredItems = validateItems.filter(item => item.status === status)
  }
  // sort section
  if (isDescending) {
    return filteredItems.sort((a, b) => b[sortBy] - a[sortBy])
  } else {
    return filteredItems.sort((a, b) => a[sortBy] - b[sortBy])
  }
}
