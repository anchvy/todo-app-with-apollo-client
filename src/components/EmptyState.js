import React from 'react'
import styled from 'styled-components'

import DefaultPaper from '@material-ui/core/Paper'
import EMPTY_STATE_ICON from '../statics/images/empty-state.png'
import { withDesktopSize, withMobileSize } from '../utils/styles'

/*----------------------------------------------------------------------------------
 *  STYLED COMPONENTS
 *---------------------------------------------------------------------------------*/

const Paper = styled(DefaultPaper)`
  // estimate value
  min-height: 87vh;

  && {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 0;
  }
`
const Icon = styled.img`
  ${withDesktopSize(`
    width: 20%;
  `)}

  ${withMobileSize(`
    width: 50%;
  `)}
`

/*----------------------------------------------------------------------------------
 *  MAIN COMPONENTS
 *---------------------------------------------------------------------------------*/

const EmptyState = () => {
  return (
    <Paper elevation={1}>
      <Icon alt="Empty icon" src={EMPTY_STATE_ICON} />
    </Paper>
  )
}

EmptyState.propTypes = {}

EmptyState.defaultProps = {}

export default EmptyState
