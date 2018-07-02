import React from 'react'
import { Router, Route, Switch } from 'react-router'
import createBrowserHistory from 'history/createBrowserHistory'

import BrowsePage from '../../imports/ui/pages/App'

const browserHistory = createBrowserHistory()

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Switch>
      <Route exact path="/" component={BrowsePage}/>
    </Switch>
  </Router>
)
