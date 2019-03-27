import _ from 'lodash'
import { LOCALSTORAGE_KEY } from '../../configs/todo'
import { getItem, setItem } from '../../libs/localStorage'

/**
 * update todo item status with given options
 * @param {string|Array<string>} id
 * @param {string} status
 * @returns {Object}
 */
export function updateTodoItemStatus(id, status) {
  const items = getTodoList()
  const updateIds = _.isArray(id) ? id : [id]
  // update with existing items
  const newItems = updateIds.reduce(
    (result, updateId) => ({
      ...result,
      [updateId]: {
        ...items[updateId],
        status,
      },
    }),
    items
  )
  // set new data to store
  const response = setItem(LOCALSTORAGE_KEY, newItems)
  return response ? newItems : null
}

/**
 * delete todo item from store with given id
 * @param {string|Array<string>} id
 * @returns {Object}
 */
export function deleteTodoItem(id) {
  const items = getTodoList()
  const deleteIds = _.isArray(id) ? id : [id]
  // delete from existing items
  const newItems = _.omit(items, deleteIds)
  // set new items to storage
  const response = setItem(LOCALSTORAGE_KEY, newItems)
  return response ? newItems : null
}

/**
 * get todo items from store
 * @returns {Object}
 */
export function getTodoList() {
  return getItem(LOCALSTORAGE_KEY) || {}
}

/**
 * get todo item from store with given id
 * @param {string} id
 * @returns {Object}
 */
export function getTodoItem(id) {
  return (getItem(LOCALSTORAGE_KEY) && getItem(LOCALSTORAGE_KEY)[id]) || {}
}

/**
 * add todo items to store
 * @param {Object} task
 * @param {number} task.id
 * @param {string} task.title
 * @param {string} task.dueDate
 * @param {string} task.priority
 * @param {number} task.createdAt
 * @returns {Object|null}
 */
export function upsertNewTodoItem(task) {
  const items = getTodoList()
  // merge data
  const newItems = {
    ...items,
    [task.id]: {
      ...items[task.id],
      ...task,
    },
  }
  // set new data to store
  const response = setItem(LOCALSTORAGE_KEY, newItems)
  return response ? newItems : null
}
