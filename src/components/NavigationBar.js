import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { compose } from 'react-apollo'

import DefaultAppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'

import { COLORS } from '../utils/colors'
import { EMPTY_FUNCTION } from '../utils/constant'

import { SIDEBAR_STATE_MUTATION_NAME, composedSetSideBarStateMutation } from '../componentsGraphQL/SideBar'
import { MAX_WIDTH as SIDEBAR_MAX_WIDTH } from './SideBar'
import { withDesktopSize, styleHidden } from '../utils/styles'

/*----------------------------------------------------------------------------------
 *  STYLED COMPONENTS
 *---------------------------------------------------------------------------------*/

const AppBar = styled(DefaultAppBar)`
  && {
    position: fixed;
    background: ${COLORS.theme};
  }
`
const Title = styled.div`
  display: flex;
  align-items: center;
`
const Container = styled.div`
  display: flex;
  width: 100%;
  max-width: 1024px;
  margin: auto;
  font-size: 18px;

  ${withDesktopSize(`
  padding-left: ${SIDEBAR_MAX_WIDTH}px;
`)}
`
const MenuButton = styled(IconButton)`
  ${withDesktopSize(styleHidden(false))}
`

/*----------------------------------------------------------------------------------
 *  MAIN COMPOENTNS
 *---------------------------------------------------------------------------------*/

const NavigationBar = props => {
  return (
    <AppBar>
      <Toolbar>
        <Container>
          <MenuButton color="inherit" aria-label="Menu" onClick={props.onClickMenuButton}>
            <MenuIcon />
          </MenuButton>
          <Title>ALL TASKS</Title>
        </Container>
      </Toolbar>
    </AppBar>
  )
}

/*----------------------------------------------------------------------------------
 *  COMPONENTS WITH APOLLO
 *---------------------------------------------------------------------------------*/

const ComposedNavigationBar = props => {
  // handle on click menu button event
  const onClickMenuButton = () => {
    props[SIDEBAR_STATE_MUTATION_NAME]({ variables: { isOpen: true } })
  }

  return <NavigationBar onClickMenuButton={onClickMenuButton} />
}

export const NavigationBarWithApollo = compose(composedSetSideBarStateMutation)(ComposedNavigationBar)

NavigationBar.propTypes = {
  onClickMenuButton: PropTypes.func,
}

NavigationBar.defaultProps = {
  onClickMenuButton: EMPTY_FUNCTION,
}

export default NavigationBar
