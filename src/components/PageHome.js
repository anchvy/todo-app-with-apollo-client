import _ from 'lodash'
import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { compose } from 'react-apollo'

import Grid from '@material-ui/core/Grid'

import Layout from './Layout'
import { ItemWithApollo } from './Item'
import { EditorDialogWithApollo } from './EditorDialog'
import { SideBarWithApollo } from './SideBar'
import { FloatingAddButtonWithApollo } from './FloatingMenu'

import { SPACING } from '../utils/styles'
import { GET_TODO_LIST_QUERY_NAME, GetTodoListQuery } from '../componentsGraphQL/TodoList'
import { SIDEBAR_STATE_QUERY_NAME, composedGetSideBarStateQuery } from '../componentsGraphQL/SideBar'
import { STATUS_CONFIGS } from '../configs/todo'

/*----------------------------------------------------------------------------------
 *  STYLED COMPONENTS
 *---------------------------------------------------------------------------------*/

const Wrapper = styled.section`
  width: 100%;
`
const Container = styled.div`
  margin: 80px 0;
`
const ListContainer = styled.div`
  margin: ${SPACING.MD}px;
`
const ItemList = styled.div`
  margin: auto;
  max-width: 1024px;
  width: 100%;
`

/*----------------------------------------------------------------------------------
 *  MAIN COMPONENTS
 *---------------------------------------------------------------------------------*/

const List = props => (
  <GetTodoListQuery filter={props.filter}>
    {response => {
      // extract data from todoListQuery
      // const todoListResponse = _.get(response, `${GET_TODO_LIST_QUERY_NAME}`)
      const todoItems = _.get(response, `${GET_TODO_LIST_QUERY_NAME}.todoList.items`, [])
      // const { state: todoListState } = todoListResponse

      return (
        <ItemList>
          <Grid container spacing={SPACING.SM}>
            {todoItems.map(item => (
              <ItemWithApollo key={item.id} item={item} />
            ))}
          </Grid>
        </ItemList>
      )
    }}
  </GetTodoListQuery>
)

const ComposedListStatus = props => {
  // query: sidebar state
  const sideBar = _.get(props, `${SIDEBAR_STATE_QUERY_NAME}.sideBar`, {})
  return <List filter={sideBar.selected} />
}

const ListWithApollo = compose(composedGetSideBarStateQuery)(ComposedListStatus)

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

List.propTypes = {
  filter: PropTypes.string,
}

List.defaultProps = {
  filter: STATUS_CONFIGS.ALL.query,
}

export default PageHome
