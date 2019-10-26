import React, {useReducer, useEffect} from 'react'
import * as ReactDOM from 'react-dom'
import {HashRouter, Link, Route, Switch} from 'react-router-dom'
import {Redirect} from 'react-router'
import {ipcRenderer} from 'electron'


function managerReducer(state, action) {
  switch (action.type) {
    case 'manager/increment-count':
      return {...state, count: state.count + 1}
    default:
      return state
  }
}

function Manager() {
  const [state, dispatch] = useReducer(managerReducer, {count: 0})

  useEffect(() => {
    setTimeout(() => {
      console.log('state', state)
      ipcRenderer.send('sulabug-action', {type: 'add-log', data: state.count})
      dispatch({type: 'manager/increment-count'})
    }, 1000)
  }, [state.count])

  return (
    <div>
      manager <Link to='/browser'>browser</Link>
    </div>
  )
}

function browserReducer(state, action) {
  switch (action.type) {
    case 'add-log':
      return {...state, logs: [...state.logs, action.data]}
    default:
      return state
  }
}

function Browser() {
  const [state, dispatch] = useReducer(browserReducer, {logs: []})
  useEffect(() => {
    ipcRenderer.on('sulabug-action', (e, action) => {
      dispatch(action)
    })
  }, [])

  return (
    <div>
      browser <Link to={`/manager`}>manager</Link>
      <ul>
        {state.logs.map((log, i) => <li key={i}>{log}</li>)}
      </ul>
    </div>
  )
}

function App() {
  return (
    <div>
      <HashRouter>
        <Switch>
          <Redirect exact from='/' to='/manager'/>
          <Route path="/manager" component={Manager}/>
          <Route path="/browser" component={Browser}/>
        </Switch>
      </HashRouter>
    </div>
  )
}


ReactDOM.render(
  <App/>,
  document.getElementById('app'),
)
