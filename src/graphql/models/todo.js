import { LOCALSTORAGE_KEY } from '../../configs/todo'
import { getItem, setItem } from '../../libs/localStorage'

/**
 * get todo items from store
 * @returns {Array}
 */
export function getTodoList() {
  return getItem(LOCALSTORAGE_KEY) || {}
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
export function addNewTodoItem(task) {
  const exisingItems = getTodoList()
  // merge data
  const newItems = {
    ...exisingItems,
    [task.id]: task,
  }
  // set new data to store
  const response = setItem(LOCALSTORAGE_KEY, newItems)
  return response ? newItems : null
}
