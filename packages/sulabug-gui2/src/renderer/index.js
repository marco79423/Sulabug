import React from 'react'
import * as ReactDOM from 'react-dom'
import {HashRouter, Route, Switch} from 'react-router-dom'
import {Redirect} from 'react-router'
import {Provider} from 'react-redux'

import configureStore from './configureStore'
import Browser from './browser'

const store = configureStore()

function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <Switch>
          <Redirect exact from='/' to='/manager'/>
          <Route path="/browser" component={Browser}/>
        </Switch>
      </HashRouter>
    </Provider>
  )
}

ReactDOM.render(
  <App/>,
  document.getElementById('app'),
)
