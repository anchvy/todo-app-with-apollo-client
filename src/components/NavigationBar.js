import _ from 'lodash'
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

import {
  SIDEBAR_STATE_MUTATION_NAME,
  SIDEBAR_STATE_QUERY_NAME,
  composedSetSideBarStateMutation,
  composedGetSideBarStateQuery,
} from '../componentsGraphQL/SideBar'
import { MAX_WIDTH as SIDEBAR_MAX_WIDTH } from './SideBar'
import { withDesktopSize, styleHidden } from '../utils/styles'
import { MENU_STATUS_CONFIGS, APP_NAME } from '../configs/todo'

/*----------------------------------------------------------------------------------
 *  STYLED COMPONENTS
 *---------------------------------------------------------------------------------*/

const AppBar = styled(DefaultAppBar)`
  && {
    position: fixed;
    background: ${COLORS.THEME};
  }
`
const Container = styled.div`
  display: flex;
  width: 100%;
  margin: auto;
  font-size: 18px;
  justify-content: space-between;

  ${withDesktopSize(`
  padding-left: ${SIDEBAR_MAX_WIDTH}px;
`)}
`
const MenuButton = styled(IconButton)`
  ${withDesktopSize(styleHidden(false))}
`
const Section = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

/*----------------------------------------------------------------------------------
 *  MAIN COMPOENTNS
 *---------------------------------------------------------------------------------*/

const NavigationBar = props => (
  <AppBar>
    <Toolbar>
      <Container>
        <Section>
          <MenuButton color="inherit" aria-label="Menu" onClick={props.onClickMenuButton}>
            <MenuIcon />
          </MenuButton>
          {props.title}
        </Section>
      </Container>
    </Toolbar>
  </AppBar>
)

/*----------------------------------------------------------------------------------
 *  COMPONENTS WITH APOLLO
 *---------------------------------------------------------------------------------*/

const ComposedNavigationBar = props => {
  // query: sidebar state
  const sideBar = _.get(props, `${SIDEBAR_STATE_QUERY_NAME}.sideBar`, {})
  const activeMenu = _.find(MENU_STATUS_CONFIGS, status => status.query === sideBar.selected)
  // handle on click menu button event
  const onClickMenuButton = () => {
    props[SIDEBAR_STATE_MUTATION_NAME]({ variables: { isOpen: true } })
  }
  return (
    <NavigationBar
      title={activeMenu && activeMenu.label}
      activeMeny={activeMenu}
      onClickMenuButton={onClickMenuButton}
    />
  )
}

export const NavigationBarWithApollo = compose(
  composedSetSideBarStateMutation,
  composedGetSideBarStateQuery
)(ComposedNavigationBar)

NavigationBar.propTypes = {
  title: PropTypes.string,
  onClickMenuButton: PropTypes.func,
}

NavigationBar.defaultProps = {
  title: APP_NAME,
  onClickMenuButton: EMPTY_FUNCTION,
}

export default NavigationBar
