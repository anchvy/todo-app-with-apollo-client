/**
 * replace value in localstorage with given storage key
 * @param {string} key
 * @param {*} item
 * @returns {boolean}
 */
export function setItem(key, item) {
  try {
    // add new value
    window.localStorage.setItem(key, JSON.stringify(item))
    // return latest value
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

/**
 * get value from localstorage with given storage key
 * @param {string} key
 * @returns {*}
 */
export function getItem(key) {
  try {
    const valueString = window.localStorage.getItem(key)
    return JSON.parse(valueString)
  } catch (error) {
    console.log(error)
    return {}
  }
}
