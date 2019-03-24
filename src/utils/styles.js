import { css } from 'styled-components'

const DEFAULT_SPACING = 8

// Define default spacing
export const SPACING = {
  XS: DEFAULT_SPACING / 2,
  SM: DEFAULT_SPACING,
  MD: DEFAULT_SPACING * 2,
  LG: DEFAULT_SPACING * 3,
  XL: DEFAULT_SPACING * 4,
}

// Define default breakpoints
export const MOBILE_BREAKPOINT = 768

/**
 * set specific style on desktop size
 * @param {*} style
 * @returns {*}
 */
export function withDesktopSize(style) {
  return css`
    @media (min-width: ${MOBILE_BREAKPOINT}px) {
      ${style}
    }
  `
}

/**
 * set specific style on mobile / tablet size
 * @param {*} style
 * @returns {*}
 */
export function withMobileSize(style) {
  return css`
    @media (max-width: ${MOBILE_BREAKPOINT}px) {
      ${style}
    }
  `
}

/**
 * Define current scrren size is desktop
 * @returns {boolean}
 */
export function isDesktopSize() {
  return window.innerWidth > MOBILE_BREAKPOINT
}

/**
 * hidden element with given option
 * @param {boolean} [isPreserveSpace = false]
 */
export function styleHidden(isPreserveSpace = false) {
  return css`
    && {
      ${isPreserveSpace ? 'visibility: hidden;' : 'display: none;'}
    }
  `
}
