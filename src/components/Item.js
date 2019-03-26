import React from 'react'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'
import { compose } from 'react-apollo'
import dateformat from 'dateformat'

import DefaultExpansionPanel from '@material-ui/core/ExpansionPanel'
import DefaultExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import DefaultExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import DefaultDivider from '@material-ui/core/Divider'

import IconDone from '@material-ui/icons/Done'
import IconDoneOutline from '@material-ui/icons/DoneOutline'
import IconCreateOutlined from '@material-ui/icons/CreateOutlined'
import IconDeleteOutline from '@material-ui/icons/DeleteOutline'
import IconDateRange from '@material-ui/icons/DateRange'

import { PRIORITY_CONFIGS, STATUS_CONFIGS } from '../configs/todo'
import { SPACING } from '../utils/styles'
import { EMPTY_FUNCTION } from '../utils/constant'

import {
  composedDeleteTodoItemMutation,
  DELETE_TODO_ITEM_MUTATION_NAME,
  composedDoneTodoItemMutation,
  DONE_TODO_ITEM_MUTATION_NAME,
} from '../componentsGraphQL/TodoList'
import { composedSetEditorStateMutation, EDITOR_STATE_MUTATION_NAME } from '../componentsGraphQL/Editor'
import { EDITOR_EDIT_MODE } from '../graphql/resolvers/editor'
import { COLORS } from '../utils/colors'

const ItemContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`
const ContentBox = styled.div`
  display: flex;
  width: 100%;
  margin-right: ${SPACING.MD}px;
`
const TitleLabel = styled.div`
  display: flex;
  align-items: center;
  word-break: break-word;
  margin-left: ${SPACING.SM}px;
  color: ${COLORS.THEME};
`
const Divider = styled(DefaultDivider)`
  && {
    margin: ${SPACING.SM}px 0;
  }
`

const ExpansionPanel = styled(({ borderColor, ...restProps }) => <DefaultExpansionPanel {...restProps} />)`
  ${props =>
    props.borderColor &&
    css`
      border-left: 8px solid ${props.borderColor};
    `}
`
const ExpansionPanelSummary = styled(DefaultExpansionPanelSummary)`
  && {
    padding: ${SPACING.XS}px ${SPACING.SM}px;
    min-height: 0;
    // overwrite mui child that not exist in jsx
    > div:first-child {
      flex-direction: column;
      margin: 0;
    }
  }
`
const ExpansionPanelDetails = styled(DefaultExpansionPanelDetails)`
  && {
    flex-direction: column;
    padding: 0 ${SPACING.LG}px ${SPACING.SM}px ${SPACING.MD}px;
  }
`
const StatusLabel = styled.div`
  font-size: 12px;
  color: ${props => props.color};
  text-align: right;
`
const DetailBox = styled.div`
  display: flex;
  font-style: italic;
  color: ${COLORS.TEXT_SUBTITLE};
  font-size: 12px;
  align-items: center;
`
const ActionBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${COLORS.TEXT_TITLE};
`
const DetailBoxTitle = styled.span`
  margin-left: ${SPACING.SM}px;
`

/*----------------------------------------------------------------------------------
 *  MAIN COMPONENT
 *---------------------------------------------------------------------------------*/

const Item = props => {
  const { item } = props
  const isDoneTask = item.status === STATUS_CONFIGS.DONE.query
  // handle done button event
  const onClickDoneButton = event => {
    event.stopPropagation()
    props.onClickDoneButton(item)
  }
  // handle edit button event
  const onClickEditButton = event => {
    event.stopPropagation()
    props.onClickEditButton(item)
  }
  // handle delete button event
  const onClickDeleteButton = event => {
    event.stopPropagation()
    props.onClickDeleteButton(item)
  }
  // new task: created time less than 1 min from now
  const createdAt = new Date(item.createdAt).getTime()
  const isNewTask = new Date() - createdAt < 60 * 1000
  // status label
  const activeStatus = isDoneTask ? STATUS_CONFIGS.DONE : isNewTask ? STATUS_CONFIGS.NEW : null

  return (
    <Grid item xs={12}>
      <ExpansionPanel borderColor={PRIORITY_CONFIGS[item.priority].color}>
        {/* overwrite  mui style when expanded */}
        <ExpansionPanelSummary style={{ minHeight: 0 }}>
          {activeStatus && <StatusLabel color={activeStatus.color}>{activeStatus.label}</StatusLabel>}
          {/* overwrite  mui last child selecting style */}
          <ItemContainer style={{ paddingRight: 0 }}>
            <ContentBox>
              <TitleLabel>{item.title}</TitleLabel>
            </ContentBox>
          </ItemContainer>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <DetailBox>
            <IconDateRange />
            <DetailBoxTitle>{dateformat(item.dueDate, 'd mmm yy')}</DetailBoxTitle>
          </DetailBox>
          <Divider />
          {/* action box */}
          <ActionBox>
            <IconButton color="inherit" onClick={onClickDoneButton} disabled={isDoneTask}>
              {isDoneTask ? <IconDone /> : <IconDoneOutline />}
            </IconButton>
            <IconButton color="inherit" onClick={onClickEditButton}>
              <IconCreateOutlined />
            </IconButton>
            <IconButton color="inherit" onClick={onClickDeleteButton}>
              <IconDeleteOutline />
            </IconButton>
          </ActionBox>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Grid>
  )
}

/*----------------------------------------------------------------------------------
 *  COMPONENT WITH APOLLO
 *---------------------------------------------------------------------------------*/

const composedItem = props => {
  // handle on click edit button on list item event
  const onClickEditButton = item => {
    props[EDITOR_STATE_MUTATION_NAME]({ variables: { isOpen: true, mode: EDITOR_EDIT_MODE, editingTaskId: item.id } })
  }
  // handle on click done button on list item event
  const onClickDoneButton = item => {
    props[DONE_TODO_ITEM_MUTATION_NAME]({ variables: { id: item.id } })
  }
  // handle on click delete button on list item event
  const onClickDeleteButton = item => {
    props[DELETE_TODO_ITEM_MUTATION_NAME]({ variables: { id: item.id } })
  }

  return (
    <Item
      {...props}
      onClickEditButton={onClickEditButton}
      onClickDeleteButton={onClickDeleteButton}
      onClickDoneButton={onClickDoneButton}
    />
  )
}

export const ItemWithApollo = compose(
  composedSetEditorStateMutation,
  composedDeleteTodoItemMutation,
  composedDoneTodoItemMutation
)(composedItem)

Item.propTypes = {
  onClickDeleteButton: PropTypes.func,
  onClickDoneButton: PropTypes.func,
  onClickEditButton: PropTypes.func,
  item: PropTypes.shape({
    title: PropTypes.string,
    priority: PropTypes.string,
    status: PropTypes.string,
    createdAt: PropTypes.number,
    dueDate: PropTypes.number,
  }),
}

Item.defaultProps = {
  onClickDeleteButton: EMPTY_FUNCTION,
  onClickDoneButton: EMPTY_FUNCTION,
  onClickEditButton: EMPTY_FUNCTION,
  item: {},
}

export default Item
