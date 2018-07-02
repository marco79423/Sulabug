import React from 'react'
import {Route, Router, Switch} from 'react-router'
import createBrowserHistory from 'history/createBrowserHistory'

import BrowsePage from '../../imports/ui/pages/BrowsePage'
import DownloadPage from '../../imports/ui/pages/DownloadPage'
import SettingsPage from '../../imports/ui/pages/SettingsPage'

const browserHistory = createBrowserHistory()

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Switch>
      <Route exact path="/" component={BrowsePage}/>
      <Route exact path="/download" component={DownloadPage}/>
      <Route exact path="/settings" component={SettingsPage}/>
    </Switch>
  </Router>
)
