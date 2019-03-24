import { LOCALSTORAGE_KEY } from '../../configs/todo'
import { getItem, setItem } from '../../libs/localStorage'

/**
 * get todo items from store
 * @returns {*}
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
  return getItem(LOCALSTORAGE_KEY)[id] || {}
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
  const exisingItems = getTodoList()
  // merge data
  const newItems = {
    ...exisingItems,
    [task.id]: {
      ...exisingItems[task.id],
      ...task,
    },
  }
  // set new data to store
  const response = setItem(LOCALSTORAGE_KEY, newItems)
  return response ? newItems : null
}
