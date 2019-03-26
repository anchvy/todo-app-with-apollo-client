import React from 'react'
import styled from 'styled-components'

import Layout from './Layout'
import { ListWithApollo } from './List'
import { EditorDialogWithApollo } from './EditorDialog'
import { SideBarWithApollo } from './SideBar'
import { FloatingAddButtonWithApollo } from './FloatingMenu'

import { SPACING } from '../utils/styles'

/*----------------------------------------------------------------------------------
 *  STYLED COMPONENTS
 *---------------------------------------------------------------------------------*/

const Wrapper = styled.section`
  width: 100%;
`
const Container = styled.div`
  padding: 60px 0 0 0;
  height: 100%;
`
const ListContainer = styled.div`
  margin: ${SPACING.MD}px;
`

/*----------------------------------------------------------------------------------
 *  MAIN COMPONENTS
 *---------------------------------------------------------------------------------*/

const PageHome = () => (
  <Layout>
    <Wrapper>
      <Container>
        <ListContainer>
          <ListWithApollo />
        </ListContainer>
        {/* extra components */}
        <EditorDialogWithApollo />
      </Container>
      <FloatingAddButtonWithApollo />
    </Wrapper>
    {/* extra components */}
    <SideBarWithApollo />
  </Layout>
)

export default PageHome
