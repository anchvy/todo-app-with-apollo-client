import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Homepage from './pages/home'
import routes from './configs/routes'
import client from './libs/initApollo'

const App = () => (
  <ApolloProvider client={client}>
    <BrowserRouter>
      <Switch>
        <Route exact path={routes.homepage.path} component={Homepage} />
        <Route component={Homepage} />
      </Switch>
    </BrowserRouter>
  </ApolloProvider>
)

export default App
