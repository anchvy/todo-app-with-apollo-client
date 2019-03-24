/**
 * These constants are mainly used to be default value.
 * This will improve a lot of performance because it will reference to the same ref
 * no new reference created.
 */

/**
 * function that always return undefined
 * @returns {undefined}
 */
export function EMPTY_FUNCTION() {
  return undefined
}
export const EMPTY_OBJECT = {}
export const EMPTY_ARRAY = []
