import React from 'react'
import * as ReactDOM from 'react-dom'
import {HashRouter as Router, Route, Switch} from 'react-router-dom'
import {Redirect} from 'react-router'
import {Provider} from 'react-redux'

import configureStore from './configureStore'
import Browser from './browser'

const store = configureStore()

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Redirect exact from='/' to='/browser'/>
          <Route path="/browser" component={Browser}/>
        </Switch>
      </Router>
    </Provider>
  )
}

ReactDOM.render(
  <App/>,
  document.getElementById('app'),
)
