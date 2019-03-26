import React from 'react'
import { Query } from 'react-apollo'
import PropTypes from 'prop-types'
import { EMPTY_FUNCTION } from './constant'

/**
 * factory: compose object with typename
 * @param {string} typename
 * @returns {Function}
 */
export function composeTypenameFactory(typename) {
  return src => ({
    ...src,
    __typename: typename,
  })
}

/**
 * compute custom response from default graphql response
 * @param {*} response
 * @returns {Object}
 */
export function defaultResponseParser(response) {
  const { loading, error } = response

  return {
    state: {
      isLoading: loading,
      isError: !!error,
    },
  }
}

/**
 * format composed component props before send to caller
 * ___ used for composed component only ___
 * @param {*} gqlResponse
 * @returns {Object}
 */
export function formatComposedComponentProps(gqlResponse, name) {
  const apolloResponse = gqlResponse[name]
  const { ownProps } = gqlResponse

  return {
    [name]: {
      ...apolloResponse,
      ...defaultResponseParser(apolloResponse),
    },
    ...ownProps,
  }
}

/**
 * query component factory
 * @param {*} gql
 * @param {Object} [options = {}]
 * @returns {*}
 */
export function createQueryComponent(gql, name, options = {}) {
  const CustomQueryComponent = props => {
    const { children, fetchPolicy, notifyOnNetworkStatusChange, ...restProps } = props

    return (
      <Query
        query={gql}
        variables={restProps}
        fetchPolicy={fetchPolicy}
        notifyOnNetworkStatusChange={notifyOnNetworkStatusChange}
      >
        {response => {
          const { data, ...restResponse } = response
          const defaultResponse = defaultResponseParser(response, options)

          return children({
            [name]: {
              ...defaultResponse,
              ...restResponse,
              ...data,
            },
            ...restProps,
          })
        }}
      </Query>
    )
  }

  CustomQueryComponent.propTypes = {
    notifyOnNetworkStatusChange: PropTypes.bool,
    fetchPolicy: PropTypes.string,
    children: PropTypes.func,
  }

  CustomQueryComponent.defaultProps = {
    notifyOnNetworkStatusChange: false,
    fetchPolicy: 'cache-first',
    children: EMPTY_FUNCTION,
  }

  return CustomQueryComponent
}
