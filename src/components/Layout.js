import React from 'react'
import styled from 'styled-components'

import { NavigationBarWithApollo } from './NavigationBar'
import { CHILDREN_PROP_TYPES } from '../utils/proptypes'
import { withDesktopSize } from '../utils/styles'

/*----------------------------------------------------------------------------------
 *  STYLED COMPONENTS
 *---------------------------------------------------------------------------------*/

const Wrapper = styled.div`
  height: 100vh;
  min-width: 320px;
`

const Container = styled.div`
  display: flex;

  // ${withDesktopSize(`
  //   margin: auto;
  //   max-width: 768px;
  // `)}
`

/*----------------------------------------------------------------------------------
 *  MAIN COMPONENTS
 *---------------------------------------------------------------------------------*/

const Layout = props => {
  return (
    <Wrapper>
      <NavigationBarWithApollo />
      <Container>{props.children}</Container>
    </Wrapper>
  )
}

Layout.propTypes = {
  children: CHILDREN_PROP_TYPES,
}

Layout.defaultProps = {
  children: null,
}

export default Layout
