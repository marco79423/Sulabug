import React, {lazy, Suspense} from 'react'
import * as ReactDOM from 'react-dom'
import {HashRouter, Route, Switch} from 'react-router-dom'
import {Redirect} from 'react-router'
import {Provider} from 'react-redux'

import configureStore from './configureStore'

const Manager = lazy(() => import('./manager'))
const Browser = lazy(() => import('./browser'))

const store = configureStore()

function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <Suspense fallback={<div>loading</div>}>
          <Switch>
            <Redirect exact from='/' to='/manager'/>
            <Route path="/manager" component={Manager}/>
            <Route path="/browser" component={Browser}/>
          </Switch>
        </Suspense>
      </HashRouter>
    </Provider>
  )
}

ReactDOM.render(
  <App/>,
  document.getElementById('app'),
)
