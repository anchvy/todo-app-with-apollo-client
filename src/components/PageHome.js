import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'

import Layout from './Layout'
import { ItemWithApollo } from './Item'
import { EditorDialogWithApollo } from './EditorDialog'
import { SideBarWithApollo } from './SideBar'
import { FloatingAddButtonWithApollo } from './FloatingMenu'

import { SPACING } from '../utils/styles'

/*----------------------------------------------------------------------------------
 *  STYLED COMPONENTS
 *---------------------------------------------------------------------------------*/

const Wrapper = styled.div`
  width: 100%;
`
const Container = styled.div`
  margin: 80px 0;
`
const ListContainer = styled.div`
  margin: ${SPACING.MD}px;
`
const List = styled.div`
  margin: auto;
  max-width: 1024px;
  width: 100%;
`

/*----------------------------------------------------------------------------------
 *  MAIN COMPONENTS
 *---------------------------------------------------------------------------------*/

const PageHome = props => (
  <Layout>
    <Wrapper>
      <Container>
        <ListContainer>
          <List>
            <Grid container spacing={SPACING.SM}>
              {props.todoItems.map(item => (
                <ItemWithApollo key={item.id} item={item} />
              ))}
            </Grid>
          </List>
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

PageHome.propTypes = {
  todoItems: PropTypes.arrayOf(PropTypes.object),
  isLoadingList: PropTypes.bool,
  // children: CHILDREN_PROP_TYPES,
}

PageHome.defaultProps = {
  todoItems: [],
  isLoadingList: false,
  // children: null,
}

export default PageHome
