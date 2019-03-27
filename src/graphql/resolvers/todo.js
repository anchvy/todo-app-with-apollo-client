import _ from 'lodash'

import { getTodoList, upsertNewTodoItem, deleteTodoItem, updateTodoItemStatus, getTodoItem } from '../models/todo'
import { STATUS_CONFIGS } from '../../configs/todo'
import { composeTypenameFactory } from '../../utils/graphql'
import { getSideBarCache, setSideBarCache } from './sideBar'
import { GET_SELECTED_TODO_ITEMS } from '../../componentsGraphQL/TodoList'

// Define typename
export const TODO_LIST_TYPE_NAME = 'TodoList'
export const TODO_ITEM_TYPE_NAME = 'TodoItem'
export const TODO_SELECTED_ITEM_TYPE_NAME = 'TodoSelectedItem'

export const composeTodoListTypename = composeTypenameFactory(TODO_LIST_TYPE_NAME)
export const composeTodoItemTypename = composeTypenameFactory(TODO_ITEM_TYPE_NAME)
export const composeTodoSelectedItemTypename = composeTypenameFactory(TODO_SELECTED_ITEM_TYPE_NAME)

// Define initial state
export const defaults = {
  selectedItems: [],
}

/**
 * sort and filter list with given options
 * @param {Object} itemList
 * @param {Object} [options]
 * @returns {Object}
 */
function makeSortedItemList(itemList, options) {
  return composeTodoListTypename({
    items: makeTodoListBy(itemList, options).map(item =>
      composeTodoItemTypename({
        ...item,
      })
    ),
  })
}

/**
 * reuseble done todo resolver
 * @param {string|Array<string>} id
 * @param {*} cache
 * @return {Object}
 */
function doneTodoResolver(id, cache) {
  const sideBar = getSideBarCache(cache)
  // change task status to 'done'
  const newItemList = updateTodoItemStatus(id, STATUS_CONFIGS.DONE.query)
  return makeSortedItemList(newItemList, { status: sideBar.selected })
}

/**
 * reuseble done todo resolver
 * @param {string|Array<string>} id
 * @param {*} cache
 * @return {Object}
 */
function deleteTodoResolver(id, cache) {
  const sideBar = getSideBarCache(cache)
  // delete item from store
  const newItemList = deleteTodoItem(id)
  return makeSortedItemList(newItemList, { status: sideBar.selected })
}

/**
 * reset selected items cache
 * @param {*} cache
 */
function resetSelecteditems(cache) {
  cache.writeData({ data: defaults })
  return null
}

// Define resolvers
export const resolvers = {
  Query: {
    todoList: (_src, { status = STATUS_CONFIGS.ALL.query }) => {
      const itemList = getTodoList()
      return makeSortedItemList(itemList, { status })
    },
  },
  Mutation: {
    toggleSelectedItems: (_src, { id }, { cache }) => {
      // get existing selected items
      const { selectedItems: existingItems } = cache.readQuery({ query: GET_SELECTED_TODO_ITEMS })
      // get incoming selected item
      const todoItem = getTodoItem(id)
      // if data exist, toggle this item state
      if (todoItem) {
        const isAlreadyExisted = _.findIndex(existingItems, { id }) !== -1
        let newSelectedItems = isAlreadyExisted
          ? _.remove(existingItems, item => item.id !== id)
          : [...existingItems, composeTodoItemTypename(todoItem)]
        // write new cache
        cache.writeData({
          data: {
            selectedItems: newSelectedItems,
          },
        })
      }

      return null
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
    resetSelectedItems: (_src, _args, { cache }) => {
      resetSelecteditems(cache)
    },

    doneTodo: (_src, { id }, { cache }) => doneTodoResolver(id, cache),
    deleteTodo: (_src, { id }, { cache }) => deleteTodoResolver(id, cache),

    doneMultipleTodo: (_src, { ids }, { cache }) => {
      resetSelecteditems(cache)
      return doneTodoResolver(ids, cache)
    },
    deleteMultipleTodo: (_src, { ids }, { cache }) => {
      resetSelecteditems(cache)
      return deleteTodoResolver(ids, cache)
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
